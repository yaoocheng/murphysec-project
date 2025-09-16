<template>
    <div class="host-4a">
        <div class="title">
            主机检测（4A）
        </div>

        <div class="form-item">
            <div class="name">
                <span class="g-color-err">*</span>
                跳板机 IP 及端口
            </div>

            <div class="g-flex g-align-center">
                <el-input v-model="detectInfo.jump_host" style="width: 272px;" placeholder="请输入 IP"></el-input>
                <span class="g-ml-8 g-mr-8">
                    :
                </span>
                <el-input v-model.number="detectInfo.jump_port" style="width: 272px;" placeholder="请输入端口"></el-input>
            </div>
        </div>

        <div class="form-item">
            <div class="name">
                <span class="g-color-err">*</span>
                用户名
            </div>

            <div>
                <el-input v-model="detectInfo.username" style="width: 564px;" placeholder="请输入用户名"></el-input>
            </div>
        </div>

        <div class="form-item">
            <div class="name">
                <span class="g-color-err">*</span>
                密码
            </div>

            <div>
                <el-input v-model="detectInfo.password" style="width: 564px;" placeholder="请输入密码"></el-input>
            </div>
        </div>

        <div class="form-item">
            <div class="name">
                <span class="g-color-err">*</span>
                命令行拼接方式
            </div>

            <div>
                <el-input v-model="detectInfo.line_rules" style="width: 564px;" placeholder="请输入命令行拼接方式"></el-input>
            </div>
        </div>

        <div class="form-item">
            <div class="name g-flex" style="margin-bottom: 0;">
                <div>
                    <span class="g-color-err">*</span>
                    目标主机
                </div>
            </div>

            <div class="g-flex g-align-center">
                <el-radio-group v-model="type" class="ml-4">
                    <el-radio :value="1" size="large">输入目标主机清单</el-radio>
                    <el-radio :value="2" size="large">上传目标主机清单</el-radio>
                </el-radio-group>

                <el-tooltip placement="right" effect="light">
                    <template #content>
                        <div class="g-p-8">
                            <div class="g-mb-16 g-fw-500 g-color-1 g-f-14">上传目标主机清单文件样式</div>
                            <img src="~ast/img/host-exp.svg" alt="">
                        </div>
                    </template>
                    <div class="g-color-5 g-fw-400 g-ml-4 g-cursor-pointer">示例</div>
                </el-tooltip>
            </div>

            <div v-if="type === 1">
                <el-input @input="changeIPList" v-model="IPList" style="width: 564px;" :rows="4" type="textarea"
                          placeholder="请输入目标主机 IP 列表（每个 IP 单独为一行）如：192.168.1.1"></el-input>
            </div>

            <div v-else style="width: 564px;">
                <el-upload :before-upload="beforeUpload" :action="uploadApi()" :limit="1" :on-error="errorHandle"
                           :on-success="successUpload" :headers="headers" :show-file-list="true" drag>
                    <div class="upload_text">
                        <!-- <i class="murphy icon-shangchuan upload_icon g-mb-8"></i> -->
                        <img class="w-10 h-10 mb-2" src="~ast/img/upload_add.png" alt="">
                        <p>将文件拖拽至此区域或 <span>选择文件上传</span></p>
                        <p>仅支持：TXT，大小不超过 100MB</p>
                    </div>
                </el-upload>
            </div>
        </div>
    </div>

    <div class="fix-btn">
        <div class="btn">
            <el-button
                :disabled="!detectInfo.jump_host || !detectInfo.jump_port || !detectInfo.username || !detectInfo.password || !detectInfo.line_rules || (!detectInfo.addr && !detectInfo.target_list.length)"
                @click="$router.push('/detect-config?from=4a'); detectInfo.team_config_id = '0'; detectInfo.detect_type = 47">下一步</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { uploadApi } from 'api/detect';
import store, { detectInfo } from 'util/store';
import { getUserInfo, showMessage } from 'util/tools';

const type = ref(1);
const IPList = ref('');
const headers = {
    Authorization: getUserInfo()?.token,
};

const changeIPList = (val: string) => {
    detectInfo.target_list = val.split(/[(\r\n)\r\n]+/).filter((item) => item);
};

const beforeUpload = (rawFile: any) => {
    if (rawFile.size > 104857600) {
        showMessage('文件大小不超过100MB', 'warning');
        return false;
    }
    const types = ['txt', 'text'];
    if (!types.includes(rawFile.name.split('.')[rawFile.name.split('.').length - 1])) {
        showMessage('上传格式错误', 'warning');
        return false;
    }
};

const errorHandle = (err: any) => {
    showMessage(err, 'error');
};

const successUpload = (response: any) => {
    detectInfo.addr = response.file_path;
    detectInfo.team_id = store.teamInfo.team_id;
    showMessage('文件上传成功，单次只能上传一个文件进行检测', 'success');
};
</script>

<style scoped lang='less'>
.btn {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;
}

.fix-btn {
    width: 1210px;
    position: fixed;
    z-index: 999;

    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    background-color: #fff;
}

.host-4a {
    margin-top: 24px;
    background-color: #F7F8FB;
    padding: 24px;
    border-radius: 8px;
    position: relative;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #858585;
        margin-bottom: 24px;
    }

    .form-item {
        margin-bottom: 24px;
    }

    .name {
        color: #3c3c3c;
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 8px;
    }

    .upload_text {
        height: 100%;
        display: flex;
        color: #3c3c3c;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        i {
            font-size: 60px;
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
}
</style>
