<template>
    <div class="white-card">
        <a-form
            class="base-form"
            ref="formRef"
            :model="formData"
            layout="vertical"
        >
            <h3 class="card-title">基本信息</h3>
            <a-form-item
                label="插件名称"
                name="plug_name"
                :rules="viewMode ? [] : [{ required: true, message: '必填项不能为空' }]"
            >
                <a-input
                    class="base-input"
                    :value="formData.plug_name"
                    @update:value="$emit('update:plug_name', $event)"
                    placeholder="输入插件名称"
                    show-count
                    :maxlength="50"
                    :disabled="viewMode"
                />
            </a-form-item>

            <a-form-item
                label="数据接入类型"
                name="plug_data_type"
                :rules="viewMode ? [] : [{ required: true, message: '必填项不能为空' }]"
            >
                <Select
                    class="base-select"
                    :value="formData.plug_data_type"
                    @update:value="$emit('update:plug_data_type', $event)"
                    :options="PLUGIN_TYPE_OPTION"
                    placeholder="请选择数据接入类型"
                    :disabled="viewMode || fromTemplate"
                />
                <div v-if="fromTemplate && !viewMode" class="field-hint">
                    <span class="hint-icon">💡</span>
                    <span class="hint-text">数据接入类型已由模板预设，无需修改</span>
                </div>
            </a-form-item>

            <a-form-item
                label="插件说明"
                name="plug_description"
            >
                <a-textarea
                    class="base-textarea fixed-height-textarea"
                    :value="formData.plug_description"
                    @update:value="$emit('update:plug_description', $event)"
                    placeholder="描述插件的功能和用途（最多100个字符）"
                    :rows="3"
                    :maxlength="100"
                    show-count
                    :auto-size="false"
                    :disabled="viewMode"
                />
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Select from '@/components/Select.vue';
import { PLUGIN_TYPE_OPTION } from '../../constants';

const formRef = ref();

defineProps({
    formData: {
        type: Object,
        required: true,
    },
    viewMode: {
        type: Boolean,
        default: false,
    },
    fromTemplate: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['update:plug_name', 'update:plug_data_type', 'update:plug_description']);

// 暴露表单验证方法
const validateFields = () => formRef.value.validateFields();

defineExpose({
    formRef,
    validateFields,
});
</script>

<style scoped>
/* 白色卡片基础样式 */
.white-card {
    background: white;
    border: 1px solid #e1e8f0;
    padding: 20px;
    border-radius: 8px;
}

/* 卡片标题 */
.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 16px 0;
}

/* 表单项样式 */
:deep(.ant-form-item) {
    margin-bottom: 20px;
}

:deep(.ant-form-item-label) {
    padding-bottom: 6px;
}

:deep(.ant-form-item-label > label) {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
}

/* 输入框统一样式 */
:deep(.base-input),
:deep(.base-select),
:deep(.base-textarea) {
    border-radius: 6px;
    border-color: #d1d5db;
    font-size: 14px;
    transition: all 0.2s;
}

:deep(.base-input:focus),
:deep(.base-select:focus),
:deep(.base-textarea:focus) {
    border-color: #6c87ff;
    box-shadow: 0 0 0 2px rgba(108, 135, 255, 0.1);
}

/* 固定高度的文本区域样式 */
:deep(.fixed-height-textarea) {
    resize: none !important;
}

:deep(.fixed-height-textarea .ant-input) {
    resize: none !important;
    height: 80px !important;
    min-height: 80px !important;
    max-height: 80px !important;
}

/* 隐藏拖动图标 */
:deep(.fixed-height-textarea .ant-input::-webkit-resizer) {
    display: none !important;
}

:deep(.fixed-height-textarea .ant-input-textarea) {
    resize: none !important;
}

/* 确保字符计数显示正确 */
:deep(.fixed-height-textarea.ant-input-textarea-show-count::after) {
    bottom: 8px !important;
    right: 11px !important;
}

/* 字段提示样式 */
.field-hint {
    display: flex;
    align-items: center;
    margin-top: 6px;
    padding: 8px 12px;
    background-color: #f0f9ff;
    border: 1px solid #e0f2fe;
    border-radius: 6px;
    font-size: 13px;
}

.hint-icon {
    margin-right: 6px;
    font-size: 14px;
}

.hint-text {
    color: #0369a1;
    line-height: 1.4;
}
</style>
