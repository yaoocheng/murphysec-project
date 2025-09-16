<template>
    <div class="set_title">
        GitLab集成配置
        <el-button v-if="normalTeamAuth||isUserSpace" @click="$router.push('/detect-access?from=gitlab')">新增集成</el-button>
    </div>
    <div class="config_item" v-for="(item, index) in  configList " :key="index">
        <div class="name">
            <div>
                <!-- {{ item.config_name }} -->
                <div class="g-fw-400 g-color-3">配置编号：{{ item.config_id }}</div>
            </div>
            <span class="to-detect" @click="$router.push(`/detect-main?from=gitlab&config_id=${item.config_id}`)">去检测 <i
                class="murphy icon-jiantou-you"></i></span>
        </div>
        <div class="config_content">
            <div v-if="item.status === 'save'">
                <!-- <div class="form_item">
                    <div class="form_label">
                        GitLab地址类型
                    </div>
                    <div>
                        {{ +item.tunnel_id ? '内网地址' : '公网地址' }}
                    </div>
                </div> -->
                <div class="form_item">
                    <div class="form_label">
                        服务地址
                    </div>
                    <div>
                        {{ item.server_addr }}
                    </div>
                </div>
                <div class="form_item">
                    <div class="form_label">
                        访问令牌
                    </div>
                    <div>
                        {{ item.server_token }}
                    </div>
                </div>
                <div class="form_item">
                    <div class="form_label">
                        使用 SSH 方式获取代码
                    </div>
                    <div class="mb-2">
                        {{ item.server_private_key ? '已启用' : '未启用' }}
                    </div>
                    <div class="ssh-show text-85">
                        {{ item.server_private_key }}
                    </div>
                </div>
                <div class="form_item">
                    <div class="form_label">
                        配置名称
                    </div>
                    <div>
                        {{ item.config_name }}
                    </div>
                </div>
            </div>

            <div v-if="item.status === 'edit'">
                <FormComp label-position="top" label-width="135px">
                    <!-- <el-form-item>
                        <template #label>
                            <div class="form_label">
                                GitLab地址类型
                            </div>
                        </template>
                        <div>
                            <el-radio-group v-model="item.addrType">
                                <el-radio :label="1">公网地址</el-radio>
                                <el-radio :label="2">内网地址</el-radio>
                            </el-radio-group>
                        </div>
                    </el-form-item> -->

                    <el-form-item prop="address">
                        <template #label>
                            <div class="form_label">
                                服务地址
                            </div>
                        </template>
                        <div style="width: 500px">
                            <el-input v-model="item.server_addr" clearable
                                      placeholder="请输入GitLab服务地址,如: https://gitlab.xxx.com" />
                        </div>
                    </el-form-item>

                    <!-- <el-form-item prop="tunnel" v-if="item.addrType === 2">
                        <template #label>
                            <div class="form_label">
                                配置内网客户端
                            </div>
                        </template>

                        <div style="width: 500px; position: relative;">
                            <el-select v-model="item.tunnel_id" style="width: 100%;" placeholder="请选择内网客户端">
                                <el-option v-for="(ele, index) in tunnelList" :disabled="!ele.is_online"
                                    :key="ele.tunnel_id" :label="ele.tunnel_name" :value="ele.tunnel_id">
                                    <el-tooltip placement="left" v-if="(index !== tunnelList.length - 1)">
                                        <template #content>
                                            <span style="cursor: pointer;" id="copy_token_btn"
                                                :data-clipboard-text="ele.tunnel_token"
                                                @click="copyFunc('#copy_token_btn')">
                                                复制token
                                            </span>
                                        </template>
                                        <div class="tunnel_item">
                                            <span>{{ ele.tunnel_name }}</span>
                                            <span>
                                                <span :style="{ backgroundColor: ele.is_online ? '#06D7A1' : '#ACB8C7' }"
                                                    class="circel">
                                                </span>
                                                {{ ele.is_online ? '在线' : '离线' }}
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
                        </div>
                    </el-form-item> -->

                    <el-form-item prop="token">
                        <template #label>
                            <div class="form_label">
                                访问令牌
                                <span class="hover_btn1" style="padding: 4px 5px;font-size: 14px;font-weight: 400; color: #6C87FF;cursor:pointer;margin-left: 8px;"
                                      @click="(isShowTokenExplain = true)">如何设置GitLab访问令牌</span>
                            </div>
                        </template>
                        <div style="width: 500px">
                            <div style="display: flex;">
                                <el-input v-model="item.server_token" clearable placeholder="请填写访问令牌" />
                                <el-button @click="verifyGitlabHandle(item)"
                                           style="margin-left: 10px;border:1px solid #6C87FF;color:#6C87FF ;background-color: #fff;">校验</el-button>
                            </div>
                        </div>
                    </el-form-item>

                    <div class="form_label">
                        使用 SSH 方式获取代码 <el-switch v-model="item.ssh" />
                    </div>
                    <el-form-item prop="address">
                        <div style="width: 500px" v-if="item.ssh">
                            <el-input type="textarea" resize="none" :rows="3" v-model="item.server_private_key"
                                      placeholder="请输入 SSH 私钥，并确保对应的公钥已经添加至 GitLab 服务中" clearable />
                        </div>
                    </el-form-item>

                    <el-form-item prop="address">
                        <template #label>
                            <div class="form_label">
                                <span class="text-err">*</span>
                                配置名称
                            </div>
                        </template>
                        <div style="width: 500px">
                            <el-input v-model="item.config_name" clearable />
                        </div>
                    </el-form-item>
                </FormComp>

                <!-- 令牌说明 -->
                <TokenExplain v-model="isShowTokenExplain" />

                <!-- 添加内网客户端 -->
                <AddTunnelClient v-model="isShowAddTunnel" v-if="isShowAddTunnel" />
            </div>
        </div>

        <div class="btn" v-if="item.status === 'save'&&(normalTeamAuth||isUserSpace)">
            <el-popconfirm popper-class="cancle-popper confirm-popper" title="确认删除此配置?" width="200" @confirm="deleteConfig(item)">
                <template #reference>
                    <el-button class="minor_btn" style="height: 32px;width: 80px;">删除</el-button>
                </template>
            </el-popconfirm>
            <el-button class="main_btn" @click="changeHandle(item)">修改</el-button>
        </div>
        <div class="btn" v-if="item.status === 'edit'">
            <el-button class="minor_white_btn" @click="cancleHandle(item, index)">取消</el-button>
            <el-button @click="saveConfigHandle(item)" class="minor_btn" style="height: 32px;width: 80px;">保存</el-button>
        </div>
    </div>
    <NoData v-if="!configList || !configList.length" />
</template>

<script setup lang='ts'>
import store from 'util/store';
import NoData from 'comp/NoData.vue';
import { ref, onBeforeMount } from 'vue';
import { showMessage } from 'util/tools';
import {
    testGitlabServerApi, updatedAccessApi, getAllAccessApi, deleteConfigApi,
} from 'api/detect';
import { getOrgAuthInfo } from '@/control/org/hooks';

import FormComp from '@/components/FormComp.vue';
import AddTunnelClient from '@/control/detect/access-type/AddTunnelClient.vue';
import TokenExplain from '@/control/detect/access-type/TokenExplain.vue';

const configList = ref<Array<any>>([]);
const isShowTokenExplain = ref<boolean>(false); // token说明
const isShowAddTunnel = ref<boolean>(false); // 内网客户端
// const tunnelList = ref<Array<any>>([]);
const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

onBeforeMount(() => {
    configList.value = store.allAccessInfo.gitlab || [];
    configList.value.map((item) => {
        item.status = 'save';
        // item.addrType = 2;
        // item.tunnel_id = item.tunnel_id === '0' ? '' : item.tunnel_id;
        item.ssh = item.server_auth_type === 3;
        return item;
    });
});

// 获取tunnelid列表
// const reloadTunnelList = async () => {
//     const res = await getTunnelListApi({ team_id: store.teamInfo.team_id });
//     tunnelList.value = res.data || [];
//     tunnelList.value.push({
//         tunnel_id: '',
//         tunnel_name: '',
//         is_online: true,
//     });
// };
// reloadTunnelList();

// 校验
const verifyGitlabHandle = async (item: any) => {
    // if (item.addrType === 1) item.tunnel_id = '0';
    if (item.server_addr && item.server_token) {
        // 请求检查gitlab地址
        const res = await testGitlabServerApi(item);
        // eslint-disable-next-line no-unused-expressions
        res.data.invalid === 1 ? showMessage('校验成功', 'success') : showMessage('校验失败', 'error');
    }
};

// 修改
const changeHandle = (item: any) => {
    item.status = 'edit';
    item.server_token = '';
    item.team_id = store.teamInfo.team_id;
    item.access_type = 'gitlab';
};

// 取消
const cancleHandle = async (item: any, index: number) => {
    // 所有接入方式配置情况
    const { data } = await getAllAccessApi({
        team_id: store.teamInfo.team_id,
    });
    const gitlabItem = data.gitlab[index];
    item.status = 'save';
    item.config_name = gitlabItem.config_name;
    item.server_addr = gitlabItem.server_addr;
    item.server_token = gitlabItem.server_token;
    // item.addrType = gitlabItem.tunnel_id === '0' ? 1 : 2;
    // item.tunnel_id = gitlabItem.tunnel_id === '0' ? '' : gitlabItem.tunnel_id;
    item.ssh = gitlabItem.server_auth_type === 3;
    item.server_private_key = gitlabItem.server_private_key;
};

// 保存配置
const saveConfigHandle = async (item: any) => {
    if (!item.server_token || !item.config_name) {
        showMessage('请填写完整配置', 'warning');
        return;
    }
    // if (item.addrType === 2 && (!item.tunnel_id || item.tunnel_id === '0')) {
    //     showMessage('请选择内网客户端', 'warning');
    //     return;
    // }
    // if (item.addrType === 1) item.tunnel_id = '0';
    item.server_auth_type = item.ssh ? 3 : 0;
    try {
        await updatedAccessApi(item);
        showMessage('保存成功', 'success');
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
};

// 删除
const deleteConfig = async (item: any) => {
    await deleteConfigApi({ config_id: item.config_id });
    showMessage('删除成功', 'success');
    window.location.reload();
};
</script>

<style lang='less' scoped>
.set_title {
    font-size: 16px;
    font-weight: 600;
    color: #3c3c3c;
    margin-bottom: 16px;
    .between();
}

.config_item {
    background: #F7F8FB;
    border-radius: 6px;
    padding: 24px;
    margin-bottom: 24px;

    .name {
        font-size: 16px;
        color: #3c3c3c;
        margin-bottom: 16px;
        font-weight: 600;
        .between();

        span.to-detect {
            font-weight: 500;
            color: #6C87FF;
            font-size: 14px;
            cursor: pointer;
        }
    }

    .config_content {
        padding: 16px;
        background-color: #fff;
        border-radius: 6px;
        font-size: 14px;

        .form_label {
            color: #3c3c3c;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .form_item {
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }

            color: #3c3c3c;
            margin-bottom: 24px;
            font-weight: 400;

            .ssh-show {
                max-height: 200px;
                overflow: auto;
                word-break: break-all;
            }
        }
    }
}

.btn {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}
</style>
