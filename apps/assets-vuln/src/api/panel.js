import axios from './index';
import { userInfo } from '@/store';

/**
 * 获取仪表盘数据(数量)
 */
export const getDashboardCountApi = (data) => axios({
    method: 'post',
    url: '/platform/dashboard/count',
    data: {
        organize_id: userInfo.value.org_id,
        ...data,
    },
});

/**
 * 获取仪表盘数据(图表)
 */
export const getDashboardChartsApi = (data) => axios({
    method: 'post',
    url: '/platform/dashboard/chart',
    data: {
        organize_id: userInfo.value.org_id,
        ...data,
    },
});

/**
 * 获取安全问题级别与处置状态分布图数据(图表)
 */
export const getSecurityLevelStatusChartApi = (data) => axios({
    method: 'post',
    url: '/platform/dashboard/issue_level_status_chart',
    data,
});

/**
 * 获取驾驶舱数据--chart
 */
export const getDashboardDataApi = (data) => axios({
    method: 'post',
    url: '/platform/dashboard/cahcore_metrics_chart',
    data,
});

/**
 * 获取驾驶舱数据--列表
 */
export const getDashboardListApi = (params) => axios({
    method: 'get',
    url: '/platform/dashboard/main_page',
    params,
});
