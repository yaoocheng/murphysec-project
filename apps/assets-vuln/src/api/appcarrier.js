import axios from './index';

/**
 * 获取应用载体绑定的安全能力列表
 */
export const getAppCarrierBindSecAbilityList = (carrier_id) => axios({
    method: 'get',
    url: `/platform/carrier/carrier_security_capability/${carrier_id}`,
});

/**
 * 获取应用载体未绑定的安全能力列表
 */
export const getAppCarrierUnbindSecAbilityList = (data) => axios({
    method: 'post',
    url: '/platform/carrier/get_security_capability_unbind_list_by_carrierId',
    data,
});

/**
 * 绑定应用载体和安全能力
 */
export const bindAppCarrierSecAbility = (data) => axios({
    method: 'post',
    url: '/platform/carrier/carrier_bind_security',
    data,
});

/**
 * 解绑应用载体和安全能力
 */
export const unbindAppCarrierSecAbility = (data) => axios({
    method: 'post',
    url: '/platform/carrier/carrier_unbind_security',
    data,
});
