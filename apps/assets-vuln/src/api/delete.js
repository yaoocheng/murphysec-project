import axios from './index';

/**
 * 判断安全能力能否删除
 */
export const judgeSecurityCapabilityApi = (security_capability_id) => axios({
    method: 'get',
    url: `/platform/security_capability/delete_security_capability_check/${security_capability_id}`,
});

/**
 * 判断组织能否删除
 */
export const judgeOrganizationApi = (organize_id) => axios({
    method: 'post',
    url: '/platform/organize/check_del',
    data: {
        id: organize_id,
    },
});

/**
 * 判断业务系统能否删除
 */
export const judgeBusinessSystemApi = (business_system_id) => axios({
    method: 'post',
    url: '/platform/data_preparation/business_system_delete_check',
    data: {
        id: business_system_id,
    },
});

/**
 * 判断应用能否删除
 */
export const judgeApplicationApi = (application_id) => axios({
    method: 'post',
    url: '/platform/application/check_del',
    data: {
        id: application_id,
    },
});

/**
 * 判断插件能否删除
 */
export const judgePluginApi = (plugin_id) => axios({
    method: 'get',
    url: `/platform/plug/mark/${plugin_id}`,
});
