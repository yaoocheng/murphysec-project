<template>
    <div class="access_tab">
        <div class="title">
            新增 GitHub 接入
        </div>

        <FormComp class="gitlab_config_form" label-width="135px">
            <el-form-item>
                <template #label>
                    <div class="form_label">
                        <span class="g-color-err">*</span>
                        访问令牌
                        <span style="font-size: 12px; color: #6C87FF;cursor:pointer;margin-left: 8px;"
                              @click="(isShowTokenExplain = true)">如何设置 GitHub 访问令牌</span>
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_token" placeholder="请输入 GitHub 访问令牌"></el-input>
                </div>
            </el-form-item>

            <el-form-item >
                <template #label>
                    <div class="form_label">
                        用户名
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_username" clearable
                              placeholder="请输入 GitHub 用户名" />
                </div>
            </el-form-item>

            <el-form-item >
                <template #label>
                    <div class="form_label">
                        代理地址
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.proxy_addr" placeholder="请输入代理地址" clearable />
                </div>
            </el-form-item>

            <el-form-item >
                <template #label>
                    <div class="form_label">
                        <span class="g-color-err">*</span> 设置配置名称
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.config_name" placeholder="请输入配置名称" clearable />
                </div>
            </el-form-item>
        </FormComp>
    </div>

    <div class="btn">
        <el-button @click="saveHandle">完成接入</el-button>
    </div>

    <GithubTokenExplain v-model="isShowTokenExplain" />

</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import store from 'util/store';
import { showMessage } from 'util/tools';
import { updatedAccessApi } from 'api/detect';
import { useRouter } from 'vue-router';
import FormComp from '@/components/FormComp.vue';
import GithubTokenExplain from './GithubTokenExplain.vue';

const isShowTokenExplain = ref<boolean>(false); // token说明
const router = useRouter();

interface formDataType {
    server_token: string,
    proxy_addr: string,
    server_username: string,
    config_name: string,
    team_id: string,
    access_type: string,
}
const formData = reactive<formDataType>({
    server_token: '',
    proxy_addr: '',
    config_name: '',
    server_username: '',
    team_id: store.teamInfo.team_id,
    access_type: 'github',
});

// 保存接入
const saveHandle = async () => {
    if (!formData.server_token || !formData.config_name) {
        showMessage('必填项不能为空', 'warning');
        return;
    }
    try {
        await updatedAccessApi(formData);
        showMessage('接入成功', 'success');
        router.push('/detect-main?from=github');
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
    box-sizing: border-box;
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

    .tunnel_btn {
        width: 58px;
        text-align: center;
        color: #555362;
        display: inline-block;
        border: 1px solid #d3d3d3;
        border-radius: 4px;
        margin-right: 20px;
        cursor: pointer;
    }

    .is_tunnel {
        background-color: #6C87FF;
        color: #fff;
        border-color: #6C87FF;
    }

    .tunnel_item {
        display: flex;
        justify-content: space-between;

        .circel {
            display: inline-block;
            border-radius: 50%;
            width: 8px;
            height: 8px;
        }
    }

    .add_tunnel {
        text-align: center;
        cursor: pointer;
        color: #6C87FF;
    }

    .form_label {
        color: #3c3c3c;
        font-weight: 500;
        // text-align: right;
    }
}

.btn {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
}
</style>
