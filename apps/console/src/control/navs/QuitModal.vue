<template>
    <el-dialog width="400px" @opened="openHandle" :show-close="false" :close-on-click-modal="false">
        <template #header>
            <div class="title">
                <i class="murphy icon-gantanhao g-mr-8 g-f-18" style="color: #FF9940;"></i>
                <span v-if="quitInfo.type === 2">退出团队</span>
                <span v-if="quitInfo.type === 1">解散团队</span>
            </div>
        </template>
        <div class="desc">
            <p v-if="quitInfo.type === 2">
                选择退出的团队：<span style="font-weight: 600;">{{ quitInfo.name }}</span>
            </p>
            <p v-if="quitInfo.type === 1">
                选择解散的团队：<span style="font-weight: 600;">{{ quitInfo.name }}</span>
            </p>
        </div>
        <div class="desc">
            <p v-if="quitInfo.type === 2">
                退出后，你将无法进入该团队，<span style="color: #f56c6c;">请谨慎操作！</span>
            </p>
            <div v-if="quitInfo.type === 1">
                <p class="g-mb-8">
                    解散后，团队内所有数据将被彻底删除不可恢复，<span style="color: #f56c6c;">请谨慎操作！</span>
                </p>
                <el-input v-model.trim="confirmName" placeholder="请输入团队名称"></el-input>
            </div>
        </div>
        <div class="btns">
            <el-button class="cancle_btn" @click="emits('update:modelValue', false)">取消</el-button>
            <el-button class="confirm_err" @click="confirmHandle">确认</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { showMessage } from '@/utils/tools';

const emits = defineEmits(['update:modelValue', 'closeTeam', 'quitTeam']);
const props = defineProps(['quitData']);
const quitInfo = ref<any>({});
const confirmName = ref<string>('');

const openHandle = () => {
    quitInfo.value = props.quitData;
};

const confirmHandle = async () => {
    if (quitInfo.value.type === 1 && confirmName.value !== quitInfo.value.name) {
        showMessage('团队名称错误，请输入正确的团队名称', 'warning');
        return;
    }
    // 解散
    if (quitInfo.value.type === 1) {
        emits('closeTeam');
        return;
    }

    // 退出
    if (quitInfo.value.type === 2) {
        emits('quitTeam');
    }
};
</script>

<style lang='less' scoped>
.title {
    font-weight: 600;
    color: #2F2E3F;
    font-size: 18px;
}

.desc {
    font-size: 14px;
    margin-bottom: 10px;
    margin-left: 26px;
}

.confirm_err {
    background-color: #F34D3D;
    color: #fff;
}

.btns {
    margin-top: 20px;
    margin-left: 50%;

    .el-button {
        width: 80px;
    }
}
</style>
