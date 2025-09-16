<template>
    <div class="top_btn">
        <div>
            <span class="top_btn_item" @click="activeTab = 1;clearFulldetectStatus()" :class="{ 'active': activeTab === 1 }">项目列表</span>
            <span class="top_btn_item" @click="activeTab = 2;getFullDetectStatus('nexus')" :class="{ 'active': activeTab === 2 }">全量检测</span>
            <span class="top_btn_item" @click="activeTab = 3;clearFulldetectStatus()" :class="{ 'active': activeTab === 3 }">快速巡检</span>
            <span class="top_btn_item" @click="activeTab = 4;clearFulldetectStatus()" :class="{ 'active': activeTab === 4 }">定时检测</span>

        </div>
        <el-button v-if="isUserSpace || normalTeamAuth" @click="$router.push(`/detect-access?from=nexus`)"
                   class="minor_btn " style="width: 80px;height: 32px;color: #fff;">
            新增集成
        </el-button>
    </div>

    <div class="content">
        <!-- 列表 -->
        <div v-if="activeTab === 1">
            <NexusList />
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
                                选择已接入的Nexus
                            </div>
                        </template>
                        <el-select @change="getRepoKeyData" :disabled="refreshLoading"
                                   v-model="detectInfo.team_config_id" style="width: 370px">
                            <el-option
                                v-for="item in store.allAccessInfo.nexus.map((e: any) => ({ value: e.config_id, label: e.config_name }))        "
                                :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                仓库类型
                            </div>
                        </template>
                        <el-select v-model="detectInfo.repository_type"
                                   style="width: 370px">
                            <el-option v-for="item in repoTypeNexusOptions" :key="item.value" :label="item.label"
                                       :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                指定仓库
                            </div>
                        </template>
                        <el-select v-model="repoName" clearable
                                   @change="changeRepo"
                                   style="width: 370px">
                            <el-option v-for="item in repoKeysOptions" :key="item.value" :label="item.label"
                                       :value="item.value" />
                        </el-select>
                    </el-form-item>
                </FormComp>
            </div>

            <FullDetect v-else :type="'nexus'" />
        </div>

        <QuickDetect v-if="activeTab === 3" />

        <Cron v-if="activeTab === 4"  />
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
import { useRoute, useRouter } from 'vue-router';
import store, { detectInfo } from 'util/store';
import { refreshLoading } from 'util/hook';
import { getNexusRepoKeyDataApi } from 'api/detect';
import {
    isFullDetecting, fullRollTimer, isGetFullStatus,
    selectedData, getFullDetectStatus,
} from '../hooks/hook';
import QuickDetect from './nexus/QuickDetect.vue';
import { repoKeysOptions, repoTypeNexusOptions } from '../constants/constant';
import FullDetect from '../full-detect/FullDetect.vue';
import NexusList from './nexus/NexusList.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import Cron from './nexus/Cron.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const router = useRouter();
const route = useRoute();
const activeTab = ref<number>(1);
const repoName = ref<string>('');

// 检测配置信息
detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.nexus[0]?.config_id; // 默认当前接入第一个nexus
detectInfo.repository_type = 'hosted';

// 清除全量检测状态
const clearFulldetectStatus = () => {
    window.clearInterval(fullRollTimer.value);
    fullRollTimer.value = null;
};

onUnmounted(() => {
    // window.clearInterval(rollTimer.value);
    window.clearInterval(fullRollTimer.value);
    fullRollTimer.value = null;
});

// 下一步
const nextStepHandle = () => {
    if (activeTab.value === 1) {
        if (!selectedData.value.length) {
            showMessage('当前未选择项目', 'warning');
            return;
        }
        // selectedData.value = selectedData.value.map((ele: any) => ({
        //     // git_addr: ele.addr,
        //     // git_branch: ele.branch,
        //     // commit: ele.commit,
        //     ...ele,
        // }));
        detectInfo.repos = selectedData.value;
        detectInfo.detect_type = 33;
        router.push('/detect-config?from=nexus');
    } else if (activeTab.value === 2) {
        detectInfo.detect_type = 34;
        router.push('/detect-config?from=nexus');
    }
};

const changeRepo = (value: string) => {
    if (value) {
        [detectInfo.repository_key, detectInfo.format] = value.split(':');
    } else {
        detectInfo.repository_key = '';
        detectInfo.format = '';
    }
};

// 获取仓库名称
const cacheRepo = ref<Array<any>>([]);
const getRepoKeyData = async () => {
    // 切换配置查看是否在全量
    getFullDetectStatus('nexus');
    const res = await getNexusRepoKeyDataApi({
        team_config_id: detectInfo.team_config_id,
        team_id: store.teamInfo.team_id,
    });
    repoKeysOptions.value = res.data;
    cacheRepo.value = res.data;
    repoKeysOptions.value = repoKeysOptions.value.filter((item) => item.type === 'hosted').map((item) => ({
        value: `${item.name}:${item.format}`,
        label: `${item.name}（${item.format}）`,
        ...item,
    }));
};
getRepoKeyData();

// const changeRepType = (value: string) => {
//     if (value) {
//         repoKeysOptions.value = cacheRepo.value.filter((item) => item.type === value).map((item) => ({
//             value: `${item.name}:${item.format}`,
//             label: `${item.name}(${item.format})`,
//         }));
//     } else {
//         repoKeysOptions.value = cacheRepo.value.map((item) => ({
//             value: `${item.name}:${item.format}`,
//             label: `${item.name}(${item.format})`,
//         }));
//     }
// };

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
