<template>
    <el-dialog @close="closeIssueHandle" class="screen-dialog issue-dialog" width="100%">
        <div class="problem_detail" v-loading="loading">
            <!-- 安全问题标题 -->
            <IssueHead v-if="isGetData" :info="info" :securityId="securityId" />

            <div class="issue_content">
                <div class="left_content">
                    <div class="left_wrap">
                        <!-- 处置优先级分析 -->
                        <IssueCompSource v-if="isGetData" :info="info" :securityId="securityId" />

                        <!-- 处置优先级分析 -->
                        <IssueVuln v-if="isGetData && !isHasStrategy" :info="info" :vuln="info?.comp_info?.effects" />

                        <IssueTrigger v-if="isGetData && !isHasStrategy" :info="info" />

                        <IssueStrategy v-if="isGetData && isHasStrategy" :info="info" />

                        <!-- 旧修复 -->
                        <FixPlan v-if="isGetData && !isHasStrategy && isOldFix" :info="info" />

                        <!-- 新修复 -->
                        <IssueFix v-if="isGetData && !isHasStrategy && !isOldFix" />
                    </div>
                </div>

                <div class="right_content">
                    <IssueStatus :info="info" :securityId="securityId" v-if="isGetData" />

                    <IssueRight :info="info" v-if="isGetData" />
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import {
    ref, onMounted, toRefs, onUnmounted,
} from 'vue';
import store from 'util/store';
import {
    getSafeQuestionInfoApi,
} from 'api/project';
import { fixState } from './composable/use-issue-fix';
import IssueStatus from './Issue/IssueStatus.vue';
import IssueHead from './Issue/IssueHead.vue';
import IssueVuln from './Issue/IssueVuln.vue';
import IssueCompSource from './Issue/IssueCompSource.vue';
import IssueTrigger from './Issue/IssueTrigger.vue';
import IssueRight from './Issue/IssueRight.vue';
import IssueStrategy from './Issue/IssueStrategy.vue';
import IssueFix from './IssueFix/Index.vue';
import FixPlan from './Issue/FixPlan.vue';

const { securityId } = defineProps(['securityId']);
const { errorMessage, successMessage } = toRefs(fixState.fixRange);

const info = ref<any>({});
const isGetData = ref(false);
const isHasStrategy = ref<boolean>(false);
const isOldFix = ref<boolean>(false);
const loading = ref(false);

const closeIssueHandle = () => {
    if (errorMessage.value) {
        errorMessage.value.close();
        errorMessage.value = null;
    }
    if (successMessage.value) {
        successMessage.value.close();
        successMessage.value = null;
    }
};

const getIssueData = async () => {
    loading.value = true;
    try {
        const res = await getSafeQuestionInfoApi({
            team_id: store.teamInfo?.team_id || undefined,
            security_id: securityId,
        });
        info.value = res.data;
        fixState.issueInfo = res.data;
        isOldFix.value = res.data.power_version?.includes('disabled_fix_plan_change');
        isGetData.value = res.data;
        isHasStrategy.value = info.value.comp_info?.detection_strategy_info?.length;
        loading.value = false;
    } catch (error) {
        console.log(error);
    }
};

onMounted(async () => {
    getIssueData();
});

onUnmounted(() => {
    window.sessionStorage.removeItem('sec-id');
});
</script>

<style lang='less' scoped>
.shrink {
    width: 32px;
    vertical-align: -10px;
    cursor: pointer;
}

.problem_detail {
    font-size: 14px;
    height: 100%;
    margin-top: 8px;
    background-color: #F7F8FB;

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

    .issue_content {
        background-color: #F7F8FB;
        padding: 24px 120px;
        box-sizing: border-box;
        display: flex;
        height: calc(100% - 145px);
        justify-content: space-between;
        overflow: auto;

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
                font-weight: 500;
                margin-bottom: 16px;
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
        }
    }
}
</style>

<style lang="less">
.issue-dialog {
    padding: 0;
}

.el-drawer__header {
    margin-bottom: 0;
    padding: 0;
}

.el-drawer__body {
    padding: 0;
}
</style>
