import axios from './index';

/**
 * 安全问题列表
 */
export const getSecListApi = (data) => axios({
    method: 'post',
    url: '/platform/issue/list_issue',
    data,
});

/**
 * 安全问题详情
 */
export const getSecDetailApi = (data) => axios({
    method: 'get',
    url: `/platform/issue/${data}`,
});

/**
 * 安全问题关联安全能力列表
 */
export const getSecAbleApi = (data) => axios({
    method: 'post',
    url: '/platform/issue/security_capability',
    data,
});

/**
 * 安全问题关联应用信息名称信息
 */
export const getSecAppNameApi = (data) => axios({
    method: 'get',
    url: `/platform/issue/application_name/${data}`,
});

/**
 * 安全问题关联成分列表
 */
export const getSecIngredientListApi = (data) => axios({
    method: 'get',
    url: `/platform/issue/component/${data}`,
});

/**
 * 安全问题-漏洞列表
 */
export const getSecVulnListApi = (data) => axios({
    method: 'post',
    url: '/platform/application/issue/list_vuln',
    data,
});

/**
 * 安全问题-修改安全问题状态
 */
export const getSecUpdateStatusApi = (data) => axios({
    method: 'post',
    url: '/platform/issue/update_status',
    data,
});

/**
 * 安全能力列表
 */
export const getSecAbleListApi = (data) => axios({
    method: 'post',
    url: '/platform/security_capability/list_security_capability',
    data,
});

/**
 * 新增安全能力
 */
export const addSecAbleApi = (data) => axios({
    method: 'post',
    url: '/platform/security_capability/create_security_capability',
    data,
});

/**
 * 更新安全能力
 */
export const updateSecAbleApi = (data) => axios({
    method: 'post',
    url: '/platform/security_capability/update_security_capability',
    data,
});

/**
 * 删除安全能力
 */
export const delSecAbleApi = (data) => axios({
    method: 'post',
    url: '/platform/security_capability/delete_security_capability',
    data,
});

/**
 * 应用列表
 */
export const getAppListApi = (data) => axios({
    method: 'post',
    url: '/platform/application/list_application',
    data,
});

/**
 * 应用列表(不用组织)
 */
export const getAppListNoOrgApi = (data) => axios({
    method: 'post',
    url: '/platform/application/list_all_published_application',
    data,
});

/**
 * 应用删除
 */
export const delAppApi = (data) => axios({
    method: 'post',
    url: '/platform/application/delete_application',
    data,
    message: '删除成功',
});

/**
 * 创建应用
 */
export const addAppApi = (data) => axios({
    method: 'post',
    url: '/platform/application/create_application',
    data,
    message: '添加成功',
});

/**
 * 编辑应用
 */
export const updateAppApi = (data) => axios({
    method: 'post',
    url: '/platform/application/update_application',
    data,
    message: '更新成功',
});

/**
 * 应用载体
 */
export const getAppCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/application/bind_carrier_list',
    data,
});

/**
 * 应用信息
 */
export const getAppInfoApi = (data) => axios({
    method: 'get',
    url: '/platform/application/application_info',
    params: data,
});

/**
 * 关联载体
 */
export const bindAppCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/application/bind_carrier',
    data,
    message: '关联成功',
});

/**
 * 安全问题列表
 */
export const getAppSecListApi = (data) => axios({
    method: 'post',
    url: '/platform/application/issue/list_issue',
    data,
});

/**
 * 载体列表
 */
export const getBindAppCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/application/carrier_list',
    data,
});

/**
 * 应用安全能力
 */
export const getAppSecAbleApi = (data) => axios({
    method: 'post',
    url: '/platform/application/security_capability_list',
    data,
});

/**
 * 应用详情-供应链成分列表
 */
export const getChainListApi = (data) => axios({
    method: 'post',
    url: '/platform/application/component/component_list',
    data,
});

/**
 * 解绑应用载体
 */
export const unBindCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/application/unbind_carrier',
    data,
    message: '解绑成功',
});

/**
 * 应用状态列表
 */
export const getAppStatusListApi = () => axios({
    method: 'get',
    url: '/platform/application/application_status_list',
});

/**
 * 载体类型
 */
export const getAppCarrierTypeListApi = (data) => axios({
    method: 'post',
    url: '/platform/application/carrier_type_list',
    data,
});

/**
 * 供应链情报列表
 */
export const getChainIntelligenceListApi = (data) => axios({
    method: 'post',
    url: '/platform/murphy_vuln/list',
    // url: '/platform/v2/vuln_warn/list',
    data,
});

/**
 * 供应链成分列表
 */
export const getChainComponentListApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/get_component_list',
    data,
});

/**
 * 供应链成分详情
 */
export const getChainComponentDetailApi = (data) => axios({
    method: 'get',
    url: `/platform/component/component_info/${data}`,
});

/**
 * 获取供应链成分关联的安全问题
 */
export const getComponentRelatedSecIssuesApi = (data) => axios({
    method: 'get',
    url: `/platform/component/component_issue/${data}`,
});

/**
 * 获取供应链成分关联的应用
 */
export const getComponentRelatedApplicationsApi = (data) => axios({
    method: 'get',
    url: `/platform/component/component_application/${data.component_id}`,
    params: {
        organize_id: data.org_id,
    },
});

/**
 * 根据组织获取应用载体列表 - nav - 一级路由
 */
export const getCarrierListByOrganizeApi = (data) => axios({
    method: 'post',
    url: '/platform/carrier/get_carrier_list_by_organize',
    data,
});

/**
 * 获取应用载体列表 - 关联应用载体
 */
export const getCarrierListApi = (data) => axios({
    method: 'post',
    url: '/platform/carrier/carrier_list',
    data,
});

/**
 * 获取应用载体详情
 */
export const getCarrierDetailApi = (data) => axios({
    method: 'get',
    url: `/platform/carrier/carrier_info/${data}`,
});

/**
 * 获取应用载体关联的应用
 */
export const getCarrierRelatedAppsApi = (data) => axios({
    method: 'get',
    url: `/platform/carrier/carrier_application/${data}`,
});

/**
 * 获取应用载体关联的供应链成分
 */
export const getCarrierRelatedComponentsApi = (data) => axios({
    method: 'post',
    url: '/platform/carrier/carrier_component',
    data,
});

/**
 * 获取供应链成分关联的安全问题
 */
export const getCarrierRelatedSecIssuesApi = (data) => axios({
    method: 'post',
    url: '/platform/carrier/carrier_issue',
    data,
});

/**
 * 获取应用载体下绑定和未绑定应用列表
 */
export const getCarrierBindApplicationListApi = (data) => axios({
    method: 'post',
    url: '/platform/carrier/carrier_bind_application_list',
    data,
});

/**
 * 获取应用载体下安全能力
 */
export const getCarrierSecurityCapabilityApi = (data) => axios({
    method: 'get',
    url: `/platform/carrier/carrier_security_capability/${data}`,
});

/**
 * 应用载体绑定应用
 */
export const bindCarrierApplicationApi = (data) => axios({
    method: 'post',
    url: '/platform/carrier/bind_application',
    data,
});

/**
 * 创建应用载体
 */
export const createCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/carrier/create_carrier',
    data,
});

/**
 * 风险处置任务列表
 */
export const getRiskTaskListApi = (params) => axios({
    method: 'get',
    url: '/platform/risk_disposal_tasks',
    params,
});

/**
 * 风险处置任务详情
 */
export const getRiskTaskDetailApi = (id) => axios({
    method: 'get',
    url: `/platform/risk_disposal_tasks/${id}`,
});

/**
 * 更新风险处置任务状态
 */
export const updateRiskTaskStatusApi = (data) => axios({
    method: 'put',
    url: '/platform/risk_disposal_tasks/update_status',
    data,
});

/**
 * 更新风险处置任务负责人
 */
export const updateRiskTaskAssigneeApi = (data) => axios({
    method: 'put',
    url: '/platform/risk_disposal_tasks/update_assignee',
    data,
});
