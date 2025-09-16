import {
    unBindCarrierApi, getAppCarrierTypeListApi, getSecAbleListApi,
} from 'api/app';
import { ref } from 'vue';

export const SEC_LEVEL_OPTION = [
    {
        label: '严重',
        value: 'critical',
    },
    {
        label: '高危',
        value: 'high',
    },
    {
        label: '中危',
        value: 'medium',
    },
    {
        label: '低危',
        value: 'low',
    },
];

export const findSeverityLabel = (value) => SEC_LEVEL_OPTION.find((item) => item.value === value)?.label || '-';

// 处置状态
export const DISPOSAL_STATUS = [
    {
        value: 'open',
        label: '未处置',
    },
    {
        value: 'processing',
        label: '处置中',
    },
    {
        value: 'completed',
        label: '已完成',
    },
    {
        value: 'close',
        label: '已关闭',
    },
    {
        value: 'ignored',
        label: '已忽略',
    },
    {
        value: 'whitelisted',
        label: '已加白',
    },
];

export const findDisposalStatusLabel = (value) => DISPOSAL_STATUS.find((item) => item.value === value)?.label || '-';

export const APP_CARRIER_TYPE_OPTION = ref([]);

// export const PRODUCT_OPTION = [
//     {
//         label: 'Jar',
//         value: 'jar',
//     },
//     {
//         label: 'Docker',
//         value: 'docker',
//     },
//     {
//         label: 'War',
//         value: 'war',
//     },
// ];

// export const SERVER_OPTION = [
//     {
//         label: 'Web',
//         value: 'web',
//     },
//     {
//         label: 'MySQL',
//         value: 'mysql',
//     },
//     {
//         label: 'Redis',
//         value: 'redis',
//     },
// ];

// 载体类型
export const CARRIER_OPTION = [
    {
        label: '代码仓库',
        value: 'code_repo',
    },
    // {
    //     label: '制品',
    //     value: 'artifact',
    // },
    {
        label: '服务地址',
        value: 'service_address',
    },
    {
        label: '主机',
        value: 'host',
    },
];

export const findCarrierTypeLabel = (value) => CARRIER_OPTION.find((item) => item.value === value)?.label || '-';

export const CHAIN_OPTION = [
    {
        label: '开源组件',
        value: 'open_asset',
    },
    {
        label: '开源软件',
        value: 'open_app',
    },
];

export const unBindCarrier = async (data, getData) => {
    try {
        await unBindCarrierApi(data);
        getData();
    } catch (error) {
        console.log(error);
    }
};

// 应用状态
export const APP_STATUS_OPTION = [
    {
        label: '运行中',
        value: 'active',
    },
    {
        label: '维护中',
        value: 'maintenance',
    },
    {
        label: '已下线',
        value: 'retired',
    },
];

export const findApplicationStatusLabel = (value) => APP_STATUS_OPTION.find((item) => item.value === value)?.label || '-';

export const getAppCarrierTypeList = async (id) => {
    try {
        const { data } = await getAppCarrierTypeListApi({
            application_id: id,
            // carrier_type: type,
        });
        APP_CARRIER_TYPE_OPTION.value = data.data?.map((item) => ({
            label: item,
            value: item,
        }));
    } catch (error) {
        console.log(error);
    }
};

// 安全能力
export const SECURITY_CAPABILITY_OPTION = ref([]);

export const getSecurityCapabilityList = async () => {
    try {
        const response = await getSecAbleListApi();
        SECURITY_CAPABILITY_OPTION.value = response.data.data?.data_list?.map((item) => ({
            label: item.capability_name,
            value: item.security_capability_id,
        }));
    } catch (error) {
        console.log(error);
    }
};

getSecurityCapabilityList();

// 漏洞状态
export const VULN_STATUS_OPTION = [
    {
        label: '待修复',
        value: 'open',
    },
    {
        label: '修复中',
        value: 'following',
    },
    {
        label: '误报',
        value: 'false_positive',
    },
    {
        label: '已修复',
        value: 'fixed',
    },
    {
        label: '已忽略',
        value: 'ignored',
    },
];

export const findVulnStatusLabel = (value) => VULN_STATUS_OPTION.find((item) => item.value === value)?.label || '-';

// 业务系统状态
export const SYSTEM_STATUS_OPTION = [
    {
        label: '运行中',
        value: 'active',
    },
    {
        label: '维护中',
        value: 'maintenance',
    },
    {
        label: '已下线',
        value: 'retired',
    },
];

export const findSystemStatusLabel = (value) => SYSTEM_STATUS_OPTION.find((item) => item.value === value)?.label || '-';
