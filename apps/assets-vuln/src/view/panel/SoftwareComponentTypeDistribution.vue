<template>
    <div v-if="!options.length">
        <a-empty  />
    </div>

    <div v-else class="w-full flex flex-col gap-4">
        <div class="w-full h-4">
            <div v-for="(item, index) in options" :key="item.id"
                 :style="{
                     backgroundColor: colorMap[index],
                     width: sumCount ? `${item.count / sumCount * 100}%` : '0%',
                     height: '100%'
                 }">
            </div>
        </div>

        <div class="w-full flex-1">
            <div v-for="(item, index) in options" :key="item.id"
                 class="flex justify-between h-10 items-center"
                 :class="{ 'border-b border-gray-200': index !== options.length - 1 }">
                <div class="flex items-center gap-2">
                    <div :style="{ backgroundColor: colorMap[index], width: '12px', height: '5px', borderRadius: '20px' }"></div>
                    <span class="text-[14px]">{{ item.component_type }}</span>
                </div>
                <div class="flex items-center gap-2 justify-center">
                    <span class="items-center">{{ item.count }}</span>
                    <span class="text-gray-500 font-normal">
                        ({{ (item.count / sumCount * 100).toFixed(0) }}%)
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const { options } = defineProps(['options']);

const sumCount = computed(() => options.reduce((acc, curr) => acc + curr.count, 0));

// 生成随机颜色
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// 生成不重复的颜色数组
const generateUniqueColors = (count) => {
    const colors = new Set();
    while (colors.size < count) {
        colors.add(getRandomColor());
    }
    return Array.from(colors);
};

// 为每个选项生成不重复的颜色
const colorMap = generateUniqueColors(options.length);

</script>
