<template>
    <div class="top_btn">
        <div>
            <span class="top_btn_item" :class="{ 'active': activeTab === 2 }">全量检测</span>
        </div>
        <el-button v-if="isUserSpace || normalTeamAuth" @click="$router.push('/detect-access?from=coding')"
                   style="width: 80px;">
            新增集成
        </el-button>
    </div>

    <div class="content">
        <!-- 全量 -->
        <div class="all">
            <div v-if="!isFullDetecting">
                <FormComp label-width="135px">
                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                <span class="text-err">*</span>
                                选择已接入的CODING
                            </div>
                        </template>
                        <el-select v-model="detectInfo.team_config_id">
                            <el-option
                                v-for="item in store.allAccessInfo.coding.map((e: any) => ({ value: e.config_id, label: e.config_name }))        "
                                :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <div class="g-p-24 g-bg-ff g-bdr-6">
                        <div class="g-color-3 g-mb-16 g-fw-500">设置检测范围</div>

                        <el-form-item>
                            <template #label>
                                <div class="form_label mb-2">
                                    仓库最后活跃时间
                                </div>
                            </template>
                            <div>
                                <div>
                                    <el-date-picker v-model="activeTime" style="width: 350px;"
                                                    @change=" [detectInfo.repo_last_active_time_start, detectInfo.repo_last_active_time_end] = activeTime"
                                                    type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" />
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item>
                            <template #label>
                                <div class="form_label">
                                    选择分支
                                </div>
                            </template>
                            <div>
                                <el-radio-group v-model="detectInfo.coding_branch">
                                    <el-radio label="default">默认分支</el-radio>
                                    <el-radio label="new">最新分支</el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>
                    </div>
                </FormComp>
            </div>

            <FullDetect :type="'coding'" v-else />
        </div>
    </div>

    <div class="fix-btn">
        <div class="btn" v-if="!isFullDetecting && isGetFullStatus">
            <el-button @click="nextStepHandle">下一步</el-button>
        </div>
    </div>

</template>

<script setup lang='ts'>
import {
    ref, onUnmounted,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store, { detectInfo } from 'util/store';
import {
    getFullDetectStatus, isFullDetecting, fullRollTimer, isGetFullStatus,
} from '../hooks/hook';
import FormComp from '@/components/FormComp.vue';
import FullDetect from '../full-detect/FullDetect.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();
const activeTab = ref<number>(2);

const router = useRouter();
const route = useRoute();
const activeTime = ref<Array<string>>([]);

// 检测配置信息
detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.coding[0]?.config_id; // 默认当前接入第一个coding

onUnmounted(() => {
    window.clearInterval(fullRollTimer.value);
});

// 下一步
const nextStepHandle = () => {
    detectInfo.detect_type = 48;
    router.push('/detect-config?from=coding');
};

// 是否全量
getFullDetectStatus('coding');
</script>

<style lang='less' scoped>
.top_btn {
    margin-bottom: 16px;
    .between();
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
}

.btn {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;
}
</style>
