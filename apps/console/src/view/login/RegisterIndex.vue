<template>
    <div class="register" v-loading="loading">
        <div class="tab">免费注册</div>
        <div class="input_comp">
            <div class="name">邮箱</div>
            <div>
                <el-input style="width: 320px;" v-model="formData.account" placeholder="请输入邮箱"></el-input>
            </div>
        </div>
        <div class="input_comp">
            <div class="name">昵称</div>
            <div>
                <el-input style="width: 320px;" v-model="formData.username" placeholder="请输入昵称"></el-input>
            </div>
        </div>
        <div class="input_comp">
            <div class="name">密码</div>
            <div>
                <el-input style="width: 320px;" type="password" show-password v-model="formData.password"
                    placeholder="须8-20位，含至少一个特殊字符"></el-input>
            </div>
        </div>
        <div class="input_comp">
            <div class="name">确认密码</div>
            <div>
                <el-input style="width: 320px;" type="password" show-password v-model="formData.password2"
                    placeholder="请输入确认密码"></el-input>
            </div>
        </div>
        <el-button @click="registerHandle">注册</el-button>
        <div class="reg">已有账号，直接 <span @click="store.loginType = 1">登录</span></div>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { registerApi } from 'api/login';
import store from 'util/store';
import { aes, showMessage } from 'util/tools';
import { useRouter } from 'vue-router';
import { getOrgUserInfo } from './hook';

const loading = ref(false);
const router = useRouter();
const formData = reactive<{
    account: string,
    username: string,
    password: string,
    password2: string,
    redirect_type: string,
    redirect_url: string | null,
    encrypt_type: string,
}>({
    account: '', // 账号 邮箱或手机号
    username: '', // 昵称
    password: '', // 密码
    password2: '', // 确认密码
    redirect_type: 'private',
    redirect_url: '',
    encrypt_type: 'mfs',
});

const verifyEmail = (email: string) => {
    // eslint-disable-next-line no-control-regex
    const r = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return r.test(email.trim());
};

const registerHandle = async () => {
    if (!verifyEmail(formData.account)) {
        showMessage('请输入正确的邮箱', 'warning');
        return;
    }
    try {
        loading.value = true;
        const urlParams = new URLSearchParams(window.location.search);
        formData.redirect_url = urlParams.get('redirect_url');
        const res = await registerApi({
            ...formData,
            password: aes(formData.password),
            password2: aes(formData.password2),
        });
        if (res.data.code === 200) {
            const responseRedirectUrl = res.data.data.re_url;
            if (responseRedirectUrl.startsWith('http://') || (responseRedirectUrl.startsWith('https://'))) {
                window.location.href = responseRedirectUrl;
                return;
            }
            try {
                const data = await getOrgUserInfo(res.data.data.ticket);
                // eslint-disable-next-line no-unused-expressions
                data ? router.push('/no-team') : router.push('/platform/index');
                loading.value = false;
            } catch (error) {
                loading.value = false;
                console.log(error);
            }
            // window.location.href = `/console/platform/index${res.data.data.re_url}`;
        } else {
            loading.value = false;
        }
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.register {
    margin-top: 58px;

    .reg {
        font-size: 12px;
        color: #858585;
        margin-top: 6px;
        text-align: right;

        span {
            cursor: pointer;
            color: #6C87FF;
        }
    }
}
</style>
