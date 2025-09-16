<template>
    <div class="set_title">
        简单云（代码仓库）集成配置
        <el-button v-if="normalTeamAuth||isUserSpace" @click="$router.push('/detect-access?from=ezone_code')">新增集成</el-button>
    </div>

    <div class="config_item" v-for="(item, index) in  configList " :key="index">
        <div class="name">
            <div>
                <!-- {{ item.config_name }} -->
                <div class="g-fw-400 g-color-3">配置编号：{{ item.config_id }}</div>
            </div>
            <span class="to-detect" @click="$router.push(`/detect-main?from=ezone_code&config_id=${item.config_id}`)">去检测 <i
                class="murphy icon-jiantou-you"></i></span>
        </div>
        <div class="config_content">
            <div v-if="item.status === 'save'">

                <div class="form_item">
                    <div class="form_label">
                        简单云（代码仓库）地址
                    </div>
                    <div>
                        {{ item.server_addr }}
                    </div>
                </div>
                <div class="form_item">
                    <div class="form_label">
                        用户名
                    </div>
                    <div>
                        {{ item.server_username }}
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
                                <span class="text-err">*</span>
                                简单云（代码仓库）地址
                            </div>
                        </template>
                        <div style="width: 500px">
                            <el-input v-model="item.server_addr" clearable
                                      placeholder="请输入简单云服务地址，如：https://xxx.ezone.work" />
                        </div>
                    </el-form-item>

                    <el-form-item prop="address">
                        <template #label>
                            <div class="form_label">
                                <span class="text-err">*</span>
                                用户名
                            </div>
                        </template>
                        <div style="width: 500px">
                            <el-input v-model="item.server_username" clearable
                                      placeholder="请输入用户名" />
                        </div>
                    </el-form-item>

                    <el-form-item prop="token">
                        <template #label>
                            <div class="form_label">
                                <span class="text-err">*</span>
                                访问令牌
                                <span class="hover_btn1" style="padding: 4px 5px;font-size: 14px;font-weight: 400; color: #6C87FF;cursor:pointer;margin-left: 8px;"
                                      @click="(isShowTokenExplain = true)">如何设置简单云访问令牌</span>
                            </div>
                        </template>
                        <div style="width: 500px">
                            <div style="display: flex;">
                                <el-input v-model="item.server_token" clearable placeholder="请填写访问令牌" />
                                <!-- <el-button class="minor_btn" @click="verifyEzoneCodeHandle(item)"
                                           style="width: 80px ;margin-left: 10px;height: 32px">校验</el-button> -->
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
    updatedAccessApi, getAllAccessApi, deleteConfigApi,
} from 'api/detect';
import { getOrgAuthInfo } from '@/control/org/hooks';
import ezone1 from '@/assets/img/ezone1.png';
import ezone2 from '@/assets/img/ezone2.png';
import ezone3 from '@/assets/img/ezone3.png';
import ezone4 from '@/assets/img/ezone4.png';
import FormComp from '@/components/FormComp.vue';

const configList = ref<Array<any>>([]);
const isShowTokenExplain = ref<boolean>(false); // token说明
const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();

onBeforeMount(() => {
    configList.value = store.allAccessInfo.ezone_code || [];
    configList.value.map((item) => {
        item.status = 'save';
        return item;
    });
});

// 校验
// const verifyEzoneCodeHandle = async (item: any) => {
//     if (item.server_addr && item.server_token) {
//         // 请求检查简单云代码仓库地址
//         const res = await testCodingServerApi(item);
//         // eslint-disable-next-line no-unused-expressions
//         res.data.invalid === 1 ? showMessage('校验成功', 'success') : showMessage('校验失败', 'error');
//     }
// };

// 修改
const changeHandle = (item: any) => {
    item.status = 'edit';
    item.server_token = '';
    item.team_id = store.teamInfo.team_id;
    item.access_type = 'ezone_code';
};

// 取消
const cancleHandle = async (item: any, index: number) => {
    // 所有接入方式配置情况
    const { data } = await getAllAccessApi({
        team_id: store.teamInfo.team_id,
    });
    const ezoneCodeItem = data.ezone_code[index];
    item.status = 'save';
    item.config_name = ezoneCodeItem.config_name;
    item.server_addr = ezoneCodeItem.server_addr;
    item.server_token = ezoneCodeItem.server_token;
    item.server_username = ezoneCodeItem.server_username;
};

// 保存配置
const saveConfigHandle = async (item: any) => {
    if (!item.server_token || !item.config_name) {
        showMessage('请填写完整配置', 'warning');
        return;
    }
    try {
        item.access_type = 'ezone_code';
        await updatedAccessApi(item);
        showMessage('保存成功', 'success');
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
};

// 删除
const deleteConfig = async (item: any) => {
    const params = {
        access_type: 'ezone_code',
        config_id: item.config_id,
    };
    await deleteConfigApi(params);
    window.location.reload();

    // if (res.data.invalid === 1) {
    //     showMessage('删除成功', 'success');
    //     configList.value = configList.value.filter((config) => config.config_name !== item.config_name);
    // }
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
