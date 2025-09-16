import {
    ref, watch, onMounted, onUnmounted,
} from 'vue';
import { getRefreshProjectStatusApi } from 'api/project';
import { compIsJumpApi } from 'api/knowledge';
import store from 'util/store';
import { showMessage } from './tools';

// 列表hook
export default function useList(listReqFn: Function, filterOptions: any = {}) {
    // 总数
    const total = ref<number>(0);
    // 当前页
    const curPage = ref<number>(1);
    // 列表数据
    const listData = ref<Array<any>>([]);
    // 缓存总数据
    const initData = ref<Array<any>>([]);
    // 是否无值
    const isHaveData = ref<boolean>(true);

    const loading = ref<boolean>(false);

    // 获取数据
    const getData = async () => {
        loading.value = true;
        try {
            const res = await listReqFn({
                page: curPage.value,
                limit: 20,
                ...filterOptions.value,
            });

            listData.value = Object.values(res.data?.list || res.data || []);
            initData.value = Object.values(res.data?.list || res.data || []);
            total.value = res.data?.total || initData.value?.length;
            isHaveData.value = listData.value.length > 0;
            listData.value = listData.value.map((item) => ({
                expand: false,
                ...item,
            }));

            loading.value = false;
        } catch (error) {
            console.log(error);
        }
    };
    getData();

    // 分页监听
    watch(curPage, () => {
        getData();
    });

    // 筛选监听
    if (filterOptions.value) {
        watch(filterOptions.value, () => {
            curPage.value = 1;
            // 代码托管jfrog nexus搜索单独处理
            if ((filterOptions.value.access_type === 'jfrog' || filterOptions.value.access_type === 'nexus' || filterOptions.value.access_type === 'folib') && filterOptions.value.keyword) {
                filterOptions.value.parent_directory = '';
            }
            getData();
        });
    }
    return {
        total,
        curPage,
        listData,
        isHaveData,
        initData,
        loading,
        getData,
    };
}

export const useEnterPress = (callback: () => void) => {
    function enterPress(event: any) {
        if (event.keyCode === 13) {
            callback.call(null);
        }
    }

    onMounted(() => {
        document.addEventListener('keydown', enterPress);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', enterPress);
    });
};

// 同步项目
export const lastRefreshTime = ref<string>('');
export const refreshLoading = ref<boolean>(false);
export const rollTimer = ref<any>(null);
export const rollRefresh = async (data: any, time: number = 3000) => {
    if (time) {
        refreshLoading.value = true;
        const refreshProjectHandle = async () => {
            try {
                const res = await getRefreshProjectStatusApi(data.value);
                if (!res.data.is_doing) {
                    lastRefreshTime.value = res.data.start_time;
                    return true;
                }
                return false;
            } catch (error) {
                return true;
            }
        };
        rollTimer.value = window.setInterval(async () => {
            const res = await refreshProjectHandle();
            if (res) {
                window.clearInterval(rollTimer.value);
                rollTimer.value = null;
                refreshLoading.value = false;
            }
        }, time);
    }
};

// 组件能跳详情不啊
export const compJump = async (obj:any) => {
    if (window.location.pathname.includes('share-report')) {
        return;
    }
    try {
        const { data } = await compIsJumpApi({
            team_id: store.teamInfo.team_id,
            ...obj,
        });
        if (data.is_jump === 3) {
            window.open(`/console/version-detail?name=${data.name}&version=${data.version}&ecosystem=${data.ecosystem}&repository=${data.repository}`, '_blank');
        } else if (data.is_jump === 2) {
            window.open(`/console/software-detail?name=${data.name}&ecosystem=${data.ecosystem}&repository=${data.repository}`, '_blank');
        } else {
            showMessage('未能找到该组件/软件包的详细信息，可能是在知识库中暂未收录或属于非开源组件/软件包', 'warning');
        }
    } catch (error) {
        console.log(error);
    }
};
