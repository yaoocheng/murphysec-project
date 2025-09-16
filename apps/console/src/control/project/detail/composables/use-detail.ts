import { ref, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { localStorageUtil, showMessage } from 'util/tools';
import store from 'util/store';
import { getProjectStrategyInfoApi } from 'api/team';
import {
    getDetailInfoApi, exportReportApi, getCurProjectTagsApi, getMavenInfoApi, getDetectTimeApi,
} from 'api/project';
import { canAdjust } from '../../business';
import { UI } from '../snippet/business';
import LoadingComponent from '@/components/LoadingComponent.vue';

// eslint-disable-next-line import/prefer-default-export
export function useDetail() {
    const route = useRoute();
    const info = ref<any>({});
    const tabActive = ref<number>(7);
    const { origin } = window.location;
    const isShowexportConfig = ref<boolean>(false);
    const isShowCompiler = ref<boolean>(false);
    const isContainer = ref<boolean>(false);
    const showTip = ref<boolean>(true);
    const showMavenTips = ref<boolean>(true);
    const showMavenTipsModal = ref<boolean>(false);
    const showMavenInfo = ref<any>([]);
    const showStrategyModal = ref<boolean>(false);
    const strategyList = ref<any[]>([]);
    const detecttime = ref();
    const projectTag = ref<any[]>([]);
    const distributeModal = ref(false);
    const exportSbomModal = ref(false);
    const showSuggestStrategy = ref(false);
    const extraInfo = ref<boolean>(false);

    // 导出
    const exportHandle = async (type: number) => {
        await exportReportApi({
            ext_type: type,
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            org_id: localStorageUtil('get', 'g-t')?.org_id,
        });
        showMessage('正在导出中，请在导出管理查看', 'success');
    };

    const updateInfo = async () => {
        try {
            const res = await getDetailInfoApi(route.params.sid as string || '0', undefined);
            info.value = res.data;
            store.reportShowInfo = res.data;
            canAdjust.value = !res.data.power_version?.includes('disable_fix_comp_version');
            UI.value = res.data.power_version?.includes('ac') ? 1 : 2;
        } catch (error) {
            console.error('Failed to update info:', error);
        }
    };

    // 获取项目标签信息
    const fetchProjectTags = async () => {
        const { data } = await getCurProjectTagsApi(route.params.tid as string || info.value?.project_id || '0');
        projectTag.value = data;
    };

    // 获取项目策略信息
    const fetchStrategyInfo = async () => {
        const { data } = await getProjectStrategyInfoApi(route.params.sid as string || '0');
        strategyList.value = Object.values(data);
    };

    // 获取Maven信息
    const fetchMavenInfo = async () => {
        const { data } = await getMavenInfoApi(route.params.sid as string || '0');
        showMavenInfo.value = data;
    };

    // 获取检测时间信息
    const fetchDetectTime = async () => {
        const { data } = await getDetectTimeApi(route.params.sid as string || '0');
        const scaTime = new Date(data.sca_scan_end_at).getTime() - new Date(data.sca_scan_start_at).getTime();
        detecttime.value = (scaTime / 1000).toFixed(3);
    };

    return {
        route,
        info,
        tabActive,
        origin,
        isShowexportConfig,
        isShowCompiler,
        isContainer,
        showTip,
        showMavenTips,
        showMavenTipsModal,
        showMavenInfo,
        showStrategyModal,
        strategyList,
        detecttime,
        projectTag,
        distributeModal,
        exportSbomModal,
        showSuggestStrategy,
        extraInfo,
        exportHandle,
        updateInfo,
        fetchProjectTags,
        fetchMavenInfo,
        fetchDetectTime,
        fetchStrategyInfo,
    };
}

// 异步组件配置
export const asyncComponents = {
    OverviewInfo: defineAsyncComponent({
        loader: () => import('../OverviewInfo.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    CompIndex: defineAsyncComponent({
        loader: () => import('../CompIndex.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    TimeConsume: defineAsyncComponent({
        loader: () => import('../components/TimeConsume.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    LicenseIndex: defineAsyncComponent({
        loader: () => import('../license/Index.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    SbomFile: defineAsyncComponent({
        loader: () => import('../SbomFile.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    VulnIndex: defineAsyncComponent({
        loader: () => import('../VulnIndex.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    CodeSnippet: defineAsyncComponent({
        loader: () => import('../CodeSnippet.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    ExportConfigModal: defineAsyncComponent({
        loader: () => import('../ExportConfigModal.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    SensitiveInfo: defineAsyncComponent({
        loader: () => import('../SensitiveInfo.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    ComparsionIndex: defineAsyncComponent({
        loader: () => import('../comparison/ComparsionIndex.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    ContainerInfo: defineAsyncComponent({
        loader: () => import('../ContainerInfo.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    FileRisk: defineAsyncComponent({
        loader: () => import('../FileRisk.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    StrategyModal: defineAsyncComponent({
        loader: () => import('../components/StrategyModal.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    MavenInfo: defineAsyncComponent({
        loader: () => import('../components/MavenInfo.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    AdjustDetectStatus: defineAsyncComponent({
        loader: () => import('../sbom/AdjustDetectStatus.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    DistributeModal: defineAsyncComponent({
        loader: () => import('../../DistributeModal.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
    SuggestStrategy: defineAsyncComponent({
        loader: () => import('../components/SuggestStrategy.vue'),
        loadingComponent: LoadingComponent,
        delay: 100,
    }),
};
