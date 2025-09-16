<template>
    <div class="safe_problem_comp">
        <div class="content">
            <div class="question_name">
                <div class="wrap_name g-mr-4" @click="showIssueDetail = true; securityId = data.id">
                    {{ data.title }}
                </div>

                <el-tooltip effect="light" placement="top">
                    <TagComp class="g-mr-4" :content="getRepaireLevelTool(data.highest_suggest).text" :c="getRepaireLevelTool(data.highest_suggest).color" :bgc=" getRepaireLevelTool(data.highest_suggest).bgc" />

                    <template #content>
                        <SuggestTips :text="getRepaireLevelTool(data.highest_suggest).text" />
                    </template>
                </el-tooltip>

                <el-tooltip v-if="data.is_triggers === 1" effect="light" placement="top">
                    <TagComp class="g-mr-4" :content="'可触发漏洞'" />

                    <template #content>
                        <div style="color: #2A2B32;">
                            什么是可触发漏洞？<a href="/docs/glossary/vulnerability-reachability.html" target="_blank">详情</a>
                        </div>
                    </template>
                </el-tooltip>

                <el-tooltip v-if="data.is_online === 1" effect="light" placement="top">
                    <TagComp class="g-mr-4" :content="'线上依赖'" />

                    <template #content>
                        <div style="color: #2A2B32;">
                            什么是线上依赖？<a href="/docs/glossary/production-dependencies.html" target="_blank">详情</a>
                        </div>
                    </template>
                </el-tooltip>

                <el-tooltip v-if="data.detection_strategy_name && data.detection_strategy_name.length">
                    <TagComp class="g-mr-4" c="#049FD7" bgc="#14C0FF33" :content="data.detection_strategy_name[0]" />

                    <template #content>
                        <div v-for="ele in data.detection_strategy_name" :key="ele">
                            {{ ele }}
                        </div>
                    </template>
                </el-tooltip>
            </div>

            <div class="question_info">
                <div class="person" v-if="$route.name !== 'Overview'">
                    创建人
                    <div class="person_wrap">
                        <UserComp :name="data.created_user_name" />
                    </div>
                </div>
                <div class="person" v-if="show || $route.name === 'Overview'">
                    负责人
                    <div class="person_wrap">
                        <UserComp :name="data.owner_user_name" />
                    </div>
                </div>
                <div class="belong" v-if="store.isAllTeam">
                    团队
                    <el-tooltip placement="top" :content="data.team_name">
                        <span class="project_addr">{{ data.team_name }}</span>
                    </el-tooltip>
                </div>
                <div class="belong">
                    所属代码项目
                    <el-tooltip placement="top" :content="data.subtask_name">
                        <span class="project_addr">{{ data.subtask_name }}</span>
                    </el-tooltip>
                </div>
                <div class="belong" v-if="$route.name !== 'Overview'">
                    分支
                    <span class="inline-block max-w-[80px] ellipsis">{{ data.branch || '-' }}</span>
                </div>
                <div class="belong" v-if="show">
                    状态
                    <span v-if="data.fix_status === 1">待修复</span>
                    <span v-else-if="data.fix_status === 2">已修复</span>
                    <span v-else-if="data.fix_status === 3&&!systemConfig.isGf">7天忽略</span>
                    <span v-else-if="data.fix_status === 4">关闭</span>
                </div>
                <div class="creat_time" v-if="$route.name !== 'Overview'"
                    :style="{ color: getTimeColorHandle(transformTime(data.created_at)).color, background: getTimeColorHandle(transformTime(data.created_at)).bgc }">
                    <i class="murphy icon-31shijian"></i>
                    {{ transformTime(data.created_at) }}前创建
                </div>
            </div>
        </div>
        <div class="btns">
            <el-button v-if="data.fix_status === 1 && !store.isAllTeam"
                @click="showIssueDetail = true; securityId = data.id">
                快速修复
            </el-button>
            <el-button class="minor_btn" v-if="data.fix_status !== 1 && !store.isAllTeam"
                @click="openQuestionHandle(data.id)">
                重新打开
            </el-button>
            <!-- <el-button class="share_btn" @click="store.isShowShareReportModal = true; store.securityId = data.id">
                分享
            </el-button> -->
        </div>
    </div>

    <IssueDetailModal v-model="showIssueDetail" v-if="showIssueDetail" :securityId="securityId" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { getRepaireLevelTool, showMessage, transformTime } from 'util/tools';
import { changeSafeQuestionStatusApi } from 'api/project';
import UserComp from 'comp/UserComp.vue';
import IssueDetailModal from '../IssueDetailModal.vue';
import systemConfig from '@/constants/system-config';

defineProps(['data', 'show']);

const showIssueDetail = ref<boolean>(false);
const securityId = ref<string>('');

// 重新打开
const openQuestionHandle = async (id: string) => {
    try {
        await changeSafeQuestionStatusApi({
            team_id: store.teamInfo.team_id,
            security_id: id,
            status: 1,
        });
        showMessage('已重新打开此安全问题', 'success');
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
};

const getTimeColorHandle = (str: string | undefined) => {
    const num = parseInt(str || '', 10);
    if (str?.includes('分') || str?.includes('秒') || str?.includes('时')) {
        return {
            color: '#3c3c3c',
            bgc: '#1E1E1E1A',
        };
    }
    if (num >= 1 && num < 3) {
        return {
            color: '#3c3c3c',
            bgc: '#1E1E1E1A',
        };
    }
    if (num >= 3 && num < 7) {
        return {
            color: '#623B18',
            bgc: '#FF994033',
        };
    }
    if (num >= 7) {
        return {
            color: '#621E18',
            bgc: '#F34D3D33',
        };
    }
    return {};
};
</script>

<style lang='less' scoped>
.safe_problem_comp {
    background: #F7F8FB;
    border-radius: 6px;
    height: 87px;
    padding: 16px;
    box-sizing: border-box;
    .between();
    margin-bottom: 10px;

    .content {
        flex: 1;
        margin-right: 16px;
        width: 0;
    }

    .btns .el-button {
        width: 64px;
        font-size: 12px;
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
                color: #6c87ff;
                text-decoration: underline;
            }

            img {
                width: 20px;
                height: 20px;
                vertical-align: -5px;
            }

            font-weight: 500;
            max-width: 50%;
            cursor: pointer;
            .ellipsis();
        }

        .tag {
            padding: 3px 6px;
            background: #34C72433;
            border-radius: 4px;
            font-size: 12px;
            color: #2EA121;
            font-weight: 500;
            transform: scale(0.8);

            i {
                font-size: 12px;
                margin-right: 5px;
            }
        }
    }

    .question_info {
        display: flex;
        font-size: 12px;
        color: #8F959E;
        font-weight: 400;

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

            i {
                font-size: 12px;
                color: #6C87FFCC;
                margin-left: 5px;
            }

        }

        .belong span {
            background-color: transparent;
        }

        .person {
            margin-right: 1%;

            .created_user_name {
                display: inline-block;
                max-width: 90px;
                .ellipsis();
            }
        }

        .belong {
            .center();
            margin-right: 1%;

            .project_addr {
                max-width: 140px;
                border-radius: 0;
                .ellipsis();
            }
        }

        .creat_time {
            background: rgba(30, 30, 30, 0.1);
            border-radius: 4px;
            padding: 3px 6px;
            color: #3c3c3c;
            font-size: 14px;

            i {
                vertical-align: -1px;
            }
        }
    }

    // .grade {
    //     position: absolute;
    //     right: 0;
    //     top: 18px;

    //     .top,
    //     .bottom {
    //         width: 66px;
    //         height: 26px;
    //         background: rgba(22, 205, 202, 0.05);
    //         border-radius: 13px 0px 0px 13px;
    //         border: 1px solid #16CDCA;
    //         margin-bottom: 10px;
    //         font-size: 15px;
    //         padding: 0 5px;
    //         box-sizing: border-box;
    //         display: flex;
    //         align-items: center;
    //         justify-content: space-around;
    //         font-weight: 600;
    //         color: #16CDCA;
    //         i {
    //             font-size: 15px;
    //         }
    //     }

    //     .bottom {
    //         background: rgba(108, 135, 255, 0.05);
    //         border-color: #6C87FF;
    //         color: #6C87FF;
    //     }
    // }

    // .level {
    //     width: 32px;
    //     height: 32px;
    //     background: #FF9940;
    //     border-radius: 7px;
    //     font-size: 12px;
    //     font-weight: bold;
    //     color: #fff;
    //     line-height: 32px;
    //     text-align: center;
    //     margin-right: 20px;
    // }

    // .content {
    //     font-size: 12px;
    //     color: #8C95A1;
    //     flex: 1;
    //     width: 0;
    //     .quextion_name {
    //         font-size: 14px;
    //         font-weight: bold;
    //         color: #6C87FF;
    //         cursor: pointer;
    //         margin-bottom: 18px;
    //         max-width: 80%;
    //         .ellipsis();
    //     }

    //     .manage_wrap {
    //         display: flex;
    //         align-items: center;
    //         font-weight: 500;
    //         color: #4A4646;
    //         margin-bottom: 26px;

    //         img {
    //             width: 22px;
    //             height: 22px;
    //             border-radius: 50%;
    //             vertical-align: -6px;
    //             margin-right: 4px;
    //         }
    //     }

    //     .principal {
    //         font-weight: 600;
    //         margin-right: 18px;
    //     }

    //     .principal span {
    //         &:hover {
    //             color: #6C87FF;
    //         }

    //         cursor: pointer;
    //     }

    //     .creator {
    //         margin-right: 18px;
    //     }

    //     .code_project span {
    //         padding: 5px 8px;
    //         background: #F1F4F7;
    //         border-radius: 4px;
    //     }

    //     .code_project {
    //         margin-bottom: 26px;
    //     }

    //     .reasons .num {
    //         display: inline-block;
    //         border: 1px solid #7E98B8;
    //         border-radius: 4px;
    //         margin-right: 15px;
    //         margin-bottom: 26px;

    //         span {
    //             &:nth-of-type(2) {
    //                 background-color: #7E98B8;
    //                 color: #fff;
    //             }

    //             display: inline-block;
    //             padding: 5px;
    //         }
    //     }

    //     .btns {
    //         display: flex;
    //         justify-content: space-between;
    //         align-items: center;
    //         margin-bottom: 26px;

    //         .share_btn {
    //             &:hover {
    //                 background-color: #6C87FF1A;
    //             }
    //             background: #FFFFFF;
    //             border-radius: 4px;
    //             border: 1px solid #6C87FF;
    //             color: #6C87FF;
    //         }
    //     }

    //     .deal_desc {
    //         display: flex;
    //         justify-content: space-between;

    //         span:nth-of-type(2) {
    //             color: #6C87FF;
    //             cursor: pointer;
    //         }
    //     }
    // }
}
</style>
