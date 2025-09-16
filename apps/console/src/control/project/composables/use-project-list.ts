import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
    getProjectClassListApi, getHistoryListApi, getProjectTagsApi, getMavenInfoApi,
} from 'api/project';
import { showMessage } from '@/utils/tools';
import store from '@/utils/store';

interface RenameDialog {
    show: boolean;
    project_id: string;
    project_name: string;
}

interface ProjectTags {
    show: boolean;
    project_id: string;
    tags: string[];
}

interface FilterOptions {
    team_id: string;
    keyword: string;
    languages: string[];
    access_type: string[];
    projects_ids: string[];
    status: number[];
    tags: string[];
    start_time: Date | null;
    end_time: Date | null;
    ext: string;
    distribution: string | undefined;
    has_detection_strategy_project: number | undefined;
}

export async function getProjectClassList() {
    try {
        const res = await getProjectClassListApi({ team_id: store.teamInfo.team_id });
        return (res.data.list || []).map((item: any) => ({
            value: item.id,
            label: item.name,
            ...item,
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getProjectTags() {
    try {
        const res = await getProjectTagsApi({
            team_id: store.teamInfo.team_id,
        });
        return (res.data || []).map((item: any) => ({
            value: item.tag_id,
            label: item.tag_name,
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
}

export function useProjectList() {
    const router = useRouter();
    const route = useRoute();
    const activeTime = ref<Date[]>([]);
    const showMavenTipsModal = ref<boolean>(false);
    const showMavenInfo = ref<Record<string, unknown>>({});
    const adjustModal = ref<boolean>(false);
    const pid = ref<string>();
    const sid = ref<string>();
    const distributeModal = ref<boolean>(false);
    const isShowDeleteModal = ref<boolean>(false);
    const deleteType = ref<number>(1);
    const deleteId = ref<string>('');
    const isShowAddClassModal = ref<boolean>(false);
    const taskId = ref<string>('');
    const showDetectBtnTypes = ['gitlabwebhook', 'github', 'gitlab', 'gerrit', 'bitbucket', 'coding', 'folib'];
    const renameDialog = ref<RenameDialog>({
        show: false,
        project_id: '',
        project_name: '',
    });
    const showAddProjectTags = ref<ProjectTags>({
        show: false,
        project_id: '',
        tags: [],
    });
    const projectTags = ref<any[]>([]);
    const projectClassOptions = ref<any[]>([]);

    const filterOptions = ref<FilterOptions>({
        team_id: store.teamInfo.team_id,
        keyword: '',
        languages: [],
        access_type: [],
        projects_ids: route.query.class as string ? [route.query.class as string] : [],
        status: [],
        tags: [],
        start_time: null,
        end_time: null,
        distribution: undefined,
        ext: '',
        has_detection_strategy_project: 0,
    });

    const changeTime = (val: any) => {
        if (val) {
            [filterOptions.value.start_time, filterOptions.value.end_time] = val;
        } else {
            filterOptions.value.start_time = null;
            filterOptions.value.end_time = null;
        }
    };

    const openMaven = async (id: string) => {
        try {
            const { data } = await getMavenInfoApi(id || '0');
            showMavenInfo.value = data;
            showMavenTipsModal.value = true;
        } catch (error) {
            console.log(error);
        }
    };

    // 历史记录
    const expandHandle = async (item: any) => {
        if (!item.history) {
            try {
                const res = await getHistoryListApi({
                    project_id: item.id,
                    limit: 5,
                    page: 1,
                    team_id: store.teamInfo.team_id,
                });
                item.history = res.data.list || [];
                item.created_at = item.history[0]?.created_at;
            } catch (error) {
                console.log(error);
            }
        }
        item.expand = !item.expand;
    };

    // 再次检测
    // eslint-disable-next-line no-shadow
    const restartDetectHandle = async (id: string, status: boolean, type: string, sid:string) => {
        if (!showDetectBtnTypes.includes(type)) return;
        if (!status) {
            showMessage('项目正在检测中', 'warning');
            return;
        }
        router.push(`/detect-config?from=${type}&id=${id}&type=restart&sid=${sid}`);
    };

    // 删除传值
    const deleteDetectList = (index: number, id: string) => {
        if (index === 0) {
            showMessage('最近一次检测报告无法删除', 'warning');
            return;
        }
        isShowDeleteModal.value = true;
        deleteId.value = id;
        deleteType.value = 2;
    };

    // 重置筛选
    const resetHandle = () => {
        activeTime.value = [];
        Object.assign(filterOptions.value, {
            keyword: '',
            access_type: [],
            projects_ids: [],
            status: [],
            languages: [],
            tags: [],
            start_time: null,
            end_time: null,
            has_detection_strategy_project: 0,
            distribution: undefined,
            team_id: store.teamInfo.team_id,
        });
    };

    // 自定义项目名
    const modifyNameHadle = (id: string, name: string) => {
        Object.assign(renameDialog.value, {
            show: true,
            project_id: id,
            project_name: name,
        });
    };

    const openAddTagModal = (item: any) => {
        showAddProjectTags.value.project_id = item.id;
        showAddProjectTags.value.show = true;
    };

    return {
        router,
        route,
        activeTime,
        showMavenTipsModal,
        showMavenInfo,
        adjustModal,
        pid,
        sid,
        distributeModal,
        isShowDeleteModal,
        deleteType,
        deleteId,
        isShowAddClassModal,
        taskId,
        showDetectBtnTypes,
        renameDialog,
        showAddProjectTags,
        projectTags,
        projectClassOptions,
        filterOptions,
        changeTime,
        openMaven,
        expandHandle,
        restartDetectHandle,
        deleteDetectList,
        resetHandle,
        modifyNameHadle,
        openAddTagModal,
    };
}
