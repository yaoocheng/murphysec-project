<template>
    <el-tag class="px-1" :disable-transitions="true" :color="bgc||'#4966e633'" :style="{color: c||'#2946c7'}" size="small">
        {{ content }}
    </el-tag>
</template>

<script setup lang='ts'>
defineProps(['content', 'bgc', 'c']);
</script>

<style lang='less'>
.el-tag {
    border-color: transparent;
}
</style>
