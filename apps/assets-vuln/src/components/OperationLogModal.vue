<template>
    <a-modal title="操作日志" width="840px" centered :footer=false>
        <div class="max-h-[calc(100vh-160px)] pt-3 pb-0">
            <a-table class="w-full base-table h-full" :columns="columns" :data-source="listData" :pagination="false"
                     rowKey="id" :scroll="{ y: 'calc(100vh - 300px)' }" v-model:expandedRowKeys="expandedRowKeys">
                <!-- <template #expandedRowRender="{ record }">
                    <div>
                        {{ record.description }}
                    </div>
                </template> -->
                <template #bodyCell="{ column, record, text }">
                    <template v-if="column.dataIndex === 'username'">
                        <div class="flex items-center">
                            <a-avatar size="small" :src="record.avatar" class="mr-2">
                                {{ text.charAt(0) }}
                            </a-avatar>
                            {{ text }}
                        </div>
                    </template>

                    <template v-else-if="column.key === 'time'">
                        {{ formatDate(text) }}
                    </template>

                    <template v-else-if="column.key === 'action'">
                        {{ computeOperation(record) }}
                    </template>

                    <template v-else-if="column.key === 'content'">
                        <a-tooltip v-if="record.operation_type === 'UPDATE'" arrowPointAtCenter>
                            <template #title>
                                {{ computeContent(record).before }}
                                <Svg class="mx-1" height="12px" width="12px" name="log-right_arrow" color="#ffffff"></Svg>
                                {{ computeContent(record).after }}
                            </template>
                            <span class="ellipsis">
                                {{ computeContent(record).before }}
                                <Svg class="mx-1" height="12px" width="12px" name="log-right_arrow" color="#2A2C32"></Svg>
                                {{ computeContent(record).after }}
                            </span>
                        </a-tooltip>
                        <a-tooltip v-else arrowPointAtCenter>
                            <template #title> {{ computeContent(record) }}</template>
                            <span class="ellipsis">
                                {{ computeContent(record) }}
                            </span>
                        </a-tooltip>
                    </template>

                    <!-- <template v-else-if="column.key === 'info'">
                        <a-tooltip placement="left" title="操作说明">
                            <InfoCircleOutlined style="cursor: pointer; color: #999;"
                                                @click="toggleExpand(record.id)" />
                        </a-tooltip>
                    </template> -->
                </template>
            </a-table>

            <div class="flex justify-end mt-4">
                <a-pagination class="pagination" :show-total="total => `共 ${total.toLocaleString()} 条`"
                              show-quick-jumper :total=pageConfig.total @change="changePageHandle"
                              v-model:current="pageConfig.current" v-model:pageSize="filters.limit" />
            </div>
        </div>

    </a-modal>
</template>

<script setup>
import {
    ref, reactive,
} from 'vue';
// import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { formatDate } from '@/utils';
import { getOperationLogApi } from '@/api/log'; // 假设有一个获取操作日志的 API
import { usePageList } from '@/hooks';
// logfilter 是一个从父组件传入的过滤条件，{entity_type: 'organization', entity_id: 1}
const { logfilter } = defineProps({
    logfilter: {
        type: Object,
        default: () => ({}),
    },
});

const filters = reactive({
    limit: 15,
    ...logfilter, // 合并传入的过滤条件
});

const {
    changePageHandle,
    listData,
    pageConfig,
    // getData,
} = usePageList(getOperationLogApi, filters);

const expandedRowKeys = ref([]); // 展开行的 key 集合，用于 a-table 的 v-model
// const toggleExpand = (id) => {
//     const index = expandedRowKeys.value.indexOf(id);
//     if (index > -1) {
//         // 已展开 -> 折叠
//         expandedRowKeys.value.splice(index, 1);
//     } else {
//         // 未展开 -> 展开
//         expandedRowKeys.value.push(id);
//     }
// };
const columns = [
    {
        title: '操作时间',
        dataIndex: 'created_at',
        key: 'time',
        width: '180px',
    },
    {
        title: '操作人',
        dataIndex: 'username',
        key: 'username',
        width: '152px',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: '196px',
    },
    {
        title: '操作内容',
        key: 'content',
        ellipsis: true,
    },
    // {
    //     title: '',
    //     key: 'info',
    //     width: '50px',
    //     align: 'center',
    // },
];

// OperationTypeCreate OperationType = "CREATE"  创建
// OperationTypeUpdate OperationType = "UPDATE"  更新
// OperationTypeDelete OperationType = "DELETE"  删除
// OperationTypeLink OperationType = "LINK"  关联
// OperationTypeUnlink OperationType = "UNLINK" 取消关联

// ModelTypeOrganize ModelType = "Organize"
// ModelTypeBusinessSystem ModelType = "BusinessSystem"
// ModelTypeApplication ModelType = "Application"
// ModelTypeCarrier ModelType = "Carrier"
// ModelTypeIssue ModelType = "Issue"
// ModelTypeComponent ModelType = "Component"
// ModelTypeVuln ModelType = "Vuln"
// ModelTypeSecurityCapability ModelType = "SecurityCapability"
// ModelTypeOwnerUser ModelType = "OwnerUser"

// 操作对象
// const OPERATION_OBJECT_DIAGRAM = {
//     Organize: '组织',
//     BusinessSystem: '业务系统',
//     Application: '应用',
//     Carrier: '载体',
//     Issue: '问题',
//     Component: '组件',
//     Vuln: '漏洞',
//     SecurityCapability: '安全能力',
//     OwnerUser: '所有者用户',
// };

const OPERATION_OBJECT_DIAGRAM = {
    // 组织
    Organize: {
        label: '组织',
        // CREATE: {
        //     label: '组织名称',
        // },
        Source: {
            label: '来源',

            web: '平台页面',
            openApi: 'openApi',
        },

        OrganizeName: {
            label: '组织名称',
        },

        DepId: {
            label: '外部部门ID',
        },
    },

    // 组织用户
    OwnerUser: {
        label: '负责人',

        Source: {
            web: '平台页面',
            openApi: 'openApi',
        },
        // Status: {
        //     t: '保留字段(没用)',
        //     active: '运行中',
        //     maintenance: '维护中',
        //     retired: '停止',
        // },
    },

    User: {
        label: '用户',
    },

    // 业务系统
    BusinessSystem: {
        label: '系统',

        BusinessSystemStatus: {
            label: '状态',

            active: '运行中',
            maintenance: '维护中',
            retired: '已下线',
        },
        DataStatus: {
            label: '数据状态',

            imperfect: '待完善',
            perfect: '待发布',
            published: '已发布',
        },
        DataProcessor: {
            label: '数据处理人',

            // 这里可以根据需要添加具体字段
        },

        BusinessSystemName: {
            label: '业务系统名称',
        },

        DepId: {
            label: '外部部门ID',
        },

        GroupOwn: {
            label: '外部负责人',
        },

        SystemOwerName: {
            label: '组织负责人',
        },

        DevelopMode: {
            label: '开发模式',
        },

        ApplicationLevelDesc: {
            label: '系统重要性等级',
        },

        CooperateComp: {
            label: '合作开发公司',
        },

    },

    // 应用
    Application: {
        label: '应用',

        ApplicationStatus: {
            label: '应用状态',

            active: '运行中',
            maintenance: '维护中',
            retired: '已下线',
        },
        DataStatus: {
            label: '数据状态',

            imperfect: '待完善',
            perfect: '待发布',
            published: '已发布',
        },
        DataProcessor: {
            label: '数据处理人',

            // 这里可以根据需要添加具体字段
        },

        ApplicationVersion: {
            label: '应用版本',
        },

        ApplicationName: {
            label: '应用名称',
        },

        DepId: {
            label: '外部部门ID',
        },

        DepName: {
            label: '外部部门名称',
        },

        GroupOwn: {
            label: '外部负责人',
        },

        GroupOwnId: {
            label: '外部负责人ID',
        },

        ApplicationOwnerName: {
            label: '应用负责人',
        },

        ApplicationLevelDesc: {
            label: '应用重要性等级',
        },

        DevelopMode: {
            label: '开发模式',
        },

        CooperateComp: {
            label: '合作开发公司',
        },
    },

    // 载体
    Carrier: {
        label: '应用载体',

        CarrierType: {
            label: '应用载体类型',

            service_address: '服务地址',
            code_repo: '代码仓库',
            host: '主机',
        },
        Source: {
            label: '来源',

            custom: '用户自定义直接显示',
        },

        Name: {
            label: '应用载体名称',
        },

        Protocol: {
            label: '协议类型',
        },

        IP: {
            label: 'IP',
        },

        Port: {
            label: '端口号',
        },

        Path: {
            label: '路径',
        },

        Domain: {
            label: '域名',
        },

        InternetIP: {
            label: '互联网IP',
        },

        NATIP: {
            label: 'NAT IP',
        },

        InternalIP: {
            label: '内网IP',
        },

        RepoNamespace: {
            label: '仓库命名空间/组织',
        },

        RepoName: {
            label: '仓库名称',
        },

        RepoURL: {
            label: '仓库URL',
        },

        Branch: {
            label: '分支名',
        },

        IssueCount: {
            label: '安全问题数量',
        },

        DataProcessor: {
            label: '数据处理人',
        },

    },

    // 安全问题
    Issue: {
        label: '安全问题',

        IssueStatus: {
            label: '处置状态',

            open: '未处置',
            processing: '处置中',
            completed: '已完成',
            close: '已关闭',
            ignored: '已忽略',
            whitelisted: '已加白',
        },

        IssueLevel: {
            label: '安全问题级别',

            critical: '严重',
            high: '高',
            medium: '中',
            low: '低',
            info: '无',
        },

        IssueTitle: {
            label: '标题',
        },

        Solution: {
            label: '解决方案',
        },

        VulnCount: {
            label: '漏洞数量',
        },

        DiscoverAt: {
            label: '发现时间',
        },

    },

    // 组件
    Component: {
        label: '软件成分',

        // 组件状态
        Status: {
            label: '状态',

            active: '活跃',
            approved: '已批准',
            deprecated: '已弃用',
            eol: '终止支持',
        },

        // 资产类型子分类
        AssetType: {
            label: '子分类',

            physical_server: '物理服务器',
            virtual_machine: '虚拟机',
            network_device: '网络设备',
            operating_system: '操作系统',
            container_runtime: '容器运行时',
            programming_language_runtime: '编程语言运行时',
            application_server: '应用服务器',
            object_storage: '对象存储',
            data_processing_platform: '数据计算',
            database: '数据库',
            data_distribution: '数据分发',
            data_warehouse: '数据仓库',
            cache: '缓存',
            external_api: '外部 API',
            saas_service: 'SaaS 服务',
            external_data_source: '外部数据源',
            in_house_developed_code: '自研代码',
            in_house_developed_component: '自研组件',
            open_source_component: '开源组件',
            closed_source_component: '闭源组件',
            sdk: 'SDK',
            open_source_application: '开源应用软件',
            closed_source_application: '闭源应用软件',
            machine_learning_model: '模型',
            ide: '集成开发环境',
            version_control_system: '代码与版本控制系统',
            ci_cd_system: 'CI/CD 与自动化系统',
            build_dependency_tool: '构建与依赖管理工具',
            artifact_repository: '制品仓库',
        },

        ComponentName: {
            label: '软件成分名称',
        },

        ComponentVersion: {
            label: '版本',
        },

        AssetCategory: {
            label: '资产大类',

            infrastructure_layer: '基础设施层',
            runtime_environment_layer: '运行时环境层',
            data_processing_layer: '数据处理层',
            external_dependency_layer: '外部依赖层',
            application_layer: '业务应用层',
            development_engineering_layer: '开发效率层',
        },

        Vendor: {
            label: '供应商',
        },

        Ecosystem: {
            label: '生态系统',
        },

        Repository: {
            label: '代码仓库',
        },

        SupplierName: {
            label: '供应商名称',
        },

    },

    // 漏洞
    Vuln: {
        label: '漏洞',

        // 漏洞等级
        Severity: {
            label: '漏洞等级',

            critical: '严重',
            high: '高',
            medium: '中',
            low: '低',
            info: '无',
        },

        // 状态
        Status: {
            label: '状态',
            open: '待处理',
            resolved: '已解决',
            in_progress: '处置中',
            closed: '关闭',
            false_positive: '不明确',
            risk_accepted: '已忽略继续',
        },

        Title: {
            label: '漏洞标题',
        },

        VulnerabilityType: {
            label: '漏洞类型',
        },

        CweID: {
            label: 'CWE编号',
        },

        CveID: {
            label: 'CVE编号',
        },

        Impact: {
            label: '漏洞影响',
        },

        ReportURL: {
            label: '报告URL',
        },

        OwerName: {
            label: '负责人姓名',
        },

    },

    // 安全能力
    SecurityCapability: {
        label: '安全能力',

        CapabilityType: {
            label: '安全能力类型',

            'Software Composition Analysis': '软件成分分析',
            'Static Application Security Testing': '静态应用安全测试',
            'Dynamic Application Security Testing': '动态应用安全测试',
            'Interactive Application Security Testing': '交互式应用安全测试',
            'Secrets Detection': '敏感信息检测',
            'Infrastructure as Code Scan': '基础设施即代码扫描',
            'Container Image Security Scan': '容器镜像安全扫描',
            'API Security Testing': 'API 安全测试',
            'External Attack Surface Management': '外部攻击面管理',
            'Web Application Firewall': 'Web 应用防火墙',
            'Runtime Application Self-Protection': '运行时应用自我保护',
            'Vulnerability Intelligence': '漏洞情报',
            MissingRateValue: '缺失率',
            Others: '其他能力',

        },
        MissingRateValue: {
            label: '安全能力',
        },

        CapabilityName: {
            label: '名称',
        },

    },
};

// 计算操作
const computeOperation = (record) => {
    switch (record.operation_type) {
        case 'CREATE':
            return `新增${OPERATION_OBJECT_DIAGRAM[record.related_entity_type].label}`;
        case 'UPDATE':
            return `变更${OPERATION_OBJECT_DIAGRAM[record.related_entity_type][record.modified_field]?.label || record.modified_field}`;
        case 'DELETE':
            return `删除${OPERATION_OBJECT_DIAGRAM[record.related_entity_type].label}`;
        case 'LINK':
            return `新增${OPERATION_OBJECT_DIAGRAM[record.related_entity_type].label}关联`;
        case 'UNLINK':
            return `解除${OPERATION_OBJECT_DIAGRAM[record.related_entity_type].label}关联`;
        default:
            return `执行了未知操作：${record.action}`;
    }
};

// 计算操作内容
const computeContent = (record) => {
    switch (record.operation_type) {
        case 'CREATE':
            return record.spare_field || record.related_entity_filter || '-';
        case 'UPDATE':
            return {
                before: OPERATION_OBJECT_DIAGRAM[record.related_entity_type][record.modified_field]?.[record.before_value] || record.before_value || '-',
                after: OPERATION_OBJECT_DIAGRAM[record.related_entity_type][record.modified_field]?.[record.after_value] || record.after_value || '-',
            };
        case 'DELETE':
            return record.spare_field || record.related_entity_filter || '-';
        case 'LINK':
            return record.spare_field || record.related_entity_filter.label || '-';
        case 'UNLINK':
            return record.spare_field || record.related_entity_filter || '-';
        default:
            return `执行了未知操作：${record.action}`;
    }
};

// onMounted(() => {
//     // 组件加载时获取数据
//     getData();
// });

</script>

<style scoped>
/* AntD + Tailwind 搭配时字体和头像可以稍微微调 */
</style>
