<template>
    <el-dialog width="420px" :close-on-click-modal="false" @closed="emits('update:modelValue', false)">
        <template #header>
            <div class="modal_title">
                新建项目组
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
            <el-button @click="createClassHandle">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { createProjectClassApi } from 'api/project';
import { delayReload } from '@/utils/tools';

const emits = defineEmits(['update:modelValue']);
const value = ref<string>('');

const createClassHandle = async () => {
    try {
        await createProjectClassApi({
            team_id: store.teamInfo.team_id,
            projects_name: value.value,
        });
        // showMessage('创建成功', 'success');
        emits('update:modelValue', false);
        delayReload('创建成功', 'success');
        // window.location.reload();
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
