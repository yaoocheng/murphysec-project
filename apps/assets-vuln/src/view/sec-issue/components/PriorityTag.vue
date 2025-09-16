<template>
    <div v-if="issueLevel" :class="wrapperClass" :style="backgroundStyle">
        <div class="flex items-center justify-between gap-[12px]">
            <div
                class="text-[15px] font-medium leading-[1.5em] flex-1"
                :style="textStyle"
            >
                {{ description }}
            </div>
            <div
                class="py-[3px] px-[12px] rounded-[3px] border flex items-center justify-center"
                :style="badgeStyle"
            >
                <span
                    class="text-[14px] font-medium leading-[1.5em] whitespace-nowrap"
                    :style="badgeTextStyle"
                >
                    {{ label }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    issueLevel: {
        type: String,
        default: '',
    },
});

const levelMap = {
    critical: {
        description: '基于关联漏洞及处置策略评估，综合处置优先级为强烈建议修复，建议立即处置',
        label: '强烈建议修复',
        backgroundStyle: 'background: linear-gradient(274.85deg, rgba(255, 102, 247, 0.1) 0%, rgba(255, 108, 110, 0.1) 100%)',
        textGradient: 'linear-gradient(274.85deg, #D50004 0%, #FF4C50 100%)',
        borderGradient: 'linear-gradient(274.85deg, rgba(255, 76, 80, 0.1) 0%, rgba(213, 0, 4, 0.1) 100%)',
    },
    high: {
        description: '基于关联漏洞及处置策略评估，综合处置优先级为建议修复，建议立即处置',
        label: '建议修复',
        backgroundStyle: 'background: linear-gradient(274.85deg, rgba(255, 133, 102, 0.1) 0%, rgba(255, 177, 108, 0.1) 100%)',
        textGradient: 'linear-gradient(135deg, #D56300 0%, #FFA04C 100%)',
        borderGradient: 'linear-gradient(135deg, #FFA04C 0%, #D56300 100%)',
    },
    medium: {
        description: '基于关联漏洞及处置策略评估，综合处置优先级为可选修复，建议立即处置',
        label: '可选修复',
        backgroundStyle: 'background: linear-gradient(274.85deg, rgba(255, 250, 102, 0.1) 0%, rgba(255, 218, 108, 0.1) 100%)',
        textGradient: 'linear-gradient(274.85deg, #D5A000 0%, #FFCC33 100%)',
        borderGradient: 'linear-gradient(274.85deg, rgba(255, 204, 51, 0.1) 0%, rgba(213, 160, 0, 0.1) 100%)',
    },
};

const currentLevel = computed(() => levelMap[props.issueLevel] || null);

const wrapperClass = 'priority-section box-border mb-[24px] py-[13px] px-[24px] rounded-[3px] w-full';

const backgroundStyle = computed(() => currentLevel.value?.backgroundStyle || '');
const textStyle = computed(() => ({
    background: currentLevel.value?.textGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: '\'PingFang SC\', sans-serif',
}));
const badgeStyle = computed(() => ({
    border: '1px solid',
    borderImage: `${currentLevel.value?.borderGradient} 1`,
    background: currentLevel.value?.borderGradient,
}));
const badgeTextStyle = computed(() => ({
    background: currentLevel.value?.textGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: '\'PingFang SC\', sans-serif',
}));

const description = computed(() => currentLevel.value?.description || '');
const label = computed(() => currentLevel.value?.label || '');
</script>
