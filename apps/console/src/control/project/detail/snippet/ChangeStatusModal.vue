<template>
    <el-dialog @close="emits('update:modelValue', false)" class="status-modal" width="420" title="批量修改状态">
        <el-radio-group v-model="statusRadio">
            <el-radio :value="2">待确认</el-radio>
            <el-radio :value="3">已确认</el-radio>
            <el-radio :value="1">已忽略</el-radio>
        </el-radio-group>
        <template #footer>
            <el-button @click="emits('update:modelValue', false)" class="minor_white_btn">取消</el-button>
            <el-button @click="emits('updateHandle', statusRadio); emits('update:modelValue', false)" class="w-20">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const emits = defineEmits(['update:modelValue', 'updateHandle']);
const statusRadio = ref(2);
</script>

<style lang="less">
.status-modal {
    .el-dialog__header {
        padding-bottom: 16px !important;
    }
}
</style>
