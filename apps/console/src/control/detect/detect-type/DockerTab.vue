<template>
    <div class="git_config">
        <div class="title">
            Docker 指定镜像检测
        </div>

        <FormComp :model="formData" label-width="113px">
            <el-form-item prop="addr">
                <template #label>
                    <div class="form_label" style="width:180px; color: #555362; font-weight: 500;">
                        Docker镜像文件路径
                    </div>
                </template>
                <div style="display: flex;">
                    <el-input  placeholder="请输入需要检测的镜像路径"
                               v-model="formData.addr" clearable style="width:450px;margin-right: 10px;" />
                </div>
            </el-form-item>

            <el-form-item prop="username">
                <template #label>
                    <div class="form_label">
                        用户名
                    </div>
                </template>
                <div style="width: 450px">
                    <el-input v-model="formData.server_username" clearable placeholder="请输入仓库Username" />
                </div>
            </el-form-item>

            <el-form-item prop="password">
                <template #label>
                    <div class="form_label">
                        密码
                    </div>
                </template>
                <div style="width: 450px">
                    <el-input v-model="formData.server_password" clearable placeholder="请输入仓库Password" />
                </div>
            </el-form-item>
        </FormComp>

        <div class="video" v-if="!$systemConfig.isClose">
            <video :src="`${origin}/files/video/docker-tutorial-video.mp4`" width="508"
                   height="282" controls
                   :poster="`${origin}/files/video/docker-tutorial-cover.jpg`"></video>
            <div class="video_text flex items-center">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/docker.html" target="_blank" class="button-text-blue">
                    文档说明
                    <i class="murphy icon-jiantou-you"></i>
                </a>
            </div>
        </div>
    </div>
    <div class="btn">
        <el-button @click="nextHandle" :disabled="!formData.addr">下一步</el-button>
    </div>
</template>

<script setup lang='ts'>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { detectInfo } from 'util/store';
import FormComp from '@/components/FormComp.vue';
// import { showMessage } from '@/utils/tools';
import origin from '../../../constants/index';

const router = useRouter();
interface formDataType {
    addr: string,
    server_username: string,
    server_password: string,
}
const formData = reactive<formDataType>({
    addr: '',
    server_username: '',
    server_password: '',
});

// 下一步
const nextHandle = () => {
    // if (!formData.addr) {
    //     showMessage('镜像路径不能为空', 'warning');
    //     return;
    // }
    Object.assign(detectInfo, formData);
    detectInfo.team_config_id = '0';
    detectInfo.detect_type = 17;
    router.push('/detect-config?from=docker');
};
</script>

<style lang='less' scoped>
.git_config {
    margin-top: 24px;
    background-color: #F7F8FB;
    padding: 24px;
    border-radius: 8px;
    position: relative;
    height: 400px;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #858585;
        margin-bottom: 24px;
    }

    .form_label {
        color: #555362;
        font-weight: 500;
    }

    .video {
        position: absolute;
        top: 72px;
        right: 24px;
        background: #FFFFFF;
        width: 508px;
        height: 282px;
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
}

.btn {
    float: right;
    margin-top: 30px;
}</style>
