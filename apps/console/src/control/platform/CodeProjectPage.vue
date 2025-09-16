<template>
    <CommonHead>
        <span>代码项目托管</span>
    </CommonHead>

    <div class="code_project_wrap">
        <div class="question_tabs">
            <div class="tab">
                <span class="item" v-for="item in tabs" :key="item.name"
                      :class="{ 'active': filterOptions.access_type === item.name }" @click="changeAccessType(item.name)">
                    <img :src="getAccessImg(item.name)" alt="">
                    <span v-if="item.name === 'gitlab'">GitLab</span>
                    <span v-if="item.name === 'github'">GitHub</span>
                    <span v-if="item.name === 'gitee'">Gitee</span>
                    <!-- <span v-if="item.name === 'harbor'">Harbor</span> -->
                    <!-- <span v-if="item.name === 'nexus'">Nexus</span> -->
                    <!-- <span v-if="item.name === 'jfrog'">JFrog</span> -->
                    <span v-if="item.name === 'gerrit'">Gerrit</span>
                    <span v-if="item.name === 'folib'">Folib</span>
                </span>
            </div>

        </div>

        <div class="filter_wrap">
            <div style="display: flex; align-items: center;">
                <div style="margin-right: 8px;" v-if="accessOptions.length">
                    <el-select style="width: 160px;" :disabled="refreshLoading" v-model="filterOptions.team_config_id"
                               @change="changeAccessConfig">
                        <el-option v-for="item in accessOptions" :key="item.value" :label="item.label"
                                   :value="item.value" />
                    </el-select>
                </div>

                <SearchComp style="width: 240px;" v-model="filterOptions.keyword" clearable placeholder="搜索代码项目" />

                <CheckboxComp v-if="filterOptions.access_type === 'github'" style="width: 160px" v-model="filterOptions.namespace" :options="namespaceOptions"
                              placeholder="仓库所属组织" />
                <SelectComp v-if="filterOptions.access_type === 'github'" style="width: 160px" v-model="filterOptions.is_fork" :options="forkOptions"
                            placeholder="是否为 Fork 项目" />
                <!-- <SelectComp style="width: 220px;" v-model="filterOptions.low_suggest_level" clearable placeholder="请选择处置等级"
                    :options="repairlOptions" /> -->
                <!-- <div class="sort_wrap" @click="sortBtnHandle">
                    项目安全分
                    <i class="murphy icon-biaotou-kepaixu sort" style="font-size: 18px;cursor: pointer;"></i>
                </div> -->
                <el-button @click="resetHandle" class="minor_btn g-ml-16"
                           style="height: 32px;width: 52px;">重置</el-button>
            </div>

            <div>
                <div v-if="accessOptions.length && filterOptions.access_type !== 'jfrog'"
                     style="display: inline-block;">
                    <el-button v-if="!refreshLoading" @click="refreshHandle" class="minor_btn g-mr-8"
                               style="height: 32px;width: 110px;">
                        <i class="murphy icon-shuaxin refresh g-mr-8"></i> 更新列表
                    </el-button>
                    <el-button v-else @click="cancelRefresh" class="minor_btn g-mr-8"
                               style="height: 32px;width: 110px;">
                        <span class="loader g-mr-8"></span> 取消更新
                    </el-button>
                </div>

                <el-button @click="$router.push('/integrate')" v-if="filterOptions.access_type === 'github'">
                    <i class="murphy icon-xinjian" style="margin-right: 8px;"></i>
                    新增集成
                </el-button>
            </div>
        </div>

        <div class="projects">
            <div class="g-f-14 g-color-3 g-mr-8 g-mb-8" v-if="lastRefreshTime && accessOptions.length">
                列表于 {{ lastRefreshTime ? lastRefreshTime.split('+')[0] : '' }} 已更新
            </div>
            <div class="wrap">
                <div v-show="!filterOptions.keyword" class="tree g-color-1 g-f-14"
                     v-if="filterOptions.access_type === 'jfrog' || filterOptions.access_type === 'folib'">
                    <div class="g-color-1 g-fw-500 g-mb-16 g-mt-16">
                        <i class="murphy icon-source"></i> 制品路径
                    </div>
                    <el-tree v-if="hideTree" @node-click="treeNodeClick" :props="props" :load="loadTreeNode" lazy>
                        <template #default="{ data }">
                            <img v-if="!data.is_file" class="g-vertical--4" src="~ast/img/dir-icon.png" alt="">
                            <img v-else style="width: 22px;" class="file_icon g-mr-4 g-vertical--6"
                                 :src="getFileImg(data.node_name)" alt="">
                            {{ data.node_name }}
                        </template>
                    </el-tree>
                </div>
                <div class="g-w-100 list-part">
                    <div class="item" v-for="(item, index) in listData" :key="index">
                        <CodeProjectComp :data="item" :accessType="filterOptions.access_type" />
                    </div>
                    <NoData v-if="!isHaveData" />

                    <!-- 分页 -->
                    <div class="pagination" v-if="total > 0">
                        <el-pagination v-model:currentPage="curPage" background small :page-size="20"
                                       layout="total, prev,  pager, next" :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>

        <ChangePrincipal v-model="store.isShowChangePrincipal" v-if="store.isShowChangePrincipal" />
    </div>
</template>

<script setup lang='ts'>
import { ref, onUnmounted } from 'vue';
import SearchComp from 'comp/SearchComp.vue';
import { getAccessImg } from 'util/tools';
import useList, {
    rollRefresh, lastRefreshTime, refreshLoading, rollTimer,
} from 'util/hook';
import store from 'util/store';
import { getRepoTreeDataApi, githubNamespaceApi } from 'api/detect';
import { getProjectListApi, refreshProjectApi, cancelRefreshApi } from 'api/project';
import { getFileImg } from '@/constants/file-icon';
import CheckboxComp from '@/components/CheckboxComp.vue';
import SelectComp from '@/components/SelectComp.vue';
import ChangePrincipal from './comp/ChangePrincipal.vue';
import CodeProjectComp from './comp/CodeProjectComp.vue';
import CommonHead from '@/components/CommonHead.vue';
import NoData from '@/components/NoData.vue';

const tabs = ref<Array<any>>([
    { name: 'gitlab' },
    { name: 'github' },
    // { name: 'harbor' },
    // { name: 'nexus' },
    // { name: 'jfrog' },
    { name: 'gerrit' },
    { name: 'folib' },
]);
const accessOptions = ref<any>(store.allAccessInfo.gitlab.map((e: any) => ({ value: e.config_id, label: e.config_name })));
const filterOptions = ref<{
    team_id: string,
    access_type: string,
    keyword: string,
    team_config_id: string,
    parent_directory: string,
    namespace: string[],
    is_fork: boolean | undefined,
}>({
    team_id: store.teamInfo.team_id,
    access_type: 'gitlab',
    keyword: '',
    parent_directory: '',
    namespace: [],
    is_fork: undefined,
    team_config_id: store.allAccessInfo.gitlab[0]?.config_id,
});
const props = {
    label: 'node_name',
    isLeaf: 'has_child',
};
const forkOptions = [
    {
        value: true,
        label: '是',
    },
    {
        value: false,
        label: '否',
    },
];

const namespaceOptions = ref<string[]>([]);

const mapZh:any = {
    users: '个人',
    orgs: '组织',
};
const getNamespace = async (configId:string) => {
    try {
        const { data } = await githubNamespaceApi({
            access_type: 'gitlab',
            team_config_id: configId,
        });
        namespaceOptions.value = data?.map((item: any) => ({
            value: item,
            label: `${item.split('/')[1]} (${mapZh[item.split('/')[0]]})`,
        }));
    } catch (error) {
        console.log(error);
    }
};
getNamespace(store.allAccessInfo.github[0]?.config_id);

const changeAccessConfig = (val:string) => {
    // eslint-disable-next-line no-use-before-define
    updateTree();
    getNamespace(val);
};

// 更新树
const hideTree = ref(true);
const updateTree = () => {
    hideTree.value = false;
    const timer = setTimeout(() => {
        hideTree.value = true;
        clearTimeout(timer);
    }, 500);
};

// 刷新
// if (accessOptions.value.length) {
//     rollRefresh(filterOptions, () => { });
// }
const refreshHandle = async () => {
    try {
        await refreshProjectApi({
            team_id: store.teamInfo.team_id,
            access_type: filterOptions.value.access_type,
            team_config_id: filterOptions.value.team_config_id,
        });
    } catch (error) {
        console.log(error);
    }
    rollRefresh(filterOptions); // 状态获取
};

// 取消刷新
const cancelRefresh = async () => {
    try {
        await cancelRefreshApi(filterOptions.value);
        window.clearInterval(rollTimer.value);
        refreshLoading.value = false;
    } catch (error) {
        console.log(error);
    }
};

onUnmounted(() => {
    window.clearInterval(rollTimer.value);
});

const {
    total, curPage, listData, isHaveData,
} = useList(getProjectListApi, filterOptions);

const getProjectHandle = async () => {
    const res = await getProjectListApi(filterOptions.value);
    listData.value = res.data.list;
    total.value = res.data.total;
};

// 懒加载树
const loadTreeNode = async (node: any, resolve: Function) => {
    const res = await getRepoTreeDataApi({
        access_type: filterOptions.value.access_type,
        team_config_id: filterOptions.value.team_config_id,
        parent_directory: node.data.current_directory,
    });
    res.data.list?.forEach((item: any) => {
        item.has_child = !item.has_child;
    });
    resolve(res.data.list);
};

const treeNodeClick = (node: any) => {
    filterOptions.value.parent_directory = node.current_directory;
    getProjectHandle();
};

// 重置
const resetHandle = () => {
    Object.assign(filterOptions.value, {
        keyword: '',
        is_fork: undefined,
        namespace: [],
        team_config_id: store.allAccessInfo[filterOptions.value.access_type][0]?.config_id,
    });
    // configid列表
    accessOptions.value = store.allAccessInfo[filterOptions.value.access_type].map((e: any) => ({ value: e.config_id, label: e.config_name }));

    // // 有configid切换后自动刷新
    // if (accessOptions.value.length) {
    //     rollRefresh(filterOptions, () => { });
    // }
};

const changeAccessType = async (name: string) => {
    // 切换tab暂停上一个tab更新
    if (refreshLoading.value) {
        await cancelRefresh();
    }
    filterOptions.value.parent_directory = '';
    filterOptions.value.access_type = name;
    if (name === 'jfrog' || name === 'folib') {
        updateTree();
    }
    resetHandle();
};
</script>

<style lang='less' scoped>
.code_project_wrap {
    height: calc(100% - 58px);
    padding: 24px;
    background-color: #F7F8FB;
    box-sizing: border-box;
}

.back {
    color: #5572F4;
    cursor: pointer;
}

.question_tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(30, 30, 30, 0.1);
    margin-bottom: 16px;

    img {
        width: 20px;
        vertical-align: -4px;
        margin-right: 5px;
    }

    .tab {
        // width: 560px;
        .between();
        gap: 24px;
    }

    .tab span.item {
        display: inline-block;
        color: #606C80;
        cursor: pointer;
        font-size: 16px;
        padding-bottom: 12px;
        color: #3c3c3c;
        border-bottom: 2px solid transparent;
    }

    .tab span.item.active {
        border-bottom-color: #5572F4;
        color: #5572F4;
        font-weight: 500;
    }
}

.filter_wrap {
    .between();
    background: #FFFFFF;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 12px;

    .sort_wrap {
        width: 100px;
        height: 30px;
        background: #FFFFFF;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        color: #606c80a8;
        line-height: 30px;
        font-size: 14px;
        padding: 0 12px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
    }

    .sort {
        vertical-align: -2px;
        color: #606c80a8
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
}

.projects {
    padding: 16px;
    background-color: #fff;
    border-radius: 4px;
    height: calc(100% - 160px);
    // overflow: auto;

    .wrap {
        display: flex;
        height: 95%;

        .list-part {
            height: 100%;
            overflow: auto;
        }

        .tree {
            margin-right: 8px;
            width: 25%;
            height: 100%;
            overflow: auto;
            border-right: 1px solid #f1f1f1;
        }
    }
}
</style>

<style lang="less">
.projects {
    .el-tree-node__content {
        display: inline-block !important;
        padding-right: 16px;
    }

    .el-tree-node__children {
        overflow: initial !important;
    }
}
</style>
