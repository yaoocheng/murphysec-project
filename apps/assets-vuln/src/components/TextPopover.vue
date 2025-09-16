<template>
    <a-tooltip placement="top" :overlayClassName="`max-w-[${width}px]`">
        <template #title>
            <div :class="`text-white`">
                {{ text }}
            </div>
        </template>

        <slot />
    </a-tooltip>
</template>

<script setup>
defineProps({
    width: {
        type: Number,
        default: 400,
    },
    text: {
        type: String,
        default: '',
    },
});
</script>
