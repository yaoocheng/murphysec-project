<template>
    <div class="top_btn">
        <div>
            <span class="top_btn_item" @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">项目列表</span>
            <span class="top_btn_item" @click="activeTab = 2" :class="{ 'active': activeTab === 2 }">全量检测</span>
            <span class="top_btn_item" @click="activeTab = 4" :class="{ 'active': activeTab === 4 }">定时检测</span>
        </div>
        <el-button v-if="isUserSpace || normalTeamAuth" @click="$router.push('/detect-access?from=harbor')"
                   class="main_btn" style="width: 80px;height: 32px;color: #fff;">
            新增集成
        </el-button>
    </div>

    <div class="content">
        <!-- 列表 -->
        <div v-if="activeTab === 1">
            <HarborList />
        </div>

        <!-- 全量 -->
        <div class="all" v-if="activeTab === 2">
            <div v-if="!isFullDetecting">
                <div class="tip" v-if="refreshLoading">
                    <i class="murphy icon-tixing"></i>
                    正在更新当前集成配置的项目列表，请在更新完成后再进行全量检测
                </div>
                <FormComp label-width="135px">
                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                选择已接入的Harbor
                            </div>
                        </template>
                        <div>
                            <el-select :disabled="refreshLoading" v-model="detectInfo.team_config_id"
                                       style="width: 370px">
                                <el-option
                                    v-for="item in store.allAccessInfo.harbor.map((e: any) => ({ value: e.config_id, label: e.config_name }))        "
                                    :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>
                </FormComp>
            </div>

            <FullDetect :type="'harbor'" v-else />
        </div>

        <!-- 增量 -->
        <div class="all" v-if="activeTab === 3">
            <!-- <div style="margin-bottom: 24px;">
                <div class="form_label" style="margin-bottom: 11px;">
                    选择已接入的Harbor
                </div>
                <div>
                    <el-select v-model="detectInfo.team_config_id" style="width: 370px">
                        <el-option
                            v-for="item in store.allAccessInfo.harbor.map((e: any) => ({ value: e.config_id, label: e.config_name }))"
                            :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div> -->
            <div style="margin-bottom: 24px;">
                <div class="form_label" style="margin-bottom: 8px;">
                    设置Webhook
                </div>
            </div>

            <el-timeline>
                <el-timeline-item>
                    <div class="part">
                        <div style="margin-bottom: 12px;">
                            步骤一：打开 Harbor，点击项目，选中需要配置增量检测的项目
                        </div>
                        <el-image style="width: 568px" :hide-on-click-modal="true" :src="showImgs.harbor1.small"
                                  :preview-src-list="showImgs.harbor1.big">
                        </el-image>
                    </div>
                </el-timeline-item>

                <el-timeline-item>
                    <div class="part">
                        <div style="margin-bottom: 12px;">
                            步骤二：点击 Webhooks
                        </div>
                        <!-- <div class="desc">URL处填写</div> -->
                        <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.harbor2.small"
                                  :preview-src-list="showImgs.harbor2.big">
                        </el-image>
                    </div>
                </el-timeline-item>

                <el-timeline-item>
                    <div class="part">
                        <div style="margin-bottom: 12px;">步骤三：点击新建 WEBHOOK</div>
                        <div class="desc">1、输入 Webhook 名称，如 murphysec</div>
                        <div class="desc">2、事件类型，确保 Artifact pushed 处于选中状态</div>
                        <div class="desc">3、在 Endpoint 中填写{{ $systemConfig.longName }}服务平台的 harbor webhook 地址，形式为
                            {{ $systemConfig.shortName }}服务平台域名/v2/harbor/webhook</div>
                        <div class="desc">4、在 Auth Header 中填写{{ $systemConfig.longName }}服务平台Token，如 Bearer
                            T4Gsf7478BKzDJ47
                        </div>
                        <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.harbor3.small"
                                  :preview-src-list="showImgs.harbor3.big">
                        </el-image>
                    </div>
                </el-timeline-item>
            </el-timeline>
        </div>

        <Cron v-if="activeTab===4" />
    </div>

    <div class="fix-btn">
        <div class="btn"
             v-if="(activeTab === 1) || (activeTab === 2 && !isFullDetecting && isGetFullStatus && !refreshLoading)">
            <el-button @click="nextStepHandle">下一步</el-button>
        </div>
    </div>

</template>

<script setup lang='ts'>
import { ref, onUnmounted } from 'vue';
import { showMessage } from 'util/tools';
import { useRouter, useRoute } from 'vue-router';
import store, { detectInfo } from 'util/store';
import harbor1 from 'ast/configImg/harbor1.png';
import harbor2 from 'ast/configImg/harbor2.png';
import harbor3 from 'ast/configImg/harbor3.png';
import {
    refreshLoading, rollTimer,
} from 'util/hook';
import HarborList from './harbor/HarborList.vue';
import {
    getFullDetectStatus, isFullDetecting, fullRollTimer, isGetFullStatus, selectedData,
} from '../hooks/hook';
import FormComp from '@/components/FormComp.vue';
import FullDetect from '../full-detect/FullDetect.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import Cron from './harbor/Cron.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const route = useRoute();
const router = useRouter();
const activeTab = ref<number>(1);
const showImgs = {
    harbor1: {
        small: harbor1,
        big: [harbor1],
    },
    harbor2: {
        small: harbor2,
        big: [harbor2],
    },
    harbor3: {
        small: harbor3,
        big: [harbor3],
    },
};

detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.harbor[0]?.config_id; // 默认当前接入第一个nexus

onUnmounted(() => {
    window.clearInterval(rollTimer.value);
    window.clearInterval(fullRollTimer.value);
});

// 下一步
const nextStepHandle = () => {
    // if (refreshLoading.value) {
    //     showMessage('项目列表正在刷新中', 'warning');
    //     return;
    // }
    if (activeTab.value === 1) {
        const filterData = selectedData.value.map((ele: any) => ({
            git_addr: ele.addr,
            git_branch: ele.branch,
            commit: ele.commit,
        }));

        if (!filterData.length) {
            showMessage('请选择项目', 'warning');
            return;
        }
        detectInfo.repos = filterData;
        detectInfo.detect_type = 30;
        router.push('/detect-config?from=harbor');
    } else if (activeTab.value === 2) {
        detectInfo.detect_type = 31;
        router.push('/detect-config?from=harbor');
    }
};

// 是否全量
getFullDetectStatus('harbor');
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
