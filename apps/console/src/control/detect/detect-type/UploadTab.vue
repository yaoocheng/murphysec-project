<template>
    <div class="file_config">
        <div class="title">
            上传文件检测
        </div>
        <FormComp class="gitlab_config_form" label-width="135px">
            <!-- <el-form-item prop="projectName">
                <template #label>
                    <div class="form_label">
                        设置名称
                    </div>
                </template>
<div style="width: 500px">
    <el-input v-model="detectInfo.project_name" clearable />
</div>
</el-form-item> -->
            <!-- <el-form-item prop="projectName">
                <template #label>
                    <div class="form_label">
                        设置名称
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.projectName" clearable />
                </div>
            </el-form-item> -->
            <!-- <el-form-item>
                <template #label>
                    <div class="form_label">
                        文件类型
                    </div>
                </template>
                <div class="hole_set">
                    <el-radio-group v-model="fileType">
                        <el-radio :label="9">源代码上传</el-radio>
                        <el-radio :label="10">二进制上传</el-radio>
                        <el-radio :label="11">Docker镜像文件检测</el-radio>
                    </el-radio-group>
                </div>
            </el-form-item> -->
            <el-form-item>
                <template #label>
                    <div class="form_label flex justify-between items-center">
                        文件上传
                        <span class="font-normal text-xs flex items-center justify-center">
                            <!-- <a class="text-primary" href="/docs/faqs/quick-start-for-beginners/programming-language-supported.html" target="_blank"> -->
                            <a class="button-text-blue" href="/docs/faqs/quick-start-for-beginners/programming-language-supported.html" target="_blank">
                                查看文档
                            </a>
                            了解详细的检测支持情况
                        </span>
                    </div>
                </template>
                <div style="flex: 1">
                    <el-upload :before-upload="beforeUpload" :action="uploadApi()" :on-success="successUpload"
                               :headers="headers" :limit="1" :show-file-list="true" drag>
                        <div class="upload_text">
                            <img class="w-10 h-10 mb-2" src="~ast/img/upload_add.png" alt="">
                            <!-- <i class="murphy icon-shangchuan upload_icon"></i> -->
                            <!-- <p class="mt-2 "> -->
                            <p class="mt-2 flex items-center justify-center">
                                将文件拖拽至此区域或
                                <span class="button-text-blue">选择文件上传</span>
                            </p>
                            <p class="mt-2">文件上传不限制格式，支持包括 tar、zip、7z、rar、gz、xz、bz2、deb、iso、xar、cpio、lz、lz4 等主流压缩 /
                                归档格式的检测</p>
                            <p class="mt-2">文件大小默认限制为 5GB</p>
                        </div>
                    </el-upload>
                </div>
            </el-form-item>
        </FormComp>
    </div>

    <div class="btn">
        <el-button :disabled="isDisAbled"
                   @click="$router.push('/detect-config?from=upload'); detectInfo.team_config_id = '0'; detectInfo.detect_type = 8">下一步</el-button>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store, { detectInfo } from 'util/store';
import { uploadApi } from 'api/detect';
import { getUserInfo, showMessage } from 'util/tools';
import FormComp from '@/components/FormComp.vue';

const isDisAbled = ref<boolean>(true);
const headers = {
    Authorization: getUserInfo()?.token,
};

const beforeUpload = (rawFile: any) => {
    // if (rawFile.size > 5368709120) {
    //     showMessage('文件大小不超过1GB', 'warning');
    //     return false;
    // }
    // const types = ['zip', 'tjz', 'jzip', 'rar', 'tar', 'gz', '7z', 'xz', 'bz2', 'win', 'lz4'];
    // if (!types.includes(rawFile.name.split('.')[rawFile.name.split('.').length - 1]) && fileType.value === 9) {
    //     showMessage('格式错误', 'warning');
    //     return false;
    // }
    detectInfo.upload_file_name = rawFile.name;
};

const successUpload = (response: any, uploadFile: any) => {
    detectInfo.addr = response.file_path;
    isDisAbled.value = false;
    detectInfo.team_id = store.teamInfo.team_id;
    detectInfo.project_name = uploadFile.name;
    showMessage('文件上传成功，单次只能上传一个文件进行检测', 'success');
};

</script>

<style lang='less' scoped>
.file_config {
    margin-top: 24px;
    background-color: #F7F8FB;
    padding: 24px;
    border-radius: 8px;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #858585;
        margin-bottom: 24px;
    }

    .hole_set {
        .type span {
            display: inline-block;
            padding: 0 10px;
            border: 1px solid #dcdcdc;
            text-align: center;
            margin-right: 20px;
            border-radius: 6px;
            cursor: pointer;
        }

        .type span.active {
            background-color: #6c87ff;
            color: #fff;
        }
    }

    .form_label {
        color: #3c3c3c;
        font-weight: 500;
    }

    .upload_text {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        line-height: 20px;

        i {
            font-size: 60px;
            margin-bottom: 20px;
            color: #6c87ff;
        }

        p {
            span {
                color: #6c87ff;
            }

            &:nth-of-type(3) {
                color: #999;
                margin-top: 8px;
            }

            font-size: 13px;
        }
    }

    .file_type_btn {
        text-align: center;
        color: #555362;
        display: inline-block;
        border: 1px solid #d3d3d3;
        border-radius: 4px;
        margin-right: 20px;
        font-size: 14px;
        cursor: pointer;
    }

    .active_btn {
        background-color: #6C87FF;
        color: #fff;
        border-color: #6C87FF;
    }
}

.btn {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;
}
</style>
