<template>
    <div class="g-flex g-mb-16">
        <SelectComp v-model="searchInfo.level" clearable style="width:200px;" :options="vulnLevelOption"
            placeholder="请选择漏洞级别" />
        <SelectComp v-model="searchInfo.isRepair" clearable style="width:200px;" :options="repairOptions"
            placeholder="请选择是否有修复方案" />
        <el-button @click="resetHandle" class="minor_btn" style="height: 32px;">重置</el-button>
    </div>

    <div class="g-color-3 g-mb-16" v-if="vulnList?.length">
        <span>共 <span class="g-color-1">{{ vulnList?.length || 0 }}</span> 条数据</span>
    </div>

    <div class="vuln_item" v-for="item in vulnList" :key="item"
        :style="{ borderColor: getDangerLevel(item?.full_vuln_data?.level).color }">
        <div @click="item.expand = !item.expand" class="top-item g-flex g-justify-between g-align-center">
            <div>
                <!-- <el-tooltip :content="item?.full_vuln_data?.title" placement="top"> -->
                <span class="vuln_title">
                    <a class="g-color-1 hover_text" target="_blank" @click.stop
                        :href="generateVulnLink(item?.full_vuln_data?.mps_id, item?.full_vuln_data?.cve_id)">{{
            item?.full_vuln_data?.title }}</a>
                </span>
                <!-- </el-tooltip> -->
                <span class="tag" v-if="item?.full_vuln_data?.cve_id || item?.full_vuln_data?.mps_id">{{
            item?.full_vuln_data?.cve_id || item?.full_vuln_data?.mps_id || '-' }}</span>
            </div>
            <div v-if="item.solutions?.length" class="item g-f-14 expand">
                修复方案
                <ExpandIcon :type="'t'" :expand="item.expand" />
            </div>

            <div class="g-f-14" style="color: #C7C7C7;" v-else>
                暂无修复方案
                <el-tooltip placement="top">
                    <template #content>
                        <div style="max-width: 264px;">
                            漏洞暂无修复方案，可能是所涉及的组件或软件长时间未维护等原因引起的，请持续关注该组件官方仓库以便获取新发布的安全更新
                        </div>
                    </template>
                    <i class="murphy icon-wenhaoxiao g-color-3 g-f-14"></i>
                </el-tooltip>
            </div>
        </div>

        <div class="expand-content" v-if="item.expand && item.solutions?.length">
            <div class="repair-wrap" v-for="(ele, i) in item.solutions" :key="ele">
                <div class="top">
                    <div>修复方案 {{ i + 1 }}
                        <span class="tag">{{ ele?.type }}</span>
                    </div>
                    <div class="update" v-if="ele?.last_update_time">
                        <el-tooltip placement="top">
                            <template #content>
                                <div style="max-width: 264px;">
                                    <div>此修复建议由墨菲安全专家团队人工维护，信息来源包括官方安全公告和技术文档，以及对漏洞产生原理的深入分析。</div>
                                    <div>更新时间：{{ ele?.last_update_time ? formatDate(ele?.last_update_time) : '-' }}
                                    </div>
                                </div>
                            </template>
                            <img src="~ast/img/murphy-repair.png" alt="">
                        </el-tooltip>
                    </div>
                </div>

                <div class="content">
                    <div class="content-title" v-if="ele?.content">{{ ele?.content ? ele?.description : '-' }}
                    </div>

                    <v-md-preview v-if="ele?.content" :text="ele?.content"></v-md-preview>
                    <!-- <div class="markdown" v-if="ele?.content" v-html="markeds.parse(ele?.content)"></div> -->
                    <div class="markdown" v-else>{{ ele?.description }}</div>

                    <div class="g-mt-16" v-if="ele?.reference_urls?.length">
                        <div class="g-mb-8 g-fw-500">参考链接</div>
                        <div class="g-mb-8" v-for="a in ele?.reference_urls" :key="a">
                            <a :href="a?.url" class="hover_text" target="_blank">{{ a?.url }}</a>
                            <span class="tag" v-for="q in a.tags?.filter((e: any) => e === '官方')" :key="q">{{ q }}</span>
                            <!-- <span class="tag">官方</span>
                            <span class="tag" style="background: #85858533;color: #525252CC;">非官方</span> -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- <div class="repair-wrap">
                <div class="top">
                    <div>修复方案 <img src="~ast/img/murphy-repair.png" alt=""></div>
                    <div class="update">更新时间：-</div>
                </div>

                <div class="content">
                    <div class="content-title">-
                        <span class="tag">移除缺陷类</span>
                    </div>

                    <div class="markdown">
                        配置safeMode，开启方法：https：//github。com/alibaba/fastison/wiki/fastson safemode。这可能会有兼容问题，请充分评估对业务影响后开启。
                    </div>
                </div>
            </div> -->
        </div>

        <!-- <NoData description="暂无修复方案" v-if="!item.solutions&&item.expand" /> -->
    </div>

    <NoData v-if="!vulnList?.length" />
</template>

<script setup lang='ts'>
import NoData from 'comp/NoData.vue';
import { generateVulnLink, formatDate, getDangerLevel } from 'util/tools';
import { ref, onBeforeMount, watch } from 'vue';
import SelectComp from '@/components/SelectComp.vue';
import ExpandIcon from '@/components/ExpandIcon.vue';
import { vulnLevelOption } from '../../project/constants/constants';

const { vulnRepairList } = defineProps(['vulnRepairList']);

const vulnList = ref<any[]>(vulnRepairList);
const initList = ref<any[]>(vulnRepairList);

const searchInfo = ref({
    level: '',
    isRepair: '',
});
const repairOptions = [
    {
        label: '是',
        value: '1',
    },
    {
        label: '否',
        value: '0',
    },
];

const sortHandle = (list: any[]) => {
    let newPlan = list.filter((a) => a?.solutions?.length && a?.solutions?.some((n: any) => n.content));
    let oldPlan = list.filter((a) => a?.solutions?.length && a?.solutions?.every((n: any) => !n.content));
    let noPlan = list.filter((a) => !a?.solutions?.length);

    const sortLevel = (lists: any[]) => {
        const cri = lists.filter((a) => a.full_vuln_data?.level === 'Critical');
        const high = lists.filter((a) => a.full_vuln_data?.level === 'High');
        const med = lists.filter((a) => a.full_vuln_data?.level === 'Medium');
        const low = lists.filter((a) => a.full_vuln_data?.level === 'Low');
        return [...cri, ...high, ...med, ...low];
    };

    newPlan = sortLevel(newPlan);
    oldPlan = sortLevel(oldPlan);
    noPlan = sortLevel(noPlan);
    return [...newPlan, ...oldPlan, ...noPlan];
};

onBeforeMount(() => {
    vulnList.value.forEach((item) => {
        item.expand = false;
        if (item.solutions?.some((ele: any) => ele.content)) {
            item.solutions = item.solutions.filter((a: any) => a.content);
        }
    });
    vulnList.value = sortHandle(vulnList.value);
});

watch(searchInfo.value, (newVal: any) => {
    let filterdata: Array<any> = initList.value;

    if (newVal.level) {
        filterdata = filterdata.filter((item: any) => item?.full_vuln_data?.level === newVal.level);
    }

    if (newVal.isRepair === '0') {
        filterdata = filterdata.filter((item: any) => !item.solutions?.length);
    }

    if (newVal.isRepair === '1') {
        filterdata = filterdata.filter((item: any) => item.solutions?.length);
    }

    vulnList.value = sortHandle(filterdata);
});

const resetHandle = () => {
    Object.assign(searchInfo.value, {
        level: '',
        isRepair: '',
    });
};
</script>

<style scoped lang='less'>
.vuln_item {
    // height: 56px;
    background-color: #fff;
    border-left: 4px solid #F34D3D;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #3c3c3c;

    // padding: 0 16px;
    .top-item {
        height: 56px;
        padding: 0 16px;
        .between();

        .tag {
            transform: scale(1);
            margin-left: 8px;
            font-weight: 400;
        }
    }

    .expand {
        &:hover {
            color: @primary;
        }

        cursor: pointer;
    }

    .expand-content {
        border-top: 1px solid #EFF0F1;
        background-color: #fff;
        padding: 24px;
    }
}

.repair-wrap {
    border: 1px solid #EBEBEB;
    border-radius: 6px;
    margin-bottom: 24px;

    .top {
        padding: 16px 24px;
        background-color: #F7F8FB;
        .between();

        img {
            vertical-align: -5px;
            margin-left: 4px;
            width: 114px;
        }

        .update {
            color: #858585;
        }
    }

    .content {
        padding: 24px;

        .content-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 12px;

            .tag {
                transform: scale(1);
                font-weight: 400;
            }
        }

        a {
            color: #3c3c3c;
        }

        .markdown {
            // border: 1px solid #C7C7C7CC;
            border-radius: 6px;
            // padding: 24px;
            // margin-bottom: 16px;
        }
    }
}
</style>

<style>
.markdown pre {
    background-color: #EBEBEB4D;
    padding: 1em;
    border-radius: 6px;
    border: 1px solid #C7C7C7;
    margin-top: 12px;
    box-sizing: border-box;
    overflow: auto
}
</style>
