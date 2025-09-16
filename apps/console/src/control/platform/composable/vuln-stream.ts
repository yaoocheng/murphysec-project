import { ref, nextTick } from 'vue';
import { getRealUseCodeApi } from 'api/asset';

export default (subtask_id:string, project_id: string) => {
    // eslint-disable-next-line no-undef
    const streamData = ref<Array<dataStream>>([]);
    const activeCodeFragment = ref<string>('');
    const activeCodeTab = ref<string>('');
    const editableTabs = ref<Array<any>>([]);
    const showCode = ref<Array<string>>(['']);
    const activeRightContent = ref<string>('1');
    const streamNum = ref<number>(1);
    const dangerCodeLine = ref<number>(0);

    // 代码获取
    const getShowCode = async (filePath: any) => {
        const { data } = await getRealUseCodeApi({
            file_path: filePath,
            project_id,
            subtask_id,
        });
        showCode.value = data?.content?.split('\n');
    };

    // 定位代码
    const positionDangerCode = (dangerLine: number, pid: string) => {
        const timer = setTimeout(() => {
            const codeScrollEle = document.getElementsByClassName(`code-content-${pid}`)[0] as HTMLElement;
            const dangerCodeLineEle = document.querySelector(`.code-content-${pid} .code-line-${dangerLine}`) as HTMLElement;

            if (codeScrollEle && dangerCodeLineEle) {
                codeScrollEle.scrollTo({
                    top: dangerCodeLineEle.offsetTop - codeScrollEle.clientHeight / 2,
                    behavior: 'smooth',
                });
            }
            clearTimeout(timer);
        }, 600);
    };

    // 查看代码
    const addTab = async (data: any) => {
        activeRightContent.value = '1';
        dangerCodeLine.value = data.line;

        if (editableTabs.value.some((item: any) => item.name === data.pid)) {
            await getShowCode(data.file_path);

            activeCodeTab.value = data.pid;

            nextTick(() => {
                positionDangerCode(dangerCodeLine.value, data.pid);
            });
            return;
        }

        editableTabs.value.push({
            title: data.file_name,
            filePath: data.file_path,
            name: data.pid,
        });
        await getShowCode(data.file_path);

        activeCodeTab.value = data.pid;

        nextTick(() => {
            positionDangerCode(dangerCodeLine.value, data.pid);// 定位
        });
    };

    // 定位到当前页的数据流
    const activeCurStreamList = (curId: string) => {
        streamNum.value = +curId.split('-')[0] + 1;
    };

    // 更新
    const updateActiveCode = async (targetTabPid: string) => {
        const curTabId: Array<string> = targetTabPid.split('-');

        const activeFileData = streamData.value[curTabId[0] as any].file_stream[`${curTabId[1]}` as any];

        activeCurStreamList(targetTabPid);

        const lastCodeData = activeFileData.code_list[0];

        activeCodeFragment.value = lastCodeData.id;

        await getShowCode(lastCodeData.file_path);

        dangerCodeLine.value = lastCodeData.line;

        nextTick(() => {
            positionDangerCode(lastCodeData.line, lastCodeData.pid);
        });
    };

    // 切换tab
    const tabChange = async (targetTab: any) => {
        updateActiveCode(targetTab.props.name);
    };

    // 移除文件
    const removeTab = async (targetTabPid: string) => {
        const tabs = editableTabs.value;
        let activeTabPid = activeCodeTab.value;

        // 移除的和激活的是同一个，移除后激活上一个或下一个
        if (activeTabPid === targetTabPid) {
            tabs.forEach((tab: any, index: number) => {
                if (tab.name === targetTabPid) {
                    const nextTab = tabs[index + 1] || tabs[index - 1];
                    if (nextTab) {
                        activeTabPid = nextTab.name;
                    }
                }
            });
        }

        if (activeTabPid !== activeCodeTab.value) {
            activeCodeTab.value = activeTabPid;

            updateActiveCode(activeTabPid);
        }

        editableTabs.value = tabs.filter((tab: any) => tab.name !== targetTabPid);

        if (!editableTabs.value.length) {
            activeCodeFragment.value = '';
            streamNum.value = 1;
        }
    };

    return {
        streamData,
        activeCodeFragment,
        activeCodeTab,
        editableTabs,
        showCode,
        activeRightContent,
        streamNum,
        dangerCodeLine,
        addTab,
        removeTab,
        tabChange,
    };
};
