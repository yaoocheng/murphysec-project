<template>
    <span class="default_avatar" :style="{ width: `${size}px`, height: `${size}px`, lineHeight: `${size}px` }">
        {{ name ? name.slice(0, 1) : '-' }}
    </span>
</template>

<script setup lang='ts'>
defineProps(['size', 'name']);
</script>

<style lang='less' scoped>
.default_avatar {
    display: inline-block;
    border-radius: 50%;
    font-size: 12px;
    color: #fff;
    background-color: #6C87A9;
    text-align: center;
    margin: 2px 0 2px 2px;
}
</style>
