<template>
    <el-dialog width="420px" :close-on-click-modal="false" @closed="emits('update:modelValue', false)">
        <template #header>
            <div class="modal_title">
                项目重命名
            </div>
        </template>

        <div>
            <el-input v-model="value" maxlength="80" show-word-limit placeholder="请输入项目名称"></el-input>
        </div>
        <div class="btns">
            <el-button class="cancle_btn" @click="emits('update:modelValue', false)">取消</el-button>
            <el-button @click="confirmHandle">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { renameApi } from 'api/project';
import { ref } from 'vue';
import { showMessage } from '@/utils/tools';

const props = defineProps(['renameDialog']);
const emits = defineEmits(['update:modelValue']);
const value = ref<string>(props.renameDialog.project_name);

const confirmHandle = async () => {
    try {
        await renameApi({
            project_id: props.renameDialog.project_id,
            project_name: value.value,
        });
        showMessage('重命名成功', 'success');
        emits('update:modelValue', false);
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.btns {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>
