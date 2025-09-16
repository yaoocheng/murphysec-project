// 合同识别状态
import { getOrgTreeSelectDataApi } from 'api/org';
import { ref } from 'vue';
import { globalState } from '@/store';

export const COMPONENT_CONTRACT_OCR_STATUS = [
    {
        label: '队列中',
        value: 'pending',
    },
    {
        label: '进行中',
        value: 'running',
    },
    {
        label: '已完成',
        value: 'completed',
    },
    {
        label: '已失败',
        value: 'failed',
    },
];

export const findComponentContractOcrStatusLabel = (value) => COMPONENT_CONTRACT_OCR_STATUS.find((item) => item.value === value)?.label || '-';

export const ORG_TREE = ref();

export const getOrgTree = async () => {
    const { data } = await getOrgTreeSelectDataApi();
    ORG_TREE.value = data.data.data_list;
};

getOrgTree();

export const USER_LIST = ref(globalState);

// 软件成分分类--done
export const SOFTWARE_COMPONENT_CATEGORY = [
    {
        value: 'physical_server',
        label: '物理服务器',
    },
    {
        value: 'virtual_machine',
        label: '虚拟机',
    },
    {
        value: 'network_device',
        label: '网络设备',
    },
    {
        value: 'operating_system',
        label: '操作系统',
    },
    {
        value: 'container_runtime',
        label: '容器运行时',
    },
    {
        value: 'programming_language_runtime',
        label: '编程语言运行时',
    },
    {
        value: 'application_server',
        label: '应用服务器',
    },
    {
        value: 'object_storage',
        label: '对象存储',
    },
    {
        value: 'data_processing_platform',
        label: '数据计算',
    },
    {
        value: 'database',
        label: '数据库',
    },
    {
        value: 'data_distribution',
        label: '数据分发',
    },
    {
        value: 'data_warehouse',
        label: '数据仓库',
    },
    {
        value: 'cache',
        label: '缓存',
    },
    {
        value: 'external_api',
        label: '外部 API',
    },
    {
        value: 'saas_service',
        label: 'SaaS 服务',
    },
    {
        value: 'external_data_source',
        label: '外部数据源',
    },
    {
        value: 'in_house_developed_code',
        label: '自研代码',
    },
    {
        value: 'in_house_developed_component',
        label: '自研组件',
    },
    {
        value: 'open_source_component',
        label: '开源组件',
    },
    {
        value: 'closed_source_component',
        label: '闭源组件',
    },
    {
        value: 'sdk',
        label: 'SDK',
    },
    {
        value: 'open_source_application',
        label: '开源应用软件',
    },
    {
        value: 'closed_source_application',
        label: '闭源应用软件',
    },
    {
        value: 'machine_learning_model',
        label: '模型',
    },
    {
        value: 'ide',
        label: '集成开发环境',
    },
    {
        value: 'version_control_system',
        label: '代码与版本控制系统',
    },
    {
        value: 'ci_cd_system',
        label: 'CI/CD 与自动化系统',
    },
    {
        value: 'build_dependency_tool',
        label: '构建与依赖管理工具',
    },
    {
        value: 'artifact_repository',
        label: '制品仓库',
    },
];

// 软件成分状态--done
export const SOFTWARE_COMPONENT_STATUS = [
    {
        value: 'active',
        label: '活跃',
    },
    {
        value: 'approved',
        label: '已批准',
    },
    {
        value: 'deprecated',
        label: '已弃用',
    },
    {
        value: 'eol',
        label: '终止支持',
    },
];

// 软件成分采购类型--done
export const SOFTWARE_COMPONENT_PURCHASE_TYPE = [
    {
        value: 'commercial',
        label: '商业采购',
    },
    {
        value: 'free',
        label: '免费闭源',
    },
];

// 软件成分所在国家--todo
export const SOFTWARE_COMPONENT_COUNTRY = [
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
];

export const findSoftwareComponentCountryLabel = (value) => SOFTWARE_COMPONENT_COUNTRY.find((item) => item.value === value)?.label || '-';

// 负责部门及负责人通过接口获取

// 软件成分部署模式 --done
export const SOFTWARE_COMPONENT_DEPLOY_MODE = [
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
];

// 软件成分网络暴露面--done
export const SOFTWARE_COMPONENT_NETWORK_EXPOSURE = [
    {
        value: 'public',
        label: '公网访问',
    },
    {
        value: 'internal',
        label: '内网访问',
    },
];

// 软件成分数据敏感级别--done
export const SOFTWARE_COMPONENT_DATA_SENSITIVITY = [
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
];

/**
 * 软件成分详情列表字段
 */
export const SOFTWARE_COMPONENT_DETAIL_LIST = [
    {
        value: 'basic_info',
        label: '基本信息',
        type: 'form',
        key: ' ',
        children: [
            {
                value: 'category',
                key: 'asset_type',
                label: '分类',
            },
            {
                value: 'status',
                key: 'status',
                label: '状态',
            },
            {
                value: 'supplier',
                key: 'supplier_name',
                label: '供应商',
            },
            {
                value: 'create_time',
                key: 'created_at',
                type: 'time',
                label: '创建时间',
            },
            {
                value: 'update_time',
                key: 'updated_at',
                type: 'time',
                label: '更新时间',
            },
            {
                value: 'vulnerability_description',
                label: '漏洞描述',
                key: 'component_desc',
            },
        ],
    },
    {
        value: 'purchase_info',
        label: '采购与供应商信息123',
        type: 'form',
        key: 'component_closed_source_software',
        children: [
            {
                value: 'purchase_type',
                label: '采购类型',
                key: 'procurement_type',
            },
            {
                value: 'supplier_country',
                label: '供应商所在国家',
                key: 'supplier_country',
            },
            {
                value: 'supplier_id',
                label: '供应商唯一标识',
                key: 'supplier_identifier',
            },
            {
                value: 'contract_no',
                label: '合同编号',
                key: 'contract_reference_id',
            },
            {
                value: 'department',
                label: '负责部门',
                key: 'owner_team',
            },
            {
                value: 'manager',
                type: 'avatar',
                label: '负责人',
                key: 'owner',
            },
        ],
    },
    {
        value: 'operation_info',
        label: '运维信息',
        type: 'form',
        key: 'component_closed_source_software',
        children: [
            {
                value: 'ops_department',
                label: '运维负责部门',
                key: 'operations_owner_team',
            },
            {
                value: 'ops_contact',
                type: 'avatar',
                label: '运维主要联系人',
                key: 'operations_owner',
            },
        ],
    },
    {
        value: 'deploy_info',
        label: '部署环境信息',
        type: 'form',
        key: 'component_closed_source_software',
        children: [
            {
                value: 'deploy_mode',
                label: '部署模式',
                key: 'deployment_model',
            },
            {
                value: 'install_path',
                label: '安装路径',
                key: 'installation_path',
            },
            {
                value: 'host_ips',
                label: '服务部署主机IP列表',
                key: 'deployed_ip_addresses',
            },
        ],
    },
    {
        value: 'network_info',
        label: '网络访问与数据级别信息',
        type: 'form',
        key: 'component_closed_source_software',
        children: [
            {
                value: 'network_exposure',
                label: '网络暴露面',
                key: 'network_exposure',
            },
            {
                value: 'service_address',
                label: '服务访问地址',
                key: 'access_url',
            },
            {
                value: 'data_sensitivity',
                label: '数据敏感级别',
                key: 'data_sensitivity_level',
            },
        ],
    },
    {
        value: 'app_carrier',
        label: '所属应用载体',
        type: 'table',
        key: 'carrier',
        columns: [
            {
                title: '载体名称',
                dataIndex: 'name',
                type: 'link',
            },
            {
                title: '载体类型',
                dataIndex: 'carrier_type',
                width: 178,
            },
            {
                title: '来源',
                dataIndex: 'source',
                width: 178,
            },
        ],
    },
    {
        value: 'belong_app',
        label: '所属应用',
        type: 'table',
        key: 'application',
        columns: [
            {
                title: '应用名称',
                dataIndex: 'application_name',
                type: 'link',
            },
            {
                title: '应用版本',
                dataIndex: 'application_version',
            },
            {
                title: '应用状态',
                dataIndex: 'application_status',
            },
            {
                title: '应用负责人',
                dataIndex: 'owner_nick_name',
                type: 'avatar',
            },
            {
                title: '所属业务系统',
                dataIndex: 'business_system_name',
            },
            {
                title: '所属组织',
                dataIndex: 'organize_name',
            },
            {
                title: '最近更新时间',
                dataIndex: 'updated_at',
                type: 'time',
            },
        ],
    },
    {
        value: 'security',
        label: '安全问题',
        type: 'table',
        key: 'issue',
        columns: [
            {
                title: '安全问题',
                dataIndex: 'issue_title',
                type: 'link',
            },
            {
                title: '安全问题级别',
                dataIndex: 'issue_level',
            },
            {
                title: '漏洞数',
                dataIndex: 'vuln_count',
            },
            {
                title: '负责人',
                dataIndex: 'issue_owner_nick_name',
                type: 'avatar',
            },
            {
                title: '处置状态',
                dataIndex: 'issue_status',
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                type: 'time',
            },
            {
                title: '更新时间',
                dataIndex: 'updated_at',
                type: 'time',
            },
        ],

    },
];

// 软件成分来源
export const SOFTWARE_COMPONENT_SOURCE = [
    {
        value: 'system_recognition',
        label: '系统识别',
    },
    {
        value: 'manual_addition',
        label: '手动添加',
    },
];
