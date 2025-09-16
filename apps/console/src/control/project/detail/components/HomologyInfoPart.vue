<template>
    <div class="g-mb-16 g-bg-ff g-p-16 g-bdr-6">
        <div class="g-fw-500 g-f-20 g-color-1 g-mb-16">同源性分析</div>
        <div class="g-bg-f7 g-p-24 g-bdr-6 g-flex">
            <div class="g-flex-grow-1 g-mr-24">
                <div class="g-fw-500 g-color-3 g-mb-16">代码同源性分析</div>
                <div style="width: 100%;padding-bottom: 0;" class="g-p-24 g-bdr-6 g-bg-ff g-border-box">
                    <div class="g-f-14 g-color-1">
                        <!-- <span class="g-mr-16">
                            <i class="murphy icon-icon-code g-color-5 g-mr-4"></i>
                            相似代码片段 {{ info?.autonomous_statistics?.similar_block_num }}
                        </span>
                        <span class="g-mr-16">
                            <i class="murphy icon-icon-trance g-color-5 g-mr-4 g-vertical--1"></i>
                            溯源文件 {{ info?.autonomous_statistics?.target_file_num }}
                        </span> -->
                        <span class="g-mr-16 g-display-inline-block g-mt-8">
                            <i class="murphy icon-Vector3 g-color-5 g-mr-4"></i>
                            匹配开源项目 {{ info?.autonomous_statistics?.project_count }}
                        </span>
                        <!-- <span class="g-mr-16 g-display-inline-block g-mt-8">
                            <i class="murphy icon-icon-code g-color-5 g-mr-4"></i>
                            代码自主率 {{  codePercent  }}%
                        </span> -->
                    </div>
                    <div style="height: 100%;width: 100%;position: relative;">
                        <div class="homology-pie-chart" style="height: 284px;"></div>
                        <div class="progress h-1/2">
                            <SuggestProgress :text="'文件精准匹配'" :color="`#6C87FF`"
                                :total="info?.autonomous_statistics?.total_files"
                                :num="info?.autonomous_statistics?.total_hashed_files" />
                            <SuggestProgress :text="'代码片段匹配'" :color="`#64C4C9`"
                                :total="info?.autonomous_statistics?.total_files"
                                :num="info?.autonomous_statistics?.total_fragmented_files" />
                            <!-- <SuggestProgress :text="'未匹配'" :color="`#FFCC33`"
                                :total="info?.autonomous_statistics?.total_files"
                                :num="info?.autonomous_statistics?.total_files - info?.autonomous_statistics?.total_hashed_files - info?.autonomous_statistics?.total_fragmented_files" /> -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="g-flex-grow-1">
                <div class="g-fw-500 g-color-3 g-mb-16">二进制文件同源性分析</div>
                <div style="width: 100%;" class="g-p-24 g-bdr-6 g-bg-ff g-border-box">
                    <div class="binary-bar-chart" style="height: 284px;"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue';
import { createPieChart, createHorizontalBarOptions, renderChart } from 'util/chart';
import SuggestProgress from '@/control/platform/comp/SuggestProgress.vue';

const props = defineProps<{
    // eslint-disable-next-line no-undef
    info: OverviewData
}>();
// const codePercent = ref();

const defaultPieOptions = createPieChart();
const binaryBarOptions = createHorizontalBarOptions();

onMounted(() => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const total = props.info?.autonomous_statistics?.total_hashed_files + props.info?.autonomous_statistics?.total_fragmented_files;
    defaultPieOptions.color = total ? ['#6C87FF', '#64C4C9', '#FFCC33'] : ['#EBEBEB80'];
    defaultPieOptions.series[0].data = [
        { value: props.info?.autonomous_statistics?.total_hashed_files, name: '文件精准匹配' },
        { value: props.info?.autonomous_statistics?.total_fragmented_files, name: '代码片段匹配' },
        // eslint-disable-next-line no-unsafe-optional-chaining
        // { value: props.info?.autonomous_statistics?.total_files - props.info?.autonomous_statistics?.total_hashed_files - props.info?.autonomous_statistics?.total_fragmented_files, name: '未匹配' },
    ];

    // eslint-disable-next-line no-unsafe-optional-chaining
    // codePercent.value = props.info?.autonomous_statistics?.total_files ? (((props.info?.autonomous_statistics?.total_files - props.info?.autonomous_statistics?.total_hashed_files - props.info?.autonomous_statistics?.total_fragmented_files) / props.info?.autonomous_statistics?.total_files) * 100).toFixed(2) : 0;

    defaultPieOptions.series[0].label.formatter = [
        '{title|全部}',
        `{total|${total}}`,
    ].join('\n');
    renderChart(defaultPieOptions, document.getElementsByClassName('homology-pie-chart')[0] as HTMLElement);

    // eslint-disable-next-line no-unsafe-optional-chaining
    binaryBarOptions.series[0].data = [props.info?.module_binary_analyze_statistics?.file_num - props.info?.module_binary_analyze_statistics?.similarity_file_num, props.info?.module_binary_analyze_statistics?.similarity_file_num];
    renderChart(binaryBarOptions, document.getElementsByClassName('binary-bar-chart')[0] as HTMLElement);
});
</script>

<style lang='less' scoped>
.homology-pie-chart {
    width: 100%;
    height: 90%;
}

.progress {
    width: 110px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    right: 15%;
    top: 20px;
}

.binary-bar-chart {
    width: 100%;
    height: 100%;
}
</style>
