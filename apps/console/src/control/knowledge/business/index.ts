// eslint-disable-next-line import/prefer-default-export
export const createChartOptions = (list:any) => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
        backgroundColor: '#3c3c3c',
        borderRadius: 8,
        textStyle: {
            color: '#fff',
        },
        formatter(params: any) {
            const data = list?.find((item:any) => item.version === params[0].axisValue);
            const total = params.reduce((sum:any, item:any) => sum + item.value, 0);

            let result = `${data.version}（${data.time}）<br/>`;
            // result += `${data.version}<br/>`;
            result += `漏洞总数：${total}<br/>`;
            params.reverse().forEach((item:any) => {
                const marker = `<span style="display:inline-block;margin-right:4px;border-radius:50%;width:6px;height:6px;background-color:${item.color};vertical-align: 2px"></span>`;
                result += `${marker}${item.seriesName}：${item.value}<br/>`;
            });
            return result;
        },
    },
    legend: {
        data: ['严重', '高危', '中危', '低危'],
        top: '8%',
        right: '0%',
        icon: 'circle',
        itemWidth: 12, // 图例图标的宽度
        itemHeight: 12,
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        axisLabel: {
            fontSize: 12, // 调整字体大小
            color: '#858585',
            formatter(value: any) {
                if (value.length > 8) {
                    return `${value.substring(0, 12)}...`; // 超过5个字符省略
                }
                return value;
            },
        },
        axisLine: {
            lineStyle: {
                color: '#C9CDD4',
            },
        },
        axisTick: {
            show: false, // 隐藏x轴刻度
        },
        data: list.map((item:any) => item.version),
    },
    yAxis: {
        type: 'value',
        name: '漏洞数量',
        minInterval: 1,
        nameTextStyle: {
            padding: [0, 0, 0, 20], // 上、右、下、左
        },
        splitNumber: 3,
        axisLabel: {
            formatter: '{value}',
            color: '#858585',
        },
        splitLine: {
            lineStyle: {
                type: 'dashed',
            },
        },
    },
    series: [
        {
            name: '严重',
            type: 'bar',
            stack: 'total',
            emphasis: {
                focus: 'series',
            },
            barWidth: '30px',
            data: list.map((item:any) => item.vuln_total.critical_vulns),
            itemStyle: {
                color: '#F34D3D', // 红色
            },
        },
        {
            name: '高危',
            type: 'bar',
            stack: 'total',
            barWidth: '30px',
            emphasis: {
                focus: 'series',
            },
            data: list.map((item:any) => item.vuln_total.high_vulns),
            itemStyle: {
                color: '#FF9940', // 橙色
            },
        },
        {
            name: '中危',
            type: 'bar',
            stack: 'total',
            barWidth: '30px',
            emphasis: {
                focus: 'series',
            },
            data: list.map((item:any) => item.vuln_total.medium_vulns),
            itemStyle: {
                color: '#FFCC33', // 黄色
            },
        },
        {
            name: '低危',
            type: 'bar',
            stack: 'total',
            barWidth: '30px',
            emphasis: {
                focus: 'series',
            },
            data: list.map((item:any) => item.vuln_total.low_vulns),
            itemStyle: {
                color: '#A7AECC', // 蓝色
            },
        },
    ],
});
