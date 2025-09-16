<template>
    <div class="access_tab">
        <div class="title">
            新增简单云（代码仓库）接入
        </div>

        <FormComp :model="formData" class="gitlab_config_form" label-width="135px">
            <el-form-item prop="server_addr">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span>
                        简单云服务地址
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_addr" clearable
                              placeholder="请输入简单云服务地址，如：https://xxx.ezone.work" />
                </div>
            </el-form-item>

            <el-form-item prop="server_addr">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span>
                        用户名
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_username" clearable
                              placeholder="请输入用户名" />
                </div>
            </el-form-item>

            <el-form-item prop="server_token">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span>
                        访问令牌
                        <span class="hover_btn1" style="padding: 4px 5px; font-weight: 400;font-size: 14px; color: #6C87FF;cursor:pointer;margin-left: 8px;"
                              @click="(isShowTokenExplain = true)">如何设置 “简单云” 访问令牌</span>
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_token" clearable placeholder="请输入简单云访问令牌" />
                </div>
            </el-form-item>

            <el-form-item prop="config_name">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span>
                        设置配置名称
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.config_name" placeholder="请输入配置名称" clearable />
                </div>
            </el-form-item>
        </FormComp>

        <!-- 令牌说明弹框 -->
        <el-dialog v-model="isShowTokenExplain" title="如何设置简单云访问令牌" width="800px" :close-on-click-modal="false">
            <div class="content max-h-[500px] overflow-auto">
                <div class="item">
                    <p>1. 进入 简单云 平台，右上角点击头像，选择"个人设置"</p>
                    <el-image style="width: 212px; height: 142px" :hide-on-click-modal="true" :src="ezone1"
                              :preview-src-list="[ezone1]">
                    </el-image>
                </div>
                <div class="item">
                    <p>2. 左侧导航选择"访问令牌"，点击"新建令牌"</p>
                    <el-image style="width: 212px; height: 142px" :hide-on-click-modal="true" :src="ezone2"
                              :preview-src-list="[ezone2]">
                    </el-image>
                </div>
                <div class="item">
                    <p>3. 在“创建访问令牌”中，输入“令牌名称” > 选择权限“代码库”和“制品库” > 设置“生效策略” > 输入“密码” > 确认</p>
                    <el-image style="width: 212px; height: 142px" :hide-on-click-modal="true" :src="ezone3"
                              :preview-src-list="[ezone3]">
                    </el-image>
                </div>
                <div class="item">
                    <p>4.“复制”已创建的访问令牌</p>
                    <el-image style="width: 212px; height: 142px" :hide-on-click-modal="true" :src="ezone4"
                              :preview-src-list="[ezone4]">
                    </el-image>
                </div>
            </div>
        </el-dialog>
    </div>

    <div class="btn">
        <el-button @click="saveHandle">完成接入</el-button>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import store from 'util/store';
import { showMessage } from 'util/tools';
import { updatedAccessApi } from 'api/detect';
import { useRouter } from 'vue-router';
import FormComp from '@/components/FormComp.vue';
import ezone1 from '@/assets/img/ezone1.png';
import ezone2 from '@/assets/img/ezone2.png';
import ezone3 from '@/assets/img/ezone3.png';
import ezone4 from '@/assets/img/ezone4.png';

interface formDataType {
    server_addr: string;
    server_token: string;
    config_name: string;
    team_id: string;
    server_username: string;
    access_type: 'ezone_code'; // ezone_code-代码， ezone_package-制品
}

const formData = reactive<formDataType>({
    server_addr: '',
    server_token: '',
    config_name: '',
    server_username: '',
    team_id: store.teamInfo.team_id,
    access_type: 'ezone_code', // ezone_code-代码， ezone_package-制品
});

const router = useRouter();
const isShowTokenExplain = ref<boolean>(false); // token说明

// 保存接入
const saveHandle = async () => {
    if (!formData.server_addr || !formData.server_token || !formData.config_name || !formData.server_username) {
        showMessage('请填写完整配置', 'warning');
        return;
    }

    try {
        await updatedAccessApi(formData);
        showMessage('代码接入成功', 'success');
        router.push('/detect-main?from=ezone_code');
    } catch (error: any) {
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
    height: 400px;
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
    }

    .error-text {
        color: #ff4d4f;
        font-size: 12px;
        margin-top: 4px;
    }
}

.btn {
    float: right;
    margin-top: 30px;
}

.content {
    .item {
        margin-bottom: 16px;

        p {
            margin: 0;
            color: #3c3c3c;
            line-height: 1.5;
        }
    }
}
</style>
