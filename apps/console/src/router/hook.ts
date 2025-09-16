import { localStorageUtil } from 'util/tools';
import { getAllAccessApi } from 'api/detect';
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import store from '@/utils/store';
import { getSystemConfig, getAdminSystemConfig } from '@/api/team';

// 路由守卫：检查是否需要登录
export const needLogin = (to: RouteLocationNormalized, next: NavigationGuardNext, userInfo: string | null): void => {
    // 强制修改密码
    if (to.meta.needLogin && localStorageUtil('get', 'enforce_password_changed')) {
        // 如果当前不是修改密码页面，则重定向到修改密码页面
        if (to.path !== '/pwd') {
            next('/pwd');
            return;
        }
    }
    if (to.meta.needLogin && !userInfo && !to.query.ticket) {
        window.sessionStorage.setItem('red-url', to.path);
        next('/login');
    }
};

// 获取团队ID
const getTeamId = (): string => {
    if (!store.teamInfo?.team_id) {
        throw new Error('团队信息不存在');
    }
    return store.teamInfo.team_id;
};

// 接入配置响应接口
interface AccessResponse {
    data: {
        [key: string]: any;
    };
}

// 获取已经接入的配置
export const getAccessInfos = async (to: RouteLocationNormalized): Promise<void> => {
    if (!to.meta.needAllAccess) {
        return;
    }

    try {
        const teamId = getTeamId();
        const res = await getAllAccessApi({ team_id: teamId }) as AccessResponse;

        if (!res?.data) {
            throw new Error('接入配置数据无效');
        }

        store.allAccessInfo = res.data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        console.error('获取接入配置失败:', errorMessage);
        // 这里可以添加用户提示，如果需要的话
        // showMessage('获取接入配置失败，请稍后重试', 'error');
    }
};

// 全局配置接口定义
interface GlobalConfig {
    [key: string]: any;
}

// 获取全局配置信息
export const getGlobalConfig = async (): Promise<void> => {
    // 检查缓存中是否已存在配置
    const cachedConfig = localStorageUtil('get', 'g-conf');
    if (cachedConfig) {
        store.conf = cachedConfig;
        return;
    }

    try {
        // 获取系统配置
        const systemConfigRes = await getSystemConfig();
        if (!systemConfigRes?.data) {
            systemConfigRes.data = {};
            // throw new Error('系统配置数据无效');
        }

        let adminConfigRes: { data: GlobalConfig } = { data: {} };
        try {
            // 获取管理员系统配置
            adminConfigRes = await getAdminSystemConfig();

            if (!adminConfigRes?.data) {
                adminConfigRes.data = {};
            // throw new Error('管理员配置数据无效');
            }
        } catch (error) {
            console.error(error);
        }

        // 合并配置
        const mergedConfig: GlobalConfig = {
            ...systemConfigRes.data,
            ...adminConfigRes.data,
        };

        // 更新store和缓存
        store.conf = mergedConfig;
        store.isLic = mergedConfig.is_license_setting_with_distribution;
        localStorageUtil('set', 'g-conf', mergedConfig);
    } catch (error) {
        console.error('获取全局配置失败:', error instanceof Error ? error.message : '未知错误');
        throw error; // 向上传递错误，允许调用方处理
    }
};
