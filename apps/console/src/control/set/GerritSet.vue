<template>
    <div class="set_title">
        Gerrit集成配置
        <el-button v-if="normalTeamAuth||isUserSpace" @click="$router.push('/detect-access?from=gerrit')">新增集成</el-button>
    </div>

    <div class="config_item" v-for="(item, index) in configList" :key="index">
        <div class="name">
            <div>
                {{ item.config_name }}
                <div class="g-mt-8 g-fw-400 g-color-3">配置编号：{{ item.config_id }}</div>
            </div>
            <span class="to-detect" @click="$router.push(`/detect-main?from=gerrit&config_id=${item.config_id}`)">去检测 <i class="murphy icon-jiantou-you"></i></span>
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
                        用户名
                    </div>
                    <div>
                        {{ item.server_username }}
                    </div>
                </div>
                <div class="form_item">
                    <div class="form_label">
                        密码
                    </div>
                    <div>
                        {{ item.server_password }}
                    </div>
                </div>
            </div>

            <!-- 编辑 -->
            <div v-if="item.status === 'edit'">
                <FormComp label-position="top" label-width="135px">
                    <el-form-item>
                        <template #label>
                            <div class="form_label">
                                服务地址
                            </div>
                        </template>
                        <div style="width: 500px">
                            <el-input v-model="item.server_addr" clearable placeholder="请输入服务地址" />
                        </div>
                    </el-form-item>

                    <el-form-item prop="address">
                        <template #label>
                            <div class="form_label">
                                用户名
                            </div>
                        </template>
                        <div style="width: 500px">
                            <el-input v-model="item.server_username" clearable placeholder="请输入仓库Username" />
                        </div>
                    </el-form-item>

                    <el-form-item prop="token">
                        <template #label>
                            <div class="form_label">
                                密码
                            </div>
                        </template>
                        <div style="width: 500px">
                            <el-input v-model="item.server_password" clearable placeholder="请输入仓库Password" />
                        </div>
                    </el-form-item>

                    <el-form-item prop="token">
                        <template #label>
                            <div class="form_label">
                                配置名称
                            </div>
                        </template>
                        <div style="width: 500px">
                            <el-input v-model="item.config_name" clearable placeholder="请输入配置名称" />
                        </div>
                    </el-form-item>
                </FormComp>
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
            <el-button class="minor_btn" @click="saveConfigHandle(item)" style="height: 32px;width: 80px;">保存</el-button>
        </div>
    </div>

    <NoData v-if="!configList || !configList.length" />
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import { getAllAccessApi, updatedAccessApi, deleteConfigApi } from 'api/detect';
import store from 'util/store';
import NoData from 'comp/NoData.vue';
import { showMessage } from 'util/tools';
import { getOrgAuthInfo } from '@/control/org/hooks';

import FormComp from '@/components/FormComp.vue';

const {
    normalTeamAuth, isUserSpace,
} = getOrgAuthInfo();
const configList = ref<Array<any>>([]);
onBeforeMount(() => {
    configList.value = store.allAccessInfo.gerrit || [];
    configList.value.map((item) => {
        item.status = 'save';
        return item;
    });
});

// 修改
const changeHandle = (item: any) => {
    item.status = 'edit';
    item.team_id = store.teamInfo.team_id;
    item.access_type = 'gerrit';
    item.server_password = '';
};

// 取消
const cancleHandle = async (item: any, index: number) => {
    // 所有接入方式配置情况
    const res = await getAllAccessApi({
        team_id: store.teamInfo.team_id,
    });
    item.status = 'save';
    Object.assign(item, res.data.gerrit[index]);
};

// 保存配置
const saveConfigHandle = async (item: any) => {
    // if (Object.values(item).some((ele) => ele !== '')) {
    //     showMessage('请填写完整配置', 'warning');
    //     return;
    // }
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
        }
    }

}

.btn {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}
</style>
