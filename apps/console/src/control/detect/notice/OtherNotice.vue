<template>
    <div class="other_notice">
        <div class="title">
            通知其他人
        </div>
        <div class="desc">
            当检测结果达到设置的处置条件时，通过邮箱通知其他人
        </div>
        <div style="width:400px">
            <ShareAccount />
        </div>
        <div style="margin-top: 20px;">
            <span style="margin-right: 10px;">开启/关闭</span>
            <SwitchComp v-model="detectInfo.notice_other_disable" />
        </div>

        <TeamMember v-model="store.isShowTeamMemberModal" v-if="store.isShowTeamMemberModal" />
    </div>
</template>

<script setup lang='ts'>
import store, { detectInfo } from 'util/store';
import SwitchComp from './SwitchComp.vue';
import ShareAccount from '@/control/share/ShareAccount.vue';
import TeamMember from '@/control/share/TeamMember.vue';
</script>

<style lang='less' scoped>
.title {
    font-size: 14px;
    color: #3D3D3D;
    font-weight: bold;
    margin-bottom: 14px;
}

.desc {
    font-size: 12px;
    color: #8C95A1;
    margin-bottom: 24px;
}
</style>

<style>
.other_notice .select_auth {
    top: 3px !important;
}
</style>
