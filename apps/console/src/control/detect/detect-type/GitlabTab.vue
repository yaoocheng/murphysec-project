<template>
    <div class="top_btn">
        <div>
            <span class="top_btn_item" @click="activeTab = 1;clearFulldetectStatus();" :class="{ 'active': activeTab === 1 }">项目列表</span>
            <span class="top_btn_item" @click="activeTab = 2;getFullDetectStatus('gitlab')" :class="{ 'active': activeTab === 2 }">全量检测</span>
            <span class="top_btn_item" @click="activeTab = 3;clearFulldetectStatus()" :class="{ 'active': activeTab === 3 }">增量检测</span>
            <span class="top_btn_item" @click="activeTab = 4;clearFulldetectStatus()" :class="{ 'active': activeTab === 4 }">定时检测</span>
        </div>
        <el-button v-if="isUserSpace || normalTeamAuth" @click="$router.push('/detect-access?from=gitlab')"
                   style="width: 80px;">
            新增集成
        </el-button>
    </div>

    <div class="content">
        <!-- 列表 -->
        <div v-if="activeTab === 1">
            <div class="g-flex-between">
                <div class="g-flex">
                    <div class="g-mr-8">
                        <el-select style="width: 180px" :disabled="refreshLoading" v-model="detectInfo.team_config_id"
                                   @change="changeTeamIdHandle">
                            <el-option
                                v-for="item in store.allAccessInfo.gitlab.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                                :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </div>
                    <SearchComp placeholder="输入项目名回车搜索" v-model="reqData.keyword" clearable
                                @change="reqData.last_id = '0'; listData = []; getListData();" />
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

            <div class="g-f-14 g-color-3 g-mr-8 g-mt-16" v-if="lastRefreshTime">
                列表于 {{ lastRefreshTime ? lastRefreshTime.split('+')[0] : '' }} 已更新
            </div>

            <div class="project_item" :class="{ 'active_item': item.checked }" v-for="        item in listData        "
                 :key="item.name" @click=" item.checked = !item.checked">
                <div style="display: flex;align-items: center;">
                    <el-checkbox @click.stop v-model="item.checked" />
                    <div class="name truncate" style="width: 400px;margin-right: 20px;">
                        代码项目名称：{{ item.name }}
                    </div>
                    <div>
                        {{ item.last_commit_at ? formatDate(item.last_commit_at) : '' }}
                    </div>
                </div>
                <div style="width: 150px;margin-right: 20px;">
                    <el-select v-model="item.branch" size="small"
                               @change="item.file_name = item.branchOptions.filter((ele: any) => ele.branch === item.branch)[0].file_name;"
                               @visible-change=" dropOptionsHandle(item)">
                        <el-option v-for="ele in item.branchOptions" :key="ele.branch" :label="ele.branch"
                                   :value="ele.branch" />
                    </el-select>
                </div>
            </div>

            <NoData description="暂无数据" v-if="!isHaveAllData" />

            <div v-if="isHaveAllData && total > 30">
                <div v-if="!isNoMoreData" class="more" @click="loadMoreDataHandle">
                    点击加载更多
                </div>
                <div class="more" style="color: #858585;" v-else>
                    无更多数据
                </div>
            </div>
        </div>

        <!-- 全量 -->
        <div class="all" v-if="activeTab === 2">
            <div v-if="!isFullDetecting">
                <div class="tip" v-if="refreshLoading">
                    <i class="murphy icon-tixing g-vertical--1"></i>
                    正在更新当前集成配置的项目列表，请在更新完成后再进行全量检测
                </div>
                <FormComp label-width="135px">
                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                <span class="text-err">*</span>
                                选择已接入的GitLab
                            </div>
                        </template>
                        <el-select @change="getFullDetectStatus('gitlab')" :disabled="refreshLoading" v-model="detectInfo.team_config_id">
                            <el-option
                                v-for="item in store.allAccessInfo.gitlab.map((e: any) => ({ value: e.config_id, label: e.config_name }))        "
                                :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <div v-if="!refreshLoading" class="g-p-24 g-bg-ff g-bdr-6">
                        <div class="g-color-3 g-mb-16 g-fw-500">设置检测范围</div>
                        <el-form-item>
                            <template #label>
                                <div class="form_label mb-2">
                                    仓库最后活跃时间
                                </div>
                            </template>
                            <div>
                                <el-radio-group class="mb-2" @change="changeTimeScope"
                                                v-model="detectInfo.pull_time_type">
                                    <el-radio label="default">绝对时间范围</el-radio>
                                    <el-radio label="days">相对时间范围</el-radio>
                                </el-radio-group>
                                <div v-if="detectInfo.pull_time_type === 'default'">
                                    <el-date-picker v-model="activeTime" style="width: 350px;"
                                                    @change=" [detectInfo.repo_last_active_time_start, detectInfo.repo_last_active_time_end] = activeTime"
                                                    type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" />
                                </div>
                                <div class="text-3c font-normal" v-else>
                                    最近 <el-input-number placeholder="请输入天数1-999" :precision="0" :max="999"
                                                        :controls="false" class="mx-1 w-36"
                                                        v-model="detectInfo.repo_last_active_time_days" :min="1" /> 天活跃的仓库
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item>
                            <template #label>
                                <div class="form_label">
                                    语言类型
                                </div>
                            </template>
                            <div>
                                <el-select placeholder="请选择语言类型" v-model="detectInfo.repo_languages" multiple
                                           :collapse-tags="true" style="width: 370px">
                                    <el-option v-for="item in langOptions" :key="item.value" :label="item.label"
                                               :value="item.value" />
                                </el-select>
                            </div>
                        </el-form-item>

                        <el-form-item>
                            <template #label>
                                <div class="form_label">
                                    <span class="text-err">*</span>
                                    选择分支
                                </div>
                            </template>
                            <div>
                                <el-radio-group
                                    @change="detectInfo.gitlab_branch_condition_list = []; customBranch = createGitlabAllBranchOptions()"
                                    v-model="detectInfo.gitlab_branch">
                                    <el-radio label="default">默认分支</el-radio>
                                    <el-radio label="new">最新分支</el-radio>
                                    <el-radio label="condition_list">自定义分支</el-radio>
                                </el-radio-group>
                                <div class="ml-6 mt-2 font-normal text-3c text-sm"
                                     v-if="detectInfo.gitlab_branch === 'condition_list'">
                                    <div v-for="(item, i) in customBranch" :key="item.desc"
                                         class="flex items-center mb-3">
                                        <el-checkbox @change="checkGitlabBranch(item)" v-model="item.checked" />
                                        <span v-if="i === 1">
                                            <span class="ml-2">最近</span> <el-input-number :disabled="!item.checked"
                                                                                          placeholder="请输入天数1-999" v-model="item.day_number" :precision="0"
                                                                                          :max="999" :controls="false" class="mx-2 w-36" :min="1" />
                                            天内活跃过，且分支名包含关键词
                                            <el-input :disabled="!item.checked" v-model="item.keyword" class="mx-2 w-36"
                                                      placeholder="请输入关键词"></el-input>
                                            的全部分支&nbsp;
                                            <TipsComp :width="372" :content="item.desc" />
                                        </span>

                                        <span v-else-if="i === 0">
                                            <span class="ml-2">最近</span> <el-input-number :disabled="!item.checked"
                                                                                          placeholder="请输入天数1-999" v-model="item.day_number" :precision="0"
                                                                                          :max="999" :controls="false" class="mx-2 w-36" :min="1" /> {{ item.text
                                                                                          }}&nbsp;
                                            <TipsComp :width="372" :content="item.desc" />
                                        </span>

                                        <span v-else>
                                            <span class="ml-2">{{ item.text }}</span>&nbsp;
                                            <TipsComp :width="372" :content="item.desc" />
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </el-form-item>

                        <!-- <el-form-item>
                            <template #label> -->
                        <div class="form_label mb-2">
                            <span class="text-err">*</span>
                            归档项目
                        </div>
                        <!-- </template> -->
                        <div>
                            <el-radio-group v-model="detectInfo.include_archiving_repo">
                                <el-radio :label="1">包含</el-radio>
                                <el-radio :label="2">不包含</el-radio>
                            </el-radio-group>
                        </div>
                        <!-- </el-form-item> -->
                    </div>
                </FormComp>
            </div>

            <FullDetect :type="'gitlab'" v-else />
        </div>

        <!-- 增量 -->
        <div class="all" v-if="activeTab === 3">
            <div class="tip">
                <i class="murphy icon-tixing g-vertical--1"></i>
                设置Webhook为“全部”时，GitLab 账号需要有管理员权限
            </div>
            <div style="margin-bottom: 24px;">
                <div class="form_label" style="margin-bottom: 11px;">
                    选择已接入的GitLab
                </div>
                <el-select @change="changeGitlabType" v-model="detectInfo.team_config_id">
                    <el-option
                        v-for="item in store.allAccessInfo.gitlab.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                        :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>

            <div style="margin-bottom: 24px;">
                <div class="form_label" style="margin-bottom: 8px;">
                    设置Webhook
                </div>
                <div>
                    <el-radio-group v-model="setWebhook">
                        <el-radio :label="1">全部</el-radio>
                        <el-radio :label="2">指定</el-radio>
                    </el-radio-group>
                </div>
            </div>

            <div v-if="setWebhook === 1">
                <el-timeline>
                    <el-timeline-item>
                        <div class="part">
                            <div style="margin-bottom: 12px;">
                                步骤一：进入 GitLab 平台，左上角菜单，点击 Admin
                            </div>
                            <el-image style="width: 568px" :hide-on-click-modal="true" :src="showImgs.gitlab1.small"
                                      :preview-src-list="showImgs.gitlab1.big">
                            </el-image>
                        </div>
                    </el-timeline-item>

                    <!-- <el-timeline-item>
                        <div class="part">
                            <div style="margin-bottom: 12px;">
                                步骤二：设置检测配置，配置后将按照配置进行检测，若未配置则按默认方案进行检测
                            </div>
                            <el-button @click="toSetDetectConfig(1)" class="minor_btn" style="width: auto">设置检测配置</el-button>
                        </div>
                    </el-timeline-item> -->

                    <el-timeline-item>
                        <div class="part">
                            <div style="margin-bottom: 12px;">步骤二：左侧边栏选择 Sysyem Hooks，输入下方提供的 URL 和 Secret token；确保下方的
                                Push
                                events 处于勾选状态</div>
                            <div style="font-size: 12px; color: #8F959E;margin-bottom: 8px;">URL处填写</div>
                            <div class="copy_wrap">
                                <el-input readonly style="width: 568px;margin-bottom: 10px;" v-model="url1"
                                          placeholder="Please input">
                                    <template #append>
                                        <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="url1"
                                           @click=" copyFunc('#copy_token')"></i>
                                    </template>
                                </el-input>
                            </div>
                            <div style="font-size: 12px; color: #8F959E;margin-bottom: 8px">令牌（Secret token）处填写</div>
                            <div class="copy_wrap">
                                <el-input readonly style="width: 568px;margin-bottom: 10px;" v-model="token"
                                          placeholder="Please input">
                                    <template #append>
                                        <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="token"
                                           @click=" copyFunc('#copy_token')"></i>
                                    </template>
                                </el-input>
                            </div>
                            <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.gitlab2.small"
                                      :preview-src-list="showImgs.gitlab2.big">
                            </el-image>
                        </div>
                    </el-timeline-item>

                    <el-timeline-item>
                        <div class="part">
                            <div style="margin-bottom: 12px;">步骤三：点击 Add system hook 按钮完成设置</div>
                        </div>
                    </el-timeline-item>
                </el-timeline>
            </div>

            <div v-if="setWebhook === 2">
                <el-timeline>
                    <el-timeline-item>
                        <div class="part">
                            <div style="margin-bottom: 12px;">
                                步骤一：进入 GitLab 中待检测的仓库页面，左侧边栏点击“Settings”中的“Webhooks”
                            </div>
                            <el-image style="width: 568px" :hide-on-click-modal="true" :src="showImgs.gitlab3.small"
                                      :preview-src-list="showImgs.gitlab3.big">
                            </el-image>
                        </div>
                    </el-timeline-item>

                    <!-- <el-timeline-item>
                        <div class="part">
                            <div style="margin-bottom: 12px;">
                                步骤二：设置检测配置，配置后将按照配置进行检测，若未配置则按默认方案进行检测
                            </div>
                            <el-button @click="toSetDetectConfig(1)" class="minor_btn" style="width: auto">设置检测配置</el-button>
                        </div>
                    </el-timeline-item> -->

                    <el-timeline-item>
                        <div class="part">
                            <div style="margin-bottom: 12px;">步骤二：输入下方提供的 URL 和 Secret token；确保下方的“Push events”处于勾选状态
                            </div>
                            <div style="font-size: 12px; color: #8F959E;margin-bottom: 8px;">URL处填写</div>
                            <div class="copy_wrap">
                                <el-input readonly style="width: 568px;margin-bottom: 10px;" v-model="url2"
                                          placeholder="Please input">
                                    <template #append>
                                        <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="url2"
                                           @click=" copyFunc('#copy_token')"></i>
                                    </template>
                                </el-input>
                            </div>
                            <div style="font-size: 12px; color: #8F959E;margin-bottom: 8px">令牌（Secret token）处填写</div>
                            <div class="copy_wrap">
                                <el-input readonly style="width: 568px;margin-bottom: 10px;" v-model="token"
                                          placeholder="Please input">
                                    <template #append>
                                        <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="token"
                                           @click=" copyFunc('#copy_token')"></i>
                                    </template>
                                </el-input>
                            </div>
                            <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.gitlab4.small"
                                      :preview-src-list="showImgs.gitlab4.big">
                            </el-image>
                        </div>
                    </el-timeline-item>

                    <el-timeline-item>
                        <div class="part">
                            <div style="margin-bottom: 12px;">步骤三：点击“Add webhook”按钮，完成设置</div>
                            <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.gitlab5.small"
                                      :preview-src-list="showImgs.gitlab5.big">
                            </el-image>
                        </div>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>

        <!-- 定时 -->
        <GitlabTiming v-if="activeTab === 4" />
    </div>

    <div class="fix-btn" v-if="activeTab !== 4">
        <div class="btn"
             v-if="(activeTab === 1 && isHaveAllData) || (activeTab === 2 && !isFullDetecting && isGetFullStatus && !refreshLoading)">
            <el-button @click="nextStepHandle">下一步</el-button>
        </div>
        <div class="btn" v-if="activeTab === 3">
            <el-button @click="toSetDetectConfig(setWebhook)">下一步</el-button>
        </div>
    </div>

</template>

<script setup lang='ts'>
import {
    ref, onBeforeMount, onUnmounted, nextTick,
} from 'vue';
import { copyFunc, showMessage, formatDate } from 'util/tools';
import { useRouter, useRoute } from 'vue-router';
import store, { detectInfo } from 'util/store';
import { getWebhookUrlApi } from 'api/detect';
import {
    getProjectListApi, getBranchListApi, getTokenApi, refreshProjectApi, cancelRefreshApi,
} from 'api/project';
import {
    rollRefresh, lastRefreshTime, refreshLoading, rollTimer,
} from 'util/hook';
import {
    getFullDetectStatus, isFullDetecting, fullRollTimer, isGetFullStatus,
} from '../hooks/hook';
import FormComp from '@/components/FormComp.vue';
import FullDetect from '../full-detect/FullDetect.vue';
import SearchComp from '@/components/SearchComp.vue';
import NoData from '@/components/NoData.vue';
import GitlabTiming from './gitlab/GitlabTiming.vue';
import {
    langOptions, showImgs, createGitlabAllBranchOptions,
} from '../constants/constant';
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
const activeTime = ref<Array<string>>([]);
const setWebhook = ref<number>(1);
const url1 = ref<string>('');
const url2 = ref<string>('');
const token = ref<string>('');
const customBranch = ref<any[]>(createGitlabAllBranchOptions());

// 列表请求参数
const reqData = ref<any>({
    last_id: '0',
    limit: 30,
    team_id: store.teamInfo.team_id,
    access_type: 'gitlab',
    keyword: '',
    team_config_id: route.query.config_id || store.allAccessInfo.gitlab[0]?.config_id, // 默认当前接入第一个gitlab
});
// 检测配置信息
detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.gitlab[0]?.config_id; // 默认当前接入第一个gitlab

// gitlab列表
const getListData = async () => {
    try {
        const res = await getProjectListApi(reqData.value);
        isNoMoreData.value = res.data.list.length < 30;
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
    rollRefresh(reqData);
});

const refreshHandle = async () => {
    try {
        await refreshProjectApi({
            team_id: store.teamInfo.team_id,
            access_type: 'gitlab',
            team_config_id: detectInfo.team_config_id,
        });
    } catch (error) {
        console.log(error);
    }
    // reqData.value.last_id = '0';
    // listData.value = [];
    rollRefresh(reqData);
};

// 清除列表数据同步轮训
const clearRefreshProject = () => {
    window.clearInterval(rollTimer.value);
    rollTimer.value = null;
};

// 清除全量检测状态
const clearFulldetectStatus = () => {
    window.clearInterval(fullRollTimer.value);
    fullRollTimer.value = null;
};

onUnmounted(() => {
    clearRefreshProject();
    clearFulldetectStatus();
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
                access_type: 'gitlab',
                team_config_id: detectInfo.team_config_id,
            });
            projectInfo.branchOptions = res.data;
        } catch (error) {
            console.log(error);
        }
    }
};

// 获取用户令牌
onBeforeMount(async () => {
    try {
        const res = await Promise.all([
            getTokenApi({
                team_id: store.teamInfo.team_id,
            }),
            getWebhookUrlApi({
                access_type: 'gitlab',
                team_id: store.teamInfo.team_id,
                detector_type: 1,
                team_config_id: detectInfo.team_config_id,
            }),
            getWebhookUrlApi({
                access_type: 'gitlab',
                team_id: store.teamInfo.team_id,
                detector_type: 3,
                team_config_id: detectInfo.team_config_id,
            }),
        ]);
        token.value = res[0].data.Token;
        url1.value = `${window.location.origin}${res[1].data.url}`;
        url2.value = `${window.location.origin}${res[2].data.url}`;
    } catch (error) {
        console.log(error);
    }
});

const changeTimeScope = (val: string) => {
    if (val === 'default') {
        detectInfo.repo_last_active_time_days = undefined;
    } else {
        detectInfo.repo_last_active_time_start = null;
        detectInfo.repo_last_active_time_end = null;
        activeTime.value = [];
    }
};
// const createTokenHandle = async () => {
//     try {
//         const res = await Promise.all([
//             getWebhookUrlApi({
//                 access_type: 'gitlab',
//                 team_id: store.teamInfo.team_id,
//                 detector_type: 1,
//                 team_config_id: detectInfo.team_config_id,
//                 project_name: rename.value,
//             }),
//             getWebhookUrlApi({
//                 access_type: 'gitlab',
//                 team_id: store.teamInfo.team_id,
//                 detector_type: 3,
//                 team_config_id: detectInfo.team_config_id,
//                 project_name: rename.value,
//             }),
//         ]);
//         url1.value = `${window.location.origin}${res[0].data.url}`;
//         url2.value = `${window.location.origin}${res[1].data.url}`;
//     } catch (error) {
//         console.log(error);
//     }
// };

// 切换接入gitlab
const changeGitlabType = async (data: string) => {
    try {
        const res = await Promise.all([
            getWebhookUrlApi({
                access_type: 'gitlab',
                team_id: store.teamInfo.team_id,
                detector_type: 1,
                team_config_id: data,
            }),
            getWebhookUrlApi({
                access_type: 'gitlab',
                team_id: store.teamInfo.team_id,
                detector_type: 3,
                team_config_id: data,
            }),
        ]);
        url1.value = `${window.location.origin}${res[0].data.url}`;
        url2.value = `${window.location.origin}${res[1].data.url}`;
    } catch (error) {
        console.log(error);
    }
};

// 设置检测配置
const toSetDetectConfig = (type: number) => {
    let configId = '';
    if (type === 1) {
        const arr = url1.value.split('/');
        configId = arr[arr.length - 1];
    } else {
        const arr = url2.value.split('/');
        configId = arr[arr.length - 1];
    }
    detectInfo.project_config_id = configId;
    detectInfo.config_type = 'webhook';
    router.push(`/detect-config?from=gitlabwebhook&id=${configId}&type=detectConfig`);
};

const checkGitlabBranch = (item: any) => {
    if (item.checked && !detectInfo.gitlab_branch_condition_list.some((ele) => ele.type === item.type)) {
        detectInfo.gitlab_branch_condition_list.push(item);
    }
    if (!item.checked) {
        item.day_number = '';
        item.keyword = '';
        detectInfo.gitlab_branch_condition_list = detectInfo.gitlab_branch_condition_list.filter((ele) => ele.type !== item.type);
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
        detectInfo.detect_type = 4;
        router.push('/detect-config?from=gitlab');
    } else if (activeTab.value === 2) {
        if (detectInfo.gitlab_branch === 'condition_list' && !detectInfo.gitlab_branch_condition_list.length) {
            showMessage('请至少填写一项自定义分支的规则', 'warning');
            return;
        }
        detectInfo.detect_type = 2;
        router.push('/detect-config?from=gitlab');
    }
};
</script>

<style lang='less' scoped>
.top_btn {
    margin-bottom: 16px;
    .between();
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
}

.btn {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;
}
</style>
