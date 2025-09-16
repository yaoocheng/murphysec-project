<template>
    <!-- <CommonHead>
        <span>我的工作台</span>
    </CommonHead> -->

    <div class="platform_index main_content">
        <div class="left_content">
            <!-- <div class="sport">
                <div class="sport_title">安全是一项团队运动</div>
                <div class="sport_desc">邀请您的团队成员查看和修复项目中的安全漏洞</div>
                <el-button class="sport_invite">
                    邀请新成员
                </el-button>
                <i class="murphy icon-guanbi"></i>
            </div> -->

            <div class="questions">
                <div class="head">
                    <div class="name">
                        待解决安全问题
                    </div>
                    <!-- <div style="cursor:pointer" @click="$router.push('/platform/issue');"> -->
                    <div class="button-text-blue " @click="$router.push('/platform/issue');">
                        查看全部<i class="murphy icon-youjiantou"></i>
                    </div>
                </div>

                <div class="item_question" v-for="(item, key) in renderData.safeProblemList?.list" :key="key">
                    <div class="content">
                        <div class="question_name">
                            <div class="wrap_name g-mr-4" @click="showIssueDetail = true; securityId = item.id">
                                {{ item.title }}
                            </div>

                            <el-tooltip effect="light" placement="top">
                                <TagComp class="g-mr-4" :content="getRepaireLevelTool(item.highest_suggest).text"
                                         :c="getRepaireLevelTool(item.highest_suggest).color"
                                         :bgc="getRepaireLevelTool(item.highest_suggest).bgc" />

                                <template #content>
                                    <SuggestTips :text="getRepaireLevelTool(item.highest_suggest).text" />

                                </template>
                            </el-tooltip>

                            <el-tooltip v-if="item.is_triggers === 1" effect="light" placement="top">
                                <TagComp class="g-mr-4" :content="'可触发漏洞'" />

                                <template #content>
                                    <div style="color: #2A2B32;">
                                        什么是可触发漏洞？<a href="/docs/glossary/vulnerability-reachability.html"
                                                    target="_blank">详情</a>
                                    </div>
                                </template>
                            </el-tooltip>

                            <el-tooltip v-if="item.is_online === 1" effect="light" placement="top">
                                <TagComp class="g-mr-4" :content="'线上依赖'" />

                                <template #content>
                                    <div style="color: #2A2B32;">
                                        什么是线上依赖？<a href="/docs/glossary/production-dependencies.html"
                                                   target="_blank">详情</a>
                                    </div>
                                </template>
                            </el-tooltip>

                            <el-tooltip v-if="item.detection_strategy_name && item.detection_strategy_name.length">
                                <TagComp class="g-mr-4" c="#049FD7" bgc="#14C0FF33" :content="item.detection_strategy_name[0]" />

                                <template #content>
                                    <div v-for="ele in item.detection_strategy_name" :key="ele">
                                        {{ ele }}
                                    </div>
                                </template>
                            </el-tooltip>
                        </div>
                        <div class="question_info">
                            <div class="person">
                                创建人
                                <div class="person_wrap">
                                    <UserComp :name="item.created_user_name" />
                                </div>
                            </div>
                            <div class="person">
                                负责人
                                <div class="person_wrap">
                                    <UserComp :name="item.owner_user_name" />
                                </div>
                            </div>
                            <div class="belong">
                                所属代码项目
                                <el-tooltip placement="top" :content="item.subtask_name">
                                    <span class="project_name" style="border-radius: 0;">{{ item.subtask_name }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="btns" @click="showIssueDetail = true; securityId = item.id">
                        <el-button>快速修复</el-button>
                    </div>
                </div>
                <NoData v-if="!renderData.safeProblemList?.list || !renderData.safeProblemList?.list?.length" />
            </div>

            <div class="detect">
                <div class="head">
                    <div class="name">
                        最近检测项目
                    </div>
                    <!-- <div style="cursor:pointer" @click=" $router.push('/project/list')"> -->
                    <div class="button-text-blue" @click=" $router.push('/project/list')">
                        查看全部
                        <i class="murphy icon-youjiantou"></i>
                    </div>
                </div>

                <div v-if="renderData.detectProjectList?.length" class="table_wrap">
                    <div class="thead">
                        <div class="th" style="width:18px"></div>
                        <div class="th" style="flex: 1">项目名称</div>
                        <!-- <div class="th" style="width:18%">所属项目组</div> -->
                        <div class="th" style="width:170px">最新检测时间</div>
                        <div class="th" style="width:112px">检测状态</div>
                    </div>
                    <div class="tbody" v-for="item in renderData.detectProjectList" :key="item.id"
                         @click="expandHandle(item)">
                        <div class="list_item">
                            <div class="td" style="width:18px">
                                <span class="expand_icon">
                                    <i class="murphy icon-youjiantou" style="font-size: 12px;" v-if="!item.expand"></i>
                                    <i class="murphy icon-xiala1" v-else></i>
                                </span>
                            </div>
                            <div class="td ellipsis" style="flex: 1; width: 0;">
                                <el-tooltip placement="top">
                                    <template #content>
                                        {{ item.name }}
                                    </template>
                                    <!-- <div class="project_name"> -->
                                    {{ item.name }}
                                    <!-- {{ item.name.substring(0, 30) }}<span v-if="item.name.length > 30">...</span> -->
                                    <!-- </div> -->
                                </el-tooltip>
                            </div>
                            <div class="td" style="width:170px">
                                <div>
                                    {{ formatDate(item.updated_at) }}
                                </div>
                            </div>
                            <div class="td" style="width:112px">
                                <span class="status" style=" background: #7F3BF533;color: #6425D0;"
                                      v-if="item.status === 1">
                                    <i class="murphy icon-shijian"></i>
                                    队列中...
                                </span>
                                <span class="status" style=" background: #14C0FF33;color: #049FD7;"
                                      v-else-if="item.status === 2">
                                    <i class="murphy icon-detecting"></i>
                                    运行中
                                </span>
                                <span class="status" style=" background: #34c72433;color: #2EA121;"
                                      v-else-if="item.status === 3">
                                    <i class="murphy icon-wancheng2"></i>
                                    检测成功
                                </span>
                                <span class="status" style="background: #1F23291A;color: #646A73;"
                                      v-else-if="item.status === 8">
                                    <i class="murphy icon-cuowu"></i>
                                    检测取消
                                </span>
                                <div v-else>
                                    <span class="status" style="background: #F54A4533;color: #D83931;">
                                        <i class="murphy icon-cuowu"></i>
                                        检测失败
                                    </span>
                                    <el-tooltip placement="top" :content="getDetectStatus(item.status)">
                                        <span class="tanhao">
                                            <i class="murphy icon-tixing"></i>
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>

                        <div class="expand_content" @click.stop v-if="item.expand">
                            <div class="history_item"
                                 @click.stop=" checkDetail(ele.status, item.id, ele.id)"
                                 v-for="(ele, i) in item.history" :key="i">
                                <div class="td" style="flex:1">
                                    <div>
                                        <img style="margin-right: 8px;" :src="getAccessImg(ele.access_type)" alt="">
                                        <span class="time">{{ formatDate(ele.created_at) }}</span>
                                    </div>
                                </div>
                                <div class="td" style="width: 16%;">
                                    <i style="color: #858585;" class="murphy icon-code-branch"></i>
                                    {{ ele.branch || '-' }}
                                </div>
                                <div class="td" style="width: 12%;">
                                    <span style="font-size: 12px; color: #8F959E">组件</span>
                                    {{ ele.comp_num }}
                                </div>
                                <div class="td" style="width: 12%;color: #F34D3D;">
                                    <span style="font-size: 12px;color: #8F959E">漏洞</span>
                                    {{ ele.leak_num }}
                                </div>
                                <div class="td" style="width: 12%;color: #F34D3D;">
                                    <span style="font-size: 12px;color: #8F959E">缺陷组件</span>
                                    {{ ele.strong_num + ele.recommend_num + ele.optional_num }}
                                </div>
                                <div class="td" style="width: 18%;">
                                    <el-tooltip placement="top" content="强烈建议修复">
                                        <span class="tag">{{ ele.strong_num }}</span>
                                    </el-tooltip>
                                    <el-tooltip placement="top" content="建议修复">
                                        <span class="tag">{{ ele.recommend_num }}</span>
                                    </el-tooltip>
                                    <el-tooltip placement="top" content="可选修复">
                                        <span class="tag">{{ ele.optional_num }}</span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NoData v-else />
            </div>

            <div class="projects">
                <div class="head">
                    <div class="name">
                        代码托管项目
                    </div>
                    <!-- <div style="cursor:pointer" @click=" $router.push('/code')"> -->
                    <div class="button-text-blue" @click=" $router.push('/code')">
                        查看全部
                        <i class="murphy icon-youjiantou"></i>
                    </div>
                </div>

                <div v-if="renderData.codeProjectList?.list?.length" class="detect-table">
                    <el-table :data="renderData.codeProjectList?.list"
                              :header-cell-style="{ padding: '14px 0', border: 'none', background: '#F7F8FB', color: '#8F959E', fontWeight: 400 }"
                              :header-row-style="{ borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }"
                              style="width: 100%">
                        <el-table-column label="项目名称" show-overflow-tooltip>
                            <template #default="scope">
                                <div class="project_name">
                                    <img :src="getAccessImg(JSON.parse((scope as any).row.enable_access_types)[0])"
                                         alt="">
                                    {{ (scope as any).row.name }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="安全问题" width="160">
                            <template #default="scope">
                                <div>
                                    <el-tooltip content="强烈建议修复" placement="top">
                                        <span class="risk_grade" style="color:#D83931;background:#F54A4533">
                                            {{ (scope as any).row.strong_num }}
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip content="建议修复" placement="top">
                                        <span class="risk_grade" style="color:#DE7802;background:#FF880033">
                                            {{ (scope as any).row.recommend_num }}
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip content="可选修复" placement="top">
                                        <span class="risk_grade" style="color:#5C3A00;background:#FFC60A33">
                                            {{ (scope as any).row.optional_num }}
                                        </span>
                                    </el-tooltip>
                                    <!-- <el-tooltip content="低危" placement="top">
                                        <span class="risk_grade" style="color:#00136B;background:#A3ACD633">
                                            {{ (scope as any).row.vuln_low_num }}
                                        </span>
                                    </el-tooltip> -->
                                    <!-- <span class="no_risk">
                                        风险未知
                                    </span> -->
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template #default="scope">
                                <div class="btns" v-if="(scope as any).row.last_subtask_id === '0'">
                                    <el-button class="hover_btn1" @click=" startDetectHandle((scope as any).row)">
                                        开始检测
                                    </el-button>
                                </div>
                                <div class="btns" v-else>
                                    <!-- <el-button class="share_btn"
                                        @click=" $router.push(`/detect-config?from=${JSON.parse((scope as any).row.enable_access_types)[0]}&id=${(scope as any).row.team_config_id}&type=config`) ">
                                        配置
                                    </el-button> -->
                                    <el-button class="hover_btn1"
                                               @click=" restartDetectHandle((scope).row.last_project_id, JSON.parse((scope).row.enable_access_types)[0], scope.row.last_subtask_id)">
                                        再次检测
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <NoData v-else />
            </div>
        </div>

        <div class="right_content">
            <el-button class="add_detect" @click=" $router.push('/integrate')">
                <i class="murphy icon-jiahao-"></i>
                新建项目检测
            </el-button>
            <div class="simple_info">
                <div class="item">
                    <div>
                        <i class="murphy icon-Union"></i>
                        我的专家分
                        <el-tooltip placement="top">
                            <i class="murphy icon-wenhaoxiao"></i>
                            <template #content>
                                当修复安全问题后会奖励修复人对应专家分，<a target="_balnk" style="color: #fff;text-decoration: underline;"
                                                       href="/docs/faqs/security-issues/security-proficiency-score.html">详细规则</a>
                            </template>
                        </el-tooltip>
                    </div>
                    <div class="grade">{{ renderData.numData?.personal_score_total }}</div>
                </div>
                <div class="item">
                    <div>
                        <i class="murphy icon-a-Union1"></i>
                        待处理问题
                    </div>
                    <div class="grade">{{ renderData.numData?.security_owner_count }}</div>
                </div>
                <div class="item">
                    <div>
                        <i class="murphy icon-a-Union2"></i>
                        团队成员
                    </div>
                    <el-tooltip placement="top" :content="`共有${renderData.numData?.team_member_count}协作者`">
                        <div class="grade">
                            <img style="right: 0; z-index: 5;" src="~ast/img/1.jpg" alt="">
                            <img style="right: 12px; z-index: 4;" src="~ast/img/2.jpg" alt="">
                            <img style="right: 24px; z-index: 3;" src="~ast/img/3.jpg" alt="">
                            <div class="member_num">+{{ renderData.numData?.team_member_count }}</div>
                        </div>
                    </el-tooltip>
                </div>
            </div>

            <div class="dynamics">
                <div class="head">
                    <div class="name">
                        个人动态
                    </div>
                    <!-- <div style="cursor:pointer;font-size: 12px;color: #858585;">
                        查看全部
                        <i class="murphy icon-youjiantou" style="font-size: 12px;"></i>
                    </div> -->
                </div>

                <div class="item" v-for="(item, index) in renderData.personalLog.slice(0, 10)      " :key="index">
                    <!-- <div class="dynamic_content" v-html="item.show_title"></div>
                    <div class="grade" v-if="item.log_type === 1">
                        个人专家分 <span style="font-size: 16px;">{{ item.personal_score }} <img class="up_arrow"
                                src="~ast/img/up_arrow.png" alt=""></span>
                    </div> -->
                    <div style="display: inline-block;vertical-align: 2px;margin-right: 4px;">
                        <UserComp
                            v-if="item.log_type !== 20 && item.log_type !== 23 && item.log_type !== 22 && item.log_type !== 11"
                            :name="item.user_name" />
                    </div>
                    <span v-if="item.log_type === 21">
                        <span class="text">扫描了项目后，系统检测后创建了该安全问题</span>
                    </span>
                    <span v-else-if="item.log_type === 8">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">待修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 6">
                        <span class="text">提交了PR</span>
                    </span>
                    <span v-else-if="item.log_type === 1">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">已修复</span> </span>
                    </span>
                    <span v-else-if="item.log_type === 20">
                        <span class="text"><span class="g-fw-500">「系统」</span>本次检测到安全问题依旧存在，已重新打开安全问题，安全问题状态为 <span
                            class="g-fw-500">待修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 5">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">7天忽略</span>
                            <div class="g-color-3 g-mt-4">原因：{{ item.log_desc.split('：')[0] }}</div>
                            <div class="g-color-3 g-mt-4" v-if="item.log_desc.split('：')[1]">说明： {{
                                item.log_desc.split('：')[1] }}</div>
                        </span>
                    </span>
                    <span v-else-if="item.log_type === 23">
                        <span class="text">7天忽略已到期，<span class="g-fw-500">「系统」</span>已重新打开安全问题，安全状态为 <span
                            class="g-fw-500">待修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 2">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">关闭</span>
                            <div class="g-color-3 g-mt-4">原因：{{ item.log_desc.split('：')[0] }}</div>
                            <div class="g-color-3 g-mt-4" v-if="item.log_desc.split('：')[1]">说明： {{
                                item.log_desc.split('：')[1] }}</div>
                        </span>
                    </span>
                    <span v-else-if="item.log_type === 4">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">待修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 22">
                        <span class="text"><span class="g-fw-500">「系统」</span>本次未检测到该安全问题，安全问题被关闭，安全问题状态为 <span
                            class="g-fw-500">已修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 3">
                        <span class="text">将安全问题指派给
                            <span style="vertical-align: 2px;">
                                <UserComp :name="item.related_user_name" />
                            </span>
                        </span>
                    </span>
                    <span v-else-if="item.log_type === 11">
                        <span class="text">接入了一个代码项目</span>
                    </span>

                    <div style="word-break: break-all;" @click="showIssueDetail = true; securityId = item.security_id"
                         class="hover_text g-color-1 g-mt-4">
                        {{ item.name }}
                    </div>

                    <div class="time">
                        {{ formatDate(item.created_at) }}
                    </div>
                </div>
                <NoData :image-size="100" v-if="!renderData.personalLog || !renderData.personalLog?.length" />
            </div>
        </div>
    </div>

    <IssueDetailModal v-model="showIssueDetail" v-if="showIssueDetail" :securityId="securityId" />

</template>

<script setup lang='ts'>
import { onBeforeMount, reactive, ref } from 'vue';
import store, { detectInfo } from 'util/store';
import NoData from 'comp/NoData.vue';
import {
    getRepaireLevelTool, getAccessImg, formatDate, showMessage, getDetectStatus,
} from 'util/tools';
import { useRouter } from 'vue-router';
import {
    getConsoleProjectListApi, getHistoryListApi, getPlatformSecurityListApi, getPlatformDataApi, getPlatformProjectListApi, getPlatformLogApi,
} from 'api/project';
import UserComp from 'comp/UserComp.vue';
import IssueDetailModal from './IssueDetailModal.vue';

// import CommonHead from '@/components/CommonHead.vue';

const showIssueDetail = ref<boolean>(false);
const securityId = ref<string>('');
const router = useRouter();
const reqData = {
    team_id: store.teamInfo?.team_id,
    limit: 5,
    page: 1,
};
const renderData = reactive<{
    safeProblemList: {
        list: Array<any>,
    },
    codeProjectList: {
        list: Array<any>,
    },
    numData: any,
    personalLog: Array<any>,
    detectProjectList: Array<any>,
}>({
    safeProblemList: {
        list: [],
    },
    codeProjectList: {
        list: [],
    },
    numData: {},
    personalLog: [],
    detectProjectList: [],
});

onBeforeMount(async () => {
    try {
        const res = await Promise.all([
            getPlatformSecurityListApi(reqData),
            getPlatformProjectListApi(reqData),
            getPlatformDataApi(reqData),
            getPlatformLogApi(reqData),
            getConsoleProjectListApi({
                limit: 3,
                page: 1,
                team_id: store.teamInfo.team_id,
            }),
        ]);
        [renderData.safeProblemList, renderData.codeProjectList, renderData.numData, renderData.personalLog] = res.map((item) => item.data);
        renderData.detectProjectList = res[4].data.list;
    } catch (error) {
        console.log(error);
    }
});

// 开始检测
interface Obj {
    [key: string]: number
}
const detectTypeObj: Obj = {
    github: 8,
    gitlab: 4,
    gitee: 15,
};
const startDetectHandle = (data: any) => {
    detectInfo.team_config_id = data.team_config_id;
    [detectInfo.access_type] = JSON.parse(data.enable_access_types);
    detectInfo.detect_type = detectTypeObj[JSON.parse(data.enable_access_types)[0]];
    detectInfo.repos = [
        {
            git_addr: data.addr,
            git_branch: data.branch,
        },
    ];
    router.push(`/detect-config?from=${JSON.parse(data.enable_access_types)[0]}&type=detect`);
};

// 再次检测
const restartDetectHandle = async (id: string, type: string, sid:string) => {
    router.push(`/detect-config?from=${type}&id=${id}&type=restart&sid=${sid}`);
};

// 历史记录
const expandHandle = async (item: any) => {
    if (!item.history) {
        try {
            const res = await getHistoryListApi({
                project_id: item.id,
                limit: 5,
                page: 1,
                team_id: store.teamInfo.team_id,
            });
            item.history = res.data.list || [];
            item.created_at = item.history[0]?.created_at;
        } catch (error) {
            console.log(error);
        }
    }
    item.expand = !item.expand;
};

// 查看详情
const checkDetail = (status: number, tid: string, sid: string) => {
    if (status === 3) {
        router.push(`/detail/${tid}/${sid}`);
    } else if (status === 1 || status === 2) {
        showMessage('正在检测中，无法查看安全报告', 'warning');
    } else {
        showMessage('检测失败，无法查看安全报告', 'warning');
    }
};
</script>

<style lang='less' scoped>
.platform_index {
    padding: 0;
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    .left_content {
        flex: 3;
        margin-right: 24px;

        .sport {
            width: 100%;
            height: 118px;
            background-color: #6C87FF0D;
            border: 1px solid #6C87FF;
            border-radius: 6px;
            box-sizing: border-box;
            padding: 16px;
            position: relative;
            margin-bottom: 24px;

            i {
                position: absolute;
                right: 18px;
                top: 18px;
                font-size: 22px;
                color: #B8B8B8;
                cursor: pointer;
            }
        }

        .sport_title {
            color: #3c3c3c;
            margin-bottom: 5px;
        }

        .sport_desc {
            color: #858585;
            margin-bottom: 14px;
        }

        .el-button.sport_invite {
            width: 76px;
            height: 28px;
            font-size: 12px;
        }

        .name {
            font-size: 22px;
            font-weight: 500;
            color: #3c3c3c;
        }

        .head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            color: #858585;
            margin-bottom: 16px;
            font-weight: 400;

        }

        .questions {
            padding: 16px;
            background-color: #fff;
            border-radius: 6px;
            padding-bottom: 1px;
            margin-bottom: 24px;

            .item_question {
                background: #F5F6FA;
                border-radius: 6px;
                height: 87px;
                padding: 16px;
                box-sizing: border-box;
                .between();
                margin-bottom: 16px;

                .el-button {
                    width: 64px;
                    height: 28px;
                    font-size: 12px;
                }

                .content {
                    flex: 1;
                    margin-right: 16px;
                    width: 0;
                }
            }

            .question_name {
                display: flex;
                align-items: center;
                color: #3c3c3c;
                font-size: 14px;
                width: 100%;
                margin-bottom: 12px;

                .wrap_name {
                    &:hover {
                        color: #6C87FF;
                        text-decoration: underline;
                    }

                    font-weight: 500;
                    max-width: 50%;
                    cursor: pointer;
                    .ellipsis();
                }

                .tag {
                    margin-left: -4px;
                    padding: 3px 4px;
                    background: rgba(255, 136, 0, 0.2);
                    border-radius: 4px;
                    font-size: 12px;
                    color: #fff;
                    font-weight: 500;
                    transform: scale(0.8);
                }
            }

            .question_info {
                display: flex;
                font-size: 12px;
                color: #8F959E;

                img {
                    width: 20px;
                    height: 20px;
                    margin: 2px 4px 2px 2px;
                    border-radius: 50%;
                }

                .person,
                .person_wrap {
                    .center();
                }

                .belong span,
                .person_wrap {
                    margin-left: 6px;
                    color: #3c3c3c;
                    font-size: 14px;
                    background: #EFF0F1;
                    padding-right: 8px;
                    border-radius: 17px;
                }

                .belong span {
                    background-color: transparent;
                }

                .project_name {
                    max-width: 160px;
                    border-radius: 0px;
                    .ellipsis();
                }

                .person {
                    margin-right: 14px;

                    .created_user_name {
                        display: inline-block;
                        max-width: 80px;
                        .ellipsis();
                    }
                }

                .belong {
                    max-width: 60%;
                    .ellipsis();
                    .center();
                }
            }
        }

        .projects {
            padding: 16px;
            background-color: #fff;
            border-radius: 6px;
            margin-bottom: 24px;

            img {
                width: 20px;
                border-radius: 50%;
                margin-right: 8px;
            }

            .project_name {
                // &:hover {
                //     text-decoration: underline;
                // }
                cursor: pointer;
                // .between();
                color: #3c3c3c;
                padding: 10px 0;

                img {
                    border-radius: 50%;
                    vertical-align: -5px;
                }
            }

            .risk_grade,
            .no_risk {
                padding: 4px 6px;
                border-radius: 4px;
                background-color: rgba(245, 74, 69, 0.2);
                color: #D83931;
                margin-right: 6px;
                font-size: 12px;
            }

            .no_risk {
                background-color: rgba(31, 35, 41, 0.1);
                color: #646A73;
            }

            .el-button {
                &:hover {
                    background-color: #6C87FF1A;
                }

                width: 64px;
                height: 28px;
                border: 1px solid #6C87FF;
                border-radius: 6px;
                font-size: 12px;
                color: #6C87FF;
                background-color: #fff;
            }
        }

        .detect {
            padding: 16px;
            background-color: #fff;
            border-radius: 6px;
            margin-bottom: 24px;

            .table_wrap {
                background-color: #fff;
                color: #3c3c3c;
                font-size: 14px;
                height: calc(100% - 145px);
                overflow: auto;
                border-radius: 6px;

                .tbody {
                    border-bottom: 1px solid #EFF0F1;
                }

                img {
                    width: 20px;
                    border-radius: 50%;
                    vertical-align: -5px;
                }

                .project_name {
                    // &:hover {
                    //     color: #6C87FF;
                    //     text-decoration: underline;
                    // }
                    display: inline-block;
                    cursor: pointer;
                    color: #3c3c3c;
                    padding: 10px 0;
                }

                .add {
                    &:hover {
                        background-color: #EBEBEB;
                    }

                    width: 28px;
                    height: 28px;
                    padding: 6px;
                    border-radius: 6px;
                    cursor: pointer;
                    box-sizing: border-box;

                    i {
                        font-size: 14px;
                    }
                }

                .thead {
                    display: flex;
                    align-items: center;
                    height: 56px;
                    background: #F7F8FB;
                    padding: 0 16px;
                    font-size: 14px;
                    color: #8F959E;
                    border-radius: 4px;
                    margin-bottom: 1px;
                }

                th {
                    .ellipsis();
                }

                .list_item {
                    &:hover {
                        .expand_icon {
                            display: inline-block;
                        }

                        background-color: #6c87ff0e;
                    }

                    .expand_icon {
                        display: none;
                    }

                    vertical-align: middle;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    height: 56px;
                    padding: 0 16px;
                    margin-bottom: 1px;
                    transition: background-color .2s;

                    .status {
                        padding: 5px 6px;
                        font-size: 12px;
                        border-radius: 4px;

                        i {
                            font-size: 14px;
                            vertical-align: -1px;
                        }
                    }

                    .tanhao {
                        &:hover {
                            background-color: #F54A4533;
                        }

                        width: 26px;
                        height: 24px;
                        text-align: center;
                        line-height: 24px;
                        border-radius: 4px;
                        display: inline-block;
                        vertical-align: middle;
                        margin-left: 4px;

                        i {
                            color: #D83931;
                        }
                    }

                }

                .history_item {
                    display: flex;
                    align-items: center;
                    height: 56px;
                    padding: 0 16px;
                    background-color: #F7F8FB;
                    border-radius: 8px;
                    margin: 8px 0;
                    margin-left: 20px;
                    cursor: pointer;

                    .time:hover {
                        text-decoration: underline;
                        color: #6c87ff;
                    }

                    .td {
                        .ellipsis();
                    }

                    .user {
                        display: inline-block;
                        background-color: #EFF0F1;
                        height: 20px;
                        line-height: 20px;
                        border-radius: 16px;
                        padding-right: 5px;
                    }

                    img {
                        border-radius: 0;
                    }

                    .tag {
                        background: rgba(245, 74, 69, 0.2);
                        border-radius: 4px;
                        padding: 3px 6px;
                        margin-right: 4px;
                        font-size: 13px;
                        color: #D83931;
                        font-weight: 500;
                        display: inline-block;
                    }

                    .tag:nth-of-type(2) {
                        background-color: rgba(255, 136, 0, 0.2);
                        color: #DE7802;
                    }

                    .tag:nth-of-type(3) {
                        background-color: rgba(31, 35, 41, 0.1);
                        color: #646A73;
                    }
                }
            }
        }
    }

    .right_content {
        width: 334px;
        // flex: 1;

        .add_detect {
            &:hover {
                background-color: #6C87FF1A;
            }

            height: 42px;
            width: 100%;
            background: #FFFFFF;
            border: 1px solid #6C87FF;
            border-radius: 6px;
            color: #6C87FF;
            margin-bottom: 24px;

            i {
                margin-right: 8px;
            }
        }

        .simple_info {
            background: #FFFFFF;
            padding: 16px;
            padding-bottom: 1px;
            color: #858585;
            font-size: 16px;
            border-radius: 6px;
            margin-bottom: 24px;

            img {
                width: 20px;
                border-radius: 50%;
            }

            i {
                color: #C7C7C7;
            }

            .item {
                .between();
                margin-bottom: 16px;
                position: relative;
            }

            .grade {
                color: #3c3c3c;

                img {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }

                .member_num {
                    font-size: 12px;
                    color: #fff;
                    position: absolute;
                    right: 4px;
                    bottom: 3px;
                    z-index: 99;
                    font-weight: 500;
                    transform: scale(0.8);
                }
            }
        }

        .dynamics {
            padding: 16px;
            background-color: #fff;
            border-radius: 6px;
            color: #525252;

            .head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                color: #3c3c3c;
                margin-bottom: 16px;

                .name {
                    font-weight: 600;
                }
            }

            .item {
                &:nth-last-of-type(1) {
                    margin-bottom: 0;
                }

                line-height: 22px;
                margin-bottom: 24px;
            }

            .dynamics_title {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                margin-bottom: 8px;
                line-height: 30px;
            }

            .person_wrap {
                color: #3c3c3c;
                .center();
                margin-right: 4px;
                font-weight: 600;

                img {
                    width: 24px;
                    border-radius: 50%;
                    margin-right: 3px;
                }

                // .person_name {
                //     display: inline-block;
                //     max-width: 40px;
                //     .ellipsis();
                // }
            }

            .small_person {
                background: rgba(31, 35, 41, 0.1);
                border-radius: 10px;
                font-size: 12px;
                margin: 0 4px;
                color: #525252;
                .center();
                padding: 0 6px;
                padding-left: 0;
                max-height: 20px;

                img {
                    width: 18px;
                    border-radius: 50%;
                    margin-right: 2px;
                }
            }

            .desc {
                margin-bottom: 8px;
                line-height: 20px;
            }

            .grade {
                color: #858585;
                margin-bottom: 8px;

                span {
                    color: #F34D3D;
                }

                .up_arrow {
                    width: 8px;
                }
            }

            .time {
                font-size: 12px;
                color: #B8B8B8;
            }
        }
    }
}
</style>

<style lang="less">
.dynamic_content {
    line-height: 24px;
    margin-bottom: 4px;

    span:nth-of-type(2) {
        margin: 0 6px;
    }
}

.detect-table .el-table .cell {
    padding: 0 16px;
}
</style>
