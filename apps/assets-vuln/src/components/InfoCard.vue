<template>
    <div
        class="info-card border-gradient"
        v-show="visible"
        :class="{ 'entering': entering, 'collapsed': isCollapsed }"
    >
        <!-- 标题区域 -->
        <div class="card-header">
            <div class="title">
                <span class="icon">✨</span>
                <template v-if="tagLabel">
                    <div class="flex items-center">
                        <h3>{{ cardTitle || `SAI 指数改进：提升安全能力 ${capabilityName} 覆盖率` }}</h3>
                        <a-tag color="blue" class="ml-2">{{ tagLabel }}</a-tag>
                    </div>
                </template>
                <h3 v-else-if="isHtmlTitle" v-html="cardTitle"></h3>
                <h3 v-else>{{ cardTitle || `SAI 指数改进：提升安全能力 ${capabilityName} 覆盖率` }}</h3>
            </div>
            <a-button type="text" @click="toggleCollapse" class="toggle-btn">
                <template v-if="isCollapsed">
                    <DownOutlined class="toggle-icon" />
                    <span class="toggle-text">查看详情</span>
                </template>
                <template v-else>
                    <UpOutlined class="toggle-icon" />
                    <span class="toggle-text">收起</span>
                </template>
            </a-button>
        </div>

        <!-- 详情内容区域 (只在展开状态显示) -->
        <div class="card-content" v-show="!isCollapsed">
            <!-- 状态概览区域 -->
            <div class="stats-overview">
                <div class="stat-card" :class="{ 'wider': hideCovered }">
                    <div class="stat-title">{{ totalTitle || '应用总数' }}</div>
                    <div class="stat-number data-number">{{ totalCount }}</div>
                </div>

                <div class="divider" v-if="!hideCovered"></div>

                <div class="stat-card" v-if="!hideCovered">
                    <div class="stat-title">{{ coveredTitle || `已覆盖 ${capabilityName}` }}</div>
                    <div class="stat-number data-number covered">
                        {{ coveredCount }}
                        <CheckCircleFilled class="icon-success" />
                    </div>
                </div>

                <div class="divider"></div>

                <div class="stat-card highlight" :class="{ 'wider': hideCovered }">
                    <div class="stat-title">{{ uncoveredTitle || `待覆盖 ${capabilityName}` }}</div>
                    <div class="stat-number data-number pending">
                        {{ uncoveredCount }}
                        <AimOutlined class="icon-pending" />
                    </div>
                </div>
            </div>

            <!-- 行动指令区域 -->
            <div class="action-guide">
                <div class="guide-content">
                    <RightCircleOutlined class="guide-icon" />
                    <span class="guide-text" v-if="guideText" v-html="guideText"></span>
                    <span class="guide-text" v-else>下一步工作：对 <strong>{{ uncoveredCount }}</strong> 个待覆盖的应用逐步完成安全能力 <strong>{{ capabilityName }}</strong> 的接入配置。</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import {
    CheckCircleFilled, AimOutlined, RightCircleOutlined, UpOutlined, DownOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
    capabilityName: {
        type: String,
        required: true,
    },
    totalCount: {
        type: Number,
        default: 0,
    },
    coveredCount: {
        type: Number,
        default: 0,
    },
    uncoveredCount: {
        type: Number,
        default: 0,
    },
    initialCollapsed: {
        type: Boolean,
        default: false,
    },
    // 新增自定义文案
    cardTitle: {
        type: String,
        default: '',
    },
    totalTitle: {
        type: String,
        default: '',
    },
    coveredTitle: {
        type: String,
        default: '',
    },
    uncoveredTitle: {
        type: String,
        default: '',
    },
    guideText: {
        type: String,
        default: '',
    },
    // 是否隐藏已处理项
    hideCovered: {
        type: Boolean,
        default: false,
    },
    // 标签文本
    tagLabel: {
        type: String,
        default: '',
    },
});

// 计算标题是否包含HTML
const isHtmlTitle = computed(() => props.cardTitle && (props.cardTitle.includes('<') || props.cardTitle.includes('>')));

const emit = defineEmits(['close', 'collapse', 'expand']);

const visible = ref(false);
const entering = ref(true);
const isCollapsed = ref(props.initialCollapsed);

onMounted(() => {
    // 添加动画效果
    visible.value = true;
    setTimeout(() => {
        entering.value = false;
    }, 300);
});

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;

    // 发送收起/展开事件
    if (isCollapsed.value) {
        emit('collapse');
    } else {
        emit('expand');
    }
};
</script>

<style scoped>
@font-face {
  font-family: 'DIN Bold';
  src: url('/fonts/DIN-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

.info-card {
  position: relative;
  background-color: #FFFFFF;
  border-radius: 6px;
  padding: 12px 20px;
  margin: 12px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transform-origin: top center;
  transition: all 0.3s ease;
}

.info-card.entering {
  opacity: 0;
  transform: translateY(-10px);
}

.info-card.collapsed {
  padding: 8px 20px;
}

.border-gradient {
  position: relative;
  background: #fff;
}

.border-gradient::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  background: linear-gradient(98.08deg, rgba(109, 56, 255, 0.8) 0%, rgba(56, 93, 255, 0.8) 100%);
  -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
  mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  border-radius: 6px;
  pointer-events: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-card.collapsed .card-header {
  margin-bottom: 0;
}

.card-header .title {
  display: flex;
  align-items: center;
}

.card-header .icon {
  font-size: 16px;
  margin-right: 8px;
  color: #6D38FF;
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.toggle-btn {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.toggle-icon {
  font-size: 12px;
  margin-right: 2px;
  color: #0025cc;
}

.toggle-text {
  font-size: 13px;
  color: #0025cc;
}

.card-content {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.stats-overview {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 2px 0;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  text-align: center;
}

.stat-card.highlight {
  background-color: rgba(109, 56, 255, 0.04);
  border-radius: 4px;
  padding: 4px 10px;
}

.divider {
  width: 1px;
  height: 36px;
  background-color: #f0f0f0;
  margin: 0 10px;
}

.stat-title {
  font-size: 13px;
  color: #595959;
  margin-bottom: 6px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.data-number {
  font-family: 'DIN Bold', sans-serif;
  font-weight: 700;
}

.stat-number.covered {
  color: #52c41a;
}

.stat-number.pending {
  color: #6D38FF;
}

.icon-success, .icon-pending {
  margin-left: 6px;
  font-size: 16px;
}

.icon-success {
  color: #52c41a;
}

.icon-pending {
  color: #6D38FF;
}

.action-guide {
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.guide-content {
  display: flex;
  align-items: center;
}

.guide-icon {
  color: #0025cc;
  font-size: 14px;
  margin-right: 8px;
  flex-shrink: 0;
}

.guide-text {
  font-size: 13px;
  color: #262626;
  line-height: 1.5;
}

.guide-text strong {
  color: #0025cc;
  font-weight: 600;
}

.stat-card.wider {
  flex: 2;
  max-width: 50%;
}

/* 确保标题区域能正确显示HTML内容 */
.title h3 :deep(.ant-tag) {
  margin-left: 8px;
  font-size: 13px;
  padding: 0 6px;
  height: 22px;
  line-height: 20px;
}

.title h3 :deep(.flex) {
  display: flex;
  align-items: center;
}

.title .flex {
  display: flex;
  align-items: center;
}

.title .flex h3 {
  margin: 0;
}

.title .flex .ant-tag {
  margin-left: 8px;
}
</style>
