<template>
    <div class="top_btn">
        <div>
            <span class="top_btn_item" @click="activeTab = 1; clearFulldetectStatus()"
                  :class="{ 'active': activeTab === 1 }">项目列表</span>
            <span class="top_btn_item" @click="activeTab = 2; getFullDetectStatus('bitbucket')"
                  :class="{ 'active': activeTab === 2 }">全量检测</span>
            <span class="top_btn_item" @click="activeTab = 3;clearFulldetectStatus()" :class="{ 'active': activeTab === 3 }">定时检测</span>
        </div>
        <el-button v-if="isUserSpace || normalTeamAuth" @click="$router.push('/detect-access?from=bitbucket')"
                   class="main_btn" style="width: 80px;height: 32px;color: #fff;">
            新增集成
        </el-button>
    </div>

    <div class="content">
        <!-- 列表 -->
        <div v-if="activeTab === 1">
            <div class="g-flex-between">
                <div class="g-flex">
                    <el-select style="width: 180px;margin-right: 8px;" v-model="detectInfo.team_config_id"
                               @change="changeTeamIdHandle">
                        <el-option
                            v-for="item in store.allAccessInfo.bitbucket.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                            :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                    <SearchComp placeholder="输入完整的项目名回车搜索" v-model="reqData.keyword" clearable
                                @change="reqData.page = 1; listData = []; getListData();" />
                    <el-select style="width: 180px; margin-right: 8px;" v-model="reqData.bitbucket_role"
                               @change="reqData.page = 1; listData = []; getListData();">
                        <el-option label="成员" value="member" />
                        <el-option label="贡献者" value="contributor" />
                        <el-option label="管理员" value="admin" />
                        <el-option label="所有者" value="owner" />
                    </el-select>
                    <el-select style="width: 180px; margin-right: 8px;" v-model="reqData.workspace"
                               @change="reqData.page = 1; listData = []; getListData();">
                        <el-option v-for="item in workspaceOptions" :key="item.value" :label="item.name"
                                   :value="item.value" />
                    </el-select>
                </div>

                <el-button class="minor_btn" style="height: 32px;width: auto;"
                           @click="changeTeamIdHandle('')">刷新列表</el-button>
            </div>

            <div class="project_item" :class="{ 'active_item': item.checked }" v-for="item in listData" :key="item.name"
                 @click=" item.checked = !item.checked">
                <div style="display: flex;align-items: center;flex: 1;">
                    <el-checkbox @click.stop v-model="item.checked" />
                    <div class="name ellipsis text-3c" style="margin-right: 20px; width: 100%;">
                        代码项目名称：{{ item.name }}
                    </div>

                </div>
                <div style="width: 150px;margin-right: 20px;">
                    <el-select v-model="item.branch" size="small" @click.stop
                               @change="item.file_name = item.branchOptions.filter((ele: any) => ele.branch === item.branch)[0].file_name;"
                               @visible-change=" dropOptionsHandle(item)">
                        <el-option v-for="ele in item.branchOptions" :key="ele.branch" :label="ele.branch"
                                   :value="ele.branch" />
                    </el-select>
                </div>
            </div>

            <NoData description="暂无数据" v-if="!listData.length" />

            <!-- 分页组件 -->
            <PageComp v-if="total > 0" v-model:currentPage="reqData.page" :total="total" :page-size="reqData.size"
                      @change="getListData" />
        </div>

        <!-- 全量 -->
        <div class="all" v-if="activeTab === 2">
            <div v-if="!isFullDetecting">
                <!-- <div class="tip" v-if="refreshLoading">
                    <i class="murphy icon-tixing"></i>
                    正在更新当前集成配置的项目列表，请在更新完成后再进行全量检测
                </div> -->
                <FormComp label-width="135px">
                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                选择已接入的Bitbucket
                            </div>
                        </template>
                        <div>
                            <el-select @change="clearFulldetectStatus(); getFullDetectStatus('bitbucket');getWorkspaceList()"
                                       v-model="detectInfo.team_config_id" style="width: 370px">
                                <el-option
                                    v-for="item in store.allAccessInfo.bitbucket.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                                    :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                工作空间
                            </div>
                        </template>
                        <el-select style="width: 370px" v-model="detectInfo.bitbucket_workspace">
                            <el-option v-for="item in workspaceOptions" :key="item.value" :label="item.name"
                                       :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                角色
                            </div>
                        </template>
                        <el-select style="width: 370px; " v-model="detectInfo.bitbucket_role">
                            <el-option label="成员" value="member" />
                            <el-option label="贡献者" value="contributor" />
                            <el-option label="管理员" value="admin" />
                            <el-option label="所有者" value="owner" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                仓库最后更新时间
                            </div>
                        </template>
                        <div style="width: 370px;">
                            <el-date-picker v-model="activeTime"
                                            @change=" [detectInfo.repo_last_active_time_start, detectInfo.repo_last_active_time_end] = activeTime"
                                            type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" />
                        </div>
                    </el-form-item>
                </FormComp>
            </div>

            <FullDetect :type="'bitbucket'" v-else />
        </div>

        <Cron v-if="activeTab===3" :workspaceOptions="workspaceOptions" />
    </div>
    <div class="fix-btn">
        <div class="btn"
             v-if="(activeTab === 1 && listData?.length) || (activeTab === 2 && !isFullDetecting && isGetFullStatus)">
            <el-button @click="nextStepHandle">下一步</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onUnmounted } from 'vue';
import { showMessage } from 'util/tools';
import { useRouter, useRoute } from 'vue-router';
import store, { detectInfo } from 'util/store';
import {
    getBranchListApi,
} from 'api/project';
import { getBitbucketWorkspacesApi, getBitbucketListApi } from 'api/detect';
import {
    getFullDetectStatus, isFullDetecting, fullRollTimer, isGetFullStatus,
} from '../hooks/hook';
import FormComp from '@/components/FormComp.vue';
import SearchComp from '@/components/SearchComp.vue';
import FullDetect from '../full-detect/FullDetect.vue';
import NoData from '@/components/NoData.vue';
import PageComp from '@/components/PageComp.vue';
// import { langOptions } from '../constants/constant';
import { getOrgAuthInfo } from '@/control/org/hooks';
import Cron from './bitbucket/Cron.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const router = useRouter();
const route = useRoute();
const activeTab = ref<number>(1);
const listData = ref<Array<any>>([]);
const activeTime = ref<Array<string>>([]);
const total = ref<number>(0);

detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.bitbucket[0]?.config_id;

// 列表请求参数
const reqData = ref<any>({
    workspace: undefined,
    team_id: store.teamInfo.team_id,
    access_type: 'bitbucket',
    page: 1,
    keyword: '',
    bitbucket_role: 'member',
    team_config_id: detectInfo.team_config_id,
});
// 检测配置信息

const getListData = async () => {
    try {
        const res = await getBitbucketListApi(reqData.value);
        listData.value = res.data?.list || [];
        total.value = res.data?.total || 0;
        listData.value.map((item: any) => {
            item.checked = !item.checked ? false : item.checked;
            return item;
        });
    } catch (error) {
        console.log(error);
    }
};

onUnmounted(() => {
    window.clearInterval(fullRollTimer.value);
});

const workspaceOptions = ref<Array<any>>([]);

// 获取workspace列表
const getWorkspaceList = async () => {
    try {
        const res = await getBitbucketWorkspacesApi({
            team_config_id: detectInfo.team_config_id,
        });
        workspaceOptions.value = res.data?.list || [];
        reqData.value.workspace = res.data?.list[0]?.value;
        detectInfo.bitbucket_workspace = res.data?.list[0]?.value;
        getListData();
    } catch (error) {
        console.log(error);
    }
};
getWorkspaceList();

// 选择配置ID
const changeTeamIdHandle = (value: string) => {
    reqData.value.page = 1;
    listData.value = [];
    reqData.value.team_config_id = value || reqData.value.team_config_id;
    detectInfo.team_config_id = value || detectInfo.team_config_id;
    getWorkspaceList();
};

// 清除全量检测状态
const clearFulldetectStatus = () => {
    window.clearInterval(fullRollTimer.value);
    fullRollTimer.value = null;
};

// 获取分支信息
const dropOptionsHandle = async (projectInfo: any) => {
    if (!projectInfo.branchOptions) {
        try {
            const res = await getBranchListApi({
                git_addr: projectInfo.addr,
                access_type: 'bitbucket',
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
        detectInfo.detect_type = 50;
        router.push('/detect-config?from=bitbucket');
    } else if (activeTab.value === 2) {
        detectInfo.detect_type = 51;
        router.push('/detect-config?from=bitbucket');
    }
};

// 是否全量
// getFullDetectStatus('bitbucket');
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
