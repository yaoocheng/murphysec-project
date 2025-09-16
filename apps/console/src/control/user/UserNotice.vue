<template>
    <div class="user_notice">
        <div class="common_head">
            <span>通知设置</span>
        </div>
        <div class="content">
            <div class="desc">
                每周报告：每周汇总您当前所有项目的安全状态并进行通知
            </div>
            <div class="switch">
                邮箱：
                <el-switch  @change="changeSwitch" :disabled="!getUserInfo().email" v-model="switchVal" style="--el-switch-on-color: #6C87FF;" />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { noticeSet } from '@/api/user';
import { getUserInfo, updateUserInfoHandle } from '@/utils/tools';

const switchVal = ref<boolean>(getUserInfo().notice_email === 1);
const changeSwitch = async () => {
    const res = await noticeSet({ email: +switchVal.value });
    if (res.data.code === 200) {
        updateUserInfoHandle();
    }
};
</script>

<style lang='less' scoped>
.content {
    padding: 24px;

    .desc {
        font-size: 14px;
        color: #606C80;
        margin-bottom: 28px;
    }

    .switch {
        vertical-align: middle;
        font-size: 14px;
        color: #3D3D3D;
    }
}
</style>
