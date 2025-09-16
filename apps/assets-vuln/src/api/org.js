import axios from './index';

/**
 * 负责人列表
 */
export const getUserListApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/list_organize_user',
    data,
});

/**
 * 组织树
 */
export const getOrgTreeSelectDataApi = (data) => axios({
    method: 'post',
    // url: '/platform/organize/find_organize',
    // 组织架构查询缓存接口
    url: '/platform/organize/find_organize_tree',
    data,
});

/**
 * 删除组织
 */
export const delOrgTreeApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/delete_organize',
    data,
    message: '删除成功',
});

/**
 * 创建组织
 */
export const addOrgApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/create',
    data,
    message: '添加成功',
});

/**
 * 编辑组织
 */
export const updateOrgApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/update_organize',
    data,
    message: '更新成功',
});

/**
 * 关联 未关联系统
 */
export const getRelaSysApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/bind_business_system_list',
    data,
});

/**
 * 关联系统
 */
export const bindSysApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/bind_business_system',
    data,
    message: '关联成功',
});

/**
 *  分级获取组织
 */
export const getOrgByLevelApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/find_organize_by_level',
    data,
});

/**
 * 用组织id获取组织信息
 */
export const getOrgByIdApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/get_org_info',
    data,
});

/**
 * 角色选择成员
 */
export const getRoleMemberListApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/list_employees_user',
    data,
});

/**
 * 全局组件选择
 */
export const getGlobalOrgTreeApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/find_user_organize_by_level',
    data,
});

/**
 * 创建组织
 */
export const createOrgApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/create',
    data,
});

/**
 * 更新组织
 */
export const updateCurOrgApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/update_organize',
    data,
});

/**
 * 删除组织
 */
export const delCurOrgApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/delete_organize',
    data,
});

/**
 * 组织人员数量
 */
export const getOrgUserCountApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/user/org_user_count',
    data,
});

/**
 * 组织下成员列表
 */
export const getOrgMemberListApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/user/list',
    data,
});

/**
 * 创建组织用户
 */
export const createOrgUserApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/user/create_user',
    data,
});

/**
 * 重置密码
 */
export const resetPasswordApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/user/reset_password',
    data,
});

/**
 * 成员状态
 */
export const userStatusApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/user/change_user_status',
    data,
});

/**
 * 编辑成员
 */
export const editUserApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/user/edit_user',
    data,
});

/**
 * 离职成员列表
 */
export const getLeavedUserListApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/user/list_leaved',
    data,
});

/**
 * 恢复成员
 */
export const restoreUserApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/user/restore_user',
    data,
});

/**
 * 删除成员
 */
export const delUserApi = (data) => axios({
    method: 'post',
    url: '/platform/organize/user/delete_user',
    data,
});

/**
 * 负责人列表
 */
export const getContractUserListApi = (data) => axios({
    method: 'post',
    url: `/platform/contract_landing/${data.id}/list_organize_user`,
    data,
});

/**
 *  分级获取组织
 */
export const getContractOrgByLevelApi = (data) => axios({
    method: 'post',
    url: `/platform/contract_landing/${data.id}/find_organize_by_level`,
    data,
});
