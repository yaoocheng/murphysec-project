<template>
    <div class="title">
        项目策略
    </div>
    <div class="desc">
        为项目设置检测策略，策略命中结果可用于流水线构建的阻断
    </div>

    <div v-if="isUserSpace" style="height: calc(100% - 80px);">
        <CurTeamStra  />
    </div>

    <el-tabs v-else v-model="activeName">
        <el-tab-pane v-if="!store.isAllTeam" label="团队策略" name="1">
            <CurTeamStra v-if="activeName==='1'" />
        </el-tab-pane>

        <el-tab-pane v-if="store.isAllTeam" label="本组织策略" name="3">
            <CurOrgStra v-if="activeName==='3'" />
        </el-tab-pane>

        <el-tab-pane label="上级组织策略" name="2">
            <UpOrgStra v-if="activeName==='2'" />
        </el-tab-pane>

        <el-tab-pane v-if="store.isAllTeam" label="下级组织策略" name="4">
            <LowOrgStra v-if="activeName==='4'" />
        </el-tab-pane>

        <el-tab-pane v-if="store.isAllTeam" label="下级团队策略" name="5">
            <LowTeamStra v-if="activeName==='5'" />
        </el-tab-pane>
    </el-tabs>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
// import { getOrgTeamApi } from 'api/org';
import CurTeamStra from './CurTeamStra.vue';
import UpOrgStra from './UpOrgStra.vue';
import CurOrgStra from './CurOrgStra.vue';
import LowTeamStra from './LowTeamStra.vue';
import LowOrgStra from './LowOrgStra.vue';

import { getOrgAuthInfo } from '@/control/org/hooks';

const { isUserSpace } = getOrgAuthInfo();
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import { } from 'api/project';

// const route = useRoute();
// const router = useRouter();
const activeName = ref<string>(store.isAllTeam ? '3' : '1');
// const activeName = ref<string>('1');
// watch(activeName, async () => {
//     try {
//         const { data } = await getOrgTeamApi({
//             org_id: store.teamInfo.org_id,
//             org_path: window.localStorage.getItem('cur-click-path'),
//             include_child: 1,
//         });
//         const list = Object.values(data || []);

//         if (store.isAllTeam) {
//             store.teamList = [...[{
//                 id: '-1',
//                 team_name: '所有团队',
//             }], ...list];
//         } else {
//             store.teamList = [...list];
//         }
//     } catch (error) {
//         console.log(error);
//     }
// });
// onBeforeMount(() => {
// })

// onMounted(() => {
// })
</script>

<style scoped lang='less'>
.title {
    font-weight: 600;
    color: @text-color;
    margin-bottom: 8px;
}

.desc {
    font-size: 14px;
    color: #858585;
    margin-bottom: 16px;
}
</style>

<style lang="less">
.el-tabs {
    height: calc(100% - 84px);

    .el-tabs__content {
        height: calc(100% - 54px);

        .el-tab-pane {
            height: 100%;
        }
    }
}
</style>
