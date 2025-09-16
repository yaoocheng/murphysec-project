<template>
    <div class="access_tab">
        <div class="title">
            新增 CODING 接入
        </div>

        <FormComp :model="formData" class="gitlab_config_form" label-width="135px">
            <el-form-item prop="address">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span>
                        服务地址
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_addr" clearable
                              placeholder="请输入CODING服务地址，如：https://xxxxx.coding.net" />
                </div>
            </el-form-item>

            <el-form-item prop="token">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span>
                        访问令牌
                        <span class="hover_btn1" style="padding: 4px 5px;font-weight: 400; color: #6C87FF;cursor:pointer;margin-left: 8px;"
                              @click="(isShowTokenExplain = true)">如何设置 CODING 访问令牌</span>
                    </div>
                </template>
                <div style="width: 500px">
                    <div style="display: flex;">
                        <el-input v-model="formData.server_token" clearable placeholder="请填写访问令牌" />
                        <el-button class="minor_btn" @click="verifyCodingHandle"
                                   style="width: 80px; height: 32px; margin-left: 10px;">校验</el-button>
                    </div>
                </div>
            </el-form-item>

            <el-form-item prop="address">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span>
                        设置配置名称
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.config_name" placeholder="请输入配置名称" clearable />
                </div>
            </el-form-item>
        </FormComp>

        <!-- 令牌说明 -->
        <CodingToken v-model="isShowTokenExplain" />
    </div>

    <div class="btn">
        <el-button @click="saveHandle">完成接入</el-button>
    </div>

</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import store from 'util/store';
import { showMessage } from 'util/tools';
import { updatedAccessApi, testCodingServerApi } from 'api/detect';
import { useRouter } from 'vue-router';
import FormComp from '@/components/FormComp.vue';
import CodingToken from './CodingToken.vue';

interface formDataType {
    server_addr: string;
    server_token: string,
    config_name: string,
    team_id: string,
    access_type: string,
}
const formData = reactive<formDataType>({
    server_addr: '',
    server_token: '',
    config_name: '',
    team_id: store.teamInfo.team_id,
    access_type: 'coding',
});
const router = useRouter();
const isShowTokenExplain = ref<boolean>(false); // token说明

// 校验
const verifyCodingHandle = async () => {
    if (formData.server_addr && formData.server_token) {
        // 请求检查gitlab地址
        const res = await testCodingServerApi(formData);
        // eslint-disable-next-line no-unused-expressions
        res.data.invalid === 1 ? showMessage('校验成功', 'success') : showMessage('校验失败', 'error');
    }
};

// 保存接入
const saveHandle = async () => {
    if (!formData.server_addr || !formData.server_token || !formData.config_name) {
        showMessage('请填写完整配置', 'warning');
        return;
    }

    try {
        await updatedAccessApi(formData);
        showMessage('接入成功', 'success');
        router.push('/detect-main?from=coding');
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.access_tab {
    margin-top: 24px;
    background-color: #F7F8FB;
    padding: 24px;
    border-radius: 8px;
    width: 100%;
    position: relative;

    .title {
        font-size: 16px;
        font-weight: 500;
        color: #3c3c3c;
        margin-bottom: 24px;
    }

    .form_label {
        color: #3c3c3c;
        font-weight: 500;
        // text-align: right;
    }
}

.btn {
    float: right;
    margin-top: 30px;
}
</style>
