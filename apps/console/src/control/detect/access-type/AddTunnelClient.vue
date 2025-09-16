<template>
    <el-dialog class="token_popup" width="650px" top="5%" :close-on-click-modal="false">
        <template #header>
            <div class="title">
                新增内网客户端
            </div>
            <div class="desc">
                处于公司内网中的 GitLab 平台无法直接通过公网进行访问，内网客户端是为了解决这个问题而开发的网络通道简易工具，只需执行几条命令即可完成配置
            </div>
        </template>
        <div class="content">
            <el-input clearable style="height: 40px; margin-bottom: 15px;" v-model="agencyValue"
                placeholder="请给内网代理起个名字">
                <template #append>
                    <el-button @click="createTunnelHandle" class="append_btn" :disabled="!agencyValue">
                        获取token
                    </el-button>
                </template>
            </el-input>

            <div class="copy_wrap token_copy" v-if="token">
                <div>
                    <i class="murphy icon-fuzhi1" style="margin-right: 5px;" id="copy_url" :data-clipboard-text="token"
                        @click="copyFunc('#copy_url')"></i>
                    内网客户端认证token
                </div>
                <span>{{ token }}</span>
            </div>

            <div class="step_title">操作步骤</div>
            <div class="step_title">下载内网客户端</div>
            <div class="copy_wrap">
                <i class="murphy icon-fuzhi1" id="copy_url" :data-clipboard-text="order"
                    @click="copyFunc('#copy_url')"></i>
                <span>{{ order }}</span>
            </div>
            <el-image style="width: 320px; height: 220px; margin-bottom: 15px;" :hide-on-click-modal="true"
                :src="showImgs.tunnel1.small" :preview-src-list="showImgs.tunnel1.big">
            </el-image>

            <div class="step_title">内网客户端认证及运行</div>
            <div>执行命令后，复制粘贴生成的认证 token 并回车，此时内网客户端已经正常运行。</div>
            <div class="copy_wrap">
                <i class="murphy icon-fuzhi1" id="copy_url" :data-clipboard-text="order1"
                    @click="copyFunc('#copy_url')"></i>
                <span>{{ order1 }}</span>
            </div>
            <el-image style="width: 320px; height: 220px" :hide-on-click-modal="true" :src="showImgs.tunnel2.small"
                :preview-src-list="showImgs.tunnel2.big">
            </el-image>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { copyFunc } from 'util/tools';
import { createTunnelApi } from 'api/detect';
import tunnel1 from 'ast/configImg/tunnel1.png';
import tunnel2 from 'ast/configImg/tunnel2.png';
import store from '@/utils/store';

const agencyValue = ref<string>('');
const order = ref<string>('wget https://s.murphysec.com/release/tunnel.tar.gz && tar -xvf tunnel.tar.gz && cd murphy-tunnel');
const order1 = ref<string>('sh tools.sh install');
const token = ref<string>('');
const showImgs = {
    tunnel1: {
        small: tunnel1,
        big: [tunnel1],
    },
    tunnel2: {
        small: tunnel2,
        big: [tunnel2],
    },
};

const createTunnelHandle = async () => {
    const res = await createTunnelApi({ team_id: store.teamInfo.team_id, tunnel_name: agencyValue.value });
    token.value = res.data.token;
};
</script>

<style lang='less' scoped>
.title {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #2F2E3F;
}

.desc {
    font-size: 14px;
    color: #4F4D5C;
    line-height: 24px;
}

.content {
    padding: 15px 0;
    padding-right: 10px;
    height: 400px;
    overflow: auto;

    .append_btn {
        background-color: #6C87FF !important;
        height: 100%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        color: #fff !important;
    }

    .step_title {
        font-weight: 600;
        color: #3D3D3D;
        margin-bottom: 10px;
    }

    .copy_wrap {
        line-height: 35px;
        background: #F5F7FA;
        border-radius: 6px;
        border: 1px solid #CED6E0;
        color: #969DA7;
        padding-left: 10px;
        margin-top: 10px;
        margin-bottom: 20px;

        i {
            margin-right: 10px;
            font-size: 18px;
            cursor: pointer;
        }
    }

    .token_copy {
        height: auto;
        line-height: 30px;
        padding: 0 10px;
        .ellipsis();
    }
}
</style>
