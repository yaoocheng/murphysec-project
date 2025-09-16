<template>
    <el-upload :on-change="uploadChange" :before-upload="beforeUpload" :headers="headers" :on-success="successUpload"
               :show-file-list="true" drag>
        <div class="upload_text">
            <!-- <i class="murphy icon-shangchuan upload_icon"></i> -->
            <img class="w-10 h-10 mb-2" src="~ast/img/upload_add.png" alt="">
            <p>将文件拖拽至此区域或<span>选择文件上传</span></p>
            <p>
                <slot />
            </p>
        </div>
    </el-upload>
</template>

<script setup lang='ts'>
import { getUserInfo, showMessage } from 'util/tools';
import { fileExtBlack } from '../constants/constant';

const emits = defineEmits(['getFilePath']);
const props = defineProps<{ type: number }>();
const headers = { Authorization: getUserInfo().token };

const beforeUpload = (file: any) => {
    const arr = file.name.split('.');
    if (fileExtBlack.includes(arr[arr.length - 1])) {
        showMessage('文件格式不正确', 'error');
        return false;
    }

    emits('getFilePath', {
        path: null,
        type: props.type,
    });
};

const uploadChange = (file: any, files: any) => {
    if (files.length === 2) {
        files.splice(0, 1);
    }
};

const successUpload = (response: any) => {
    emits('getFilePath', {
        path: response.file_path,
        type: props.type,
    });
    showMessage('文件上传成功，单次只能上传一个文件进行检测', 'success');
};
</script>

<style lang='less' scoped>
.upload_text {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    i {
        font-size: 60px;
        margin-bottom: 20px;
        color: #6c87ff;
    }

    p {
        span {
            color: #6c87ff;
        }

        &:nth-of-type(2) {
            color: #999;
            margin-top: 8px;
        }

        font-size: 13px;
    }
}
</style>
