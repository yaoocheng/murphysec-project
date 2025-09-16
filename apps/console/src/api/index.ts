import Axios from 'axios';
import type {
    AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse,
} from 'axios';
import {
    showMessage, getUserInfo, localStorageUtil,
} from 'util/tools';
import store from 'util/store';
import { getAdjustDetect } from '../control/project/business';

// 定义响应数据接口
interface ResponseData {
    code: number;
    info?: string;
    data?: any;
    msg_zh?: string;
    msg_en?: string;
}

// 旧版user接口失败httpcode保持200不变 需判断返回code值res.data.code
// 新版platform失败code用httpcode接受，在成功时拿数据可不判断code200
const axios: AxiosInstance | any = Axios.create({
    baseURL: '',
});

let requestCount: number = 0; // 当前请求数量
const showLoading = (type: 'request' | 'response'): void => {
    if (!window.location.pathname.includes('/console/detail/') && !window.location.pathname.includes('/console/share-report')) {
        if (type === 'request') {
            requestCount++;
            store.loading = true;
        } else if (type === 'response' && requestCount > 0) {
            requestCount--;
            store.loading = requestCount > 0;
        }
    }
};

const unauthorizedHandle = (): void => {
    localStorageUtil('remove', 'g-u');
    localStorageUtil('remove', 'g-t');
    localStorageUtil('remove', 'g-conf');
    window.location.href = '/console/login';
};

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
    async (request: AxiosRequestConfig | any): Promise<AxiosRequestConfig> => {
        // 组织架构请求添加orgid参数
        if (request.method?.toLowerCase() === 'post' && request.data && !('org_id' in request.data)) {
            request.data.org_id = localStorageUtil('get', 'g-t')?.org_id;
        }

        if (request.method?.toLowerCase() === 'get' && request.params && !('org_id' in request.params)) {
            request.params.org_id = localStorageUtil('get', 'g-t')?.org_id;
        }

        const userInfo = getUserInfo();
        if (userInfo) {
            if (!request?.noToken) {
                request.headers = {
                    ...request.headers,
                    Authorization: userInfo.token,
                };
            }
            request.headers = {
                ...request.headers,
                Uid: userInfo.user_id,
                ...(store.isAllTeam && { 'Role-Id': userInfo.role_id }),
            };
        }

        // 分享报告header参数
        const pathSegments = window.location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];

        if (window.location.pathname.includes('share-report')) {
            request.headers = {
                ...request.headers,
                'Subtask-Share-Code': lastSegment,
            };
        }
        if (window.location.pathname.includes('issue-report')) {
            request.headers = {
                ...request.headers,
                'Security-Share-Code': lastSegment,
            };
        }

        if (!request?.noLoading) {
            showLoading('request');
        }
        return request;
    },
    (error: AxiosError) => Promise.reject(error),
);

// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
    (response: AxiosResponse<ResponseData>): AxiosResponse<ResponseData> => {
        // 防止多个请求同时报错，用户token过期时
        if (response.data?.code === 401 || response.data?.code === 403) {
            unauthorizedHandle();
        } else if (response.data?.code !== 200 && typeof response.data?.info === 'string') {
            showMessage(response.data.info, 'error');
        }
        showLoading('response');

        return response;
    },
    (error: AxiosError<ResponseData> | any): Promise<never> => {
        showLoading('response');
        const code = error.response?.status;
        const msg = error.response?.data?.msg_zh || error.response?.data?.msg_en || error.response?.statusText;

        if (msg && !error.response?.config?.noMessage) {
            showMessage(msg, 'error');
        }

        // if (code === 404 && !window.location.pathname.includes('404')) {
        //     window.location.href = '/console/404';
        // }

        if (code === 403 && !window.location.pathname.includes('403')) {
            window.location.href = '/console/403';
        }

        // 校准检测
        if (code === 428) {
            const pathArr = window.location.pathname.split('/');
            getAdjustDetect(pathArr[pathArr.length - 1]);
        }

        // token失效
        if (code === 401) {
            unauthorizedHandle();
        }
        return Promise.reject(error);
    },
);

export default axios;

// get request
export const get = async <T>(url: string, params: Record<string, any>): Promise<T> => axios.get(url, {
    params,
});

// post request
export const post = async <T>(url: string, data: Record<string, any>): Promise<T> => axios.post(url, data);
