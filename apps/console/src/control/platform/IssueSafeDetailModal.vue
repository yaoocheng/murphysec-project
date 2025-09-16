<template>
    <el-dialog class="screen-dialog issue-dialog" width="100%">
        <div class="problem_detail">
            <!-- 安全问题标题 -->
            <IssueHead :info="info" />

            <div class="issue_content">
                <div class="left_content">
                    <div class="left_wrap">
                        <!-- 处置优先级分析 -->
                        <!-- <IssueCompSource :info="info" /> -->

                        <!-- 处置优先级分析 -->
                        <!-- <IssueVuln :info="info" :vuln="info?.comp_info?.effects" /> -->
                        <div class="left_title">
                            <div>
                                <span></span>
                                处置优先级分析
                            </div>
                        </div>
                        <div class="issue-vuln">
                            <div class="g-bg-f7 head g-flex g-align-center g-justify-between">
                                <div class="g-f-16 g-fw-500 g-color-1">
                                    <i :style="{ color: '#38C728' }"
                                       class="murphy icon-jinggao1 g-f-20 g-vertical--1 g-mr-4"></i>
                                    安全
                                </div>
                            </div>

                            <div class="content g-p-24">
                                <div class="g-flex g-mb-16">
                                    <div class="g-mr-32">
                                        <span class="g-color-3 g-fw-500">漏洞分布：</span>
                                        <span class="num">
                                            <span style="background-color: #F34D3D;color: #fff;">C</span>
                                            <span style="background-color: rgba(245, 74, 69, 0.2);color: #F34D3D;">
                                                0 </span>
                                        </span>
                                        <span class="num">
                                            <span style="background-color: #FF9940;color: #fff;">H</span>
                                            <span style="background-color: rgba(255, 153, 64, 0.2);color: #FF9940;">
                                                0</span>
                                        </span>
                                        <span class="num">
                                            <span style="background-color: #FCBE03;color: #fff;">M</span>
                                            <span style="background-color: rgba(255, 204, 51, 0.2);color: #FCBE03;">
                                                0</span>
                                        </span>
                                        <span class="num">
                                            <span style="background-color: #A7AECC;color: #fff;">L</span>
                                            <span style="background-color: rgba(167, 174, 204, 0.2);color: #A7AECC;">
                                                0
                                            </span>
                                        </span>
                                    </div>

                                    <div>
                                        <span class="g-color-3 g-fw-500">漏洞标签：</span>

                                        <span class="vuln-tag" style="color: #C7C7C7;background: #F2F2F2;">POC</span>

                                        <span class="vuln-tag" style="color: #C7C7C7;background: #F2F2F2;">攻击成本低</span>

                                        <span class="vuln-tag" style="color: #C7C7C7;background: #F2F2F2;">影响范围广</span>

                                        <span class="vuln-tag" style="color: #C7C7C7;background: #F2F2F2;">可触发漏洞</span>
                                    </div>
                                </div>

                                <div class="g-bdr-4 g-bg-f7 g-color-1 g-fw-400" style="padding: 12px 16px;">
                                    该组件暂无漏洞信息，无需修复
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="right_content">
                    <div class="code_info">
                        <div class="name">
                            所属代码项目信息
                        </div>
                        <div class="item">
                            <div>项目名称</div>
                            <div class="info">{{ info?.subtask.name }}</div>
                        </div>
                        <div class="item">
                            <div>项目分支</div>
                            <div class="info">{{ info?.subtask.branch || '-' }}</div>
                        </div>
                        <div class="item">
                            <div>Commit ID</div>
                            <div class="info">{{ info?.subtask.commit?.slice(0, 7) || '-' }} <i v-if="info?.subtask.commit"
                                                                                                id="copy-commit" :data-clipboard-text="info?.subtask.commit"
                                                                                                @click="copyFunc('#copy-commit')" class="g-cursor-pointer murphy icon-fuzhi1"></i>
                            </div>
                        </div>
                        <div class="item">
                            <div>项目地址</div>
                            <div class="info link">
                                <a class="hover_text" v-if="info?.subtask.addr" :href="info?.subtask.addr" target="_blank">{{ info?.subtask.addr }}</a>
                                <span v-else>-</span>
                            </div>
                        </div>
                        <div class="item" v-if="info?.subtask?.author">
                            <div>Last commiter</div>
                            <div class="small_person">
                                <UserComp :name="info?.subtask?.author" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { onUnmounted } from 'vue';
import {
    copyFunc,
} from 'util/tools';
// import store from 'util/store';
// import {
//     getSafeQuestionInfoApi,
// } from 'api/project';
import UserComp from 'comp/UserComp.vue';
import IssueHead from './Issue/IssueHead.vue';
// import IssueVuln from './Issue/IssueVuln.vue';
// import IssueCompSource from './Issue/IssueCompSource.vue';

const { info } = defineProps(['info']);

// const info = ref<any>({});
// const isGetData = ref(false);
// const activeTab = ref<number>(3);

// const types = ['github', 'gitee', 'gitlab', 'gitlabwebhook']; // 可以pr类型
// const packages = ['npm', 'maven', 'python', 'go/golang'];
// const isPr = (type: string) => types.includes(type);

// const getIssueData = async () => {
//     try {
//         const res = await getSafeQuestionInfoApi({
//             team_id: store.teamInfo?.team_id || undefined,
//             security_id: securityId,
//         });
//         info.value = res.data;
//         isGetData.value = res.data;
//     } catch (error) {
//         console.log(error);
//     }
// };

// getIssueData();

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
        height: calc(100% - 148px);
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

        .text {
            font-size: 14px;
            font-weight: 400;
            color: #525252;
        }
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
        a {
            color: #6C87FF;
        }

        word-break: break-all;
    }

    .info {
        font-size: 14px;
        color: #3c3c3c;
        margin-top: 4px;
    }

    .issue-vuln {
        border-radius: 6px;
        border: 1px solid #F7F8FB;
        margin-bottom: 16px;

        .head {
            padding: 16px 24px;
        }
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

    .vuln-tag {
        padding: 4px 6px;
        border-radius: 2px;
        margin-right: 8px;
    }

    .num {
        display: inline-block;
        border-radius: 4px;
        margin-right: 8px;

        span {
            &:nth-of-type(1) {
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
            }

            &:nth-of-type(2) {
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
                padding: 3px 6px;
            }

            display: inline-block;
            padding: 3px 5px;
        }
    }
}

.right_content {
    .name {
        font-size: 16px;
        margin-bottom: 16px;
        color: #3c3c3c;
        font-weight: 500;
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
