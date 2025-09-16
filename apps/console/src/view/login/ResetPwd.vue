<template>
    <div class="reset_pwd">
        <div class="tab" @click="store.loginType = 1"><i class="murphy icon-fanhui1 g-f-24"></i>找回密码</div>
        <div class="input_comp">
            <div class="name">邮箱</div>
            <div>
                <el-input style="width: 320px;" v-model="formData.account" placeholder="请输入邮箱"></el-input>
            </div>
        </div>
        <div class="input_comp">
            <div class="name">验证码</div>
            <div class="verify">
                <el-input style="width: 320px;" v-model="formData.verify_code" placeholder="请输入验证码"></el-input>
                <el-button @click="sendVerifyCode" v-if="countDown === 0" class="minor_btn">获取验证码</el-button>
                <el-button class="minor_btn" v-if="countDown !== 0">
                    {{ countDown }}s后重新获取
                </el-button>
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
                <el-input style="width: 320px;" type="password"  show-password v-model="formData.password2"
                    placeholder="请输入确认密码"></el-input>
            </div>
        </div>
        <el-button @click="confirmHandle">确认</el-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { getVerifyCodeApi, forgetPasswordApi, isGetCodeApi } from 'api/login';
import { showMessage, aes } from 'util/tools';
import store from 'util/store';

const formData = reactive<any>({
    account: '',
    verify_code: '',
    password: '',
    password2: '',
    encrypt_type: 'mfs',
});
const countDown = ref<number>(0);

// 验证码
const sendVerifyCode = async () => {
    try {
        const res = await isGetCodeApi();
        if (res.data.code === 200 && res.data.data) {
            const res1 = await getVerifyCodeApi({
                account: formData.account, // 账号 邮箱或手机号
                type: 'forget', // 类型 register-注册  forget-忘记密码  bind-绑定
            });
            if (res1.data.code === 200) {
                showMessage('发送成功', 'success');
                countDown.value = 60;
                const timer = setInterval(() => {
                    if (countDown.value === 1) {
                        clearInterval(timer);
                    }
                    countDown.value -= 1;
                }, 1000);
            }
        } else {
            showMessage('无法发送验证码，请联系管理员配置邮件服务器', 'warning');
        }
    } catch (error) {
        console.log(error);
    }
};

// 确认修改
const confirmHandle = async () => {
    try {
        const res = await forgetPasswordApi({
            ...formData,
            password: aes(formData.password),
            password2: aes(formData.password2),
        });
        if (res.data.code === 200) {
            showMessage('密码设置成功', 'success');
            store.loginType = 1;
        }
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.reset_pwd {
    margin-top: 70px;
    .tab {
        font-weight: 400
    }
    .verify {
        .between();

        .el-button {
            width: auto;
            margin-top: 0;
            margin-left: 10px;
            font-size: 14px;
        }
    }
}
</style>
