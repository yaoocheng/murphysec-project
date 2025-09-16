import { ref } from 'vue';

export const dataLeakageCWEs = [
    // 命令注入
    'CWE-77', // Command Injection
    'CWE-78', // OS Command Injection

    // 代码注入
    'CWE-94', // Code Injection
    'CWE-95', // Eval Injection
    'CWE-470', // Use of Externally-Controlled Input to Select Classes or Code
    'CWE-917', // Improper Neutralization of Special Elements used in an Expression Language Statement

    // SQL注入
    'CWE-89', // SQL Injection

    // 反序列化
    'CWE-502', // Deserialization of Untrusted Data

    // SSRF
    'CWE-918', // Server-Side Request Forgery

    // 任意文件读取
    'CWE-548', // Exposure of Information Through Directory Listing

    // 未授权访问
    'CWE-284', // Improper Access Control
    'CWE-285', // Improper Authorization
    'CWE-287', // Improper Authentication
    'CWE-306', // Missing Authentication for Critical Function
    'CWE-497', // Exposure of Sensitive System Information to an Unauthorized Control Sphere
    'CWE-250', // Execution with Unnecessary Privileges
    'CWE-552', // Files or Directories Accessible to External Parties

    // 信息泄漏
    'CWE-200', // Exposure of Sensitive Information to an Unauthorized Actor

    // 输入验证不严
    'CWE-20', // Improper Input Validation

    // 文件上传
    'CWE-434', // Unrestricted Upload of File with Dangerous Type
];

// 定义攻击向量映射关系
export const attackVectorMap = {
    远程利用: 100,
    局域网利用: 75,
    本地利用: 50,
    物理接触利用: 25,
};

// 定义漏洞等级映射关系
export const hazardLevelMap = {
    严重: 100,
    高危: 75,
    中危: 50,
    低危: 25,
};

// 定义利用成本映射关系（反向：成本越低分值越高）
export const exploitCostMap = {
    高: 33,
    中: 66,
    低: 100,
};

export const repairList = [
    {
        title: {
            text: '强烈建议修复',
            textColor: 'text-white',
            bgColor: 'bg-[#BF1C0D]',
        },
        content: {
            text: '需同时满足漏洞评级（高危以上）、利用成熟度（存在 POC)、是否可导致数据泄露（是）、利用成本不为（高）或 (中)、攻击向量为（远程利用）的条件',
            textColor: 'text-[#D32F2F]',
            bgColor: 'bg-[#FFF1F0]',
            textSize: 'text-xs',
        },
    },
    {
        title: {
            text: '建议修复',
            textColor: 'text-white',
            bgColor: 'bg-[#D48806]',
        },
        content: {
            text: '满足利用成熟度（存在 POC）的某条情况、漏洞评级（高危及以上）两个中任意一个条件',
            textColor: 'text-[#D48806]',
            bgColor: 'bg-[#FFEFD7]',
            textSize: 'text-xs',
        },
    },
    {
        title: {
            text: '可选修复',
            textColor: 'text-white',
            bgColor: 'bg-[#666666]',
        },
        content: {
            text: '除（强烈建议修复）和（建议修复）条件以外的其他条件',
            textColor: 'text-[#666666]',
            bgColor: 'bg-[#F0F2F5]',
            textSize: 'text-xs',
        },
    },
];

export const Metrics = ref([
    [
        {
            code: 'AV',
            title: '攻击向量',
            options: [
                { value: 'N', label: '远程利用', active: false },
                { value: 'A', label: '局域网利用', active: false },
                { value: 'L', label: '本地利用', active: false },
                { value: 'P', label: '物理接触利用', active: false },
            ],
        },
        {
            code: 'AC',
            title: '漏洞利用难度',
            options: [
                { value: 'L', label: '低', active: false },
                { value: 'H', label: '高', active: false },
            ],
        },
        {
            code: 'PR',
            title: '漏洞利用所需权限',
            options: [
                { value: 'N', label: '无需任何权限', active: false },
                { value: 'L', label: '低权限', active: false },
                { value: 'H', label: '高权限', active: false },
            ],
        },
        {
            code: 'UI',
            title: '用户交互要求',
            options: [
                { value: 'N', label: '无', active: false },
                { value: 'R', label: '需要受害者配合交互', active: false },
            ],
        },
    ],
    [
        {
            code: 'S',
            title: '对其他受牵连系统或组件影响程度',
            options: [
                { value: 'C', label: '改变', active: false },
                { value: 'U', label: '未改变', active: false },
            ],
        },
        {
            code: 'C',
            title: '对攻击目标影响-机密性',
            options: [
                { value: 'H', label: '高', active: false },
                { value: 'L', label: '低', active: false },
                { value: 'N', label: '无影响', active: false },
            ],
        },
        {
            code: 'I',
            title: '对被攻击系统影响-完整性',
            options: [
                { value: 'H', label: '高', active: false },
                { value: 'L', label: '低', active: false },
                { value: 'N', label: '无影响', active: false },
            ],
        },
        {
            code: 'A',
            title: '对被攻击系统影响-可用性',
            options: [
                { value: 'H', label: '高', active: false },
                { value: 'L', label: '低', active: false },
                { value: 'N', label: '无影响', active: false },
            ],
        },
    ],
]);

export const intelligence_level = [
    {
        label: '全部',
        value: null,
    },
    {
        label: '严重',
        value: '严重',
    },
    {
        label: '高危',
        value: '高危',
    },
    {
        label: '中危',
        value: '中危',
    },
    {
        label: '低危',
        value: '低危',
    },
];

export const intelligence_type = [
    {
        label: '全部',
        value: null,
    },
    {
        label: '独家漏洞',
        value: '独家漏洞',
    },
    {
        label: '投毒情报',
        value: '投毒情报',
    },
    {
        label: '公开漏洞',
        value: '公开漏洞',
    },
];

export const intelligence_status = [
    {
        label: '全部',
        value: null,
    },
    {
        label: '影响确认中',
        value: 1,
    },
    {
        label: '影响已确认',
        value: 2,
    },
    {
        label: '初步分析完成',
        value: 3,
    },
    {
        label: '排查方案已提供',
        value: 4,
    },
    {
        label: '临时环节方案已提供',
        value: 5,
    },
    {
        label: '完整分析',
        value: 6,
    },
];

// 筛选条件配置
export const filterConfig = [
    {
        label: '漏洞评级',
        value: 'severity',
        type: 'select',
        options: intelligence_level,
        placeholder: '请选择漏洞评级',
        disabled: true,
    },
    {
        label: '处置优先级',
        value: 'disposal_priority',
        type: 'select',
        options: [
            { label: '全部', value: null },
            { label: '强烈建议修复', value: '强烈建议修复' },
            { label: '建议修复', value: '建议修复' },
            { label: '可取修复', value: '可取修复' },
        ],
        placeholder: '请选择处置优先级',
        disabled: true,
    },
    {
        label: '漏洞分类',
        value: 'type',
        type: 'select',
        options: [
            { label: '全部', value: null },
            { label: '公开漏洞', value: '公开漏洞' },
            { label: '独家漏洞', value: '独家漏洞' },
            { label: '投毒情报', value: '投毒情报' },
        ],
        placeholder: '请选择漏洞分类',
        disabled: true,
    },
    {
        label: '漏洞状态',
        value: 'analysis_status',
        type: 'select',
        options: intelligence_status,
        placeholder: '请选择漏洞状态',
        disabled: true,

    },
    {
        label: '是否有POC',
        value: 'is_poc',
        type: 'select',
        options: [
            { label: '全部', value: null },
            { label: '是', value: true },
            { label: '否', value: false },
        ],
        placeholder: '请选择是否有POC',
        disabled: true,

    },
    {
        label: '利用成本',
        value: 'utilized_cost',
        type: 'select',
        options: [
            { label: '全部', value: null },
            { label: '极高', value: '极高' },
            { label: '高', value: '高' },
            { label: '中', value: '中' },
            { label: '低', value: '低' },
        ],
        placeholder: '请选择利用成本',
        disabled: false,

    },
    {
        label: '攻击向量',
        value: 'attack_vector',
        type: 'select',
        options: [
            { label: '全部', value: null },
            { label: '远程利用', value: '远程利用' },
            { label: '局域网利用', value: '局域网利用' },
            { label: '本地利用', value: '本地利用' },
            { label: '物理接触利用', value: '物理接触利用' },
        ],
        placeholder: '请选择攻击向量',
        disabled: false,

    },
    {
        label: '发布时间',
        value: 'release_time',
        type: 'time',
        placeholder: '请选择发布时间',
        disabled: false,

    },
    {
        label: '更新时间',
        value: 'update_time',
        type: 'time',
        placeholder: '请选择更新时间',
        disabled: false,

    },

    // {
    //     label: '是否有EXP',
    //     value: 'has_exp',
    //     type: 'select',
    //     options: [
    //         { label: '是', value: true },
    //         { label: '否', value: false },
    //     ],
    //     placeholder: '请选择是否有EXP',
    //     disabled: false,

    // },
];
