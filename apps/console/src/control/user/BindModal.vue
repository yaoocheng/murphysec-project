<template>
    <el-dialog :title="bindData.title" :close-on-click-modal="false" width="450px"
        @close="emits('update:modelValue', false)">
        <div class="bind_wrap">
            <FormComp :rules="bindData.title === '绑定手机号' ? rules1 : rules2" :model="formData">
                <el-form-item prop="value">
                    <el-input v-model="formData.value" :placeholder="bindData.placeholder"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="item">
                        <el-input v-model="formData.code" placeholder="验证码"></el-input>
                        <el-button @click="sendVerifyCode" style="margin-left: 10px;">
                            {{ countDown === 0 ? '获取验证码' : `${countDown}s重新获取` }}
                        </el-button>
                    </div>
                </el-form-item>
            </FormComp>

            <div class="btns item">
                <el-button class="cancle_btn" @click="emits('update:modelValue', false)">取消</el-button>
                <el-button @click="confirmBindHandle">确认</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { validateEmail, validatePhone } from 'util/verify';
import { updateUserInfoHandle, showMessage } from 'util/tools';
import { getVerifyCodeHandle } from 'util/auth';
import { bindPhone, bindEmail } from '@/api/user';
import FormComp from '@/components/FormComp.vue';

const emits = defineEmits(['update:modelValue']);
const props = defineProps(['bindData']);

const countDown = ref<number>(0);

interface formDataType {
    value: string,
    code: string,
}
const formData = reactive<formDataType>({
    value: '',
    code: '',
});
const rules1 = reactive({
    value: [{ validator: validatePhone }],
});
const rules2 = reactive({
    value: [{ validator: validateEmail }],
});

// 发送验证码
const sendVerifyCode = () => {
    if (countDown.value === 0) {
        getVerifyCodeHandle(formData.value.trim(), 'bind', countDown);
    }
};

const updateHandle = async () => {
    await updateUserInfoHandle();
    emits('update:modelValue', false);
    formData.code = '';
    formData.value = '';
    showMessage('绑定成功', 'success');
};
// 确认
const confirmBindHandle = async () => {
    if (props.bindData.title === '绑定手机号') {
        const res = await bindPhone({ phone: formData.value, verify_code: formData.code });
        if (res.data.code === 200) {
            updateHandle();
        }
    } else {
        const res = await bindEmail({ email: formData.value, verify_code: formData.code });
        if (res.data.code === 200) {
            updateHandle();
        }
    }
};
</script>

<style lang='less' scoped>
.bind_wrap {
    .item {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .btns {
        margin-top: 30px;
    }
}
</style>
