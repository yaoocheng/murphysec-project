import axios from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/platform3/org' : '/platform3/org';

/**
 * ticket获取用户信息登录
 */
export function loginApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/login/token`,
        data,
    });
}

/**
 * 新用户引导完成
 */
export function finishGuideApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/login/guide/submit`,
        data,
    });
}

/**
 * 团队列表
 */
export function getTeamListApi() {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/list`,
        data: {
            page: 1,
            limit: 1000,
        },
    });
}

/**
 * 创建团队
 */
export function createTeamApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/create`,
        data,
    });
}

/**
 * 用户组列表
 */
export function getGruopListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/groups`,
        data,
    });
}

/**
 * 用户组下用户列表
 */
export function getGruopUserListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/group_users`,
        data,
    });
}

/**
 * 团队设置
 */
export function teamSetApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/edit`,
        data,
    });
}

/**
 * 图片上传
 */
export function uploadImgApi() {
    return `${isAddApi}/upload/image`;
}

/**
 * 团队用户列表
 */
export function getTeamMemberApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/team_user/tree`,
        data,
    });
}

/**
 * 账号邀请搜索
 */
export function searchAccountApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/team_user/search`,
        data,
    });
}

/**
 * 获取分享链接
 */
export function getShareUrlApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/history/share/generate/url`,
        data,
    });
}

/**
 * 分享检测
 */
export function shareDetailInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/history/share/send`,
        data,
    });
}

/**
 * 分享安全问题
 */
export function shareSafeQuestionApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/share/code/gen`,
        data,
    });
}

/**
 * 分享后加入团队
 */
export function joinTeamApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/history/share/join`,
        data,
    });
}

/**
 * 退出团队
 */
export function quitTeamApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/del`,
        data,
    });
}

/**
 * 安全问题接受加入团队
 */
export function questionJoinTeamApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/join`,
        data,
    });
}

/**
 * 邀请链接
 */
export function getInviteIdApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/subtask`,
        data,
    });
}

/**
 * 产品开通信息
 */
export function getProductOpenInfoApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/system/license/info`,
    });
}

/**
 * 产品开通信息
 */
export function getSystemErrorApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/system/health/info`,
        noLoading: true,
    });
}

/**
 * 版本信息
 */
export function getSystemVersionApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/system/version/info`,
        noLoading: true,
    });
}

/**
 * 策略配置列表
 */
export function getStrategyListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/dc/list`,
        data,
    });
}

/**
 * 策略删除
 */
export function deleteStrategyListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/dc/del`,
        data,
    });
}

/**
 * 策略配置
 */
export function strategyConfigApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/dc/save`,
        data,
    });
}

/**
 * 动态搜组件
 */
export function searchCompApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/dc/component_autocomplete`,
        data,
    });
}

/**
 * 项目策略列表
 */
export function getProjectStrategyListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_strategy_project/list`,
        data,
    });
}

/**
 * 项目策略配置保存
 */
export function projectStrategySaveApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_strategy_project/save`,
        data,
    });
}

/**
 * 项目策略删除
 */
export function projectStrategyDelApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_strategy_project/del`,
        data,
    });
}

/**
 * 策略详情
 */
export function getProjectStrategyInfoApi(data: string) {
    return axios({
        noLoading: true,
        method: 'get',
        url: `${isAddApi}/project/subtask/detection_strategy_project_list/${data}`,
    });
}

/**
 * 项目动态搜组件
 */
export function searchProjectCompApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_strategy_project/component_autocomplete`,
        data,
    });
}

/**
 * 获取邀请码
 */
export function getInviteCodeApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/invite/gen/code`,
        data,
    });
}

/**
 * 加入团队
 */
export function joinTeam1Api(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/invite/join`,
        data,
    });
}

/**
 * 系统配置
 */
export function getSystemConfig() {
    return axios({
        method: 'get',
        url: `${isAddApi}/system/config`,
    });
}

/**
 * admin配置
 */
export function getAdminSystemConfig() {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api' : ''}/admin3/bus/params/get`,
    });
}

/**
 * 私有组件列表
 */
export function getPrivateCompApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/private_access_config/list`,
        params: data,
    });
}

/**
 * 私有组件删除
 */
export function deletePrivateCompApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/private_access_config/del`,
        data,
    });
}

/**
 * 私有组件编辑
 */
export function editPrivateCompApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/private_access_config/save`,
        data,
    });
}

/**
 * license列表
 */
export function getLicenseApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/customer_license/list`,
        params: data,
    });
}

/**
 * license删除
 */
export function deleteLicenseApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/customer_license/del`,
        data,
    });
}

/**
 * license编辑
 */
export function editLicenseApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/customer_license/save`,
        data,
    });
}

/**
 * license等级
 */
export function getLicenseLevelApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/license/level`,
        params: data,
    });
}

/**
 * 策略类型
 */
export function getSensitiveWordsPloyApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/sensitive_words_ploy/ploy_type`,
        params: data,
    });
}

/**
 * 策略敏感列表
 */
export function getSensitiveListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/sensitive_words_ploy/list`,
        params: data,
    });
}

/**
 * 敏感策略添加
 */
export function editSensitiveInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/sensitive_words_ploy/save`,
        data,
    });
}

/**
 * 敏感策略删除
 */
export function deleteSensitiveInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/sensitive_words_ploy/del`,
        data,
    });
}

/**
 * 敏感策略开关
 */
export function switchSensitiveInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/sensitive_words_ploy/change_status`,
        data,
    });
}

/**
 * 白名单保存
 */
export function saveWhiteListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_whitelist/save`,
        data,
    });
}

/**
 * 白名单列表
 */
export function getWhiteListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_whitelist/list`,
        data,
    });
}

/**
 * 删除白名单
 */
export function delWhiteListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_whitelist/del`,
        data,
    });
}

/**
 * 系统许可证
 */
export function getSysLicenseApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/customer_license/customer_or_builtin_license`,
        params: data,
    });
}

/**
 * 编辑策略获取许可证
 */
export function editStraGetLicenseApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/detection_license/license_setting`,
        params: data,
    });
}

/**
 * 许可证策略
 */
export function getLicenseStraListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/detection_license/list`,
        params: data,
    });
}

/**
 * 许可证策略删除
 */
export function delLicenseStraListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_license/del`,
        data,
    });
}

/**
 * 许可证策略添加
 */
export function addLicenseStraApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_license/save`,
        data,
    });
}

/**
 * 许可证详情策略
 */
export function getLicenseDetailStraApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/detection_license/list_with_license_setting`,
        params: data,
    });
}

/**
 * 许可证策略启用
 */
export function licenseStraStatusApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_license/status`,
        data,
    });
}

/**
 * 获取漏洞统计信息
 */
export function getVulnCountApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/system/vuln_count`,
        noLoading: true,
    });
}
