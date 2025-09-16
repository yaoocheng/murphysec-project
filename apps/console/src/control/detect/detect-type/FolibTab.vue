<template>
    <div class="top_btn">
        <div>
            <span @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">项目列表</span>
            <span @click="activeTab = 2" :class="{ 'active': activeTab === 2 }">全量检测</span>
        </div>
        <el-button v-if="isUserSpace || normalTeamAuth" @click="$router.push('/detect-access?from=folib')"
            class="main_btn" style="width: 80px;height: 32px;color: #fff;">
            新增集成
        </el-button>
    </div>

    <div class="content">
        <!-- 列表 -->
        <div class="g-bdr-6 g-bg-f7 g-p-16" v-if="activeTab === 1">
            <div class="g-flex-between">
                <div class="g-flex">
                    <div class="g-mr-8">
                        <el-select style="width: 180px" :disabled="refreshLoading" v-model="detectInfo.team_config_id"
                            @change="changeTeamIdHandle">
                            <el-option
                                v-for="item in store.allAccessInfo.folib.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                                :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </div>
                    <SearchComp placeholder="输入项目名回车搜索" v-model="reqData.keyword" clearable @change="() => {
                if (reqData.keyword) {
                    reqData.parent_directory = ''; getListData();
                }
            }" @clear="listData = []; selectAllValue = false" @input="listData = []; selectAllValue = false" />
                </div>

                <div>
                    <el-button class="minor_btn" style="height: 32px;width: auto;"
                        @click="changeTeamIdHandle('')">刷新列表</el-button>
                    <el-button v-if="!refreshLoading" @click="refreshHandle" class="minor_btn g-mr-8"
                        style="height: 32px;width: 110px;">
                        <i class="murphy icon-shuaxin refresh g-mr-8"></i> 同步数据
                    </el-button>
                    <el-button v-else @click="cancelRefresh" class="minor_btn g-mr-8"
                        style="height: 32px;width: 110px;">
                        <span class="loader g-mr-8"></span> 取消同步
                    </el-button>
                </div>
            </div>

            <div class="g-bg-ff g-p-12 g-bdr-6 g-mt-16">
                <div class="g-f-14 g-color-3 g-mr-8" v-if="lastRefreshTime">
                    列表于 {{ lastRefreshTime ? lastRefreshTime.split('+')[0] : '' }} 已更新
                </div>

                <div class="project-content g-flex">
                    <div class="part g-f-15" v-show="!reqData.keyword">
                        <div class="g-color-1 g-fw-500 g-mb-16">
                            <i class="murphy icon-source"></i> 制品路径
                        </div>
                        <el-tree v-if="hideTree" @node-click="treeNodeClick" :props="props" :load="loadTreeNode" lazy>
                            <template #default="{ data }">
                                <!-- <img v-if="data.is_file" class="g-vertical--4" src="~ast/img/file-icon.png" alt=""> -->
                                <img v-if="!data.is_file" class="g-vertical--4" src="~ast/img/dir-icon.png" alt="">
                                <img v-else style="width: 22px;" class="file_icon g-mr-4 g-vertical--6"
                                    :src="getFileImg(data.node_name)" alt="">
                                {{ data.node_name }}
                            </template>
                        </el-tree>
                    </div>
                    <div class="part">
                        <div class="g-color-1 g-fw-500 g-mb-16">
                            制品列表
                        </div>
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
                        <div class="project_item" :class="{ 'active_item': item.checked }" v-for="item in listData"
                            :key="item.name">
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

                        <NoData :description="reqData.keyword ? '暂无搜索结果' : '点击左侧路径，选择制品进行检测'" v-if="!listData.length" />
                    </div>
                    <div class="part" v-show="selectedData.length">
                        <div class="g-color-1 g-fw-500 g-mb-16">
                            已选制品
                        </div>
                        <div class="project_item" v-for="(item) in selectedData" :key="item.id">
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

        <!-- 全量 -->
        <div class="all" v-if="activeTab === 2">
            <div v-if="!isFullDetecting">
                <div class="tip" v-if="refreshLoading">
                    <i class="murphy icon-tixing"></i>
                    正在更新当前集成配置的项目列表，请在更新完成后再进行全量检测
                </div>
                <FormComp label-width="135px">
                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                选择已接入的Folib
                            </div>
                        </template>
                        <div>
                            <el-select @change="getRepoKeyData" :disabled="refreshLoading"
                                v-model="detectInfo.team_config_id" style="width: 370px">
                                <el-option
                                    v-for="item in store.allAccessInfo.folib.map((e: any) => ({ value: e.config_id, label: e.config_name }))        "
                                    :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>

                    <!-- <el-form-item>
                        <template #label>
                            <div class="form_label">
                                仓库类型
                            </div>
                        </template>
                        <div>
                            <el-select @change="changeRepType" v-model="detectInfo.repository_type" style="width: 370px">
                                <el-option v-for="item in repoTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                仓库名称
                            </div>
                        </template>
                        <div>
                            <el-select v-model="repoName"
                                @change="[detectInfo.repository_key, detectInfo.format] = repoName.split(':')"
                                style="width: 370px">
                                <el-option v-for="item in repoKeysOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item> -->
                </FormComp>
            </div>

            <FullDetect v-else :type="'folib'" />
        </div>
    </div>

    <div class="fix-btn">

        <div class="btn"
            v-if="(activeTab === 1) || (activeTab === 2 && !isFullDetecting && isGetFullStatus && !refreshLoading)">
            <el-button @click="nextStepHandle">下一步</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import {
    ref, onUnmounted, nextTick,
} from 'vue';
import { showMessage } from 'util/tools';
import { useRouter, useRoute } from 'vue-router';
import store, { detectInfo } from 'util/store';
import {
    getProjectListApi, refreshProjectApi, cancelRefreshApi,
} from 'api/project';
import {
    rollRefresh, lastRefreshTime, refreshLoading, rollTimer,
} from 'util/hook';
import { getRepoTreeDataApi, getRepoKeyDataApi } from 'api/detect';
import {
    getFullDetectStatus, isFullDetecting, fullRollTimer, isGetFullStatus,
    selectAllValue, listData, selectedData, selectAllHandle, selectProjectHandle, clearSelectProject,
} from '../hooks/hook';
import { repoKeysOptions } from '../constants/constant';
import { getFileImg } from '@/constants/file-icon';
import FormComp from '@/components/FormComp.vue';
import SearchComp from '@/components/SearchComp.vue';
import NoData from '@/components/NoData.vue';
import FullDetect from '../full-detect/FullDetect.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const router = useRouter();
const route = useRoute();
const activeTab = ref<number>(1);
const total = ref<number>(0);
const props = {
    label: 'node_name',
    isLeaf: 'has_child',
};
// const repoName = ref<string>('');

// 更新树
const hideTree = ref(true);
const updateTree = () => {
    hideTree.value = false;
    const timer = setTimeout(() => {
        hideTree.value = true;
        clearTimeout(timer);
    }, 500);
};

// 列表请求参数
const reqData = ref<any>({
    limit: 10,
    page: 1,
    parent_directory: '',
    team_id: store.teamInfo.team_id,
    access_type: 'folib',
    keyword: '',
    team_config_id: route.query.config_id || store.allAccessInfo.folib[0]?.config_id, // 默认当前接入第一个folib
});
// 检测配置信息
detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.folib[0]?.config_id; // 默认当前接入第一个folib

// folib列表
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

// 是否全量
getFullDetectStatus('folib');

// 进来默认刷新
nextTick(() => {
    rollRefresh(reqData, 0);
});

// 点击刷新
const refreshHandle = async () => {
    try {
        await refreshProjectApi({
            team_id: store.teamInfo.team_id,
            access_type: 'folib',
            team_config_id: detectInfo.team_config_id,
        });
    } catch (error) {
        console.log(error);
    }
    // listData.value = [];
    // selectedData.value = [];
    rollRefresh(reqData);
};

// 取消刷新
const cancelRefresh = async () => {
    try {
        await cancelRefreshApi(reqData.value);
        window.clearInterval(rollTimer.value);
        refreshLoading.value = false;
        updateTree();
    } catch (error) {
        console.log(error);
    }
};

onUnmounted(() => {
    window.clearInterval(rollTimer.value);
    window.clearInterval(fullRollTimer.value);
});

// 选择配置ID
const changeTeamIdHandle = (value: string) => {
    reqData.value.team_config_id = value || reqData.value.team_config_id;
    detectInfo.team_config_id = value || detectInfo.team_config_id;
    updateTree();
    // rollRefresh(reqData, updateTree);
};

// 懒加载树
const loadTreeNode = async (node: any, resolve: Function) => {
    const res = await getRepoTreeDataApi({
        access_type: 'folib',
        team_config_id: detectInfo.team_config_id,
        parent_directory: node.data.current_directory,
    });
    res.data.list?.forEach((item: any) => {
        item.has_child = !item.has_child;
    });
    resolve(res.data.list);
};

const treeNodeClick = (node: any) => {
    reqData.value.parent_directory = node.current_directory;
    getListData();
};

// 下一步
const nextStepHandle = () => {
    // if (refreshLoading.value) {
    //     showMessage('项目列表正在刷新中', 'warning');
    //     return;
    // }
    if (activeTab.value === 1) {
        if (!selectedData.value.length) {
            showMessage('当前未选择项目', 'warning');
            return;
        }
        selectedData.value = selectedData.value.map((ele: any) => ({
            git_addr: ele.addr,
            git_branch: ele.branch,
            commit: ele.commit,
            ...ele,
        }));
        detectInfo.repos = selectedData.value;
        detectInfo.detect_type = 43;
        router.push('/detect-config?from=folib');
    } else if (activeTab.value === 2) {
        detectInfo.detect_type = 44;
        router.push('/detect-config?from=folib');
    }
};

// 获取仓库名称
const cacheRepo = ref<Array<any>>([]);
const getRepoKeyData = async () => {
    const res = await getRepoKeyDataApi({
        access_type: 'folib',
        team_config_id: detectInfo.team_config_id,
    });
    repoKeysOptions.value = res.data;
    cacheRepo.value = res.data;
    repoKeysOptions.value = repoKeysOptions.value.map((item) => ({
        value: `${item.repository_key}:${item.format}`,
        label: `${item.repository_key}(${item.format})`,
    }));
};
getRepoKeyData();

// const changeRepType = (value: string) => {
//     if (value) {
//         repoKeysOptions.value = cacheRepo.value.filter((item) => item.repository_type === value).map((item) => ({
//             value: `${item.repository_key}:${item.format}`,
//             label: `${item.repository_key}(${item.format})`,
//         }));
//     } else {
//         repoKeysOptions.value = cacheRepo.value.map((item) => ({
//             value: `${item.repository_key}:${item.format}`,
//             label: `${item.repository_key}(${item.format})`,
//         }));
//     }
// };

</script>

<style lang='less' scoped>
.top_btn {
    span {
        display: inline-block;
        background: #FFFFFF;
        border: 1px solid #C7C7C7;
        border-radius: 6px;
        padding: 3px 6px;
        margin-right: 12px;
        color: #3c3c3c;
        font-size: 12px;
        cursor: pointer;
    }

    span.active {
        background: rgba(108, 135, 255, 0.1);
        border: 1px solid rgba(108, 135, 255, 0.5);
        border-radius: 6px;
        color: #6C87FF;
    }

    .el-button {
        background: #FFFFFF;
        border: 1px solid #6C87FF;
        border-radius: 6px;
        color: #6C87FF;
    }

    margin-bottom: 16px;
    .between();
}

.content {
    .project-content {
        margin-top: 8px;
        color: #858585;
        border-radius: 6px;
        height: 48vh;

        .part {
            width: 22%;
            overflow: auto;
            box-sizing: border-box;
            padding: 16px;

            &:nth-of-type(2) {
                flex: 1;
                background-color: #F7F8FB;
            }

            &:nth-of-type(3) {
                flex: 1;
                background-color: #F7F8FB;

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
        height: 56px;
        background: #FFFFFF;
        // border: 1px solid #C7C7C7;
        // border-radius: 6px;
        padding: 0 16px;
        position: relative;
        cursor: pointer;
        color: #3c3c3c;

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
        background: rgba(108, 135, 255, 0.1);
        // border: 1px solid #6C87FF;
    }

    .all {
        background: #F7F8FB;
        border-radius: 8px;
        padding: 24px;
        font-weight: 500;

        .form_label {
            color: #3c3c3c;
            font-weight: 500;
        }

        .tip {
            height: 40px;
            background: rgba(255, 153, 64, 0.18);
            border-radius: 6px;
            line-height: 40px;
            padding-left: 16px;
            margin-bottom: 24px;
            color: #3c3c3c;

            i {
                color: #FF9940;
            }
        }
    }

    .desc {
        font-size: 12px;
        color: #8F959E;
        margin-bottom: 8px;
    }
}

.btn {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;
}

.fix-btn {
    width: 1210px;
    position: fixed;
    z-index: 999;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    background-color: #fff;
}
</style>
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
