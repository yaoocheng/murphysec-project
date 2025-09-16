import {
    ref, watch, reactive, computed,
} from 'vue';
import { getSecAbleApi } from 'api/app';
import { userInfo } from '@/store';

const organize_id = computed(() => userInfo.value.org_id);

// 列表
export const usePageList = (reqFn, filters, initialPage = 1) => {
    // 分页配置
    const pageConfig = reactive({
        current: initialPage,
        total: 0,
        showTotal: () => `共 ${pageConfig.total} 条`,
        showSizeChanger: false,
        hideOnSinglePage: true,
    });

    // 列表数据
    const listData = ref([]);

    // loading
    const loading = ref(false);

    const isHasData = ref(true);

    // 获取列表数据
    const getData = async (str) => {
        loading.value = true;
        try {
            const { data } = await reqFn({
                organize_id: organize_id.value,
                ...filters,
                page: pageConfig.current,
                limit: filters.limit || 10,
            });

            if (filters.source === 'sec-issue') {
                const idArray = data.data?.data_list.map((item) => item.issue_id);
                const secAbilityArray = await getSecAbleApi(idArray);
                listData.value = data.data?.data_list.map((item) => {
                    const abilityItem = secAbilityArray.data.data.find((ability) => ability.issue_id === item.issue_id);
                    return abilityItem ? { ...item, capability_names: abilityItem.capability_names.split(',') } : item;
                });
            } else {
                listData.value = data.data?.data_list || data.data?.list;
            }
            console.log(str, data.data);

            // listData.value = data.data?.data_list.map((item, index) => {
            //     if (!item.key) {
            //         item.key = index + 1;
            //     }
            //     return item;
            // });
            isHasData.value = data.data?.data_list?.length;
            pageConfig.total = data.data?.total;
            loading.value = false;
        } catch (error) {
            console.log(error);
            loading.value = false;
        }
    };
    getData();

    // 分页变化
    const changePageHandle = (page) => {
        pageConfig.current = page;
        getData();
    };

    // 筛选项变化
    if (Object.keys(filters).length) {
        watch(filters, () => {
            pageConfig.current = 1;
            getData();
        });
    }

    // 查询参数无法及时与其统一
    watch(userInfo.value, () => {
        pageConfig.current = 1;
        getData();
    });

    return {
        pageConfig,
        listData,
        loading,
        isHasData,
        changePageHandle,
        getData,
    };
};
