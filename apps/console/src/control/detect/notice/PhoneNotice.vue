<template>
    <div class="email_notice">
        <div class="title">
            配置手机号通知
        </div>
        <div class="desc">
            当检测结果达到设置的处置条件时，通过手机号进行消息通知
        </div>
        <div>
            <el-input disabled v-model="getUserInfo().phone" style="width: 500px;"></el-input>
        </div>
        <div style="margin-top: 20px;">
            <span style="margin-right: 10px;">开启/关闭</span>
            <SwitchComp v-model="detectInfo.notice_self_phone_disable" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { getUserInfo } from 'util/tools';
import { detectInfo } from 'util/store';
import SwitchComp from './SwitchComp.vue';
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
