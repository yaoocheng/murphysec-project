import {
    ref, watch, computed, reactive, h, nextTick,
} from 'vue';
import { ElMessage } from 'element-plus';
import { getReleaseApi, getIssueApi, getCompApi } from 'api/project';
import {
    getFixRangeApi, changeFixPlanVersionApi, getFixPlanVersionListApi, getFixPlanApi, changeFixRangeApi, getFixPlanVersionInfoApi,
} from '@/api/detail';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { showMessage } from '@/utils/tools';

// 修复状态
export const fixState = reactive({
    issueInfo: {} as any,

    // 范围
    fixRange: {
        loadingMessage: null as any,
        errorMessage: null as any,
        successMessage: null as any,
        curFixRange: {} as any, // 当前选中范围
        fixRangeDialogVisible: false,
        payload: {}, // 请求参数
        actions: {
            // 获取当前修复范围
            async getFixRange() {
                try {
                    const { data } = await getFixRangeApi({
                        security_id: fixState.issueInfo.id,
                    });
                    fixState.fixRange.curFixRange = data;
                } catch (error) {
                    console.error('获取修复目标范围失败:', error);
                }
            },

            // 提交修复范围
            async changeFixRange(payload: any = null) {
                fixState.fixRange.fixRangeDialogVisible = false;
                fixState.fixRange.payload = payload || fixState.fixRange.payload;
                fixState.fixRange.loadingMessage = ElMessage({
                    customClass: 'message_loading',
                    message: '修复目标正在更新中，请耐心等待…',
                    icon: LoadingComponent,
                    duration: 0,
                });
                try {
                    await changeFixRangeApi(fixState.fixRange.payload);
                    fixState.fixRange.loadingMessage?.close();
                    fixState.fixRange.loadingMessage = null;
                    showMessage('修复目标已调整', 'success');

                    fixState.fixRange.actions.getFixRange();
                    fixState.fixPlan.actions.getFixPlan();
                    // fixState.fixRange.successMessage = ElMessage({
                    //     dangerouslyUseHTMLString: true,
                    //     message: h('div', { class: 'flex items-center text-[14px]' }, [
                    //         '修复目标已调整，刷新查看「漏洞修复方案」',
                    //         h('span', {
                    //             class: 'text-[14px] text-primary cursor-pointer ml-8',
                    //             onClick: () => {
                    //                 fixState.fixRange.actions.getFixRange();
                    //                 fixState.fixPlan.actions.getFixPlan();
                    //                 fixState.fixRange.successMessage.close();
                    //                 fixState.fixRange.successMessage = null;
                    //             },
                    //         }, '刷新'),
                    //     ]),
                    //     type: 'success',
                    //     showClose: false,
                    //     duration: 0,
                    // });
                } catch (error) {
                    fixState.fixRange.loadingMessage?.close();
                    fixState.fixRange.loadingMessage = null;
                    fixState.fixRange.errorMessage = ElMessage({
                        message: h('div', { class: 'flex items-center text-[14px]' }, [
                            '由于网络错误、服务异常等原因，修复目标调整失败',
                            h('span', {
                                class: 'text-[14px] text-primary cursor-pointer ml-8',
                                onClick: () => {
                                    fixState.fixRange.actions.changeFixRange();
                                    fixState.fixRange.errorMessage?.close();
                                    fixState.fixRange.errorMessage = null;
                                },
                            }, '重试'),
                        ]),
                        type: 'error',
                        showClose: true,
                        duration: 0,
                        onClose: () => {
                            fixState.fixRange.errorMessage?.close();
                            fixState.fixRange.errorMessage = null;
                        },
                    });
                }
            },
        },
    },

    // 修复方案相关
    fixPlan: {
        curFixPlan: {} as any,
        fixVulns: [] as any[],
        checkNoUpdate: false,
        actions: {
            // 当前修复方案
            async getFixPlan() {
                try {
                    const { data } = await getFixPlanApi({
                        security_id: fixState.issueInfo.id,
                    });
                    fixState.fixPlan.curFixPlan = data;
                    fixState.fixPlan.curFixPlan.is_include_upgrade = data.fix_plan_detail?.fixed_vulns?.some((item: any) => item.fixed_by_upgrade);

                    fixState.fixPlan.fixVulns = data.fix_plan_detail?.fixed_vulns?.filter((item: any) => !item.fixed_by_upgrade) || [];

                    fixState.fixPlan.fixVulns.forEach((item: any) => {
                        item.activePCard = 0;
                        item.fix_steps.forEach((ele: any) => {
                            ele.steps.forEach((_: any) => {
                                _.activeSCard = 0;
                            });
                        });
                    });

                    // 初始化时是否是非升级方案
                    const suggestVersion = fixState.fixPlan.curFixPlan.fix_plan_suggest_version;
                    const selectVersion = fixState.fixPlan.curFixPlan.fix_plan_select_version;
                    const currentVersion = fixState.issueInfo.comp_version;
                    fixState.fixPlan.checkNoUpdate = suggestVersion === currentVersion || selectVersion === currentVersion;

                    if (fixState.fixPlan.curFixPlan.fix_plan_suggest_version) {
                        fixState.fixPlan.actions.compatibilityProblem(fixState.fixPlan.curFixPlan.fix_plan_suggest_version);
                    }
                } catch (error) {
                    console.error('获取修复方案失败:', error);
                }
            },
            // 仅使用非升级修复方案
            async useNotUpgradeFixPlan(checked: boolean) {
                if (checked) {
                    try {
                        await changeFixPlanVersionApi({
                            security_id: fixState.issueInfo.id,
                            fix_plan_version: fixState.issueInfo.comp_version,
                        });
                        fixState.fixPlan.actions.getFixPlan();
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    try {
                        await changeFixRangeApi({
                            security_id: fixState.issueInfo.id,
                            mps_high_suggest: fixState.fixRange.curFixRange?.mps_high_suggest,
                            mps_list: fixState.fixRange.curFixRange?.mps_list,
                        });
                        fixState.fixRange.actions.getFixRange();
                        fixState.fixPlan.actions.getFixPlan();
                    } catch (error) {
                        console.error(error);
                    }
                }
            },
            async compatibilityProblem(version: string) {
                try {
                    const { data: compData } = await getCompApi({
                        ...fixState.issueInfo,
                        project_id: fixState.issueInfo.project_id,
                        subtask_id: fixState.issueInfo.subtask_id,
                        compatibleTargetVersion: version,
                    });

                    const { data: targetData } = await getReleaseApi({
                        ...fixState.issueInfo,
                        compatibleTargetVersion: version,
                    });

                    const { data: issueData } = await getIssueApi({
                        ...fixState.issueInfo,
                        compatibleTargetVersion: version,
                    });
                    fixState.fixPlan.curFixPlan.compatibility_problem = targetData?.length || issueData?.length || compData?.version_compat_list?.length;
                } catch (error) {
                    console.log(error);
                }
            },
        },
    },
});

// 修复范围
export const useIssueFixRange = () => {
    const checkAllRange = ref(false); // 全部范围
    const checkCustomRange = ref(false); // 自定义范围
    const searchKeyword = ref('');
    const selectedVulns = ref<string[]>([]); // 漏洞ID列表
    const cacheSelectedVulns = ref<string[]>([]);
    const filteredVulnList = ref<any[]>([]); // 过滤后列表
    const vulnTotal = ref<number>(0);

    const levelList = ref([
        { label: '强烈建议修复', value: 'StrongRecommend', checked: false },
        { label: '建议修复', value: 'Recommend', checked: false },
        { label: '严重', value: 'Critical', checked: false },
        { label: '高危', value: 'High', checked: false },
    ]);

    const vuln = fixState.issueInfo?.comp_info?.effects || [];
    vulnTotal.value = vuln.length;

    const levelWeight: Record<string, number> = {
        Critical: 4,
        High: 3,
        Medium: 2,
        Low: 1,
    };

    const sortVuln = [...vuln].sort((a, b) => {
        const weightA = levelWeight[a.full_vuln_data.level] || 0;
        const weightB = levelWeight[b.full_vuln_data.level] || 0;
        return weightB - weightA;
    }).map((item: any) => ({
        ...item,
        checked: false,
    }));

    filteredVulnList.value = sortVuln;

    /**
     * 滤漏洞列表
     */
    const filterVulnByKeyword = () => {
        const keyword = searchKeyword.value;
        if (!keyword) {
            filteredVulnList.value = sortVuln;
            return;
        }
        const searchKey = keyword.toLowerCase();
        filteredVulnList.value = sortVuln.filter((item: any) => {
            const mpsId = item.mps_id?.toLowerCase();
            const cveId = item.full_vuln_data?.cve_id?.toLowerCase();
            return mpsId === searchKey || cveId === searchKey;
        });
    };

    watch(searchKeyword, () => {
        filterVulnByKeyword();
    });

    /**
     * 重置选中状态
     */
    const clearSelectedVulns = () => {
        selectedVulns.value = [];
        filteredVulnList.value.forEach((item: any) => {
            item.checked = false;
        });
    };

    const handleAllRangeClick = () => {
        checkAllRange.value = !checkAllRange.value;
        if (checkAllRange.value) {
            checkCustomRange.value = false;
            // eslint-disable-next-line no-return-assign
            levelList.value.forEach((item: any) => item.checked = false);
            clearSelectedVulns();
        }
    };

    /**
     * 自定义范围
     */
    const handleCustomRangeClick = () => {
        checkCustomRange.value = !checkCustomRange.value;
        if (checkCustomRange.value) {
            checkAllRange.value = false;
            // eslint-disable-next-line no-return-assign
            levelList.value.forEach((item: any) => item.checked = false);
        }
    };

    /**
     * 切换选中状态
     */
    const toggleLevel = (item: any) => {
        item.checked = !item.checked;
        if (item.checked) {
            checkAllRange.value = false;
            checkCustomRange.value = false;
            clearSelectedVulns();
        }
    };

    /**
     * 处理漏洞选择
     */
    const handleVulnSelect = (item: any) => {
        if (item.checked) {
            selectedVulns.value.push(item.mps_id);
        } else {
            const index = selectedVulns.value.indexOf(item.mps_id);
            if (index > -1) {
                selectedVulns.value.splice(index, 1);
            }
        }
    };

    // 初始化选中
    const initFixRangeSelection = () => {
        if (fixState.fixRange.curFixRange.mps_high_suggest.includes('all')) {
            handleAllRangeClick();
        } else if (fixState.fixRange.curFixRange.mps_high_suggest.includes('custom')) {
            handleCustomRangeClick();
            selectedVulns.value = fixState.fixRange.curFixRange.mps_list || [];
            filteredVulnList.value.forEach((item) => {
                item.checked = selectedVulns.value.includes(item.mps_id);
            });
        } else {
            levelList.value.forEach((item) => {
                if (fixState.fixRange.curFixRange.mps_high_suggest.includes(item.value)) {
                    toggleLevel(item);
                }
            });
        }
    };

    /**
     * 处理确认按钮点击事件
     */
    const handleConfirmRange = async (closeFn: Function) => {
        let rangeType: string[] = [];
        let vulnIds: string[] = [];

        if (checkAllRange.value) {
            rangeType = ['all'];
        } else if (checkCustomRange.value) {
            rangeType = ['custom'];
            vulnIds = selectedVulns.value;
        } else {
            // 获取选中的等级
            const selectedLevels = levelList.value
                .filter((item) => item.checked)
                .map((item) => item.value);
            rangeType = selectedLevels;
        }
        if (rangeType[0] === 'custom' && !vulnIds.length) {
            showMessage('请选择漏洞', 'warning');
            return;
        }
        // 提交修复范围
        fixState.fixRange.actions.changeFixRange({
            security_id: fixState.issueInfo.id,
            mps_high_suggest: rangeType,
            mps_list: vulnIds,
        });
        closeFn();
    };

    return {
        checkAllRange,
        checkCustomRange,
        levelList,
        searchKeyword,
        filteredVulnList,
        selectedVulns,
        vulnTotal,
        cacheSelectedVulns,
        initFixRangeSelection,
        handleAllRangeClick,
        handleCustomRangeClick,
        toggleLevel,
        handleVulnSelect,
        filterVulnByKeyword,
        handleConfirmRange,
    };
};

// 其他方案
export const useIssueFixPlan = () => {
    const planType = ref(-1); // 1-推荐，2-最新，3-当前使用
    const selectVersion = ref<string>('');
    const selectVersionVulnNum = ref<any>({});
    const currentPage = ref(1);
    const pageSize = ref(10);
    const expandRepair = ref(false);
    const expandNoUpdateRepair = ref(false);
    const expandNotReapir = ref(false);
    const versionList = ref<any[]>([]);
    const versionKind = ref<any>({});
    const curVersionInfo = ref<any>({});
    const isShowCompatibleModal = ref<boolean>(false);
    const allVulnModal = ref<boolean>(false);

    // 获取其他版本列表
    const getVersionList = async () => {
        try {
            const { data } = await getFixPlanVersionListApi({
                security_id: fixState.issueInfo.id,
                comp_name: fixState.issueInfo.comp_name,
                comp_version: fixState.issueInfo.comp_version,
                ecosystem: fixState.issueInfo?.comp_info?.ecosystem,
                repository: fixState.issueInfo?.comp_info?.repository,
            });
            versionKind.value = {
                ...data,
                list: null,
            };
            versionList.value = data.list.map((item: any) => ({
                ...item,
                selected: false,
            }));
            // 初始化选中版本
            selectVersion.value = data.fix_plan_select_version || data.fix_plan_suggest_version || data.comp_version;

            // 根据选中版本设置planType
            if (selectVersion.value === data.fix_plan_select_version
                && selectVersion.value !== data.fix_plan_suggest_version
                && selectVersion.value !== data.latest_version
                && selectVersion.value !== data.comp_version
            ) {
                planType.value = 4;
            } else if (selectVersion.value === data.fix_plan_suggest_version) {
                planType.value = 1;
            } else if (selectVersion.value === data.latest_version) {
                planType.value = 2;
            } else if (selectVersion.value === data.comp_version) {
                planType.value = 3;
            } else {
                planType.value = -1;
            }

            // eslint-disable-next-line no-use-before-define
            watchPlanType(planType.value);

            // 初始化当前选择版本的详情信息
            // eslint-disable-next-line no-use-before-define
            changeVersionHandle(selectVersion.value);
        } catch (error) {
            console.error('获取版本列表失败:', error);
        }
    };

    getVersionList();

    const changeVersionHandle = async (version: string, isChangePlanType:boolean = true) => {
        selectVersion.value = version;
        try {
            const { data: versionInfo } = await getFixPlanVersionInfoApi({
                security_id: fixState.issueInfo.id,
                select_version: version,
            });
            curVersionInfo.value = versionInfo;

            // 根据选中版本设置planType
            if (isChangePlanType) {
                if (version === versionKind.value.fix_plan_select_version
                    && version !== versionKind.value.fix_plan_suggest_version
                    && version !== versionKind.value.latest_version
                    && version !== versionKind.value.comp_version) {
                    planType.value = 4;
                } else if (version === versionKind.value.fix_plan_suggest_version) {
                    planType.value = 1;
                } else if (version === versionKind.value.latest_version) {
                    planType.value = 2;
                } else if (version === versionKind.value.comp_version) {
                    planType.value = 3;
                } else {
                    planType.value = -1;
                }
            }

            const vulnCount: any = {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
            };
            versionInfo.all_vulns?.forEach((vuln: any) => {
                if (vuln.info?.level) {
                    vulnCount[vuln.info.level.toLowerCase()] += 1;
                }
            });
            selectVersionVulnNum.value = vulnCount;
        } catch (error) {
            console.error(error);
        }
    };

    const currentPageData = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return versionList.value.slice(start, end);
    });

    const tagMap = {
        1: 'fix_plan_suggest_version',
        2: 'latest_version',
        3: 'comp_version',
        4: 'fix_plan_select_version',
    };

    const watchPlanType = (newValue: any) => {
        const targetTag = tagMap[newValue as keyof typeof tagMap];
        const targetIndex = versionList.value.findIndex((item) => item.version === versionKind.value[targetTag]);

        if (targetIndex !== -1) {
            // 计算所在的页码
            const targetPage = Math.floor(targetIndex / pageSize.value) + 1;
            currentPage.value = targetPage;

            selectVersion.value = versionList.value[targetIndex].version;

            nextTick(() => {
                // 定位到目标数据
                document.getElementsByClassName(selectVersion.value)[0].scrollIntoView(true);
                changeVersionHandle(selectVersion.value, false);
            });
        }
    };

    // 监听planType变化，自动定位到对应tag的数据
    // watch(planType, (newValue) => {
    //     watchPlanType(newValue);
    // });

    /**
     * 处理页码改变事件
     */
    const handlePageChange = (page: number) => {
        currentPage.value = page;
    };

    // 提交修改
    const submitVersionChange = async () => {
        try {
            await changeFixPlanVersionApi({
                security_id: fixState.issueInfo.id,
                fix_plan_version: selectVersion.value,
            });
            showMessage('应用成功', 'success');
            fixState.fixPlan.actions.getFixPlan();
        } catch (error) {
            console.error(error);
        }
    };

    // 升级修复漏洞列表
    const upgradeFixedVulns = computed(() => curVersionInfo.value?.fixed_vulns?.filter((item: any) => item.fixed_by_upgrade) || []);

    // 非升级修复漏洞列表
    const nonUpgradeFixedVulns = computed(() => curVersionInfo.value?.fixed_vulns?.filter((item: any) => !item.fixed_by_upgrade) || []);

    return {
        planType,
        selectVersion,
        currentPage,
        pageSize,
        versionList,
        currentPageData,
        expandRepair,
        versionKind,
        expandNoUpdateRepair,
        expandNotReapir,
        curVersionInfo,
        isShowCompatibleModal,
        upgradeFixedVulns,
        nonUpgradeFixedVulns,
        allVulnModal,
        selectVersionVulnNum,
        watchPlanType,
        handlePageChange,
        changeVersionHandle,
        submitVersionChange,
    };
};
