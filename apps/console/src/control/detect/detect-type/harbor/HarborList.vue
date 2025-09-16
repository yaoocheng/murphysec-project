<template>
    <div class="g-bdr-6 g-bg-f7 g-p-16">
        <div class="g-flex-between">
            <div class="g-flex g-align-center">
                <el-tooltip content="刷新列表">
                    <span @click="changeTeamIdHandle('')" class="g-mr-16 g-cursor-pointer">
                        <i class="murphy icon-shuaxin1"></i>
                    </span>
                </el-tooltip>
                <div class="g-mr-8">
                    <el-select style="width: 180px" v-model="detectInfo.team_config_id" @change="changeTeamIdHandle">
                        <el-option
                            v-for="item in store.allAccessInfo.harbor.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                            :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <SearchComp placeholder="输入制品名称回车搜索" v-model="reqData.keyword" clearable @change="() => {
                    if (reqData.keyword) {
                        reqData.parent_directory = ''; getListData();
                    }
                }" @clear="listData = []" @input="listData = [];" />
            </div>
        </div>

        <div class="g-bg-ff g-bdr-6 g-mt-16">
            <div class="project-content g-flex">
                <div class="part g-f-15" style="padding: 0;" v-show="!reqData.keyword">
                    <div style="border-bottom: 1px solid #EBEBEB;"
                         class="g-pb-12 g-mb-12 g-flex g-justify-between g-pl-16 g-pr-16 g-pt-16">
                        <span class="g-color-1 g-fw-500">仓库列表</span>
                        <span class="g-color-3 g-cursor-pointer g-flex g-align-center">
                            <el-tooltip v-if="!refreshLoading" content="同步仓库列表">
                                <i @click="refreshHandle" class="murphy icon-shuaxin g-f-18"></i>
                            </el-tooltip>
                            <span v-else @click="cancelRefresh" class="flex items-center text-sm">
                                <span class="loader g-mr-4"></span> 取消
                            </span>
                        </span>
                    </div>

                    <div class="g-pl-16" style="height: calc(100% - 72px);overflow: auto">
                        <el-tree v-if="hideTree" ref="treeRef" @node-click="treeNodeClick" :props="props"
                                 :load="loadTreeNode" node-key="node_name" lazy>
                            <template #default="{ data }">
                                <div style="display: inline-block;vertical-align: -2px;">
                                    <img v-if="!data.is_file" class="g-vertical--1" src="~ast/img/dir-icon.png" alt="">
                                    <img v-else style="width: 22px;" class="file_icon g-mr-4 g-vertical--4"
                                         :src="getFileImg(data.node_name)" alt="">
                                    <el-tooltip :content="data.node_name" placement="top">
                                        <span class="node-name">{{ data.node_name }}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-tree>
                    </div>

                    <!-- <div v-if="isCheckbox" class="g-flex g-justify-between g-align-center all-check">
                        <el-checkbox v-model="" @change="setCheckedKeys" label="全选" size="large" />
                        <el-button :disabled="!nowSelectTree.length" @click="batchRefresh(nowSelectTree)"
                            style="height: 28px;width: 64px;font-size: 12px;">更新制品</el-button>
                    </div> -->
                </div>

                <div class="g-flex-grow-1 g-p-12" style="overflow: auto;">
                    <div v-show="!reqData.keyword && repoInfo.repo_name">
                        <div class="g-color-1 g-fw-500 g-mb-16">
                            仓库信息
                        </div>
                        <div class="g-p-16 g-bg-f7 g-bdr-6 g-mb-16">
                            <!-- <div class="g-color-1 g-mb-12">
                                {{ repoInfo.repo_name }}
                            </div> -->
                            <div class="g-flex g-fw-400 g-color-1">
                                <span class="mr-6">仓库名称：{{ repoInfo.repo_name }}</span>
                                <!-- <span>包类型：{{ repoInfo.package_type }}</span>
                                <span>制品更新状态：{{ repoStatus.get(repoInfo.status) }}</span> -->
                                <span>更新时间：{{ formatDate(repoInfo.updated_at) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="g-fw-500 g-color-1 g-f-14 g-mb-12">
                        制品信息
                    </div>

                    <div class="g-flex" v-loading="loading">
                        <div class="g-flex-grow-1 w-0">
                            <div v-if="listData.length" class="g-color-3 g-fw-500 g-mb-16">
                                制品列表（{{ listData.length }}）
                            </div>

                            <vxe-table ref="tableRef" @checkbox-all="checkAll" @checkbox-change="checkSingle"
                                       v-if="listData.length" :cell-style="{ lineHeight: '48px' }"
                                       :header-cell-style="{ height: '48px', background: '#F7F8FB', fontWeight: 400, color: '#8F959E' }"
                                       :row-style="{ background: '#fff' }" :row-config="{ height: 48 }" min-height="48"
                                       max-height="400" :scroll-y="{ enabled: true }" show-overflow border="inner"
                                       :round="true" :data="listData">
                                <!-- <vxe-column width="36">
                                    <template #header>
                                        <el-checkbox v-model="selectAllValue" @change="selectAllHandle" />
                                    </template>
                                    <template #default="{ row }">
                                        <el-checkbox @change="selectProjectHandle(row)" v-model="row.checked" />
                                    </template>
                                </vxe-column> -->

                                <vxe-column type="checkbox" title="项目名称">
                                    <template #default="{ row }">
                                        {{ row.name }}
                                    </template>
                                </vxe-column>

                                <vxe-column width="200" title="版本">
                                    <template #default="{ row }">
                                        <Tooltip :content="row.branch" :width="370">
                                            <div class="inline-block max-w-full ellipsis">{{ row.branch }}</div>
                                        </Tooltip>
                                    </template>
                                </vxe-column>
                            </vxe-table>

                            <div v-if="!listData.length">
                                <NoData :description="reqData.keyword ? '暂无搜索结果' : '暂无内容'" />
                                <div v-if="!reqData.keyword" class="mt-[-8px] g-f-14 g-fw-400 g-color-3"
                                     style="text-align: center;">
                                    制品列表待更新或更新中，更新后可选择制品进行检测</div>
                            </div>

                        </div>

                        <div class="g-flex-grow-1 ml-4 w-0" v-show="selectedData.length">
                            <div class="g-color-3 g-fw-500 g-mb-16">
                                已选制品（{{ selectedData.length }}）
                            </div>

                            <vxe-table :cell-style="{ lineHeight: '48px' }"
                                       :header-cell-style="{ height: '48px', background: '#F7F8FB', fontWeight: 400, color: '#8F959E' }"
                                       :row-style="{ background: '#fff' }" :row-config="{ height: 48 }" min-height="48"
                                       max-height="400" :show-header="false" :scroll-y="{ enabled: true }" show-overflow
                                       :round="true" :data="selectedData">
                                <vxe-column title="项目名称">
                                    <template #default="{ row }">
                                        {{ row.name }}
                                    </template>
                                </vxe-column>

                                <vxe-column width="120" title="版本">
                                    <template #default="{ row }">
                                        <Tooltip :content="row.branch" :width="370">
                                            <div class="inline-block max-w-full ellipsis">{{ row.branch }}</div>
                                        </Tooltip>
                                    </template>
                                </vxe-column>

                                <vxe-column width="50" title="操作">
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
    </div>
</template>

<script setup lang='ts'>
import {
    ref, onBeforeMount, nextTick,
} from 'vue';
import store, { detectInfo } from 'util/store';
import {
    getProjectListApi, refreshProjectApi, cancelRefreshApi,
} from 'api/project';
import {
    getRepoTreeDataApi, getRepoListApi,
} from 'api/detect';
import { rollRefresh, rollTimer, refreshLoading } from 'util/hook';
import { useRoute } from 'vue-router';
import {
    listData, selectedData,
} from '../../hooks/hook';
import { getFileImg } from '@/constants/file-icon';
import SearchComp from '@/components/SearchComp.vue';
import NoData from '@/components/NoData.vue';
import { formatDate } from '@/utils/tools';

const route = useRoute();
const loading = ref(false);
const total = ref<number>(0);
const tableRef = ref();
const treeRef = ref<any>();
const props = {
    label: 'node_name',
    isLeaf: 'has_child',
};
const repoInfo = ref<any>({});
const repoType = ref<string>('');

onBeforeMount(() => {
    listData.value = [];
    selectedData.value = [];
});

// 列表请求参数
const reqData = ref<any>({
    // limit: 10,
    // page: 1,
    parent_directory: '',
    team_id: store.teamInfo.team_id,
    access_type: 'harbor',
    keyword: '',
    team_config_id: route.query.config_id || store.allAccessInfo.harbor[0]?.config_id, // 默认当前接入第一个
});

// 更新树
const hideTree = ref(true);
const updateTree = () => {
    hideTree.value = false;
    const timer = setTimeout(() => {
        hideTree.value = true;
        clearTimeout(timer);
    }, 200);
};

// 选择配置ID
const changeTeamIdHandle = (value: string) => {
    reqData.value.team_config_id = value || reqData.value.team_config_id;
    detectInfo.team_config_id = value || detectInfo.team_config_id;
    updateTree();
    // rollRefresh(reqData, updateTree);
};

// 列表
const getListData = async () => {
    loading.value = true;
    try {
        listData.value = [];
        const res = await getProjectListApi(reqData.value);
        listData.value = res.data.list;
        // listData.value = listData.value.map((item: any) => {
        //     item.checked = false;
        //     return item;
        // });
        loading.value = false;
        total.value = res.data.total;

        // // 之前是否有已选中的项目
        // listData.value.forEach((ele) => {
        //     ele.checked = selectedData.value.some((n) => n.id === ele.id);
        // });

        // // 当前是否是全选
        // selectAllValue.value = listData.value.every((e) => e.checked) && (listData.value.length > 0);
    } catch (error) {
        console.log(error);
    }
};

// 懒加载树
const loadTreeNode = async (node: any, resolve: Function) => {
    if (!node.data.node_name) {
        // 仓库
        const { data } = await getRepoListApi({
            access_type: 'harbor',
            // team_config_id: '275',
            // team_id: '1768576424658649088',
            repo_type: repoType.value,
            team_config_id: detectInfo.team_config_id,
            team_id: store.teamInfo.team_id,
        });
        data.forEach((ele: any) => {
            ele.node_name = ele.repo_name;
            ele.has_child = false;
            // ele.disabled = ele.status === 3 || ele.repo_type !== 'hosted';
        });
        resolve(data);
    } else {
        // tree
        const { data } = await getRepoTreeDataApi({
            access_type: 'harbor',
            team_config_id: detectInfo.team_config_id,
            parent_directory: node.data?.current_directory || node.data?.node_name,
        });
        data.list?.forEach((item: any) => {
            item.has_child = !item.has_child;
            // item.disabled = true;
        });
        resolve(data.list);
    }
};

const treeNodeClick = (node: any) => {
    if (node.repo_name) {
        repoInfo.value = node;
    }
    // listData.value = [];
    // } else {
    selectedData.value = [];
    reqData.value.parent_directory = node.current_directory || node.repo_name;
    getListData();
    // }
};

// 刷新
nextTick(() => {
    rollRefresh(reqData, 0);
});

// 同步数据
const refreshHandle = async () => {
    try {
        await refreshProjectApi({
            team_id: store.teamInfo.team_id,
            access_type: 'harbor',
            team_config_id: detectInfo.team_config_id,
        });
        await rollRefresh(reqData);
    } catch (error) {
        console.log(error);
    }
};

// 取消刷新
const cancelRefresh = async () => {
    try {
        await cancelRefreshApi(reqData.value);
        window.clearInterval(rollTimer.value);
        refreshLoading.value = false;
    } catch (error) {
        console.log(error);
    }
};

// 全选
const checkAll = (data: any) => {
    selectedData.value = data.records;
};

// 单选
const checkSingle = (data: any) => {
    selectedData.value = data.records;
};

// 清除
const clearCheck = (row: any) => {
    tableRef.value.toggleCheckboxRow(row, false);
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
            width: 170px;
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
