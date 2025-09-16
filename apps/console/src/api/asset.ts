/* eslint-disable no-undef */
import axios, { post } from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/platform3/org' : '/platform3/org';

/**
 * 资产列表
 */
export function getAssetsListDataApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/list`,
        data,
    });
}

/**
 * 资产仓库筛选
 */
export function getRepoTypeApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/languages`,
        data,
    });
}

/**
 * 资产导出
 */
export function exportAssetApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/export`,
        data,
    });
}

/**
 * 资产信息
 */
export function getAssetInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/center`,
        data,
    });
}

/**
 * 风险信息
 */
export function getRiskInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/risk/center`,
        data,
    });
}

/**
 * 风险列表
 */
export function getRiskListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/risk/list`,
        data,
    });
}

/**
 * 风险导出
 */
export function exportRiskListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/risk/export`,
        data,
    });
}

/**
 * 导出列表
 */
export function getExportListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/export/list`,
        data,
    });
}

/**
 * 导出下载
 */
export function downloadExportUrl(id: string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/export/file/${id}`,
        responseType: 'blob',
        // data,
    });
    // return store.envInfo.env === 'development' ? `/api/platform3/org/export/file/${id}` : `/platform3/org/export/file/${id}`;
}

/**
 * 导出删除
 */
export function deleteExportApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/export/del`,
        data,
        noLoading: true,
    });
}

/**
 * 详情概览
 */
export function getOverviewDataApi(data: Object) {
    return post<ResponseDataType<OverviewData>>(`${isAddApi}/project/subtask/sbom/overview`, data);
}

/**
 * 二进制同源分析
 */
export function getBinaryFileListApi(data: Object) {
    return post<ResponseDataType<BinaryList>>(`${isAddApi}/project/subtask/autonomous/binary_file_list`, data);
}

/**
 * sbomASCII字符串
 */
export function getSbomASCIIDataApi(data: Object) {
    return post<ResponseDataType<Array<string>>>(`${isAddApi}/project/subtask/sbom/file_ascii`, data);
}

/**
 * 文sbom件详情
 */
export function getSbomFileDetailInfoApi(data: Object) {
    return post<ResponseDataType<any>>(`${isAddApi}/project/subtask/sbom/module_file_info`, data);
}

/**
 * 文sbom件详情
 */
export function getRiskFileApi(data: Object) {
    return post<ResponseDataType<RiskFile>>(`${isAddApi}/project/subtask/sbom/risk_module_file`, data);
}

/**
 * sbom溯源文件
 */
export function getSbomSourceApi(data: Object) {
    return post<ResponseDataType<any>>(`${isAddApi}/project/subtask/autonomous/project_file_list`, data);
}

/**
 * 真实利用漏洞信息
 */
export function getRealUseVulnApi(data: Object) {
    return post<ResponseDataType<realUseVulnType>>(`${isAddApi}/security/real/use/vul-list`, data);
}

/**
 * 获取流
 */
export function getStreamDataApi(data: Object) {
    return post<ResponseDataType<dataStreamType>>(`${isAddApi}/security/real/use/data-stream`, data);
}

/**
 * 获取代码
 */
export function getRealUseCodeApi(data: Object) {
    return post<ResponseDataType<{content:string}>>(`${isAddApi}/security/real/use/file-content`, data);
}

/**
 * 默认标签列表
 */
export function getDefaultTagsApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/cmdb/tag`,
    });
}

/**
 * 添加系统标签
 */
export function addDefaultTagsApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/tag/edit`,
        data,
    });
}

/**
 * 生成检测报告code
 */
export function getReportCodeApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/history/share/generate/code`,
        data,
    });
}

/**
 * 检测报告类型 是否登录
 */
export function getReportAllowApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/history/share/code/info`,
        data,
    });
}

/**
 * 生成安全问题code
 */
export function getIssueReportCodeApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/share/generate/code`,
        data,
    });
}

/**
 * 安全问题类型 是否登录
 */
export function getIssueReportAllowApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/share/code/info`,
        data,
    });
}

/**
 * 获取团队分享设置
 */
export function getTeamShareSetApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/share/config/list`,
        data,
    });
}

/**
 * 保存团队分享设置
 */
export function saveTeamShareSetApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/share/config/save`,
        data,
    });
}

/**
 * 许可证列表
 */
export function getLicenseListApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/license/list`,
        data,
    });
}

/**
 * 许可证相关项目
 */
export function getLicenseProjectApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/license/project/list`,
        data,
    });
}

/**
 * 许可证相关项目组件
 */
export function getLicenseProjectCompApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/license/project/component/list`,
        data,
    });
}

/**
 * 资产任务列表
 */
export function getAssetsTaskApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/export/list`,
        data,
        noLoading: true,
    });
}

/**
 * 资产任务创建
 */
export function createAssetsTaskApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/query`,
        data,
    });
}

/**
 * 资产任务详情
 */
export function getTaskInfoApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/queryResult`,
        data,
        noLoading: true,
    });
}

/**
 * 资产列表
 */
export function getAssetListApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/queryResult/list`,
        data,
    });
}

/**
 * 风险列表
 */
export function getRiskQueryListApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/risk/queryResult/list`,
        data,
    });
}

/**
 * 资产任务导出
 */
export function exportAssetsTaskApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/queryExport`,
        data,
    });
}

/**
 * 风险创建任务
 */
export function createRiskTaskApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/risk/query`,
        data,
    });
}

/**
 * 风险任务详情
 */
export function getRiskTaskInfoApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/risk/queryResult`,
        data,
        noLoading: true,
    });
}

/**
 * 风险任务导出
 */
export function exportRiskTaskApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/risk/queryExport`,
        data,
    });
}

/**
 * 资产重命名
 */
export function reNameApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/export/rename`,
        data,
        noLoading: true,
    });
}

/**
 * 资产获取最新一条
 */
export function getNewItemApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/export/first`,
        data,
        noLoading: true,
    });
}

/**
 * 查询取消
 */
export function cancelQueryApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/export/cancel`,
        data,
        noLoading: true,
    });
}
