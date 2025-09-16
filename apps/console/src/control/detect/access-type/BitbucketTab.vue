<template>
    <div class="access_tab">
        <div class="title">
            新增 Bitbucket 接入
        </div>

        <FormComp label-position="top" label-width="135px">
            <el-form-item>
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span> 服务地址
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_addr" clearable placeholder="请输入服务地址" />
                </div>
            </el-form-item>

            <el-form-item prop="address">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span> 用户名
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_username" clearable placeholder="请输入仓库Username" />
                </div>
            </el-form-item>

            <el-form-item prop="token">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span> 密码
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_password" clearable placeholder="请输入仓库Password" />
                </div>
            </el-form-item>

            <el-form-item prop="token">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span> 设置配置名称
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.config_name" clearable placeholder="请输入配置名称" />
                </div>
            </el-form-item>
        </FormComp>
    </div>

    <div class="btn">
        <el-button @click="saveHandle">完成接入</el-button>
    </div>
</template>

<script setup lang='ts'>
import { reactive } from 'vue';
import store from 'util/store';
import { useRouter } from 'vue-router';
import { showMessage } from 'util/tools';
import { updatedAccessApi } from 'api/detect';
import FormComp from '@/components/FormComp.vue';

interface formDataType {
    server_addr: string;
    server_username: string,
    server_password: string,
    config_name: string,
    team_id: string,
    access_type: string,
}
const formData = reactive<formDataType>({
    server_addr: '',
    server_username: '',
    server_password: '',
    config_name: '',
    team_id: store.teamInfo.team_id,
    access_type: 'bitbucket',
});
const router = useRouter();

const saveHandle = async () => {
    // 对所有输入字段进行trim处理
    formData.server_addr = formData.server_addr.trim();
    formData.server_username = formData.server_username.trim();
    formData.server_password = formData.server_password.trim();
    formData.config_name = formData.config_name.trim();

    if (Object.values(formData).some((item) => !item)) {
        showMessage('请填写完整配置', 'warning');
        return;
    }

    try {
        await updatedAccessApi(formData);
        showMessage('接入成功', 'success');
        router.push('/detect-main?from=bitbucket');
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
    height: 470px;
    position: relative;

    .title {
        font-size: 16px;
        font-weight: 500;
        color: #3c3c3c;
        margin-bottom: 24px;
    }

    .video {
        position: absolute;
        top: 72px;
        right: 24px;
        background: #FFFFFF;
        width: 568px;
        height: 342px;
        border: 1px solid #EBEBEB;
        box-shadow: 0px 14px 24px rgba(31, 35, 41, 0.08);
        border-radius: 6px;
        padding: 8px;
        font-size: 14px;
        color: #858585;

        a {
            color: #6C87FF;

            i {
                vertical-align: -2px;
            }
        }

        .video_text {
            margin-top: 16px;
        }
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
