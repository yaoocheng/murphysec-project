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
                    <el-select style="width: 180px" :disabled="refreshLoading" v-model="detectInfo.team_config_id"
                               @change="changeTeamIdHandle">
                        <el-option
                            v-for="item in store.allAccessInfo.jfrog.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                            :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <SearchComp placeholder="输入制品名称回车搜索" v-model="reqData.keyword" clearable @change="() => {
                    if (reqData.keyword) {
                        reqData.parent_directory = ''; getListData();
                    }
                }" @clear="listData = []; selectAllValue = false" @input="listData = []; selectAllValue = false" />
            </div>

            <!-- <div>
                <el-button >刷新列表</el-button>
                <el-button @click="refreshHandle" class="minor_btn g-mr-8" style="height: 32px;width: 110px;">
                    <i class="murphy icon-shuaxin refresh g-mr-8"></i> 同步数据
                </el-button>
                <el-button v-else @click="cancelRefresh" class="minor_btn g-mr-8" style="height: 32px;width: 110px;">
                    <span class="loader g-mr-8"></span> 取消同步
                </el-button>
            </div> -->
        </div>

        <div class="g-bg-ff g-bdr-6 g-mt-16">
            <!-- <div class="g-f-14 g-color-3 g-mr-8" v-if="lastRefreshTime">
                列表于 {{ lastRefreshTime ? lastRefreshTime.split('+')[0] : '' }} 已更新
            </div> -->

            <div class="project-content g-flex">
                <div class="part g-f-15" style="padding: 0;" v-show="!reqData.keyword">
                    <div style="border-bottom: 1px solid #EBEBEB;"
                         class="g-pb-12 g-mb-12 g-flex g-justify-between g-pl-16 g-pr-16 g-pt-16">
                        <span class="g-color-1 g-fw-500">仓库列表</span>
                        <span class="g-color-3 g-cursor-pointer g-flex g-align-center">
                            <el-tooltip content="同步仓库列表">
                                <i @click="refreshHandle" class="murphy icon-shuaxin g-mr-16 g-f-18"></i>
                            </el-tooltip>
                            <el-tooltip v-if="!isCheckbox" content="批量更新">
                                <i @click="isCheckbox = true" class="murphy icon-xingzhuang1"></i>
                            </el-tooltip>
                            <el-button @click="isCheckbox = false; nowSelectTree = []; allCheck = false; updateTree();"
                                       v-else class="minor_white_btn g-f-12" style="width: 40px; height: 24px;">退出</el-button>
                        </span>
                    </div>

                    <SelectComp @change="nowSelectTree = []; allCheck = false;updateTree()" clearable
                                style="margin-right: 0;padding: 0 16px;box-sizing: border-box;margin-bottom: 8px;"
                                v-model="repoType" :options="options" placeholder="仓库类型" />
                    <!-- <div v-else class="g-color-1 g-f-400 g-f-12 g-mb-12 g-pl-16 g-pr-16">共 {{ allTreeData.length }} 条数据</div> -->

                    <div class="g-pl-16" :style="{ height: isCheckbox ? 'calc(100% - 148px)' : '76%' }"
                         style="overflow: auto;;">

                        <!-- <div v-if="isCheckbox" class="g-flex g-justify-between g-mb-12">
                        <CheckboxComp class="g-flex-grow-1" clearable placeholder="仓库类型" />
                        <CheckboxComp class="g-flex-grow-1" style="margin-right: 0dvh;" clearable placeholder="仓库名称" />
                    </div> -->

                        <el-tree v-if="hideTree" ref="treeRef" @check="checkTreeHandle" check-strictly
                                 :show-checkbox="isCheckbox" @node-click="treeNodeClick" :props="props" :load="loadTreeNode"
                                 node-key="node_name" lazy>
                            <template #default="{ data }">
                                <div style="display: inline-block;vertical-align: -2px;">
                                    <img v-if="!data.is_file" class="g-vertical--1" src="~ast/img/dir-icon.png" alt="">
                                    <img v-else style="width: 22px;" class="file_icon g-mr-4 g-vertical--4"
                                         :src="getFileImg(data.node_name)" alt="">
                                    <el-tooltip :content="data.node_name" placement="top">
                                        <span class="node-name">{{ data.node_name }}</span>
                                    </el-tooltip>

                                    <span v-if="data.repo_name && (data.repo_type?.toLocaleLowerCase()==='local' || data.repo_type?.toLocaleLowerCase() === 'cache')">
                                        <el-tooltip v-if="data.status === 4 || data.status === 2 || data.status === 1 || data.status === 0"
                                                    content="更新制品" placement="top">
                                            <i @click.stop="batchRefresh([data.repo_name])"
                                               class="murphy icon-shuaxin g-mr-8"></i>
                                        </el-tooltip>

                                        <el-tooltip v-if="data.status === 3" content="取消更新" placement="top">
                                            <span @click.stop="cancelRefresh([data.repo_name])" class="loader g-mr-8"></span>
                                        </el-tooltip>

                                        <i v-if="data.status === 2" class="murphy icon-duihao"
                                           style="color: #38C728"></i>
                                    </span>
                                    <el-tooltip v-if="data.repo_name && (data.repo_type?.toLocaleLowerCase()!=='local' && data.repo_type?.toLocaleLowerCase() !== 'cache')" placement="top" content="仅支持对Local、Cache类型的仓库检测">
                                        <i class="murphy icon-tishishuoming g-f-15" style="color: #FF9940;"></i>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-tree>
                    </div>

                    <div v-if="isCheckbox" class="g-flex g-justify-between g-align-center all-check">
                        <el-checkbox v-model="allCheck" @change="setCheckedKeys" label="全选" size="large" />
                        <el-button :disabled="!nowSelectTree.length" @click="batchRefresh(nowSelectTree)"
                                   style="height: 28px;width: 64px;font-size: 12px;">更新制品</el-button>
                    </div>
                </div>

                <div class="g-flex-grow-1 g-p-12" style="overflow: auto;">
                    <div v-show="!reqData.keyword && repoInfo.repo_name">
                        <div class="g-color-1 g-fw-500 g-mb-16">
                            仓库信息
                        </div>
                        <div class="g-p-16 g-bg-f7 g-bdr-6 g-mb-16">
                            <div class="g-color-1 g-mb-12">
                                {{ repoInfo.repo_name }}
                            </div>
                            <div class="g-flex g-justify-between g-fw-400 g-color-1">
                                <span>仓库类型：{{ repoInfo.repo_type }}</span>
                                <span>包类型：{{ repoInfo.package_type }}</span>
                                <span>制品更新状态：{{ repoStatus.get(repoInfo.status) }}</span>
                                <span>更新时间：{{ formatDate(repoInfo.updated_at) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="g-fw-500 g-color-1 g-f-14 g-mb-12">
                        制品信息
                    </div>

                    <div class="g-flex">
                        <div class="g-flex-grow-1 g-mr-16">
                            <div v-if="listData.length" class="g-color-3 g-fw-500 g-mb-16">
                                制品列表（{{ listData.length }}）
                            </div>

                            <div v-if="listData.length">
                                <div class="g-color-3 g-flex g-justify-between g-align-center"
                                     style="padding: 8px 16px; background-color: #8f959e1b;">
                                    <div>
                                        <el-checkbox v-model="selectAllValue" @change="selectAllHandle" />
                                        <span class="g-vertical-2 g-ml-12">
                                            项目名称
                                        </span>
                                    </div>
                                    <span>
                                        版本
                                    </span>
                                </div>
                                <div class="project_item" :class="{ 'active_item': item.checked }"
                                     v-for="item in listData" :key="item.name">
                                    <div class="g-flex g-align-center">
                                        <el-checkbox @change="selectProjectHandle(item)" v-model="item.checked" />
                                        <el-tooltip placement="top" :content="item.name">
                                            <div class="name" style="max-width: 180px;">
                                                {{ item.name }}
                                            </div>
                                        </el-tooltip>
                                        <el-tooltip placement="top" content="仓库包管理器类型">
                                            <span class="tag"
                                                  style="background-color: rgba(73, 102, 230, 0.20); color: #2946C7">
                                                {{ item.format }}
                                            </span>
                                        </el-tooltip>
                                    </div>
                                    <el-tooltip placement="top" content="版本">
                                        <div>
                                            {{ item.branch }}
                                        </div>
                                    </el-tooltip>
                                </div>
                                <el-pagination v-if="listData.length" @current-change="getListData()"
                                               v-model:currentPage="reqData.page" class="g-mt-24 g-justify-end" hide-on-single-page
                                               background small :page-size="reqData.limit" layout="total, prev, pager, next"
                                               :total="total">
                                </el-pagination>
                            </div>

                            <div v-if="!listData.length">
                                <NoData :description="reqData.keyword ? '暂无搜索结果' : '暂无内容'" />
                                <div v-if="!reqData.keyword" class="g-f-14 g-fw-400 g-color-3"
                                     style="text-align: center;">制品列表待更新或更新中，更新后可选择制品进行检测</div>
                            </div>

                        </div>

                        <div class="g-flex-grow-1" v-show="selectedData.length">
                            <div class="g-color-3 g-fw-500 g-mb-16">
                                已选制品（{{ selectedData.length }}）
                            </div>
                            <div class="project_item g-bdr-6 g-mb-8" style="border:1px solid #C7C7C7;"
                                 v-for="(item) in selectedData" :key="item.id">
                                <div class="g-flex g-align-center">
                                    <el-tooltip placement="top" :content="item.name">
                                        <div class="name" style="max-width: 200px;margin: 0;">
                                            {{ item.name }}
                                        </div>
                                    </el-tooltip>
                                    <el-tooltip placement="top" content="仓库包管理器类型">
                                        <span class="tag"
                                              style="background-color: rgba(73, 102, 230, 0.20); color: #2946C7">
                                            {{ item.format }}
                                        </span>
                                    </el-tooltip>
                                </div>

                                <el-tooltip placement="top" content="版本">
                                    <div>
                                        {{ item.branch }}
                                    </div>
                                </el-tooltip>
                                <i @click.stop="clearSelectProject(item)" class="murphy icon-cuowu2 clear"></i>
                            </div>
                            <NoData description="暂未选择项目" v-if="!selectedData.length" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import {
    ref, onBeforeMount,
} from 'vue';
import store, { detectInfo } from 'util/store';
import {
    getProjectListApi,
} from 'api/project';
import {
    getRepoTreeDataApi, getRepoListApi, refreshRepoListApi, batchRefreshRepoApi, cancelRefreshRepoApi,
} from 'api/detect';
import {
    refreshLoading,
} from 'util/hook';
import { useRoute } from 'vue-router';

import {
    selectAllValue, listData, selectedData, selectAllHandle, selectProjectHandle, clearSelectProject,
} from '../../hooks/hook';
import { getFileImg } from '@/constants/file-icon';
import SearchComp from '@/components/SearchComp.vue';
import NoData from '@/components/NoData.vue';
import SelectComp from '@/components/SelectComp.vue';
import { formatDate } from '@/utils/tools';
// import CheckboxComp from '@/components/CheckboxComp.vue';

const route = useRoute();
const total = ref<number>(0);
const treeRef = ref<any>();
const allCheck = ref<boolean>(false); // 全选
const isCheckbox = ref<boolean>(false); // 是否多选
const allTreeData = ref<Array<any>>([]); // 仓库所有数据名称
const nowSelectTree = ref<Array<any>>([]); // 当前选择数据
const props = {
    label: 'node_name',
    isLeaf: 'has_child',
};
const repoInfo = ref<any>({});
const repoStatus = new Map([[0, '无更新'], [1, '无更新'], [2, '已更新'], [3, '更新中'], [4, '已取消']]);
const repoType = ref<string>('');
const options = [
    {
        value: 'local',
        label: 'local',
    },
    {
        value: 'cache',
        label: 'cache',
    },
    {
        value: 'remote',
        label: 'remote',
    },
    {
        value: 'virtual',
        label: 'virtual',
    },
];

onBeforeMount(() => {
    listData.value = [];
    selectedData.value = [];
});

// 全选
const setCheckedKeys = (value: boolean) => {
    if (value) {
        treeRef.value.setCheckedKeys(allTreeData.value, false);
        nowSelectTree.value = allTreeData.value;
    } else {
        treeRef.value.setCheckedKeys([], false);
        nowSelectTree.value = [];
    }
};

// tree select
const checkTreeHandle = (nodes: any, data: any) => {
    nowSelectTree.value = data.checkedKeys;
    allCheck.value = allTreeData.value?.length === data.checkedKeys?.length;
};

// 列表请求参数
const reqData = ref<any>({
    limit: 10,
    page: 1,
    parent_directory: '',
    team_id: store.teamInfo.team_id,
    access_type: 'jfrog',
    keyword: '',
    team_config_id: route.query.config_id || store.allAccessInfo.jfrog[0]?.config_id, // 默认当前接入第一个
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
    try {
        listData.value = [];
        const res = await getProjectListApi(reqData.value);
        listData.value = res.data.list;
        listData.value = listData.value.map((item: any) => {
            item.checked = false;
            return item;
        });
        total.value = res.data.total;

        // 之前是否有已选中的项目
        listData.value.forEach((ele) => {
            ele.checked = selectedData.value.some((n) => n.id === ele.id);
        });

        // 当前是否是全选
        selectAllValue.value = listData.value.every((e) => e.checked) && (listData.value.length > 0);
    } catch (error) {
        console.log(error);
    }
};

// 懒加载树
const loadTreeNode = async (node: any, resolve: Function) => {
    if (!node.data.node_name) {
        // 仓库
        const { data } = await getRepoListApi({
            access_type: 'jfrog',
            // team_config_id: '275',
            // team_id: '1768576424658649088',
            repo_type: repoType.value,
            team_config_id: detectInfo.team_config_id,
            team_id: store.teamInfo.team_id,
        });
        data.forEach((ele: any) => {
            ele.node_name = ele.repo_name;
            ele.has_child = false;
            ele.disabled = ele.status === 3 || (ele.repo_type?.toLocaleLowerCase() !== 'local' && ele.repo_type?.toLocaleLowerCase() !== 'cache');
        });
        allTreeData.value = data.filter((item: any) => item.status !== 3 && (item.repo_type?.toLocaleLowerCase() === 'local' || item.repo_type?.toLocaleLowerCase() === 'cache')).map((item: any) => item.node_name);
        resolve(data);
    } else {
        // tree
        const { data } = await getRepoTreeDataApi({
            access_type: 'jfrog',
            team_config_id: detectInfo.team_config_id,
            parent_directory: node.data?.current_directory || node.data?.node_name,
        });
        data.list?.forEach((item: any) => {
            item.has_child = !item.has_child;
            item.disabled = true;
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
    reqData.value.parent_directory = node.current_directory || node.repo_name;
    getListData();
    // }
};

// 点击同步更新
const refreshHandle = async () => {
    try {
        await refreshRepoListApi({
            team_id: store.teamInfo.team_id,
            access_type: 'jfrog',
            team_config_id: detectInfo.team_config_id,
        });
        updateTree();
    } catch (error) {
        console.log(error);
    }
};

// 单个更新
const batchRefresh = async (repoNames: string[]) => {
    try {
        await batchRefreshRepoApi({
            access_type: 'jfrog',
            team_config_id: detectInfo.team_config_id,
            team_id: store.teamInfo.team_id,
            repo_names: repoNames,
        });
        isCheckbox.value = false;
        nowSelectTree.value = [];
        allCheck.value = false;
        updateTree();
    } catch (error) {
        console.log(error);
    }
};

// 取消单个更新
const cancelRefresh = async (repoNames: string[]) => {
    try {
        await cancelRefreshRepoApi({
            access_type: 'jfrog',
            team_config_id: detectInfo.team_config_id,
            team_id: store.teamInfo.team_id,
            repo_names: repoNames,
        });
        isCheckbox.value = false;
        nowSelectTree.value = [];
        allCheck.value = false;
        updateTree();
    } catch (error) {
        console.log(error);
    }
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
