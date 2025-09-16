<template>
    <svg aria-hidden="true">
        <use :href="symbolId" :fill="props.color" />
    </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface IProps {
    prefix?: string;
    name: string;
    color?: string;
}

const props = withDefaults(defineProps<IProps>(), {
    prefix: 'icon',
    color: '#3c3c3c',
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>

<style scoped></style>
