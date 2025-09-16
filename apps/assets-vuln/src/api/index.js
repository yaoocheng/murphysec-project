import Axios from 'axios';
import { message } from 'ant-design-vue';
import { userInfo, globalState } from '../store';

export const BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : '';

const axios = Axios.create({
    baseURL: BASE_URL,
});

const unauthorizedHandle = () => {
    userInfo.value = {};
    window.location.href = '/login';
};

const requestNum = []; // 当前请求数量
const showLoader = (type) => {
    if (type === 'request') {
        requestNum.push(1);
        if (requestNum.length) {
            globalState.loading = true;
        }
    } else if (type === 'response') {
        requestNum.pop();
        if (!requestNum.length) {
            globalState.loading = false;
        }
    }
};

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
    async (request) => {
        if (userInfo.value?.token) {
            request.headers.Authorization = `${userInfo.value.token}`;
        }
        showLoader('request');
        return request;
    },
    (error) => Promise.reject(error),
);

// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
    (response) => {
        // 防止多个请求同时报错，用户token过期时
        // if (response.data?.code === 401 || response.data?.code === 403) {
        //     unauthorizedHandle();
        // } else if ((response.data?.code !== 200) && typeof response.data?.info === 'string') {
        //     message.error(response.data?.info);
        // }
        // if (response.config.message) {
        //     message.success('操作成功');
        // }
        showLoader('response');
        return response;
    },
    (error) => {
        showLoader('response');
        const code = error.response?.status;
        const msg = error.response?.data?.msg_zh || error.response?.data?.msg_en || error.response?.statusText
            || error.response?.msg_zh || error.response?.msg_en;
        message.error(msg, 3);

        // token失效
        if (code === 401) {
            unauthorizedHandle();
        }
        return Promise.reject(error);
    },
);

export default axios;
