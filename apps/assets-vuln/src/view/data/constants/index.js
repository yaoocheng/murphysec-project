import { ref } from 'vue';
import { getPluginTempApi } from 'api/data';

export const PLUGIN_TYPE_OPTION = [
    {
        label: '组织架构',
        value: 'organize',
    },
    {
        label: '业务系统',
        value: 'business',
    },
    {
        label: '应用载体',
        value: 'carrier',
    },
    {
        label: '组织成员',
        value: 'organize-user',
    },
    {
        label: '软件成分',
        value: 'component',
    },
    {
        label: '漏洞',
        value: 'vuln',
    },
    {
        label: '应用',
        value: 'application',
    },
];

export const EXEC_STATUS_OPTION = [
    {
        label: '执行中',
        value: 'start',
    },
    {
        label: '已成功',
        value: 'success',
    },
    {
        label: '已失败',
        value: 'fail',
    },
];

export const PLUGIN_TEMP_OPTION = ref();

export const getPluginTemp = async () => {
    try {
        const { data } = await getPluginTempApi();
        PLUGIN_TEMP_OPTION.value = data.data;
    } catch (error) {
        console.log(error);
    }
};
getPluginTemp();

export const pluginMarket = ref();

export const editPluginData = ref();

export const editTaskData = ref();
