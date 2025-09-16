/* eslint-disable no-undef */
import axios from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/platform3/org' : '/platform3/org';

/**
 * 检测模板列表
 */
export function getDetectTempListApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/detection_scope/list`,
        params: data,
    });
}

/**
 * 检测模板删除
 */
export function delDetectTempApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_scope/del`,
        data,
    });
}

/**
 * 检测模板开启
 */
export function openDetectTempApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_scope/status`,
        data,
    });
}

/**
 * 检测模板添加
 */
export function addDetectTempApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_scope/save`,
        data,
    });
}

/**
 * 检测模板设为默认
 */
export function detectTempDefaultApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_scope/default`,
        data,
    });
}

/**
 * 获取全剧配置
 */
export function getGlobalSetApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/autonomous/config/info`,
        params: data,
    });
}

/**
 * 保存全剧配置
 */
export function saveGlobalSetApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/autonomous/config/save`,
        data,
    });
}

/**
 * 漏洞白名单添加
 */
export function addVulnWhiteListApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_vuln_whitelist/save`,
        data,
    });
}

/**
 * 漏洞白名单获取
 */
export function getVulnWhiteListApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/detection_vuln_whitelist/list`,
        params: data,
    });
}

/**
 * 漏洞白名单删除
 */
export function delVulnWhiteListApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_vuln_whitelist/del`,
        data,
    });
}

/**
 * 报表导出
 */
export function stateExportApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/classifyExport`,
        data,
    });
}

/**
 * 许可证类型列表
 */
export function getLicenseListApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/license/family/list`,
        params: data,
    });
}

/**
 * 许可证类型列表删除
 */
export function delLinTypeApi(data:any) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/license/family/del/${data.id}`,
    });
}

/**
 * 添加许可证类型
 */
export function addLinTypeApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/license/family/create`,
        data,
    });
}

/**
 * 更新许可证类型
 */
export function updateLinTypeApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/license/family/update`,
        data,
    });
}

/**
 * 项目分发
 */
export function distributionLinApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/distribution`,
        data,
    });
}

/**
 * 自定义列表
 */
export function getCustomLicApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/license/customize/list`,
        params: data,
    });
}

/**
 * 自定义列表
 */
export function delCustomLicApi(data:any) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/license/customize/del/${data.id}`,
        data,
    });
}

/**
 * 自定义新增
 */
export function addCustomLicApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/license/customize/create`,
        data,
    });
}

/**
 * 自定义更新
 */
export function updateCustomLicApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/license/customize/update`,
        data,
    });
}

/**
 * 系统许可
 */
export function getSysLicApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/license/system/list`,
        params: data,
    });
}

/**
 * 系统许可更新
 */
export function updateSysLicApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/license/system/save`,
        data,
    });
}

/**
 * 处置等级策略列表
 */
export function getDetectSuggestLevelListApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/detection_suggest_level/list`,
        params: data,
        noLodaing: true,
    });
}

/**
 * 处置等级策略删除
 */
export function delDetectSuggestLevelApi(data:Object) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/team/detection_suggest_level/del`,
        data,
    });
}

/**
 * 处置等级策略添加或编辑
 */
export function saveDetectSuggestLevelApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/detection_suggest_level/save`,
        data,
    });
}
