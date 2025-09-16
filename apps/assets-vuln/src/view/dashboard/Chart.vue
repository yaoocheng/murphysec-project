<template>
    <div class="h-full w-full bg-[#fff] rounded-md p-6 box-border">
        <div class="flex items-start justify-between">
            <div>
                <div class="text-base font-medium mb-1">核心指数趋势</div>
                <div class="text-99 text-xs mb-5">实时监测综合风险指数、安全能力差距指数、安全问题指数的动态演变</div>
            </div>
            <a-select class="base-select" placement="bottomRight" v-model:value="timeValue" style="width: 100px" :popupClassName="'vuln-filter-popup'">
                <a-select-option v-for="item in options" :key="item.value" :value="item.value" :disabled="item.disabled">
                    <div class="flex items-center justify-between">
                        {{ item.label }}
                        <Svg class="check-icon" height="12px" width="12px" name="list-checked" color="#6C87FF"></Svg>
                    </div>
                </a-select-option>
                <template #suffixIcon>
                    <CalendarOutlined class="text-99 text-sm" />
                </template>
            </a-select>
        </div>

        <div class="h-[calc(100%-60px)] w-full chart_dom">

        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { CalendarOutlined } from '@ant-design/icons-vue';
import * as echarts from 'echarts';
import { getDashboardDataApi } from '@/api/panel';
import { userInfo } from '@/store';
import { formatDate } from '@/utils';

const timeValue = defineModel('timeValue');
const options = [
    { value: '7 days', label: '近7天' },
    { value: '30 days', label: '近30天' },
    { value: '3 months', label: '近3个月' },
    { value: '6 months', label: '近6个月' },
    { value: '1 year', label: '近1年' },
    // { value: 'all', label: '全部' },
];

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
    const chartDom = document.querySelector('.chart_dom');
    chart = echarts.init(chartDom);

    // 计算SAI的最大值、最小值和区间
    const saiValues = mockData.sai.filter((v) => v !== null && v !== undefined);
    const saiMax = Math.max(...saiValues);
    const saiMin = Math.min(...saiValues);

    // 计算CRI和SII的最大值、最小值
    const criValues = mockData.cri.filter((v) => v !== null && v !== undefined);
    const siiValues = mockData.sii.filter((v) => v !== null && v !== undefined);
    const leftAxisMax = Math.max(...criValues, ...siiValues);
    const leftAxisMin = Math.min(...criValues, ...siiValues);

    // 计算数据范围的百分比增减，使变化更加明显
    const saiPadding = (saiMax - saiMin) * 0.2;
    const leftAxisPadding = (leftAxisMax - leftAxisMin) * 0.15;

    // 为左侧Y轴设置范围，不从0开始，而是从接近最小值的位置开始
    const leftYMin = Math.max(0, Math.floor((leftAxisMin - leftAxisPadding) / 10) * 10);
    const leftYMax = Math.ceil((leftAxisMax + leftAxisPadding) / 10) * 10;

    // 确定固定的刻度数量，保持左右轴一致
    const tickCount = 5;

    // 计算左侧Y轴间隔，强制使用整数倍数关系
    let leftYInterval = Math.ceil((leftYMax - leftYMin) / tickCount / 10) * 10;
    leftYInterval = Math.max(10, leftYInterval);
    // 调整max值，确保与min值之间的差值是interval的整数倍
    const leftSteps = Math.ceil((leftYMax - leftYMin) / leftYInterval);
    const adjustedLeftYMax = leftYMin + leftSteps * leftYInterval;

    // 调整最大最小值为0.05的倍数
    const saiYMin = Math.max(0, Math.floor((saiMin - saiPadding) * 20) / 20);
    const saiYMax = Math.min(1, Math.ceil((saiMax + saiPadding) * 20) / 20);

    // 计算SAI间隔，确保刻度均匀
    let saiInterval = Math.ceil((saiYMax - saiYMin) / tickCount / 0.05) * 0.05;
    saiInterval = Math.max(0.05, saiInterval);
    // 调整max值，确保与min值之间的差值是interval的整数倍
    const saiSteps = Math.ceil((saiYMax - saiYMin) / saiInterval);
    // 确保调整后的最大值不超过1.0
    const adjustedSaiYMax = Math.min(1.0, saiYMin + saiSteps * saiInterval);

    const option = {
        color: ['#6C87FF', '#AB61FF', '#E460FF'], // 曲线颜色
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#FFFFFFB2',
            borderWidth: 0,
            padding: [12, 16],
            textStyle: {
                color: '#333',
            },
            extraCssText: 'box-shadow: 0px 4px 30px 0px rgba(108, 135, 255, 0.2)',
            formatter: (params) => {
                let result = `<div class="text-xs font-medium mb-1">${params[0].axisValue}</div>`;
                params.forEach((item) => {
                    const dotColor = item.color || '#333';
                    const value = item.value?.toFixed(2); // 统一显示2位小数
                    // 根据颜色设置不同的透明度
                    let borderOpacity = '33';
                    let shadowOpacity = '33';
                    if (dotColor === '#E460FF') {
                        borderOpacity = '26';
                        shadowOpacity = '26';
                    }

                    result += `<div class="flex items-center h-[34px] px-3 bg-[#fff] justify-between mb-1 text-xs rounded-md last:mb-0" style="border: 0.5px solid ${dotColor}${borderOpacity}; box-shadow: 0px 4px 30px 0px ${dotColor}${shadowOpacity}">
                        <div class="flex items-center gap-2">
                            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:${dotColor}"></span>
                            <span class="text-99">${item.seriesName}</span>
                        </div>
                        <span class="font-bold ml-8">${value}</span>
                    </div>`;
                });
                return result;
            },
        },
        grid: {
            top: '35px',
            left: '30px',
            right: '45px', // 增加右侧边距，确保最后一个X轴标签和Y轴刻度值都完全可见
            bottom: '70px', // 增加底部边距，为图例留出更多空间
            containLabel: false, // 设置为false确保刻度标签不会影响边距计算
        },
        legend: {
            data: ['综合风险指数（CRI）', '安全能力差距指数（SAI）', '安全问题指数（SII）'],
            bottom: '0', // 从0%改为具体像素值，确保与底部有足够距离
            icon: 'circle',
            itemGap: 16,
            textStyle: {
                color: '#333',
                verticalAlign: 'middle', // 让文字和球垂直居中
            },
            // 添加图例选择变化事件，控制Y轴的显示与隐藏
            selectedMode: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: mockData.dates,
            axisLine: {
                lineStyle: {
                    color: '#E5E5E5',
                },
            },
            axisLabel: {
                color: '#999',
                padding: [10, 0, 16, 20],
                formatter: (value) => value,
                hideOverlap: false, // 不隐藏重叠的标签
                interval: 'auto', // 自动计算间隔，避免标签重叠
            },
        },
        yAxis: [
            {
                type: 'value',
                name: '指数（CRI/SII）',
                nameTextStyle: {
                    color: '#999',
                    padding: [0, -28, 5, 0],
                },
                position: 'left',
                min: leftYMin, // 设置最小值，不必从0开始
                max: adjustedLeftYMax, // 设置最大值
                interval: leftYInterval, // 设置合适的间隔，是10的倍数
                axisLine: {
                    show: false,
                },
                splitLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                        type: 'dashed',
                    },
                },
                axisLabel: {
                    color: '#999',
                    formatter: (value) => Math.round(value), // 修改为只显示整数
                },
            },
            {
                type: 'value',
                name: '指数（SAI）',
                nameTextStyle: {
                    color: '#AB61FF',
                    padding: [0, -40, 5, 0], // 调整标题位置，使其显示出来
                    align: 'right',
                },
                position: 'right',
                min: saiYMin,
                max: adjustedSaiYMax,
                interval: saiInterval,
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: false, // 默认不显示右侧Y轴的网格线
                    lineStyle: {
                        color: '#E5E5E5',
                        type: 'dashed',
                    },
                },
                axisLabel: {
                    color: '#AB61FF',
                    formatter: (value) => value.toFixed(2),
                    margin: 8, // 增加刻度值与轴线的距离
                    align: 'left', // 刻度值左对齐而不是右对齐
                    padding: [0, 0, 0, 0],
                },
            },
        ],
        series: [
            {
                name: '综合风险指数（CRI）',
                type: 'line',
                data: mockData.cri,
                showSymbol: false,
                smooth: true,
                yAxisIndex: 0,
                lineStyle: {
                    color: '#6C87FF',
                    width: 1.5,
                },
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
            {
                name: '安全能力差距指数（SAI）',
                type: 'line',
                data: mockData.sai,
                showSymbol: false,
                smooth: true,
                yAxisIndex: 1, // 使用右侧Y轴
                lineStyle: {
                    color: '#AB61FF',
                    width: 1.5,
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: '#AB61FF33',
                        }, {
                            offset: 1,
                            color: '#AB61FF00',
                        }],
                    },
                },
            },
            {
                name: '安全问题指数（SII）',
                type: 'line',
                data: mockData.sii,
                showSymbol: false,
                smooth: true,
                yAxisIndex: 0,
                lineStyle: {
                    color: '#E460FF',
                    width: 1.5,
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: '#E460FF33',
                        }, {
                            offset: 1,
                            color: '#E460FF00',
                        }],
                    },
                },
            },
        ],
    };

    chart.setOption(option);

    // 根据初始选中状态设置网格线
    const saiSeries = option.series.find((s) => s.name === '安全能力差距指数（SAI）');
    const leftAxisSeries = option.series.filter((s) => s.yAxisIndex === 0);
    const hasLeftSeries = leftAxisSeries.length > 0;
    const hasSaiSeries = saiSeries && true;

    // 初始化时设置网格线显示逻辑
    chart.setOption({
        yAxis: [
            {
                splitLine: {
                    show: hasLeftSeries, // 如果左侧有数据，则显示左侧网格线
                },
            },
            {
                splitLine: {
                    show: hasSaiSeries && !hasLeftSeries, // 仅当只有SAI数据时才显示右侧网格线
                },
            },
        ],
    });

    // 添加图例切换事件监听器，控制Y轴的显示与否
    chart.on('legendselectchanged', (params) => {
        // 检查SAI系列是否被选中
        const saiSelected = params.selected['安全能力差距指数（SAI）'];
        // 检查CRI和SII是否至少有一个被选中
        const leftAxisSeriesSelected = params.selected['综合风险指数（CRI）']
            || params.selected['安全问题指数（SII）'];

        // 更新Y轴显示状态
        chart.setOption({
            yAxis: [
                {
                    show: leftAxisSeriesSelected,
                    // 始终保持左侧网格线可见（当左侧轴显示时）
                    splitLine: {
                        show: leftAxisSeriesSelected,
                    },
                },
                {
                    show: saiSelected,
                    // 仅当只显示SAI且没有左侧数据时才显示右侧网格线
                    splitLine: {
                        show: saiSelected && !leftAxisSeriesSelected,
                    },
                },
            ],
        });
    });
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

    mockData.ymax = Math.max(...mockData.cri, ...mockData.sai, ...mockData.sii);
    mockData.interval = Math.ceil(mockData.ymax) / 5;

    initChart();
};

watch(userInfo.value, () => {
    getDashboardData_chart();
});

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
</script>
