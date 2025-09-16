<template>
    <div class="top_charts_wrap">
        <div class="chart1 chart">
            <div class="title mb-5">
                全部已检测项目
            </div>
            <div style="display: flex;align-items: center;justify-content: center;">
                <el-progress type="circle" :color="!totalNum ? '#f5f5f5' : '#6C87FF'" :percentage="100" :stroke-width="16"
                    :width="180">
                    <template #default>
                        <div>
                            <p class="text-xs text-85 mb-2">全部</p>
                            <p class="percentage_value font-bold text-[32px]">{{ totalNum }}</p>
                        </div>
                    </template>
                </el-progress>
            </div>
        </div>
        <div class="chart2 chart">
            <div class="title">
                许可证使用 TOP5
            </div>
            <div class="chart2_content"></div>
        </div>
        <div class="chart3 chart">
            <div class="title">
                全部安全问题处置等级
            </div>
            <div class="chart3_content"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { renderChart, createHorizontalBarOptions, createDefaultPieOptions } from 'util/chart';

const { top5Data } = defineProps(['totalNum', 'top5Data']);
const defaultPieOptions = createDefaultPieOptions();
const licenseTopOptions = createHorizontalBarOptions();

const licenseTop5 = () => {
    const licenseTopNames = top5Data.map((item) => item.license_name);
    const licenseTopNums = top5Data.map((item) => item.project_num);

    licenseTopOptions.yAxis.data = licenseTopNames.slice(0, 5).reverse();
    licenseTopOptions.series[0].data = licenseTopNums.slice(0, 5).reverse();
    licenseTopOptions.series[0].barWidth = 10;

    renderChart(licenseTopOptions, document.getElementsByClassName('chart2_content')[0]);
};

const licenseType = () => {
    const data = [
        {
            num: 65, // 百分数
            license_family_name: 'MIT 1', // 许可证类型名称
        },
        {
            num: 70, // 百分数
            license_family_name: 'MIT 2', // 许可证类型名称
        },
        {
            num: 60, // 百分数
            license_family_name: 'MIT 3', // 许可证类型名称
        },
    ];
    const types = data.map((item) => ({
        value: item.num,
        name: item.license_family_name,
    }));
    defaultPieOptions.series[0].data = types;
    defaultPieOptions.series[0].roseType = 'radius';

    renderChart(defaultPieOptions, document.getElementsByClassName('chart3_content')[0]);
};

onMounted(() => {
    licenseTop5();
    licenseType();
});
</script>

<style lang="less" scoped>
.top_charts_wrap {
    height: 288px;
    margin-bottom: 24px;
    .between();
}

.title {
    font-weight: 500;
    font-size: 20px;
    color: #3c3c3c;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.chart {
    background: #FFFFFF;
    border-radius: 6px;
    height: 100%;
    box-sizing: border-box;
    padding: 24px;
    position: relative;

    .chart2_content,
    .chart3_content {
        height: calc(100% - 20px);
    }
}

.chart1 {
    width: 24%;
}

.chart2,
.chart3 {
    width: 36%;
}
</style>
