import { ref } from 'vue';
import { getSysStatusListApi } from 'api/bus';

export const SYSTEM_STATUS_OPTION = ref([]);

const getSysStatusList = async () => {
    try {
        const { data } = await getSysStatusListApi();
        SYSTEM_STATUS_OPTION.value = data.data?.filter((item) => item !== '').map((item) => ({
            label: item,
            value: item,
        }));
    } catch (error) {
        console.log(error);
    }
};
getSysStatusList();

export const editSysData = ref(null);
