<template>
    <a-empty class="mt-[25px] text-[#2A2B32] " :image="simpleImage" />
</template>

<script setup>
import { Empty } from 'ant-design-vue';

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
</script>
