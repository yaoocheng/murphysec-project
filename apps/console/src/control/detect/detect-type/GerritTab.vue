<template>
    <div class="top_btn">
        <div>
            <span class="top_btn_item" @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">项目列表</span>
            <span class="top_btn_item" @click="activeTab = 2" :class="{ 'active': activeTab === 2 }">全量检测</span>
            <!-- <span @click="activeTab = 3" :class="{ 'active': activeTab === 3 }">增量检测</span> -->
        </div>
        <el-button v-if="isUserSpace||normalTeamAuth" @click="$router.push('/detect-access?from=gerrit')"  class="main_btn" style="width: 80px;height: 32px;color: #fff;">
            新增集成
        </el-button>
    </div>

    <div class="content">
        <!-- 列表 -->
        <div v-if="activeTab === 1">
            <div class="g-flex-between">
                <div class="g-flex">
                    <SearchComp placeholder="输入项目名回车搜索" v-model="reqData.keyword" clearable
                        @change="reqData.last_id = '0'; listData = []; getListData();" />
                    <div>
                        <el-select style="width: 180px" :disabled="refreshLoading" v-model="detectInfo.team_config_id"
                            @change="changeTeamIdHandle">
                            <el-option
                                v-for="item in store.allAccessInfo.gerrit.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                                :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </div>
                </div>

                <div>
                    <el-button class="minor_btn" style="height: 32px;width: auto;" @click="changeTeamIdHandle('')">刷新列表</el-button>
                    <el-button v-if="!refreshLoading" @click="refreshHandle" class="minor_btn g-mr-8"
                        style="height: 32px;width: 110px;">
                        <i class="murphy icon-shuaxin refresh g-mr-8"></i> 同步数据
                    </el-button>
                    <el-button v-else @click="cancelRefresh" class="minor_btn g-mr-8" style="height: 32px;width: 110px;">
                        <span class="loader g-mr-8"></span> 取消同步
                    </el-button>
                </div>
            </div>

            <div class="g-f-14 g-color-3 g-mr-8 g-mt-16" v-if="lastRefreshTime">
                列表于 {{ lastRefreshTime ? lastRefreshTime.split('+')[0] : '' }} 已更新
            </div>

            <div class="project_item" :class="{ 'active_item': item.checked }" v-for="item in listData" :key="item.name"
                @click=" item.checked = !item.checked">
                <div style="display: flex;align-items: center;">
                    <el-checkbox @click.stop v-model="item.checked" />
                    <div class="name" style="width: 400px;margin-right: 20px;">
                        代码项目名称：{{ item.name }}
                    </div>
                    <!-- <div>
                        {{ item.last_commit_at ? formatDate(item.last_commit_at) : '' }}
                    </div> -->
                </div>
                <div style="width: 150px;margin-right: 20px;">
                    <el-select v-model="item.branch" size="small"
                        @change="item.file_name = item.branchOptions.filter((ele: any) => ele.branch === item.branch)[0].file_name;"
                        @visible-change=" dropOptionsHandle(item)">
                        <el-option v-for="   ele    in    item.branchOptions   " :key="ele.branch" :label="ele.branch"
                            :value="ele.branch" />
                    </el-select>
                </div>
            </div>

            <NoData description="暂无数据" v-if="!isHaveAllData" />

            <div class="more" v-if="isHaveAllData && total > 30 && !refreshLoading" @click="loadMoreDataHandle">
                {{ !isNoMoreData ? '点击加载更多' : '无更多数据' }}
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
                                选择已接入的Gerrit
                            </div>
                        </template>
                        <div>
                            <el-select :disabled="refreshLoading" v-model="detectInfo.team_config_id" style="width: 370px">
                                <el-option
                                    v-for="item in store.allAccessInfo.gerrit.map((e: any) => ({ value: e.config_id, label: e.config_name }))        "
                                    :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>
                </FormComp>
            </div>

            <FullDetect :type="'gerrit'" v-else />
        </div>
    </div>
    <div class="fix-btn">

    <div class="btn"
        v-if="(activeTab === 1&&isHaveAllData) || (activeTab === 2 && !isFullDetecting && isGetFullStatus && !refreshLoading)">
        <el-button @click="nextStepHandle">下一步</el-button>
    </div>
</div>
</template>

<script setup lang='ts'>
import { ref, onUnmounted, nextTick } from 'vue';
import { showMessage } from 'util/tools';
import { useRouter, useRoute } from 'vue-router';
import store, { detectInfo } from 'util/store';
import {
    getProjectListApi, getBranchListApi, refreshProjectApi, cancelRefreshApi,
} from 'api/project';
import {
    rollRefresh, lastRefreshTime, refreshLoading, rollTimer,
} from 'util/hook';
import {
    getFullDetectStatus, isFullDetecting, fullRollTimer, isGetFullStatus,
} from '../hooks/hook';
import FormComp from '@/components/FormComp.vue';
import SearchComp from '@/components/SearchComp.vue';
import FullDetect from '../full-detect/FullDetect.vue';
import NoData from '@/components/NoData.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const router = useRouter();
const route = useRoute();
const activeTab = ref<number>(1);
const total = ref<number>(0);
const listData = ref<Array<any>>([]);
const isHaveAllData = ref<boolean>(true);
const isNoMoreData = ref<boolean>(false);

// 列表请求参数
const reqData = ref<any>({
    last_id: '0',
    limit: 30,
    team_id: store.teamInfo.team_id,
    access_type: 'gerrit',
    keyword: '',
    team_config_id: route.query.config_id || store.allAccessInfo.gerrit[0]?.config_id, // 默认当前接入第一个gerrit
});
// 检测配置信息
detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.gerrit[0]?.config_id; // 默认当前接入第一个gerrit

// gerrit列表
const getListData = async () => {
    try {
        const res = await getProjectListApi(reqData.value);
        isNoMoreData.value = !res.data.list || !res.data.list.length;
        listData.value.push(...res.data.list);
        isHaveAllData.value = listData.value.length > 0;
        total.value = res.data.total;
        listData.value.map((item: any) => {
            item.checked = !item.checked ? false : item.checked;
            return item;
        });
    } catch (error) {
        console.log(error);
    }
};
getListData();

// 刷新
nextTick(() => {
    rollRefresh(reqData, 0);
});
const refreshHandle = async () => {
    try {
        await refreshProjectApi({
            team_id: store.teamInfo.team_id,
            access_type: 'gerrit',
            team_config_id: detectInfo.team_config_id,
        });
    } catch (error) {
        console.log(error);
    }
    // reqData.value.last_id = '0';
    // listData.value = [];
    rollRefresh(reqData);
};

onUnmounted(() => {
    window.clearInterval(rollTimer.value);
    window.clearInterval(fullRollTimer.value);
});

// 取消刷新
const cancelRefresh = async () => {
    try {
        await cancelRefreshApi(reqData.value);
        window.clearInterval(rollTimer.value);
        refreshLoading.value = false;
        // reqData.value.last_id = '0';
        // listData.value = [];
        // getListData();
    } catch (error) {
        console.log(error);
    }
};

// 选择配置ID
const changeTeamIdHandle = (value: string) => {
    reqData.value.last_id = '0';
    listData.value = [];
    reqData.value.team_config_id = value || reqData.value.team_config_id;
    detectInfo.team_config_id = value || detectInfo.team_config_id;
    getListData();
    // rollRefresh(reqData, getListData);
};

// 加载更多
const loadMoreDataHandle = () => {
    reqData.value.last_id = listData.value[listData.value.length - 1].id;
    getListData();
};

// 获取分支信息
const dropOptionsHandle = async (projectInfo: any) => {
    if (!projectInfo.branchOptions) {
        try {
            const res = await getBranchListApi({
                git_addr: projectInfo.addr,
                access_type: 'gerrit',
                team_config_id: detectInfo.team_config_id,
            });
            projectInfo.branchOptions = res.data;
        } catch (error) {
            console.log(error);
        }
    }
};

// 下一步
const nextStepHandle = () => {
    // if (refreshLoading.value) {
    //     showMessage('项目列表正在刷新中', 'warning');
    //     return;
    // }
    if (activeTab.value === 1) {
        const filterData = listData.value.filter((item: any) => item.checked).map((ele: any) => ({
            git_addr: ele.addr,
            git_branch: ele.branch,
            file_name: ele.file_name,
        }));

        if (!filterData.length) {
            showMessage('请选择项目', 'warning');
            return;
        }
        detectInfo.repos = filterData;
        detectInfo.detect_type = 30;
        router.push('/detect-config?from=gerrit');
    } else if (activeTab.value === 2) {
        detectInfo.detect_type = 20;
        router.push('/detect-config?from=gerrit');
    }
};

// 是否全量
getFullDetectStatus('gerrit');
</script>

<style lang='less' scoped>
.top_btn {

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
        .between();
        height: 48px;
        background: #FFFFFF;
        border: 1px solid #C7C7C7;
        border-radius: 6px;
        padding-left: 24px;
        margin-top: 12px;
        cursor: pointer;

        .name {
            margin: 0 16px;
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
        border: 1px solid #6C87FF;
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
