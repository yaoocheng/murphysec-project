<template>
    <div class="g-mb-16 g-bg-ff g-p-16 g-bdr-6">
        <div class="g-fw-500 g-f-20 g-color-1 g-mb-16">敏感信息识别</div>
        <div class="g-bg-f7 g-p-24 g-bdr-6 g-flex">
            <div class="g-flex-grow-1 g-mr-24">
                <div class="g-fw-500 g-color-3 g-mb-16">敏感信息</div>
                <div style="height: 284px;position: relative;" class="g-bdr-6 g-bg-ff g-border-box">
                    <div class="sensitive-risk-chart"></div>
                    <div class="progress">
                        <SuggestProgress :text="'高风险'" :color="`#F34D3D`" :total="nums.total" :num="nums.high" />
                        <SuggestProgress :text="'中风险'" :color="`#FFCC33`" :total="nums.total" :num="nums.mid" />
                        <SuggestProgress :text="'低风险'" :color="`#C7C7C7`" :total="nums.total" :num="nums.low" />
                    </div>
                </div>
            </div>

            <div class="g-flex-grow-1">
                <div class="g-fw-500 g-color-3 g-mb-16">敏感信息类型分布</div>
                <div style="height: 284px;" class="g-bdr-6 g-bg-ff g-border-box">
                    <div v-if="Object.keys(info?.sensitive_statistics?.title)?.length" class="sensitive-type-chart"></div>
                    <NoData v-else />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import NoData from 'comp/NoData.vue';
import { createDefaultPieOptions, createPieChart, renderChart } from 'util/chart';
import SuggestProgress from '@/control/platform/comp/SuggestProgress.vue';

const props = defineProps<{
    // eslint-disable-next-line no-undef
    info: OverviewData
}>();

const pieOptions = createPieChart();
const defaultPieOptions = createDefaultPieOptions();
const nums = ref<any>({});

onMounted(() => {
    pieOptions.color = props.info?.sensitive_statistics?.level?.total ? ['#F34D3D', '#FFCC33', '#C7C7C7'] : ['#EBEBEB80'];
    pieOptions.series[0].data = [
        { value: props.info?.sensitive_statistics?.level?.High, name: '高风险' },
        { value: props.info?.sensitive_statistics?.level?.Medium, name: '中风险' },
        { value: props.info?.sensitive_statistics?.level?.Low, name: '低风险' },
    ];
    pieOptions.series[0].label.formatter = [
        '{title|全部}',
        `{total|${props.info?.sensitive_statistics?.level?.total}}`,
    ].join('\n');

    nums.value = {
        high: props.info?.sensitive_statistics?.level?.High,
        mid: props.info?.sensitive_statistics?.level?.Medium,
        low: props.info?.sensitive_statistics?.level?.Low,
        total: props.info?.sensitive_statistics?.level?.total,
    };
    renderChart(pieOptions, document.getElementsByClassName('sensitive-risk-chart')[0] as HTMLElement);

    if (Object.keys(props.info?.sensitive_statistics?.title)?.length) {
        const arr = [];
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const key in props.info?.sensitive_statistics?.title) {
            // eslint-disable-next-line semi
            arr.push({
                value: props.info?.sensitive_statistics?.title[key],
                name: key,
            });
        }
        defaultPieOptions.series[0].data = arr as any;
        renderChart(defaultPieOptions, document.getElementsByClassName('sensitive-type-chart')[0] as HTMLElement);
    }
});
</script>

<style lang='less' scoped>
// .homology-pie-chart {
//     width: 100%;
//     height: 90%;
// }

// .binary-bar-chart {
//     width: 100%;
//     height: 100%;
// }

.sensitive-risk-chart,
.sensitive-type-chart {
    height: 100%;
}

.progress {
    width: 110px;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    right: 20%;
    top: 40px;
}
</style>
