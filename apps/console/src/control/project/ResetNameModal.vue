<template>
    <el-dialog width="420px" :close-on-click-modal="false" @closed="emits('update:modelValue', false)">
        <template #header>
            <div class="modal_title">
                项目组重命名
            </div>
            <div class="modal_desc">
                给你的项目组取个有趣的名字
            </div>
        </template>

        <div>
            <el-input v-model="value" placeholder="请输入项目组名称"></el-input>
        </div>
        <div class="btns">
            <el-button class="cancle_btn" @click="emits('update:modelValue', false)">取消</el-button>
            <el-button @click="confirmHandle">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { resetClassNameApi } from 'api/project';
import { ref } from 'vue';
import store from 'util/store';
import { showMessage } from '@/utils/tools';

const props = defineProps(['id', 'oldName']);
const emits = defineEmits(['update:modelValue']);
const value = ref<string>(props.oldName);

const confirmHandle = async () => {
    try {
        await resetClassNameApi({ team_id: store.teamInfo.team_id, projects_id: props.id, projects_name: value.value });
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
