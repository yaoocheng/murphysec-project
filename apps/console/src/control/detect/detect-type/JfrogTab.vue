<template>
    <div class="top_btn">
        <div>
            <span class="top_btn_item" @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">项目列表</span>
            <span class="top_btn_item" @click="activeTab = 2" :class="{ 'active': activeTab === 2 }">全量检测</span>
        </div>
        <el-button v-if="isUserSpace || normalTeamAuth" @click="$router.push(`/detect-access?from=jfrog`)"
            class="main_btn" style="width: 80px;height: 32px;color: #fff;">
            新增集成
        </el-button>
    </div>

    <div class="content">
        <!-- 列表 -->
        <div v-if="activeTab === 1">
            <JfrogList />
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
                                选择已接入的Jfrog
                            </div>
                        </template>
                        <div>
                            <el-select @change="getRepoKeyData" :disabled="refreshLoading"
                                v-model="detectInfo.team_config_id" style="width: 370px">
                                <el-option
                                    v-for="item in store.allAccessInfo.jfrog.map((e: any) => ({ value: e.config_id, label: e.config_name }))        "
                                    :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                仓库类型
                            </div>
                        </template>
                        <div>
                            <el-select @change="changeRepType" v-model="detectInfo.repository_type"
                                style="width: 370px">
                                <el-option v-for="item in repoTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                仓库名称
                            </div>
                        </template>
                        <div>
                            <el-select v-model="repoName"
                                @change="[detectInfo.repository_key, detectInfo.format] = repoName.split(':')"
                                style="width: 370px">
                                <el-option v-for="item in repoKeysOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>
                </FormComp>
            </div>

            <FullDetect v-else :type="'jfrog'" />
        </div>
    </div>

    <div class="fix-btn">
        <div class="btn"
            v-if="(activeTab === 1) || (activeTab === 2 && !isFullDetecting && isGetFullStatus && !refreshLoading)">
            <el-button @click="nextStepHandle">下一步</el-button>
        </div>
    </div>

</template>

<script setup lang='ts'>
import {
    ref, onUnmounted,
} from 'vue';
import { showMessage } from 'util/tools';
import { useRoute, useRouter } from 'vue-router';
import store, { detectInfo } from 'util/store';
import {
    refreshLoading,
} from 'util/hook';
import { getRepoKeyDataApi } from 'api/detect';
import {
    getFullDetectStatus, isFullDetecting, fullRollTimer, isGetFullStatus,
    selectedData,
} from '../hooks/hook';
import { repoTypeOptions, repoKeysOptions } from '../constants/constant';
import FormComp from '@/components/FormComp.vue';
import FullDetect from '../full-detect/FullDetect.vue';
import JfrogList from './jfrog/JfrogList.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const router = useRouter();
const route = useRoute();
const activeTab = ref<number>(1);

const repoName = ref<string>('');

// 检测配置信息
detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.jfrog[0]?.config_id; // 默认当前接入第一个

// 是否全量
getFullDetectStatus('jfrog');

onUnmounted(() => {
    // window.clearInterval(rollTimer.value);
    window.clearInterval(fullRollTimer.value);
});

// 下一步
const nextStepHandle = () => {
    // if (refreshLoading.value) {
    //     showMessage('项目列表正在刷新中', 'warning');
    //     return;
    // }
    if (activeTab.value === 1) {
        if (!selectedData.value.length) {
            showMessage('当前未选择项目', 'warning');
            return;
        }
        selectedData.value = selectedData.value.map((ele: any) => ({
            git_addr: ele.addr,
            git_branch: ele.branch,
            commit: ele.commit,
            ...ele,
        }));
        detectInfo.repos = selectedData.value;
        detectInfo.detect_type = 33;
        router.push('/detect-config?from=jfrog');
    } else if (activeTab.value === 2) {
        detectInfo.detect_type = 34;
        router.push('/detect-config?from=jfrog');
    }
};

// 获取仓库名称
const cacheRepo = ref<Array<any>>([]);
const getRepoKeyData = async () => {
    const res = await getRepoKeyDataApi({
        access_type: 'jfrog',
        team_config_id: detectInfo.team_config_id,
    });
    repoKeysOptions.value = res.data;
    cacheRepo.value = res.data;
    repoKeysOptions.value = repoKeysOptions.value.map((item) => ({
        value: `${item.repository_key}:${item.format}`,
        label: `${item.repository_key}(${item.format})`,
    }));
};
getRepoKeyData();

const changeRepType = (value: string) => {
    if (value) {
        repoKeysOptions.value = cacheRepo.value.filter((item) => item.repository_type === value).map((item) => ({
            value: `${item.repository_key}:${item.format}`,
            label: `${item.repository_key}(${item.format})`,
        }));
    } else {
        repoKeysOptions.value = cacheRepo.value.map((item) => ({
            value: `${item.repository_key}:${item.format}`,
            label: `${item.repository_key}(${item.format})`,
        }));
    }
};

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
