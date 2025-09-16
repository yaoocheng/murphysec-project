/* eslint-disable no-undef */
import axios, { post } from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/platform3/org' : '/platform3/org';

/**
 * 获取所有接入方式是否配置
 */
export function getAllAccessApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/config/all`,
        data,
    });
}

/**
 * 保存更新配置
 */
export function updatedAccessApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/config/save`,
        data,
    });
}

/**
 * 新建内网地址
 */
export function createTunnelApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/tunnel/create`,
        data,
    });
}

/**
 * 内网地址列表
 */
export function getTunnelListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/tunnel/list`,
        data,
    });
}

/**
 * gitlab校验
 */
export function testTokenApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/gitlab/test`,
        data,
    });
}

/**
 * git获取分支
 */
export function getGitBranchApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/git/branches`,
        data,
    });
}

/**
 * 获取检测配置
 */
export function getDetectConfigApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/config/info`,
        data,
    });
}

/**
 * 保存检测配置
 */
export function saveDetectConfigApi(data: Object) {
    console.log(JSON.stringify(data));

    return axios({
        method: 'post',
        url: `${isAddApi}/project/config/save`,
        data,
    });
}

/**
 * 校验gitlab服务可用性
 */
export function testGitlabServerApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/gitlab/test`,
        data,
    });
}

/**
 * coding校验
 */
export function testCodingServerApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/coding/test`,
        data,
    });
}

/**
 * 获取webhook url
 */
export function getWebhookUrlApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/webhook/gen`,
        data,
    });
}

/**
 * 推送测试办公软件
 */
export function pushOfficeTestApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api' : ''}/message3/v3/test/send`,
        data,
    });
}

/**
 * api推送
 */
export function pushApiTestApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/message/webhook/test`,
        data,
    });
}

/**
 * 文件上传
 */
export function uploadApi() {
    return `${isAddApi}/upload/file`;
    // return axios({
    //     method: 'post',
    //     url: `${isAddApi}/upload/file`,
    //     data,
    // });
}

/**
 * 全量检测进度
 */
export function getFullDetectStatusApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask_all/status`,
        data,
        noLoading: true,
    });
}

/**
 * 取消全量
 */
export function cancelFullDetectStatusApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask_all/cancel`,
        data,
    });
}

/**
 * 取消全量
 */
export function getEcosystemApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/query/ecosystem`,
    });
}

/**
 * 集成删除配置
 */
export function deleteConfigApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/config/del`,
        data,
    });
}

/**
 * 仓库树
 */
export function getRepoTreeDataApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/tree_list`,
        data,
        noLoading: true,
        // headers: {
        //     noLoading: true,
        // },
    });
}

/**
 * 仓库名称
 */
export function getRepoKeyDataApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/keys`,
        data,
    });
}

/**
 * 仓库名称
 */
export function getNexusRepoKeyDataApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/nexus/repository_list`,
        data,
    });
}

/**
 * 开始对比
 */
export function startComparisonApi(data: Object) {
    return post<ResponseDataType<any>>(`${isAddApi}/binary_diff/start`, data);
}

/**
 * 对比列表
 */
export function getComparisonListApi(data: Object) {
    return post<ResponseDataType<ListType<ComparsionListItem>>>(`${isAddApi}/binary_diff/list`, data);
}

/**
 * 汇编代码文件函数列表
 */
export function getBinaryFuncListApi(data: Object) {
    return post<ResponseDataType<BinaryFuncListItem>>(`${isAddApi}/binary_diff/detail/func_list`, data);
}

/**
 * 函数代码
 */
export function getBinaryFuncCodeApi(data: Object) {
    return post<ResponseDataType<FuncCode>>(`${isAddApi}/binary_diff/detail/func_code_fragments`, data);
}

/**
 * ASCII字符串
 */
export function getASCIIDataApi(data: Object) {
    return post<ResponseDataType<Array<string>>>(`${isAddApi}/binary_diff/detail/file_ascii`, data);
}

/**
 * 文件详情
 */
export function getFileDetailInfoApi(data: Object) {
    return post<ResponseDataType<any>>(`${isAddApi}/binary_diff/detail/file_info`, data);
}

/**
 * 获取私有源列表
 */
export function getPrivateListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/package_private/list`,
        data,
    });
}

/**
 * 私有源下载
 */

export function downloadPrivateUrl(id: string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/package_private/download/${id}`,
        responseType: 'blob',
        // data,
    });
    // return store.envInfo.env === 'development' ? `/api/platform3/org/package_private/download/${id}` : `/platform3/org/package_private/download/${id}`;
}

/**
 * 私有源删除
 */
export function delPrivateApi(id: string) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/package_private/del/${id}`,
    });
}

/**
 * 私有源名称校验
 */
export function verifyPrivateNameApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/package_private/is_repeatName`,
        data,
    });
}

/**
 * 私有源名称校验
 */
export function addPrivateApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/package_private/add`,
        data,
    });
}

/**
 * 上传私有源
 */
export function uploadPrivateApi() {
    return store.envInfo.env === 'development' ? '/api/platform3/org/tool/file_to_base64' : '/platform3/org/tool/file_to_base64';
}

/**
 * 获取仓库列表
 */
export function getRepoListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/repo_list`,
        data,
        noLoading: true,
    });
}

/**
 * 仓库同步刷新数据
 */
export function refreshRepoListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/update_repo`,
        data,
    });
}

/**
 * 批量更新仓库
 */
export function batchRefreshRepoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/repo/refresh_name`,
        data,
    });
}

/**
 * 取消批量更新仓库
 */
export function cancelRefreshRepoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/repo/del_refresh_name`,
        data,
    });
}

/**
 * 定时历史记录
 */
export function timeExcRecordApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask_all/cron/log`,
        data,
    });
}

/**
 * 定时删除
 */
export function timeExcDelApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask_all/cron/del`,
        data,
    });
}

/**
 * 仓库所属组织
 */
export function githubNamespaceApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/repository/namespaces`,
        params: data,
    });
}

/**
 * nexus巡检状态
 */
export function getNexusQuickStatusApi(id: string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/nexus/remote_tripartite/get_status/${id}`,
        noLoading: true,
    });
}

/**
 * nexus巡检列表
 */
export function getNexusQuickListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/nexus/remote_tripartite/get_list`,
        params: data,
    });
}

/**
 * 发起扫描
 */
export function NexusQuickDetectApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/nexus/remote_tripartite/start`,
        data,
        noLoading: true,
    });
}

/**
 * 组件漏洞
 */
export function getNexusQuickVulnApi(id: string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/nexus/remote_tripartite/get_vuln/${id}`,
    });
}

/**
 * nexus巡检导出
 */
export function exportExcApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/nexus/remote_tripartite/export`,
        data,
        // responseType: 'blob',
    });
}

/**
 * 获取再次检测配置addr
 */
export function getRestartDetectApi(params: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/access_type/info`,
        params,
    });
}

/**
 * 获取nexus仓库列表
 */
export function getNexusRepoListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/nexus/repository_list`,
        data,
        noLoading: true,
    });
}

/**
 * 仓库树Nexus
 */
export function getNexusRepoTreeDataApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/nexus/extdirect/tree_list`,
        data,
        noLoading: true,
    });
}

/**
 * 获取代码项目列表Nexus
 */
export function getNexusListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/nexus/extdirect/tree_file`,
        data,
        noLoading: true,
    });
}

/**
 * 搜索项目列表Nexus
 */
export function searchNexusListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/nexus/extdirect/search`,
        data,
        noLoading: true,
    });
}

/**
 * 取消nexus巡检
 */
export function cancelNexusQuickApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/nexus/remote_tripartite/cancel`,
        data,
        noLoading: true,
    });
}

/**
 * 获取Amazon ECR仓库列表
 */
export function getEcrRepositoryListApi(params: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/ecr/repository_list`,
        params,
    });
}

/**
 * 获取Amazon ECR地区列表
 */
export function getEcrRegionApi(params: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/ecr/region`,
        params,
    });
}

/**
 * 获取Amazon ECR版本列表
 */
export function getEcrVersionListApi(params: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/ecr/version_list`,
        data: params,
    });
}

/**
 * 获取Bitbucket workspace列表
 */
export function getBitbucketWorkspacesApi(params: { team_config_id: string }) {
    return axios({
        method: 'get',
        url: `${isAddApi}/bitbucket/workspaces`,
        params,
    });
}

/**
 * 获取Bitbucket项目列表
 */
export function getBitbucketListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/bitbucket/list`,
        data,
    });
}

/**
 * 简单云代码仓库列表
 */
export function getEzoneCodeListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/ezone/code/list`,
        params: data,
    });
}

/**
 * curl --location --request GET 'http://localhost:8981/org/ezone/code/branch?team_config_id=1&repo_key=xxxx' \
--header 'Authorization: token 9ef762444e2a6073fe273f69ff5858ed'
 */
export function getEzoneCodeBranchApi(params: { team_config_id: string, repo_key: string }) {
    return axios({
        method: 'get',
        url: `${isAddApi}/ezone/code/branch`,
        params,
        noLoading: true,
    });
}

/**
 * ezone仓库列表
 */
export function getEzoneRepoListApi(params: { team_config_id: string }) {
    return axios({
        method: 'get',
        url: `${isAddApi}/ezone/package/repos`,
        params,
    });
}

/**
 * ezone仓库下制品列表
 */
export function getEzonePackageListApi(params: { team_config_id: string, repo_id: string, page: number, page_size: number }) {
    return axios({
        method: 'get',
        url: `${isAddApi}/ezone/package/package`,
        params,
    });
}

/**
 * ezone制品版本
 */
export function getEzonePackageVersionListApi(params: { team_config_id: string, pkg_id: string, page: number, page_size: number, repo_format: string }) {
    return axios({
        method: 'get',
        url: `${isAddApi}/ezone/package/version_list`,
        params,
    });
}
