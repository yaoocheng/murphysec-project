<template>
    <el-dialog title="更换封面" width="402px" :close-on-click-modal="false">
        <div class="upload_project_avatar">
            <div class="project_avatar">
                <img :src="projectImg || defaultProject" alt="">
            </div>
            <div class="upload_text">
                <el-upload :action="uploadImgApi()" :on-success="successUpload" :before-upload="beforeUpload">
                    <div class="el-upload__text">
                        <div style="color:#6C87FF;margin-bottom: 10px;cursor: pointer;">更换</div>
                        <div style="font-size: 12px;color: #8C95A1;">图片不能超过5MB</div>
                    </div>
                </el-upload>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { uploadImgApi } from 'api/team';
import { changeProjectImg } from 'api/project';
import defaultProject from 'ast/img/default_project.png';
import {
    debounce, showMessage,
} from '@/utils/tools';

const props = defineProps(['projectImg', 'projectId']);

const beforeUpload = (rawFile: any) => {
    const type = rawFile.name.split('.')[rawFile.name.split('.').length - 1];
    const types = ['jpg', 'png', 'gif', 'jpeg'];
    if (!types.includes(type)) {
        showMessage('格式错误，支持：jpg、png、gif、jpeg', 'warning');
        return false;
    }
};

const successUpload = async (res: any) => {
    await changeProjectImg({
        projects_id: props.projectId,
        projects_avatar: res.url,
    });
    showMessage('设置成功', 'success');
    debounce(() => {
        window.location.reload();
    }, 500)();
};
</script>

<style lang="less" scoped>
.upload_project_avatar {
    display: flex;
    align-items: flex-start;
    height: 60px;
    margin-bottom: 30px;

    .project_avatar {
        width: 70px;
        height: 67px;
        box-sizing: border-box;
        background: #FFFFFF;
        border-radius: 8px;
        border: 1px solid #ECECEC;
        margin-right: 16px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 50px;
            height: 50px;
            border-radius: 10px;
        }
    }

    .upload_text {
        width: 254px;
    }
}
</style>

<style lang="less">
.el-upload-list {
    position: relative;
    left: -9px;

    .el-upload-list__item-name {
        text-align: left;
    }

    .el-upload-list__item-file-name {
        width: 80%;
    }
}
</style>
