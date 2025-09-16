import {
    createRouter,
    createWebHistory,
} from 'vue-router';
import { ROUTER_PATH } from '@/constants';
import { userInfo } from '@/store';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('view/login/Index.vue'),
    },
    {
        path: ROUTER_PATH.inviteCollaboration,
        name: 'inviteCollaboration',
        component: () => import('@/view/survey/SurveyForm.vue'),
    },
    {
        path: '/',
        name: 'index',
        component: () => import('view/Index.vue'),
        redirect: ROUTER_PATH.dashboard,
        children: [
            {
                path: ROUTER_PATH.dashboard,
                name: 'dashboard',
                component: () => import('@/view/dashboard/Index.vue'),
                meta: {
                    bread: [{ name: '驾驶舱', path: ROUTER_PATH.dashboard }],
                },
            },
            // {
            //     path: ROUTER_PATH.panel,
            //     name: 'panel',
            //     component: () => import('@/view/panel/Index.vue'),
            //     meta: {
            //         bread: [{ name: '仪表盘', path: ROUTER_PATH.panel }],
            //     },
            // },
            {
                path: ROUTER_PATH.businessManage,
                name: 'businessManage',
                component: () => import('@/view/business/Index.vue'),
                redirect: ROUTER_PATH.businessManageList,
                children: [
                    {
                        path: ROUTER_PATH.businessManageList,
                        name: 'businessManageList',
                        component: () => import('@/view/business/List.vue'),
                        meta: {
                            routeType: 'business',
                        },
                        beforeEnter(to, from, next) {
                            to.meta.bread = [{ name: '业务系统', path: ROUTER_PATH.businessManage }];
                            next();
                        },
                    },
                    {
                        path: ROUTER_PATH.businessManageDetail,
                        name: 'businessManageDetail',
                        component: () => import('@/view/business/Detail/Index.vue'),
                        beforeEnter(to, from, next) {
                            to.meta.bread = [{ name: '业务系统', path: ROUTER_PATH.businessManage }, { name: '业务系统详情', path: ROUTER_PATH.businessManageDetail }];
                            next();
                        },
                        meta: {
                            routeType: 'business',
                        },
                    },
                ],
            },
            {
                path: ROUTER_PATH.appManage,
                name: 'appManage',
                component: () => import('@/view/app-manage/Index.vue'),
                meta: {
                    bread: [{ name: '应用管理', path: ROUTER_PATH.appManage }],
                    routeType: 'business',

                },
            },
            // 应用详情
            {
                path: ROUTER_PATH.appManageDetail,
                name: 'appManageDetail',
                component: () => import('@/view/app-manage/details/Index.vue'),
                meta: {
                    bread: [{ name: '应用管理', path: ROUTER_PATH.appManage },
                        { name: '应用详情', path: ROUTER_PATH.appManageDetail }],
                    routeType: 'business',
                },
                beforeEnter(to, from, next) {
                    if (from.name === 'appManage') {
                        to.meta.bread = [{ name: '应用管理', path: ROUTER_PATH.appManage },
                            { name: '应用详情', path: to.fullPath }];
                    } else if (from.name === 'appVectorDetail') {
                        to.meta.bread = [
                            { name: '应用载体', path: ROUTER_PATH.appVectorList },
                            { name: '应用载体详情', path: from.fullPath },
                            { name: '应用详情', path: to.fullPath },
                        ];
                    }

                    next();
                },
            },
            {
                // path: ROUTER_PATH.secIssueDetail,
                path: ROUTER_PATH.issueDetail,
                name: 'issueDetail',
                // component: () => import('@/view/app/details/SecIssueDetail.vue'),
                component: () => import('@/view/sec-issue/Detail.vue'),
                meta: {
                    bread: [],
                },
                beforeEnter(to, from, next) {
                    to.meta.bread = [{ name: '应用管理', path: ROUTER_PATH.appManage },
                        { name: '应用详情', path: from.fullPath },
                        { name: '安全问题详情', path: to.fullPath },
                    ];
                    next();
                },

            },
            {
                path: ROUTER_PATH.secIssue,
                name: 'secIssue',
                component: () => import('@/view/sec-issue/Index.vue'),
                redirect: ROUTER_PATH.secIssueList,
                children: [
                    {
                        path: ROUTER_PATH.secIssueList,
                        name: 'secIssueList',
                        component: () => import('@/view/sec-issue/List.vue'),
                        meta: {
                            bread: [{ name: '安全问题', path: ROUTER_PATH.secIssue }],
                            routeType: 'issue',
                        },
                    },
                    {
                        path: ROUTER_PATH.secIssueDetail,
                        name: 'secIssueDetail',
                        component: () => import('@/view/sec-issue/Detail.vue'),
                        meta: {
                            bread: [
                                // { name: '安全问题', path: ROUTER_PATH.secIssue },
                                { name: '安全问题详情', path: ROUTER_PATH.secIssueDetail }],
                            routeType: 'issue',
                        },

                        beforeEnter(to, from, next) {
                            if (from.name === 'secIssueList') {
                                to.meta.bread = [
                                    { name: '问题处置', path: ROUTER_PATH.secIssue },
                                    { name: '安全问题详情', path: ROUTER_PATH.secIssueDetail },
                                ];
                                to.meta.routeType = 'issue';
                            } else if (from.name === 'appVectorDetail') {
                                to.meta.bread = [
                                    { name: '应用管理', path: ROUTER_PATH.appManage },
                                    { name: '应用详情', path: from.fullPath },
                                    { name: '安全问题详情', path: to.fullPath },
                                ];
                                to.meta.routeType = 'issue';
                            }
                            next();
                        },

                    },
                    {
                        path: ROUTER_PATH.riskTaskList,
                        name: 'riskTaskList',
                        component: () => import('@/view/risk-task/List.vue'),
                        meta: {
                            bread: [
                                { name: '安全问题', path: ROUTER_PATH.secIssue },
                                { name: '处置任务', path: ROUTER_PATH.riskTask },
                            ],
                            routeType: 'issue',
                        },
                    },
                    {
                        path: ROUTER_PATH.riskTaskDetail,
                        name: 'riskTaskDetail',
                        component: () => import('@/view/risk-task/Detail.vue'),
                        meta: {
                            bread: [
                                { name: '安全问题', path: ROUTER_PATH.secIssue },
                                { name: '处置任务', path: ROUTER_PATH.riskTask },
                                { name: '任务详情', path: ROUTER_PATH.riskTaskDetail },
                            ],
                            routeType: 'issue',
                        },
                    },
                ],
            },
            // 风险处置任务重定向路由 - 保持权限映射一致性
            {
                path: ROUTER_PATH.riskTask,
                redirect: ROUTER_PATH.riskTaskList,
            },
            {
                path: ROUTER_PATH.secAbility,
                name: 'secAbility',
                component: () => import('@/view/sec-ability/Index.vue'),
                meta: {
                    bread: [{ name: '安全能力', path: ROUTER_PATH.secAbility }],
                },
            },

            {
                path: ROUTER_PATH.secIntel,
                name: 'secIntel',
                component: () => import('@/view/sec-intel/Index.vue'),
                meta: {
                    bread: [{ name: '安全情报', path: ROUTER_PATH.secIntel }],
                },
            },

            {
                path: ROUTER_PATH.softwareComponent,
                name: 'softwareComponent',
                component: () => import('@/view/software-component/Index.vue'),
                redirect: ROUTER_PATH.softwareComponentList,
                children: [
                    {
                        path: ROUTER_PATH.softwareComponentList,
                        name: 'softwareComponentList',
                        component: () => import('@/view/software-component/list-tabs/SoftwareList.vue'),
                        meta: {
                            bread: [{ name: '软件成分', path: ROUTER_PATH.softwareComponentList }],
                            routeType: 'business',

                            // bread: [{ name: '供应链成分', path: ROUTER_PATH.supplyComponentList }],
                        },
                    },
                    {
                        path: ROUTER_PATH.softwareComponentDetail,
                        name: 'softwareComponentDetail',
                        component: () => import('@/view/software-component/Details/SoftwareDetail.vue'),
                        meta: {
                            bread: [{ name: '软件成分', path: ROUTER_PATH.softwareComponentList }, { name: '软件成分详情', path: ROUTER_PATH.softwareComponentDetail }],
                            routeType: 'business',

                            // bread: [{ name: '供应链成分', path: ROUTER_PATH.supplyComponentList }, { name: '供应链详情', path: ROUTER_PATH.supplyComponentDetail }],
                        },

                        beforeEnter(to, from, next) {
                            if (from.name === 'softwareComponentList') {
                                to.meta.bread = [{ name: '软件成分', path: ROUTER_PATH.softwareComponentList }, { name: '软件成分详情', path: ROUTER_PATH.softwareComponentDetail }];
                            } else if (from.name === 'appVectorDetail') {
                                to.meta.bread = [
                                    { name: '应用管理', path: ROUTER_PATH.appManage },
                                    { name: '应用详情', path: from.fullPath },
                                    { name: '软件成分详情', path: to.fullPath },
                                ];
                            }
                            next();
                        },

                    },
                ],
            },

            {
                path: ROUTER_PATH.vulnIntel,
                name: 'vulnIntel',
                component: () => import('@/view/vuln-intel/Index.vue'),
                redirect: ROUTER_PATH.vulnIntelList,
                children: [
                    {
                        path: ROUTER_PATH.vulnIntelList,
                        name: 'vulnIntelList',
                        component: () => import('@/view/vuln-intel/List.vue'),
                        meta: {
                            bread: [{ name: '漏洞情报', path: ROUTER_PATH.vulnIntelList }],
                        },
                    },
                    {
                        path: ROUTER_PATH.vulnIntelDetail,
                        name: 'vulnIntelDetail',
                        component: () => import('@/view/vuln-intel/Detail.vue'),
                        meta: {
                            bread: [{ name: '漏洞情报', path: ROUTER_PATH.vulnIntelList }, { name: '情报详情', path: ROUTER_PATH.vulnIntelDetail }],
                        },
                        props: true,
                    },
                ],
            },

            {
                path: ROUTER_PATH.appVector,
                name: 'appVector',
                component: () => import('@/view/app-vector/Index.vue'),
                redirect: ROUTER_PATH.appVectorList,
                children: [
                    {
                        path: ROUTER_PATH.appVectorList,
                        name: 'appVectorList',
                        component: () => import('@/view/app-vector/List.vue'),
                        meta: {
                            routeType: 'business',

                            bread: [{ name: '应用载体', path: ROUTER_PATH.appVectorList }],
                        },
                    },
                    {
                        path: ROUTER_PATH.appVectorDetail,
                        name: 'appVectorDetail',
                        component: () => import('@/view/app-vector/Detail.vue'),
                        meta: {
                            routeType: 'business',

                            bread: [{ name: '应用载体', path: ROUTER_PATH.appVectorList }, { name: '应用载体详情', path: ROUTER_PATH.appVectorDetail }],
                        },

                        beforeEnter(to, from, next) {
                            if (from.name === 'appVectorList') {
                                to.meta.bread = [{ name: '应用载体', path: ROUTER_PATH.appVectorList }, { name: '应用载体详情', path: ROUTER_PATH.appVectorDetail }];
                            } else if (from.name === 'appManageDetail') {
                                to.meta.bread = [{ name: '应用管理', path: ROUTER_PATH.appManage },
                                    { name: '应用详情', path: from.fullPath },
                                    { name: '应用载体详情', path: to.fullPath },
                                ];
                            }
                            next();
                        },
                    },
                ],
            },

            {
                path: ROUTER_PATH.org,
                name: 'org',
                component: () => import('@/view/new-org/Index.vue'),
                meta: {
                    bread: [{ name: '组织与成员', path: ROUTER_PATH.org }],
                    routeType: 'set',
                },
            },
            /* 数据集成 */
            // 任务管理
            {
                path: ROUTER_PATH.taskManage,
                name: 'taskManage',
                component: () => import('@/view/data/TaskManage/TaskManage.vue'),
                meta: {
                    bread: [{ name: '任务管理', path: ROUTER_PATH.taskManage }],
                    routeType: 'data',
                },
            },
            // 插件管理
            {
                path: ROUTER_PATH.pluginMarket,
                name: 'pluginMarket',
                component: () => import('@/view/data/PluginManage/PluginManage.vue'),
                meta: {
                    bread: [{ name: '插件管理', path: ROUTER_PATH.pluginMarket }],
                    routeType: 'data',
                },
            },
            // 插件创建
            {
                path: ROUTER_PATH.pluginCreate,
                name: 'pluginCreate',
                component: () => import('@/view/data/PluginManage/PluginForm.vue'),
                meta: {
                    bread: [
                        { name: '插件管理', path: ROUTER_PATH.pluginMarket },
                        { name: '创建插件', path: ROUTER_PATH.pluginCreate },
                    ],
                    routeType: 'data',
                },
            },
            // 插件编辑
            {
                path: ROUTER_PATH.pluginEdit,
                name: 'pluginEdit',
                component: () => import('@/view/data/PluginManage/PluginForm.vue'),
                meta: {
                    bread: [
                        { name: '插件管理', path: ROUTER_PATH.pluginMarket },
                        { name: '编辑插件', path: ROUTER_PATH.pluginEdit },
                    ],
                    routeType: 'data',
                },
            },
            // 插件查看
            {
                path: ROUTER_PATH.pluginView,
                name: 'pluginView',
                component: () => import('@/view/data/PluginManage/PluginForm.vue'),
                meta: {
                    bread: [
                        { name: '插件管理', path: ROUTER_PATH.pluginMarket },
                        { name: '插件详情', path: ROUTER_PATH.pluginView },
                    ],
                    routeType: 'data',
                    viewMode: true, // 标识为查看模式
                },
            },
            // 合同录入
            {
                path: ROUTER_PATH.contractInput,
                name: 'contractInput',
                component: () => import('@/view/data/Contract/ContractList.vue'),
                meta: {
                    bread: [{ name: '合同录入', path: ROUTER_PATH.contractInput }],
                    routeType: 'data',
                },
            },
            // 数据审核
            {
                path: ROUTER_PATH.dataReview,
                name: 'dataReview',
                component: () => import('@/view/data/DataReview/Index.vue'),
                meta: {
                    bread: [{ name: '数据预审', path: ROUTER_PATH.dataReview }],
                    routeType: 'data',
                },
            },

            {
                path: ROUTER_PATH.notifySetting,
                name: 'notifySetting',
                component: () => import('@/view/setting/Index.vue'),
                meta: {
                    bread: [{ name: '通知设置', path: ROUTER_PATH.notifySetting }],
                    routeType: 'set',
                },
            },
            {
                path: ROUTER_PATH.aiSetting,
                name: 'aiSetting',
                component: () => import('@/view/setting/AiSetting.vue'),
                meta: {
                    bread: [
                        // { name: '设置', path: ROUTER_PATH.setting },
                        { name: 'AI模型配置', path: ROUTER_PATH.aiSetting }],
                    routeType: 'set',
                },
            },

            // 访问令牌
            {
                path: ROUTER_PATH.AccessToken,
                name: 'AccessToken',
                component: () => import('@/view/personal-center/accessToken.vue'),
                meta: {
                    bread: [{ name: '访问令牌', path: ROUTER_PATH.AccessToken }],
                },
            },

            // 角色
            {
                path: ROUTER_PATH.roleSetting,
                name: 'roleSetting',
                component: () => import('@/view/setting/role/Index.vue'),
                meta: {
                    bread: [{ name: '角色管理', path: ROUTER_PATH.roleSetting }],
                },
            },

            // 账号设置
            {
                path: ROUTER_PATH.AccountSetting,
                name: 'AccountSetting',
                component: () => import('@/view/personal-center/accountSetting.vue'),
                meta: {
                    bread: [{ name: '账号设置', path: ROUTER_PATH.AccountSetting }],
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (!userInfo.value.token && to.fullPath !== '/login') {
        sessionStorage.setItem('redirect', to.fullPath);
        next('/login');
    }

    // if (userInfo.value.token) {
    //     getUserList();
    //     getOrgTree();
    // }
    next();
});

export default router;
