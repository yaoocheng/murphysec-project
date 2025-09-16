<template>
    <div v-if="vulnOptions.length && streamData.length">
        <el-select @change="selectVuln" class="g-w-100 g-mb-16" v-model="vulnValue" size="large">
            <el-option v-for="item in vulnOptions" :key="item.title" :label="item.title" :value="item.mps_id">
                <div class="g-color-1 g-f-14 g-flex g-align-center">
                    <span class="g-mr-4">{{ item.title }}</span>
                    <span v-if="item.level" class="tag option-tag"
                          :style="{ borderColor: getDangerLevel(item.level).color, color: getDangerLevel(item.level).color }">{{
                              getDangerLevel(item.level).text }}</span>
                    <span v-if="item.cve_id" class="tag option-tag" style="color: #6C87FF">{{ item.cve_id }}</span>
                    <span v-if="item.mps_id" class="tag option-tag" style="color: #6C87FF">{{ item.mps_id }}</span>
                </div>
            </el-option>
        </el-select>

        <div class="g-bg-f7 g-bdr-6 g-flex g-justify-between" style="padding-bottom: 30px;">
            <div class="g-p-16 g-bg-ff g-bdr-6 g-mr-6 g-border-box" style="padding-bottom: 0;width: 280px;height: 72vh;">
                <div class="g-color-3 g-mb-24 g-flex g-align-center">
                    <i class="murphy icon-source g-f-22"></i>
                    <span class="g-f-14 g-fw-500 g-color-1 g-ml-8 g-mr-8">漏洞数据流</span>
                    <el-tooltip placement="top" :width="344" content="表示从程序外部输入到漏洞缺陷方法调用的路径">
                        <i class="murphy icon-wenhaoxiao"></i>
                    </el-tooltip>
                    <span class="g-color-3 g-ml-16 g-cursor-pointer">
                        <i class="murphy icon-youjiantou11-copy g-f-18"
                           @click="streamNum = streamNum === 1 ? 1 : --streamNum;"></i>
                        <span class="g-vertical-2 g-ml-8 g-mr-8"><span class="g-color-1">{{ streamNum }}</span> / {{
                            streamData?.length }}</span>
                        <i class="murphy icon-youjiantou11 g-f-18"
                           @click="streamNum = streamNum === streamData?.length ? streamData?.length : ++streamNum;"></i>
                    </span>
                </div>

                <div class="g-overflow-auto g-pt-8" style="height: 90%;">
                    <el-timeline v-for="(item, i) in streamData[streamNum - 1]?.file_stream" :key="i">
                        <el-timeline-item>
                            <template #dot>
                                <i class="murphy icon-arrow g-color-3"></i>
                            </template>
                            <div class="g-f-14 g-color-1 g-pt-2">
                                <img style="width: 20px" class="g-vertical--4" :src="getFileImg(item?.file_name)" alt="">
                                {{ item?.file_name }}
                            </div>
                        </el-timeline-item>

                        <el-timeline-item v-for="(e, v) in item?.code_list" :key="v">
                            <template #dot>
                                <i class="murphy icon-xiala1 dot-drop"></i>
                            </template>
                            <div class="path g-flex g-align-center" @click="addTab(e); activeCodeFragment = e.id"
                                 :class="{ 'active-path': activeCodeFragment === e.id }">
                                <el-popover placement="top" :width="344" effect="dark" :content="e.code">
                                    <template #reference>
                                        <span class="g-display-inline-block ellipsis" style="width: 130px;">{{ e.code
                                        }}</span>
                                    </template>
                                </el-popover>
                                <span class="tag g-mr-4" v-if="e.is_sink">触发点</span>
                                <span class="tag" v-if="e.is_source">污点</span>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>

            <div class="right-content g-flex-grow-1 g-w-0">
                <el-tabs v-model="activeRightContent" class="right-content-tabs">
                    <el-tab-pane label="代码展示" name="1">
                        <el-tabs v-if="editableTabs.length" class="code-tabs" v-model="activeCodeTab" type="card" closable
                                 @tab-click="tabChange" @tab-remove="removeTab">
                            <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title"
                                         :name="item.name">
                                <template #label>
                                    <span class="custom-tabs-label">
                                        {{ item.title }}
                                    </span>
                                </template>
                                <div class="g-pt-8 g-pb-8 g-pl-16" style="background-color: rgb(250, 250, 250);">
                                    {{ item.filePath }}
                                </div>
                                <div class="code-content g-bg-ff g-f-14 g-border-box g-w-100"
                                     :class="`code-content-${item.name}`" style="height: 53vh;">
                                    <div class="g-flex g-align-center g-w-100" :class="`code-line-${i + 1}`"
                                         :style="{ background: dangerCodeLine === i + 1 ? '#ff000059' : '#fafafa' }"
                                         v-for="(ele, i) in showCode" :key="ele + i">
                                        <span style="width: 50px;" class="g-pl-16">{{ i + 1 }}</span>
                                        <highlightjs class="g-w-100" autodetect :code="ele" />
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                        <NoData description="点击左侧代码片段查看源代码" v-else />
                    </el-tab-pane>

                    <el-tab-pane label="漏洞验证" name="2">
                        <div style="height: 60vh;" class="g-overflow-auto">
                            <div class="g-f-14 g-fw-500 g-color-1 g-mb-8">
                                请求路由
                            </div>
                            <div class="g-flex vertify-table" v-if="streamData[streamNum - 1]?.vul_verify?.Method">
                                <div class="front">
                                    <span :class="item" v-for="(item, i) in streamData[streamNum - 1]?.vul_verify?.Method.split(',')" :key="item">{{ item }}<span v-if="i!==streamData[streamNum - 1]?.vul_verify?.Method.split(',').length-1" class="g-color-1 g-mr-4 g-ml-4">/</span></span>
                                </div>
                                <div class="behind">{{ streamData[streamNum - 1]?.vul_verify?.path }}</div>
                            </div>
                            <div v-else class="vertify-table g-color-3" style="padding: 8px 16px;background-color: #ebebeb80;">
                                暂无
                            </div>

                            <div class="g-f-14 g-fw-500 g-color-1 g-mb-8">
                                请求参数
                            </div>
                            <div class="vertify-table">
                                <div class="g-flex">
                                    <div class="front g-flex-grow-1" style="border-right:1px solid #EBEBEB">参数名</div>
                                    <div class="front g-flex-grow-1">类型</div>
                                </div>
                                <div class="g-flex" v-for="item in streamData[streamNum - 1]?.vul_verify?.params"
                                     :key="item.name">
                                    <div class="behind" style="border-right:1px solid #EBEBEB">{{ item.name }}</div>
                                    <div class="behind">{{ item.type }}</div>
                                </div>
                                <div v-if="!streamData[streamNum - 1]?.vul_verify?.params?.length" class="g-flex">
                                    <div class="behind">
                                        暂无
                                    </div>
                                    <div class="behind">
                                        暂无
                                    </div>
                                </div>
                            </div>

                            <div v-if="streamData[streamNum - 1]?.poc_url?.length">
                                <div class="g-f-14 g-fw-500 g-color-1 g-mb-8">
                                    漏洞验证POC
                                </div>
                                <!-- <div class="g-flex" style="border-bottom:1px solid #EBEBEB">
                            <div class="front">POC</div>
                            <div class="behind">1 or sleep(5)#1 or sleep(5)#</div>
                        </div>
                        <div class="g-flex">
                            <div class="front">验证方式</div>
                            <div class="behind">数据包返回延时5s数据包返回延时5s</div>
                        </div> -->
                                <div class="g-mb-8" v-for="item in streamData[streamNum - 1]?.poc_url" :key="item">
                                    <a :href="item" class="hover_text g-color-1" target="_blank">{{ item }}</a>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>

    <NoData v-else />
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import { getDangerLevel } from 'util/tools';
import { getRealUseVulnApi, getStreamDataApi } from 'api/asset';
import { getFileImg } from '@/constants/file-icon';
import NoData from '@/components/NoData.vue';
import useVulnStreamHook from '../composable/vuln-stream';

const props = defineProps(['info']);
const vulnValue = ref<any>('');
// eslint-disable-next-line no-undef
const vulnOptions = ref<realUseVulnType>([]);

const reqData = {
    comp_name: props.info.comp_name,
    comp_version: props.info.comp_version,
    ecosystem: props.info.ecosystem,
    repository: props.info.comp_info?.repository,
    subtask_id: props.info?.subtask?.id,
    project_id: props.info?.subtask?.project_id,

};

onBeforeMount(async () => {
    const { data } = await getRealUseVulnApi(reqData);
    vulnOptions.value = data || [];

    if (vulnOptions.value.length > 0) {
        vulnValue.value = vulnOptions.value[0]?.mps_id;
        // eslint-disable-next-line no-use-before-define
        selectVuln(vulnOptions.value[0]?.mps_id);
    }
});

const {
    activeCodeFragment, activeCodeTab, editableTabs, showCode, dangerCodeLine, activeRightContent, streamData, streamNum, tabChange, removeTab, addTab,
} = useVulnStreamHook(props.info?.subtask?.id, props.info?.subtask?.project_id);

const selectVuln = async (mpsId: string) => {
    editableTabs.value = [];
    activeCodeFragment.value = '';
    streamNum.value = 1;

    const { data } = await getStreamDataApi({
        ...reqData,
        mps_id: mpsId,
    });

    const stream = data.data_streams || [];
    stream.forEach((e1: any, i1: number) => {
        e1.file_stream.forEach((e2: any, i2: number) => {
            e2.code_list.forEach((e3: any, i3: number) => {
                e3.id = `${i1}-${i2}-${i3}`;
                e3.pid = `${i1}-${i2}`;
                e3.file_path = e2.file_path;
                e3.file_name = e2.file_name;
            });
        });
    });
    streamData.value = stream;
};
</script>

<style scoped lang='less'>
.option-tag {
    background-color: #fff !important;
    border: 1px solid #6C87FF;
    height: 18px;
    line-height: 18px;
    transform: scale(.8);
}

:deep(.el-timeline) {
    .el-timeline-item {
        padding-bottom: 0;
    }

    .el-timeline-item__wrapper {
        top: -10px;
    }

    .el-timeline-item__tail {
        border-left-width: 1px;
    }
}

.vertify-table {
    border-radius: 4px;
    border: 1px solid #EBEBEB;
    margin-bottom: 16px;

    .front {
        // width: 86px;
        padding: 8px 16px;
        background: #ebebeb80;
    }

    .GET {
        color: #38C728;
    }

    .POST {
        color: #FF9940;
    }

    .DELETE {
        color: #F34D3D;
    }

    .PUT {
        color: #387EFF;
    }

    .behind {
        padding: 8px 16px;
        flex: 1;
        width: 0;
    }
}

.dot-drop {
    position: relative;
    left: -3px;
    top: -13px;
    color: #c7c9cf;
    transform: translateX(-3%) scale(.6);
}

.tag {
    font-size: 12px;
    border-radius: 4px;
    padding: 3px 5px;
    background-color: rgba(245, 74, 69, 0.20);
    color: #D83931;
}

.icon-arrow {
    font-size: 12px;
    transform: scale(.8);
    position: relative;
    left: -4px;
    top: -3px;
}

.path {
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
}

.path:hover,
.active-path {
    background-color: #6C87FF1A;
    color: #6C87FF;
}

.code-content {
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    overflow: auto;
    background-color: #fafafa;
}
</style>

<style lang="less">
.code-content pre code.hljs {
    padding: 4px 16px;
    background-color: transparent;
    overflow: visible;
}

.right-content .el-tabs.right-content-tabs {
    .el-tabs__item {
        font-size: 12px;
    }

    .el-tabs__header {
        background-color: #fff;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        padding: 0 16px;
        padding-top: 8px;
    }

    .el-tabs__content {
        padding: 0;
        height: 66vh;
        background-color: #fff;
        padding: 16px;
        box-sizing: border-box;
        border-bottom-right-radius: 6px;
        border-bottom-left-radius: 6px;
    }

    .custom-tabs-label {
        display: inline-block;
        width: 140px;
        .ellipsis();
    }
}

.right-content .el-tabs.code-tabs {
    .el-tabs__item {
        font-size: 14px;
        height: 32px;
    }

    .el-tabs__item.is-active {
        background-color: #fff;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .el-tabs__header {
        background-color: #EBEBEB;
        height: auto;
        margin-bottom: 0;
        padding: 0;
        padding-top: 8px;
        border-top-right-radius: 6px;
        border-top-left-radius: 6px;

        .el-tabs__nav {
            border: none;
        }
    }

    .el-tabs__content {
        padding: 0;
        border-bottom-right-radius: 6px;
        border-bottom-left-radius: 6px;
    }

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
        line-height: 36px;
    }

    // .el-tabs--border-card {
    //     border: none;
    // }
}
</style>
