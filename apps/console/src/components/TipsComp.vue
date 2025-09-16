<template>
    <el-tooltip placement="top">
        <template #content>
            <div :style="{maxWidth: `${width}px`}">
                {{ content }}
            </div>
        </template>
        <i class="murphy icon-wenhaoxiao g-f-13 g-color-3 g-fw-400"></i>
    </el-tooltip>
</template>

<script setup lang='ts'>
defineProps(['content', 'width']);
</script>
