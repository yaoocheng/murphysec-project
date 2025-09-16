import axios from './index';

/**
 * 业务系统列表
 */
export const getBusinessListApi = (data) => axios({
    method: 'post',
    url: '/platform/business_system/find_business_system',
    data,
});

/**
 * 创建业务系统
 */
export const addBusSysApi = (data) => axios({
    method: 'post',
    url: '/platform/business_system/create_business_system',
    data,
    message: '添加成功',
});

/**
 * 更新业务系统
 */
export const updateBusSysApi = (data) => axios({
    method: 'post',
    url: '/platform/business_system/update_business_system',
    data,
    message: '更新成功',
});

/**
 * 删除业务系统
 */
export const delBusSysApi = (data) => axios({
    method: 'post',
    url: '/platform/business_system/delete_business_system',
    data,
    message: '删除成功',
});

/**
 * 系统应用总数 查看业务系统下的绑定应用列表
 */
export const getAppListApi = (data) => axios({
    method: 'post',
    url: '/platform/business_system/find_bind_application_list',
    data,
});

/**
 * 绑定应用
 */
export const bindAppApi = (data) => axios({
    method: 'post',
    url: '/platform/business_system/bind_application',
    data,
    message: '关联成功',
});

/**
 * 系统状态
 */
export const getSysStatusListApi = () => axios({
    method: 'get',
    url: '/platform/business_system/business_system_status_list',
});

/**
 * 业务系统详情
 */
export const getBusSysDetailApi = (business_system_id) => axios({
    method: 'get',
    url: `/platform/business_system/business_system_info/${business_system_id}`,
});

/**
 * 仅获取业务系统下绑定的应用列表
 */
export const getBusSysComponentListApi = (data) => axios({
    method: 'get',
    url: `/platform/business_system/find_bind_application_list/${data}`,
});

/**
 * 取消关联应用
 */
export const cancelRelationApi = (data) => axios({
    method: 'post',
    url: '/platform/business_system/unbind_application',
    data,
});

/**
 * 获取业务系统上级组织
 */
export const getBusinessSystemParentOrganizeApi = (id) => axios({
    method: 'get',
    url: `/platform/business_system/find_organize_id/${id}`,
});
