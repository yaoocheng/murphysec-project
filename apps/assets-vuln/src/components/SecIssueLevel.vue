<template>
    <div :class="[levelClass , size , shape]" >
        <span>{{ levelText }}</span>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const { text, size = 'small', shape = 'square' } = defineProps(['text', 'size', 'shape']);

const levelMap = {
    critical: ['critical', '严重'],
    high: ['high', '高危'],
    medium: ['medium', '中危'],
};

const levelClass = computed(() => {
    if (levelMap.critical.includes(text)) return 'serious';
    if (levelMap.high.includes(text)) return 'high_risk';
    if (levelMap.medium.includes(text)) return 'medium_risk';
    return 'low_risk';
});

const levelText = computed(() => {
    if (levelMap.critical.includes(text)) return '严重';
    if (levelMap.high.includes(text)) return '高危';
    if (levelMap.medium.includes(text)) return '中危';
    return '低危';
});
</script>

<style scoped>
.small{
    width: 28px;
    height: 17px;
    font-size: 10px;
    border-radius: 2px;
    padding: 1px 4px;
}

.medium{
    width: 42px;
    height: 24px;
    font-size: 14px;
    border-radius: 4px;
    padding: 1px 6px;
    span{
        line-height: 22px;
        font-weight: normal;
    }
}

.large{
    width: 56px;
    height: 32px;
    font-size: 20px;
    border-radius: 6px;
    padding: 1px 8px;
    span{
        line-height: 30px;
        font-weight: normal;
    }
}

/* 各个形状 */
/* 圆形 */
.circle{
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border-width: 6px;
    padding: 0;
    box-sizing: content-box;

    span{
        font-family: PingFang SC;
        font-weight: 600;
        font-size: 16px;
        line-height: 150%;
        letter-spacing: 0px;
        color: #FFFFFF;
    }
}

/* 方形 */
.square{
    border:none !important;
    box-shadow: none !important;
}

/* 各个安全级别 */
.serious,
.high_risk,
.medium_risk,
.low_risk {
    display: flex;
    color: #FFFFFF;
    gap: 10px;
    align-items: center;
    justify-content: center;
}

.serious {
    background-color: #BF1C0D;
    border: 6px solid #FDE9E7;
    box-shadow: 0px 0px 6px 0px #BF1C0D inset;
}

.high_risk {
    background-color: #CC5F00;
    border: 6px solid #FFF1E5;
    box-shadow: 0px 0px 6px 0px #CC5F00 inset;
}

.medium_risk {
    background-color: #CC9900;
    border: 6px solid #FFFCE5;
    box-shadow: 0px 0px 6px 0px #CC9900 inset;
}

.low_risk {
    background-color: #B3B3B3;
    border: 6px solid #F2F2F2;
    box-shadow: 0px 0px 6px 0px #B3B3B3 inset;
}

</style>
