/**
 * @file formConfig.js
 * @description 动态表单落地页组件的配置文件 v2.0
 * 定义了整个页面的结构、内容和行为，包含侧边栏、表单区域、字段显隐、默认值、校验等。
 */

// 落地页的主配置对象
export const pageConfig = {
    /**
   * 侧边栏配置（左侧固定区域）
   * 控制固定在页面左侧的上下文信息区域显示的内容。
   */
    sidebar: {
    // 侧边栏配置保持不变
        // eslint-disable-next-line no-template-curly-in-string
        titleTemplate: '软件信息收集：${softwareName}',

        description: '欢迎使用商业采购软件登记系统。本表单用于收集贵公司采购的商业软件详细信息，以便我们进行资产管理和安全评估。 带*的字段为必填项，请确保信息准确完整。',

        contactInfo: {
            // 联系人信息配置保持不变
            enabled: true,
            title: '',
            items: [
                {
                    type: 'user',
                    // eslint-disable-next-line no-template-curly-in-string
                    value: '${contactPersonName}（信息安全部）',
                    label: '接口人',
                    icon: 'UserOutlined',
                },
                {
                    type: 'phone',
                    // eslint-disable-next-line no-template-curly-in-string
                    value: '${contactPhone}',
                    label: '电话',
                    icon: 'PhoneOutlined',
                },
                {
                    type: 'email',
                    value: 'it.support@example.com',
                    label: '邮箱',
                    icon: 'MailOutlined',
                },
            ],
        },
    },

    /**
   * 表单配置（右侧主要区域）
   * 定义了主表单区域的结构和字段。
   */
    form: {
        sections: [
            // --- 第一章节：软件基本信息 ---
            {
                title: '1. 软件基本信息',
                description: '请提供软件的基本识别信息和描述',
                fields: [
                    {
                        name: 'component_name',
                        label: '软件名称',
                        type: 'input',
                        required: true,
                        visible: true,
                        readonly: false,
                        defaultValue: '',
                        placeholder: '示例：Oracle ERP Cloud、SAP Business One、用友U8+财务管理系统',
                        helpText: '请填写软件的官方完整名称，与采购合同或产品说明书上的名称一致',
                        maxLength: 100,
                    },
                    {
                        name: 'component_version',
                        label: '版本',
                        type: 'input',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: '',
                        placeholder: '示例：v3.5.2、2023.1.15、10.2.0.5、R12.2.10',
                        helpText: '请填写当前使用的软件版本号，可在软件关于页面中查看',
                        maxLength: 30,
                    },
                    {
                        name: 'supplier_name',
                        label: '供应商名称',
                        type: 'input',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: '',
                        placeholder: '示例：北京智慧云科技有限公司、上海XX软件股份有限公司',
                        helpText: '请填写软件供应商的完整公司名称，可在采购合同中，或者收款方信息中获取',
                        maxLength: 100,
                    },
                    {
                        name: 'component_desc',
                        label: '描述',
                        type: 'textarea',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: '',
                        placeholder: '示例：该系统用于公司财务数据，包括账务处理、报表生成、预算管理等功能，主要供财务部门使用',
                        helpText: '简要描述该软件的主要功能、用途和在公司的应用场景',
                        rows: 3,
                        maxLength: 200,
                    },
                ],
            },

            {
                title: '2. 采购与供应商信息',
                description: '关于此软件的采购来源和供应商详情',
                fields: [
                    {
                        name: 'supplier_country',
                        label: '供应商所在国家',
                        type: 'select',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: undefined,
                        placeholder: '请选择供应商所在国家',
                        helpText: '请选择该软件供应商所在国家',
                        options: [
                            {
                                value: 'CN',
                                label: '中国（CN）',
                            },
                            {
                                value: 'US',
                                label: '美国（US）',
                            },
                            {
                                value: 'GB',
                                label: '英国（GB）',
                            },
                            {
                                value: 'SG',
                                label: '新加坡（SG）',
                            },
                            {
                                value: 'DE',
                                label: '德国（DE）',
                            },
                            {
                                value: 'FR',
                                label: '法国（FR）',
                            },
                            {
                                value: 'JP',
                                label: '日本（JP）',
                            },
                            {
                                value: 'IN',
                                label: '印度（IN）',
                            },
                            {
                                value: 'IT',
                                label: '意大利（IT）',
                            },
                            {
                                value: 'CA',
                                label: '加拿大（CA）',
                            },
                            {
                                value: 'KR',
                                label: '韩国（KR）',
                            },
                            {
                                value: 'RU',
                                label: '俄罗斯（RU）',
                            },
                            {
                                value: 'AU',
                                label: '澳大利亚（AU）',
                            },
                            {
                                value: 'ES',
                                label: '西班牙（ES）',
                            },
                            {
                                value: 'NZ',
                                label: '新西兰（NZ）',
                            },
                        ],
                    },
                    {
                        name: 'supplier_identifier',
                        label: '供应商唯一标识',
                        type: 'input',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: '',
                        placeholder: '示例：91110108MA00B7N129(中国)、EIN：12-3456789(美国)',
                        helpText: '对于中国供应商，请填写统一社会信用代码；对于供应商是海外企业，请填写其注册号',
                        maxLength: 50,
                    },
                    {
                        name: 'contract_reference_id',
                        label: '合同编号',
                        type: 'input',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: '',
                        placeholder: '请输入合同编号',
                        helpText: '采购合同编号，统一编号',
                        maxLength: 50,
                    },
                    {
                        name: 'owner_team',
                        label: '负责部门',
                        type: 'select',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: undefined,
                        placeholder: '请搜索选择负责部门',
                        helpText: '请选择负责公司内负责该软件的主管部门，请选择最直接负责部门',
                        showSearch: true,
                        options: [],
                    },
                    {
                        name: 'owner',
                        label: '负责人',
                        type: 'select',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: undefined,
                        placeholder: '请搜索选择负责人',
                        helpText: '请选择负责公司内负责该软件的主管部门，请选择最直接负责部门',
                        showSearch: true,
                        options: [],
                    },
                ],
            },

            {
                title: '3. 运维信息',
                description: '关于软件日常运行维护和技术支持的信息',
                fields: [
                    {
                        name: 'operations_owner_team',
                        label: '运维负责部门',
                        type: 'select',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: undefined,
                        placeholder: '请搜索选择运维负责部门',
                        helpText: '请选择负责该软件日常运行维护和技术支持的部门',
                        showSearch: true,
                        options: [],
                    },
                    {
                        name: 'operations_owner',
                        label: '运维主要联系人',
                        type: 'select',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: undefined,
                        placeholder: '请搜索选择运维主要联系人',
                        helpText: '请选择负责该软件日常运维的主要联系人',
                        showSearch: true,
                        options: [],
                    },
                ],
            },

            {
                title: '4. 部署环境信息',
                description: '关于软件的部署架构和安装位置信息',
                fields: [
                    {
                        name: 'deployment_model',
                        label: '部署模式',
                        type: 'select',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: undefined,
                        placeholder: '请选择部署模式',
                        helpText: '选择软件的基础设施部署架构',
                        options: [
                            {
                                value: 'on_premise_server',
                                label: '本地服务器部署',
                            },
                            {
                                value: 'on_premise_desktop',
                                label: '本地桌面安装',
                            },
                            {
                                value: 'saas',
                                label: '软件即服务',
                            },
                            {
                                value: 'private_cloud',
                                label: '私有云部署',
                            },
                            {
                                value: 'public_cloud_iaas_paas',
                                label: '公有云IaaS/PaaS部署',
                            },
                            {
                                value: 'hybrid',
                                label: '混合部署',
                            },
                        ],
                    },
                    {
                        name: 'installation_path',
                        label: '安装路径',
                        type: 'input',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: '',
                        placeholder: 'Windows示例：D:\\Applications\\FinanceSystem Linux示例:/opt/apps/finance',
                        helpText: '记录软件在服务器/终端的物理安装位置',
                        maxLength: 200,
                    },
                    {
                        name: 'deployed_ip_addresses',
                        label: '服务部署主机IP列表',
                        type: 'textarea',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: '',
                        placeholder: '请输入IP地址，多个IP请用逗号分隔',
                        helpText: '记录所有运行该软件实例的服务器IP地址，多个地址请用逗号分隔（如：192.168.1.100,172.16.0.15）',
                        rows: 2,
                        maxLength: 500,
                    },
                ],
            },

            {
                title: '5. 网络与数据安全',
                description: '关于软件的网络访问范围和数据安全级别信息',
                fields: [
                    {
                        name: 'network_exposure',
                        label: '网络暴露面',
                        type: 'select',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: undefined,
                        placeholder: '请选择网络暴露面',
                        helpText: '请选择该软件的网络访问范围',
                        options: [
                            {
                                value: 'public',
                                label: '公网访问',
                            },
                            {
                                value: 'internal',
                                label: '内网访问',
                            },
                        ],
                    },
                    {
                        name: 'access_url',
                        label: '服务访问地址',
                        type: 'input',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: '',
                        placeholder: '示例：http://192.168.1.100:8080',
                        helpText: '请填写用户访问该软件的URL地址，包含协议(http/https)、域名/IP和端口',
                        maxLength: 200,
                    },
                    {
                        name: 'data_sensitivity_level',
                        label: '数据敏感级别',
                        type: 'select',
                        required: false,
                        visible: true,
                        readonly: false,
                        defaultValue: undefined,
                        placeholder: '请选择数据敏感级别',
                        helpText: '请选择该软件处理的最高敏感级别数据，如处理多种级别请选择最高级别',
                        options: [
                            {
                                value: 'public',
                                label: '公开',
                            },
                            {
                                value: 'internal',
                                label: '内部',
                            },
                            {
                                value: 'confidential',
                                label: '机密',
                            },
                            {
                                value: 'restricted',
                                label: '受限',
                            },
                            {
                                value: 'pii',
                                label: '个人身份信息',
                            },
                        ],
                    },
                ],
            },

            {
                title: '6. 所属应用信息',
                description: '软件成分所归属的应用',
                fields: [
                    // {
                    //     name: 'carrier_id',
                    //     label: '所属载体',
                    //     type: 'select',
                    //     required: true,
                    //     visible: true,
                    //     readonly: false,
                    //     defaultValue: [],
                    //     placeholder: '请选择所属载体',
                    //     helpText: '请选择该软件所属的载体',
                    //     multiple: true,
                    //     showSearch: true,
                    //     options: [
                    //         { value: 'web_app', label: 'Web应用' },
                    //         { value: 'mobile_app', label: '移动应用' },
                    //         { value: 'desktop_app', label: '桌面应用' },
                    //         { value: 'server_app', label: '服务器应用' },
                    //         { value: 'other', label: '其他' },
                    //     ],
                    // },
                    {
                        name: 'application_id',
                        label: '所属应用',
                        type: 'select',
                        required: true,
                        visible: true,
                        readonly: false,
                        defaultValue: [],
                        placeholder: '请选择所属应用',
                        helpText: '请选择该软件所属的应用系统',
                        multiple: true,
                        showSearch: true,
                        options: [
                            // { value: 'erp_system', label: 'ERP系统' },
                            // { value: 'crm_system', label: 'CRM系统' },
                            // { value: 'hr_system', label: '人力资源系统' },
                            // { value: 'finance_system', label: '财务管理系统' },
                            // { value: 'oa_system', label: 'OA办公系统' },
                            // { value: 'security_system', label: '安全管理系统' },
                            // { value: 'other', label: '其他' },
                        ],
                    },
                ],
            },
        ],
    },

    /**
   * 提交按钮配置
   */
    submitButton: {
        text: '提交',
        loadingText: '提交中...',
    },

    /**
   * 页脚注释配置
   */
    footerNote: '提交的信息将用于软件资产管理，请确保信息准确性。',
};

// 示例上下文数据对象保持不变
export const contextExample = {
    softwareName: 'SAP ERP',
    contractNumber: 'CT-2023-0123',
    contactEmail: 'security@example.com',
    contactPhone: '400-800-8888',
    contactPersonName: '李四',

    prefilledData: {
        component_name: 'SAP ERP',
        asset_category: 'software',
        component_version: 'v12.2.0',
        status: 'active',
        component_closed_source_software: 'yes',
    },
};
