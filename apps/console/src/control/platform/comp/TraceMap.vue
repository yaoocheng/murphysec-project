<template>
    <el-dialog class="screen-dialog" @close="emits('update:modelValue', false)"
               :close-on-click-modal="false">
        <template #header>
            <div>
                <div class="flex items-center mb-6">
                    <TagComp class="text-2xl px-2 h-9 font-normal" c="#fff" :bgc="getRepaireLevelTool(curCompInfo?.suggest_level)?.color" :content="getRepaireLevelTool(curCompInfo?.suggest_level).text.slice(0,2)" />
                    <span class="text-2xl ml-2">{{ curCompInfo?.comp_name }}</span>
                </div>
                <div class="rounded-md bg-f7 px-4 py-3 text-sm text-85 font-normal">
                    <span class="mr-6">版本：{{ curCompInfo?.comp_version }}</span>
                    <span>许可证名称：{{ curCompInfo?.license?.[0]?.spdx }}</span>
                </div>
            </div>

        </template>
        <el-tabs class="mt-3" v-model="activeName">
            <el-tab-pane label="溯源图" name="1">
                <div class="trace_content" v-loading="graphLoading">
                    <div class="charts_wrap">
                        <div class="chart_dom"></div>
                    </div>
                    <div class="trace_info" v-if="Object.keys(compInfo).length">
                        <div class="trace_title">
                            组件基本信息
                        </div>
                        <div class="title">
                            {{ compInfo.show_name || compInfo.comp_name || compInfo.module?.name }}
                        </div>
                        <div class="card">
                            <div class="level">
                                <div class="item">
                                    <div>当前组件版本</div>
                                    <div class="info">
                                        {{ compInfo.comp_version }}
                                    </div>
                                </div>
                                <div class="item">
                                    <div>处置建议</div>
                                    <div class="info">
                                        {{ getRepaireLevelTool(compInfo.suggest_level).text }}
                                    </div>
                                </div>
                            </div>

                            <div class="level">
                                <div class="item">
                                    <div>License</div>
                                    <div class="info">
                                        {{ compInfo.license || '暂无' }}
                                    </div>
                                </div>
                                <div class="item">
                                    <div>依赖类型</div>
                                    <div class="info">
                                        <span v-if="compInfo.is_self">自身依赖</span>
                                        <span v-else>
                                            {{ compInfo.is_direct_dependency ? '直接依赖' : '间接依赖' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>

            <el-tab-pane label="溯源依据" name="3">
                <!-- 仅当comp_name存在时渲染 -->
                <div v-if="curCompInfo?.comp_name">
                    <TraceBasis :basisData="basisData" :curCompInfo="curCompInfo" />
                </div>
                <!-- 数据未加载时显示加载状态 -->
                <NoData v-else description="数据加载中..." />
            </el-tab-pane>

            <el-tab-pane label="代码片段" name="2">
                <div style="height: calc(100vh - 300px);" class="overflow-auto">
                    <div class="repair_code g-mb-16" v-for="item in codeFragment?.preview" :key="item.path">
                        <div class="code_head">
                            <div>
                                <!-- <i class="murphy icon-arrow" v-if="isExpand"></i> -->
                                <!-- <i class="murphy icon-arrow" style="transform: rotate(-90deg) scale(0.6);" v-else></i> -->
                                {{ item.path }}
                            </div>
                        </div>
                        <div class="code_content">
                            <div class="level" v-for="ele in item.content" :key="ele.text">
                                <span class="line">
                                    {{ ele.line }}
                                </span>
                                <span class="code_wrap">
                                    <highlightjs autodetect :code="ele.text" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <NoData description="暂无代码片段" v-if="!codeFragment?.preview || !codeFragment?.preview?.length" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script setup lang='ts'>
import {
    nextTick, ref, watch, onUnmounted,
} from 'vue';
import * as echarts from 'echarts';
import NoData from 'comp/NoData.vue';
import { getRepaireLevelTool } from 'util/tools';
import TraceBasis from './TraceBasis.vue';

const emits = defineEmits(['update:modelValue']);
const props = defineProps(['graph', 'codeFragment', 'basisData', 'curCompInfo', 'graphLoading']);

const activeName = ref<string>('1');
const compInfo = ref<any>({});
const chartOptions = ref<any>();
let myChart: any = null;

const openHandle = async () => {
    // 如果已存在实例，先销毁
    if (myChart) {
        myChart.dispose();
    }
    const chartDom = document.getElementsByClassName('chart_dom')[0] as HTMLDivElement;
    myChart = echarts.init(chartDom);
    myChart.setOption(chartOptions.value);

    // 节点点击
    myChart.on('click', (param: any) => {
        compInfo.value = param.data;
    });
};

// 监听graphLoading变化
watch(() => props.graphLoading, (newVal) => {
    if (!newVal) {
        nextTick(() => {
            try {
                const chartDom = document.getElementsByClassName('chart_dom')[0];
                if (chartDom) {
                    chartOptions.value = {
                        series: [
                            {
                                type: 'sankey',
                                data: props.graph?.nodes,
                                links: props.graph?.edge,
                                emphasis: {
                                    focus: 'adjacency',
                                },
                                draggable: true,
                                label: {
                                    formatter: (data: any) => data.data.show_name,
                                },
                                lineStyle: {
                                    color: 'source',
                                    curveness: 0.5,
                                },
                                right: 400,
                            },
                        ],
                    };
                    openHandle();
                }
            } catch (error) {
                console.error('初始化图表失败:', error);
            }
        });
    }
});

// 组件卸载时销毁图表实例
onUnmounted(() => {
    if (myChart) {
        myChart.dispose();
        myChart = null;
    }
});
</script>

<style lang='less' scoped>
.trace_title {
    color: #3c3c3c;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;
}

.trace_content {
    display: flex;
    justify-content: space-between;
    height: calc(100vh - 300px);

    .charts_wrap {
        flex: 3;
        width: 0;
        height: 100%;
        background: #F7F8FB;
        border: 1px solid rgba(54, 67, 128, 0.1);
        border-radius: 6px;
        margin-right: 24px;
    }

    .chart_dom {
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    .trace_info {
        flex: 1;
        width: 0;
    }

    .title {
        color: #3c3c3c;
        font-size: 14px;
        margin-bottom: 6px;
        line-height: 20px;
    }

    .desc {
        font-size: 12px;
        color: #858585;
        line-height: 150%;
        margin-bottom: 8px;
    }

    .card {
        padding: 16px;
        background: #F7F8FB;
        border-radius: 4px;
        font-size: 12px;
        color: #8F959E;
        padding-bottom: 1px;
        margin-bottom: 16px;

        .level {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }

        .level .item {
            width: 120px;
        }

        .level .item:nth-of-type(1) {
            margin-right: 30px;
        }

        .info {
            font-size: 14px;
            color: #3c3c3c;
            margin-top: 6px;

            .tag {
                background: rgba(73, 102, 230, 0.2);
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 12px;
                color: #2946C7;
                margin-right: 4px;
            }
        }
    }
}

.code_head {
    height: 52px;
    color: #3c3c3c;
    background: #fafafa;
    font-size: 12px;
    padding: 0 16px;
    cursor: pointer;
    .between();

    i {
        display: inline-block;
        color: #525252;
        font-size: 12px;
        vertical-align: -1px;
        transform: scale(0.6);
    }
}

.code_content {
    background-color: #eaf7ff;
    margin-bottom: 8px;
}

.level {
    display: flex;
    align-items: center;
    height: 36px;

    .line {
        width: 80px;
        height: 100%;
        text-align: center;
        color: #8F959E;
        // padding-left: 20px;
        line-height: 36px;
        box-sizing: border-box;
    }

    .code_wrap {
        flex: 1;
        width: 0;
        white-space: pre-wrap;
    }
}
</style>

<style lang="less">
.node_style_class {
    &:hover {
        border-color: #6C87FF !important;
        background-color: #6C87FF1A !important;
        color: #6C87FF !important;
    }

    padding: 0 10px !important;
    padding-left: 0 !important;
}

// .trace_map .el-dialog__header {
//     padding-bottom: 16px !important;
// }</style>
