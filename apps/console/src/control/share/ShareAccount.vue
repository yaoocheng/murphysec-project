<template>
    <div class="invite_remote_input">
        <div class="g-flex g-align-center">
            <el-input style="height: 40px; width: 385px;"
                :class="{ 'error_color': verifyErrorText && !isExpandOptions }" v-model="formData.accountValue"
                @input="searchAccountHandle" placeholder="请输入邮箱">
            </el-input>

            <div @click="store.isShowTeamMemberModal = true" class="g-bdr-6 g-ml-4 g-cursor-pointer"
                style="width: 40px;height: 40px;line-height:40px;text-align: center;border: 1px solid #EBEBEB;">
                <i class="murphy icon-jia g-f-24 g-color-3"></i>
            </div>
        </div>

        <span style="color: #f56c6c; font-size: 12px;" v-if="(verifyErrorText && !isExpandOptions)">
            {{ verifyErrorText }}</span>

        <!-- 分享报告权限选择 -->
        <!-- <div class="select_auth" v-if="!store.securityId&&!$route.path.includes('detect-config')">
            <SelectCheckReportAuth @selectAuthHandle="selectAuthHandle" />
        </div> -->

        <!-- 输入下拉选择 -->
        <div class="select_options" :class="{ 'expand': isExpandOptions || !verifyErrorText }">
            <div class="select_item" @click="selectDataHandle(item)" v-for="(item, index) in remoteData" :key="index">
                <img :src="item.user_avatar || avatar" alt="">
                <div class="name">
                    {{ item.phone || item.email || item.account }}
                </div>
            </div>
        </div>

        <!-- 已选择展示 -->
        <div class="select_data g-mt-8" v-if="selectData.length">
            <div class="select_item item_show">
                <div class="g-f-14 g-fw-400 g-color-1">已选择分享 {{ selectData.length }} 人</div>
            </div>
            <div class="select_item" v-for="(item, index) in selectData" :key="index"
                style="justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                    <img :src="item.user_avatar || avatar" alt="">
                    <div class="name">
                        {{ item.phone || item.email || item.username || item.account }}
                    </div>
                </div>
                <i class="murphy icon-cuo" style="cursor: pointer;" @click="selectData.splice(index, 1)"></i>
            </div>
        </div>

        <div v-if="!$route.path.includes('detect-config')">
            <div class="g-mb-8 g-mt-16 g-flex g-justify-between g-align-center">
                <div class="g-f-14 g-color-1 g-fw-400">获得链接的人</div>
                <SelectCheckReportAuth @selectAuthHandle="selectAuthHandle" />
            </div>

            <div class="g-mb-16 g-flex g-justify-between g-align-center">
                <div class="g-f-14 g-color-1 g-fw-400">
                    获得链接的人
                    <TipsComp content="链接到期后无法通过此链接访问" />
                </div>
                <el-radio-group v-model="radio">
                    <el-radio label="1" size="large">14天有效</el-radio>
                    <el-radio label="2" size="large">永久有效</el-radio>
                </el-radio-group>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import bus, { debounce, showMessage } from 'util/tools';
import { searchAccountApi, shareDetailInfoApi, shareSafeQuestionApi } from 'api/team';
import store, { detectInfo } from 'util/store';
import { useRoute } from 'vue-router';
import { validateAccount } from 'util/verify';
import avatar from 'ast/img/default_avatar.png';
import TipsComp from '@/components/TipsComp.vue';
import SelectCheckReportAuth from './SelectCheckReportAuth.vue';

const route = useRoute();
const isExpandOptions = ref<boolean | string>(false); // 是否展开选择内容
const selectData = ref<Array<any>>([]); // 选中的数据
const remoteData = ref<Array<any>>([]); // 远程搜索的数据
const allowAction = ref<number>(1); // 查看权限
const verifyErrorText = ref<string>(''); // 输入框错误提示
const radio = ref<string>('1');

const formData = reactive<{
    accountValue: string
}>({
    accountValue: '', // 账号邀请
});

// 权限选择
const selectAuthHandle = (value: number) => {
    allowAction.value = value;

    // 更新查看权限
    if (route.path.includes('config') && detectInfo.other_contact.length) {
        detectInfo.other_contact.map((item: any) => { item.allow_action = value; return item; });
    }
};

// 搜索
const searchAccountHandle = debounce(async () => {
    // 校验文案
    verifyErrorText.value = validateAccount('', formData.accountValue, (error: string) => error);
    if (formData.accountValue.length < 3 || verifyErrorText.value) return;
    const res = await searchAccountApi({ keyword: formData.accountValue, team_id: store.teamInfo.team_id });
    remoteData.value = res.data?.length ? res.data : [{ user_avatar: avatar, account: formData.accountValue }];
    isExpandOptions.value = res.data?.length; // 能搜索到就展示下拉选择框
}, 100);

// 选择
const selectDataHandle = (item: any) => {
    selectData.value.unshift(item);
    isExpandOptions.value = false;
    formData.accountValue = ' ';
    verifyErrorText.value = validateAccount('', formData.accountValue, (error: string) => error);

    // 检测配置通知其他人
    if (route.path.includes('config')) {
        detectInfo.other_contact.push({
            contact: item.account,
            user_id: '0',
            team_id: store.teamInfo.team_id,
            allow_action: allowAction.value,
            share_type: item.account.includes('@') ? 2 : 1,
        });
    }
};

// 选择团队成员传值
bus.on('selectGroupMember', (data: any) => {
    data.forEach((item: any) => {
        if (!selectData.value.some((n) => item.user_id === n.user_id)) {
            selectData.value.push(item);

            // 检测配置通知其他人
            if (route.path.includes('config')) {
                detectInfo.other_contact.push({
                    contact: '',
                    user_id: item.user_id,
                    team_id: store.teamInfo.team_id,
                    allow_action: allowAction.value,
                    share_type: 3,
                });
            }
        }
    });
});

// 分享发送
const successHandle = () => {
    showMessage('分享成功', 'success');
    debounce(() => {
        store.isShowShareReportModal = false;
        store.securityId = '';
    }, 500)();
};

// 点击分享
bus.on('shareHandle', async () => {
    if (!selectData.value.length) {
        showMessage('请先选择分享人', 'warning');
        return;
    }
    const reqData = {
        user_ids: selectData.value.filter((item) => item.user_id).map((ele) => ({
            allow_action: allowAction.value,
            user_id: ele.user_id,
        })),
        contacts: selectData.value.filter((item) => item.account).map((ele) => ({
            allow_action: allowAction.value,
            contact: ele.account,
        })),
    };
    try {
        if (store.securityId) {
            // 安全问题分享
            await shareSafeQuestionApi({
                security_id: store.securityId,
                ...reqData,
            });
        } else {
            // 检测详情分享
            await shareDetailInfoApi({
                subtask_id: route.params.sid,
                ...reqData,
            });
        }
        successHandle();
    } catch (error) {
        console.log(error);
    }
});
</script>

<style lang="less" scoped>
.invite_remote_input {
    width: 100%;
    position: relative;

    .select_auth {
        position: absolute;
        right: 56px;
        top: -1px;
    }

    .select_options {
        position: absolute;
        z-index: 9999;
        left: 2px;
        top: 40px;
        width: 99%;
        height: 0;
        max-height: 300px;
        background: #FFFFFF;
        box-shadow: 0px 0px 6px 0px rgba(179, 179, 179, 0.5);
        border-radius: 8px;
        margin-top: 10px;
        transition: all .2s;
        opacity: 0;
        overflow: auto;
    }

    .select_options.expand {
        height: auto;
        opacity: 1;
    }

    .select_data {
        max-height: 200px;
        border-radius: 8px;
        border: 1px solid #ECECEC;
        box-shadow: none;
        overflow: auto;
        margin-bottom: 16px;
    }

    .select_item {
        &:hover {
            background-color: #F0F5FC;
        }

        cursor: pointer;
        color: #2F2E3F;
        font-size: 12px;
        display: flex;
        align-items: center;
        transition: all .2s;
        height: 48px;
        padding: 0 12px;

        .is_invite_num {
            color: #3D3D3D;
            font-weight: 600;
            font-size: 14px;
        }

        img {
            width: 32px;
            height: 32px;
            border-radius: 19px;
            margin-right: 10px;
        }

        span {
            display: inline-block;
            background-color: #6C87FF;
            color: #4668FF;
            width: 56px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            background: rgba(108, 135, 255, 0.2);
            border-radius: 2px;
        }
    }

    .item_show:nth-of-type(1):hover {
        background-color: #fff;
        cursor: default;
    }
}
</style>

<style lang="less">
.error_color .el-input__wrapper {
    box-shadow: 0 0 0 1px #f56c6c inset;
}
</style>
