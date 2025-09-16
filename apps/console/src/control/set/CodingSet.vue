<template>
    <div class="set_title">
        CODING集成配置
        <el-button v-if="normalTeamAuth||isUserSpace" @click="$router.push('/detect-access?from=coding')">新增集成</el-button>
    </div>

    <div class="config_item" v-for="(item, index) in  configList " :key="index">
        <div class="name">
            <div>
                <!-- {{ item.config_name }} -->
                <div class="g-fw-400 g-color-3">配置编号：{{ item.config_id }}</div>
            </div>
            <span class="to-detect" @click="$router.push(`/detect-main?from=coding&config_id=${item.config_id}`)">去检测 <i
                class="murphy icon-jiantou-you"></i></span>
        </div>
        <div class="config_content">
            <div v-if="item.status === 'save'">
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
                        配置名称
                    </div>
                    <div>
                        {{ item.config_name }}
                    </div>
                </div>
            </div>

            <div v-if="item.status === 'edit'">
                <FormComp label-position="top" label-width="135px">
                    <el-form-item prop="address">
                        <template #label>
                            <div class="form_label">
                                服务地址
                            </div>
                        </template>
                        <div style="width: 500px">
                            <el-input v-model="item.server_addr" clearable
                                      placeholder="请输入CODING服务地址，如：https://xxxxx.coding.net" />
                        </div>
                    </el-form-item>

                    <el-form-item prop="token">
                        <template #label>
                            <div class="form_label">
                                访问令牌
                                <span class="hover_btn1" style="padding: 4px 5px;font-size: 14px;font-weight: 400; color: #6C87FF;cursor:pointer;margin-left: 8px;"
                                      @click="(isShowTokenExplain = true)">如何设置CODING访问令牌</span>
                            </div>
                        </template>
                        <div style="width: 500px">
                            <div style="display: flex;">
                                <el-input v-model="item.server_token" clearable placeholder="请填写访问令牌" />
                                <el-button class="minor_btn" @click="verifyCodingHandle(item)"
                                           style="width: 80px ;margin-left: 10px;height: 32px">校验</el-button>
                            </div>
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
    testCodingServerApi, updatedAccessApi, getAllAccessApi, deleteConfigApi,
} from 'api/detect';
import { getOrgAuthInfo } from '@/control/org/hooks';

import FormComp from '@/components/FormComp.vue';
import TokenExplain from '@/control/detect/access-type/CodingToken.vue';

const configList = ref<Array<any>>([]);
const isShowTokenExplain = ref<boolean>(false); // token说明
const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

onBeforeMount(() => {
    configList.value = store.allAccessInfo.coding || [];
    configList.value.map((item) => {
        item.status = 'save';
        return item;
    });
});

// 校验
const verifyCodingHandle = async (item: any) => {
    if (item.server_addr && item.server_token) {
        // 请求检查Coding地址
        const res = await testCodingServerApi(item);
        // eslint-disable-next-line no-unused-expressions
        res.data.invalid === 1 ? showMessage('校验成功', 'success') : showMessage('校验失败', 'error');
    }
};

// 修改
const changeHandle = (item: any) => {
    item.status = 'edit';
    item.server_token = '';
    item.team_id = store.teamInfo.team_id;
    item.access_type = 'coding';
};

// 取消
const cancleHandle = async (item: any, index: number) => {
    // 所有接入方式配置情况
    const { data } = await getAllAccessApi({
        team_id: store.teamInfo.team_id,
    });
    const codingItem = data.coding[index];
    item.status = 'save';
    item.config_name = codingItem.config_name;
    item.server_addr = codingItem.server_addr;
    item.server_token = codingItem.server_token;
};

// 保存配置
const saveConfigHandle = async (item: any) => {
    if (!item.server_token || !item.config_name) {
        showMessage('请填写完整配置', 'warning');
        return;
    }
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
