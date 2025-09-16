<template>
    <div class="h-full w-full login-wrap flex justify-center items-center">
        <div class="mid w-[400px] bg-white rounded-2xl py-20 px-10">
            <div class="text-2xl font-semibold mb-6 text-center text-[#666666]">
                {{ IsAccountLogin ? '账密登录' : 'LDAP登录' }}
            </div>
            <a-form :model="formState" layout="vertical">
                <a-form-item :label="IsAccountLogin? '账号' : '用户名'" name="username">
                    <a-input class="base-input" size="large" v-model:value="formState.username" :placeholder="IsAccountLogin? '请输入账号' : '请输入LDAP用户名'" />
                </a-form-item>

                <a-form-item label="密码" name="password">
                    <a-input-password class="base-input" size="large" v-model:visible="visible" v-model:value="formState.password" placeholder="请输入密码" />
                </a-form-item>

                <a-form-item>
                    <a-button @click="loginHandle" :loading="loading" type="primary"
                              class="w-full text-base h-[34px] base-button" :disabled="!formState.username || !formState.password">登录</a-button>
                </a-form-item>
            </a-form>

            <div>
                <!-- 其他登录方式部分 -->
                <div class="flex align-center justify-center">
                    <a-divider  style="border-color: #3C3C3C1A" dashed>
                        <span class="font-normal text-sm leading-22 tracking-0 text-gary-400">
                            其他登录方式
                        </span>
                    </a-divider>
                </div>

                <!-- AD/LDAP 和 OAuth 部分 -->
                <div class="flex align-center justify-center cursor-pointer">
                    <div @click='ModifyLoginMethod'>
                        {{ !IsAccountLogin ? '账号登录' : 'LDAP' }}
                    </div>

                    <!-- 垂直分割线 -->
                    <!-- <div class="mx-4">
                        <a-divider type="vertical" />
                    </div>

                    <div>
                        OAuth
                    </div> -->
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { loginApi, adLoginApi, getPowerApi } from 'api/user';
import { getGlobalOrgTreeApi } from 'api/org';
import { useRouter } from 'vue-router';
import { ROUTER_PATH } from '@/constants';
import { userInfo, authModuleNavs } from '@/store';

const router = useRouter();
const visible = ref(false);
const loading = ref(false);
const formState = reactive({
    username: process.env.NODE_ENV === 'development' ? 'admin' : '',
    password: process.env.NODE_ENV === 'development' ? 'MLCCB_66DCaa_318B' : '',
});

const IsAccountLogin = ref(true);

const loginHandle = async () => {
    try {
        if (IsAccountLogin.value) {
            const { data } = await loginApi(formState);
            userInfo.value = data.data;
        } else {
            // LDAP login logic can be added here
            const { data } = await adLoginApi(formState);
            userInfo.value = data.data;
        }

        const { data: orgData } = await getGlobalOrgTreeApi();
        userInfo.value.org_id = orgData.data[0]?.organize_id;

        const { data: powerData } = await getPowerApi();
        authModuleNavs.value = powerData.data.functional_permissions?.map((item) => ROUTER_PATH[item]) || [];

        const redirect = sessionStorage.getItem('redirect');
        if (redirect) {
            router.push(redirect);
            sessionStorage.removeItem('redirect');
        } else {
            router.push(authModuleNavs.value.includes(ROUTER_PATH.dashboard) ? ROUTER_PATH.dashboard : authModuleNavs.value[0]);
        }
    } catch (error) {
        console.log(error);
    }
};

const ModifyLoginMethod = () => {
    IsAccountLogin.value = !IsAccountLogin.value;
    formState.password = '';
    formState.username = '';
    visible.value = false;
};
</script>

<style>
.mid {
    box-shadow: 0px 4px 24px 0px #66666624;
}

.login-wrap {
    background-image: url('@/assets/img/login-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
}
</style>
