import { reactive, ref } from 'vue';
import store from 'util/store';

export const highList = ref([]);
export const midList = ref([]);
export const lowList = ref([]);
export const safeList = ref([]);

export const createAddLicenseData = () => (
    {
        id: '0',
        team_id: store.teamInfo.team_id,
        name: '', // 策略名称
        desc: '', // 策略描述
        is_open: 1, // 是否开启：1-是，2-否
        is_global: 1, // 应用范围是否全局，1-是，2-否
        tags: [],
        licenses: [],
        type: 1,
    }
);

export default reactive(createAddLicenseData());

export const licenseSourceOp = [
    {
        label: '系统内置',
        value: 'builtin',
    },
    {
        label: '自定义',
        value: 'customize',
    },
];

export const compUse:any = {
    source_code: '源代码',
    static_linked: '静态链接',
    dynamic_linked: '动态链接',
    separate_work: '单独工作',
    merely_aggregated: '仅汇总',
    implementation_of_standard: '实施标准',
    prerequisite: '先决条件',
    dev_tool_or_excluded: '开发工具/已排除',
    unspecified: '未指定',
};

export const compUseOption = [
    {
        label: '高风险',
        value: 4,
        color: 'rgb(243, 77, 61)',
    },
    {
        label: '中风险',
        value: 3,
        color: 'rgb(255, 153, 64)',
    },
    {
        label: '低风险',
        value: 2,
        color: 'rgb(255, 204, 51)',
    },
    {
        label: '无风险',
        value: 1,
        color: '#3c3c3c',
    },
];

export const createFormData = () => ({
    license_family_name: '', // 许可证家族名称
    license_desc: '', // 许可证描述
    license_rule: [
        { // 组件用法：源代码
            type: 'source_code',
            name: '源代码',
            external: 1, // 外部：无风险
            internal: 1, // 内部：无风险
            saas: 1, // SaaS：无风险
            open_source: 1, // 开源：无风险
        },
        { // 组件用法：静态链接
            type: 'static_linked',
            name: '静态链接',
            external: 1, // 外部：无风险
            internal: 1, // 内部：无风险
            saas: 1, // SaaS：无风险
            open_source: 1, // 开源：无风险
        },
        { // 组件用法：动态链接
            type: 'dynamic_linked',
            name: '动态链接',
            external: 1, // 外部：无风险
            internal: 1, // 内部：无风险
            saas: 1, // SaaS：无风险
            open_source: 1, // 开源：无风险
        },
        { // 组件用法：单独工作
            type: 'separate_work',
            name: '单独工作',
            external: 1, // 外部：无风险
            internal: 1, // 内部：无风险
            saas: 1, // SaaS：无风险
            open_source: 1, // 开源：无风险
        },
        { // 组件用法：仅汇总
            type: 'merely_aggregated',
            name: '仅汇总',
            external: 1, // 外部：无风险
            internal: 1, // 内部：无风险
            saas: 1, // SaaS：无风险
            open_source: 1, // 开源：无风险
        },
        { // 组件用法：实施标准
            type: 'implementation_of_standard',
            name: '实施标准',
            external: 1, // 外部：无风险
            internal: 1, // 内部：无风险
            saas: 1, // SaaS：无风险
            open_source: 1, // 开源：无风险
        },
        { // 组件用法：先决条件
            type: 'prerequisite',
            name: '先决条件',
            external: 1, // 外部：无风险
            internal: 1, // 内部：无风险
            saas: 1, // SaaS：无风险
            open_source: 1, // 开源：无风险
        },
        { // 组件用法：开发工具/已排除
            type: 'dev_tool_or_excluded',
            name: '开发工具/已排除',
            external: 1, // 外部：无风险
            internal: 1, // 内部：无风险
            saas: 1, // SaaS：无风险
            open_source: 1, // 开源：无风险
        },
        { // 组件用法：未指定
            type: 'unspecified',
            name: '未指定',
            external: 1, // 外部：无风险
            internal: 1, // 内部：无风险
            saas: 1, // SaaS：无风险
            open_source: 1, // 开源：无风险
        },
    ],
    team_id: store.teamInfo.team_id, // 团队ID
});
