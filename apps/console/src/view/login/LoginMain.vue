<template>
    <!-- 登录 -->
    <div class="login_handle">
        <div class="tab" v-if="defaultLogin === 'email'">邮箱登录</div>
        <div class="tab" v-else-if="defaultLogin === 'ad'">AD/LDAP</div>
        <!-- <div class="tab" v-else-if="defaultLogin === 'oauth'">OAuth</div> -->

        <!-- 密码 -->
        <div v-if="defaultLogin === 'email'">
            <div class="input_comp">
                <div class="name">邮箱</div>
                <div>
                    <el-input style="width: 320px;" @keydown.enter.prevent="loginHandle(loginApi, formData1)"
                              @input="formData1.account = formData1.account.trim()" v-model="formData1.account"
                              placeholder="请输入邮箱"></el-input>
                </div>
            </div>
            <div class="input_comp">
                <div class="name">密码 <span v-if="config.can_forgot_password" @click="store.loginType = 2">忘记密码？</span>
                </div>
                <div>
                    <el-input type="password" show-password style="width: 320px;"
                              @keydown.enter.prevent="loginHandle(loginApi, formData1)"
                              @input="formData1.password = formData1.password.trim();" v-model="formData1.password"
                              placeholder="请输入密码"></el-input>
                </div>
            </div>
            <el-button style="margin-top: 24px;" :loading="loading"
                       @click="loginHandle(loginApi, formData1)">登录</el-button>
            <div v-if="config.can_register" class="reg">还没有账号？去 <span @click="toRegisterHandle">注册</span></div>
        </div>

        <!-- ad -->
        <div v-else-if="defaultLogin === 'ad'">
            <div v-if="isAdLogin">
                <div class="input_comp">
                    <div class="name">用户名</div>
                    <div>
                        <el-input style="width: 320px;" v-model="formData2.account"
                                  @keydown.enter.prevent="loginHandle(adLoginApi, formData2)"
                                  @input="formData2.account = formData2.account.trim();" placeholder="请输入LDAP用户名"></el-input>
                    </div>
                </div>
                <div class="input_comp">
                    <div class="name">密码</div>
                    <div>
                        <el-input type="password" show-password style="width: 320px;"
                                  @keydown.enter.prevent="loginHandle(adLoginApi, formData2)"
                                  @input="formData2.password = formData2.password.trim()" v-model="formData2.password"
                                  placeholder="请输入密码"></el-input>
                    </div>
                </div>
                <el-button style="margin-top: 24px;" :loading="loading"
                           @click="loginHandle(adLoginApi, formData2)">登录</el-button>
            </div>

            <!-- 不支持AD -->
            <div v-else>
                <NoDataVue :image-size="150" description=" " />
                <div class="desc">
                    <p>暂不支持AD登录</p>
                    <p class="contact">请联系管理员在后台配置AD</p>
                </div>
            </div>
        </div>

        <!-- oauth -->
        <div class="flex flex-col items-center" v-else-if="defaultLogin === 'oauth'">
            <img class="w-[120px]" src="~/ast/img/oauth_logo.png" alt="">
            <a :href="oauthUrl" v-if="oauthUrl">
                <el-button style="width: 320px;margin-top: 24px;">OAuth 登录</el-button>
            </a>
            <div class="mt-6 font-medium text-3c" v-else>未配置OAuth，暂不支持登录</div>
        </div>

        <div v-if="loginOptions.length > 1">
            <div class="g-flex g-align-center g-mt-32 g-mb-16">
                <div class="line g-flex-grow-1"></div>
                <div class="g-f-13 g-color-3 g-fw-400 g-mr-10 g-ml-10">其他登录方式</div>
                <div class="line g-flex-grow-1"></div>
            </div>

            <div class="g-flex g-align-center g-justify-center g-fw-400 g-color-1 g-f-13 g-cursor-pointer">
                <div @click="[defaultLogin, otherLogin1] = [otherLogin1, defaultLogin]">
                    {{ loginMode[otherLogin1] }}
                </div>

                <el-divider class="mx-4" v-if="loginOptions.length > 2" direction="vertical" />

                <div v-if="loginOptions.length > 2" @click="[defaultLogin, otherLogin2] = [otherLogin2, defaultLogin]">
                    {{ loginMode[otherLogin2] }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, onBeforeMount } from 'vue';
import store from 'util/store';
import {
    loginApi, isAdLoginApi, adLoginApi, isRegisterApi, isOauthApi,
} from 'api/login';
import { useRouter } from 'vue-router';
import { getUserConfigApi } from 'api/user';
import { getOrgUserInfo } from './hook';
import NoDataVue from '@/components/NoData.vue';
import { showMessage, aes, localStorageUtil } from '@/utils/tools';

const loading = ref(false);
const router = useRouter();
const isAdLogin = ref<boolean>(false);
const defaultLogin = ref<string>();
interface LoginFormData {
    account: string;
    password: string;
    redirect_type: string;
    redirect_url: string;
    encrypt_type: string;
}

const defaultFormData: Partial<LoginFormData> = {
    redirect_type: 'private',
    redirect_url: '',
    encrypt_type: 'mfs',
};

const formData1 = reactive<LoginFormData>({
    ...defaultFormData,
    account: process.env.NODE_ENV === 'development' ? 'test@test.com' : '',
    password: process.env.NODE_ENV === 'development' ? 'MLCCB_66DCaa_318B' : '',
} as LoginFormData);

const formData2 = reactive<LoginFormData>({
    ...defaultFormData,
    account: '',
    password: '',
} as LoginFormData);

const oauthUrl = ref<string>('');
const config = ref<any>({});
const otherLogin1 = ref<any>('ad');
const otherLogin2 = ref<any>('oauth');
const loginOptions = ref<any[]>([]);
const loginMode: any = {
    ad: 'AD/LDAP',
    oauth: 'OAuth',
    email: '邮箱登录',
};

// 初始化OAuth配置
const initOAuthConfig = async () => {
    try {
        const { data } = await isOauthApi();
        oauthUrl.value = data.url;
        if (data.logout) {
            localStorageUtil('set', 'logout', data.logout);
        }
    } catch (error) {
        console.error('初始化OAuth配置失败:', error);
    }
};

// 初始化AD登录配置
const initADLoginConfig = async () => {
    try {
        const res = await isAdLoginApi();
        if (res.data.code === 200) {
            isAdLogin.value = res.data.data;
        }
    } catch (error) {
        console.error('初始化AD登录配置失败:', error);
    }
};

// 初始化用户配置
const initUserConfig = async () => {
    try {
        const { data } = await getUserConfigApi();
        config.value = data;

        Object.assign(store.conf, { is_open_team_ext: data.is_open_team_ext });
        localStorageUtil('set', 'g-conf', store.conf);

        defaultLogin.value = data.config_default_login_type || 'email';
        loginOptions.value = data.login_options.filter((item: any) => item.value).map((ele: any) => ele.key);
        [otherLogin1.value, otherLogin2.value] = loginOptions.value.filter((item) => item !== defaultLogin.value);
    } catch (error) {
        console.error('初始化用户配置失败:', error);
        // showMessage('获取用户配置失败，请重试', 'error');
    }
};

onBeforeMount(async () => {
    await Promise.all([
        initOAuthConfig(),
        initADLoginConfig(),
        initUserConfig(),
    ]);
});

// 重定向处理
const handleRedirect = (redirectUrl: string) => {
    if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
        window.location.href = redirectUrl;
        return true;
    }
    return false;
};

// 登录
const loginHandle = async (requestFn: Function, formData: {
    account: string;
    password: string;
    redirect_type: string;
    redirect_url: string | null;
    encrypt_type: string;
}) => {
    try {
        loading.value = true;
        const urlParams = new URLSearchParams(window.location.search);
        formData.redirect_url = urlParams.get('redirect_url');

        const res = await requestFn({
            ...formData,
            password: aes(formData.password),
        });

        if (res.data.code === 200) {
            const responseRedirectUrl = res.data.data.re_url;

            // 处理重定向
            if (handleRedirect(responseRedirectUrl)) {
                return;
            }

            try {
                const data = await getOrgUserInfo(res.data.data.ticket);

                if (localStorageUtil('get', 'enforce_password_changed')) {
                    router.push('/pwd');
                    return;
                }
                // eslint-disable-next-line no-unused-expressions
                data ? router.push('/no-team') : router.push('/platform/index');
            } catch (error) {
                console.error('获取用户组织信息失败:', error);
                // showMessage('获取用户组织信息失败，请重试', 'error');
            }
        }
    } catch (error) {
        console.error('登录请求失败:', error);
    } finally {
        loading.value = false;
    }
};

// 去注册
const toRegisterHandle = async () => {
    try {
        const res = await isRegisterApi();
        if (res.data.code === 200 && res.data.data) {
            store.loginType = 3;
        } else {
            showMessage('暂不支持自行注册，请联系管理员', 'warning');
        }
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.login_handle {
    // margin-top: 100px;

    .tab {
        font-weight: 400;
    }
}

.line {
    border-bottom: 1px dashed rgba(42, 43, 50, 0.10);
}

.tab.active_tab {
    color: #6C87FF;
}

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

.desc {
    // position: relative;
    // top: -50px;
    color: @text-color;
    font-weight: 500;
    text-align: center;

    .contact {
        font-size: 14px;
        color: #858585;
        margin-top: 8px;
    }
}
</style>
