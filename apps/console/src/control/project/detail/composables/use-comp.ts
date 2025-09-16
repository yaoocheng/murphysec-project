import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

interface FilterOptions {
    subtask_id: string;
    project_id: string;
}

interface FilterConfig {
    is_online: 0 | 1;
    is_triggers: 0 | 1;
    is_poison: 0 | 1;
}

interface SearchData {
    keyword: string;
    suggest: number | string;
    status: number | string;
    triggers: boolean;
    online: boolean;
    poison: boolean;
    rely: boolean | undefined;
    projectStra: boolean;
    basis: string | undefined;
    cavd: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export function useCompIndex() {
    const route = useRoute();
    const showIssueDetail = ref<boolean>(false);
    const securityId = ref<string>('');

    const infiniteWrapEl = ref();
    const curTotalData = ref<any[]>([]); // 当前搜索总数

    const filterOptions = ref<FilterOptions>({
        subtask_id: route.params.sid as string,
        project_id: route.params.tid as string,
    });

    const filterConfig = reactive<FilterConfig>({
        is_online: 1,
        is_triggers: 1,
        is_poison: 1,
    });

    const searchData = ref<SearchData>({
        keyword: '',
        suggest: '',
        status: '',
        triggers: false,
        online: false,
        poison: false,
        rely: undefined,
        projectStra: false,
        basis: undefined,
        cavd: false,
    });

    return {
        showIssueDetail,
        securityId,
        filterOptions,
        filterConfig,
        searchData,
        infiniteWrapEl,
        curTotalData,
    };
}
