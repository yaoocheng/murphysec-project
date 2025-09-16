<template>
    <el-dialog title="修改密码" @close="handleClose" width="620" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="!enforce_password_changed">
        <div v-if="enforce_password_changed" class="tip-box" style="background-color: var(--el-color-primary-light-9); padding: 8px 12px; margin-bottom: 24px; border-radius: 4px; display: flex; align-items: center;">
            <img src="~ast/img/icon_info.png" class="w-4 h-4 mr-1" alt="">
            <!-- <i class="murphy icon-tixing"></i> -->
            <span class="text-primary text-sm">为确保您的账户安全，请立即修改初始密码（当前密码为您的邮箱）。</span>
        </div>

        <el-form :model="form" label-position="top">
            <el-form-item label="当前密码" prop="current_password">
                <el-input v-model="form.current_password" type="password" placeholder="请输入当前密码" show-password style="width: 100%" />
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入新密码" show-password style="width: 100%" />
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
                <el-input v-model="form.password2" type="password" placeholder="请再次输入新密码" show-password style="width: 100%" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" class="w-full h-[34px]" @click="handleSubmit">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { localStorageUtil, getUserInfo, showMessage } from 'util/tools';
import { ElMessage } from 'element-plus';
import { updatePasswordApi } from '@/api/login';
import { quitLogin } from '@/api/user';

const emit = defineEmits(['update:modelValue']);
const enforce_password_changed = localStorageUtil('get', 'enforce_password_changed');

const form = ref({
    current_password: '',
    password: '',
    password2: '',
});

const handleClose = () => {
    form.value.current_password = '';
    form.value.password = '';
    form.value.password2 = '';
    emit('update:modelValue', false);
};

const handleSubmit = async () => {
    if (!form.value.current_password) {
        ElMessage.warning('请输入当前密码');
        return;
    }
    if (!form.value.password) {
        ElMessage.warning('请输入新密码');
        return;
    }
    if (form.value.password !== form.value.password2) {
        ElMessage.warning('两次输入的密码不一致');
        return;
    }
    if (form.value.password === form.value.current_password) {
        ElMessage.warning('新密码不能与当前密码相同');
        return;
    }
    try {
        const res = await updatePasswordApi(form.value);
        if (res.data.code === 200) {
            emit('update:modelValue', false);
            localStorageUtil('remove', 'enforce_password_changed');
            form.value.current_password = '';
            form.value.password = '';
            form.value.password2 = '';

            // 退出登录
            // eslint-disable-next-line no-shadow
            const res = await quitLogin({ token: getUserInfo()?.token });
            if (res.data.code === 200) {
                localStorageUtil('remove', 'g-u');
                localStorageUtil('remove', 'g-t');
                localStorageUtil('remove', 'g-conf');
                localStorageUtil('remove', 'cur-click-org-name');
                localStorageUtil('remove', 'cur-click-path');
                showMessage('修改成功', 'success');
                setTimeout(() => {
                    window.location.href = '/console/login';
                }, 600);
            }
        }
    } catch (error: any) {
        console.log(error);
    }
};

</script>

<style>
.el-form .el-form-item {
    margin-bottom: 16px !important;
}
.el-dialog__footer {
    padding-top: 8px!important;
}
</style>
