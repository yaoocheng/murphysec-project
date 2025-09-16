<template>
    <el-empty :image-size="120" :image="noDataImg"  />
</template>

<script setup lang="ts">
import noDataImg from 'ast/img/no_data.png';

defineProps({
    desc: String,
    fontSize: {
        type: String,
        default: '14px',
    },
});
</script>

<style lang="less">
.el-empty {
    padding-bottom: 16px;
    padding-top: 24px;
}
.el-empty__description p{
    font-size: v-bind(fontSize);
    font-weight: 500;
    color: #3c3c3c;
}
</style>
