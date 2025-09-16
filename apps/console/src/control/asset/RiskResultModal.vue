<template>
    <el-dialog class="screen-dialog" width="100%">
        <div class="asset-result">
            <div class="g-flex g-justify-between g-mb-32">
                <div>
                    <div class="g-mb-8 g-f-24 g-color-1 g-fw-500">{{ taskInfo.name }}</div>
                    <div class="g-f-12 g-fw-400 g-color-3">创建时间：{{ formatDate(taskInfo.createTime) }}</div>
                </div>

                <div class="g-color-1 g-f-14 g-cursor-pointer">
                    <el-tooltip v-if="!isAllQueryData" placement="bottom-end" effect="light"
                                popper-class="user_tooltip">
                        <template #content>
                            <div class="g-p-24 g-f-14 g-color-1" style="width: 372px;">
                                <div class="g-mb-16">
                                    <div class="inquire-title">项目名称/漏洞编号</div>
                                    <div>{{ queryInput.vul_id || '全部' }}</div>
                                </div>
                                <div class="g-flex g-justify-between g-mb-16">
                                    <div>
                                        <div class="inquire-title">生态-仓库类型</div>
                                        <div>{{ queryInput.language || '全部' }}</div>
                                    </div>
                                    <div style="width: 174px;">
                                        <div class="inquire-title">处置等级</div>
                                        <div>{{ queryInput.suggest ? getRepaireLevelTool(queryInput.suggest).text : '全部'
                                        }}</div>
                                    </div>
                                </div>
                                <div class="g-flex g-justify-between g-mb-16">
                                    <div>
                                        <div class="inquire-title">漏洞级别</div>
                                        <div>{{ queryInput.level ? getDangerLevel(queryInput.level).text : '全部' }}</div>
                                    </div>
                                    <div style="width: 174px;">
                                        <div class="inquire-title">漏洞标签</div>
                                        <div v-if="queryInput.query_vuln_tag?.length">
                                            <span v-for="item in queryInput.query_vuln_tag" :key="item">
                                                {{ vulnTags.find(ele => ele.value === item)?.label }}
                                            </span>
                                        </div>
                                        <div v-else>
                                            全部
                                        </div>
                                    </div>
                                </div>
                                <div class="g-flex g-justify-between">
                                    <div>
                                        <div class="inquire-title">可触发漏洞</div>
                                        <div v-if="queryInput.is_triggers === 1">是</div>
                                        <div v-else-if="queryInput.is_triggers === 0">否</div>
                                        <div v-else>全部</div>
                                    </div>
                                    <div style="width: 174px;">
                                        <div class="inquire-title">线上依赖</div>
                                        <div v-if="queryInput.is_online === 1">是</div>
                                        <div v-else-if="queryInput.is_online === 0">否</div>
                                        <div v-else>全部</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <span class="hover_icon">
                            <i class="murphy icon-lujing2 g-f-14"></i>
                            查询条件
                        </span>
                    </el-tooltip>

                    <el-tooltip v-else placement="bottom" popper-class="user_tooltip" effect="light">
                        <template #content>
                            <div class="g-p-24 g-f-14 g-color-1">
                                全部数据
                            </div>
                        </template>
                        <span class="hover_icon">
                            <i class="murphy icon-lujing2 g-f-14"></i>
                            查询条件
                        </span>
                    </el-tooltip>
                </div>
            </div>

            <div  class="g-mb-12 g-flex g-justify-between g-align-center">
                <div class="g-f-16 g-fw-500 g-color-1">查询结果</div>
                <el-button v-if="total" @click="exportHandle" style="width: 80px;">导出全部</el-button>
            </div>

            <div v-if="total" class="g-color-3 g-fw-400 g-f-14 g-mb-16">
                <span>
                    共有 <span class="g-color-1">{{ totalProject }}</span> 条数据符合查询条件，涉及 <span class="g-color-1">{{
                        projectNum
                    }}</span> 个项目（列表最多展示1w数据，可导出查看全部数据）
                </span>
            </div>

            <div class="table_wrap">
                <div class="item" v-for="(item, key) in listData" :key="key"
                     :style="{ borderColor: getDangerLevel(item.level).color }">
                    <div class="top">
                        <div class="part_info g-mr-4">
                            漏洞
                            <span class="info">{{ item.title }}</span>
                        </div>
                        <div>
                            <TagComp v-if="item.is_poc === 1" c="#049FD7" bgc="#14C0FF33" class="g-mr-4" content="POC" />
                            <TagComp v-if="item.is_sole === 1"  class="g-mr-4" content="独家" />

                            <TagComp v-if="item.is_rec === 1"  class="g-mr-4" content="REC" />
                            <TagComp v-if="item.is_poison"  class="g-mr-4" content="投毒" />
                        </div>

                        <div class="part_info" style="margin-left: 16px">
                            漏洞编号
                            <span class="info">
                                <a target="_blank" :href="generateVulnLink(item.mps_id, item.cve_id)">
                                    {{ item.cve_id || item.mps_id }}
                                </a>
                            </span>
                        </div>
                        <div class="part_info" v-if="store.isAllTeam" style="margin-left: 16px">
                            所属团队
                            <span class="g-color-1">
                                {{ item.team_name }}
                            </span>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="part_info">
                            项目名称
                            <img class="g-ml-4" :src="getAccessImg(item.access_type)" alt="">
                            <el-tooltip placement="top" :content="item.project_name">
                                <span v-if="item.project_id"
                                      @click="$router.push(`/detail/${item.project_id}/${item.subtask_id}`)"
                                      class="info hover_text" style="max-width: 200px;">
                                    {{ item.project_name }}
                                </span>
                                <span v-else class="info" style="max-width: 200px;">
                                    {{ item.project_name }}
                                </span>
                            </el-tooltip>
                        </div>
                        <div class="part_info">
                            分支
                            <span class="info">{{ item.branch || '-' }}</span>
                        </div>
                        <div class="part_info">
                            组件名称
                            <el-tooltip placement="top" :content="item.asset_name">
                                <span class="info text-3c link_text" @click="compJump({name: item?.asset_name,version: item?.asset_version, ecosystem: item?.ecosystem, repository: item?.repository})" style="max-width: 200px;">{{ item.asset_name }}</span>
                            </el-tooltip>
                        </div>

                        <div class="comp-tag g-ml-8 g-flex g-align-center">
                            <TagComp class="g-mr-4" :content="getRepaireLevelTool(item.suggest).text" :c="getRepaireLevelTool(item.suggest).color" :bgc="getRepaireLevelTool(item.suggest).bgc" />

                            <el-tooltip v-if="item.is_triggers === 1" effect="light" placement="top">
                                <TagComp class="g-mr-4" content="可触发漏洞"/>

                                <template #content>
                                    <div style="color: #2A2B32;">
                                        什么是可触发漏洞？<a href="/docs/glossary/vulnerability-reachability.html"
                                                    target="_blank">详情</a>
                                    </div>
                                </template>
                            </el-tooltip>

                            <el-tooltip v-if="item.is_online === 1" effect="light" placement="top">
                                <TagComp class="g-mr-4" content="线上依赖" />

                                <template #content>
                                    <div style="color: #2A2B32;">
                                        什么是线上依赖？<a href="/docs/glossary/production-dependencies.html"
                                                   target="_blank">详情</a>
                                    </div>
                                </template>
                            </el-tooltip>

                            <TagComp v-if="item.ecosystem" class="g-mr-4" :content="item.ecosystem" />

                        </div>

                        <div class="part_info" style="">
                            版本
                            <span class="info">{{ item.asset_version }}</span>
                            <el-tooltip placement="top" v-if="item.the_chosen_version&&item.asset_version">
                                <template #content>
                                    <div style="max-width: 344px;">
                                        此版本为推测值，由于检测时获取到的特征有限，识别可能存在偏差，暂时无法提供精确版本。
                                    </div>
                                </template>
                                <span class="hover_icon g-ml-4" style="padding:4px 6px">
                                    <i class="murphy icon-wenhaoxiao g-f-14 g-color-1"></i>
                                </span>
                            </el-tooltip>
                        </div>
                    </div>
                </div>

                <NoData style="margin-top: 56px;" v-if="!total" />

                <!-- 分页 -->
                <div class="pagination g-mt-24" v-if="total > 0">
                    <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                                   layout="total, prev, pager, next" :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>

    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount, watch } from 'vue';
import {
    getRepaireLevelTool, getAccessImg, showMessage, getDangerLevel, formatDate,
} from 'util/tools';
import store from 'util/store';
import {
    getRiskTaskInfoApi, exportRiskTaskApi, getRiskQueryListApi,
} from 'api/asset';
import NoData from 'comp/NoData.vue';
import { compJump } from '@/utils/hook';
import { vulnTags } from './constants';

const { id } = defineProps(['id', 'taskInfo']);

const listData = ref<any[]>([]);
const cacheData = ref([]);
const projectNum = ref(0);
const curPage = ref(1);
const total = ref(0);
const queryInput = ref();
const isAllQueryData = ref(true);
const totalProject = ref(0);

onBeforeMount(async () => {
    try {
        const { data } = await getRiskTaskInfoApi({ id });
        // cacheData.value = data.list || [];
        // listData.value = data.list?.slice(0, 20) || [];
        // total.value = data.list?.length;
        totalProject.value = data.total;
        projectNum.value = data.project_num;

        queryInput.value = JSON.parse(data.query_input?.input_string);

        const query = queryInput.value;
        isAllQueryData.value = !query.vul_id && !query.language && query.suggest === undefined && query.level === undefined && query.is_triggers === undefined
            && query.is_online === undefined && !query.query_vuln_tag?.length;
    } catch (error) {
        console.log(error);
    }

    try {
        const { data } = await getRiskQueryListApi({
            id,
        });
        total.value = data.total;
        cacheData.value = data.list || [];
        listData.value = data.list?.slice(0, 20) || [];
    } catch (error) {
        console.log(error);
    }
});

watch(curPage, (val: number) => {
    listData.value = cacheData.value.slice((val - 1) * 20, val * 20);
});

// 导出
const exportHandle = async () => {
    await exportRiskTaskApi({ id });
    showMessage('正在导出中，请在导出管理查看', 'success');
};

// 生成漏洞链接 xxx.com/hd/MPS-xxx-xxx
const generateVulnLink = (mpsId: any, cveId: any) => {
    const baseUrl = window.location.origin;
    // eslint-disable-next-line no-shadow
    const id = mpsId || cveId;
    return `${baseUrl}/hd/${id}`;
};

</script>

<style scoped lang='less'>
.asset-result {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    padding-top: 0;
    padding-bottom: 0;
    box-sizing: border-box;

    .table_wrap {
        background-color: #fff;
        border-radius: 6px;
        overflow: auto;
        flex: 1;

        .project_name {
            &:hover {
                color: #6C87FF;
                text-decoration: underline;
            }

            color: #3c3c3c;
            padding: 10px 0;
            cursor: pointer;
        }
    }

    .export {
        width: 80px;
        color: #fff;
    }

    background: #FFFFFF;
    border-radius: 6px;
    font-size: 14px;

    .item {
        height: 92px;
        padding: 16px;
        padding-left: 0;
        box-sizing: border-box;
        background-color: #F7F8FB;
        margin-bottom: 8px;
        border-radius: 4px;
        border-left: 4px solid transparent;

        img {
            width: 20px;
            border-radius: 50%;
            vertical-align: -5px;
            margin-right: 3px;
        }

        .tag {
            padding: 3px 6px;
            background: #34C72433;
            border-radius: 4px;
            display: inline-block;
            font-size: 12px;
            color: #2EA121;
            font-weight: 500;
            transform: scale(0.8);

            i {
                font-size: 12px;
                margin-right: 5px;
            }
        }

        .info {
            color: @text-color;
            // font-weight: 500;
            display: inline-block;
            vertical-align: -3px;
            max-width: 500px;
            .ellipsis();
        }

        .top,
        .bottom {
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            color: #8F959E;
        }

        .comp-tag .tag {
            margin-left: -8px;
        }

        .part_info {
            margin-left: 16px;

            .info {
                margin-left: 4px
            }

            .center();

            a {
                color: @text-color;
            }

            a:hover {
                color: #6c87ff;
                text-decoration: underline;
            }
        }
    }
}

.inquire-title {
    font-weight: 500;
    font-size: 14px;
    color: #8F959E;
    margin-bottom: 4px
}
</style>
