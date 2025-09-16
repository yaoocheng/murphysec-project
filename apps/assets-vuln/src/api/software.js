import axios from './index';

/**
 * 软件成分列表
 */
export const getSoftwareComponentListApi = (data) => axios({
    method: 'post',
    url: '/platform/component/component_list',
    data,
});

/**
 * 获取应用载体下软件成分列表
 */
export const getSoftwareComponentListByCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/carrier/carrier_component',
    data,
});

/**
 * 删除载体和成分的关联
 */
export const deleteSoftwareComponentCarrierApi = (data) => axios({
    method: 'delete',
    url: '/platform/carrier/delete_carrier_component_relation_by_ids',
    data,
});

/**
 * 新增/编辑软件成分
 */
export const addSoftwareComponentApi = (data) => axios({
    method: 'post',
    url: '/platform/component/component_create_update',
    data,
});

/**
 * 通过成分查询绑定的应用载体
 */
export const getSoftwareComponentBindCarrierApi = (params) => axios({
    method: 'get',
    url: `/platform/component/get_bind_carrier_by_component/${params}`,
});

/**
 * 通过成分查询未绑定的应用载体
 */
export const getSoftwareComponentUnBindCarrierApi = (params) => axios({
    method: 'get',
    url: `/platform/component/get_unbind_carrier_by_component/${params}`,
});

/**
 * 软件成分绑定载体
 */
export const bindSoftwareComponentCarrierApi = (data) => axios({
    method: 'post',
    url: '/platform/component/component_bind_carrier',
    data,
});

/**
 * 软件成分详情
 */
export const getSoftwareComponentDetailApi = (params) => axios({
    method: 'get',
    url: `/platform/component/component_info/${params}`,
});

/**
 * 软件成分下的应用列表
 */
export const getSoftwareComponentAppListApi = (data) => axios({
    method: 'post',
    url: '/platform/component/component_bind_application_list_paging',
    data,
});

/**
 * 软件成分下的载体列表
 */
export const getSoftwareComponentCarrierListApi = (data) => axios({
    method: 'post',
    url: '/platform/component/get_bind_carrier_by_component_paging',
    data,
});

/**
 * 软件成分下的问题列表
 */
export const getSoftwareComponentIssueListApi = (data) => axios({
    method: 'post',
    url: '/platform/component/component_bind_issue_list_paging',
    data,
});

/**
 * 软件成分绑定应用
 */
export const bindSoftwareComponentAppApi = (data) => axios({
    method: 'post',
    url: '/platform/component/component_bind_application',
    data,
});

/**
 * 软件成分合同列表
 */
export const getSoftwareComponentContractListApi = (params) => axios({
    method: 'get',
    url: '/platform/component_contract',
    params,
});

/**
 * 软件成分合同批量上传
 */
export const uploadSoftwareComponentContractApi = (data) => axios({
    method: 'post',
    url: '/platform/component_contract_commit_uploaded',
    data,
});

/**
 * 软件成分合同删除
 */
export const deleteSoftwareComponentContractApi = (params) => axios({
    method: 'delete',
    url: `/platform/component_contract/${params}`,
});

/**
 * 软件成分获取合同详情
 */
export const getSoftwareComponentContractDetailApi = (params) => axios({
    method: 'get',
    url: `/platform/component_contract/${params}`,
});

/**
 * 软件成分合同编辑
 */
export const editSoftwareComponentContractApi = (params, data) => axios({
    method: 'post',
    url: `/platform/component_contract/stage1_create_component/${params}`,
    data,
});

// 分享url
export const stage2CreateShareUrlApi = (params, data) => axios({
    method: 'post',
    url: `/platform/component_contract/stage2_create_share_url/${params}`,
    data,
});

/**
 * 获取合同识别依据
 */
export const getSoftwareComponentContractIdentifyApi = (params) => axios({
    method: 'get',
    url: '/platform/component_contract/get_basis_for',
    params,
    responseType: 'blob',
});

/**
 * 邀请协作接口
 */
export const inviteCollaborationApi = (data) => axios({
    method: 'post',
    url: '/component/component_create_update',
    data,
});

/**
 * 获取成分详情
 */
export const getComponentDetailApi = (shareId) => axios({
    method: 'get',
    url: `/platform/contract_landing/${shareId}`,
});

/**
 * 获取所有应用
 */
export const getAllApplicationsApi = (shareId, data) => axios({
    method: 'post',
    url: `/platform/contract_landing/${shareId}/application`,
    data,
});

/**
 * 保存成分信息修改
 */
export const saveComponentInfoApi = (data) => axios({
    method: 'post',
    url: `/platform/contract_landing/${data.shareId}`,
    data: data.data,
});
