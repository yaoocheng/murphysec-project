import store from 'util/store';
import { getTeamInfoApi } from 'api/org';
import {
    NavigationGuardNext,
    RouteLocationNormalized,
} from 'vue-router';

const metaConf = {
    needLogin: true,
    navType: 1,
    pathName: '/set',
};

// 团队和用户设置相关路由
const teamAndUserRoutes = [
    {
        path: '/set/team',
        name: 'TeamSet',
        component: () => import('@/control/set/TeamSet.vue'),
        meta: metaConf,
        async beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
            if (store.isAllTeam) {
                window.localStorage.removeItem('stra-reset-org-id');
                return next('/set/comp-strategy');
            }

            try {
                const { data } = await getTeamInfoApi({
                    team_id: store.teamInfo.team_id,
                });
                window.localStorage.setItem('stra-reset-org-id', data.org_info?.id);
                return next();
            } catch (error) {
                console.log(error);
            }
        },
    },
    {
        path: '/set/token',
        name: 'SetToken',
        component: () => import('@/control/set/UserToken.vue'),
        meta: metaConf,
    },
    {
        path: '/set/global',
        name: 'GlobalSet',
        component: () => import('@/control/set/GlobalSet.vue'),
        meta: metaConf,
    },
];

// 许可证相关路由
const licenseRoutes = [
    {
        path: '/set/license-manage',
        name: 'LicenseManage',
        component: () => import('@/control/set/license/Index.vue'),
        meta: metaConf,
    },
    {
        path: '/set/license-strategy',
        name: 'LicenseStrategy',
        component: () => import('@/control/set/license/LicenseStra.vue'),
        meta: metaConf,
    },
    {
        path: '/set/license-type',
        name: 'LicenseType',
        component: () => import('@/control/set/license/LicenseType.vue'),
        meta: metaConf,
    },
];

// 策略相关路由
const strategyRoutes = [
    {
        path: '/set/comp-strategy',
        name: 'CompStrategy',
        component: () => import('@/control/set/comp-strategy/Index.vue'),
        meta: metaConf,
    },
    {
        path: '/set/project-strategy',
        name: 'ProjectStrategy',
        component: () => import('@/control/set/project-strategy/Index.vue'),
        meta: metaConf,
    },
    {
        path: '/set/detect-temp',
        name: 'DetectTemp',
        component: () => import('@/control/set/detect-temp/Index.vue'),
        meta: metaConf,
    },
    {
        path: '/set/suggest-strategy',
        name: 'SuggestStrategy',
        component: () => import('@/control/set/suggest-strategy/Index.vue'),
        meta: metaConf,
    },
];

// 白名单和敏感信息相关路由
const whiteListRoutes = [
    {
        path: '/set/vuln-white-list',
        name: 'VulnWhiteList',
        component: () => import('@/control/set/vuln-list/Index.vue'),
        meta: metaConf,
    },
    {
        path: '/set/white-list',
        name: 'WhiteList',
        component: () => import('@/control/set/white-list/Index.vue'),
        meta: metaConf,
    },
    {
        path: '/set/sensitive',
        name: 'Sensitive',
        component: () => import('@/control/set/SensitiveList.vue'),
        meta: metaConf,
    },
];

// 组件和私有源相关路由
const componentRoutes = [
    {
        path: '/set/comp',
        name: 'SetComp',
        component: () => import('@/control/set/PrivateComp.vue'),
        meta: metaConf,
    },
    {
        path: '/set/private',
        name: 'Private',
        component: () => import('@/control/set/PrivateSource.vue'),
        meta: metaConf,
    },
];

// 第三方集成相关路由
const thirdPartyRoutes = [
    {
        path: '/set/github',
        name: 'GithubSet',
        component: () => import('@/control/set/GithubSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/gitlab',
        name: 'GitlabSet',
        component: () => import('@/control/set/GitlabSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/coding',
        name: 'CodingSet',
        component: () => import('@/control/set/CodingSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/harbor',
        name: 'HarborSet',
        component: () => import('@/control/set/HarborSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/jfrog',
        name: 'JfrogSet',
        component: () => import('@/control/set/JfrogSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/nexus',
        name: 'NexusSet',
        component: () => import('@/control/set/NexusSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/gerrit',
        name: 'GerritSet',
        component: () => import('@/control/set/GerritSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/folib',
        name: 'FolibSet',
        component: () => import('@/control/set/FolibSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/bitbucket',
        name: 'BitbucketSet',
        component: () => import('@/control/set/BitbucketSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/ecr',
        name: 'EcrSet',
        component: () => import('@/control/set/EcrSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/ezone_package',
        name: 'EzonePackageSet',
        component: () => import('@/control/set/EzonePackageSet.vue'),
        meta: metaConf,
    },
    {
        path: '/set/ezone_code',
        name: 'EzoneCodeSet',
        component: () => import('@/control/set/EzoneCodeSet.vue'),
        meta: metaConf,
    },
];

// 导出所有路由配置
export default [
    ...teamAndUserRoutes,
    ...licenseRoutes,
    ...strategyRoutes,
    ...whiteListRoutes,
    ...componentRoutes,
    ...thirdPartyRoutes,
];
