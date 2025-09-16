<template>
    <div class="timing g-color-1 g-bg-f7 g-p-16 g-bdr-6">
        <div class="g-mb-16 g-fw-500 g-f-16 g-flex g-justify-between">
            <div>
                定时检测配置
                <span class="tag" v-if="!detectInfo.cron_expression_detail?.value">未配置</span>
                <span class="tag" v-else>已配置</span>
            </div>
            <div @click="excModal = true" class="g-color-3 g-f-14 g-fw-400 g-cursor-pointer">
                执行记录 <i class="murphy icon-youjiantou11"></i>
            </div>
        </div>
        <div class="g-mb-16">
            <div class="form_label g-fw-500" style="margin-bottom: 11px;">
                <span class="text-err">*</span>
                选择已接入的GitLab
            </div>
            <el-select @change="getTimeConfig(detectInfo.team_config_id)" v-model="detectInfo.team_config_id">
                <el-option
                    v-for="item in store.allAccessInfo.gitlab.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                    :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>

        <div v-if="!isConfig">
            <div class="g-p-16 g-bdr-6 g-bg-ff g-mb-16 ">
                <div class="g-color-3 g-mb-16 g-fw-500">设置检测范围</div>

                <div class="g-mb-4 g-fw-500">仓库最后活跃时间</div>
                <el-radio-group @change="changeTimeScope" v-model="detectInfo.pull_time_type">
                    <el-radio label="default">绝对时间范围</el-radio>
                    <el-radio label="days">相对时间范围</el-radio>
                </el-radio-group>
                <div class="mt-2 mb-6">
                    <el-date-picker v-if="detectInfo.pull_time_type === 'default'" clearable v-model="activeTime"
                                    @change="[detectInfo.repo_last_active_time_start, detectInfo.repo_last_active_time_end] = activeTime || []"
                                    type="daterange" style="width: 350px;" start-placeholder="开始时间" end-placeholder="结束时间" />
                    <div class="text-3c" v-else-if="detectInfo.pull_time_type === 'days'">
                        最近 <el-input-number :precision="0" placeholder="请输入天数1-999" :controls="false" class="mx-1 w-36"
                                            v-model="detectInfo.repo_last_active_time_days" :min="1" :max="9999" />
                        天活跃的仓库
                    </div>
                </div>

                <div class="g-mb-8 g-fw-500">语言分布</div>
                <el-select class="g-mb-24 w-[370px]" v-model="detectInfo.repo_languages" multiple placeholder="请选择语言">
                    <el-option v-for="item in langOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>

                <div class="g-mb-4 g-fw-500">
                    <span class="text-err">*</span>
                    分支
                </div>
                <!-- <el-select class="g-mb-16 w-[370px]" v-model="detectInfo.gitlab_branch" placeholder="请选择分支">
                    <el-option v-for="item in gitlabBranch" :key="item.value" :label="item.label" :value="item.value" />
                </el-select> -->
                <el-radio-group @change="detectInfo.gitlab_branch_condition_list = []; customBranch = createGitlabAllBranchOptions()" v-model="detectInfo.gitlab_branch">
                    <el-radio label="default">默认分支</el-radio>
                    <el-radio label="new">最新分支</el-radio>
                    <!-- <el-radio label="condition_list">自定义分支</el-radio> -->
                </el-radio-group>

                <!-- <div class="ml-6 mt-2 font-normal text-3c text-sm" v-if="detectInfo.gitlab_branch === 'condition_list'">
                    <div v-for="(item, i) in customBranch" :key="item.desc" class="flex items-center mb-3">
                        <el-checkbox @change="checkGitlabBranch(item)" v-model="item.checked" />
                        <span v-if="i === 1">
                            <span class="ml-2">最近</span> <el-input-number :disabled="!item.checked"
                                placeholder="请输入天数1-999" v-model="item.day_number" :precision="0" :max="999"
                                :controls="false" class="mx-2 w-36" :min="1" /> 天内活跃过，且分支名包含关键词
                            <el-input :disabled="!item.checked" v-model="item.keyword" class="mx-2 w-36"
                                placeholder="请输入关键词"></el-input>
                            的全部分支&nbsp;
                            <TipsComp :width="372" :content="item.desc" />
                        </span>

                        <span v-else-if="i === 0">
                            <span class="ml-2">最近</span> <el-input-number :disabled="!item.checked"
                                placeholder="请输入天数1-999" v-model="item.day_number" :precision="0" :max="999"
                                :controls="false" class="mx-2 w-36" :min="1" /> {{ item.text
                            }}&nbsp;
                            <TipsComp :width="372" :content="item.desc" />
                        </span>

                        <span v-else>
                            <span class="ml-2">{{ item.text }}</span>&nbsp;
                            <TipsComp :width="372" :content="item.desc" />
                        </span>
                    </div>
                </div> -->

                <div class="g-mb-4 g-fw-500 mt-4">
                    <span class="text-err">*</span>
                    归档项目
                </div>
                <el-radio-group v-model="detectInfo.include_archiving_repo">
                    <el-radio :label="1">包含</el-radio>
                    <el-radio :label="2">不包含</el-radio>
                </el-radio-group>
            </div>

            <div class="g-p-16 g-bdr-6 g-bg-ff">
                <div class="g-color-3 mb-4">设置检测时间</div>
                <div class="font-medium">
                    <span class="text-err">*</span>
                    定时检测时间
                </div>

                <el-radio-group @change="detectInfo.cron_expression_detail.value = undefined"
                                v-model="detectInfo.cron_expression_detail.unit">
                    <el-radio label="week" size="large">
                        每周
                    </el-radio>

                    <el-radio label="month" size="large">
                        每月
                    </el-radio>

                    <el-radio label="custom" size="large">
                        自定义
                    </el-radio>
                </el-radio-group>

                <div class="g-flex g-align-center" v-if="detectInfo.cron_expression_detail.unit !== 'custom'">
                    <span class="mr-2">{{ detectInfo.cron_expression_detail.unit === 'week' ? '每周' : '每月' }}</span>
                    <SelectComp v-model="detectInfo.cron_expression_detail.value"
                                :options="detectInfo.cron_expression_detail.unit === 'week' ? weekOptions : timeOptions"
                                style="width: 144px;" class="g-fw-400" />
                    <el-time-select v-model="detectInfo.cron_expression_detail.time" style="width: 144px" start="00:00"
                                    step="01:00" end="23:00" placeholder="请选择时间" />
                    <span class="g-ml-8">定时检测</span>
                </div>

                <div class="flex items-center" v-else>
                    <span class="mr-2">每</span>
                    <el-input-number :precision="0" :max="999" placeholder="请输入天数1-999" :min="0" :controls="false"
                                     class="mr-2 w-36" v-model="detectInfo.cron_expression_detail.value" /> 天
                    <el-time-select class="ml-2" v-model="detectInfo.cron_expression_detail.time" style="width: 144px"
                                    start="00:00" step="01:00" end="23:00" placeholder="请选择时间" />
                    <span class="g-ml-8">定时检测</span>
                </div>
            </div>
        </div>

        <div v-else>
            <div class="g-p-16 g-bdr-6 g-bg-ff g-mb-16 g-fw-500">
                <div class="g-color-3 g-mb-16">检测范围</div>

                <div class="g-mb-8">仓库最后活跃时间</div>
                <div v-if="detectInfo.pull_time_type === 'default'" class="g-fw-400 g-mb-16">{{
                    detectInfo.repo_last_active_time_start ?
                        `${formatDate1(detectInfo.repo_last_active_time_start)} -
                    ${formatDate1(detectInfo.repo_last_active_time_end as string)}` : '-' }}</div>
                <div class="mb-4 font-normal" v-else-if="detectInfo.pull_time_type === 'days'">
                    {{ detectInfo.repo_last_active_time_days ? `最近 ${detectInfo.repo_last_active_time_days} 天活跃的仓库` :
                        '-' }}
                </div>
                <div class="mb-4 font-normal" v-else>
                    -
                </div>

                <div class="g-mb-8">语言分布</div>
                <div class="g-fw-400 g-mb-16">
                    <span v-for="item in detectInfo.repo_languages" :key="item" class="tag g-mr-6"
                          style="transform: scale(1);background: #2A2B321A;color: #3c3c3c;">{{ item }}</span>
                    <span v-if="!detectInfo.repo_languages.length">-</span>
                </div>

                <div class="g-mb-8">分支</div>
                <div class="g-fw-400 g-mb-16" v-if="detectInfo.gitlab_branch === 'default'">默认分支</div>
                <div class="g-fw-400 g-mb-16" v-if="detectInfo.gitlab_branch === 'new'">最新分支</div>
                <div class="g-fw-400 g-mb-16" v-if="detectInfo.gitlab_branch === 'condition_list'">自定义分支</div>

                <div class="g-mb-8">归档项目</div>
                <div class="g-fw-400 g-mb-16">{{ detectInfo.include_archiving_repo === 1 ? '包含' : '不包含' }}</div>
            </div>

            <div class="g-p-16 g-bdr-6 g-bg-ff g-fw-500">
                <div class="g-color-3">检测时间</div>
                <div class="g-mt-16 g-fw-400" v-if="detectInfo.cron_expression_detail?.unit !== 'custom'">
                    每{{ detectInfo.cron_expression_detail?.unit === 'week' ? '周' : '月' }}
                    {{ getTimeText() }}
                    {{ detectInfo.cron_expression_detail?.time }}
                    <!-- {{ detectInfo.cron_expression_detail?.unit === 'week' ?
                    `${getTimeText()}` : `${detectInfo.cron_expression_detail?.value}号` }}
                    {{ detectInfo.cron_expression_detail?.time }}  -->
                    <span>定时检测</span>
                </div>
                <div class="g-mt-16 g-fw-400" v-else>
                    每 {{ getTimeText() }} 天 {{ detectInfo.cron_expression_detail?.time }} <span>定时检测</span>
                </div>
            </div>
        </div>
    </div>

    <div class="fix-btn">
        <div class="btn " v-if="!isConfig">
            <el-button @click="nextStepHandle">下一步</el-button>
        </div>

        <div class="btn" v-else>
            <el-popconfirm popper-class="cancle-popper confirm-popper" title="确定删除配置？" @confirm="delConfig">
                <template #reference>
                    <el-button class="minor_btn del-btn">删除</el-button>
                </template>
            </el-popconfirm>
            <el-button class="minor_btn" @click="isConfig = false">更改配置</el-button>
        </div>
    </div>

    <!-- 执行记录 -->
    <el-dialog width="860px" @opened="openModal" v-model="excModal" title="定时执行记录" :close-on-click-modal="false">
        <div class="change-org-content">
            <el-table :data="listData" @open="openModal" height="460px" :cell-style="{ padding: '14px 0' }"
                      :header-cell-style="{ padding: '14px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }">
                <el-table-column width="160" prop="created_at" label="执行开始时间">
                    <template #default="scope">
                        <div>
                            {{ formatDate(scope.row.created_at) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="160" prop="finish_at" label="执行结束时间">
                    <template #default="scope">
                        <div>
                            {{ formatDate(scope.row.finish_at) || '-' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="project_num" label="项目数量" />
                <el-table-column width="320" label="检测状态">
                    <template #default="scope">
                        <div>
                            <el-tooltip :content="`队列/运行中`" placement="top">
                                <!-- <div v-if="scope.row.project_num - scope.row.succ_num - scope.row.cancel_num - scope.row.fail_num > 0"
                                    style="background-color: #7F3BF566;" class="g-flex-grow-1"></div> -->
                                <StatusComp class="g-mr-8" :type="1" :bg="'#7F3BF566'" :c="'#6425D0'">
                                    {{ scope.row.project_num - scope.row.succ_num - scope.row.cancel_num -
                                        scope.row.fail_num > 0 ? scope.row.project_num - scope.row.succ_num -
                                            scope.row.cancel_num - scope.row.fail_num : 0 }}
                                </StatusComp>
                            </el-tooltip>
                            <!-- <el-tooltip content="运行中：2334（14%）" placement="top">
                                <div style="background-color: #14C0FF66;" class="g-flex-grow-1"></div>
                            </el-tooltip> -->
                            <el-tooltip :content="`检测成功`" placement="top">
                                <StatusComp class="g-mr-8" :type="3" :bg="'#34C72466'" :c="'#2EA121'">
                                    {{ scope.row.succ_num || 0 }}
                                </StatusComp>
                                <!-- <div v-if="scope.row.succ_num" style="background-color: #34C72466;"
                                    class="g-flex-grow-1"></div> -->
                            </el-tooltip>
                            <el-tooltip :content="`检测取消`" placement="top">
                                <StatusComp class="g-mr-8" :type="8" :bg="'#1F23291A'" :c="'#646A73'">
                                    {{ scope.row.cancel_num || 0 }}
                                </StatusComp>
                                <!-- <div v-if="scope.row.cancel_num" style="background-color: #2A2C3233;"
                                    class="g-flex-grow-1"></div> -->
                            </el-tooltip>
                            <el-tooltip :content="`检测失败`" placement="top">
                                <StatusComp class="g-mr-8" :type="10" :bg="'#FF525266'" :c="'#D83931'">
                                    {{ scope.row.fail_num || 0 }}
                                </StatusComp>
                                <!-- <div v-if="scope.row.fail_num" style="background-color: #FF525266;"
                                    class="g-flex-grow-1"></div> -->
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="执行状态">
                    <template #default="scope">
                        <div v-if="scope.row.project_num !== -1">
                            <div style="color: #38C728;" v-if="scope.row.status === 'finish'">已完成</div>
                            <div style="color: #049FD7;" v-if="scope.row.status === 'running'">运行中</div>
                            <div style="color: #F34D3D;" v-if="scope.row.status === 'fail'">已失败</div>
                        </div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate1, formatDate, showMessage } from 'util/tools';
import store, { detectInfo, createDetectInfo } from 'util/store';
import SelectComp from 'comp/SelectComp.vue';
import { getDetectConfigApi, timeExcRecordApi, timeExcDelApi } from 'api/detect';
import StatusComp from '@/components/StatusComp.vue';
import {
    langOptions, timeOptions, weekOptions, createGitlabAllBranchOptions,
} from '../../constants/constant';

const router = useRouter();
const isConfig = ref<boolean>(true);
const activeTime = ref<Array<string>>([]);
const excModal = ref<boolean>(false);
const listData = ref<Array<any>>([
]);
const customBranch = ref<any[]>(createGitlabAllBranchOptions());

// const checkGitlabBranch = (item: any) => {
//     if (item.checked && !detectInfo.gitlab_branch_condition_list.some((ele) => ele.type === item.type)) {
//         detectInfo.gitlab_branch_condition_list.push(item);
//     }
//     if (!item.checked) {
//         item.day_number = '';
//         item.keyword = '';
//         detectInfo.gitlab_branch_condition_list = detectInfo.gitlab_branch_condition_list.filter((ele) => ele.type !== item.type);
//     }
// };

// 定时配置
const getTimeConfig = async (id: string) => {
    try {
        const { data } = await getDetectConfigApi({
            team_config_id: id,
            access_type: 'gitlab',
            config_type: 'cron',
        });
        isConfig.value = (data.cron_expression_detail);

        if (!data.cron_expression_detail) {
            Object.assign(detectInfo, createDetectInfo());
            detectInfo.team_config_id = id;
            // detectInfo.pull_time_type = !detectInfo.pull_time_type ? 'default' : detectInfo.pull_time_type;
            // detectInfo.cron_expression_detail = { unit: 'week', value: undefined, time: '' };
        } else {
            Object.assign(detectInfo, data);
            detectInfo.pull_time_type = !detectInfo.pull_time_type ? 'default' : detectInfo.pull_time_type;

            if (Array.isArray(detectInfo.projects_id)) {
                [detectInfo.projects_id] = detectInfo.projects_id;
            }

            if (!detectInfo.repo_last_active_time_start) {
                activeTime.value = [];
            } else {
                activeTime.value = [detectInfo.repo_last_active_time_start, detectInfo.repo_last_active_time_end];
            }
        }
    } catch (error) {
        console.log(error);
    }
};
getTimeConfig(detectInfo.team_config_id);

const getTimeText = () => {
    if (detectInfo.cron_expression_detail?.unit === 'week' && detectInfo.cron_expression_detail?.value) {
        return weekOptions.find((item) => item.value === detectInfo.cron_expression_detail?.value)?.label;
    }
    if (detectInfo.cron_expression_detail?.unit === 'month' && detectInfo.cron_expression_detail?.value) {
        return timeOptions.find((item) => item.value === detectInfo.cron_expression_detail?.value)?.label;
    }
    if (detectInfo.cron_expression_detail?.unit === 'custom' && detectInfo.cron_expression_detail?.value) {
        return detectInfo.cron_expression_detail?.value;
    }
};

// 获取旧配置
const openModal = async () => {
    try {
        const { data } = await timeExcRecordApi({
            team_config_id: detectInfo.team_config_id,
        });
        listData.value = data.data;
    } catch (error) {
        console.log(error);
    }
};
openModal();

const delConfig = async () => {
    try {
        await timeExcDelApi({
            team_config_id: detectInfo.team_config_id,
            access_type: 'gitlab',
        });
        isConfig.value = false;
        activeTime.value = [];
        detectInfo.repo_languages = [];
        detectInfo.pull_time_type = 'default';
        detectInfo.gitlab_branch = 'default';
        detectInfo.include_archiving_repo = 1;
        detectInfo.project_config_id = '0';
        detectInfo.gitlab_branch_condition_list = [];
        detectInfo.cron_expression_detail = { unit: 'week', value: undefined, time: '' };
    } catch (error) {
        console.log(error);
    }
};

// 下一步
const nextStepHandle = () => {
    if (!detectInfo.cron_expression_detail?.value || !detectInfo.cron_expression_detail?.time) {
        showMessage('请选择定时时间', 'warning');
        return;
    }
    detectInfo.detect_type = 45;
    detectInfo.access_type = 'gitlab';
    detectInfo.config_type = 'cron';
    router.push('/detect-config?from=gitlab&type=detectConfig');
};

const changeTimeScope = (val: string) => {
    if (val === 'default') {
        detectInfo.repo_last_active_time_days = undefined;
    } else {
        detectInfo.repo_last_active_time_start = null;
        detectInfo.repo_last_active_time_end = null;
        activeTime.value = [];
    }
};
</script>

<style scoped lang='less'>
.btn {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;

    .el-button {
        width: 80px;
        height: 32px;
    }

    .del-btn {
        border-color: #F34D3D !important;
        background-color: #fff !important;
        color: #F34D3D !important;
    }
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
// .el-table .cell {
//     padding: 0 16px;
// }</style>
