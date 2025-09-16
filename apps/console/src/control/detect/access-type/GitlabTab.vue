<template>
    <div class="access_tab" >
        <div class="title">
            新增 GitLab 接入
        </div>

        <FormComp :model="formData" class="gitlab_config_form" label-width="135px">
            <!-- <el-form-item>
                <template #label>
                    <div class="form_label">
                        GitLab 地址类型
                        <el-tooltip placement="top" content="若GitLab部署在内网，需要配置内网客户端才能检测">
                            <i style="font-size: 14px;" class="murphy icon-wenhaoxiao"></i>
                        </el-tooltip>
                    </div>
                </template>
                <div>
                    <el-radio-group v-model="addrType">
                        <el-radio :label="1">公网地址</el-radio>
                        <el-radio :label="2">内网地址</el-radio>
                    </el-radio-group>
                </div>
            </el-form-item> -->

            <el-form-item prop="address">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span>
                        服务地址
                    </div>
                </template>
                <div style="width: 500px">
                    <el-input v-model="formData.server_addr" clearable
                              placeholder="请输入 GitLab 服务地址，如 https://gitlab.murphysec.com" />
                </div>
            </el-form-item>

            <!-- <el-form-item prop="tunnel" v-if="addrType === 2">
                <template #label>
                    <div class="form_label">
                        配置内网客户端
                    </div>
                </template>

                <div style="width: 500px; position: relative;">
                    <el-select v-model="formData.tunnel_id" style="width: 100%;" placeholder="请选择内网客户端">
                        <el-option v-for="(item, index) in tunnelList" :disabled="!item.is_online" :key="item.tunnel_id"
                            :label="item.tunnel_name" :value="item.tunnel_id">
                            <el-tooltip placement="left" v-if="(index !== tunnelList.length - 1)">
                                <template #content>
                                    <span style="cursor: pointer;" id="copy_token_btn"
                                        :data-clipboard-text="item.tunnel_token" @click="copyFunc('#copy_token_btn')">
                                        复制token
                                    </span>
                                </template>
                                <div class="tunnel_item">
                                    <span>{{ item.tunnel_name }}</span>
                                    <span>
                                        <span :style="{ backgroundColor: item.is_online ? '#06D7A1' : '#ACB8C7' }"
                                            class="circel">
                                        </span>
                                        {{ item.is_online ? '在线' : '离线' }}
                                    </span>
                                </div>
                            </el-tooltip>

                            <div class="add_tunnel" v-else @click="(isShowAddTunnel = true)">
                                <i class="murphy icon-jia"></i>
                                新增内网客户端
                            </div>
                        </el-option>
                    </el-select>
                    <i class="murphy icon-shuaxin reload" @click="reloadTunnelList"
                        style="cursor: pointer; position: absolute;right: 30px;top:2px;color: #a8abb2;"></i>
                    <span v-loading="tunnelLoading" style="position: absolute;right: -10px;top:20px"></span>
                </div>
            </el-form-item> -->

            <el-form-item prop="token">
                <template #label>
                    <div class="form_label">
                        <span class="text-err">*</span>
                        访问令牌
                        <span class="hover_btn1" style="padding: 4px 5px; font-weight: 400;font-size: 14px; color: #6C87FF;cursor:pointer;margin-left: 8px;"
                              @click="(isShowTokenExplain = true)">如何设置 GitLab 访问令牌</span>
                    </div>
                </template>
                <div style="width: 500px">
                    <!-- <div>
                        <span style="font-size: 12px; color: #6C87FF;cursor:pointer"
                            @click="(isShowTokenExplain = true)">如何设置GitLab访问令牌</span>
                    </div> -->
                    <div style="display: flex;">
                        <el-input v-model="formData.server_token" clearable placeholder="请填写访问令牌" />
                        <el-button @click="verifyGitlabHandle"
                                   style="width: 80px; margin-left: 10px;border:1px solid #6C87FF;color:#6C87FF ;background-color: #fff;">校验</el-button>
                    </div>
                </div>
            </el-form-item>

            <div class="form_label g-f-14">
                使用 SSH 方式获取代码 <el-switch v-model="formData.ssh" />
            </div>
            <el-form-item prop="address">
                <div style="width: 500px" v-if="formData.ssh">
                    <el-input type="textarea" resize="none" :rows="3" v-model="formData.server_private_key"
                              placeholder="请输入 SSH 私钥，并确保对应的公钥已经添加至 GitLab 服务中" clearable />
                </div>
            </el-form-item>

            <el-form-item prop="address">
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

        <div class="video" v-if="!$systemConfig.isClose">
            <video :src="`${origin}/files/video/gitlab-tutorial-video.mp4`" width="568" height="342" controls
                   :poster="`${origin}/files/video/gitlab-tutorial-cover.jpg`"></video>
            <div class="video_text">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/gitlab.html" target="_blank">文档说明 <i
                    class="murphy icon-jiantou-you"></i></a>
            </div>
        </div>

        <!-- 令牌说明 -->
        <TokenExplain v-model="isShowTokenExplain" />

        <!-- 添加内网客户端 -->
        <AddTunnelClient v-model="isShowAddTunnel" v-if="isShowAddTunnel" />
    </div>

    <div class="btn">
        <el-button @click="saveHandle">完成接入</el-button>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import store from 'util/store';
import { showMessage } from 'util/tools';
import { updatedAccessApi, testTokenApi } from 'api/detect';
import { useRouter } from 'vue-router';
import FormComp from '@/components/FormComp.vue';
import AddTunnelClient from './AddTunnelClient.vue';
import TokenExplain from './TokenExplain.vue';
import origin from '../../../constants/index';

interface formDataType {
    server_addr: string;
    server_token: string,
    // tunnel_id: string,
    config_name: string,
    team_id: string,
    access_type: string,
    server_private_key: string,
    ssh: boolean,
    server_auth_type: number,
}
const formData = reactive<formDataType>({
    server_addr: '',
    server_token: '',
    // tunnel_id: '',
    config_name: '',
    team_id: store.teamInfo.team_id,
    access_type: 'gitlab',
    ssh: false,
    server_private_key: '',
    server_auth_type: 0,
});
const router = useRouter();
const isShowTokenExplain = ref<boolean>(false); // token说明
const isShowAddTunnel = ref<boolean>(false); // 内网客户端
// const addrType = ref<number>(1);
// const tunnelList = ref<Array<any>>([]);
// const tunnelLoading = ref<boolean>(false);

// 获取tunnelid列表
// const reloadTunnelList = async () => {
//     const res = await getTunnelListApi({ team_id: store.teamInfo.team_id });
//     tunnelList.value = res.data || [];
//     // eslint-disable-next-line no-unused-expressions
//     tunnelList.value.push({
//         tunnel_id: '',
//         tunnel_name: '',
//         is_online: true,
//     });
// };
// reloadTunnelList();

// 校验
const verifyGitlabHandle = async () => {
    // if (addrType.value === 1) formData.tunnel_id = '0';
    if (formData.server_addr && formData.server_token) {
        // 请求检查gitlab地址
        const res = await testTokenApi(formData);
        // eslint-disable-next-line no-unused-expressions
        res.data.invalid === 1 ? showMessage('校验成功', 'success') : showMessage('校验失败', 'error');
    }
};

// 保存接入
const saveHandle = async () => {
    if (!formData.server_addr || !formData.server_token || !formData.config_name) {
        showMessage('请填写完整配置', 'warning');
        return;
    }
    // if (addrType.value === 2 && (!formData.tunnel_id || formData.tunnel_id === '0')) {
    //     showMessage('请选择内网客户端', 'warning');
    //     return;
    // }
    // if (addrType.value === 1) formData.tunnel_id = '0';
    formData.server_auth_type = formData.ssh ? 3 : 0;
    try {
        await updatedAccessApi(formData);
        showMessage('接入成功', 'success');
        router.push('/detect-main?from=gitlab');
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
    float: right;
    margin-top: 30px;
}
</style>
