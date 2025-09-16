<template>
    <div class="sug-ques">
        <el-button
            v-for="item in sugQuestion"
            :key="item"
            class="button-dec"
            plain
            @click="
                () => {
                    emits('click', item);
                }
            "
        >
            {{ item }}
        </el-button>
    </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

interface IProps {
    disabled?: boolean;
    sugQuestion?: string[];
}
const props = withDefaults(defineProps<IProps>(), {
    sugQuestion: () => [],
});

const emits = defineEmits<{
    click: [val: string];
}>();

const { sugQuestion } = toRefs(props);
</script>

<style scoped lang="less">
.sug-ques {
    display: flex;
    justify-content: end;
    margin-bottom: 12px;

    :deep(.el-button) {
        border-radius: 6px;
        padding: 0 12px;
        height: 28px;
    }

    .button-dec {
        --el-button-font-weight: 400;
        --el-button-border-color: #6c87ff;
        // --el-button-bg-color: var(--el-fill-color-blank);
        --el-button-text-color: #fff;
        --el-button-disabled-text-color: var(--el-disabled-text-color);
        --el-button-disabled-bg-color: var(--el-fill-color-blank);
        --el-button-disabled-border-color: var(--el-border-color-light);
        // --el-button-divide-border-color: rgba(255, 255, 255, 0.5);
        // --el-button-hover-text-color: var(--el-color-primary);
        --el-button-hover-bg-color: rgba(108, 135, 255, 0.1);
        // --el-button-hover-border-color: var(--el-color-primary-light-7);
        // --el-button-active-text-color: var(--el-button-hover-text-color);
        // --el-button-active-border-color: var(--el-color-primary);
        --el-button-active-bg-color: rgba(108, 135, 255, 0.3);
        --el-button-outline-color: var(--el-color-primary-light-5);
        --el-button-hover-link-text-color: var(--el-color-info);
        --el-button-active-color: var(--el-text-color-primary);
    }

    .button-dec:hover,
    .button-dec:focus {
        color: var(--el-button-hover-text-color) !important;
        border-color: var(--el-button-hover-border-color) !important;
        background-color: var(--el-button-hover-bg-color) !important;
        outline: 0;
    }

    .button-dec:active {
        color: var(--el-button-active-text-color) !important;
        border-color: var(--el-button-active-border-color) !important;
        background-color: var(--el-button-active-bg-color) !important;
        outline: 0;
    }
}
</style>
