import axios from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/platform3/org' : '/platform3/org';

/**
 * 溯源校准提交
 */
export function startAdjustSnipApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/autonomous/v2/submit_fix`,
        data,
    });
}

/**
 * 同源列表
 */
export function getSnippetList(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/autonomous/v2/target_project_list`,
        params: data,
    });
}
/**
 * 修改状态
 */
export function changeSnippetStatusApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/autonomous/v2/confirm`,
        data,
        noLoading: true,
    });
}

/**
 * 获取检测项目文件
 */
export function getProjectFileListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/autonomous/v2/source_file_list`,
        params: data,
    });
}

/**
 * 获取检测项目文件
 */
export function getProjectFileCodeApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/autonomous/v2/source_file`,
        params: data,
    });
}

/**
 * 匹配凯源文件列表
 */
export function getMatchFileListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/autonomous/v2/target_file_list`,
        params: data,
    });
}

/**
 * 更多匹配文件
 */
export function getMoreMatchFileApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/autonomous/v2/more_target_file_list`,
        params: data,
    });
}

/**
 * 开源项目许可证正文
 */
export function getProjectLicenseTxtApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/autonomous/v2/target_project_license_info`,
        params: data,
        noLoading: true,

    });
}

/**
 * 开源文件许可证
 */
export function getFileLicenseTxtApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/autonomous/v2/target_license_info`,
        params: data,
        noLoading: true,
    });
}

/**
 * 凯源文件代码
 */
export function getOpenProCodeApi(data: string, path: string) {
    return axios({
        method: 'get',
        url: `${path || 'https://data-cs-1257309290.cos.ap-hongkong.myqcloud.com/feat/code/'}${data.slice(0, 2)}/${data}`,
        responseType: 'stream',
        noLoading: true,
        noToken: true,
    });
}

/**
 * 开源筛选lic
 */
export function getLicenseOptApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/autonomous/v2/license_list`,
        params: data,
    });
}

/**
 * 详情分发
 */
export function detailDistributeApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/distribution`,
        data,
    });
}

/**
 * 发布或更新评论
 */
export function saveCommentApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/sbom/comment/save`,
        data,
        noLoading: true,
    });
}

/**
 * 获取评论列表
 */
export function getCommentListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/sbom/comment/list`,
        params: data,
        noLoading: true,
    });
}

/**
 * 删除评论
 */
export function deleteCommentApi(id: string) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/project/subtask/sbom/comment/${id}`,
        noLoading: true,
    });
}

/**
 * 获取当前修复目标
 */
export function getFixRangeApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/security/fix_plan/target/info`,
        params: data,
        noLoading: true,
    });
}

/**
 * 修改修复目标范围
 */
export function changeFixRangeApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/fix_plan/target/update`,
        data,
        noLoading: true,
        noMessage: true,
    });
}

/**
 * 获取当前修复方案
 */
export function getFixPlanApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/security/fix_plan/current/detail`,
        params: data,
        noLoading: true,
    });
}

/**
 * 获取其他修复方案版本列表
 */
export function getFixPlanVersionListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/security/fix_plan/version/list`,
        params: data,
    });
}

/**
 * 获取其他修复方案版本详情
 */
export function getFixPlanVersionInfoApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/security/fix_plan/version/info`,
        params: data,
        noLoading: true,
    });
}

/**
 * 修改当前修复方案到其他版本
 */
export function changeFixPlanVersionApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/fix_plan/current/change`,
        data,
        noLoading: true,

    });
}

/**
 * 漏洞代码特征
 */
export function getVanirDataApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/security/vanir_data`,
        params: data,
        noLoading: true,
    });
}

/**
 * 获取检测详情页命中的处置等级策略信息
 */
export function getDetectionSuggestLevelApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/dection_suggest_level/info`,
        params: data,
    });
}

/**
 * 获取项目许可证列表
 */
export function getProjectLicenseListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/project_license/list`,
        params: data,
    });
}

/**
 * 保存项目许可证
 */
export function saveProjectLicenseApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/project_license/save`,
        data,
        noLoading: true,
    });
}

/**
 * 删除项目许可证
 */
export function deleteProjectLicenseApi(data: { ids: string[], subtask_id: string }) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/project/subtask/project_license/delete`,
        data,
        noLoading: true,
    });
}

/**
 * 获取项目许可证下拉选项
 */
export function getCustomerLicenseListApi(data: { team_id: string, is_only_builtin: boolean }) {
    return axios({
        method: 'get',
        url: `${isAddApi}/team/customer_license/customer_or_builtin_license`,
        params: data,
        noLoading: true,
    });
}
