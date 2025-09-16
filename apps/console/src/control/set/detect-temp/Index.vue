<template>
    <div class="title">
        检测范围模版
    </div>
    <div class="desc">
        支持通过语言和目录筛选出项目中需要/不需要检测的内容，减少检测结果中出现不关心的结果
    </div>

    <div v-if="isUserSpace" style="height: calc(100% - 80px);">
        <CurTeam />
    </div>

    <el-tabs v-else v-model="activeName">
        <el-tab-pane v-if="!store.isAllTeam" label="团队模板" name="1">
            <CurTeam v-if="activeName === '1'" />
        </el-tab-pane>

        <el-tab-pane v-if="store.isAllTeam" label="本组织模板" name="3">
            <CurOrg v-if="activeName === '3'" />
        </el-tab-pane>

        <el-tab-pane label="上级组织模板" name="2">
            <UpOrg v-if="activeName === '2'" />
        </el-tab-pane>

        <el-tab-pane v-if="store.isAllTeam" label="下级组织模板" name="4">
            <LowOrg v-if="activeName === '4'" />
        </el-tab-pane>

        <el-tab-pane v-if="store.isAllTeam" label="下级团队模板" name="5">
            <LowTeam v-if="activeName === '5'" />
        </el-tab-pane>
    </el-tabs>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { getOrgAuthInfo } from '@/control/org/hooks';
import CurTeam from './CurTeam.vue';
import UpOrg from './UpOrg.vue';
import CurOrg from './CurOrg.vue';
import LowOrg from './LowOrg.vue';
import LowTeam from './LowTeam.vue';

const { isUserSpace } = getOrgAuthInfo();
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import { } from 'api/project';

// const route = useRoute();
// const router = useRouter();
const activeName = ref<string>(store.isAllTeam ? '3' : '1');

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
