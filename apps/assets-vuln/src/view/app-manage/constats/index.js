import { unBindCarrierApi, getAppCarrierTypeListApi } from 'api/app';
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

export const CARRIER_OPTION = [
    {
        label: '代码仓库',
        value: 'code_repo',
    },
    {
        label: '制品',
        value: 'artifact',
    },
    {
        label: '服务地址',
        value: 'service_address',
    },
    {
        label: '主机',
        value: 'host',
    },
];

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
