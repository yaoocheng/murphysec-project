<template>
    <div class="git_config">
        <div class="title">
            Git 指定项目检测
        </div>

        <FormComp :rules="rules" :model="formData" label-width="113px">
            <!-- <el-form-item>
                <template #label>
                    <div class="form_label">
                        Git地址类型：
                    </div>
                </template>
                <div style="margin-bottom: 10px;">
                    <el-button>公网</el-button>
                    <el-button>内网</el-button>
                </div>
            </el-form-item> -->

            <el-form-item prop="addr">
                <template #label>
                    <div class="form_label" style="width:70px; color: #555362; font-weight: 500;">
                        仓库地址：
                    </div>
                </template>
                <div style="display: flex;">
                    <el-input placeholder="请输入 Git 仓库完整地址，如 https://git.abc.com/dev/service.git" v-model="formData.addr"
                              clearable style="width:450px;margin-right: 10px;" />
                </div>
            </el-form-item>

            <el-form-item prop="username">
                <template #label>
                    <div class="form_label">
                        用户名（可选）
                    </div>
                </template>
                <div style="width: 450px">
                    <el-input v-model="formData.server_username" clearable placeholder="请输入仓库用户名" />
                </div>
            </el-form-item>

            <el-form-item prop="password">
                <template #label>
                    <div class="form_label">
                        密码（可选）
                    </div>
                </template>
                <div style="width: 450px">
                    <el-input v-model="formData.server_password" clearable placeholder="请输入仓库密码" />
                </div>
            </el-form-item>

            <el-form-item>
                <template #label>
                    <div class="form_label">
                        分支（可选）
                    </div>
                </template>
                <div style="width: 450px" class="flex items-center">
                    <!--                    <el-select :disabled="isShowBranch" filterable allow-create default-first-option-->
                    <!--                        v-model="formData.branch" clearable placeholder="请选择分支" style="width: 150px;">-->
                    <!--                        <el-option v-for="item in branchOption" :key="item.branch" :label="item.branch"-->
                    <!--                            :value="item.branch" />-->
                    <!--                    </el-select>-->
                    <el-select filterable allow-create default-first-option v-model="formData.branch" clearable
                               placeholder="请输入或选择分支" style="width: 250px;">
                        <el-option v-for="item in branchOption" :key="item.branch" :label="item.branch"
                                   :value="item.branch" />
                    </el-select>
                    <!-- <span @click="showAgencyHandle" class="g-ml-16 g-cursor-pointer g-color-5">获取分支</span> -->
                    <span @click="showAgencyHandle" class="button-text-blue">获取分支</span>
                </div>
            </el-form-item>

            <!-- <el-form-item prop="name">
                <template #label>
                    <div class="form_label">
                        设置名称
                    </div>
                </template>
                <div style="width: 450px">
                    <el-input v-model="formData.name" clearable />
                </div>
            </el-form-item> -->
        </FormComp>

        <div class="video" v-if="!$systemConfig.isClose">
            <video :src="`${origin}/files/video/git-tutorial-video.mp4`" width="508" height="282" controls
                   :poster="`${origin}/files/video/git-tutorial-cover.jpg`"></video>
            <div class="video_text flex items-center">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/git.html" target="_blank" class="button-text-blue">
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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { detectInfo } from 'util/store';
import { getGitBranchApi } from 'api/detect';
import { validateGitUrl } from 'util/verify';
import FormComp from '@/components/FormComp.vue';
// import { showMessage } from '@/utils/tools';
import origin from '../../../constants/index';

interface formDataType {
    addr: string,
    branch: string,
    server_username: string,
    server_password: string,
}
const formData = reactive<formDataType>({
    addr: '',
    branch: '',
    server_username: '',
    server_password: '',
});

// 表单校验
const rules = reactive({
    addr: [{ validator: validateGitUrl }],
});
const branchOption = ref<Array<any>>([]);
// const isShowBranch = ref<boolean>(true);
const router = useRouter();
// const needUserPwd = ref<boolean>(false);

// 检查获取分支
const showAgencyHandle = async () => {
    const regex = /https{0,1}:\/\/([\w.]+\/?)\S*/;
    if (formData.addr && regex.test(formData.addr)) {
        // if(!formData.server_username || !formData.server_password) {
        //     showMessage('请将表单填写完整', 'warning');
        //     return;
        // }
        try {
            const branchRes = await getGitBranchApi({
                git_addr: formData.addr.trim(),
                server_username: formData.server_username || '',
                server_password: formData.server_password || '',
            });
            branchOption.value = branchRes.data;
            // isShowBranch.value = false;
            // needUserPwd.value = false;
        } catch (error) {
            // needUserPwd.value = true;
            // if (!formData.server_username || !formData.server_password) {
            //     showMessage('授权校验失败，请填写用户名和密码', 'error');
            // }
        }
    }
};

// 下一步
const nextHandle = async () => {
    // if (!formData.addr) {
    //     showMessage('仓库地址不能为空', 'warning');
    //     return;
    // }
    // if (needUserPwd.value) {
    //     showMessage('仓库授权校验失败，无法下一步', 'warning');
    //     return;
    // }
    try {
        await getGitBranchApi({
            git_addr: formData.addr.trim(),
            server_username: formData.server_username || '',
            server_password: formData.server_password || '',
        });
    } catch (error) {
        return;
    }
    Object.assign(detectInfo, formData);
    detectInfo.team_config_id = '0';
    detectInfo.detect_type = 7;
    router.push('/detect-config?from=git');
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
}
</style>
