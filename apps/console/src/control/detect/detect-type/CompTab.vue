<template>
    <div class="git_config">
        <div class="title">
            SBOM清单
        </div>

        <FormComp :model="formData" label-width="113px">
            <!-- <el-form-item prop="addr">
                <template #label>
                    <div class="form_label" style="width:180px; color: #555362; font-weight: 500;">
                        项目名称
                    </div>
                </template>
<div style="display: flex;">
    <el-input placeholder="请输入项目名称" v-model="formData.project_name" clearable style="width:450px;margin-right: 10px;" />
</div>
</el-form-item> -->

            <!-- <el-form-item prop="addr">
                <template #label>
                    <div class="form_label" style="width:180px; color: #555362; font-weight: 500;">
                        生态 - 仓库类型
                    </div>
                </template>
                <div style="display: flex;">
                    <el-select style="width: 450px" v-model="formData.ecosystem">
                        <el-option v-for="item in ecosystemOptions" :key="item.value" :label="item.label"
                                   :value="item.value" />
                    </el-select>
                </div>
            </el-form-item> -->

            <el-form-item>
                <template #label>
                    <div class="form_label">
                        <span class="g-color-err">*</span>
                        组件信息
                    </div>
                </template>
                <div class="w-full">
                    <div class="g-mb-16">
                        <span class="list-btn" :class="{ 'active': activeTab === 2 }"
                              @click="activeTab = 2; detectInfo.comp_type = 'spdx_2.3'">上传文件</span>
                        <span class="list-btn" :class="{ 'active': activeTab === 1 }"
                              @click="activeTab = 1; detectInfo.comp_type = 'list'; uploadRef.clearFiles(); isUpload = false">输入组件信息</span>
                    </div>
                    <div v-if="activeTab === 1">
                        <el-input type="textarea" resize="none" :rows="10" v-model="formData.comp_list" :placeholder="placeholder" />
                        <div class="text-3c flex items-center mt-2">为更精准识别组件风险信息，请依据「生态-仓库类型」规范进行填写
                            <a href="/docs/faqs/integration/ecology-warehouse-type-reference.html" target="_blank"
                               class="button-text-blue h-[26px] ml-1">
                                查看文档 <i style="vertical-align: -2px;" class="murphy icon-jiantou-you"></i>
                            </a>
                        </div>
                    </div>
                    <div v-else>
                        <div class="leading-normal mb-2 font-medium text-3c">
                            <span class="text-err">*</span>
                            文件标准及格式
                        </div>

                        <div class="flex items-center gap-4 mb-4">
                            <el-select v-model="detectInfo.comp_type" class="flex-1" placeholder="请选择标准版本">
                                <el-option label="SPDX 2.3" value="spdx_2.3" />
                                <el-option label="SPDX 2.2" value="spdx_2.2" />
                                <el-option label="CycloneDX 1.6" value="cyclonedx_1.6" />
                                <el-option label="CycloneDX 1.5" value="cyclonedx_1.5" />
                                <el-option label="CycloneDX 1.4" value="cyclonedx_1.4" />
                                <el-option label="CycloneDX 1.3" value="cyclonedx_1.3" />
                                <el-option label="MSDX 1.1" value="msdx_1.1" />
                                <el-option label="墨菲安全自有" value="murphy" />
                            </el-select>
                            <el-select v-model="fileFormat" class="flex-1" placeholder="选择文件格式">
                                <el-option label="JSON" value="json" v-if="detectInfo.comp_type !== 'murphy'" />
                                <el-option label="EXCEL" value="xlsx" v-else />
                            </el-select>
                        </div>

                        <div v-if="fileFormat==='xlsx'"
                             class="flex items-center justify-between h-[44px] box-border py-3 px-4 rounded-md leading-none mb-4 bg-[#6C87FF33]">
                            <div class="flex items-center text-3c">
                                <img class="w-4 mr-2" src="~ast/img/icon_info.png" alt="">
                                为更精准识别组件风险信息，请下载「标准模板」，修改后上传
                            </div>
                            <a href="/console/sbom-template.xlsx" target="view_window" download="SBOM清单导入模板.xlsx">
                                <div class="button-text-blue">
                                    立即下载
                                </div>
                            </a>
                        </div>

                        <el-upload :on-remove="removeHandle" ref="uploadRef" :before-upload="beforeUpload"
                                   :action="uploadApi()" :on-success="successUpload" :headers="uploadData.headers" :limit="1"
                                   :show-file-list="true" drag>
                            <div class="upload_text items-center">
                                <img class="w-10 h-10 mb-2" src="~ast/img/upload_add.png" alt="">
                                <p class="g-color-1 flex justify-center items-center">将文件拖拽至此区域或 <span
                                    class="ml-1 button-text-blue h-[26px]">选择文件上传</span></p>
                                <p>请根据已选的文件标准及格式上传文件 ，大小不超过100MB</p>
                            </div>
                        </el-upload>
                    </div>
                </div>
            </el-form-item>
        </FormComp>

        <!-- <div class="video" v-if="!$systemConfig.isClose">
            <video :src="`${origin}/files/video/sbom-tutorial-video.mp4`" width="508" height="282" controls
                   :poster="`${origin}/files/video/sbom-tutorial-cover.jpg`"></video>
            <div class="video_text flex items-center">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/sbom.html" target="_blank" class="button-text-blue">
                    文档说明
                    <i class="murphy icon-jiantou-you"></i>
                </a>
            </div>
        </div> -->
    </div>
    <div class="btn">
        <el-button @click="nextHandle" :disabled="!formData.comp_list && !isUpload">下一步</el-button>
    </div>
</template>

<script setup lang='ts'>
import {
    reactive, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { detectInfo } from 'util/store';
import { uploadApi } from 'api/detect';
import FormComp from '@/components/FormComp.vue';
import { showMessage, getUserInfo } from '@/utils/tools';

const router = useRouter();
const activeTab = ref<number>(2);
const isUpload = ref<boolean>(false);
const uploadRef = ref();
const fileFormat = ref('json');
const placeholder = '请按照“组件名#版本#生态#仓库”的格式输入组件信息，每个组件信息单独为一行，例如：com.alibaba:fastjson#1.2.27#maven#maven';

const uploadData = ref<{
    headers: any
}>({
    headers: {
        Authorization: getUserInfo()?.token,
    },
});
interface formDataType {
    // project_name: string,
    comp_list: string,
    // ecosystem: string,
}
const formData = reactive<formDataType>({
    // project_name: '',
    comp_list: '',
    // ecosystem: '',
});

const removeHandle = () => {
    detectInfo.addr = '';
    isUpload.value = false;
};

watch(() => detectInfo.comp_type, (newValue) => {
    fileFormat.value = newValue === 'murphy' ? 'xlsx' : 'json';
});

const beforeUpload = (rawFile: any) => {
    if (rawFile.size > 104857600) {
        showMessage('文件大小不超过100MB', 'warning');
        return false;
    }
    const fileExtension = rawFile.name.split('.').pop().toLowerCase();
    if (fileExtension !== fileFormat.value) {
        showMessage(`请上传${fileFormat.value.toUpperCase()}格式的文件`, 'warning');
        return false;
    }
};

const successUpload = (response: any, uploadFile: any) => {
    detectInfo.addr = response.file_path;
    isUpload.value = true;
    [detectInfo.project_name] = uploadFile.name.split('.');
    showMessage('文件上传成功，单次只能上传一个文件进行检测', 'success');
};

// 下一步
const nextHandle = () => {
    // detectInfo.ecosystem = formData.ecosystem;
    detectInfo.comp_list = formData.comp_list.split(/[(\r\n)\r\n]+/).map((item) => item.trim());

    const invalidItem = detectInfo.comp_list.find((item) => item.startsWith('#'));
    if (invalidItem) {
        showMessage('列表中存在未填写名称的组件，请填写后再检测', 'warning');
        return;
    }

    detectInfo.team_config_id = '0';
    detectInfo.detect_type = 29;
    router.push('/detect-config?from=comp');
};
</script>

<style lang='less' scoped>
.git_config {
    margin-top: 24px;
    background-color: #F7F8FB;
    padding: 24px;
    border-radius: 8px;
    position: relative;
    // height: 400px;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #858585;
        margin-bottom: 24px;
    }

    .form_label {
        color: #555362;
        font-weight: 500;
        margin-bottom: 8px;
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

.upload_text {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    i {
        font-size: 60px;
        margin-bottom: 10px;
        color: #6c87ff;
    }

    p {
        span {
            color: #6c87ff;
        }

        &:nth-of-type(2) {
            color: #999;
        }
        line-height: 26px;
        font-size: 14px;
    }
}

.list-btn {
    padding: 4px 8px;
    // width: 64px;
    // height: 24px;
    box-sizing: border-box;
    text-align: center;
    // display: inline-block;
    border-radius: 6px;
    border: 1px solid var(--004, #C7C7C7);
    background: #FFF;
    font-size: 12px;
    margin-right: 12px;
    cursor: pointer;
}

.list-btn.active {
    color: #6C87FF;
    border: 1px solid rgba(108, 135, 255, 0.50);
    background: rgba(108, 135, 255, 0.10);
}

.btn {
    float: right;
    margin-top: 30px;
}

:deep(.el-textarea__inner) {
    padding: 12px ;
}
</style>
