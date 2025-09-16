<template>
    <el-select style="margin-right: 8px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup lang='ts'>
defineProps(['options']);
</script>

<style lang='less' scoped></style>
