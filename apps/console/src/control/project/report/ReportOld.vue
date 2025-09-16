<template>
    <div class="head_wrap">
        <div class="head">
            <div class="title">
                <img style="margin-right: 10px" :src="$systemConfig.mainLogo" alt="">
                <span>
                    帮助开发者快速提升代码安全
                </span>
            </div>
            <div class="verify">
                <img style="width: 430px;" src="~ast/img/report_img.png" alt="">
            </div>
        </div>
    </div>

    <div class="report_content" v-loading.fullscreen="store.loading">
        <DetailContent />
    </div>

    <!-- <div class="bottom" v-if="$route.query.allow === '2'">
            <div class="wrap">
                <div class="left">
                    <div class="text">他们都在使用并维护这个项目代码安全</div>
                    <div>
                        <span>
                            <img :src="store.reportShowInfo.created_user_avatar" alt="">
                            <img src="~ast/img/default_avatar.png" alt="">
                        </span>
                    </div>
                </div>
                <div>
                    <el-button @click="joinTeamHandle">加入团队</el-button>
                </div>
            </div>
        </div> -->

    <!-- 分享框 -->
    <!-- <ReportShareModal v-model="isShowShare" /> -->

    <!-- <el-dialog width="500px" v-model="isShowLoginModal" :show-close="false" :close-on-press-escape="false"
        :close-on-click-modal="false">
        <template #header>
            <img class="logo" src="~ast/img/logo.svg" alt="">
        </template>
<div class="login_modal">
    <div class="text">
        你的小伙伴给你分享了一份的检测报告
    </div>
    <el-button @click="$router.push('/login')">
        登录并查看
    </el-button>
</div>
</el-dialog> -->

    <!-- <img src="~ast/img/hide_modal.png" v-if="isShowLoginModal" class="hide_modal_img"> -->
</template>

<script setup lang='ts'>
// import { ref } from 'vue';
// import { jumpLogin } from 'util/auth';
// import { joinTeamApi } from 'api/team';
import store from 'util/store';
// import { getUserInfo, showMessage } from '@/utils/tools';
import DetailContent from '../detail/DetailContent.vue';
// import ReportShareModal from './ReportShareModal.vue';

// const { href } = window.location;
// const isShowShare = ref<boolean>(false);
// const isShowLoginModal = ref<boolean>(false); // 是否需要登陆

// const time = setTimeout(() => {
//     isShowLoginModal.value = !getUserInfo();
//     clearTimeout(time);
// }, 15000);

// 加入团队
// const joinTeamHandle = async () => {
//     if (!getUserInfo()) {
//         showMessage('您还未登录', 'warning');
//         return;
//     }
//     try {
//         await joinTeamApi({
//             team_id: store.reportShowInfo.team_id,
//         });
//         showMessage('加入成功', 'success');
//     } catch (error) {
//         console.log(error);
//     }
// };
</script>

<style lang='less' scoped>
.head_wrap {
    background-color: #F8F8FC;
}

.hide_modal_img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.head {
    max-width: 1280px;
    margin: 0 auto;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: #5572F4;
    font-weight: 600;

    .title {
        display: flex;
        align-items: center;

        img {
            width: 32px;
            height: 32px;
        }
    }
}

.report_content {
    max-width: 1280px;
    margin: 0 auto;
    padding-bottom: 30px;
}

.login_modal {
    .logo {
        width: 131px;
        display: block;
        margin: 0 auto;
    }

    .text {
        font-size: 16px;
        font-weight: 600;
        max-width: 460px;
        margin: 0 auto;
        color: #3D3D3D;
        line-height: 35px;
        text-align: center;
        margin-bottom: 40px;

        img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 06px;
        }
    }

    .el-button {
        margin-left: 50%;
        transform: translateX(-50%);
    }

}

.bottom {
    height: 120px;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 99;
    background-color: #F8F8FC;

    img {
        width: 26px;
        border-radius: 50%;
        margin-right: 6px;
    }

    .wrap {
        max-width: 1280px;
        margin: 0 auto;
        padding: 20px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24px;
        color: #3D3D3D;

        .text {
            margin-bottom: 15px;
        }

        .el-button {
            // width: 108px;
            height: 40px;
            border-radius: 8px;
        }
    }
}
</style>
