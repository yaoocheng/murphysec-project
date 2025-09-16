<template>
    <div id="user_account">
        <div class="user_head common_head">
            <span>个人账户设置</span>
        </div>

        <div class="account">
            <div class="avatar flex items-center gap-2">
                <!-- <img v-if="store.userInfo?.avatar_url" :src="store.userInfo?.avatar_url" alt="">
                <img v-else src="~ast/img/default_avatar.png" alt=""> -->
                <AvatarComp style="font-size: 36px;" :size="64" :name="store.userInfo?.nickname" />
                <span style="font-weight: 600;font-size: 18px;">{{ store.userInfo?.nickname }}</span>
            </div>
            <div class="info">
                <div class="title">
                    账号信息
                </div>
                <!-- <div class="info_item">
                    <div class="info_name"><img src="~ast/img/user_phone.png" alt=""> 手机</div>
                    <div class="contact">{{ store.userInfo.phone ? store.userInfo.phone : '未绑定' }}</div>
                    <div class="bind" v-if="!store.userInfo.phone" @click="bindHandle(1)">绑定</div>
                    <div class="unbind" @click="unbindHandle(unbindPhone)" v-else>解绑</div>
                </div> -->
                <div class="info_item">
                    <div class="info_name"><img src="~ast/img/user_email.png" alt="">邮箱</div>
                    <div class="contact">{{ store.userInfo?.email ? store.userInfo?.email : '未绑定' }}</div>
                    <div class="bind" v-if="!store.userInfo?.email" @click="bindHandle(2)">绑定</div>
                    <!-- <div class="unbind" @click="unbindHandle(unbindEmail)" v-if="store.userInfo?.email">解绑</div> -->
                </div>
                <div class="info_item" v-if="!localStorageUtil('get', 'logout')">
                    <div class="info_name"><img src="~ast/img/user_pwd.png" alt="">密码</div>
                    <div class="contact">{{ store.userInfo?.password ? store.userInfo?.password : '' }}</div>
                    <div class="bind" v-if="!store.userInfo?.password" @click="isShowResetPasswordPopup = true">设置密码</div>
                    <div class="unbind" v-else @click="isShowResetPasswordPopup = true">重置密码</div>
                </div>
                <!-- <div class="info_item">
                    <div class="info_name"><img src="~ast/img/user_github.png" alt=""> Github</div>
                    <div class="contact">{{ store.userInfo.is_bind_github ? '已绑定' : '未绑定' }}</div>
                    <div class="bind" v-if="!store.userInfo.is_bind_github" @click="githubVerify('public_repo')">绑定</div>
                    <div class="unbind" @click="unbindHandle(unbindGithub)" v-else>解绑</div>
                </div>
                <div class="info_item">
                    <div class="info_name"><img src="~ast/logos/gitee.png" alt=""> Gitee</div>
                    <div class="contact">{{ store.userInfo.is_bind_gitee ? '已绑定' : '未绑定' }}</div>
                    <div class="bind" v-if="!store.userInfo.is_bind_gitee" @click="giteeVerify()">绑定</div>
                    <div class="unbind" @click="unbindHandle(unbindGitee)" v-else>解绑</div>
                </div>
                <div class="info_item">
                    <div class="info_name"><img src="~ast/img/user_wechat.png" alt=""> WeChat</div>
                    <div class="contact">{{ store.userInfo.is_bind_wechat ? '已绑定' : '未绑定' }}</div>
                    <div class="bind" v-if="!store.userInfo.is_bind_wechat" @click="wechatVerify">绑定</div>
                    <div class="unbind" @click="unbindHandle(unbindWechat)" v-else>解绑</div>
                </div> -->
            </div>
            <!-- <ContentLoaderList v-else /> -->
        </div>

        <BindPopup :bindData="bindData" v-model="isShowBindPopup" />
        <ChangePasswordModal v-model="isShowResetPasswordPopup" />
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import {
    bindGithubHandle, bindWechat, bindGiteeHandle,
} from 'util/auth';
import { updatedAccessApi } from 'api/detect';
import store from '@/utils/store';
import BindPopup from './BindModal.vue';
import ChangePasswordModal from '../component/ChangePasswordModal.vue';
import { localStorageUtil } from '@/utils/tools';
import AvatarComp from '@/components/AvatarComp.vue';

const route = useRoute();
const isShowBindPopup = ref<boolean>(false); // 绑定弹框显示
const isShowResetPasswordPopup = ref<boolean>(false); // 显示密码框

// 绑定手机 邮箱
const bindData = ref<any>({
    title: '',
    placeholder: '',
});
const bindHandle = (flag: number) => {
    if (flag === 1) {
        bindData.value = {
            title: '绑定手机号',
            placeholder: '请输入手机号',
        };
    } else {
        bindData.value = {
            title: '绑定邮箱',
            placeholder: '请输入邮箱',
        };
    }
    isShowBindPopup.value = true;
};

// // 解绑
// const unbindHandle = async (callback: any) => {
//     const res = await callback();
//     if (res.data.code === 200) {
//         await updateUserInfoHandle();
//         showMessage('解绑成功', 'success');
//     }
// };

// GitHub wechat绑定
onBeforeMount(async () => {
    if (route.query.code && route.query.from === 'github') {
        await bindGithubHandle(route.query.code as string, 'public_repo');
        await updatedAccessApi({
            team_id: store.teamInfo.team_id,
            access_type: 'github',
        });
    } else if (route.query.code && route.query.from === 'wechat') {
        await bindWechat(route.query.code as string);
    } else if (route.query.code && route.query.from === 'gitee') {
        await bindGiteeHandle(route.query.code as string);
        await updatedAccessApi({
            team_id: store.teamInfo.team_id,
            access_type: 'gitee',
        });
    }
});
</script>

<style lang='less' scoped>
.account {
    padding: 24px;
    color: #3D3D3D;
    width: 32%;
    img {
        width: 70px;
        vertical-align: middle;
        margin-right: 30px;
    }

    .avatar {
        margin-bottom: 40px;
        img {
            border-radius: 50%;
        }
    }

    .title {
        font-weight: 600;
        margin-bottom: 30px;
    }

    .info_item {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 30px;

        .info_name {
            width: 100px;
            font-weight: 600;
            img {
                width: 16px;
                margin-right: 5px;
                vertical-align: -3px;
            }
        }

        .contact {
            width: 200px;
        }

        .bind,
        .unbind {
            &:hover {
                color: #8ea3ff;
            }

            color: #6C87FF;
            transition: all .2s;
            cursor: pointer;
        }
    }
}
</style>
