<template>
    <div class="office_software">
        <div class="office_software_title">
            配置办公软件通知
            <span @click="(isShowDoc = true)"
                style="cursor: pointer; font-size: 12px;margin-left: 5px;color:#6c87ff">配置文档</span>
        </div>
        <div class="desc">
            当检测结果达到设置的处置条件时，通过配置企微、飞书、钉钉（需要自定义安全词【{{ $systemConfig.longName }}】）的Webhook进行消息通知
        </div>
        <div class="inp" v-for="(item, index) in detectInfo.im_robots_addr" :key="index">
            <el-input style="width:400px" v-model="item.addr" placeholder="请填写需要接收消息通知的服务地址"></el-input>
            <el-button @click="testHandle(item.addr)">推送测试</el-button>
            <span class="delete" @click="detectInfo.im_robots_addr.splice(index, 1)" v-if="index !== 0">删除</span>
        </div>
        <div class="add" @click="addAddr">
            <span>
                <i class="murphy icon-jia"></i>
            </span>
            添加通知
        </div>

        <div style="margin-top: 20px;">
            <span style="margin-right: 10px;">开启/关闭</span>
            <SwitchComp v-model="detectInfo.notice_im_robots_disable" />
        </div>

        <ConfigDocPopup v-model="isShowDoc" />
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { pushOfficeTestApi } from 'api/detect';
import { showMessage } from 'util/tools';
import { detectInfo } from 'util/store';
import SwitchComp from './SwitchComp.vue';
import ConfigDocPopup from './DocConfigPopup.vue';

const isShowDoc = ref<boolean>(false);
const testHandle = async (addr: string) => {
    await pushOfficeTestApi({ webhook: addr });
    showMessage('推送成功', 'success');
};

const addAddr = () => {
    if (detectInfo.im_robots_addr.length >= 10) {
        showMessage('最多添加十条', 'warning');
        return;
    }
    detectInfo.im_robots_addr.push({ addr: '' });
};
</script>

<style lang='less' scoped>
.office_software_title {
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

.inp {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .delete {
        color: #6C87FF;
        margin-left: 20px;
        cursor: pointer;
    }

    .el-button {
        margin-left: 10px;
    }
}

.add span {
    display: inline-block;
    width: 26px;
    height: 26px;
    background: #E0E2E6;
    border-radius: 4px;
    line-height: 26px;
    text-align: center;
    margin-right: 5px;
    color: #fff;
    cursor: pointer;
}
</style>
