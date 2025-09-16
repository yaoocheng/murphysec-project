<template>
    <div class="top_btn">
        <div>
            <span class="top_btn_item" @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">项目列表</span>
            <span class="top_btn_item" @click="activeTab = 2" :class="{ 'active': activeTab === 2 }">定时检测</span>
        </div>
        <el-button v-if="isUserSpace || normalTeamAuth" @click="$router.push(`/detect-access?from=ezone_code`)"
                   class="main_btn ">
            新增集成
        </el-button>
    </div>

    <List v-if="activeTab === 1" />
    <Cron v-if="activeTab === 2" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getOrgAuthInfo } from '@/control/org/hooks';
import store, { detectInfo } from '@/utils/store';
import List from './ezone-code/List.vue';
import Cron from './ezone-code/Cron.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();
const activeTab = ref(1);
const route = useRoute();

detectInfo.team_config_id = route.query.config_id || store.allAccessInfo.ezone_code[0]?.config_id;

</script>

<style lang="less">
.top_btn {
    margin-bottom: 16px;
    .between();
}
</style>
