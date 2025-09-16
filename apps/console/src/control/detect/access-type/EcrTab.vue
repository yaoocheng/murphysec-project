<template>
    <div class="access_tab">
        <div class="title flex items-center">
            新增 Amazon ECR 接入
            <span class="button-text-blue text-sm font-normal ml-2 cursor-pointer" @click="isShowExplain = true">
                说明
            </span>
        </div>

        <!-- 说明弹框 -->
        <el-dialog v-model="isShowExplain" title="Amazon ECR 接入说明" width="600px" :close-on-click-modal="false">
            <div class="explain-content">
                <div class="mb-4">
                    <div class="font-medium mb-2">目前共支持两种接入方式</div>
                    <div class="mb-4">
                        <div class="mb-2">接入方式一：访问密钥（Access Key），使用固定AK/SK认证，接入时需要填写"身份验证密钥ID"、"秘密访问密钥"、"设置配置名称"后可完成接入。</div>
                        <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html" target="_blank" class="text-primary">查看官方文档 <i class=" murphy icon-jiantou-you" style="font-size: 13px"></i></a>
                    </div>
                    <div>
                        <div class="mb-2">接入方式二：EC2 实例角色认证（IAM Roles for EC2），实例自动注入凭证，无需配置密钥，需要在 EC2 控制台先完成配置后，再通过平台填写"设置配置名称"后完成接入。</div>
                        <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html" target="_blank" class="text-primary">查看官方文档 <i class=" murphy icon-jiantou-you" style="font-size: 13px"></i></a>
                    </div>
                </div>
            </div>
        </el-dialog>

        <FormComp label-position="top" label-width="135px">
            <el-form-item>
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span> 认证方式
                    </div>
                </template>
                <div style="width: 500px">
                    <el-radio-group v-model="auth_type">
                        <el-radio label="role">ECR 实例角色认证</el-radio>
                        <el-radio label="access_key">访问密钥认证</el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>

            <el-form-item v-if="auth_type === 'access_key'">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span> 身份验证密钥 ID
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_username" clearable placeholder="请输入Access key ID" />
                </div>
            </el-form-item>

            <el-form-item prop="address" v-if="auth_type === 'access_key'">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span> 秘密访问密钥
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_password" clearable placeholder="请输入仓库Secret access key" />
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
import { reactive, ref, watch } from 'vue';
import store from 'util/store';
import { useRouter } from 'vue-router';
import { showMessage } from 'util/tools';
import { updatedAccessApi } from 'api/detect';
import FormComp from '@/components/FormComp.vue';

interface formDataType {
    server_username: string,
    server_password: string,
    config_name: string,
    team_id: string,
    access_type: string,
}
const formData = reactive<formDataType>({
    server_username: '',
    server_password: '',
    config_name: '',
    team_id: store.teamInfo.team_id,
    access_type: 'ecr',
});
const auth_type = ref<string>('role');

// 监听auth_type变化，清空对应表单数据
watch(auth_type, (newType:any) => {
    if (newType === 'role') {
        formData.server_username = '';
        formData.server_password = '';
    }
});
const router = useRouter();
const isShowExplain = ref(false);

const saveHandle = async () => {
    if (auth_type.value === 'access_key' && (!formData.server_username || !formData.server_password || !formData.config_name)) {
        showMessage('请填写完整配置', 'warning');
        return;
    }
    if (auth_type.value === 'role' && !formData.config_name) {
        showMessage('请填写配置名称', 'warning');
        return;
    }

    try {
        await updatedAccessApi(formData);
        showMessage('接入成功', 'success');
        router.push('/detect-main?from=ecr');
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

.explain-content {
    color: #3c3c3c;
    font-size: 14px;
    line-height: 1.6;

    a {
        display: inline-block;
        font-size: 14px;
        color: #6C87FF;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
