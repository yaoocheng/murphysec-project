import { ref } from 'vue';

export const compOptions = ref([
    // {
    //     value: 'comp_enable_fix',
    //     label: '组件是否可修复',
    // },
    {
        value: 'comp_dependent_types',
        label: '组件依赖类型',
    },
    {
        value: 'comp_list',
        label: '组件',
    },
]);

export const vulnOptions = ref([
    {
        value: 'vuln_is_triggers',
        label: '漏洞是否可触发',
    },
    {
        value: 'vuln_enable_fix',
        label: '漏洞是否可修复',
    },
    {
        value: 'vuln_has_poc',
        label: '漏洞是否存在POC',
    },
    {
        value: 'vuln_suggest_level',
        label: '漏洞处置等级',
    },
    {
        value: 'vuln_level',
        label: '漏洞等级',
    },
    {
        value: 'vuln_remote_attack',
        label: '漏洞是否可远程攻击',
    },
    {
        value: 'vuln_tag_list',
        label: '漏洞标签',
    },
    {
        value: 'vuln_no_list',
        label: '漏洞编号',
    },
]);

export const unhitOptions = [
    {
        value: 'StrongRecommend',
        label: '强烈建议修复',
    },
    {
        value: 'Recommend',
        label: '建议修复',
    },
    {
        value: 'Optional',
        label: '可选修复',
    },
    {
        value: 'Origin',
        label: '系统默认',
    },
];

export const hitTooManyOptions = [
    {
        value: 'highest',
        label: '最高处置等级',
    },
    {
        value: 'lowest',
        label: '最低处置等级',
    },
    {
        value: 'origin',
        label: '系统默认',
    },
];

export const suggestConf:any = {
    // comp_enable_fix: {
    //     label: '组件是否可修复',
    //     express: '等于',
    //     type: 1,
    //     option: [
    //         {
    //             value: 'enable',
    //             label: '是',
    //         },
    //         {
    //             value: 'disable',
    //             label: '否',
    //         },
    //     ],
    // },
    comp_dependent_types: {
        label: '组件依赖类型',
        express: '在内部',
        type: 2,
        option: [
            {
                value: 'self',
                label: '自身依赖',
            },
            {
                value: 'direct',
                label: '直接依赖',
            },
            {
                value: 'indirect',
                label: '间接依赖',
            },
        ],
    },
    comp_list: {
        label: '组件',
        express: '在内部',
        type: 3,
    },
    vuln_is_triggers: {
        label: '漏洞是否可触发',
        express: '等于',
        type: 1,
        option: [
            {
                value: 'enable',
                label: '是',
            },
            {
                value: 'disable',
                label: '否',
            },
        ],
    },

    vuln_enable_fix: {
        label: '漏洞是否可修复',
        express: '等于',
        type: 1,
        option: [
            {
                value: 'enable',
                label: '是',
            },
            {
                value: 'disable',
                label: '否',
            },
        ],
    },
    vuln_has_poc: {
        label: '漏洞是否存在POC',
        express: '等于',
        type: 1,
        option: [
            {
                value: 'enable',
                label: '存在',
            },
            {
                value: 'disable',
                label: '不存在',
            },
        ],
    },
    vuln_suggest_level: {
        label: '漏洞处置等级',
        express: '在内部',
        type: 2,
        option: [
            {
                value: 'StrongRecommend',
                label: '强烈建议修复',
            },
            {
                value: 'Recommend',
                label: '建议修复',
            },
            {
                value: 'Optional',
                label: '可选修复',
            },
        ],
    },
    vuln_level: {
        label: '漏洞等级',
        express: '在内部',
        type: 2,
        option: [
            {
                value: 'Critical',
                label: '严重',
            },
            {
                value: 'High',
                label: '高危',
            },
            {
                value: 'Medium',
                label: '中危',
            },
            {
                value: 'Low',
                label: '低危',
            },
        ],
    },
    vuln_remote_attack: {
        label: '漏洞是否可远程攻击',
        express: '等于',
        type: 1,
        option: [
            {
                value: 'enable',
                label: '是',
            },
            {
                value: 'disable',
                label: '否',
            },
        ],
    },
    vuln_tag_list: {
        label: '漏洞标签',
        express: '在内部',
        type: 2,
        option: [
            {
                value: 'CAVD',
                label: 'CAVD',
            },
            {
                value: 'poisoning',
                label: '投毒',
            },
        ],
    },
    vuln_no_list: {
        label: '漏洞编号',
        express: '在内部',
        type: 3,
    },
};
