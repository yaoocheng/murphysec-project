/* eslint-disable no-undef */
import axios, { get } from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/user' : '/user';

/**
 *  邮箱或手机免密登录
 */
// export function avoidPasswordLogin(data:Object) {
//     return axios({
//         method: 'post',
//         url: `${isAddApi}/oauth/v2/login/code/user`,
//         data,
//     });
// }

/**
 * 退出登录
 */
export function quitLogin(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/oauth/v2/logout`,
        data,
    });
}

/**
 * 获取报价
 */
// export function getPrice(data: Object) {
//     return axios({
//         method: 'post',
//         url: `${isAddApi}/quote/register`,
//         data,
//     });
// }

/**
 * idea认证
 */
export function clientCertify(uuid: string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/v1/ide/token/web/access_token`,
        params: {
            uuid,
        },
    });
}

/**
 * 绑定GitHub
 */
export function setBindGithub(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/profile/setting/github/bind`,
        data,
    });
}

/**
 * 设置页绑定微信
 */
export function wechatSetBind(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/profile/setting/wechat/bind`,
        data,
    });
}

/**
 * 获取验证码
 */
export function getVerifyCode(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/oauth/v2/send`,
        data,
    });
}

/**
 * 获取用户信息
 */
export function getUserInfoApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/profile/current`,
    });
}

/**
 * 通知设置
 */
export function noticeSet(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/profile/notice/setting`,
        data,
    });
}

/**
 * 密码
 */
export function setPwd(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/profile/email/password`,
        data,
    });
}

/**
 * 手机绑定
 */
export function bindPhone(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/profile/setting/phone/bind`,
        data,
    });
}

/**
 * 手机解绑
 */
export function unbindPhone() {
    return axios({
        method: 'get',
        url: `${isAddApi}/profile/setting/phone/unlink`,
    });
}

/**
 * 邮箱解绑
 */
export function unbindEmail() {
    return axios({
        method: 'get',
        url: `${isAddApi}/profile/setting/email/unlink`,
    });
}

/**
 * 邮箱绑定
 */
export function bindEmail(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/profile/setting/email/bind`,
        data,
    });
}

/**
 * 解绑github
 */
export function unbindGithub() {
    return axios({
        method: 'get',
        url: `${isAddApi}/profile/setting/github/unlink`,
    });
}

/**
 * 解绑gitee
 */
export function unbindGitee() {
    return axios({
        method: 'get',
        url: `${isAddApi}/profile/setting/gitee/unlink`,
    });
}

/**
 * 解绑微信
 */
export function unbindWechat() {
    return axios({
        method: 'get',
        url: `${isAddApi}/profile/setting/wechat/unlink`,
    });
}

/**
 * 授权后绑定gitee
 */
export function setBindGiteeApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/profile/setting/gitee/bind`,
        data,
    });
}

/**
 * 角色选择
 */
export function selectRoleApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/profile/set/profession`,
        data,
    });
}

/**
 * 操作日志
 */
export function getOperateListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/manage/operation/log/list`,
        data,
    });
}

/**
 * 操作日志模块
 */
export function getModuleDataApi() {
    return get<ResponseDataType<Array<string>>>(`${isAddApi}/manage/operation/log/types`, {});
}

/**
 * 分享加入团队
 */
export function shareJoinTeamApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/v31/team/invite/join`,
        data,
    });
}

/**
 * 配置
 */
export function getUserConfigApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/v31/config`,
    });
}
