<template>
    <div>
        <div class="text">{{ text }}</div>
        <div class="per">{{ num }}<span class="g-f-12">个</span></div>
        <el-progress :percentage="Math.round((num / total) * 100) || 0" :show-text="false" :color="color" />
    </div>
</template>

<script setup lang='ts'>
defineProps(['num', 'text', 'color', 'unit', 'total']);
</script>

<style lang='less' scoped>
.text {
    color: #858585;
    font-size: 12px;
    margin-bottom: 6px;
}
.per {
    color: #3c3c3c;
    font-size: 22px;
    font-weight: 600;
}
</style>
