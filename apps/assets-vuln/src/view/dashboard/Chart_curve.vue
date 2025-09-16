<template>

    <div class="h-full w-full chart_curve_dom">

    </div>

</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { getDashboardDataApi } from '@/api/panel';
import { userInfo } from '@/store';
import { formatDate } from '@/utils';

const timeValue = ref('7 days');
const showTooltip = ref(true); // 控制tooltip是否显示的参数

// 模拟数据
const mockData = {
    dates: ['04-01', '04-04', '04-07', '04-10', '04-13', '04-16', '04-19', '04-21', '04-24', '04-30'],
    cri: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    sai: [70, 73, 65, 77, 68, 72, 71, 67, 72, 65],
    sii: [32, 35, 33, 38, 33, 40, 35, 38, 38, 37],
    ymax: 100,
    ymin: 0,
    interval: 20,
    // sii: [],
};

let chart = null;

const initChart = () => {
    const chartDom = document.querySelector('.chart_curve_dom');
    chart = echarts.init(chartDom);

    // 计算Y轴刻度
    const yMin = mockData.ymin;
    const yMax = mockData.ymax;
    const interval = (yMax - yMin) / 4;

    const option = {
        color: ['#6C87FF', '#AB61FF', '#E460FF'], // 曲线颜色
        // tooltip: showTooltip.value ? {
        //     trigger: 'axis',
        //     backgroundColor: '#FFFFFFB2',
        //     borderWidth: 0,
        //     padding: [12, 16],
        //     textStyle: {
        //         color: '#333',
        //     },
        //     showDelay: 0, // 显示延迟
        //     hideDelay: 0, // 立即隐藏
        //     enterable: false, // 禁止鼠标进入tooltip
        //     transitionDuration: 0.3, // 添加平滑过渡动画（0.3秒）
        //     axisPointer: {
        //         type: 'none', // 禁用辅助线
        //     },
        //     formatter: (params) => {
        //         const item = params[0]; // 只取CRI数据
        //         return `<div class="text-base font-medium mb-1">${item.axisValue}</div>
        //         <div class="flex items-center h-[34px] px-3 bg-[#fff] justify-between mb-1 text-xs rounded-md">
        //             <div class="flex items-center gap-2">
        //                 <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:${item.color}"></span>
        //                 <span class="text-99">综合风险指数（CRI）</span>
        //             </div>
        //             <span class="font-bold ml-8">${item.value?.toFixed(2)}</span>
        //         </div>`;
        //     },
        // } : false,
        grid: {
            top: '8%',
            left: '0',
            right: '0',
            bottom: '10%',
            containLabel: true,
        },
        legend: {
            data: ['综合风险指数（CRI）'],
            bottom: '0%',
            icon: 'circle',
            itemGap: 16,
            textStyle: {
                color: '#333',
            },
            show: false,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: mockData.dates,
            show: false,
            axisLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false,
            },
        },
        yAxis: {
            type: 'value',
            show: false,
            min: yMin,
            max: yMax,
            interval,
            axisTick: { show: false },
            axisLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false,
            },
        },
        series: [
            {
                name: '综合风险指数（CRI）',
                type: 'line',
                data: mockData.cri,
                showSymbol: false,
                lineStyle: {
                    color: '#6C87FF',
                    width: 1.5,
                },
                smooth: true,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: '#6C87FF33',
                        }, {
                            offset: 1,
                            color: '#6C87FF00',
                        }],
                    },
                },
            },
        ],
    };

    chart.setOption(option);
};

const getDashboardData_chart = async () => {
    const res = await getDashboardDataApi({
        organize_id: userInfo.value.org_id,
        mode: timeValue.value,
        business_system_id: userInfo.value.business_system_id,
    });

    const list = res.data.data.data_list;

    mockData.dates = list.map((item) => formatDate(item.report_time, 'YYYY-MM-DD'));
    mockData.cri = list.map((item) => item.cri);
    mockData.sai = list.map((item) => item.sai);
    mockData.sii = list.map((item) => item.sii);

    // 只使用CRI数据计算Y轴范围
    const criValues = mockData.cri.filter((v) => v !== null && v !== undefined);
    const minValue = Math.min(...criValues);
    const maxValue = Math.max(...criValues);

    // 极小的缓冲区，让曲线不会贴边
    const buffer = (maxValue - minValue) * 0.02; // 2%的缓冲区
    mockData.ymin = minValue - buffer;
    mockData.ymax = maxValue + buffer;
    mockData.interval = (mockData.ymax - mockData.ymin) / 4;

    initChart();
};

onMounted(async () => {
    await getDashboardData_chart();
    window.addEventListener('resize', () => {
        // eslint-disable-next-line no-unused-expressions
        chart && chart.resize();
    });
});

watch(timeValue, async () => {
    await getDashboardData_chart();
});

watch(showTooltip, (newValue) => {
    if (chart) {
        chart.setOption({
            tooltip: newValue ? {
                trigger: 'axis',
                backgroundColor: '#FFFFFFB2',
                borderWidth: 0,
                padding: [12, 16],
                textStyle: {
                    color: '#333',
                },
                showDelay: 0,
                hideDelay: 0,
                enterable: false,
                transitionDuration: 0.3, // 添加平滑过渡动画（0.3秒）
                axisPointer: {
                    type: 'none',
                },
                formatter: (params) => {
                    const item = params[0]; // 只取CRI数据
                    return `<div class="text-base font-medium mb-1">${item.axisValue}</div>
                    <div class="flex items-center h-[34px] px-3 bg-[#fff] justify-between mb-1 text-xs rounded-md">
                        <div class="flex items-center gap-2">
                            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:${item.color}"></span>
                            <span class="text-99">综合风险指数（CRI）</span>
                        </div>
                        <span class="font-bold ml-8">${item.value?.toFixed(2)}</span>
                    </div>`;
                },
            } : false,
        });
    }
});
</script>
