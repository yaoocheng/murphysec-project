import axios from './index';
import store from '@/utils/store';

const isAddApi = store.envInfo.env === 'development' ? '/api/platform3/org' : '/platform3/org';

/**
 * 知识库软件
 */
export function getSoftwareKnowledgeListApi() {
    return axios({
        method: 'get',
        url: `${isAddApi}/knowledgebase/data `,
    });
}

/**
 * 组件查询提交
 */
export function queryCompListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/knowledgebase/list`,
        data,
        noLoading: true,
    });
    // return axios({
    //     method: 'get',
    //     url: '/console/mock/soft_list.json',
    //     params: data,
    // });
}

/**
 * 组件详情
 */
export function getCompDetailApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/knowledgebase/asset/detail`,
        data,
    });
    // return axios({
    //     method: 'get',
    //     url: '/console/mock/comp_detail.json',
    //     params: data,
    // });
}

/**
 * 版本详情
 */
export function getCompVersionDetailApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/knowledgebase/assetVersion/baseInfo`,
        data,
    });
    // return axios({
    //     method: 'get',
    //     url: '/console/mock/version.json',
    //     params: data,
    // });
}

/**
 * 项目使用列表
 */
export function getUseProjectListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/knowledgebase/assetVersion/projectList`,
        data,
    });
    // return axios({
    //     method: 'get',
    //     url: '/console/mock/use_project.json',
    //     params: data,
    // });
}

/**
 * 漏洞列表
 */
export function getVersionVulnListApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/knowledgebase/assetVersion/vulnList`,
        data,
    });
    // return axios({
    //     method: 'get',
    //     url: '/console/mock/vuln.json',
    //     params: data,
    // });
}

/**
 * 漏洞详情
 */
export function getVulnInfoApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/knowledgebase/assetVersion/vulnInfo`,
        data,
        noLoading: true,
    });
    // return axios({
    //     method: 'get',
    //     url: '/console/mock/vuln_info.json',
    //     params: data,
    // });
}

/**
 * 组件跳转
 */
export function compIsJumpApi(data: Object) {
    return axios({
        method: 'post',
        url: `${isAddApi}/asset/getAssetInfo`,
        data,
    });
    // return axios({
    //     method: 'get',
    //     url: '/console/mock/vuln_info.json',
    //     params: data,
    // });
}
