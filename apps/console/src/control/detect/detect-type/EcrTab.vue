<template>
    <div class="top_btn">
        <div>
            <span class="top_btn_item" @click="activeTab = 1;" :class="{ 'active': activeTab === 1 }">项目列表</span>
            <span class="top_btn_item" @click="activeTab = 2;" :class="{ 'active': activeTab === 2 }">全量检测</span>
            <span class="top_btn_item" @click="activeTab = 3;" :class="{ 'active': activeTab === 3 }">定时检测</span>
        </div>
        <el-button v-if="isUserSpace || normalTeamAuth" @click="$router.push(`/detect-access?from=ecr`)"
                   class="main_btn" style="width: 80px;height: 32px;color: #fff;">
            新增集成
        </el-button>
    </div>

    <div class="content">
        <!-- 列表 -->
        <EcrList v-if="activeTab === 1" />

        <!-- 全量 -->
        <EcrFullDetect v-if="activeTab === 2" />

        <Cron v-if="activeTab === 3" />
    </div>

    <div class="fix-btn">
        <div class="btn"
             v-if="(activeTab === 1) || (activeTab === 2 && !isFullDetecting && isGetFullStatus)">
            <el-button @click="nextStepHandle">下一步</el-button>
        </div>
    </div>

</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { showMessage } from 'util/tools';
import { useRoute, useRouter } from 'vue-router';
import store, { detectInfo } from 'util/store';
import {
    isFullDetecting, isGetFullStatus,
    selectedData,
} from '../hooks/hook';
import EcrList from './ecr/EcrList.vue';
import { getOrgAuthInfo } from '@/control/org/hooks';
import EcrFullDetect from './ecr/EcrFullDetect.vue';
import Cron from './ecr/Cron.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

const router = useRouter();
const route = useRoute();
const activeTab = ref<number>(1);

// 检测配置信息
detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.ecr[0]?.config_id; // 默认当前接入第一个nexus

// 下一步
const nextStepHandle = () => {
    if (activeTab.value === 1) {
        if (!selectedData.value.length) {
            showMessage('当前未选择项目', 'warning');
            return;
        }

        detectInfo.repos = selectedData.value;
        detectInfo.detect_type = 0;
        router.push('/detect-config?from=ecr');
    } else if (activeTab.value === 2) {
        detectInfo.detect_type = 0;
        router.push('/detect-config?from=ecr');
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
