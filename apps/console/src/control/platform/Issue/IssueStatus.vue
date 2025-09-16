<template>
    <div class="state">
        <div class="name">
            安全问题状态
            <span :class="{ 'button-icon-grey': !isEdit }"
                  v-if="!store.isAllTeam || (store.isAllTeam && (userRole === 'SA' || userRole === 'SM' || ownerOrgIDList.includes(store.teamInfo.org_id)))">
                <!-- <span style="padding: 2px;" :class="{ 'hover_btn1': !isEdit }"
                  v-if="!store.isAllTeam || (store.isAllTeam && (userRole === 'SA' || userRole === 'SM' || ownerOrgIDList.includes(store.teamInfo.org_id)))"> -->
                <i v-if="!$route.path.includes('report')" @click="isEdit = true;ignoreValue=''" class="murphy icon-safe_edit"></i>
                <!-- :class="{ 'disabled_icon': isEdit }"></i> -->
            </span>
        </div>
        <div class="state_item">
            <div style="margin-bottom: 6px;">状态</div>
            <div class="status_text" v-if="!isEdit">{{ statusOptions.filter((item: any) => item.value ===
                statusValue)[0]?.label }}
            </div>
            <div v-else>
                <el-select v-model="statusValue" style="width: 100%;">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                               :value="item.value" />
                </el-select>
                <div class="tip" v-if="statusValue === 4">选择关闭后，若再次检测出该安全问题，将不会展示在待修复列表中，支持手动修改状态</div>
            </div>
        </div>

        <div class="state_item" v-if="statusValue === 3 || statusValue === 4">
            <div style="margin-bottom: 6px;"><span style="color: #F34D3D;" v-if="isEdit">*</span> 原因</div>
            <div class="status_text" v-if="!isEdit"> {{ otherReason ? `${ignoreValue}：${otherReason}` : ignoreValue }}</div>
            <div v-else style="margin-bottom: 16px;">
                <el-select @change="otherReason = ''" v-model="ignoreValue" style="width: 100%;">
                    <el-option v-for="item in ignoreOptions" :key="item.value" :label="item.label"
                               :disabled="item.value === '接受风险' && userRole !== 'SA'" :value="item.value" />
                </el-select>
            </div>

            <div
                v-if="(ignoreValue === '接受风险' || ignoreValue === '其他' || ignoreValue === '误报-使用了该组件，但不受漏洞影响') && isEdit">
                <div style="margin-bottom: 6px;"><span style="color: #F34D3D;">*</span>
                    说明
                </div>
                <div>
                    <el-input rows="4" v-model="otherReason" resize="none" type="textarea"
                              :placeholder="getPlaceholder(ignoreValue)"></el-input>
                </div>
            </div>
        </div>
        <el-button v-if="!isEdit && statusValue !== 1 && !store.isAllTeam && !$route.path.includes('report')"
                   class="open" @click="openQuestionHandle">重新打开安全问题</el-button>
        <el-button v-if="isEdit" @click="confirmHandle">确定</el-button>
    </div>
    <!--
    <el-dialog width="420px" :close-on-click-modal="false" v-model="confirmModal">
        <template #header>
            <div class="modal_title">
                确认修改安全问题状态
            </div>
        </template>
<div class="btns">
    <el-button class="cancle_btn" @click="confirmModal=false">取消</el-button>
    <el-button @click="confirmHandle">确定</el-button>
</div>
</el-dialog> -->
</template>

<script setup lang='ts'>
import { ref, getCurrentInstance } from 'vue';
import store from 'util/store';
import { showMessage } from 'util/tools';
import { changeSafeQuestionStatusApi } from 'api/project';
import { getOrgAuthInfo } from '@/control/org/hooks';

const globalInfo = getCurrentInstance()?.appContext?.config?.globalProperties;

const {
    ownerOrgIDList, userRole,
} = getOrgAuthInfo();

const props = defineProps(['info', 'securityId']);
const isEdit = ref<boolean>(false); // 是否编辑
const statusValue = ref<number>(props.info.fix_status); // 状态
const statusOptions = globalInfo?.$systemConfig.isGf
    ? [
        {
            label: '待修复',
            value: 1,
        },
        {
            label: '已修复',
            value: 2,
        },
        {
            label: '关闭',
            value: 4,
        },
    ]
    : [
        {
            label: '待修复',
            value: 1,
        },
        {
            label: '已修复',
            value: 2,
        },
        {
            label: '7天忽略',
            value: 3,
        },
        {
            label: '关闭',
            value: 4,
        },
    ];

const ignoreValue = ref<string>(props.info.ignored_reason);
const ignoreOptions = globalInfo?.$systemConfig.isGf ? [
    {
        value: '接受风险',
        label: '接受风险',
    },
    {
        value: '误报-没有用到该组件',
        label: '误报-没有用到该组件',
    },
    {
        value: '误报-使用了该组件，但不受漏洞影响',
        label: '误报-使用了该组件，但不受漏洞影响',
    },
] : [
    {
        value: '接受风险',
        label: '接受风险',
    },
    {
        value: '误报-没有用到该组件',
        label: '误报-没有用到该组件',
    },
    {
        value: '误报-使用了该组件，但不受漏洞影响',
        label: '误报-使用了该组件，但不受漏洞影响',
    },
    // {
    //     value: '没时间修',
    //     label: '没时间修',
    // },
    // {
    //     value: '不受影响',
    //     label: '不受影响',
    // },
    // {
    //     value: '不想修',
    //     label: '不想修',
    // },
    {
        value: '其他',
        label: '其他',
    },
];
const otherReason = ref<string>(''); // 其他原因

const getPlaceholder = (reason: string) => {
    if (reason === '接受风险') return '请输入接受风险原因';
    if (reason === '其他') return '请输入原因，如：项目受影响，有修复方案，但着急上线暂时没时间修复';
    if (reason === '误报-使用了该组件，但不受漏洞影响') return '请具体说明不受影响的原因，如：某漏洞未用到受影响的方法，实际不受影响';
};

const confirmHandle = async () => {
    if (statusValue.value === 3 || statusValue.value === 4) {
        if (!ignoreValue.value) {
            showMessage('请填写原因', 'warning');
            return;
        }

        if ((ignoreValue.value === '其他' || ignoreValue.value === '接受风险' || ignoreValue.value === '误报-使用了该组件，但不受漏洞影响') && !otherReason.value) {
            showMessage('请填写说明', 'warning');
            return;
        }
    }
    try {
        await changeSafeQuestionStatusApi({
            team_id: store.teamInfo.team_id,
            security_id: props.securityId,
            // ignored_reason: ignoreValue.value === '其他' ? otherReason.value : ignoreValue.value,
            ignored_reason: otherReason.value ? `${ignoreValue.value}：${otherReason.value}` : ignoreValue.value,
            status: statusValue.value,
        });
        isEdit.value = false;
        showMessage('修改成功', 'success');
    } catch (error) {
        console.log(error);
    }
};

// 重新打开
const openQuestionHandle = async () => {
    try {
        await changeSafeQuestionStatusApi({
            team_id: store.teamInfo.team_id,
            security_id: props.securityId,
            status: 1,
        });
        statusValue.value = 1;
        otherReason.value = '';
        ignoreValue.value = '';
        showMessage('已重新打开此安全问题', 'success');
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less' scoped>
.state {
    background: #FFFFFF;
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;

    .name {
        font-size: 16px;
        color: #3c3c3c;
        .between();
        margin-bottom: 16px;
        font-weight: 500;

        i {
            cursor: pointer;
            color: #6C87FF;
            font-size: 20px;
        }
    }

    .state_item {
        font-size: 12px;
        color: #8F959E;
        margin-bottom: 16px;

        .status_text {
            font-size: 14px;
            color: #3c3c3c;
        }

        .tip {
            color: #F34D3D;
            margin-top: 6px;
            font-size: 14px;
        }
    }

    .el-button {
        width: 100%;
    }

    .open {
        background: #FFFFFF;
        border: 1px solid #6C87FF;
        border-radius: 6px;
        color: #6C87FF;
    }
}

.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
