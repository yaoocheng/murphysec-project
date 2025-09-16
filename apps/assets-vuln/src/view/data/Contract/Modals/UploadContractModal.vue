<template>
    <a-modal class="upload-contract-modal" :confirmLoading="globalState.loading" title="上传合同" :afterClose="clearFormHandle"
             @cancel="emits('update:open', false)" @ok="okHandle" :width="600" :okButtonProps="{ disabled: okBtndisabled }"
             okText="开始识别" cancelText="取消">

        <span class="text-gary-400 text-sm">可识别闭源应用软件的成分信息，批量上传后系统将开始识别文件内容并提取关键信息</span>

        <div class="flex flex-col gap-10 pt-6 pb-3">

            <a-upload-dragger
                v-model:fileList="fileList"
                name="file"
                :multiple="true"
                :action="`${BASE_URL}/platform/component_contract_upload`"
                :headers="{
                    Authorization: userInfo?.token,
                }"
                :beforeUpload="beforeUpload"
                @change="handleChange"
            >
                <!-- <p class="ant-upload-drag-icon"> -->
                <Svg height="40" width="40" name="software_component-icon_file_add_colorful"></Svg>
                <!-- </p> -->
                <p class="ant-upload-text">将文件拖拽至此区域或<span class="text-primary">选择文件上传</span></p>
                <p class="ant-upload-hint">
                    仅支持：PDF，文件数量不超过 100个
                </p>
                <template #itemRender="{ file, actions }">
                    <div class="file-item" :class="{ error: file.status === 'error' , loading : file.status === 'loading'}">
                        <Svg height="24" width="24" name="software_component-icon_file_pdf_colorful"></Svg>
                        <div class="flex-1 flex flex-col">
                            <div class="flex items-center justify-between">
                                <span :style="file.status === 'error' ? 'color: red' : ''" class="ellipsis w-72">{{ file.name }}</span>
                                <div class="icon-button-gray">
                                    <Svg height="16" width="16" @click="actions.remove" name="software_component-delete_file"></Svg>
                                </div>
                            </div>

                        </div>
                        <a-progress v-if="file.status === 'uploading'" class="progress-bar" :percent="file.percent" :show-info="false"  size="small" strokeColor="#6C87FF" :strokeWidth="4"/>
                    </div>
                </template>
            </a-upload-dragger>

        </div>

    </a-modal>
</template>

<script setup>
import {
    ref,
    computed,
} from 'vue';
import { uploadSoftwareComponentContractApi } from 'api/software';
import { BASE_URL } from 'api/index';
import { message, Upload } from 'ant-design-vue';
import { globalState, userInfo } from '@/store';

const emits = defineEmits(['update:open', 'updateList']);
const fileList = ref([]);

const handleChange = (e) => {
    if (e.file.status === 'done') {
        message.success('上传成功');
    } else if (e.file.status === 'error') {
        message.error('上传失败');
    }

    // 检查文件数量
    if (fileList.value.length > 100) {
        message.error('文件数量不能超过100个！');
        fileList.value = fileList.value.slice(0, 100);
    }
};

const beforeUpload = (file) => {
    const isPDF = file.type === 'application/pdf';
    if (!isPDF) {
        message.error('只能上传PDF文件！');
        return Upload.LIST_IGNORE;
    }

    const isLt100 = fileList.value.length < 100;
    if (!isLt100) {
        message.error('文件数量不能超过100个！');
        return Upload.LIST_IGNORE;
    }

    return true;
};

const okHandle = async () => {
    const data = fileList.value.map((item) => ({
        filename: item.name,
        key: item.response.data.key,
    }));

    try {
        await uploadSoftwareComponentContractApi(data);
        emits('update:open', false);
        emits('updateList');
    } catch (error) {
        console.log(error);
    }
};

const okBtndisabled = computed(() => {
    const hasFiles = fileList.value.length > 0;
    const allSuccess = fileList.value.every((item) => item.status === 'done');
    const hasUploading = fileList.value.some((item) => item.status === 'uploading');
    return !hasFiles || !allSuccess || hasUploading;
});
</script>

<style>
.upload-contract-modal {
    margin: 40px 0;
    left: 50%;
    top: 0;
    margin-left: -420px;
    padding-bottom: 0;

    .ant-modal-content{
        padding: 24px;
        width: 840px !important;
    }

    .ant-form-item{
        margin-bottom: 0;
    }

    .ant-upload-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-top: 16px;

    }

    .ant-upload-list::before {
        display: none !important;
    }

    .ant-upload-list::after {
        display: none !important;
    }

    .file-item {
        position: relative;
        display: flex;
        align-items: center;
        border: 1px solid #E6E6E6;
        border-radius: 6px;
        align-items: center;
        padding: 0 12px 0 16px;
        gap: 8px;
        height: 40px;
        /* height: fit-content; */

        &:hover {
            border: 1px solid #6C87FF;
        }

        &.error {
            border: 1px solid #F34C3D;
        }

        .progress-bar {
            position: absolute;
            width: 100%;
            height: 4px;
            bottom: -1px;
            left: 0;
        }
    }
}
</style>
