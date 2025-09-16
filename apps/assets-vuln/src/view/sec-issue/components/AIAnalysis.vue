<template>
    <div v-if="parsedAnalysisData" class="ai-analysis-container">
        <div class="ai-analysis-inner">
            <!-- 折叠状态：两行结构 -->
            <div class="collapsed-state">
                <!-- 第一行：标题组 vs 控制组 -->
                <div class="top-row">
                    <!-- 标题组：图标容器 + 标题 -->
                    <div class="title-group">
                        <div class="icon-container">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <span class="title-text">AI 智能分析</span>
                    </div>

                    <!-- 控制组：优先级徽章 + 展开图标 -->
                    <div class="controls-group">
                        <div class="priority-badge" :class="getPriorityClass(parsedAnalysisData.priority_level)">
                            {{ getPriorityText(parsedAnalysisData.priority_level) }}
                        </div>
                        <DownOutlined v-if="!isExpanded" class="expand-icon" @click="toggleExpanded" />
                        <UpOutlined v-else class="expand-icon" @click="toggleExpanded" />
                    </div>
                </div>

                <!-- 第二行：理由文本 -->
                <div class="justification-row">
                    <p class="justification-text">{{ parsedAnalysisData.justification }}</p>
                </div>
            </div>

            <!-- 展开状态：风险维度概要 -->
            <div v-if="isExpanded" class="expanded-state">
                <!-- 整体标题 -->
                <h3 class="section-title">风险维度概要</h3>ß

                <div class="expanded-grid">
                    <!-- 左列：雷达图 -->
                    <div class="left-column">
                        <div class="radar-chart" ref="radarChart"></div>
                    </div>

                    <!-- 右列：维度详解卡片列表 -->
                    <div class="right-column">
                        <div class="dimensions-list">
                            <div v-for="dimension in dimensionsList" :key="dimension.id" class="dimension-card">
                                <div class="card-content">
                                    <!-- 图标容器 -->
                                    <div class="icon-container-new">
                                        <component :is="getDimensionIcon(dimension.id)" class="dimension-icon-new" />
                                    </div>

                                    <!-- 内容区域 -->
                                    <div class="content-area">
                                        <!-- 标题行：标题 + 风险指示器 -->
                                        <div class="title-row">
                                            <h5 class="dimension-title-new">{{ dimension.title }}</h5>
                                            <div class="risk-indicator">
                                                <div class="risk-dot" :class="getRiskDotClass(dimension.level)"></div>
                                                <span class="risk-label" :class="getRiskLabelClass(dimension.level)">
                                                    {{ getRiskLevelText(dimension.level) }}
                                                </span>
                                            </div>
                                        </div>

                                        <!-- 描述文本 -->
                                        <p class="dimension-description-new">{{ dimension.desc }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref, onMounted, nextTick, watch, computed,
} from 'vue';
import {
    GlobalOutlined,
    AppstoreOutlined,
    ThunderboltOutlined,
    AimOutlined,
    DownOutlined,
    UpOutlined,
} from '@ant-design/icons-vue';
import * as echarts from 'echarts';

// 定义组件的props
const props = defineProps({
    intelligentAnalysisResult: {
        type: String,
        default: '',
    },
});

// 响应式数据
const isExpanded = ref(false);
const radarChart = ref(null);
let chartInstance = null;

// 风险等级配置统一管理
const riskConfig = {
    high: {
        dotClass: 'bg-red-500',
        labelClass: 'text-red-600',
        bg: 'rgba(239, 68, 68, 0.9)',
        text: '#ffffff',
        score: 3,
    },
    medium: {
        dotClass: 'bg-yellow-500',
        labelClass: 'text-yellow-600',
        bg: 'rgba(234, 179, 8, 0.9)',
        text: '#ffffff',
        score: 2,
    },
    low: {
        dotClass: 'bg-green-500',
        labelClass: 'text-green-600',
        bg: 'rgba(16, 185, 129, 0.9)',
        text: '#ffffff',
        score: 1,
    },
};

// 优先级配置
const priorityConfig = {
    strong_recommend: {
        class: 'priority-critical',
        text: '强烈建议修复',
    },
    recommend: {
        class: 'priority-high',
        text: '建议修复',
    },
    optional: {
        class: 'priority-medium',
        text: '可选修复',
    },
};

// 维度图标配置
const dimensionIcons = {
    threat: GlobalOutlined,
    business: AppstoreOutlined,
    technical: ThunderboltOutlined,
    exposure: AimOutlined,
};

// 维度标题配置
const dimensionTitles = {
    threat: '威胁程度',
    business: '业务影响',
    technical: '技术风险',
    exposure: '暴露面',
};

// 解析 AI 分析结果
const parsedAnalysisData = computed(() => {
    // 确保传入的数据是非空字符串
    if (!props.intelligentAnalysisResult || typeof props.intelligentAnalysisResult !== 'string') {
        return null;
    }

    try {
        const parsed = JSON.parse(props.intelligentAnalysisResult);

        // 验证必要字段
        if (!parsed?.priority_level || !parsed?.justification || !parsed?.key_considerations_summary) {
            console.warn('AI分析数据格式不完整:', parsed);
            return null;
        }

        return parsed;
    } catch (error) {
        console.error('解析AI分析结果失败:', error);
        return null;
    }
});

// 计算维度列表
const dimensionsList = computed(() => {
    if (!parsedAnalysisData.value?.key_considerations_summary) {
        return [];
    }

    const summary = parsedAnalysisData.value.key_considerations_summary;
    const dimensions = [];

    // 按固定顺序添加维度
    const dimensionOrder = ['threat', 'business', 'technical', 'exposure'];

    dimensionOrder.forEach((dimensionId) => {
        if (summary[dimensionId]) {
            dimensions.push({
                id: dimensionId,
                title: dimensionTitles[dimensionId],
                level: summary[dimensionId].level,
                desc: summary[dimensionId].desc,
                score: riskConfig[summary[dimensionId].level]?.score || 1,
            });
        }
    });

    return dimensions;
});

// 获取风险等级文本
const getRiskLevelText = (level) => {
    const levelMap = {
        high: '高',
        medium: '中',
        low: '低',
    };
    return levelMap[level] || level;
};

// 生成 tooltip 内容
const generateTooltipContent = (data) => {
    let content = `<div style="padding: 12px; background: #ffffff; border-radius: 6px; color: #333; font-size: 13px; border: 1px solid #e5e7eb; min-width: 180px;">
        <div style="font-weight: 600; margin-bottom: 10px; color: #1f2937; font-size: 14px; text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">风险维度概览</div>`;

    data.forEach((item) => {
        const config = riskConfig[item.level] || riskConfig.low;
        content += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 4px 0;">
            <span style="color: #374151; font-weight: 500;">${item.title}</span>
            <span style="background: ${config.bg}; color: ${config.text}; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">${getRiskLevelText(item.level)}</span>
        </div>`;
    });

    return `${content}</div>`;
};

// 初始化雷达图
const initRadarChart = () => {
    if (!radarChart.value) return;

    // 销毁已存在的图表实例
    if (chartInstance) {
        chartInstance.dispose();
    }

    const data = dimensionsList.value;
    if (data.length === 0) return;

    chartInstance = echarts.init(radarChart.value);

    const radarOption = {
        tooltip: {
            show: true,
        },
        radar: {
            indicator: data.map((item) => ({
                name: item.title,
                max: 3,
            })),
            center: ['50%', '55%'],
            radius: '65%',
            axisName: {
                color: '#4b5563',
                fontSize: 13,
                fontWeight: 500,
                padding: [0, 0, 8, 0],
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250, 250, 250, 0.3)', 'rgba(245, 245, 245, 0.3)'],
                },
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 0, 0, 0.08)',
                    width: 1,
                },
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
        },
        series: [{
            type: 'radar',
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: () => generateTooltipContent(data),
            },
            data: [{
                value: data.map((item) => item.score),
                name: '风险评估',
                areaStyle: {
                    color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.5,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(109, 56, 255, 0.4)',
                        }, {
                            offset: 1,
                            color: 'rgba(56, 93, 255, 0.1)',
                        }],
                    },
                },
                lineStyle: {
                    color: 'rgba(109, 56, 255, 0.8)',
                    width: 2.5,
                },
                itemStyle: {
                    color: 'rgba(109, 56, 255, 0.9)',
                    borderColor: '#ffffff',
                    borderWidth: 2,
                },
                symbol: 'circle',
                symbolSize: 7,
            }],
        }],
        grid: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        },
    };

    chartInstance.setOption(radarOption);
};

// 切换展开状态
const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
    if (isExpanded.value) {
        nextTick(() => {
            initRadarChart();
        });
    }
};

// 获取处置优先级样式
const getPriorityClass = (level) => priorityConfig[level]?.class || 'priority-normal';

// 获取处置优先级文本
const getPriorityText = (level) => priorityConfig[level]?.text || level;

// 获取维度图标
const getDimensionIcon = (id) => dimensionIcons[id] || GlobalOutlined;

// 获取风险点样式
const getRiskDotClass = (level) => riskConfig[level]?.dotClass || 'bg-gray-500';

// 获取风险等级标签样式
const getRiskLabelClass = (level) => riskConfig[level]?.labelClass || 'text-gray-600';

// 监听数据变化
watch(() => props.intelligentAnalysisResult, () => {
    if (isExpanded.value && chartInstance) {
        nextTick(() => {
            initRadarChart();
        });
    }
}, {
    deep: true,
});

onMounted(() => {
    if (isExpanded.value) {
        nextTick(() => {
            initRadarChart();
        });
    }
});
</script>

<style scoped>
.ai-analysis-container {
    background: linear-gradient(90deg, rgba(109, 56, 255, 1), rgba(56, 93, 255, 1));
    border-radius: 12px;
    padding: 2px;
    margin: 20px 0;
}

.ai-analysis-inner {
    background: #ffffff;
    border-radius: 10px;
    padding: 20px;
}

.collapsed-state {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title-group {
    display: flex;
    align-items: center;
    gap: 12px;
}

.icon-container {
    background: #dbeafe;
    color: #2563eb;
    font-size: 20px;
    padding: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.title-text {
    font-weight: 700;
    color: #1f2937;
    font-size: 18px;
}

.controls-group {
    display: flex;
    align-items: center;
    gap: 16px;
}

.priority-badge {
    background: #ef4444;
    color: white;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 14px;
}

.priority-critical {
    background: #ef4444;
}

.priority-high {
    background: #f97316;
}

.priority-medium {
    background: #eab308;
}

.priority-normal {
    background: #6b7280;
}

.expand-icon {
    color: #6b7280;
    cursor: pointer;
    transition: transform 300ms ease;
    font-size: 16px;
}

.expand-icon.rotate-180 {
    transform: rotate(180deg);
}

.justification-text {
    color: #1f2937;
    margin: 0;
    padding: 16px;
    background: #f9fafb;
    border-radius: 6px;
    line-height: 1.6;
    font-size: 14px;
}

.expanded-state {
    padding-top: 16px;
    animation: expandContent 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes expandContent {
    from {
        opacity: 0;
        max-height: 0;
        padding-top: 0;
    }

    to {
        opacity: 1;
        max-height: 2000px;
        padding-top: 24px;
    }
}

.expanded-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
}

.left-column {
    display: flex;
    flex-direction: column;
}

.section-title {
    font-weight: 600;
    color: #374151;
    margin-bottom: 16px;
    font-size: 16px;
}

.radar-chart {
    width: 100%;
    height: 400px;
    background: transparent;
    border: none;
}

.right-column {
    display: flex;
    flex-direction: column;
    height: 400px;
}

.dimensions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
    justify-content: flex-start;
}

.dimension-card {
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    padding: 16px;
    transition: border-color 0.2s ease;
}

.dimension-card:hover {
    border-color: #d1d5db;
}

.card-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.icon-container-new {
    width: 32px;
    height: 32px;
    background: #f9fafb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
}

.dimension-icon-new {
    font-size: 16px;
    color: #374151;
}

.content-area {
    flex: 1;
    min-width: 0;
}

.title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.dimension-title-new {
    font-weight: 500;
    color: #111827;
    font-size: 15px;
    margin: 0;
}

.risk-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
}

.risk-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.risk-label {
    font-size: 14px;
    font-weight: 500;
}

.dimension-description-new {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
}

.bg-red-500 {
    background-color: #ef4444;
}

.bg-orange-500 {
    background-color: #f97316;
}

.bg-yellow-500 {
    background-color: #eab308;
}

.bg-blue-500 {
    background-color: #3b82f6;
}

.bg-green-500 {
    background-color: #10b981;
}

.text-red-600 {
    color: #dc2626;
}

.text-orange-600 {
    color: #ea580c;
}

.text-yellow-600 {
    color: #d97706;
}

.text-blue-600 {
    color: #2563eb;
}

.text-green-600 {
    color: #059669;
}

@media (max-width: 768px) {
    .ai-analysis-container {
        padding: 16px;
        margin: 16px 0;
    }

    .top-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .controls-group {
        align-self: flex-end;
    }

    .expanded-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .radar-chart {
        height: 280px;
    }
}

@media (max-width: 480px) {
    .ai-analysis-container {
        padding: 12px;
    }

    .dimension-card {
        padding: 12px;
    }
}
</style>
