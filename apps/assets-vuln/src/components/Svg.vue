<template>
    <svg width="16px" height="16px" aria-hidden="true">
        <use :href="`#icon-${name}`" :fill="color" />
    </svg>
</template>

<script setup>
defineProps({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: '#999',
    },
});
</script>
