<template>
    <div class="g-bdr-6 g-bg-f7 g-p-16">
        <div class="g-flex-between">
            <div class="g-flex g-align-center">
                <!-- <el-tooltip content="刷新列表">
                    <span @click="changeTeamIdHandle('')" class="g-mr-16 g-cursor-pointer">
                        <i class="murphy icon-shuaxin1"></i>
                    </span>
                </el-tooltip> -->

                <div class="g-mr-8">
                    <el-select style="width: 180px" :disabled="refreshLoading" v-model="detectInfo.team_config_id"
                               @change="changeTeamIdHandle">
                        <el-option
                            v-for="item in store.allAccessInfo.nexus.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                            :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <SearchComp @change="searchList" placeholder="输入制品名称回车搜索" v-model="keyword" @clear="handleClear"
                            clearable />
            </div>
        </div>

        <div class="g-bg-ff g-bdr-6 g-mt-16">
            <div class="project-content g-flex">
                <div class="part g-f-15" style="padding: 0;" v-show="hideTree">
                    <div style="border-bottom: 1px solid #EBEBEB;"
                         class="g-pb-12 g-mb-12 g-flex g-justify-between g-pl-16 g-pr-16 g-pt-16">
                        <span class="g-color-1 g-fw-500">仓库列表</span>
                        <!-- <span class="g-color-3 g-cursor-pointer g-flex g-align-center">
                            <el-tooltip content="同步仓库列表">
                                <i @click="refreshHandle" class="murphy icon-shuaxin g-mr-16 g-f-18"></i>
                            </el-tooltip>
                            <el-tooltip v-if="!isCheckbox" content="批量更新">
                                <i @click="isCheckbox = true" class="murphy icon-xingzhuang1"></i>
                            </el-tooltip>
                            <el-button @click="isCheckbox = false; nowSelectTree = []; allCheck = false; updateTree();"
                                       v-else class="minor_white_btn g-f-12" style="width: 40px; height: 24px;">退出</el-button>
                        </span> -->
                    </div>

                    <!-- <SelectComp @change="updateTree()" clearable
                                style="margin-right: 0;padding: 0 16px;box-sizing: border-box;margin-bottom: 8px;"
                                v-model="repoType" :options="options" placeholder="仓库类型" /> -->

                    <div class="g-pl-16 h-[86%]" style="overflow: auto;">
                        <el-tree v-if="hideTree" ref="treeRef" @node-click="treeNodeClick" :props="props"
                                 :load="loadTreeNode" node-key="url" lazy>
                            <template #default="{ node, data }">
                                <div style="display: inline-block;vertical-align: -2px;">
                                    <img v-if="node.level===1||data.type === 'folder'||(data.type === 'asset'&&!data.leaf)" class="g-vertical--1" src="~ast/img/dir-icon.png"
                                         alt="">
                                    <img v-else style="width: 22px;" class="file_icon g-mr-4 g-vertical--4"
                                         src="~ast/fileImg/default_file.svg" alt="">
                                    <Tooltip width="370" :content="data.name || data.text">
                                        <span class="node-name">{{ data.name || data.text }}</span>
                                    </Tooltip>

                                    <!-- <span v-if="data.repo_name && data.repo_type === 'hosted'">
                                        <el-tooltip
                                            v-if="data.status === 4 || data.status === 2 || data.status === 1 || data.status === 0"
                                            content="更新制品" placement="top">
                                            <i @click.stop="batchRefresh([data.repo_name])"
                                               class="murphy icon-shuaxin g-mr-8"></i>
                                        </el-tooltip>

                                        <el-tooltip v-if="data.status === 3" content="取消更新" placement="top">
                                            <span @click.stop="cancelRefresh([data.repo_name])"
                                                  class="loader  g-mr-8"></span>
                                        </el-tooltip>

                                        <i v-if="data.status === 2" class="murphy icon-duihao"
                                           style="color: #38C728"></i>
                                    </span> -->

                                    <el-tooltip v-if="data.type !== 'hosted'&&data.repo_info?.type!== 'hosted'" placement="top"
                                                content="仅支持对 Hosted 类型的仓库检测">
                                        <i class="murphy icon-tishishuoming g-f-15" style="color: #FF9940;"></i>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-tree>
                    </div>

                    <!-- <div v-if="isCheckbox" class="g-flex g-justify-between g-align-center all-check">
                        <el-checkbox v-model="allCheck" @change="setCheckedKeys" label="全选" size="large" />
                        <el-button :disabled="!nowSelectTree.length" @click="batchRefresh(nowSelectTree)"
                                   style="height: 28px;width: 64px;font-size: 12px;">更新制品</el-button>
                    </div> -->
                </div>

                <div class="g-flex-grow-1 flex gap-2 g-p-12"  v-loading="loading">
                    <div class="g-flex-grow-1 w-0">
                        <div v-if="repoInfo">
                            <div class="g-color-1 g-fw-500 g-mb-16">
                                仓库信息
                            </div>
                            <div class="g-p-16 g-bg-f7 g-bdr-6 g-mb-16">
                                <div class="g-color-1 g-mb-12">
                                    {{ repoInfo?.name }}
                                </div>
                                <div class="g-flex gap-6 g-fw-400 g-color-1">
                                    <span>仓库类型：{{ repoInfo?.type }}</span>
                                    <span>包类型：{{ repoInfo?.format }}</span>
                                    <!-- <span>制品更新状态：{{ repoStatus.get(repoInfo.status) }}</span>
                                <span>更新时间：{{ formatDate(repoInfo.updated_at) }}</span> -->
                                </div>
                            </div>
                        </div>

                        <div v-if="listData.length">
                            <div class="g-fw-500 g-color-1 g-f-14 g-mb-12">
                                制品信息
                            </div>

                            <div class="g-flex">
                                <div class="g-flex-grow-1 w-0 g-mr-16">
                                    <div class="g-color-3 g-fw-500 g-mb-16">
                                        制品列表（{{ listData.length }}）
                                    </div>
                                    <vxe-table ref="tableRef" @checkbox-change="checkData"
                                               :checkbox-config="{ labelField: 'name', showHeader: false }" :cell-style="{ lineHeight: '48px' }"
                                               :header-cell-style="{ height: '48px', background: '#F7F8FB', fontWeight: 400, color: '#8F959E' }"
                                               :row-style="{ background: '#fff' }" :row-config="{ height: 48 }" min-height="48"
                                               max-height="390" :scroll-y="{ enabled: true }" show-overflow border="inner"
                                               :round="true" :data="listData">

                                        <vxe-column min-width="240" type="checkbox" title="项目名称">
                                            <template #default="{ row }">
                                                {{ row.name }}
                                            </template>
                                        </vxe-column>

                                        <vxe-column min-width="120" title="包管理器类型">
                                            <template #default="{ row }">
                                                {{ row.format }}
                                            </template>
                                        </vxe-column>

                                        <vxe-column min-width="100" title="版本">
                                            <template #default="{ row }">
                                                {{ row.version || '-' }}
                                            </template>
                                        </vxe-column>
                                        <vxe-column min-width="240" title="路径">
                                            <template #default="{ row }">
                                                {{ row.path }}
                                            </template>
                                        </vxe-column>
                                    </vxe-table>

                                    <!-- <div v-if="!listData.length">
                                <NoData :description="keyword ? '暂无搜索结果' : '暂无内容'" />
                                <div v-if="!keyword" class="g-f-14 g-fw-400 g-color-3"
                                     style="text-align: center;">
                                    制品列表待更新或更新中，更新后可选择制品进行检测</div>
                            </div> -->
                                </div>

                            </div>
                        </div>

                        <div  v-else class="mt-[8%]">
                            <NoData  />
                            <p class="text-center mt-[-8px]" v-if="!issearch&&!repoInfo">请点击左侧仓库列表，选择制品进行检测</p>
                        </div>
                    </div>

                    <div class="g-flex-grow-1 w-0 overflow-auto pl-2" style="border-left: 1px solid #EBEBEB;" v-show="selectedData.length">
                        <div class="g-color-3 g-fw-500 g-mb-16">
                            已选制品（{{ selectedData.length }}）
                        </div>

                        <vxe-table :cell-style="{ lineHeight: '48px' }"
                                   :header-cell-style="{ height: '48px', background: '#F7F8FB', fontWeight: 400, color: '#8F959E' }"
                                   :row-style="{ background: '#fff' }" :row-config="{ height: 48 }" min-height="48"
                                   max-height="390" :show-header="true" :scroll-y="{ enabled: true }" show-overflow
                                   :round="true" :data="selectedData">
                            <vxe-column min-width="240" title="项目名称">
                                <template #default="{ row }">
                                    {{ row.name }}
                                </template>
                            </vxe-column>

                            <vxe-column min-width="120" title="包管理器类型">
                                <template #default="{ row }">
                                    {{ row.format }}
                                </template>
                            </vxe-column>

                            <vxe-column min-width="100" title="版本">
                                <template #default="{ row }">
                                    {{ row.version || '-' }}
                                </template>
                            </vxe-column>

                            <vxe-column min-width="240" title="路径">
                                <template #default="{ row }">
                                    {{ row.path }}
                                </template>
                            </vxe-column>

                            <vxe-column width="50" fixed="right" title="操作">
                                <template #default="{ row }">
                                    <span class="text-err cursor-pointer" @click.stop="clearCheck(row)">删除</span>
                                </template>
                            </vxe-column>
                        </vxe-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount, nextTick } from 'vue';
import store, { detectInfo } from 'util/store';
import {
    getNexusRepoTreeDataApi, getNexusRepoListApi, getNexusListApi, searchNexusListApi,
} from 'api/detect';
import { refreshLoading } from 'util/hook';
import { listData, selectedData } from '../../hooks/hook';

const tableRef = ref();
const loading = ref(false);
const treeRef = ref<any>();
const props = {
    label: 'name',
    isLeaf: 'isLeaf',
};
const keyword = ref('');
const repoInfo = ref<any>();
const issearch = ref(false);
// const repoType = ref<string>('');
// const options = [
//     {
//         value: 'hosted',
//         label: 'hosted',
//     },
//     {
//         value: 'proxy',
//         label: 'proxy',
//     },
//     {
//         value: 'group',
//         label: 'group',
//     },
// ];

onBeforeMount(() => {
    listData.value = [];
    selectedData.value = [];
});

// 全选
// const setCheckedKeys = (value: boolean) => {
//     if (value) {
//         treeRef.value.setCheckedKeys(allTreeData.value, false);
//         nowSelectTree.value = allTreeData.value;
//     } else {
//         treeRef.value.setCheckedKeys([], false);
//         nowSelectTree.value = [];
//     }
// };

// tree select
// const checkTreeHandle = (nodes: any, data: any) => {
//     nowSelectTree.value = data.checkedKeys;
//     allCheck.value = allTreeData.value?.length === data.checkedKeys?.length;
// };

// 列表请求参数
const reqData = ref<any>({
    asset_id: '',
    component_id: '',
    repo_info: {},
    team_id: store.teamInfo.team_id,
    team_config_id: detectInfo.team_config_id, // 默认当前接入第一个
});

// 更新树
const hideTree = ref(true);
const updateTree = () => {
    hideTree.value = false;
    const timer = setTimeout(() => {
        hideTree.value = true;
        clearTimeout(timer);
    }, 100);
};

// 处理搜索框清空事件
const handleClear = () => {
    keyword.value = '';
    updateTree();
    listData.value = [];
    hideTree.value = true;
    issearch.value = false;
};

// 选择配置ID
const changeTeamIdHandle = (value: string) => {
    reqData.value.team_config_id = value || reqData.value.team_config_id;
    detectInfo.team_config_id = value || detectInfo.team_config_id;
    updateTree();
    listData.value = [];
    selectedData.value = [];
    // rollRefresh(reqData, updateTree);
};

const searchList = async () => {
    if (!keyword.value) return;
    loading.value = true;
    listData.value = [];
    repoInfo.value = null;
    hideTree.value = false;
    issearch.value = true;
    try {
        const { data } = await searchNexusListApi({
            team_id: store.teamInfo.team_id,
            team_config_id: detectInfo.team_config_id,
            keyword: keyword.value,
        });
        listData.value = data.list || [];
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

// 列表
const getListData = async () => {
    loading.value = true;
    try {
        // listData.value = [];
        const { data } = await getNexusListApi(reqData.value);
        listData.value = [data];
        nextTick(() => {
            loading.value = false;
        });
    } catch (error) {
        console.log(error);
    }
};

// 懒加载树
const loadTreeNode = async (node: any, resolve: Function) => {
    if (node.data?.length === 0) {
        // 仓库
        const { data } = await getNexusRepoListApi({
            team_config_id: detectInfo.team_config_id,
            team_id: store.teamInfo.team_id,
        });
        resolve(data);
    } else {
        // tree
        const { data } = await getNexusRepoTreeDataApi({
            team_id: store.teamInfo.team_id,
            team_config_id: detectInfo.team_config_id,
            parent_directory: node.data?.id || '/',
            repo_info: node.data?.repo_info || node.data,
        });
        data.list?.forEach((item: any) => {
            item.repo_info = data.repo_info;
            item.isLeaf = item.leaf;
        });
        resolve(data.list || []);
    }
};

const treeNodeClick = (data: any) => {
    listData.value = [];
    repoInfo.value = data.repo_info || data;
    if (data.type === 'asset') {
        reqData.value.asset_id = data.asset_id;
        reqData.value.component_id = data.component_id;
        reqData.value.repo_info = data.repo_info;
        getListData();
    }
};

// 点击同步更新
// const refreshHandle = async () => {
//     try {
//         await refreshRepoListApi({
//             team_id: store.teamInfo.team_id,
//             access_type: 'nexus',
//             team_config_id: detectInfo.team_config_id,
//         });
//         updateTree();
//     } catch (error) {
//         console.log(error);
//     }
// };

// 单个更新
// const batchRefresh = async (repoNames: string[]) => {
//     try {
//         await batchRefreshRepoApi({
//             access_type: 'nexus',
//             team_config_id: detectInfo.team_config_id,
//             team_id: store.teamInfo.team_id,
//             repo_names: repoNames,
//         });
//         isCheckbox.value = false;
//         nowSelectTree.value = [];
//         allCheck.value = false;
//         updateTree();
//     } catch (error) {
//         console.log(error);
//     }
// };

// 取消单个更新
// const cancelRefresh = async (repoNames: string[]) => {
//     try {
//         await cancelRefreshRepoApi({
//             access_type: 'nexus',
//             team_config_id: detectInfo.team_config_id,
//             team_id: store.teamInfo.team_id,
//             repo_names: repoNames,
//         });
//         isCheckbox.value = false;
//         nowSelectTree.value = [];
//         allCheck.value = false;
//         updateTree();
//     } catch (error) {
//         console.log(error);
//     }
// };

// 全选和取消选择
// const checkAll = (data: any) => {
//     if (data.checked) {
//         // 对数据进行去重处理
//         const newRecords = data.records.filter((record: any) => !selectedData.value.some((selected: any) => selected.id === record.id));
//         selectedData.value = [...selectedData.value, ...newRecords];
//     } else {
//         selectedData.value = [];
//     }
// };
const checkData = (data: any) => {
    if (data.checked) {
        // 对数据进行去重处理
        const newRecords = data.records.filter((record: any) => !selectedData.value.some((selected: any) => selected.id === record.id));
        selectedData.value = [...selectedData.value, ...newRecords];
    } else {
        // 取消选择时从selectedData中移除
        selectedData.value = selectedData.value.filter((selected: any) => data.row.id !== selected.id);
    }
};

// 清除
const clearCheck = (row: any) => {
    tableRef.value?.toggleCheckboxRow(row, false);
    selectedData.value = selectedData.value.filter((ele) => ele.id !== row.id);
};
</script>

<style lang="less">
.project-content {
    .el-tree-node__content {
        display: inline-block !important;
        padding-right: 16px;
    }

    .el-tree-node__children {
        overflow: initial !important;
    }
}
</style>

<style scoped lang='less'>
.project-content {
    margin-top: 8px;
    color: #858585;
    border-radius: 6px;
    height: 58vh;

    .part {
        width: 22%;
        overflow: auto;
        box-sizing: border-box;
        padding: 12px;
        background-color: #fff;
        position: relative;

        .all-check {
            // position: absolute;
            // bottom: 0;
            // left: 0;
            padding: 0 16px;
            width: 100%;
            z-index: 99;
            background-color: #fff;
            box-sizing: border-box
        }

        .node-name {
            display: inline-block;
            width: 122px;
            margin-left: 4px;
            margin-right: 12px;
            .ellipsis();
        }

        &:nth-of-type(1) {
            border-right: 1px solid #F7F8FB;
            // background-color: #F7F8FB;
        }

        &:nth-of-type(2) {
            flex: 1;
            // background-color: #F7F8FB;
        }

        &:nth-of-type(3) {
            flex: 1;
            // background-color: #F7F8FB;

        }
    }
}

.more {
    &:hover {
        color: #6C87FF;
    }

    color: #858585;
    height: 46px;
    line-height: 46px;
    cursor: pointer;
    text-align: center
}

.icon {
    &:hover {
        background: #EBEBEB;
    }

    color: #3c3c3c;
    margin-right: 8px;
    padding: 7px;
    border-radius: 6px;
    cursor: pointer;
}

.project_item {
    &:hover .clear {
        opacity: 1;
    }

    .between();
    height: 48px;
    background: #FFFFFF;
    // border: 1px solid #C7C7C7;
    // border-radius: 6px;
    padding: 0 16px;
    position: relative;
    cursor: pointer;
    color: #3c3c3c;
    border-bottom: 1px solid #EFF0F1;

    .clear {
        opacity: 0;
        transition: opacity .1s linear;
        font-size: 13px;
        position: absolute;
        right: -6px;
        top: -6px;
    }

    .name {
        margin: 0 16px;
        margin-right: 0;
        .ellipsis();
    }

    .lang {
        font-size: 12px;
        background: rgba(108, 135, 255, 0.2);
        border-radius: 4px;
        padding: 3px 5px;
        color: #2946C7;
    }
}

.project_item.active_item {
    // background: rgba(108, 135, 255, 0.1);
    // border: 1px solid #6C87FF;
}
</style>
