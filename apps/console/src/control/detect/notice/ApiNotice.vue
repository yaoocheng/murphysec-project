<template>
    <div class="api_notice">
        <div class="title">
            配置API接口通知
        </div>
        <div class="desc">
            当检测结果达到设置的处置条件时，通过配置API接口进行消息通知
        </div>
        <div class="inp">
            <div class="g-mb-4"><span style="color:red">*</span> 请求URL</div>
            <div class="g-mb-12">
                <el-input style="width:400px" v-model="detectInfo.notice_api_addr"
                    placeholder="请填写需要接收消息通知的服务地址"></el-input>
                <el-button style="margin-left: 10px;" @click="pushTestHandle">推送测试</el-button>
            </div>

            <div class="g-mb-4">请求头</div>
            <div class="g-flex g-align-center g-mb-12" v-for="(item, index) in detectInfo.notice_api_headers" :key="index">
                <el-input v-model="item.key" style="width: 194px;" placeholder="键"></el-input>
                &nbsp;:&nbsp;
                <el-input v-model="item.value" style="width: 194px;" placeholder="值"></el-input>
                <span class="delete" @click="detectInfo.notice_api_headers.splice(index, 1)"
                    v-if="index !== 0">删除</span>
            </div>

            <div class="add" @click="detectInfo.notice_api_headers.push({ key: '', value: '' })">
                <span>
                    <i class="murphy icon-jia"></i>
                </span>
                添加请求头
            </div>
        </div>
        <div style="margin-top: 20px;">
            <span style="margin-right: 10px;">开启/关闭</span>
            <SwitchComp v-model="detectInfo.notice_api_disable" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { detectInfo } from 'util/store';
import { showMessage } from 'util/tools';
import { pushApiTestApi } from 'api/detect';
import SwitchComp from './SwitchComp.vue';

const pushTestHandle = async () => {
    await pushApiTestApi({ addr: detectInfo.notice_api_addr });
    showMessage('推送成功', 'success');
};

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

.inp {
    // display: flex;
    // align-items: center;
    margin-bottom: 20px;

    .delete {
        color: #6C87FF;
        margin-left: 20px;
        cursor: pointer;
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
        margin-top: 12px;
        color: #fff;
        cursor: pointer;
    }
}
</style>
