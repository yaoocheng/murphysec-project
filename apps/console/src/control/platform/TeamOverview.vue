<template>
    <!-- <CommonHead>
        <span>团队概览</span>
    </CommonHead> -->

    <div class="team_overview main_content">
        <div class="top_charts_wrap">
            <div class="chart1 chart">
                <div class="title">
                    全部已检测项目
                </div>
                <div style="display: flex;align-items: center;justify-content: center; margin-top: 40px;">
                    <el-progress type="circle" :color="!nums.project_num_of_has_subtask ? '#f5f5f5' : '#6C87FF'"
                                 :percentage="100" :stroke-width="24" :width="180">
                        <template #default>
                            <!-- <p class="percentage_label">全部</p> -->
                            <p class="percentage_value">{{ nums.project_num_of_has_subtask }}</p>
                        </template>
                    </el-progress>
                </div>
            </div>
            <div class="chart2 chart">
                <div class="title">
                    全部安全问题状态
                    <!-- <span style="color: #858585; font-size: 14px;">单位：个</span> -->
                </div>
                <div class="chart2_content"></div>
            </div>
            <div class="chart3 chart">
                <div class="title">
                    全部安全问题处置等级
                </div>
                <div class="chart3_content"></div>
                <div class="progress">
                    <SuggestProgress :text="'强烈建议修复'" :color="`#F34D3D`" :num="nums.strong" :total="nums.total" />
                    <SuggestProgress :text="'建议修复'" :color="`#FFCC33`" :num="nums.recommend" :total="nums.total" />
                    <SuggestProgress :text="'可选修复'" :color="`#C7C7C7`" :num="nums.optional" :total="nums.total" />
                </div>
            </div>

        </div>

        <div class="question_wrap">
            <div class="title">
                <div>
                    本周新增安全问题
                    <span class="ratio">
                        <i class="murphy icon-tanhao"></i>
                        安全问题与上周比浮动 <span style="font-weight: 600;">{{ nums.security_num_of_last_week ?
                            parseInt(`${(nums.security_num_of_current_week -
                                nums.security_num_of_last_week) / nums.security_num_of_last_week * 100}`, 10) : 100
                        }}%</span>
                    </span>
                </div>
                <el-button @click="isShowReport = true">生成周报</el-button>
            </div>

            <div class="question_tabs">
                <div class="tab">
                    <span :class="{ 'active': filterOptions.fix_status === 0 }"
                          @click="filterOptions.fix_status = 0; filterOptions.page = 1; listData = []">全部
                        <span class="num">{{ nums.security_num_of_current_week }}</span>
                    </span>
                    <span :class="{ 'active': filterOptions.fix_status === 1 }"
                          @click="filterOptions.fix_status = 1; filterOptions.page = 1; listData = []">待修复
                        <span class="num">{{ nums.security_num_of_current_week_remain }}</span>
                    </span>
                    <span :class="{ 'active': filterOptions.fix_status === 2 }"
                          @click="filterOptions.fix_status = 2; filterOptions.page = 1; listData = []">已修复
                        <span class="num">{{ nums.security_num_of_current_week_fixed }}</span></span>
                    <span v-if="!$systemConfig.isGf" :class="{ 'active': filterOptions.fix_status === 3 }"
                          @click="filterOptions.fix_status = 3; filterOptions.page = 1; listData = []">7天忽略
                        <span class="num">{{ nums.security_num_of_current_week_tmp_ignore }}</span></span>
                    <span :class="{ 'active': filterOptions.fix_status === 4 }"
                          @click="filterOptions.fix_status = 4; filterOptions.page = 1; listData = []">关闭
                        <span class="num">{{ nums.security_num_of_current_week_ignore }}</span></span>
                </div>
            </div>

            <div class="content">
                <div class="left">
                    <IssueComp v-for="item in listData" :key="item.id" :data="item" />

                    <div v-if="!isHaveAllData">
                        <NoData />
                        <div style="text-align: center;">
                            <div class="g-f-14 g-color-3 g-mb-4">未检测代码项目或暂无安全问题</div>
                            <div class="g-f-14 g-color-3">可前往 <span @click="$router.push('/integrate')"
                                                                    class="g-color-5 g-cursor-pointer">新建项目检测</span> 中检测代码是否存在安全问题</div>
                        </div>
                    </div>

                    <div class="more" v-if="isHaveAllData && total > 10" @click="filterOptions.page += 1">
                        {{ !isNoMoreData ? '点击加载更多' : '无更多数据' }}
                    </div>
                </div>
                <div class="right" v-if="isHaveAllData">
                    <div class="level">
                        <div class="top">
                            <div class="title">本周全部安全问题处置等级</div>
                            <div class="suggest">
                                <div>
                                    <SuggestProgress :text="'强烈建议修复'" :color="`#F34D3D`" :num="topData.strong"
                                                     :total="topData.total" />
                                </div>
                                <div>
                                    <SuggestProgress :text="'建议修复'" :color="`#FFCC33`" :num="topData.recommend"
                                                     :total="topData.total" />
                                </div>
                                <div>
                                    <SuggestProgress :text="'可选修复'" :color="`#C7C7C7`" :num="topData.optional"
                                                     :total="topData.total" />
                                </div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="title" v-if="filterOptions.fix_status === 0 || filterOptions.fix_status === 1">
                                本周待修复安全问题
                            </div>
                            <div class="title" v-else-if="filterOptions.fix_status === 2">本周已修复安全问题</div>
                            <div class="title" v-else-if="filterOptions.fix_status === 3 && !$systemConfig.isGf">
                                本周7天忽略安全问题</div>
                            <div class="title" v-else-if="filterOptions.fix_status === 4">本周关闭安全问题</div>
                            <el-progress :percentage="topData.currentNum" :stroke-width="12" color="#6C87FF" />
                        </div>
                    </div>

                    <div class="top5">
                        <div class="top_title">TOP5</div>
                        <div style="margin-bottom: 16px;">项目安全问题</div>
                        <div class="item" v-for="(item, index) in topData?.task_top5" :key="index">
                            <div>
                                <div class="flex items-center" style="margin-bottom: 12px;">
                                    <img :src="getAccessImg(item.access_type)" alt="">
                                    <Tooltip width="370" :content="item.project_name">
                                        <span class="name"
                                              @click="$router.push(`/detail/${item.project_id}/${item.subtask_id}`)">{{
                                                  item.project_name }}
                                        </span>
                                    </Tooltip>
                                </div>
                                <div><span style="color: #858585; font-size: 12px;">分支</span> <span>{{ item.branch ||
                                    '-'
                                }}</span>
                                </div>
                            </div>
                            <div style="margin-top: 6px;" v-if="item.total < 100">
                                <el-progress type="circle" color="#6C87FF" :percentage="item.total" :width="65">
                                    <template #default>
                                        <p style="font-size: 12px;color: #858585;margin-bottom: 4px;">全部</p>
                                        <p style="font-size: 14px;color: #3c3c3c" class="percentage_value">{{ item.total
                                        }}个
                                        </p>
                                    </template>
                                </el-progress>
                            </div>
                            <div style="margin-top: 6px;" v-else>
                                <el-progress type="circle" color="#6C87FF" :percentage="100" :width="65">
                                    <template #default>
                                        <p style="font-size: 12px;color: #858585;margin-bottom: 4px;">全部</p>
                                        <p style="font-size: 14px;color: #3c3c3c" class="percentage_value">{{ item.total
                                        }}个
                                        </p>
                                    </template>
                                </el-progress>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="team_dynamic">
            <div class="title">
                团队动态
            </div>
            <div class="item" v-for="item in teamDynamicData" :key="item.id">
                <!-- <div>
                    <div class="dynamic_content" v-html="item.show_title"></div>
                    <div class="grade" v-if="item.log_type === 1">
                        个人专家分 <span style="font-size: 16px;">10 <img class="up_arrow" src="~ast/img/up_arrow.png"
                                alt=""></span>
                    </div>
                </div> -->
                <div>
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

                    <div @click="showIssueDetail = true; securityId = item.security_id"
                         class="hover_text g-color-1 g-mt-8 g-mb-8">
                        {{ item.name }}
                    </div>
                </div>

                <div class="time">{{ formatDate(item.created_at) }}</div>
            </div>

            <div v-if="!teamDynamicData.length">
                <noData />
                <div class="g-f-14 g-color-3 g-mb-4" style="text-align: center;">接入代码仓库、检测项目和修复安全问题会产生动态</div>
            </div>
        </div>

        <el-dialog center v-model="isShowReport" width="600" @opened="openHandle">
            <template #header>
                <div class="report_title">
                    周 报
                </div>
                <div class="report_desc">
                    「{{ reportData.day }}」
                </div>
            </template>
            <div class="report_content">
                本周检测新增{{ reportData.new_security_num }}个安全问题，涉及到{{ reportData.related_project_num }}个项目，其中：
                <div class="wrap">
                    强烈建议修复的安全问题有 {{ reportData.security_num_of_strong }}
                    个（已修复{{ reportData.security_num_of_fixed_in_strong }}个，忽略{{
                        reportData.security_num_of_ignore_in_strong
                    }}个，待修复{{ reportData.security_num_of_remain_in_strong }}个）<br>
                    建议修复的安全问题有 {{ reportData.security_num_of_recommend }}
                    个（已修复{{ reportData.security_num_of_fixed_in_recommend }}个，忽略{{
                        reportData.security_num_of_ignore_in_recommend }}个，待修复{{
                        reportData.security_num_of_remain_in_recommend
                    }}个）<br>
                    可选修复的安全问题有 {{ reportData.security_num_of_optional }}
                    个（已修复{{ reportData.security_num_of_fixed_in_optional }}个，忽略{{
                        reportData.security_num_of_ignore_in_optional }}个，待修复{{
                        reportData.security_num_of_remain_in_optional
                    }}个）<br>
                </div>
                <el-button id="copy_report_btn" @click="copyFunc('#copy_report_btn')"
                           :data-clipboard-text="`强烈建议修复的安全问题有 ${reportData.security_num_of_strong} 个（已修复${reportData.security_num_of_fixed_in_strong}个，忽略${reportData.security_num_of_ignore_in_strong}个，待修复${reportData.security_num_of_remain_in_strong}个）
建议修复的安全问题有 ${reportData.security_num_of_recommend} 个（已修复${reportData.security_num_of_fixed_in_recommend}个，忽略${reportData.security_num_of_ignore_in_recommend}个，待修复${reportData.security_num_of_remain_in_recommend}个）
可选修复的安全问题有 ${reportData.security_num_of_optional} 个（已修复${reportData.security_num_of_fixed_in_optional}个，忽略${reportData.security_num_of_ignore_in_optional}个，待修复${reportData.security_num_of_remain_in_optional}个）`">复制周报</el-button>
            </div>
        </el-dialog>

        <ChangePrincipal v-model="store.isShowChangePrincipal" v-if="store.isShowChangePrincipal" />

        <IssueDetailModal v-model="showIssueDetail" v-if="showIssueDetail" :securityId="securityId" />
    </div>
</template>

<script setup lang='ts'>
import {
    onMounted, reactive, ref, watch,
} from 'vue';
import { getAccessImg, copyFunc, formatDate } from 'util/tools';
import store from 'util/store';
import {
    getTeamOverviewDataApi, getTeamOverviewListApi, getTeamOverviewTopApi, getTeamOverviewReportApi, getTeamDynamicDataApi,
} from 'api/project';
import { createPieChart, renderChart, createBarOptions } from 'util/chart';
import UserComp from 'comp/UserComp.vue';
import SuggestProgress from './comp/SuggestProgress.vue';
// import CommonHead from '@/components/CommonHead.vue';
import NoData from '@/components/NoData.vue';
import IssueComp from './comp/IssueComp.vue';
import ChangePrincipal from './comp/ChangePrincipal.vue';
import IssueDetailModal from './IssueDetailModal.vue';

const nums = reactive<any>({
    strong: 0,
    recommend: 0,
    optional: 0,
    total: 0,
});
const listData = ref<Array<any>>([]);
const total = ref<number>(0);
const isHaveAllData = ref<boolean>(true);
const isNoMoreData = ref<boolean>(false);
const topData = ref<any>({});
const reportData = ref<any>({});
const pieOptions = createPieChart();
const barOptions = createBarOptions();
const isShowReport = ref<boolean>(false);
const teamDynamicData = ref<Array<any>>([]);
const showIssueDetail = ref<boolean>(false);
const securityId = ref<string>('');

onMounted(async () => {
    try {
        const res = await getTeamOverviewDataApi({
            team_id: store.teamInfo.team_id,
        });
        const { data } = res;
        // 柱图
        barOptions.series[0].data = [data.security_num_of_remain, data.security_num_of_fixed, data.security_num_of_tmp_ignore, data.security_num_of_ignore];

        // 饼图
        pieOptions.series[0].data = [
            { value: data.security_num_of_strong, name: '强烈建议修复' },
            { value: data.security_num_of_recommend, name: '建议修复' },
            { value: data.security_num_of_optional, name: '可选修复' },
        ];
        pieOptions.color = data.security_num ? ['#F34D3D', '#FFCC33', '#C7C7C7'] : ['#EBEBEB80'];
        pieOptions.series[0].label.formatter = [
            '{title|全部}',
            `{total|${data.security_num}}`,
        ].join('\n');

        nums.strong = data.security_num_of_strong;
        nums.recommend = data.security_num_of_recommend;
        nums.optional = data.security_num_of_optional;
        nums.total = data.security_num;
        // nums.strong = Math.round((data.security_num_of_strong / data.security_num) * 100) || 0;
        // nums.recommend = Math.round((data.security_num_of_recommend / data.security_num) * 100) || 0;
        // nums.optional = data.security_num_of_optional ? 100 - nums.strong - nums.recommend : 0;

        Object.assign(nums, data);

        renderChart(pieOptions, document.getElementsByClassName('chart3_content')[0] as HTMLElement);
        renderChart(barOptions, document.getElementsByClassName('chart2_content')[0] as HTMLElement);

        const res1 = await getTeamDynamicDataApi({
            team_id: store.teamInfo.team_id,
        });
        teamDynamicData.value = res1.data?.slice(0, 10);
    } catch (error) {
        console.log(error);
    }
});

const filterOptions = ref<any>({
    limit: 10,
    page: 1,
    team_id: store.teamInfo.team_id,
    fix_status: 1,
});
const getListData = async () => {
    try {
        const res = await getTeamOverviewListApi(filterOptions.value);
        isNoMoreData.value = !res.data.list || !res.data.list.length;
        listData.value.push(...(res.data.list || []));
        isHaveAllData.value = listData.value.length > 0;
        total.value = res.data.total;

        const res1 = await getTeamOverviewTopApi(filterOptions.value);
        topData.value = res1.data;
        topData.value.strong = topData.value.current_strong;
        topData.value.recommend = topData.value.current_recommend;
        topData.value.optional = topData.value.current_optional;
        topData.value.currentNum = Math.round((topData.value.current / topData.value.total) * 100) || 0;
        // topData.value.strong = Math.round((topData.value.current_strong / topData.value.total) * 100) || 0;
        // topData.value.recommend = Math.round((topData.value.current_recommend / topData.value.total) * 100) || 0;
        // topData.value.optional = topData.value.current_optional ? 100 - topData.value.strong - topData.value.recommend : 0;
        // topData.value.total = topData.value.current_recommend + topData.value.current_optional + topData.value.current_strong;
    } catch (error) {
        console.log(error);
    }
};
getListData();

watch(filterOptions.value, () => {
    getListData();
});

const openHandle = async () => {
    const res = await getTeamOverviewReportApi({
        team_id: store.teamInfo.team_id,
    });
    reportData.value = res.data;
};
</script>

<style lang='less' scoped>
.team_overview {
    padding: 0;

    .top_charts_wrap {
        height: 340px;
        margin-bottom: 24px;
        .between();
    }

    .title {
        font-weight: 500;
        font-size: 20px;
        color: #3c3c3c;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .chart {
        background: #FFFFFF;
        border-radius: 6px;
        height: 100%;
        box-sizing: border-box;
        padding: 32px 40px;
        position: relative;

        .percentage_label {
            font-size: 12px;
            color: #858585;
            margin-bottom: 12px;
        }

        .percentage_value {
            font-size: 32px;
            color: #3c3c3c;
            font-weight: 500;
        }

        .chart2_content,
        .chart3_content {
            height: calc(100% - 40px);
        }

        .progress {
            width: 110px;
            height: 60%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: absolute;
            right: 40px;
            top: 80px;
        }
    }

    .chart1 {
        width: 24%;
    }

    .chart2,
    .chart3 {
        width: 36%;
    }

    .question_wrap {
        background-color: #fff;
        padding: 24px;
        margin-bottom: 16px;
        border-radius: 6px;

        .ratio {
            font-size: 16px;
            color: #3c3c3c;
            margin-left: 16px;

            i {
                color: #858585;
                font-size: 18px;
                vertical-align: -2px;
            }
        }

        .question_tabs {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(30, 30, 30, 0.1);
            margin-bottom: 16px;

            img {
                width: 16px;
                vertical-align: -2px;
                margin-right: 5px;
            }

            .tab {
                width: 500px;
                .between();
            }

            .tab span {
                display: inline-block;
                color: #606C80;
                cursor: pointer;
                font-size: 16px;
                padding-bottom: 8px;
                color: #3c3c3c;
                border-bottom: 2px solid transparent;
            }

            .tab span.num {
                color: #858585;
                padding-bottom: 0;
            }

            .tab span.active {
                border-bottom-color: #5572F4;
                color: #5572F4;
                font-weight: 500;

                .num {
                    color: #5572F4;
                }
            }
        }

        .content {
            display: flex;
            justify-content: space-between;

            .left {
                flex: 1;
                margin-right: 16px;
            }

            .more {
                &:hover {
                    color: #6C87FF;
                }

                font-size: 14px;
                color: #858585;
                height: 46px;
                line-height: 46px;
                cursor: pointer;
                text-align: center
            }

            .right {
                width: 400px;

                .level {
                    background: #F7F8FB;
                    border-radius: 6px;
                    padding: 16px;
                    margin-bottom: 16px;

                    .top,
                    .bottom {
                        background: #FFFFFF;
                        border-radius: 6px;
                        padding: 16px;
                        margin-bottom: 16px;
                    }

                    .bottom {
                        margin-bottom: 0;
                    }

                    .title {
                        font-weight: 500;
                        font-size: 14px;
                    }
                }

                .suggest {
                    .between();

                    div {
                        flex: 1;
                    }

                    div:nth-of-type(2) {
                        margin: 0 24px;
                    }
                }

                .top5 {
                    background: #F7F8FB;
                    border-radius: 6px;
                    padding: 16px;
                    color: #6C87FF;
                    font-size: 14px;

                    .top_title {
                        background: linear-gradient(112.45deg, #6CB8FF 0%, #6C87FF 48.44%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-weight: 500;
                        font-size: 18px;
                        font-style: italic;
                        margin-bottom: 4px;
                        font-family: 'DIN-BlackItalic';
                        width: 50px;
                        font-weight: 600;
                    }

                    .item {
                        height: 80px;
                        background: #FFFFFF;
                        border-radius: 6px;
                        margin-bottom: 8px;
                        padding: 16px;
                        box-sizing: border-box;
                        .between();
                        color: #3c3c3c;
                    }

                    .item .name {
                        max-width: 230px;
                        display: inline-block;
                        cursor: pointer;
                        .ellipsis();
                    }

                    .item .name:hover {
                        color: #6C87FF;
                        text-decoration: underline;
                    }

                    img {
                        width: 20px;
                        margin-right: 4px;
                        vertical-align: -5px;
                    }
                }
            }
        }
    }

    .team_dynamic {
        padding: 24px;
        border-radius: 6px;
        background-color: #fff;
        font-size: 14px;
        color: #525252;

        .item {
            border-bottom: 1px solid rgba(42, 43, 50, 0.1);
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .time {
            color: #858585;
        }

        .grade {
            color: #858585;
            margin-bottom: 8px;
            margin-top: 12px;

            span {
                color: #F34D3D;
            }

            .up_arrow {
                width: 8px;
            }
        }
    }

    .report_title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 14px;
    }

    .report_desc {
        font-size: 16px;
        color: #3c3c3c;
    }

    .report_content {
        color: #3c3c3c;
        font-weight: 500;

        .el-button {
            margin-top: 16px;
            margin-left: 50%;
            transform: translateX(-50%);
        }

        .wrap {
            background-color: #F7F8FB;
            border-radius: 6px;
            padding: 16px;
            line-height: 30px;
            margin-top: 8px;
        }
    }
}
</style>

<style lang="less">
.dynamic_content {
    line-height: 24px;
    margin-bottom: 4px;
    font-weight: 400;

    span:nth-of-type(2) {
        margin: 0 6px;
    }
}
</style>
