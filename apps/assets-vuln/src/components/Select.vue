<template>
    <a-select
        :value="value"
        @update:value="$emit('update:value', $event)"
        :disabled="disabled"
        :placeholder="placeholder"
        :popupClassName="popupClassName"
    >
        <a-select-option v-for="item in processedOptions" :key="item.value" :value="item.value" :disabled="item.disabled" :label="item.label">
            <div class="flex items-center justify-between">
                {{ item.label }}
                <Svg class="check-icon" height="12px" width="12px" name="list-checked" color="#6C87FF"></Svg>
            </div>
        </a-select-option>
        <template #suffixIcon>
            <Svg :height="iconSize" :width="iconSize" name="select-suffix" color="#999999"></Svg>
        </template>
    </a-select>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    iconSize: {
        type: String,
        default: '12px',
    },
    options: {
        type: Array,
        default: () => [],
    },
    popupClassName: {
        type: String,
        default: '',
    },
    fieldNames: {
        type: Object,
        default: () => ({ label: 'label', value: 'value' }),
    },
    value: {
        type: [String, Number, Array],
        default: undefined,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
        default: '',
    },
});

defineEmits(['update:value']);

// 处理options数据，支持fieldNames映射
const processedOptions = computed(() => {
    if (!props.options) return [];

    // 如果提供了fieldNames，则根据fieldNames映射转换options
    if (props.fieldNames && (props.fieldNames.label !== 'label' || props.fieldNames.value !== 'value')) {
        return props.options.map((item) => ({
            label: item[props.fieldNames.label],
            value: item[props.fieldNames.value],
            disabled: item.disabled,
        }));
    }

    // 如果没有提供fieldNames或fieldNames是默认值，则直接返回options
    return props.options;
});
</script>
