import axios from './index';

/**
 * 登录
 */
export const loginApi = (data) => axios({
    method: 'post',
    url: '/platform/login/password',
    data,
});

/**
 * 登出
 */
export const logoutApi = () => axios({
    method: 'get',
    url: '/platform/login/output',
});

/**
 * ad登录
 */
export const adLoginApi = (data) => axios({
    method: 'post',
    url: '/platform/login/ldap',
    data,
});

/**
 * 访问令牌
 */
export const getTokenApi = () => axios({
    method: 'get',
    url: '/platform/account/set_token',
});

/**
 * 角色列表
 */
export const getRoleListApi = (data) => axios({
    method: 'post',
    url: '/platform/role/get_role_list',
    data,
});

/**
 * 创建角色
 */
export const createRoleApi = (data) => axios({
    method: 'post',
    url: '/platform/role/create',
    data,
});

/**
 * 更新角色/platform/role/update
 */
export const updateRoleApi = (data) => axios({
    method: 'post',
    url: '/platform/role/update',
    data,
});

/**
 * 查询编辑角色数据
 */
export const getRoleInfoApi = (data) => axios({
    method: 'get',
    url: `/platform/role/get_role_info/${data}`,
});

/**
 * 删除角色
 */
export const deleteRoleApi = (data) => axios({
    method: 'delete',
    url: `/platform/role/delete/${data}`,
});

/**
 * 角色成员列表
 */
export const getRoleUserListApi = (data) => axios({
    method: 'post',
    url: '/platform/role/get_user_list',
    data,
});

/**
 * 删除角色成员
 */
export const deleteRoleUserApi = (data) => axios({
    method: 'post',
    url: '/platform/role/delete_user_list',
    data,
});

/**
 * 新增角色成员的列表
 */
export const getNotUserListApi = (data) => axios({
    method: 'post',
    url: '/platform/role/get_not_user_list',
    data,
});

/**
 * 添加角色成员
 */
export const addRoleUserApi = (data) => axios({
    method: 'post',
    url: '/platform/role/add_user_list',
    data,
});

/**
 * 用户信息
 */
export const getUserInfoApi = () => axios({
    method: 'get',
    url: '/platform/account/',
});

/**
 * 重新生成访问令牌
 */
export const setTokenApi = () => axios({
    method: 'get',
    url: '/platform/account/set_token',
});

/**
 * 修改密码
 */
export const updatePasswordApi = (data) => axios({
    method: 'post',
    url: '/platform/account/set_password',
    data,
});

/**
 * 获取用户导航权限
 */
export const getPowerApi = () => axios({
    method: 'get',
    url: '/platform/account/power',
});

/**
 * 角色成员数量
 */
export const getRoleUserCountApi = (data) => axios({
    method: 'get',
    url: '/platform/role/get_user_count',
    params: data,
});
