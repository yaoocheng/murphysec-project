import { getOrgTreeSelectDataApi } from 'api/org';
import { ref } from 'vue';
import { globalState } from '@/store';

// 组织树
export const ORG_TREE = ref();

export const getOrgTree = async () => {
    const { data } = await getOrgTreeSelectDataApi();
    ORG_TREE.value = data.data.data_list;
};

getOrgTree();

export const findOrgTreeLabel = (value) => {
    if (!ORG_TREE.value) return '-';

    const findOrg = (orgs) => {
        if (!orgs) return null;

        const foundOrg = orgs.find((org) => org.organize_id === String(value));
        if (foundOrg) return foundOrg.organize_name;

        const nestedOrg = orgs.find((org) => org.organize && org.organize.length > 0);
        if (nestedOrg) return findOrg(nestedOrg.organize);

        return null;
    };

    const result = findOrg(ORG_TREE.value);
    return result || '-';
};

// 负责人
export const USER_LIST = ref(globalState);

export const findUserLabel = (value) => {
    const user = USER_LIST.value.userList.find((item) => item.organize_user_id === String(value));
    return user?.organize_nick_name || '-';
};

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

export const findSoftwareComponentCategoryLabel = (value) => {
    const label = SOFTWARE_COMPONENT_CATEGORY.find((item) => item.value === value)?.label;
    return label || value;
};

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

export const findSoftwareComponentStatusLabel = (value) => SOFTWARE_COMPONENT_STATUS.find((item) => item.value === value)?.label || '-';

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

export const findSoftwareComponentPurchaseTypeLabel = (value) => SOFTWARE_COMPONENT_PURCHASE_TYPE.find((item) => item.value === value)?.label || '-';

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

export const findSoftwareComponentDeployModeLabel = (value) => SOFTWARE_COMPONENT_DEPLOY_MODE.find((item) => item.value === value)?.label || '-';

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

export const findSoftwareComponentNetworkExposureLabel = (value) => SOFTWARE_COMPONENT_NETWORK_EXPOSURE.find((item) => item.value === value)?.label || '-';

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

export const findSoftwareComponentDataSensitivityLabel = (value) => SOFTWARE_COMPONENT_DATA_SENSITIVITY.find((item) => item.value === value)?.label || '-';

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
