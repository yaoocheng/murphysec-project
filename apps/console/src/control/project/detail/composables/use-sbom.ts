import { ref, reactive, watch } from 'vue';
import {
    getDetailSbomListApi, getTraceBasisDataApi, getDetailModuleListApi, getcompGraphApi, getSbomCodeApi,
} from 'api/project';
import { FILE_ICON, FILENAME_JSON, FILETYPE_JSON } from '@/constants/file-icon';

// 定义类型接口
interface SearchDataType {
    isOnline: boolean;
    suggest: number[];
    rely: boolean | undefined;
    projectStra: boolean;
    compStra: string;
    keyword: string;
    basis: string | undefined;
    compUse: string | undefined;
}

// 定义组件项接口
interface SbomItem {
    suggest_level: number;
    [key: string]: any;
}

// 模态框状态相关
export const useModalStates = () => {
    const isShowTraceMap = ref<boolean>(false);
    const isShowRadar = ref<boolean>(false);
    const isShowFileINfo = ref<boolean>(false);
    const isShowSbomSourceModal = ref<boolean>(false);
    const isNewSnippetModal = ref<boolean>(false);
    const isOldSnippetModal = ref<boolean>(false);
    const oldSnippetModalRenderData = ref({});
    return {
        isShowTraceMap,
        isShowRadar,
        isShowFileINfo,
        isShowSbomSourceModal,
        isNewSnippetModal,
        isOldSnippetModal,
        oldSnippetModalRenderData,
    };
};

// 排序处理
export const sortHandle = (list: SbomItem[]) => {
    const priorityLevels = [4, 3, 2, 1];
    return priorityLevels.reduce<SbomItem[]>((acc, level) => [...acc, ...list.filter((item) => item.suggest_level === level)], []);
};

// 组件数据相关
export const useComponentData = () => {
    const treeData = ref<Array<any>>([]);
    const initCompData = ref<Array<any>>([]);
    const compData = ref<Array<any>>([]);
    const conpInfo = ref<any>({});
    const curCompInfo = ref();
    const adjustComp = ref();
    const clickPath = ref();
    const cacheTree = ref();
    const isShowCommentModal = ref(false);
    const treeDataLoading = ref(false); // 新增treeloading
    const compListLoading = ref(false); // 新增loading

    // 获取模块列表
    const getModuleList = async (subtask_id: string, project_id: string) => {
        treeDataLoading.value = true;
        try {
            const module = await getDetailModuleListApi({
                subtask_id,
                project_id,
            });
            treeData.value = module.data.children || [];
            treeDataLoading.value = false;

            return module.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    // 获取全部组件
    const getAllComp = async (subtask_id: string, project_id: string) => {
        compListLoading.value = true;
        try {
            const sbomData = await getDetailSbomListApi({
                subtask_id,
                project_id,
            });
            clickPath.value = '';
            compData.value = sortHandle(Object.values(sbomData.data || []));
            initCompData.value = sortHandle(Object.values(sbomData.data || []));
            compListLoading.value = false;
        } catch (error) {
            console.log(error);
        }
    };

    const openComment = (row:any) => {
        curCompInfo.value = row;
        isShowCommentModal.value = true;
    };

    return {
        treeData,
        treeDataLoading,
        initCompData,
        compData,
        compListLoading,
        conpInfo,
        curCompInfo,
        adjustComp,
        clickPath,
        cacheTree,
        isShowCommentModal,
        getAllComp,
        getModuleList,
        openComment,
    };
};

// 篡改文件相关
export const useTamperFile = () => {
    const iteraterTree = (tree: any[]) => {
        let res: Array<any> = [];
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].children && tree[i].children.length) {
                res = res.concat(iteraterTree(tree[i].children));
            }
            if (tree[i].file_tampered) {
                const node = {
                    data: tree[i].data,
                    file_tampered: tree[i].file_tampered,
                    name: tree[i].name,
                };
                res.push(node);
            }
        }
        return res;
    };

    const changeTamperFile = (value: boolean, treeData: any, cacheTree: any) => {
        if (value) {
            cacheTree.value = treeData.value;
            treeData.value = iteraterTree(treeData.value);
        } else {
            treeData.value = cacheTree.value;
        }
    };

    return {
        iteraterTree,
        changeTamperFile,
    };
};

// 追踪和分析数据相关
export const useAnalysisData = () => {
    const graph = ref<any>(null);
    const codeFragment = ref<any>(null);
    const basisData = ref<any>(null);
    const sbomSourceReqData = ref<any>({});
    const radatData = ref<any>({});
    const fileParams = ref();
    const curCompInfo = ref<any>(null);
    const graphLoading = ref(false);

    const getGraphData = async (params: any) => {
        try {
            const res = await getcompGraphApi(params);
            graph.value = res.data;
            // 溯源图数据处理
            graph.value.nodes = graph.value?.nodes?.map((item: any, index: number) => ({
                id: index,
                name: String(index),
                show_name: item.comp_name || item.module?.name,
                comp_version: item.comp_version || item.module?.version,
                license: item.Licenses && item.Licenses?.[0]?.spdx,
                is_direct_dependency: item.is_direct_dependency,
                suggest_level: item.suggest_level,
                is_self: item.is_self,
            }));
            graph.value.edge = graph.value?.edge?.map((item: any) => ({
                source: String(item.source),
                target: String(item.target),
                value: 1,
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const getCodeData = async (params: any) => {
        try {
            const res = await getSbomCodeApi(params);
            codeFragment.value = res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getTraceBasisData = async (params: any) => {
        try {
            const { data } = await getTraceBasisDataApi(params);
            basisData.value = data;
        } catch (error) {
            console.log(error);
        }
    };

    return {
        graph,
        codeFragment,
        basisData,
        sbomSourceReqData,
        radatData,
        fileParams,
        curCompInfo,
        graphLoading,
        getGraphData,
        getCodeData,
        getTraceBasisData,
    };
};

// 搜索和过滤相关
// 获取文件图标
export const getFileImg = (filename: string) => {
    if (filename) {
        if (FILENAME_JSON[filename]) {
            return FILE_ICON[FILENAME_JSON[filename]];
        }
        const filenameArr = filename.split('.');
        if (FILETYPE_JSON[filenameArr[filenameArr.length - 1]]) {
            return FILE_ICON[FILETYPE_JSON[filenameArr[filenameArr.length - 1]]];
        }
        return FILE_ICON.default_file;
    }
};

// 复制路径相关
export const useClipboard = () => {
    const clipboardText = (paths: any[]) => {
        let str = '';
        paths.forEach((item) => {
            str += `${item.associated_file_path}\n`;
        });
        return str;
    };

    return {
        clipboardText,
    };
};

export const useSearchData = (initCompData: any, compData:any) => {
    const showPath = ref<string>('');
    const checkTamperFile = ref<boolean>(false);
    const searchData = reactive<SearchDataType>({
        keyword: '',
        isOnline: false,
        rely: undefined,
        suggest: [],
        projectStra: false,
        compStra: '',
        basis: undefined,
        compUse: undefined,
    });

    // 监听initCompData变化，更新项目策略状态
    watch(initCompData, (newVal: any[]) => {
        searchData.projectStra = false;
        if (newVal.length) {
            searchData.projectStra = newVal.some((item) => item.project_detection_strategy_name?.length);
        }
    });

    // 筛选
    watch(searchData, (newVal: any) => {
        let filterdata: Array<any> = initCompData.value;

        filterdata = filterdata.filter((item: any) => item.comp_name.includes(newVal.keyword));

        // 依赖类型
        if (newVal.suggest.length) {
            filterdata = filterdata.filter((item: any) => newVal.suggest.includes(item.suggest_level));
        }

        // 线上依赖
        if (newVal.isOnline) {
            filterdata = filterdata.filter((item: any) => item.is_online);
        }

        if (newVal.basis) {
            filterdata = filterdata.filter((item: any) => item.evidence_accuracy === newVal.basis);
        }

        if (newVal.compUse) {
            filterdata = filterdata.filter((item: any) => item.way_of_use_list.includes(newVal.compUse));
        }

        // 依赖类型
        if (newVal.rely !== undefined && newVal.rely !== '') {
            if (newVal.rely === 1) {
                filterdata = filterdata.filter((item: any) => item.is_self === Boolean(newVal.rely));
            } else {
                filterdata = filterdata.filter((item: any) => item.is_direct_dependency === newVal.rely);
            }
        }

        // 命中项目策略
        if (newVal.projectStra) {
            filterdata = filterdata.filter((item: any) => item.project_detection_strategy_name?.length);
        }

        // 命中组件类型
        if (newVal.compStra !== undefined && newVal.compStra !== '' && newVal.compStra !== 'mark') {
            filterdata = filterdata.filter((item: any) => item.set_suggest_level_type === newVal.compStra);
        }

        if (newVal.compStra === 'mark') {
            filterdata = filterdata.filter((item: any) => item.detection_strategy_name?.length);
        }

        compData.value = sortHandle(filterdata);
    });

    // 重置
    const resetHandle = () => {
        Object.assign(searchData, {
            keyword: '',
            isOnline: false,
            rely: undefined,
            suggest: [],
            projectStra: false,
            compStra: '',
            basis: undefined,
            compUse: undefined,
        });
    };

    return {
        showPath,
        checkTamperFile,
        searchData,
        resetHandle,
    };
};
