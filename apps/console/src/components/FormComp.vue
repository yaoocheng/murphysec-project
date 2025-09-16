<template>
    <el-form ref="ruleFormRef" label-position="top" :hide-required-asterisk="true">
        <slot />
    </el-form>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';

const ruleFormRef = ref<FormInstance>();
</script>

<style lang='less' scoped>
.config_form_item :deep(.el-form-item) {
    margin-bottom: 40px;
}

.config_form_item :deep(.el-form-item) .el-form-item__label {
    margin-bottom: 15px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
    color: #3c3c3c;
}
</style>
