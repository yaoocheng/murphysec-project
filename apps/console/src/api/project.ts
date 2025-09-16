import axios from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/platform3/org' : '/platform3/org';

/**
 * 获取代码项目列表
 */
export function getProjectListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/list`,
        data,
        // noLoading: true,
    });
}

/**
 *  活跃的代码项目
 */
export function getActiveProjectListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/repo/recommend`,
        data,
    });
}

/**
 * 项目检测
 */
export function startDetectApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/start`,
        data,
    });
}

/**
 * 体验检测
 */
export function expGithubDetectApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/github/demo`,
        data,
    });
}

export function expGiteeDetectApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/gitee/demo`,
        data,
    });
}

/**
 * 项目分支
 */
export function getBranchListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/git/branches`,
        data,
    });
}

/**
 * 项目组列表
 */
export function getProjectClassListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/group/list`,
        data,
    });
}

/**
 * 项目列表
 */
export function getConsoleProjectListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/list`,
        data,
    });
}

/**
 * 项目检测历史
 */
export function getHistoryListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/history/list`,
        data,
    });
}

/**
 * 创建项目组
 */
export function createProjectClassApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/group/create`,
        data,
    });
}

/**
 * 重命名项目组
 */
export function resetClassNameApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/group/edit`,
        data,
    });
}

/**
 * 删除项目组
 */
export function deleteClassNameApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/group/del`,
        data,
    });
}

/**
 * 给项目组添加项目
 */
export function classAddProjectApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/group/add/project`,
        data,
    });
}

/**
 * 将单个项目添加多个项目
 */
export function projectAddClassApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/projects/save`,
        data,
    });
}

/**
 * 再次检测
 */
export function restartDetectApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/history/restart`,
        data,
    });
}

/**
 * 历史记录删除
 */
export function deleteHistoryApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/history/del`,
        data,
    });
}

/**
 * 项目删除
 */
export function deleteProjectApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/del`,
        data,
    });
}

/**
 * 代码列表统计数据
 */
export function getCodeAccessNumApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/access_type/list`,
        data,
    });
}

/**
 * 安全问题列表
 */
export function getSafeQuestionListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/list`,
        data,
    });
}

/**
 * 安全问题数量
 */
export function getSafeQuestionStatusNumApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/status/list`,
        data,
    });
}

/**
 * 负责人列表
 */
export function getPrincipalListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/owner/list`,
        data,
    });
}

/**
 * 修改安全问题状态
 */
export function changeSafeQuestionStatusApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/status/submit`,
        data,
    });
}

/**
 * 安全问题详情
 */
export function getSafeQuestionInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/info`,
        data,
        noLoading: true,
    });
}

/**
 * 溯源图
 */
export function getSafeQuestionGraphApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/graph`,
        data,
        noLoading: true,
    });
}

/**
 * 指派负责人 安全问题
 */
export function distributeOwnerApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/owner/distribution`,
        data,
    });
}

/**
 * 指派负责人 代码项目
 */
export function distributeCodeOwnerApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/distribution`,
        data,
    });
}

/**
 * 推荐人和团队列表  安全问题
 */
export function recommendAndMemberApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/owner/recommend_and_team_user`,
        data,
    });
}

/**
 * 推荐人和团队列表  代码项目
 */
export function recommendAndMemberCodeApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/owner/recommend_and_team_user`,
        data,
    });
}

/**
 * 工作台安全问题
 */
export function getPlatformSecurityListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/work_platform/security/list`,
        data,
    });
}

/**
 * 工作台统计数据
 */
export function getPlatformDataApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/work_platform/data`,
        data,
    });
}

/**
 * 工作台代码项目
 */
export function getPlatformProjectListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/work_platform/repository/list`,
        data,
    });
}

/**
 * 工作台个人动态
 */
export function getPlatformLogApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/work_platform/repository/log/list`,
        data,
    });
}

/**
 * 团队概览数据
 */
export function getTeamOverviewDataApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team_overview/info`,
        data,
    });
}

/**
 * 团队动态
 */
export function getTeamDynamicDataApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team_overview/repository/log/list`,
        data,
    });
}

/**
 * 团队概览安全问题
 */
export function getTeamOverviewListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team_overview/week/security/list`,
        data,
    });
}

/**
 * 团队概览top
 */
export function getTeamOverviewTopApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team_overview/week/security/data`,
        data,
    });
}

/**
 * 周报
 */
export function getTeamOverviewReportApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team_overview/week/security/report`,
        data,
    });
}

/**
 * 详情基本信息
 */
export function getDetailInfoApi(id: string, from: any) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/brief_info/${id}`,
        params: {
            op_from: from,
        },
        noLoading: true,
    });
}

/**
 * 检测时间
 */
export function getDetectTimeApi(sid: string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/subtask_time/${sid}`,
        noLoading: true,
    });
}

/**
 * 缺陷组件
 */
export function getDetailCompListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/leak_comp/list`,
        data,
    });
}

/**
 * 许可证列表
 */
export function getDetailLicenseListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/license/list`,
        data,
    });
}

/**
 * 许可证合规列表
 */
export function getLicenseComplianceListApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/license_compliance/list`,
        params: data,
    });
}

/**
 * 许可证合规源文件
 */
export function getLicenseComplianceSourceFilesApi(data: { project_id: string, subtask_id: string, source_file_ids: string[] }) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/license_compliance/source_files`,
        data,
    });
}

/**
 * 许可证合规源文件详情
 */
export function getLicenseComplianceSourceFileInfoApi(data: { project_id: string, subtask_id: string, source_id: string, source_file_id: string, exist_file_copyright: boolean, compliance_type: string }) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/license_compliance/source_file_info`,
        params: data,
    });
}

/**
 * 开源文件许可证信息
 */
export function getOpenLicenseComplianceSourceFileInfoApi(data: { project_id: string, subtask_id: string, source_id: string, source_file_id: string, exist_file_copyright: boolean, compliance_type: string }) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/license_compliance/target_file_info`,
        params: data,
    });
}

/**
 * 许可证下拉组件
 */
export function getDetailLicenseCompListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/get_license_comp`,
        data,
    });
}

/**
 * module列表
 */
export function getDetailModuleListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/sbom/module_list`,
        data,
    });
}

/**
 * sbom图
 */
export function getDetailSbomApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/sbom/graph`,
        data,
    });
}

/**
 * sbom列表
 */
export function getDetailSbomListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/sbom/list`,
        data,
    });
}

/**
 * 获取组件溯源
 */
export function getcompGraphApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/comp/graph`,
        data,
    });
}

/**
 * sbom导出
 */
export function getDetailExportSbomApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/sbom/export`,
        data,
    });
}

/**
 * 漏洞列表
 */
export function getDetailVulnListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/vuln/list`,
        data,
    });
}

/**
 * 提pr
 */
export function pullRequestApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/pr/create`,
        data,
    });
}

/**
 * 访问令牌
 */
export function getTokenApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/token/info`,
        data,
    });
}

/**
 * 重新生成访问令牌
 */
export function resetTokenApi(data: Object) {
    return axios({
        method: 'post',
        url: `${store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31'}/team/token/gen`,
        data,
    });
}

/**
 * 项目刷新拉取
 */
export function refreshProjectApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/repo/refresh`,
        data,
        // headers: {
        //     noLoading: true,
        // },
    });
}

/**
 * 获取代码刷新状态
 */
export function getRefreshProjectStatusApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/refresh/status`,
        data,
        noLoading: true,
    });
}

/**
 * 取消刷新
 */
export function cancelRefreshApi(data: any) {
    return axios({
        method: 'post',
        url: `${isAddApi}/repository/refresh/cancel`,
        data,
        noLoading: true,
    });
}

/**
 * sbom导出
 */
export function exportSbomApi(data: any) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/sbom/export`,
        data: {
            subtask_id: data.sid,
            type: data.type,
            org_id: data.orgId,
            type_version: data?.type_version,
        },
        noLoading: true,
    });
}

/**
 * 项目组导出
 */
export function exportClassApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/group/export`,
        data,
    });
}

/**
 * 是否可PR
 */
export function canPrApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/pr/check`,
    });
}

/**
 * 获取筛选配置
 */
export function getFilterConfigApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/query/config/`,
    });
}

/**
 * 设置筛选配置
 */
export function setFilterConfigApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/query/config/`,
        data,
    });
}

/**
 * release兼容性
 */
export function getReleaseApi(data: any) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/comp/solutions/compat/release?component_name=${data.comp_name}&component_version=${data.comp_version}&ecosystem=${data.ecosystem}&repository=${data.comp_info?.repository}&target_version=${data.compatibleTargetVersion}`,
        noLoading: true,
    });
}

/**
 * issue兼容性
 */
export function getIssueApi(data: any) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/comp/solutions/compat/issue?component_name=${data.comp_name}&component_version=${data.comp_version}&ecosystem=${data.ecosystem}&repository=${data.comp_info?.repository}&target_version=${data.compatibleTargetVersion}`,
        noLoading: true,
    });
}

/**
 * 组件方法兼容性
 */
export function getCompApi(data: any) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/comp/solutions/compat/func?component_name=${data.comp_name}&component_version=${data.comp_version}&ecosystem=${data.ecosystem}&repository=${data.comp_info?.repository}&target_version=${data.compatibleTargetVersion}&project_id=${data.project_id}&subtask_id=${data.subtask_id}`,
        noLoading: true,
    });
}

/**
 * 漏洞触发路径
 */
export function getVulnTriggerApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/security/real/use`,
        data,
    });
}

/**
 * 导出报告
 */
export function getExportReportDataApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/report/offline/data`,
        data,
    });
}

/**
 * 检测报告导出
 */
export function exportReportApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/export`,
        data,
        noLoading: true,
    });
}

/**
 * 导出任务日志
 */
export function exportLogUrl(sid: string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/${sid}/log`,
        responseType: 'blob',
        // data,
    });
    // return `${isAddApi}/project/subtask/${sid}/log`;
}

/**
 * 文件溯源列表
 */
export function getFileSourceApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/autonomous/project_list`,
        data,
    });
}

/**
 * 相似代码片段列表
 */
export function getFileSourceSimilarCodeApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/autonomous/project_item_list`,
        data,
    });
}

/**
 * 匹配详情
 */
export function getTranceSourceCodeApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/autonomous/file_info`,
        data,
    });
}

/**
 * 许可证列表
 */
export function getLicenseListApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/autonomous/license_list`,
        data,
    });
}

/**
 * sbom组件信息
 */
export function getSbomInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/sbom/module_info`,
        data,
    });
}

/**
 * 取消检测
 */
export function cancelSubtaskApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/history/cancel`,
        data,
    });
}

/**
 * 许可证信息
 */
export function getLicenseDataApi(data: Object, teamid: string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/license/${data}?team_id=${teamid}`,
    });
}

/**
 * 依赖引入片段
 */
export function getSbomCodeApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/comp/code_fragment_result`,
        data,
    });
}

/**
 * 任务对比
 */
export function getCompareDataApi(data: any) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/compare?f=${data.fid}&s=${data.sid}`,
    });
}

/**
 * 敏感信息统计
 */
export function getsensitiveInfoApi(data: any) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/sensitive/info/${data}`,
    });
}

/**
 * 获取所有团队列表
 */
export function getAllTeamListApi() {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/all`,
        data: {},
    });
}

/**
 * 敏感信息
 */
export function getSensitiveDataApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/sensitive/get_list/${data}`,
    });
}

/**
 * 容器信息
 */
export function getContainerInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/panji/image/detail`,
        data,
    });
}

/*
 * 自定义项目名
*/
export function renameApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/rename`,
        data,
    });
}

/**
 * 标签列表
 */
export function getProjectTagsApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/team/tag/list`,
        data,
    });
}

/**
 * 标签列表
 */
export function getCurProjectTagsApi(id:string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/${id}/tags`,
        noLoading: true,
    });
}

/**
 * 添加项目标签
 */
export function addProjectTagApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/tag/add`,
        data,
    });
}

/**
 * 删除项目标签
 */
export function delProjectTagApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/tag/del`,
        data,
    });
}

/**
 * maven兜底信息
 */
export function getMavenInfoApi(sid:string) {
    return axios({
        noLoading: true,
        method: 'get',
        url: `${isAddApi}/project/subtask/sca_scan_warnings/${sid}`,
    });
}

/**
 * 检测耗时
 */
export function getConsumeTimeApi(sid:string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/subtask_time/${sid}`,
        noLoading: true,
    });
}

/**
 * 固件树对比
 */
export function getDiffFileTree(sid:string, fid:string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/compare/file_diff/tree?f=${fid}&s=${sid}`,
    });
}

/**
 * 文件内容信息对比
 */
export function getDiffFileInfo(fid:string, sid:string, fn: string, sn:string, fecode:string, sencode:string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/compare/file_diff/info?f=${fid}&s=${sid}&fn=${fn}&sn=${sn}&fn_encode=${fecode}&sn_encode=${sencode}`,
    });
}

/**
 * 溯源依据
 */
export function getTraceBasisDataApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/sbom/binary_evidence`,
        data,
        noLoading: true,
    });
}

/**
 * 关联文件
 */
export function getAssoFilesApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/comp/module_path`,
        data,
    });
}

/**
 * 获取更多信息
 */
export function getExtraInfoApi(data: { subtask_id: string; project_id: string }) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/ext`,
        params: data,
        noLoading: true,
    });
}

/**
 * 开始校准
 */
export function startAdjustApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/version_fix/start`,
        data,
    });
}

/**
 * 校准轮训
 */
export function getAdjustDetectStatusApi(sid:string) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/status/${sid}`,
        noLoading: true,
    });
}

/**
 * 删除版本规则
 */
export function delAdjustVersionRuleApi(params:Object) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/project/version_fix/rule/del`,
        data: params,
    });
}

/**
 * 版本校准记录
 */
export function getAdjustVersionRecordApi(params:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/version_fix/history`,
        params,
    });
}

/**
 * 组件用法校准
 */
export function adjustCompUseApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/project/subtask/way_of_use_fix/start`,
        data,
    });
}

/**
 * 组件版本规则列表
 */
export function getVersionFixRuleListApi(params: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/version_fix/rule/list`,
        params,
    });
}

/**
 * 组件版本校准规则删除
 */
export function delVersionFixRuleApi(data: Object) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/project/version_fix/rule/del`,
        data,
    });
}

/**
 * 组件用法校准规则列表
 */
export function getUseFixRuleListApi(params: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/way_of_use_fix/rule/list`,
        params,
    });
}

/**
 * 组件用法校准规则删除
 */
export function delUseFixRuleApi(data: Object) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/project/way_of_use_fix/rule/del`,
        data,
    });
}

/**
 * 组件用法校准记录
 */
export function getUseFixRuleRecordApi(params: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/way_of_use_fix/history`,
        params,
    });
}

/**
 * 许可证冲突与兼容列表
 */
export function getLicenseConflictListApi(data: Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/project/subtask/license_conflict/list`,
        params: data,
    });
}
