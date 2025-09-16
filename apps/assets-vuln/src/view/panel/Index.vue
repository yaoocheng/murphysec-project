<template>
    <div class="main-content flex gap-2 flex-col">
        <div class="w-full h-fit p-6 flex items-center gap-6 bg-white">
            <div v-for="item in countList" :key="item.label" class="count-item">
                <span class="label">{{ item.label }}</span>
                <span class="count">{{ item.count }}</span>
            </div>
        </div>
        <div class="w-full h-fit flex items-center gap-2">
            <div class="chart-component-three">
                <span class="title">安全问题级别分布</span>
                <div class="w-full h-full issue_level"></div>
            </div>
            <div class="chart-component-three">
                <span class="title">安全能力与安全问题数量分布</span>
                <div class="w-full h-full security_capability_issue"></div>
            </div>
            <div class="chart-component-three">
                <span class="title">应用载体类型分布</span>
                <div class="w-full h-full flex gap-8">
                    <div class="h-full aspect-square carrier_type"></div>
                    <div class="flex-1 flex flex-col gap-8 items-left justify-center">
                        <div v-for="(item, key) in CARRIER_TYPE_MAP" :key="key" class="flex items-center gap-2">
                            <div class="w-2 h-[50px] rounded-full" :style="{ backgroundColor: item.color }"></div>
                            <div class="flex flex-col gap-2">
                                <span class="text-[14px] font-400">{{ item.label }}</span>
                                <span class="text-[20px] font-medium">{{ dashList[2].Options.series[0].data.find((carrier) => carrier.name === item.label)?.value }}
                                    <span class="text-[12px] text-gray-500">个</span>
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="w-full h-fit flex flex-1 items-center gap-2">
            <div class="chart-component-two">
                <span class="title">安全问题级别与处置状态分布</span>
                <div class="w-full h-full issue_level&status"></div>
            </div>
            <div class="chart-component-two">
                <span class="title">软件成分类型分布</span>
                <div class="w-full h-full flex justify-center items-center">
                    <SoftwareComponentTypeDistribution v-if="dashList[4].Options" :options="dashList[4].Options" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup >
import { getDashboardCountApi, getDashboardChartsApi, getSecurityLevelStatusChartApi } from 'api/panel';
import {
    reactive, watch,
} from 'vue';
import {
    createBarOptions, createPieOptions, renderChart, createStackedBarOptions,
} from 'utils/chart';
import {
    SEC_LEVEL_OPTION,
} from 'constants/app';
import { userInfo } from '@/store';
import SoftwareComponentTypeDistribution from './SoftwareComponentTypeDistribution.vue';

const countList = reactive(
    [
        {
            label: '业务系统数量',
            count: 0,
            value: 'business_systems',
        },
        {
            label: '应用数量',
            count: 0,
            value: 'application',
        },
        {
            label: '应用载体数量',
            count: 0,
            value: 'carrier',
        },
        {
            label: '成分数量',
            count: 0,
            value: 'component',
        },
        {
            label: '安全问题数量',
            count: 0,
            value: 'issue',
        },
    ],
);

const dashList = reactive([
    {
        label: '安全问题级别分布',
        value: 'issue_level',
        Options: createBarOptions(),
    },
    {
        label: '安全能力与安全问题数量分布',
        value: 'security_capability_issue',
        Options: createBarOptions(),
    },
    {
        label: '应用载体类型分布',
        value: 'carrier_type',
        Options: createPieOptions(),
    },
    {
        label: '安全问题级别与处置状态分布',
        value: 'issue_level&status',
        Options: createStackedBarOptions(),
    },
    {
        label: '软件成分类型分布',
        value: 'component_type',
        Options: null,
    },
]);

const ISSUE_LEVEL_MAP = {
    critical: { label: '严重', color: '#F34C3D' },
    high: { label: '高危', color: '#FF8B25' },
    medium: { label: '中危', color: '#FFBF00' },
    low: { label: '低危', color: '#B3B3B3' },
};
const CARRIER_TYPE_MAP = {
    code_repo: { label: '代码仓库', color: '#6C87FF' },
    service_address: { label: '服务地址', color: '#00D9D2' },
    host: { label: '主机', color: '#52C41A' },
};

// 获取仪表盘图表部分
const getDashboardChart = async () => {
    try {
        await Promise.all(dashList.map(async (item) => {
            let response;
            if (item.value === 'issue_level&status') {
                response = await getSecurityLevelStatusChartApi(
                    {
                        organize_id: userInfo.value.org_id,
                    },
                );
            } else {
                response = await getDashboardChartsApi({
                    query_type: item.value,
                });
            }

            switch (item.value) {
                case 'issue_level': {
                    const levelOrder = {
                        critical: 0, // 严重
                        high: 1, // 高危
                        medium: 2, // 中危
                        low: 3, // 低危
                    };
                    const sortedData = [...response.data.data].sort((a, b) => levelOrder[a.issue_level] - levelOrder[b.issue_level]);
                    item.Options.xAxis.data = sortedData.map((level) => ISSUE_LEVEL_MAP[level.issue_level].label);
                    item.Options.series[0].data = sortedData.map((level) => ({
                        value: level.count,
                        itemStyle: { color: ISSUE_LEVEL_MAP[level.issue_level].color },
                    }));
                    if (sortedData.length === 0) {
                        item.Options.xAxis.data = ['无'];
                        item.Options.series[0].data = [0];
                        item.Options.yAxis.interval = 20000;
                        item.Options.yAxis.min = 0;
                        item.Options.yAxis.max = 100000;
                    } else {
                        item.Options.yAxis.interval = null;
                        item.Options.yAxis.min = null;
                        item.Options.yAxis.max = null;
                    }
                    break;
                }
                case 'security_capability_issue':
                    item.Options.xAxis.data = response.data.data.map((capability) => capability.capability_name);
                    if (item.Options.xAxis.data.length === 0) {
                        item.Options.xAxis.data = ['无'];
                        item.Options.yAxis.interval = 20000;
                        item.Options.yAxis.min = 0;
                        item.Options.yAxis.max = 100000;
                    } else {
                        item.Options.yAxis.interval = null;
                        item.Options.yAxis.min = null;
                        item.Options.yAxis.max = null;
                    }
                    item.Options.series[0].data = response.data.data.map((capability) => capability.count);
                    if (item.Options.series[0].data.length === 0) {
                        item.Options.series[0].data = [0];
                    }
                    break;
                case 'carrier_type':
                    item.Options.series[0].data = Object.entries(CARRIER_TYPE_MAP).map(([key, value]) => ({
                        value: response.data.data.find((carrier) => carrier.carrier_type === key)?.count || 0,
                        name: value.label,
                    }));
                    item.Options.series[0].label.formatter = [
                        '{title|全部（个）}',
                        `{total|${response.data.data.reduce((acc, curr) => acc + curr.count, 0)}}`,
                    ].join('\n');
                    break;
                case 'issue_level&status':
                    item.Options.series.forEach((series) => {
                        SEC_LEVEL_OPTION.forEach((level, key) => {
                            series.data[key] = response.data.data.find((status) => status.issue_level === level.value
                                && status.issue_status === series.enname)?.count || 0;
                        });
                    });
                    break;
                case 'component_type':
                    item.Options = response.data.data;
                    break;
                default:
                    break;
            }
            if (item.value !== 'component_type') {
                renderChart(item.Options, document.getElementsByClassName(item.value)[0]);
            }
        }));
    } catch (error) {
        console.error(error);
    }
};

// 获取仪表盘数据部分
const getDashboardCount = async () => {
    try {
        await Promise.all(countList.map(async (item) => {
            const response = await getDashboardCountApi({
                query_type: item.value,
            });
            item.count = response.data.data;
        }));
    } catch (error) {
        console.error(error);
    }
};

// 监听 org_id 的变化
watch(() => userInfo.value?.org_id, () => {
    // 只要 org_id 变化就重新获取数据
    getDashboardCount();
    getDashboardChart();
}, { immediate: true });

</script>

<style scoped >

/* 仪表盘数字部分样式 */
.count-item{
    width: calc((100% - 24px * 4)/5);
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-right: 1px solid #E5E7EB;

    .label{
        font-size: 16px;
        color: #1D2129;
        font-weight: 500;
        line-height: 28px;
    }

    .count{
        font-size: 24px;
        color: #999999;
        font-weight: 700;
        line-height: 150%;
    }

    &:last-child{
        border-right: none;
    }
}

.chart-component-three {
    width: calc((100% - 8px * 2)/3);
    height: 306px;
    background-color: #ffffff;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .title{
        font-size: 18px;
        color: #3C3C3C;
        font-weight: 500;
        line-height: 150%;
    }

}

.chart-component-two{
    width: calc((100% - 8px * 2)/2);
    height: 100%;
    background-color: #ffffff;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .title{
        font-size: 18px;
        color: #3C3C3C;
        font-weight: 500;
        line-height: 150%;
    }
}

</style>
