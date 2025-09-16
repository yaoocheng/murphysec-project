import store from '@/utils/store';
import axios from './index';

const isAddApi = store.envInfo.env === 'development' ? '/api/user/v31' : '/user/v31';
const platformProxy = store.envInfo.env === 'development' ? '/api/platform3' : '/platform3';

/**
 * 组织树
 */
export function getOrgTreeApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/org/list`,
        params: data,
        noLoading: true,
    });
}

/**
 * 成员列表
 */
export function getOrgMemberApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/org/user/list`,
        params: data,
    });
}

/**
 * 成员列表
 */
export function getOrgLongMemberApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/org/user/same_level_or_managed_org_user_list`,
        params: data,
    });
}

/**
 * 组织团队列表
 */
export function getOrgTeamApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/org/team/list`,
        params: data,
    });
}

/**
 * 添加组织
 */
export function addOrgApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/add`,
        data,
    });
}

/**
 * 编辑组织
 */
export function editOrgApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/update`,
        data,
    });
}

/**
 * 编辑组织信息
 */
export function editInfoOrgApi(data:number) {
    return axios({
        method: 'get',
        url: `${isAddApi}/org/info/${data}`,
    });
}

/**
 * 删除组织
 */
export function delOrgApi(data:number) {
    return axios({
        method: 'delete',
        url: `${isAddApi}/org/delete/${data}`,
    });
}

/**
 * 设置组织负责人
 */
export function setOrgAdminApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/user/set_oadmin`,
        data,
    });
}

/**
 * 设置组织负责人
 */
export function cancleOrgAdminApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/user/cancel_oadmin`,
        data,
    });
}

/**
 * 变更组织
 */
export function changeMemberOrgApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/user/set_org`,
        data,
        noLoading: true,
    });
}

/**
 * 创建团队
 */
export function createTeamApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/team/add`,
        data,
    });
}

/**
 * 编辑团队
 */
export function editTeamApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/team/update`,
        data,
    });
}

/**
 * 团队信息
 */
export function getTeamInfoApi(data:Object) {
    return axios({
        method: 'get',
        url: `${isAddApi}/org/team/info`,
        params: data,
    });
}

/**
 * 解散团队
 */
export function closeTeamApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/team/close`,
        data,
    });
}

/**
 * 解散团队
 */
export function quitTeamApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/team/exit`,
        data,
    });
}

/**
 * 获取登录用户权限信息
 */
export function getUserAuthApi() {
    return axios({
        method: 'get',
        url: `${platformProxy}/org/login/get_user_purview`,
    });
}

/**
 * 团队加入
 */
export function addMemberTeamApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/team/user/add`,
        data,
    });
}

/**
 * 团队加入
 */
export function removeMemberApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/team/user/remove`,
        data,
    });
}

/**
 * 上级负责人列表
 */
export function upOrgManageListApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/team/group_user/manager`,
        data,
    });
}

/**
 * 上级组织列表
 */
export function UpOrgListApi(data:number, isOrg:any) {
    return axios({
        method: 'get',
        url: `${isAddApi}/org/parent_org_ids/${data}?current_org=${isOrg}`,
    });
}

/**
 * 下级组织列表
 */
export function lowOrgListApi(data:number) {
    return axios({
        method: 'get',
        url: `${isAddApi}/org/child_org_ids/${data}`,
    });
}

/**
 * 批量添加团队
 */
export function batchAddTeamApi() {
    return store.envInfo.env === 'development' ? '/api/user/v31/org/team/import' : '/user/v31/org/team/import';
}

/**
 * 团队更多信息
 */
export function saveMoreTeamInfoApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/team/ext/save`,
        data,
    });
}

/**
 * 团队更多信息
 */
export function getMoreTeamInfoApi(data:Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/org/team/ext/get`,
        data,
    });
}
