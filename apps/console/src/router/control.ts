// meta: navType导航类型(1 主页导航 2 个人导航 3 组织导航)
import store from 'util/store';
import { getUserInfo } from 'util/tools';
import set from './set';
import { getOrgAuthInfo } from '@/control/org/hooks';

// 通用meta配置
const commonMeta = {
    needLogin: true,
    navType: 1,
};

// 平台相关路由
const platformRoutes = [
    {
        path: '/platform',
        name: 'Platform',
        component: () => import('@/control/platform/PlatformIndex.vue'),
        redirect: '/platform/index',
        children: [
            {
                path: '/platform/index',
                name: 'PlatformIndex',
                component: () => import('@/control/platform/PlatformRepository.vue'),
                meta: {
                    ...commonMeta,
                    pathName: '/platform',
                },
                beforeEnter(to:any, from:any, next:Function) {
                    if (to.query.ticket) return next(`/oauth?ticket=${to.query.ticket}`);
                    if (window.sessionStorage.getItem('c') || window.sessionStorage.getItem('sc')) return next('/join');

                    const redUrl = window.sessionStorage.getItem('red-url');
                    if (redUrl) {
                        window.sessionStorage.removeItem('red-url');
                        return next(redUrl);
                    }

                    if (getUserInfo() && store.isAllTeam) {
                        return getOrgAuthInfo().userRole.value === 'Custom'
                            ? next(store.userInfo?.sca_menu[0])
                            : next('/platform/issue');
                    }
                    return next();
                },
            },
            {
                path: '/platform/overview',
                name: 'PlatformOverview',
                component: () => import('@/control/platform/TeamOverview.vue'),
                meta: { ...commonMeta, pathName: '/platform' },
            },
            {
                path: '/platform/issue',
                name: 'PlatformIssue',
                component: () => import('@/control/platform/IssueListPage.vue'),
                meta: { ...commonMeta, pathName: '/platform' },
            },
        ],
    },
];

// 项目相关路由
const projectRoutes = [
    {
        path: '/project',
        name: 'Project',
        component: () => import('@/control/project/ProjectIndex.vue'),
        children: [
            {
                path: '/project/list',
                name: 'ProjectList',
                component: () => import('@/control/project/ProjectList.vue'),
                meta: { ...commonMeta, pathName: '/project' },
            },
            {
                path: '/project/group',
                name: 'ProjectGroup',
                component: () => import('@/control/project/ProjectClass.vue'),
                meta: { ...commonMeta, pathName: '/project' },
            },
            {
                path: '/project/task',
                name: 'ProjectTask',
                component: () => import('@/control/project/ProjectTask.vue'),
                meta: { ...commonMeta, pathName: '/project' },
            },
        ],
    },
    {
        path: '/history/:id',
        name: 'History',
        component: () => import('@/control/project/ProjectHistory.vue'),
        meta: { ...commonMeta, pathName: '/project' },
    },
    {
        path: '/detail/:tid/:sid',
        name: 'Detail',
        component: () => import('@/control/project/detail/DetailIndex.vue'),
        meta: { ...commonMeta, pathName: '/project' },
    },
];

// 资产相关路由
const assetRoutes = [
    {
        path: '/asset',
        name: 'Asset',
        component: () => import('@/control/asset/AssetIndex.vue'),
        children: [
            {
                path: '/asset',
                name: 'AssetComp',
                component: () => import('@/control/asset/AssetComps.vue'),
                meta: { ...commonMeta, pathName: '/asset' },
            },
            {
                path: '/license',
                name: 'AssetLicense',
                component: () => import('@/control/asset/AssetLicense.vue'),
                meta: { ...commonMeta, pathName: '/asset' },
            },
        ],
    },
    {
        path: '/risk',
        name: 'Risk',
        component: () => import('@/control/asset/RiskManage.vue'),
        meta: { ...commonMeta, pathName: '/risk' },
    },
    {
        path: '/export',
        name: 'Export',
        component: () => import('@/control/asset/ExportIndex.vue'),
        meta: { ...commonMeta, pathName: '/export' },
    },
    {
        path: '/operate',
        name: 'Operate',
        component: () => import('@/control/asset/OperateIndex.vue'),
        meta: { ...commonMeta, pathName: '/operate' },
    },
];

// 知识库相关路由
const knowledgeRoutes = [
    {
        path: '/knowledge',
        name: 'Knowledge',
        component: () => import('@/control/knowledge/Index.vue'),
        meta: { ...commonMeta, pathName: '/knowledge' },
    },
    {
        path: '/software-detail',
        name: 'SoftwareDetail',
        component: () => import('@/control/knowledge/SoftwareDetail.vue'),
        meta: { ...commonMeta, pathName: '/knowledge' },
    },
    {
        path: '/version-detail',
        name: 'VersionDetail',
        component: () => import('@/control/knowledge/VersionDetail.vue'),
        meta: { ...commonMeta, pathName: '/knowledge' },
    },
];

// 其他功能路由
const otherRoutes = [
    {
        path: '/code',
        name: 'CodeProject',
        component: () => import('@/control/platform/CodeProjectPage.vue'),
        meta: { ...commonMeta, pathName: '/code', needAllAccess: true },
    },
    {
        path: '/integrate',
        name: 'Integrate',
        component: () => import('@/control/detect/IntegrateIndex.vue'),
        meta: { ...commonMeta, pathName: '/integrate', needAllAccess: true },
    },
    {
        path: '/set',
        name: 'Set',
        component: () => import('@/control/set/SetIndex.vue'),
        redirect: '/set/team',
        meta: { ...commonMeta, pathName: '/set', needAllAccess: true },
        children: set,
    },
    {
        path: '/member',
        name: 'MemberIndex',
        component: () => import('@/control/team/MemberIndex.vue'),
        meta: { ...commonMeta, pathName: '/member' },
    },
];

// 用户相关路由
const userRoutes = [
    {
        path: '/usr/account',
        name: 'UserAccount',
        component: () => import('@/control/user/UserAccount.vue'),
        meta: { ...commonMeta, navType: 2 },
    },
    {
        path: '/org',
        name: 'Org',
        component: () => import('@/control/org/Index.vue'),
        meta: { ...commonMeta, navType: 3 },
    },
];

export default [
    ...platformRoutes,
    ...projectRoutes,
    ...assetRoutes,
    ...knowledgeRoutes,
    ...otherRoutes,
    ...userRoutes,
];
