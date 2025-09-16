<template>
    <span class="status" :style="{background: bg, color: c}">
        <i v-if="type===1" class="murphy icon-shijian"></i>
        <i v-else-if="type===2" class="murphy icon-detecting"></i>
        <i v-else-if="type===3" class="murphy icon-wancheng2"></i>
        <i v-else class="murphy icon-cuowu"></i>
        <slot />
    </span>
</template>

<script setup lang='ts'>
defineProps<{
    bg: string,
    c: string,
    type: number,
}>();
</script>

<style lang='less' scoped>
.status {
    padding: 5px 6px;
    font-size: 12px;
    border-radius: 4px;
    i {
        vertical-align: -1px;
        font-size: 14px;
        margin-right: 3px;
    }
}
</style>
