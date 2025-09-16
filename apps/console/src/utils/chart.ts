import * as echart from 'echarts';

// 饼状图
export function createPieChart() {
    const data = {
        color: ['#F34D3D', '#FFCC33', '#C7C7C7'],
        content: [
            { value: 0, name: '强烈建议修复' },
            { value: 0, name: '建议修复' },
            { value: 0, name: '可选修复' },
        ],
    };

    return {
        // title: {
        //     text: '全部',
        //     subtext: '{total|123}',
        //     x: '24%',
        //     y: '34%',
        //     // top: '280',
        //     align: 'center',
        //     textStyle: {
        //         fontSize: 12,
        //         color: '#858585',
        //         fonWeight: '400',
        //     },
        //     subtextStyle: {
        //         color: '#3c3c3c',
        //         fontSize: 24,
        //         fontWeight: '600',
        //     },
        // },
        color: data.color,
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {d}%',
        },
        legend: {
            show: false,
            right: '20%',
            itemWidth: 14,
            itemHeight: 14,
            orient: 'vertical',
            textStyle: {
                color: '#',
                fontSize: 12,
                rich: {
                    a: {
                        verticalAlign: 'middle',
                    },
                },
                padding: [0, 0, -3, 0],
            },
        },
        series: [
            {
                type: 'pie',
                radius: ['55%', '75%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    position: 'center',
                    formatter: [
                        '{title|全部}',
                        '{total|xxx}',
                    ].join('\n'),
                    rich: {
                        title: {
                            fontSize: 12,
                            color: '#858585',
                            fonWeight: '400',
                        },
                        total: {
                            color: '#3c3c3c',
                            fontSize: 24,
                            fontWeight: '600',
                            lineHeight: 50,
                        },
                    },
                    //     // position: 'center',
                    //     // formatter: '0个',
                    //     // emphasis: { // 中间文字显示
                    //     //     show: true,
                    //     // },
                    //     // color: '#3c3c3c',
                    //     // fontSize: 24,
                    //     // fontWeight: '600',
                },

                data: data.content,
            },
        ],
    };
}

// 柱形图
export function createBarOptions() {
    return {
        xAxis: {
            // axisLine: {
            //     show: false, // 隐藏x轴线
            // },

            splitLine: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: '#c7c7c7',
                },
            },
            axisLabel: {
                color: '#858585',
            },
            axisTick: {
                show: false, // 隐藏x轴刻度
            },
            type: 'category',
            data: ['待修复', '已修复', '7天忽略', '关闭'],
        },
        grid: {
            left: '0',
            right: '0',
            bottom: '5%',
            top: '5%',
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#ebebeb',
                },
            },
        },
        series: [
            {
                data: [120, 200, 150, 80],
                type: 'bar',
                showBackground: false,
                color: '#6C87FF',
                // barWidth: '100%',
                // barMaxWidth: 60,
                // itemStyle: {
                //     borderRadius: 6,
                // },
            },
        ],
    };
}

// 雷达图
export const radarOption = {
    radar: {
        indicator: [
            { name: '维护团队', max: 100 },
            { name: '许可证风险', max: 100 },
            { name: '安全性', max: 100 },
            { name: '历史问题处置', max: 100 },
            { name: '更新频度', max: 100 },
            { name: '流行度', max: 100 },
        ],
    },
    series: [
        {
            type: 'radar',
            data: [
                {
                    value: [85, 54, 67, 83, 45, 65],
                },
            ],
            areaStyle: {},
        },
    ],
};

// 饼图
export const createDefaultPieOptions = () => ({
    // color: ['#6C87FF', '#65C4C9'],
    tooltip: {
        trigger: 'item',
    },
    legend: {
        show: true,
        orient: 'vertical',
        top: '40%',
        right: '10%',
    },
    series: [
        {
            type: 'pie',
            center: ['30%', '50%'],
            radius: '70%',
            data: [],
            label: {
                show: false,
            },
        },
    ],
});

// 柱图
export const createHorizontalBarOptions = () => ({
    color: ['#6C87FF'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    grid: {
        left: '4%',
        right: '10%',
        bottom: '7%',
        top: '7%',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        axisLine: {
            show: false, // 隐藏x轴线
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
            },
        },
        axisTick: {
            show: false, // 隐藏x轴刻度
        },
    },
    yAxis: {
        axisLine: {
            show: false, // 隐藏x轴线
        },
        axisTick: {
            show: false, // 隐藏x轴刻度
        },
        type: 'category',
        data: ['相似度<60%', '相似度≥60%'],
    },
    series: [
        {
            type: 'bar',
            data: [18203, 23489],
        },
    ],
});

export function renderChart(options: any, select: HTMLElement) {
    echart.dispose(select);
    const chart = echart.init(select);
    chart.setOption(options);
    window.addEventListener('resize', () => {
        chart.resize();
    });
    return chart;
}
