<template>
    <el-dialog width="420px" :close-on-click-modal="false">
        <template #header>
            <div class="modal_title">
                <i class="murphy icon-jinggaotubiaosvg" style="margin-right: 6px; font-size: 20px;color:#FF9940;font-weight: 500;"></i>
                删除项目组
            </div>
            <div class="modal_desc" style="color: #3c3c3c;padding-left: 32px;">
                该项目组中存在项目时，将无法删除项目组
            </div>
        </template>
        <div class="btns">
            <el-button class="cancle_btn" @click="emits('update:modelValue', false)">取消</el-button>
            <el-button style="background-color: #F34D3D;" @click="confirmHandle">删除</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { deleteClassNameApi } from 'api/project';
import { showMessage } from 'util/tools';

const props = defineProps(['id']);
const emits = defineEmits(['update:modelValue']);

const confirmHandle = async () => {
    try {
        await deleteClassNameApi({ projects_id: props.id });
        showMessage('删除成功', 'success');
        emits('update:modelValue', false);
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
