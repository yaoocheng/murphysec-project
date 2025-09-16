<template>
    <div class="white-card">
        <h3 class="card-title">插件配置</h3>

        <!-- 动态渲染配置字段 -->
        <a-form layout="vertical" class="config-form" :model="props.configData" ref="formRef">
            <template v-if="props.selectedTemplate?.required_params_schema?.length">
                <a-form-item
                    v-for="param in props.selectedTemplate.required_params_schema"
                    :key="param.key"
                    :label="param.label"
                    :name="param.key"
                    :rules="props.viewMode ? [] : (param.required === true ? [{ required: true, message: `${param.label}不能为空` }] : [])"
                >
                    <!-- 描述信息 -->
                    <div v-if="param.desc" class="field-desc">{{ param.desc }}</div>

                    <!-- 密码类型 -->
                    <a-input-password
                        v-if="param.type === 'password'"
                        :value="props.configData[param.key]"
                        @change="handleFieldChange(param.key, $event.target.value)"
                        :placeholder="`请输入${param.label}`"
                        class="base-input"
                        :disabled="props.viewMode"
                    />
                    <!-- 数字类型 -->
                    <a-input-number
                        v-else-if="param.type === 'number' || param.type === 'integer'"
                        :value="props.configData[param.key]"
                        @change="handleFieldChange(param.key, $event)"
                        :placeholder="`请输入${param.label}`"
                        class="base-input w-full"
                        :min="param.min"
                        :max="param.max"
                        :disabled="props.viewMode"
                    />
                    <!-- 选择类型 -->
                    <a-select
                        v-else-if="param.type === 'select' && param.options"
                        :value="props.configData[param.key]"
                        @change="handleFieldChange(param.key, $event)"
                        :placeholder="`请选择${param.label}`"
                        class="base-input w-full"
                        :disabled="props.viewMode"
                    >
                        <a-select-option
                            v-for="option in param.options"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                    <!-- 文本区域类型 -->
                    <a-textarea
                        v-else-if="param.type === 'textarea'"
                        :value="props.configData[param.key]"
                        @change="handleFieldChange(param.key, $event.target.value)"
                        :placeholder="`请输入${param.label}`"
                        class="base-input"
                        :rows="3"
                        :disabled="props.viewMode"
                    />
                    <!-- 默认文本类型 -->
                    <a-input
                        v-else
                        :value="props.configData[param.key]"
                        @change="handleFieldChange(param.key, $event.target.value)"
                        :placeholder="`请输入${param.label}`"
                        class="base-input"
                        :disabled="props.viewMode"
                    />
                </a-form-item>
            </template>

            <!-- 如果没有配置参数，显示提示 -->
            <div v-else class="no-config-tip">
                <div class="tip-content">
                    <Svg name="icon_info_colorful" class="tip-icon" />
                    <span>此模板无需额外配置参数</span>
                </div>
            </div>
        </a-form>

    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import Svg from '@/components/Svg.vue';

const formRef = ref();

const props = defineProps({
    selectedTemplate: {
        type: Object,
        default: null,
    },
    configData: {
        type: Object,
        default: () => ({}),
    },
    viewMode: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:config']);

// 处理字段值变化
const handleFieldChange = (key, value) => {
    emit('update:config', key, value);

    // 下一个tick清除该字段的验证错误
    nextTick(() => {
        if (formRef.value) {
            formRef.value.clearValidate([key]);
        }
    });
};

// 暴露表单验证方法
const validateFields = () => {
    if (!formRef.value) return Promise.resolve();
    return formRef.value.validateFields();
};

// 暴露表单引用给父组件
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

/* 配置表单 */
.config-form {
    margin: 0;
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

:deep(.ant-form-item-required::before) {
    color: #ff4d4f;
}

/* 输入框统一样式 */
:deep(.base-input),
:deep(.ant-input),
:deep(.ant-input-password),
:deep(.ant-input-number),
:deep(.ant-select),
:deep(.ant-textarea) {
    border-radius: 6px;
    border-color: #d1d5db;
    font-size: 14px;
    transition: all 0.2s;
}

:deep(.base-input:focus),
:deep(.ant-input:focus),
:deep(.ant-input-password:focus),
:deep(.ant-input-number:focus),
:deep(.ant-select:focus),
:deep(.ant-textarea:focus) {
    border-color: #6c87ff;
    box-shadow: 0 0 0 2px rgba(108, 135, 255, 0.1);
}

:deep(.ant-input-number) {
    width: 100%;
}

:deep(.ant-select) {
    width: 100%;
}

/* 字段描述样式 */
.field-desc {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
    line-height: 1.5;
    background: #f8fafc;
    padding: 8px 12px;
    border-radius: 4px;
    border-left: 3px solid #e2e8f0;
}

/* 无配置参数提示 */
.no-config-tip {
    padding: 20px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin: 16px 0;
}

.tip-content {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #6b7280;
    font-size: 14px;
}

.tip-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

/* 工具类 */
.w-full {
    width: 100%;
}

.mr-2 {
    margin-right: 8px;
}
</style>
