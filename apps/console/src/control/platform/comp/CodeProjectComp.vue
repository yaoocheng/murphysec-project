<template>
    <div class="code_project_comp">
        <div class="content">
            <div class="question_name">
                <div class="wrap_name" @click="toDetectDetail(data.last_project_id, data.last_subtask_id)">
                    <img class="g-mr-4" :src="getAccessImg(accessType)" alt="">
                    {{ data.name }} &nbsp;&nbsp; {{ accessType === 'jfrog' ? `版本：${data.branch}` : '' }}
                </div>
                <TagComp c="#2EA121" bgc="#34C72433" v-if="data.source_score" :content="`项目安全分${data.source_score}`" />

                <!-- <div class="tag" v-if="data.source_score">
                    <i class="murphy icon-anquan"></i>
                    项目安全分
                    {{ data.source_score || '暂无' }}
                </div> -->
            </div>
            <div class="question_info">
                <div class="person">
                    负责人
                    <div class="person_wrap">
                        <UserComp :name="data.owner_user_name" />
                    </div>
                </div>
                <div class="belong">
                    项目地址
                    <el-tooltip placement="top" :content="data.addr">
                        <span class="project_addr">{{ data.addr }}</span>
                    </el-tooltip>
                </div>

                <div class="belong">
                    安全问题
                    <span style="cursor: pointer;">{{ data.remain_securitys || '-' }}</span>
                </div>
                <div class="belong">
                    贡献者
                    <span>{{ data.commiter_total }}</span>
                </div>
                <div class="belong">
                    代码更新
                    <span>{{ data.last_commit_at ? formatDate(data.last_commit_at) : '-' }}</span>
                </div>
                <div class="belong">
                    最近检测
                    <span>{{ data.last_subtask_at ? formatDate(data.last_subtask_at) : '-' }}</span>
                </div>
            </div>
        </div>
        <div class="btns" v-if="data.last_subtask_id === '0'">
            <el-button @click="startDetectHandle(data)">
                开始检测
            </el-button>
        </div>
        <div class="btns" v-else>
            <el-button class="minor_btn" @click="restartDetectHandle(data.last_project_id, accessType, data.last_subtask_id)">
                再次检测
            </el-button>
        </div>

        <!-- <el-dialog width="520px" v-model="badgeModal" :close-on-click-modal="false">
            <div class="popup_content">
                <div class="title">
                    将项目报告以徽章方式加入到开源项目首页
                </div>
                <div class="tip">
                    复制这段代码，添加到readme.md中，让更多开发者信任您的项目安全
                </div>
                <div class="badge_content">
                    <el-tabs v-model="activeName" class="template_tabs">
                        <el-tab-pane label="MARKDOWN" name="1">
                            <span style="line-height: 25px;word-break: break-all;">
                                [![Security Status]({{ data.badge_url }})]({{
                                    `${origin}/console/share-report/${data.last_project_id}/${data.last_subtask_id}` }})
                            </span>
                        </el-tab-pane>
                        <el-tab-pane label="HTML" name="2">
                            <span style="line-height: 25px;word-break: break-all;">
                                {{ `<a href="${origin}/console/share-report/${data.last_project_id}/${data.last_subtask_id}"
                                                                    alt="Security Status"><img src="${data.badge_url}" /></a>` }}
                            </span>
                        </el-tab-pane>
                        <el-tab-pane label="LINK" name="3">
                            <span style="line-height: 25px;word-break: break-all;">
                                {{ data.badge_url }}
                            </span>
                        </el-tab-pane>
                        <el-tab-pane label="预览" name="4">
                            <img style="width: 100%;" :src="`${data.badge_url}`" alt="">
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-dialog> -->
    </div>
</template>

<script setup lang='ts'>
import { watch, ref } from 'vue';
import { detectInfo } from 'util/store';
import {
    getAccessImg, formatDate, showMessage,
} from 'util/tools';
import { useRouter } from 'vue-router';
import UserComp from 'comp/UserComp.vue';
import TagComp from '@/components/TagComp.vue';

const router = useRouter();
const props = defineProps(['data', 'accessType']);
const accessType = ref<string>(props.accessType);
// const activeName = ref<string>('1');
// const badgeModal = ref<boolean>(false);
// const { origin } = window.location;

watch(props, (newVal) => {
    accessType.value = newVal.accessType;
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
    const tmp1 = data.team_config_ids.split(',');
    for (let i = 0; i < tmp1.length; i++) {
        if (tmp1[i] !== '') {
            detectInfo.team_config_id = tmp1[i];
        }
    }
    // detectInfo.team_config_id = data.team_config_id;
    detectInfo.access_type = accessType.value;
    detectInfo.detect_type = detectTypeObj[accessType.value];
    detectInfo.repos = [
        {
            git_addr: data.addr,
            git_branch: data.branch,
        },
    ];
    router.push(`/detect-config?from=${accessType.value}&type=detect`);
};

// 再次检测
const restartDetectHandle = async (id: string, type: string, sid:string) => {
    router.push(`/detect-config?from=${type}&id=${id}&type=restart&sid=${sid}`);
};

const toDetectDetail = (tid: string, sid: string) => {
    if (sid !== '0') {
        router.push(`/detail/${tid}/${sid}`);
    } else {
        showMessage('项目暂未检测', 'warning');
    }
};
</script>

<style lang='less' scoped>
.code_project_comp {
    background: #F7F8FB;
    border-radius: 6px;
    // height: 87px;
    padding: 16px;
    padding-bottom: 8px;
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
        margin-bottom: 8px;

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

            cursor: pointer;
            font-weight: 500;
            max-width: 80%;
            .ellipsis();
        }

        .tag {
            margin-left: -18px;
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
        margin-bottom: 8px;

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
                // max-width: 70px;
                .ellipsis();
            }
        }

        .belong {
            .center();
            margin-right: 1%;

            .project_addr {
                max-width: 180px;
                .ellipsis();
            }
        }
    }
}
</style>

<style lang="less">
.popup_content .title {
    color: #3D3D3D;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
}

.tip {
    font-size: 12px;
    color: #6E6D79;
    margin-bottom: 15px;
}

.link_copy {
    display: flex;
    font-size: 14px;
    color: #3D3D3D;
    margin-bottom: 40px;

    .input {
        width: 100%;
        height: 40px;
        border-radius: 6px;
        border: 1px solid #ECECEC;
        line-height: 40px;
        padding-left: 10px;
        font-weight: 500;
        .ellipsis();
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .el-button {
        width: 86px;
        height: 40px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}

.tip {
    font-size: 12px;
    color: #6E6D79;
    margin-bottom: 15px;
}

.badge_content {
    width: 460px;
    height: 218px;
    background: #F9FBFE;
    border-radius: 10px;
    padding: 16px 25px;
    box-sizing: border-box;
}
</style>
