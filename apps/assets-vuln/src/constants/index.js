export const THEME = {
    token: {
        colorPrimary: '#6C87FF',
        colorError: '#F34D3D',
        colorSuccess: '#38C728',
        colorTextBase: '#3C3C3C',
        colorBgSpotlight: '#3C3C3C',
        colorText: '#3C3C3C',
        colorWarning: '#FF9940',
        borderRadius: 4,
        colorBorder: '#E6E6E6',
    },
    components: {
        Tabs: {
            fontSize: 16,
        },
    },
};

export const ROUTER_PATH = {
    panel: '/panel',
    dashboard: '/dashboard',

    businessManage: '/business-manage',
    businessManageList: '/business-manage/list',
    businessManageDetail: '/business-manage/detail/:id',

    appManage: '/app-manage',
    appManageDetail: '/app-manage/detail/:id',

    appVector: '/app-vector',
    appVectorList: '/app-vector/list',
    appVectorDetail: '/app-vector/detail/:id',

    org: '/org',
    data: '/data',
    taskManage: '/task-manage',
    secAbility: '/sec-ability',
    pluginMarket: '/plugin-market',
    pluginCreate: '/plugin-market/create',
    pluginEdit: '/plugin-market/edit/:id',
    pluginView: '/plugin-market/view/:id',
    contractInput: '/contract-input',
    dataReview: '/data-review',

    secIssue: '/sec-issue',
    secIssueList: '/sec-issue/list',
    secIssueDetail: '/sec-issue/detail/:id',

    riskTask: '/risk-task',
    riskTaskList: '/risk-task/list',
    riskTaskDetail: '/risk-task/detail/:id',

    secIntel: '/sec-intel',

    softwareComponent: '/software-component',
    softwareComponentList: '/software-component/list',
    softwareComponentDetail: '/software-component/detail/:id',

    vulnIntel: '/vuln-intel',
    vulnIntelList: '/vuln-intel/list',
    vulnIntelDetail: '/vuln-intel/detail/:id',

    issueDetail: '/app/issue/detail/:id',

    notifySetting: '/notify-setting',
    aiSetting: '/ai-setting',

    inviteCollaboration: '/invite-collaboration/:id',

    AccessToken: '/access-token',
    AccountSetting: '/account-setting',
    roleSetting: '/role-setting',
};

export const TAB_BAR_STYLE = {
    padding: '0 24px',
    height: '48px',
    background: '#fff',
    marginBottom: '0',
};
