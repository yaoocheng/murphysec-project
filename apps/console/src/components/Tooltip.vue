<template>
    <el-tooltip placement="top">
        <template #content>
            <div class="break-all" :style="{maxWidth: `${width}px`}">
                {{ content }}
            </div>
        </template>

        <slot />
    </el-tooltip>
</template>

<script setup lang='ts'>
defineProps(['content', 'width']);
</script>
