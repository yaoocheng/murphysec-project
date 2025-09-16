<template>
    <a-modal class="change-password-modal" title="修改密码" width="368px" @ok="changePassword" @cancel="emit('update:open', false)" :okButtonProps="{ disabled: okBtndisabled }">
        <div class="pt-3 pb-0">
            <a-form class="base-form" ref="formRef" :model="formState" :rules="rules" layout="vertical" autocomplete="off">
                <a-form-item label="" name="nowPassword">
                    <a-input-password
                        size="large"
                        class="base-input"
                        v-model:value="formState.nowPassword"
                        placeholder="请输入当前密码"
                    />
                </a-form-item>
                <a-form-item label="" name="newPassword">
                    <a-input-password
                        size="large"
                        class="base-input"
                        v-model:value="formState.newPassword"
                        placeholder="请输入新密码"
                    />
                </a-form-item>
                <a-form-item label="" name="confirmPassword">
                    <a-input-password
                        size="large"
                        class="base-input"
                        v-model:value="formState.confirmPassword"
                        placeholder="请再次输入新密码"
                    />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue';
import {
    computed, reactive, ref,
} from 'vue';
import { updatePasswordApi, logoutApi } from '@/api/user';
import router from '@/router';
import { userInfo, authModuleNavs } from '@/store';

const emit = defineEmits(['update:open']);
const formRef = ref(null);

// 验证密码合法性
const isValidPassword = (password) => {
    // 至少8位，包含大小写字母及数字
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

const formState = reactive({
    nowPassword: '',
    newPassword: '',
    confirmPassword: '',
});

// 表单验证规则
const rules = {
    nowPassword: [
        { required: true, message: '当前密码不能为空', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        {
            validator: (rule, value) => {
                if (value && value === formState.nowPassword) {
                    return Promise.reject(new Error('新密码不能与当前密码相同'));
                }
                if (value && !isValidPassword(value)) {
                    return Promise.reject(new Error('密码需至少8位，包含大小写字母及数字'));
                }
                return Promise.resolve();
            },
            trigger: 'blur',
        },
    ],
    confirmPassword: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        {
            validator: (rule, value) => {
                if (value && value !== formState.newPassword) {
                    return Promise.reject(new Error('两次输入的密码不一致'));
                }
                return Promise.resolve();
            },
            trigger: 'blur',
        },
    ],
};

// 检查表单字段是否为空
const okBtndisabled = computed(() => !formState.nowPassword || !formState.newPassword || !formState.confirmPassword);

// 修改密码函数
const changePassword = async () => {
    try {
        // 验证表单
        await formRef.value.validate();

        // 构建API参数
        const params = {
            password: formState.nowPassword,
            password_first: formState.newPassword,
            password_second: formState.confirmPassword,
        };

        // 调用接口修改密码
        await updatePasswordApi(params);
        message.success('修改密码成功');

        try {
            await logoutApi();
            setTimeout(() => {
                router.push('/login');
                userInfo.value = {};
                authModuleNavs.value = [];
            }, 500);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.error(error);
    }
};

</script>

<style scoped>
.base-input {
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    padding: 8px 12px;
}

.error-input {
    border: 1px solid #BF1C0D !important; /* 设置红色边框 */
}

.error-message {
    color: #BF1C0D;
    font-size: 12px;
}
</style>

<style>
.change-password-modal{
    .ant-btn-primary{
            margin-inline-start: 12px !important;
    }
}
</style>
