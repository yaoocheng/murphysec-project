<template>
    <el-dialog @opened="openHandle" @close="emits('update:modelValue', false)" :close-on-click-modal="false">
        <template #header>
            <div>
                软件成熟度评估：{{score.maturity}}分
            </div>
        </template>
        <div class="chart"></div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { radarOption, renderChart } from 'util/chart';

const props = defineProps(['score']);
const emits = defineEmits(['update:modelValue']);
const openHandle = () => {
    radarOption.series[0].data[0].value = [props.score.vendor, props.score.license, props.score.vulnerability, props.score.issue, props.score.update, props.score.popularity];
    renderChart(radarOption, document.getElementsByClassName('chart')[0] as HTMLElement);
};

</script>

<style lang='less' scoped>
.chart {
    width: 100%;
    height: 400px;
}
</style>
