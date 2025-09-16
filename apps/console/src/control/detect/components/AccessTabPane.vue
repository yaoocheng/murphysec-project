<template>
    <el-tab-pane :name="names.value">
        <template #label>
            <div class="label flex items-center">
                <JetBrainsSvg :w="18" :type="names.svg" v-if="names.svg" />
                <img class="w-[18px]" v-else :src="getAccessImg(names.value)" alt="">
                <span class="ml-1">{{ names.label }}</span>
            </div>
        </template>
        <slot />
    </el-tab-pane>
</template>

<script setup lang='ts'>
import { getAccessImg } from 'util/tools';
import JetBrainsSvg from './JetBrainsSvg.vue';

defineProps<{
    names: any
}>();

</script>
