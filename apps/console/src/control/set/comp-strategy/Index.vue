<template>
    <div class="title">
        组件策略
    </div>
    <div class="desc flex items-center">
        为组件设置检测策略，命中策略的组件可以打标签、标记为缺陷组件和标记为安全组件
        <a href="/docs/faqs/detection/detection-policy.html" target="_balnk" class="button-text-blue">了解更多</a>
    </div>

    <div v-if="isUserSpace" style="height: calc(100% - 80px);">
        <CurTeamStra  />
    </div>

    <el-tabs v-else v-model="activeName">
        <el-tab-pane v-if="!store.isAllTeam" label="团队策略" name="1">
            <CurTeamStra  v-if="activeName==='1'" />
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
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import { } from 'api/project';
const { isUserSpace } = getOrgAuthInfo();
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
