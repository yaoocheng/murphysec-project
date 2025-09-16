import axios from './index';

/**
 * 获操作日志列表
 */
export const getOperationLogApi = (data) => axios({
    method: 'post',
    url: '/platform/operation_log/list',
    data,
});
