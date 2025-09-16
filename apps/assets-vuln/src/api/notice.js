import axios from './index';

/**
 * 获取通知列表
 */
export const getNoticeListApi = (params) => axios({
    method: 'get',
    url: '/platform/notification',
    params,
});

/**
 * 阅读通知(单条)
 */
export const readNoticeSingleApi = (params) => axios({
    method: 'put',
    url: `/platform/notification/${params}/read`,
});

/**
 * 阅读通知(批量)
 */
export const readNoticeBatchApi = (params) => axios({
    method: 'put',
    url: '/platform/notification/mark_read',
    params,
});

/**
 * 获取未读通知数量
 */
export const getUnreadNoticeCountApi = () => axios({
    method: 'get',
    url: '/platform/notification/unread_summary',
});
