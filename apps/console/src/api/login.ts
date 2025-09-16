import axios from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/user/oauth/v2' : '/user/oauth/v2';

/**
 *  账号密码登录
 */
export function loginApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/login/password/user`,
        data,
    });
}

/**
 * 理想登陆换ticket sca嵌入第三方系统登陆
 */
export function insetCompanyLoginApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/login/token/user`,
        data,
    });
}

/**
 * 获取验证码
 */
export function getVerifyCodeApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/send`,
        data,
    });
}

/**
 * 是否可以获取验证码
 */
export function isGetCodeApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/login/can_send`,
    });
}

/**
 * 注册
 */
export function registerApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/register`,
        data,
    });
}

/**
 * 忘记密码
 */
export function forgetPasswordApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/forget`,
        data,
    });
}

/**
 * 是否AD登录
 */
export function isAdLoginApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/login/can_ldap`,
    });
}

/**
 * ad登录
 */
export function adLoginApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/login/ldap`,
        data,
    });
}

/**
 * 是否可以注册
 */
export function isRegisterApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/login/can_register`,
    });
}

/**
 * 是否有oauth登录
 */
export function isOauthApi() {
    return axios({
        method: 'get',
        url: `${store.envInfo.env === 'development' ? '/api' : ''}/user/v31/oauth/info`,
    });
}

/**
 * 修改密码
 */
export function updatePasswordApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api' : ''}/user/profile/email/password`,
        data,
    });
}
