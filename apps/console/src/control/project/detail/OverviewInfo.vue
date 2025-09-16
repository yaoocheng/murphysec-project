<template>
    <div class="overview-info g-bg-f7 g-p-16 g-bdr-6" v-loading="loading">
        <div class="g-flex g-mb-16">
            <PieChartComp :info="compInfo">
                <template #title>
                    <div class="g-fw-500 g-f-20 g-color-1">组件信息</div>
                </template>
                <template #chart>
                    <div class="chart-container chart-container1"></div>
                </template>
                <template #nums>
                    <div class="progress">
                        <SuggestProgress :text="'强烈建议修复'" :color="`#F34D3D`" :total="compNums.total"
                                         :num="compNums.strong_num" />
                        <SuggestProgress :text="'建议修复'" :color="`#FF9940`" :total="compNums.total"
                                         :num="compNums.recommend_num" />
                        <SuggestProgress :text="'可选修复'" :color="`#C7C7C7`" :total="compNums.total"
                                         :num="compNums.optional_num" />
                        <SuggestProgress :text="'安全'" :color="`#38C728`" :total="compNums.total"
                                         :num="compNums.safe_num" />
                    </div>
                </template>
            </PieChartComp>
            <PieChartComp :info="vulnInfo" class="g-ml-16">
                <template #title>
                    <div class="g-fw-500 g-f-20 g-color-1">漏洞信息</div>
                </template>
                <template #chart>
                    <div class="chart-container chart-container2"></div>
                </template>
                <template #nums>
                    <div class="progress">
                        <SuggestProgress :text="'严重'" :color="`#F34D3D`" :total="vulnNums.total"
                                         :num="vulnNums.critical_num" />
                        <SuggestProgress :text="'高危'" :color="`#FF9940`" :total="vulnNums.total"
                                         :num="vulnNums.high_num" />
                        <SuggestProgress :text="'中危'" :color="`#FFCC33`" :total="vulnNums.total"
                                         :num="vulnNums.medium_num" />
                        <SuggestProgress :text="'低危'" :color="`#C7C7C7`" :total="vulnNums.total"
                                         :num="vulnNums.low_num" />
                    </div>
                </template>
            </PieChartComp>
            <!-- <PieChartComp :info="licenseInfo">
                <template #title>
                    <div class="g-fw-500 g-f-20 g-color-1">许可证信息</div>
                </template>
                <template #chart>
                    <div class="chart-container chart-container3"></div>
                </template>
            </PieChartComp> -->
        </div>

        <div class="g-p-24 g-bg-ff g-bdr-6">
            <div class="g-fw-500 g-f-20 g-color-1 g-mb-16">许可证信息</div>
            <div class="g-bg-f7 g-p-24 g-bdr-6 g-flex">
                <div class="g-flex-grow-1 g-mr-24" style="position: relative;">
                    <div class="g-f-16 g-fw-500 g-color-3 g-mb-16">许可证风险等级占比</div>
                    <div class="g-bg-ff g-bdr-6" style="height: 284px;">
                        <div class="chart-container chart-container3"></div>
                        <div class="progress" style="top: 60px;right: 100px; height: 250px;">
                            <SuggestProgress :text="'高风险'" :color="`rgb(243, 77, 61)`" :total="lincenseNums.total"
                                             :num="lincenseNums.license_high_num" />
                            <SuggestProgress :text="'中风险'" :color="`rgb(255, 153, 64)`" :total="lincenseNums.total"
                                             :num="lincenseNums.license_medium_num" />
                            <SuggestProgress :text="'低风险'" :color="`rgb(255, 204, 51)`" :total="lincenseNums.total"
                                             :num="lincenseNums.license_low_num" />
                            <SuggestProgress :text="'无风险'" :color="`#c7c7c780`" :total="lincenseNums.total"
                                             :num="lincenseNums.license_safe_num" />
                        </div>
                    </div>
                </div>

                <div class="g-flex-grow-1">
                    <div class="g-f-16 g-fw-500 g-color-3 g-mb-16">许可证使用TOP5</div>
                    <div class="g-bg-ff g-bdr-6" style="height: 284px;">
                        <div v-if="isHasLicense" class="chart-container license-top-container"></div>
                        <NoData v-else />
                    </div>
                </div>
            </div>
        </div>

        <HomologyInfoPart v-if="overviewData && store.conf?.add_code_similarity" :info="overviewData" />

        <SensitiveInfoPart v-if="overviewData && store.conf?.is_sensitive" :info="overviewData" />
    </div>
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router';
import store from 'util/store';
import { onMounted, ref } from 'vue';
import { getDetailLicenseListApi } from 'api/project';
import { getOverviewDataApi } from 'api/asset';
import NoData from 'comp/NoData.vue';
import { createPieChart, renderChart, createHorizontalBarOptions } from 'util/chart';
import SuggestProgress from '@/control/platform/comp/SuggestProgress.vue';
import PieChartComp from './components/PieChartComp.vue';
import HomologyInfoPart from './components/HomologyInfoPart.vue';
import SensitiveInfoPart from './components/SensitiveInfoPart.vue';

const route = useRoute();
const pieOptions1 = createPieChart();
const pieOptions2 = createPieChart();
const pieOptions3 = createPieChart();
const loading = ref<boolean>(false);
const licenseTopOptions = createHorizontalBarOptions();
const overviewData = ref();
const compInfo = ref<Array<any>>([]);
const vulnInfo = ref<Array<any>>([]);
const licenseInfo = ref<Array<any>>([]);

const compNums = ref<any>({});
const vulnNums = ref<any>({});
const lincenseNums = ref<any>({});

const isHasLicense = ref<boolean>(true);

const licenseTop5 = async () => {
    try {
        const { data } = await getDetailLicenseListApi({
            subtask_id: route.params.sid as string,
            project_id: route.params.tid as string,
        });
        isHasLicense.value = data.list?.length > 0;

        const licenseTopNames = data.list.sort((a: any, b: any) => b.comp_num - a.comp_num).map((item: any) => item.spdx);
        const licenseTopNums = data.list.sort((a: any, b: any) => b.comp_num - a.comp_num).map((item: any) => item.comp_num);

        licenseTopOptions.yAxis.data = licenseTopNames.slice(0, 5).reverse();
        licenseTopOptions.series[0].data = licenseTopNums.slice(0, 5).reverse();
        renderChart(licenseTopOptions, document.getElementsByClassName('license-top-container')[0] as HTMLElement);
    } catch (error) {
        console.log(error);
    }
};

onMounted(async () => {
    loading.value = true;
    try {
        const { data } = await getOverviewDataApi({
            subtask_id: route.params.sid,
            project_id: route.params.tid,
        });
        overviewData.value = data;
        compInfo.value = [
            {
                name: '可触发漏洞',
                num: data.leak_comp_statistics?.triggers_num,
            }, {
                name: '线上依赖',
                num: data.leak_comp_statistics?.online_num,
            },
            {
                name: '投毒组件',
                num: data.leak_comp_statistics?.comp_poison_num,
            },
        ];
        vulnInfo.value = [
            {
                name: 'CVE未收录',
                num: data.leak_comp_statistics?.vuln_not_cve_num,
            },
            {
                name: '有POC',
                num: data.leak_comp_statistics?.vuln_poc_num,
            },
            {
                name: '独家漏洞',
                num: data.leak_comp_statistics?.vuln_sole_num,
            },
        ];
        licenseInfo.value = [
            {
                name: '高风险',
                num: data.license_high_num,
                c: 'rgb(243, 77, 61)',
            },
            {
                name: '中风险',
                num: data.license_medium_num,
                c: 'rgb(255, 153, 64)',
            },
            {
                name: '低风险',
                num: data.license_low_num,
                c: 'rgb(255, 204, 51)',
            },
            {
                name: '无风险',
                num: data.license_num - data.license_high_num - data.license_medium_num - data.license_low_num,
                c: '#c7c7c780',
            },
        ];

        // 组件
        compNums.value.strong_num = data.strong_num;
        compNums.value.recommend_num = data.recommend_num;
        compNums.value.optional_num = data.optional_num;
        compNums.value.safe_num = data.comp_num - data.strong_num - data.recommend_num - data.optional_num;
        compNums.value.total = data.comp_num;
        // pieOptions1.series[0].label.formatter = `${data.comp_num}个`;
        // pieOptions1.color = ['#F34D3D', '#FF9940', '#FFCC33', '#31AD23'];
        pieOptions1.color = data.comp_num ? ['#F34D3D', '#FF9940', '#FFCC33', '#31AD23'] : ['#EBEBEB80'];
        pieOptions1.series[0].data = [
            { value: data.strong_num, name: '强烈建议修复' },
            { value: data.recommend_num, name: '建议修复' },
            { value: data.optional_num, name: '可选修复' },
            { value: data.comp_num - data.strong_num - data.recommend_num - data.optional_num, name: '安全' },
        ];
        pieOptions1.series[0].label.formatter = [
            '{title|全部}',
            `{total|${data.comp_num}}`,
        ].join('\n');
        renderChart(pieOptions1, document.getElementsByClassName('chart-container1')[0] as HTMLElement);

        // 漏洞
        vulnNums.value.critical_num = data.critical_num;
        vulnNums.value.high_num = data.high_num;
        vulnNums.value.medium_num = data.medium_num;
        vulnNums.value.low_num = data.low_num;
        vulnNums.value.total = data.leak_num;

        // pieOptions2.series[0].label.formatter = `${data.leak_num}个`;
        pieOptions2.color = data.leak_num ? ['#F34D3D', '#FF9940', '#FFCC33', '#D9D9D9'] : ['#EBEBEB80'];
        pieOptions2.series[0].data = [
            { value: data.critical_num, name: '严重' },
            { value: data.high_num, name: '高危' },
            { value: data.medium_num, name: '中危' },
            { value: data.low_num, name: '低危' },
        ];
        pieOptions2.series[0].label.formatter = [
            '{title|全部}',
            `{total|${data.leak_num}}`,
        ].join('\n');
        renderChart(pieOptions2, document.getElementsByClassName('chart-container2')[0] as HTMLElement);

        // 许可证
        lincenseNums.value.license_high_num = data.license_high_num;
        lincenseNums.value.license_medium_num = data.license_medium_num;
        lincenseNums.value.license_low_num = data.license_low_num;
        lincenseNums.value.license_safe_num = data.license_num - data.license_high_num - data.license_medium_num - data.license_low_num;

        lincenseNums.value.total = data.license_num;

        pieOptions3.series[0].label.formatter = `${data.license_num}个`;
        pieOptions3.color = data.license_num ? ['rgb(243, 77, 61)', 'rgb(255, 153, 64)', 'rgb(255, 204, 51)', '#c7c7c780'] : ['#EBEBEB80'];
        pieOptions3.series[0].data = [
            { value: data.license_high_num, name: '高风险' },
            { value: data.license_medium_num, name: '中风险' },
            { value: data.license_low_num, name: '低风险' },
            { value: lincenseNums.value.license_safe_num, name: '无风险' },
        ];
        pieOptions3.series[0].label.formatter = [
            '{title|全部}',
            `{total|${data.license_num}}`,
        ].join('\n');
        renderChart(pieOptions3, document.getElementsByClassName('chart-container3')[0] as HTMLElement);

        licenseTop5();
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang='less' scoped>
.chart-container {
    width: 100%;
    height: 284px;
}

.progress {
    width: 110px;
    height: 62%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    right: 120px;
    top: 50px;
}
</style>
