<template>
    <div class="access_tab">
        <div class="title">
            新增 JFrog 接入
        </div>

        <FormComp label-position="top" label-width="135px">
            <el-form-item>
                <template #label>
                    <div class="form_label">
                        服务地址
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_addr" clearable placeholder="请输入服务地址" />
                </div>
            </el-form-item>

            <el-form-item prop="address">
                <template #label>
                    <div class="form_label">
                        用户名
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_username" clearable placeholder="请输入仓库Username" />
                </div>
            </el-form-item>

            <el-form-item prop="token">
                <template #label>
                    <div class="form_label">
                        密码
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_password" clearable placeholder="请输入仓库Password" />
                </div>
            </el-form-item>

            <el-form-item prop="token">
                <template #label>
                    <div class="form_label">
                        设置配置名称
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.config_name" clearable placeholder="请输入配置名称" />
                </div>
            </el-form-item>
        </FormComp>

        <div class="video" v-if="!$systemConfig.isClose">
            <video :src="`${origin}/files/video/jfrog-tutorial-video.mp4`"
                   width="568" height="342" controls
                   :poster="`${origin}/files/video/jfrog-tutorial-cover.jpg`"></video>
            <div class="video_text">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/jfrog.html" target="_blank">文档说明 <i
                    class="murphy icon-jiantou-you"></i></a>
            </div>
        </div>
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
import origin from '../../../constants/index';

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
    access_type: 'jfrog',
});
const router = useRouter();

const saveHandle = async () => {
    if (Object.values(formData).some((item) => !item)) {
        showMessage('请填写完整配置', 'warning');
        return;
    }

    try {
        await updatedAccessApi(formData);
        showMessage('接入成功', 'success');
        router.push('/detect-main?from=jfrog');
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
