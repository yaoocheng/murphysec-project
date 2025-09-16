<template>
    <div>
        <div class="head_wrap">
            <div class="head">
                <div class="title">
                    <img style="margin-right: 10px" :src="$systemConfig.mainLogo" alt="">
                    <span>
                        帮助开发者快速提升代码安全
                    </span>
                </div>
                <div class="verify">
                    <img style="width: 430px;" src="~ast/img/report_img.png" alt="">
                </div>
            </div>
        </div>
        <div class="problem_detail main_content" v-loading="loading">
            <div class="problem_head_Content">
                <el-tooltip effect="light" placement="top">
                    <div class="repair_level" :style="{ background: getRepaireLevelTool(info.highest_suggest).color }">
                        {{ getRepaireLevelTool(info.highest_suggest).text }}
                    </div>
                    <template #content>
                        <SuggestTips :text="getRepaireLevelTool(info.highest_suggest).text" />

                        <!-- <div style="color: #2A2B32;">
                            什么是处置等级？<a href="/docs/faqs/security-issues/security-issue-priorities.html"
                                target="_blank">详情</a>
                        </div> -->
                    </template>
                </el-tooltip>
                <div class="g-flex-grow-1">
                    <div class="name">
                        <span class="g-display-inline-block ellipsis" style="max-width: 80%;">{{ info.title || '-'
                        }}</span>
                        <el-tooltip v-if="info.is_online === 1" effect="light" placement="top">
                            <span class="tag">线上依赖</span>
                            <template #content>
                                <div style="color: #3c3c3c;">
                                    什么是线上依赖？<a href="/docs/glossary/production-dependencies.html" target="_blank">详情</a>
                                </div>
                            </template>
                        </el-tooltip>

                        <el-tooltip
                            v-if="info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.is_triggers)"
                            effect="light" placement="top">
                            <span class="tag">可触发漏洞</span>
                            <template #content>
                                <div style="color: #3c3c3c;">
                                    什么是可触发漏洞？<a href="/docs/glossary/vulnerability-reachability.html"
                                                target="_blank">详情</a>
                                </div>
                            </template>
                        </el-tooltip>

                        <el-tooltip
                            v-if="info.comp_info?.detection_strategy_name && info.comp_info?.detection_strategy_name.length">
                            <span class="tag">{{ info.comp_info?.detection_strategy_name[0] }}</span>
                            <template #content>
                                <div v-for="item in info.comp_info?.detection_strategy_name" :key="item">
                                    {{ item }}
                                </div>
                            </template>
                        </el-tooltip>
                        <!-- <i v-if="!$route.path.includes('report')" class="murphy icon-fenxiang1"
                            style="font-size: 24px;vertical-align: -5px;cursor: pointer;"
                            @click="store.isShowShareReportModal = true; store.securityId = securityId;"></i> -->
                    </div>
                    <div class="import_info">
                        <!-- 在{{ info.subtask_name }}项目中 -->
                        <span v-if="info.comp_info?.module_path && info.comp_info?.module_path?.length">
                            由<i class="murphy icon-xiangmu1"></i> <span>{{
                                info.comp_info?.module_path[0]?.associated_file_path
                            }}</span> {{ info.comp_info.module_path[0]?.is_direct ? '直接引入' : '间接引入' }}</span>
                        <span class="hover_btn1" @click="sourceOpenHandle">
                            <i class="murphy icon-source"></i>
                            溯源
                        </span>
                    </div>
                </div>
            </div>

            <div class="problem_content">
                <div class="left_content">
                    <div class="left_wrap">
                        <div class="left_title" v-if="info.comp_info?.effects">
                            <div>
                                <span></span>
                                漏洞影响分析
                            </div>
                            <div v-if="info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.is_triggers)"
                                 style="color: #6C87FF; font-size: 14px;cursor: pointer;" @click="realUseModal = true">
                                漏洞触发路径</div>
                        </div>
                        <div class="influence_content" v-if="info.comp_info?.effects"
                             :class="{ 'expand': isCheckMoreVuln }">
                            <div class="explain">
                                <div>
                                    {{ getRepaireLevelTool(info.highest_suggest).text }}
                                    <a href="/docs/faqs/security-issues/security-issue-priorities.html"
                                       target="_blank">说明</a>
                                </div>
                                <div class="desc">
                                    <span
                                        :class="{ 'none': !info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.poc) }"
                                        style="color: #049FD7; background: #14C0FF33;">POC</span>
                                    <span
                                        :class="{ 'none': !info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.exploit_requirement_cost === '低') }"
                                        style="color: #DE7802; background: #FF880033">攻击成本低</span>
                                    <span
                                        :class="{ 'none': !info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.scope_influence === '广') }"
                                        style="color: #B220B2; background: #D136D133;">影响范围广</span>
                                    <span
                                        :class="{ 'none': !info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.is_triggers) }"
                                        style="color: #2946C7; background: rgba(73, 102, 230, 0.2);">可触发漏洞</span>
                                </div>
                            </div>
                            <div class="desc">
                                {{ $systemConfig.longName }}专家分析：该缺陷组件
                                <p style="display: inline-block"
                                   v-if="info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.level === 'Critical')">
                                    涉及严重漏洞、
                                </p>
                                <p v-if="info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.poc)">有POC、
                                </p>
                                <p
                                    v-if="info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.exploit_requirement_cost === '低')">
                                    攻击成本低、</p>
                                <p
                                    v-if="info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.scope_influence === '广')">
                                    影响范围广，</p>
                                <p
                                    v-if="info.comp_info?.effects?.some((item: any) => item?.full_vuln_data?.is_triggers)">
                                    可触发漏洞，
                                </p>
                                <p>{{ getRepaireLevelTool(info.highest_suggest).text }}</p> &nbsp;
                            </div>

                            <div class="vuln_item"
                                 :style="{ borderColor: getDangerLevel(item?.full_vuln_data?.level).color }"
                                 v-for="(item, index) in info.comp_info?.effects" :key="index">
                                <div class="item" style="width: 45%;">
                                    <p>漏洞编号</p>
                                    <p>
                                        <a :href="generateVulnLink(item.mps_id, item.cve_id)" target="_blank"
                                           style="color:#6C87FF;">{{ item?.full_vuln_data?.cve_id ||
                                               item?.full_vuln_data?.mps_id }}
                                        </a>
                                        <span class="tag" v-if="!item?.full_vuln_data?.cve_id">CVE未收录漏洞</span>
                                        <span class="tag" v-if="item?.full_vuln_data?.is_sole">独家漏洞</span>
                                        <span class="tag" v-if="item?.full_vuln_data?.cwe_id === 'CWE-506'">投毒组件</span>
                                    </p>
                                </div>
                                <div class="item" style="width: 14%;">
                                    <p>POC</p>
                                    <p style="color:#F34D3D">{{ item?.full_vuln_data?.poc ? '有' : '无' }}</p>
                                </div>
                                <div class="item" style="width: 14%;">
                                    <p>攻击成本</p>
                                    <p>{{ item?.full_vuln_data?.exploit_requirement_cost || '暂无' }}</p>
                                </div>
                                <div class="item" style="width: 14%;">
                                    <p>影响范围</p>
                                    <p
                                        :style="{ color: item?.full_vuln_data?.scope_influence ? '#F34D3D' : '#3c3c3c' }">
                                        {{
                                            item?.full_vuln_data?.scope_influence || '暂无' }}</p>
                                </div>
                                <div class="item" style="width: 14%;">
                                    <p>可触发漏洞</p>
                                    <p>{{ item?.full_vuln_data?.is_triggers ? '是' : '否' }}</p>
                                </div>
                                <!-- <div style="color: #6C87FF;font-size: 14px;">
                            查看代码调用点
                        </div> -->
                            </div>

                            <div v-if="info.comp_info?.effects?.length > 1">
                                <div class="hide" v-if="!isCheckMoreVuln"></div>
                                <div class="check_more" @click="isCheckMoreVuln = !isCheckMoreVuln">
                                    <span>
                                        {{ isCheckMoreVuln ? '收起' : '点击查看更多漏洞' }}
                                        <i v-if="!isCheckMoreVuln" class="murphy icon-xiala1"></i>
                                        <i v-else class="murphy icon-shouqi"></i>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="left_title"
                             v-if="info.comp_info?.detection_strategy_info && info.comp_info?.detection_strategy_info?.length">
                            <div>
                                <span></span>
                                命中策略
                            </div>
                        </div>
                        <div class="strategy_content" v-for="(item, index) in info.comp_info?.detection_strategy_info"
                             :key="index">
                            <div class="title">
                                {{ item.name }}
                            </div>
                            <div class="part">
                                <div>说明</div>
                                {{ item.defect_info }}
                            </div>
                            <div class="part">
                                <div>修复方案</div>
                                {{ item.defect_fix }}
                            </div>
                        </div>

                        <!-- 修复方案 -->
                        <!-- 旧修复 -->
                        <FixPlan v-if="isGetData && !isHasStrategy && isOldFix" :info="info" />

                        <!-- 新修复 -->
                        <IssueFix v-if="isGetData && !isHasStrategy && !isOldFix" />

                        <!-- <div class="left_title">
                        <div>
                            <span></span>
                            修复方案
                        </div>
                    </div> -->

                        <!-- <div class="repair_plan_content" v-if="info.fixPlans?.length" style="height: 120px;"
                        :class="{ 'expand': isCheckMorePlans }">
                        <div class="repair_item">
                            <div class="plans">
                                <p v-for="(item, index) in info.fixPlans" :key="index">
                                    <span v-if="item.target_version">{{ `将组件${info.comp_name}升级到${item.target_version}版本及以上` }}</span>
                                    <span v-else-if="!item.target_version&&item.description">{{ item.description }}</span>
                                    <span class="recom" v-if="item.target_version && item.compatibility_score > 67">推荐</span>
                                    <span class="compa compa1" v-if="item.target_version && (item.compatibility_score >= 0 && item.compatibility_score < 100)"
                                        @click="compatibleTargetVersion = item.target_version; isShowCompatibleModal = true">兼容性风险：存在</span>
                                    <span class="compa compa2"
                                        v-else-if="item.target_version && item.compatibility_score === 100">兼容性风险：未发现</span>
                                    <span class="compa compa3" v-else-if="!item.target_version&&item.description">兼容性风险：未知</span>
                                </p>
                            </div>
                        </div>

                        <div v-if="info.fixPlans?.length > 1">
                            <div class="hide" v-if="!isCheckMorePlans"></div>
                            <div class="check_more" @click="isCheckMorePlans = !isCheckMorePlans">
                                <div>
                                    {{ isCheckMorePlans ? '收起' : '点击查看更多修复方案' }}
                                    <i v-if="!isCheckMorePlans" class="murphy icon-xiala1"></i>
                                    <i v-else class="murphy icon-shouqi"></i>
                                </div>
                            </div>
                        </div>
                    </div> -->
                        <!-- 快速修复 -->
                        <!-- <div class="left_title" v-if="!info.comp_info?.detection_strategy_info?.length">
                            <div>
                                <span></span>
                                如何快速修复
                            </div>
                        </div> -->
                        <!-- 修复tab -->
                        <!-- <div class="common_tabs" v-if="!info.comp_info?.detection_strategy_info?.length">
                            <span
                                v-if="isPr(info.subtask?.access_type) && info.comp_info?.fix_plans?.plan2?.target_version && info?.ecosystem === 'maven'"
                                @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">创建PR修复</span>
                            <span @click="activeTab = 2"
                                v-if="info.comp_info?.fix_plans?.plan2?.target_version && info?.ecosystem === 'maven'"
                                :class="{ 'active': activeTab === 2 }">修复代码</span>
                            <span v-if="!$systemConfig.isClose" @click="activeTab = 3"
                                :class="{ 'active': activeTab === 3 }">IDE插件自动修复</span>
                        </div> -->

                        <!-- 修复筛选 -->
                        <!-- <div class="select_plan" v-if="activeTab === 1">
                        <el-select v-model="planValue" style="width: 50%;margin-bottom: 16px;">
                            <el-option v-for="item in planOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>

                    <div class="repair_wrap" v-if="activeTab === 1">
                        <div class="pr_content" v-for="(item, index) in store.pullRequescCompData" :key="index">
                            <RepairComp :info="item" :index="index" />
                        </div>
                    </div> -->
                        <!-- PR代码 -->
                        <!-- <PrComp
                            v-if="activeTab !== 3 && Object.keys(info).length && !info.comp_info?.detection_strategy_info?.length && info.comp_info?.fix_plans?.plan2?.target_version && info?.ecosystem === 'maven'"
                            :info="info" /> -->

                        <!-- pr button -->
                        <!-- <div class="pr_btn_wrap"
                            v-if="activeTab === 1 && !info.comp_info?.detection_strategy_info?.length && !store.isAllTeam && !$route.path.includes('report')">
                            <div v-if="canPr">
                                <el-button v-if="!info.pr_url" @click="pullRequestHandle">
                                    提交 Pull Request</el-button>
                                <a :href="info.pr_url" v-else target="_blank">
                                    <el-button class="minor_btn">
                                        查看PR
                                    </el-button>
                                </a>
                            </div>
                            <div v-else>
                                <span>
                                    <i class="murphy icon-tishishuoming"
                                        style="font-size: 13px;color:#858585;margin-right:4px"></i>
                                    可联系管理员开放此功能，<a href="/docs/faqs/security-issues/how-to-quick-fixes.html"
                                        target="_blank" style="color: #6C87FF;">如何申请？</a>
                                </span>
                                <el-button disabled>
                                    提交 Pull Request
                                </el-button>
                            </div>
                        </div> -->

                        <!-- <div class="repair_wrap" v-if="activeTab === 2">
                        <div class="pr_content" v-for="(item, index) in (info.repairCode)" :key="index">
                            <RepairComp :info="item" />
                        </div>
                    </div> -->

                        <!-- IDE修复 -->
                        <!-- <div class="repair_wrap"
                            v-if="activeTab === 3 && !info.comp_info?.detection_strategy_info?.length && !$systemConfig.isClose">
                            <div class="pr_content">
                                <p>操作方法</p>
                                <p>第一步：JetBrains IDE中安装插件 “MurphySec Code Scan”</p>
                                <p>第二步：使用插件完成检测后，可通过“快速修复”功能，将缺陷组件直接升级至最优安全版本</p>
                                <img style="width: 100%; margin: 12px 0;" src="~ast/img/idea_repair.png" alt="">
                                <a target="_blank"
                                    href="https://www.murphysec.com/docs/faqs/security-issues/how-to-quick-fixes.html">查看文档
                                    <i style="vertical-align: -2px;" class="murphy icon-jiantou-you"></i></a>
                            </div>
                        </div> -->
                    </div>
                </div>

                <div class="right_content">
                    <!-- <div class="ai-chat g-mb-16 g-flex g-align-center g-justify-between g-p-16 g-border-box g-color-fff"
                    v-if="store.conf.is_private_demo_env">
                    <div class="g-flex g-align-center">
                        <img style="width: 32px;height: 32px;" class="g-mr-12" src="~ast/img/AI-chat.png" alt="">
                        <div class="g-ml-36">
                            <div class="g-f-16 g-mb-8">
                                MurphySec Al Copilot
                            </div>
                            <div class="g-f-12">
                                您的开源组件选型AI助手
                            </div>
                        </div>
                    </div>
                    <div @click="isShowAi = true" class="g-cursor-pointer">开启对话</div>
                </div> -->

                    <IssueStatus :info="info" v-if="Object.keys(info).length" />

                    <div class="code_info" v-if="store.isAllTeam">
                        <div class="name">
                            团队信息
                        </div>
                        <div class="item">
                            <div>所属团队</div>
                            <div class="info">{{ info.team_name }}</div>
                        </div>
                        <div class="item">
                            <div>团队负责人</div>
                            <div class="small_person">
                                <UserComp :name="info.owner_user_name" />

                            </div>
                        </div>
                    </div>

                    <div class="code_info">
                        <div class="name">
                            所属代码项目信息
                        </div>
                        <div class="item">
                            <div>项目名称</div>
                            <div class="info">{{ info.subtask_name }}</div>
                        </div>
                        <div class="item">
                            <div>项目分支</div>
                            <div class="info">{{ info.branch || '-' }}</div>
                        </div>
                        <div class="item">
                            <div>Commit ID</div>
                            <div class="info">{{ info.commit?.slice(0, 7) || '-' }} <i v-if="info.commit"
                                                                                       id="copy-commit" :data-clipboard-text="info.commit"
                                                                                       @click="copyFunc('#copy-commit')" class="g-cursor-pointer murphy icon-fuzhi1"></i>
                            </div>
                        </div>
                        <div class="item">
                            <div>项目地址</div>
                            <div class="info link">
                                <a :href="info.addr" target="_blank">{{ info.addr || '-' }}</a>
                            </div>
                        </div>
                        <div class="item" v-if="info.subtask?.author">
                            <div>Last commiter</div>
                            <div class="small_person">
                                <UserComp :name="info.subtask?.author" />
                            </div>
                        </div>
                    </div>

                    <div class="fund_info">
                        <div class="name">
                            安全问题基本信息
                        </div>
                        <div class="item">
                            <div style="margin-bottom: 4px;">创建人</div>
                            <div class="small_person">
                                <UserComp :name="info.created_user_name" />
                            </div>
                        </div>
                        <div class="item">
                            <div v-if="!store.isAllTeam" style="margin-bottom: 4px;"
                                 @click="store.isShowChangePrincipal = true; store.securityId = info.id">
                                负责人
                                <!-- <i v-if="!$route.path.includes('report')"
                                    style="color: #6C87FF;font-size: 14px;cursor: pointer;"
                                    class="murphy icon-principal"></i> -->
                            </div>
                            <div class="small_person">
                                <UserComp :name="info.owner_user_name" />
                            </div>
                        </div>
                        <div class="item">
                            <div style="margin-bottom: 6px;">创建时间</div>
                            <div class="info">{{ formatDate(info.created_at) }}</div>
                        </div>
                    </div>

                    <div class="code_info">
                        <div class="name">
                            组件引入信息
                        </div>
                        <div v-if="info.import_object && info.import_object?.length">
                            <div class="item">
                                <div>提交人</div>
                                <div class="info">{{ info.import_object[0]?.username }}</div>
                            </div>
                            <div class="item">
                                <div>提交邮箱</div>
                                <div class="info">{{ info.import_object[0]?.email }}</div>
                            </div>
                            <div class="item">
                                <div>commit</div>
                                <div class="info" style="word-break: break-all;">
                                    {{ info.import_object[0]?.commit }}
                                    <i class="murphy icon-fuzhi1 g-cursor-pointer g-color-5" id="copy_url"
                                       :data-clipboard-text="info.import_object[0]?.commit"
                                       @click="copyFunc('#copy_url')"></i>
                                </div>
                            </div>
                            <div class="item">
                                <div>提交时间</div>
                                <div class="info">
                                    {{ info.import_object[0]?.submit_time ?
                                        formatDate(info.import_object[0]?.submit_time) : '-'
                                    }}
                                </div>
                            </div>
                        </div>

                        <NoData v-else :image-size="80" description="未获取到组件引入相关信息" />
                    </div>

                    <div class="dynamic">
                        <div class="name">安全问题动态</div>
                        <div class="item" v-for="(item, index) in info.repository_log" :key="index">
                            <div class="time">{{ formatDate(item.created_at) }}</div>
                            <div class="dynamic_content" v-html="item.show_title"></div>
                        </div>
                        <NoData :image-size="80" v-if="!info.repository_log || !info.repository_log.length" />
                    </div>
                </div>
            </div>

            <TraceMap v-model="isShowTraceMap" v-if="graph" :graph="graph" :graphLoading="graphLoading" :curCompInfo="info.comp_info"
                      :codeFragment="info?.comp_info?.code_fragment_result" :basisData="basisData" />

            <ChangePrincipal v-model="store.isShowChangePrincipal" v-if="store.isShowChangePrincipal"
                             :currentUser="info.owner_user_id" />

            <!-- 真实利用 -->
            <RealUseModal v-model="realUseModal" v-if="realUseModal" :info="info" />

            <SbomSourceModal v-model="isShowSourceModal" v-if="isShowSourceModal"
                             :sbomSourceReqData="sbomSourceReqData" />

            <!-- <el-drawer :size="'60%'" :show-close="false" v-model="isShowAi" :lock-scroll="false">
            <MfGptChat :componentName="info.comp_name" :chatID="chatID"
                :sugQuestion="[`和 ${info.comp_name} 功能类似的开源组件有哪些？给出对比分析`, '解读下这个组件的开源许可证要求']" :disabledInput="false" />
        </el-drawer> -->
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import {
    getRepaireLevelTool, formatDate, getDangerLevel, copyFunc,
} from 'util/tools';
import store from 'util/store';
import {
    getSafeQuestionInfoApi, getSafeQuestionGraphApi, getTraceBasisDataApi,
} from 'api/project';
import UserComp from '@/components/UserComp.vue';
import NoData from '@/components/NoData.vue';
import RealUseModal from './Issue/RealUseModal.vue';
import IssueStatus from './Issue/IssueStatus.vue';
import TraceMap from './comp/TraceMap.vue';
import ChangePrincipal from './comp/ChangePrincipal.vue';
import FixPlan from './Issue/FixPlan.vue';
import IssueFix from './IssueFix/Index.vue';
import SbomSourceModal from '../project/detail/components/SbomSourceModal.vue';
import { fixState } from './composable/use-issue-fix';

// const route = useRoute();
// const securityId = ref<string>(route.params.id as string);

const info = ref<any>({});
const isCheckMoreVuln = ref<boolean>(false);
const isShowTraceMap = ref<boolean>(false);
const isShowSourceModal = ref<boolean>(false);
const graph = ref<any>();
const isOldFix = ref<boolean>(false);
const isGetData = ref(false);
const isHasStrategy = ref<boolean>(false);

// const isShowAi = ref<boolean>(false);
// const chatID = ref<any>('');

// const packages = ['npm', 'maven', 'python', 'go/golang'];
const realUseModal = ref<boolean>(false);
const loading = ref<boolean>(false);

onBeforeMount(async () => {
    loading.value = true;
    try {
        const res = await getSafeQuestionInfoApi({
            // team_id: store.teamInfo.team_id,
            // security_id: securityId.value,
        });
        info.value = res.data;
        fixState.issueInfo = res.data;
        isOldFix.value = res.data.power_version?.includes('disabled_fix_plan_change');
        isGetData.value = res.data;
        isHasStrategy.value = info.value.comp_info?.detection_strategy_info?.length;
        loading.value = false;
        // // tab显示是否pr 无最小修复版本不可pr
        // if (!info.value.comp_info?.fix_plans?.plan2?.target_version || info.value?.ecosystem !== 'maven') {
        //     activeTab.value = 3;
        // } else {
        //     activeTab.value = (isPr(info.value.subtask?.access_type) ? 1 : 2);
        // }

        // /**
        //  * 直接依赖  fix_block_data
        //  * 间接依赖  dm(code自己拼) + fix_block_data
        //  */
        // if (info.value.fix_block_data) {
        //     info.value.fix_block_data = info.value.fix_block_data.filter((item: any) => item.fix_plan && Object.keys(item.fix_plan)?.length);
        //     // info.value.deal_fix_block_data = [...info.value.fix_block_data];
        //     // info.value.fix_block_data = info.value.fix_block_data?.map((item:any) => ({
        //     //     is_direct: info.value.is_direct_dependency,
        //     //     direct_comp: info.value.comp_name,
        //     //     min_fix_version: item.fix_plan.plan1.target_version,
        //     //     ...item,
        //     // }));
        // }

        // store存储提pr组件列表
        // store.pullRequescCompData = info.value.fix_block_data || [];
        // store.pullRequescCompData = store.pullRequescCompData?.map((item) => ({
        //     is_direct: info.value.is_direct_dependency,
        //     direct_comp: info.value.comp_name,
        //     min_fix_version: '',
        //     ...item,
        // }));

        // 安全问题分享  加入团队
        // if (route.query.allow) {
        //     await questionJoinTeamApi({
        //         team_id: info.value.team_id,
        //         security_id: route.params.id,
        //     });
        //     const teamData = await getTeamListApi();
        //     const currentInfo = teamData.data.filter((item: any) => item.team_id === info.value.team_id)[0];
        //     store.teamInfo = currentInfo;
        //     localStorageUtil('set', 'g-t', currentInfo);
        //     showMessage('加入团队成功', 'success');
        //     window.location.href = `/console/question-detail/${route.params.id}`;
        // }

        // 授权返回绑定对应接入方式
        // if (route.query.from === 'github') {
        //     await bindGithubHandle(route.query.code as string, 'public_repo');
        //     await updatedAccessApi({
        //         team_id: store.teamInfo.team_id,
        //         access_type: 'github',
        //     });
        // } else if (route.query.from === 'gitee') {
        //     await bindGiteeHandle(route.query.code as string);
        //     await updatedAccessApi({
        //         team_id: store.teamInfo.team_id,
        //         access_type: 'gitee',
        //     });
        // }

        // 能否PR
        // const res1 = await canPrApi();
        // canPr.value = res1.data;

        // 生成ChatID
        // chatID.value = Md5.hashStr(`${info.value.comp_name + store.userInfo.id}`);
    } catch (error) {
        console.log(error);
    }

    // try {
    //     const res = await getSafeQuestionGraphApi({
    //         // team_id: store.teamInfo.team_id,
    //         // security_id: securityId.value,
    //     });
    //     graph.value = res.data.graph;

    //     graph.value.nodes = graph.value?.nodes?.map((item: any, index: number) => ({
    //         id: index,
    //         name: String(index),
    //         show_name: item.comp_name || item.module?.name,
    //         comp_version: item.comp_version || item.module?.version,
    //         license: item.Licenses && item.Licenses[0]?.spdx,
    //         is_direct_dependency: item.is_direct_dependency,
    //         suggest_level: item.suggest_level,
    //     }));
    //     graph.value.edge = graph.value?.edge?.map((item: any) => ({
    //         source: String(item.source),
    //         target: String(item.target),
    //         value: 1,
    //     }));
    // } catch (error) {
    //     console.log(error);
    // }
});

// 生成漏洞链接 xxx.com/hd/MPS-xxx-xxx
const generateVulnLink = (mpsId: any, cveId: any) => {
    const baseUrl = window.location.origin;
    const id = mpsId || cveId;
    return `${baseUrl}/hd/${id}`;
};

const sbomSourceReqData = ref<any>({});
const basisData = ref({});
const graphLoading = ref(false);
const sourceOpenHandle = async () => {
    isShowTraceMap.value = true;
    graphLoading.value = true;
    if (info.value?.comp_info?.is_ac) {
        isShowSourceModal.value = true;
        sbomSourceReqData.value = {
            subtask_id: info.value?.subtask?.id,
            project_id: info.value?.subtask?.project_id,
            project_name: info.value?.comp_info?.comp_name,
            name: info.value?.comp_info?.comp_name,
            version: info.value?.comp_info?.comp_version,
        };
    } else {
        try {
            const res = await getSafeQuestionGraphApi({
                // team_id: store.teamInfo.team_id,
                // security_id: securityId.value,
            });
            graph.value = res.data.graph;

            graph.value.nodes = graph.value?.nodes?.map((item: any, index: number) => ({
                id: index,
                name: String(index),
                show_name: item.comp_name || item.module?.name,
                comp_version: item.comp_version || item.module?.version,
                license: item.Licenses && item.Licenses[0]?.spdx,
                is_direct_dependency: item.is_direct_dependency,
                suggest_level: item.suggest_level,
            }));
            graph.value.edge = graph.value?.edge?.map((item: any) => ({
                source: String(item.source),
                target: String(item.target),
                value: 1,
            }));
        } catch (error) {
            console.log(error);
        }

        // 溯源依据
        const { data } = await getTraceBasisDataApi({
            subtask_id: info.value?.subtask?.id,
            project_id: info.value?.subtask?.project_id,
            comp_name: info.value.comp_info.comp_name,
            comp_version: info.value.comp_info.comp_version,
            ecosystem: info.value.comp_info.ecosystem,
            repository: info.value.comp_info.repository,
        });
        basisData.value = data;
        graphLoading.value = false;
    }
};

// 提pr
// const pullRequestHandle = async () => {
//     const prReqData = {
//         repoType: info.value.subtask?.access_type,
//         compList: store.pullRequescCompData,
//         package_manager: info.value.ecosystem,
//         commitHash: info.value?.commit,
//         owner: info.value.owner_user_name,
//         url_repo: info.value.addr,
//         securityId: securityId.value,
//         title: info.value?.title,
//         branch: info.value.branch,
//         effects: info.value?.comp_info?.effects,

//         dm_fix: store.isDmFix,
//         direct_dependency_list: info.value?.comp_info?.direct_list,
//     };

//     try {
//         await pullRequestApi(prReqData);
//         showMessage('提交成功', 'success');
//         window.location.reload();
//     } catch (error) {
//         console.log(error);
//     }
// };
</script>

<style lang='less' scoped>
.head_wrap {
    background-color: #F8F8FC;
}

.hide_modal_img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.head {
    max-width: 1280px;
    margin: 0 auto;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: #5572F4;
    font-weight: 600;

    .title {
        display: flex;
        align-items: center;

        img {
            width: 32px;
            height: 32px;
        }
    }
}

.shrink {
    width: 32px;
    vertical-align: -10px;
    cursor: pointer;
}

.problem_detail {
    padding: 24px;
    font-size: 14px;
    height: 100%;
    max-width: 1280px;
    margin: 0 auto;

    .tag {
        padding: 3px 6px;
        background: rgba(73, 102, 230, 0.2);
        border-radius: 4px;
        font-size: 12px;
        color: rgb(41, 70, 199);
        font-weight: 500;
    }

    .share_btn {
        &:hover {
            background-color: #EBEBEB80;
        }

        width: 80px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #D0D3D6;
        color: #3c3c3c;
        font-size: 16px;
        margin-top: 24px;
        position: absolute;
        right: 24px;
        top: 0;

        i {
            margin-right: 5px;
            font-size: 20px;
        }
    }

    .problem_head_Content {
        height: 118px;
        background: #FFFFFF;
        border-radius: 6px;
        padding: 24px;
        box-sizing: border-box;
        display: flex;
        margin-bottom: 16px;
        position: relative;

        .repair_level {
            width: 64px;
            height: 64px;
            background: #F34D3D;
            border-radius: 6px;
            line-height: 64px;
            text-align: center;
            font-size: 24px;
            color: #fff;
            margin-right: 12px;
            overflow: hidden;
        }

        .name {
            font-size: 24px;
            font-weight: 500;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            width: 100%;
        }

        .import_info {
            font-size: 16px;
            color: #8F959E;
            font-size: 14px;

            span.hover_btn1 {
                display: inline-block;
                border: 1px solid #6C87FF;
                background-color: #fff;
                color: #6C87FF;
                font-size: 14px;
                padding: 1px 6px;
                border-radius: 6px;
                margin-left: 4px;
                cursor: pointer;
            }
        }
    }

    .problem_content {
        display: flex;
        justify-content: space-between;

        .left_content {
            flex: 3;
            margin-right: 16px;
            width: 0;

            .left_wrap {
                background-color: #fff;
                border-radius: 6px;
                padding: 24px;

            }

            .left_title {
                font-size: 18px;
                color: #3c3c3c;
                margin-bottom: 16px;
                font-weight: 500;
                .between();

                span {
                    width: 2px;
                    height: 16px;
                    display: inline-block;
                    background: #6C87FF;
                    border-radius: 100px;
                    vertical-align: -2px;
                    margin-right: 8px;
                }
            }

            .strategy_content {
                padding: 24px;
                background-color: #F7F8FB;
                border-radius: 4px;
                margin-bottom: 16px;

                .title {
                    color: @text-color;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 8px;
                }

                .part {
                    padding: 16px;
                    background-color: #fff;
                    border-radius: 4px;
                    color: #858585;
                    margin-bottom: 10px;

                    div {
                        margin-bottom: 6px;
                    }
                }
            }

            .influence_content,
            .repair_plan_content {
                padding: 24px;
                background-color: #F7F8FB;
                border-radius: 4px;
                position: relative;
                box-sizing: border-box;
                height: 200px;
                overflow: hidden;
                margin-bottom: 32px;

                .explain {
                    font-size: 14px;
                    color: @text-color;
                    font-weight: 500;
                    margin-bottom: 8px;
                    .between();

                    span {
                        color: #6C87FF;
                        font-weight: 400;
                        cursor: pointer;
                    }

                    .desc span {
                        background: rgba(31, 35, 41, 0.1);
                        border-radius: 4px;
                        padding: 2px 5px;
                        margin-right: 5px;
                        font-size: 12px;
                        color: #646A73;
                    }

                    .desc span.none {
                        display: none;
                    }
                }

                .desc {
                    font-size: 14px;
                    color: #3c3c3c;
                    margin-bottom: 16px;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                }

                .vuln_item {
                    height: 74px;
                    background: #FFFFFF;
                    margin-bottom: 12px;
                    border-radius: 6px;
                    border-left: 4px solid #F34D3D;
                    display: flex;
                    align-items: center;
                    padding-left: 16px;
                    font-size: 12px;
                    color: #8F959E;

                    .tag {
                        display: inline-block;
                        margin-right: -6px;
                        transform: scale(0.8);
                    }

                    .item p:nth-of-type(1) {
                        margin-bottom: 10px;
                    }

                    .item p:nth-of-type(2) {
                        font-size: 14px;
                        color: #3c3c3c;
                    }
                }

                .hide {
                    position: absolute;
                    left: 0;
                    bottom: 51px;
                    height: 40px;
                    width: 100%;
                    background: linear-gradient(to bottom, #f7f8fb00 0%, #F7F8FB 100%);
                }

                .check_more {
                    &:hover {
                        color: #6C87FF;
                    }

                    position: absolute;
                    left: 0;
                    bottom: 0;
                    height: 51px;
                    width: 100%;
                    background-color: #F7F8FB;
                    color: #858585;
                    cursor: pointer;
                    line-height: 51px;
                    padding-left: 24px;

                    i {
                        font-size: 22px;
                        vertical-align: middle;
                    }
                }
            }

            .influence_content.expand,
            .repair_plan_content.expand {
                height: auto !important;
                padding-bottom: 51px;
            }

            .repair_plan_content {
                .plans {
                    background: #FFFFFF;
                    border-radius: 4px;
                    padding: 16px;
                    box-sizing: border-box;
                    color: #525252;
                    line-height: 24px;
                }

                span.recom {
                    background: rgba(73, 102, 230, 0.2);
                    border-radius: 4px;
                    padding: 2px 4px;
                    color: #2946C7;
                    font-size: 12px;
                    margin-right: 6px;
                    margin-left: 4px;
                }

                span.compa {
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    border: 1px solid #F34D3D;
                    background: #F34D3D0D;
                    color: #F34D3D;
                    margin-left: 4px;
                }

                span.compa1 {
                    border: 1px solid #F34D3D;
                    background: #F34D3D0D;
                    color: #F34D3D;
                    cursor: pointer;
                }

                span.compa2 {
                    border: 1px solid #38C728;
                    background: #38C7280D;
                    color: #38C728;
                }

                span.compa3 {
                    border: 1px solid #858585;
                    background: #8585850D;
                    color: #858585;
                }

                p {
                    margin-bottom: 8px;
                }

                .plans p:nth-of-type(1) {
                    color: #3c3c3c;
                }

                .plans p:nth-last-of-type(1) {
                    margin-bottom: 0;
                }
            }

            .repair_wrap {
                padding: 24px;
                background-color: #F7F8FB;
                border-radius: 4px;

                .pr_content {
                    background: #FFFFFF;
                    border-radius: 4px;
                    padding: 16px;
                }

                p {
                    color: #3c3c3c;
                    margin-bottom: 8px;
                }

                p:nth-of-type(1) {
                    color: #858585;
                }
            }

            .pr_btn_wrap {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-top: 16px;

                span {
                    margin-right: 8px;
                    font-size: 12px;
                    color: @text-color;
                }
            }
        }

        .right_content {
            flex: 1;

            .ai-chat {
                width: 100%;
                height: 78px;
                border-radius: 6px;
                background: linear-gradient(135deg, #6C87FF 0%, #996DF7 100%);
            }

            .name {
                font-size: 16px;
                margin-bottom: 16px;
                color: #3c3c3c;
                font-weight: 500;
            }

            .code_info,
            .fund_info,
            .dynamic {
                background: #FFFFFF;
                border-radius: 6px;
                padding: 16px;
                font-size: 12px;
                color: #8F959E;
                margin-bottom: 16px;
            }

            .dynamic {
                max-height: 800px;
                overflow: auto;
            }

            .small_person {
                display: inline-block;
                background: rgba(31, 35, 41, 0.1);
                border-radius: 10px;
                font-size: 12px;
                color: #3c3c3c;
                // padding: 4px 8px;
                padding-right: 6px;
                margin-top: 6px;

                img {
                    width: 20px;
                    border-radius: 50%;
                    vertical-align: -5px;
                }
            }

            .item {
                margin-bottom: 12px;
            }

            .item .link {
                color: #6C87FF;
                word-break: break-all;
            }

            .info {
                font-size: 14px;
                color: #3c3c3c;
                margin-top: 4px;
            }

            .dynamic {
                margin-bottom: 0;

                img {
                    width: 24px;
                    border-radius: 50%;
                    vertical-align: middle;
                    margin-bottom: 4px;
                }

                .time {
                    margin-bottom: 8px;
                }

                .user {
                    color: #3c3c3c;
                }

                .item {
                    font-size: 14px;
                    color: #525252;
                    padding-bottom: 8px;
                }
            }
        }
    }
}
</style>

<style lang="less">
.dynamic .dynamic_content {
    line-height: 24px;

    span:nth-of-type(2) {
        margin: 0 6px;
    }
}

.el-drawer__header {
    margin-bottom: 0;
    padding: 0;
}

.el-drawer__body {
    padding: 0;
}
</style>
