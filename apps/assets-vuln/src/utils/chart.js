import * as echart from 'echarts';

// 饼状图
export function createPieOptions() {
    const data = {
        // color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        // 默认颜色列表
        color: ['#6C87FF', '#00D9D2'],
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
                radius: ['70%', '90%'],
                // center: ['30%', '50%'],
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
    const levelList = ['严重', '高危', '中危', '低危'];

    return {
        xAxis: {
            splitLine: {
                show: false, // 不显示垂直网格线
            },
            axisLine: {
                lineStyle: {
                    color: '#c7c7c7', // x轴线的颜色
                },
            },
            axisLabel: {
                color: '#858585', // x轴标签文字颜色
            },
            axisTick: {
                show: false, // 不显示刻度线
            },
            type: 'category', // 分类轴
            // data: ['严重', '高危', '中危', '低危'], // x轴的类别数据
            data: [], // x轴的类别数据
        },
        grid: {
            left: '0px',
            right: '0',
            bottom: '0px',
            top: '30px',
            containLabel: true, // 确保标签在图表区域内
        },
        tooltip: {
            trigger: 'axis', // 鼠标悬停时显示提示框
            extraCssText: 'width:fit-content !important;height:fit-content !important;display:flex;align-items:center;', // 自定义的tooltip的大小
            formatter(params) {
                let result = `${params[0].name}`;
                params.forEach((item) => {
                    result = `
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;
                    background-color:${item.color}"></span>${levelList.includes(item.name) ? `${item.name}漏洞` : item.name}`;
                    result += `<span style="color:#000000;margin-left:10px;text-align:center">${item.value}</span><br>`;
                });
                return result;
            },
        },
        yAxis: {
            name: '数量',
            type: 'value', // 数值轴
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed', // 虚线样式
                    color: '#ebebeb', // 网格线颜色
                },
            },
            nameTextStyle: { // x轴name的样式调整
                // color: '#000',
                // fontSize: 22,
                padding: [0, 40, 0, 0, 0], // 加上padding可以调整其位置
            },
            // interval: 20000, // 步长
            // min: 0, // 起始
            // max: 100000, // 终止
        },
        series: [
            {
                data: [120, 200, 150, 80], // 柱状图数据
                type: 'bar',
                barWidth: '40%',
                showBackground: false,
                color: '#6C87FF', // 柱子颜色
            },
        ],
    };
}

// 雷达图
export const createRadarOptions = () => ({
    radar: {
        radius: '70%',
        center: ['50%', '56%'],
        indicator: [
            { name: '攻击向量\n远程', max: 100 },
            { name: '漏洞评级\n严重', max: 100 },
            { name: '导致数据泄露\n是', max: 100 },
            { name: '利用成熟度\n存在POC', max: 100 },
            { name: '利用成本\n高', max: 100 },
        ],
        shape: 'polygon',
        splitNumber: 4,
        axisName: {
            color: '#333',
            fontSize: 12,
            formatter: (name) => {
                const parts = name.split('\n');
                return [
                    `{name|${parts[0]}}`,
                    `{value|${parts[1]}}`,
                ].join('\n');
            },
            rich: {
                name: {
                    color: '#666666',
                    fontSize: 12,
                    fontWeight: 'normal',
                    padding: [0, 0, 4, 0],
                },
                value: {
                    color: '#333333',
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            },
        },
        splitArea: {
            areaStyle: {
                color: ['#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC'],
                opacity: 0.2,
            },
        },
        axisLine: {
            lineStyle: {
                color: '#E6E6E6',
            },
        },
        splitLine: {
            lineStyle: {
                color: '#E6E6E6',
            },
        },
    },
    series: [{
        type: 'radar',
        data: [{
            value: [90, 90, 90, 80, 70],
            name: '威胁评估',
            areaStyle: {
                color: '#6C87FF',
                opacity: 0.2,
            },
            lineStyle: {
                color: '#6C87FF',
                width: 2,
            },
            itemStyle: {
                color: '#6C87FF',
            },
        }],
    },
    ],
});

// export const radarOption = {
//     radar: {
//         radius: '70%',
//         center: ['50%', '59%'],
//         indicator: [
//             { name: '攻击向量\n远程', max: 100 },
//             { name: '漏洞评级\n严重', max: 100 },
//             { name: '导致数据泄露\n是', max: 100 },
//             { name: '利用成熟度\n存在POC', max: 100 },
//             { name: '利用成本\n高', max: 100 },
//         ],
//         shape: 'polygon',
//         splitNumber: 4,
//         axisName: {
//             color: '#333',
//             fontSize: 12,
//             formatter: (name) => {
//                 const parts = name.split('\n');
//                 return [
//                     `{name|${parts[0]}}`,
//                     `{value|${parts[1]}}`,
//                 ].join('\n');
//             },
//             rich: {
//                 name: {
//                     color: '#666666',
//                     fontSize: 12,
//                     fontWeight: 'normal',
//                     padding: [0, 0, 4, 0],
//                 },
//                 value: {
//                     color: '#333333',
//                     fontSize: 12,
//                     fontWeight: 'bold',
//                 },
//             },
//         },
//         splitArea: {
//             areaStyle: {
//                 color: ['#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC'],
//                 opacity: 0.2,
//             },
//         },
//         axisLine: {
//             lineStyle: {
//                 color: '#E6E6E6',
//             },
//         },
//         splitLine: {
//             lineStyle: {
//                 color: '#E6E6E6',
//             },
//         },
//     },
//     series: [{
//         type: 'radar',
//         data: [{
//             value: [90, 90, 90, 80, 70],
//             name: '威胁评估',
//             areaStyle: {
//                 color: '#6C87FF',
//                 opacity: 0.2,
//             },
//             lineStyle: {
//                 color: '#6C87FF',
//                 width: 2,
//             },
//             itemStyle: {
//                 color: '#6C87FF',
//             },
//         }],
//     }],
// };

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

// 堆叠条形图
export const createStackedBarOptions = () => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
        },
    },
    legend: {
        icon: 'circle', // 图例标记的形状--圆形
        align: 'auto', // 图例标记和文本的对齐
        x: 'left', // 可设定图例在左、右、居中
        y: 'top', // 可设定图例在上、下、居中
        padding: [13, 0, 0, 56], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                color: '#ebebeb',
            },
        },
    },
    yAxis: {
        type: 'category',
        data: ['严重', '高危', '中危', '低危'],
        axisTick: {
            show: false, // 不显示刻度线
        },
    },
    color: ['#FF6759', '#FFBF00', '#00D9D2', '#6C87FF', '#F673FF', '#B3B3B3'],
    series: [
        {
            name: '未处置',
            enname: 'open',
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
            },
            emphasis: {
                focus: 'series',
            },
            data: [320, 302, 301, 320],
        },
        {
            name: '处置中',
            enname: 'processing',
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
            },
            emphasis: {
                focus: 'series',
            },
            data: [134, 90, 230, 210],
        },
        {
            name: '已完成',
            enname: 'completed',
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
            },
            emphasis: {
                focus: 'series',
            },
            data: [220, 182, 191, 234],
        },
        {
            name: '已忽略',
            enname: 'ignored',
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
            },
            emphasis: {
                focus: 'series',
            },
            data: [150, 212, 330, 410],
        },
        {
            name: '已加白',
            enname: 'whitelisted',
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
            },
            emphasis: {
                focus: 'series',
            },
            data: [820, 1290, 1330, 1320],
        },
        {
            name: '已关闭',
            enname: 'close',
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
            },
            emphasis: {
                focus: 'series',
            },
            data: [934, 1290, 1330, 1320],
        },
    ],
});

export function renderChart(options, select) {
    echart.dispose(select);
    const chart = echart.init(select);
    chart.setOption(options);
    window.addEventListener('resize', () => {
        chart.resize();
    });
    return chart;
}
