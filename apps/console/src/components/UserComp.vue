<template>
    <el-tooltip :content="name" placement="top">
        <span class="member">
            <AvatarComp :size="20" :name="name" class="g-mr-4" />
            <span class="name">{{ name || '-' }}</span>
        </span>
    </el-tooltip>
</template>

<script setup lang='ts'>
import AvatarComp from './AvatarComp.vue';

defineProps<{
    name: string,
}>();
</script>
