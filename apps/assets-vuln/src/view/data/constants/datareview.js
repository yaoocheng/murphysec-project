import { ref } from 'vue';
import { getPreparationAppSourceListApi } from 'api/data';
// 应用载体来源
export const APP_VECTOR_SOURCE_OPTIONS = ref([
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
]);

// 获取应用载体来源
const getAppVectorSource = async () => {
    const res = await getPreparationAppSourceListApi();
    APP_VECTOR_SOURCE_OPTIONS.value = res.data.data.map((item) => ({
        label: item,
        value: item,
    }));

    console.log(APP_VECTOR_SOURCE_OPTIONS.value);
};

getAppVectorSource();

// 数据状态
export const DATA_STATUS_OPTIONS = [
    {
        label: '待完善',
        value: 'imperfect',
    },
    {
        label: '待发布',
        value: 'perfect',
    },
    // {
    //     label: '已发布',
    //     value: 'published',
    // },
];

export const findDataStatusLabel = (value) => DATA_STATUS_OPTIONS.find((item) => item.value === value)?.label || '-';
