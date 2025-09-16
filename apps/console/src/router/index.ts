import {
    createRouter,
    createWebHistory,
    RouteRecordRaw,
    NavigationGuardNext,
    RouteLocationNormalized,
} from 'vue-router';
import { getReportAllowApi, getIssueReportAllowApi } from 'api/asset';
import store from 'util/store';
import {
    getAccessInfos, getGlobalConfig, needLogin,
} from './hook';
import control from './control';
import { decrypt } from '@/utils/tools';

// 认证相关路由
const authRoutes: RouteRecordRaw[] = [
    {
        path: '/oauth',
        name: 'Oauth',
        component: () => import('@/view/login/OauthLogin.vue'),
    },
    {
        path: '/auth/ide',
        name: 'IdeaCertify',
        component: () => import('view/IdeaCertify.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('view/login/LoginIndex.vue'),
    },
];

// 检测相关路由
const detectRoutes: RouteRecordRaw[] = [
    {
        path: '/detect-access',
        name: 'Access',
        component: () => import('@/control/detect/DetectAccess.vue'),
        meta: { needLogin: true },
    },
    {
        path: '/detect-config',
        name: 'DetectConfigWrap',
        component: () => import('@/control/detect/DetectConfigWrap.vue'),
        meta: { needLogin: true },
    },
    {
        path: '/detect-main',
        name: 'DetectList',
        component: () => import('@/control/detect/DetectMain.vue'),
        meta: { needLogin: true, needAllAccess: true },
    },
];

// 报告相关路由
const reportRoutes: RouteRecordRaw[] = [
    {
        path: '/share-report/:code',
        name: 'Report',
        component: () => import('@/control/project/report/ReportIndex.vue'),
        async beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
            // eslint-disable-next-line no-use-before-define
            await handleReportAccess(to, next, getReportAllowApi, 'c');
        },
    },
    {
        path: '/issue-report/:code',
        name: 'IssueReport',
        component: () => import('@/control/platform/IssueReport.vue'),
        async beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
            // eslint-disable-next-line no-use-before-define
            await handleReportAccess(to, next, getIssueReportAllowApi, 'sc');
        },
    },
    {
        path: '/join',
        name: 'ReportJoin',
        component: () => import('@/view/ReportJoin.vue'),
    },
    {
        path: '/report/:tid/:sid',
        name: 'ReportOld',
        component: () => import('@/control/project/report/ReportOld.vue'),
    },
];

// 错误页面路由
const errorRoutes: RouteRecordRaw[] = [
    {
        path: '/pwd',
        name: 'pwd',
        component: () => import('@/view/ChangePassword.vue'),
    },
    {
        path: '/no-team',
        name: 'no-team',
        component: () => import('@/view/NoTeam.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/view/404.vue'),
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/view/403.vue'),
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
    },
];

// 处理报告访问权限
async function handleReportAccess(
    to: RouteLocationNormalized,
    next: NavigationGuardNext,
    allowApi: Function,
    storageKey: string,
) {
    const userInfo = decrypt(window.localStorage.getItem('g-u'));
    try {
        const { data } = await allowApi({
            share_code: to.params.code as string,
        });

        to.meta = { ...to.meta, ...data };

        if (data.allow_action === 11) {
            window.sessionStorage.setItem(storageKey, to.params.code as string);
            return next(userInfo ? '/join' : '/login');
        }

        return next();
    } catch (error) {
        return next('/platform/index');
    }
}

// 路由配置
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Control',
        component: () => import('@/control/ControlIndex.vue'),
        redirect: '/platform',
        children: control,
    },
    ...authRoutes,
    ...detectRoutes,
    ...reportRoutes,
    ...errorRoutes,
];

const router = createRouter({
    history: createWebHistory('/console/'),
    routes,
});

// 处理旧版本用户信息
const handleOldUserInfo = (): boolean => {
    const isOldUserInfo = window.localStorage.getItem('userInfo') || window.localStorage.getItem('g-u')?.includes('{');
    if (isOldUserInfo) {
        window.location.href = '/console/login';
        window.localStorage.clear();
        window.sessionStorage.clear();
        return true;
    }
    return false;
};

// 初始化用户信息
const initUserInfo = () => {
    const userInfo = decrypt(window.localStorage.getItem('g-u'));
    store.userInfo = userInfo;
    return userInfo;
};

// 初始化全局配置
const initGlobalConfigs = async (to: RouteLocationNormalized) => {
    try {
        await getGlobalConfig();
        await getAccessInfos(to);
    } catch (error) {
        console.error('初始化全局配置失败:', error);
        throw error;
    }
};

// 路由拦截处理
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
        // 处理旧版本用户信息
        if (handleOldUserInfo()) {
            return;
        }

        // 初始化用户信息
        const userInfo = initUserInfo();

        // 登录验证
        needLogin(to, next, userInfo as any);

        // 初始化全局配置
        await initGlobalConfigs(to);

        return next();
    } catch (error) {
        console.error('路由拦截处理失败:', error);
        return next('/login');
    }
});

export default router;
