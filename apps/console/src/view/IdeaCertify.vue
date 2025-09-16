<template>
    <div id="ideac">
        <div class="img_intro">
            <img src="~ast/img/logo_white.svg" alt="">
            <img src="~ast/img/ideaCertify.png" alt="">
            <div class="func">
                <div class="ele">
                    <i class="murphy icon-duihao1"></i> 一键检测
                </div>
                <div class="ele">
                    <i class="murphy icon-duihao1"></i> 实时检测
                </div>
                <div class="ele">
                    <i class="murphy icon-duihao1"></i> 检测报告
                </div>
                <div class="ele">
                    <i class="murphy icon-duihao1"></i> 快速修复
                </div>
            </div>
        </div>

        <div class="certify" v-show="changeText">
            <div class="name">
                MurphySec Code Scan 插件认证
            </div>
            <div class="desc">
                <p>点击下方按钮使用您的{{$systemConfig.longName}}账户进行认证</p>
                <p>完成后您可以返回IDE继续操作</p>
            </div>
            <el-button @click="clientCertifyHand">认证</el-button>
            <div class="tip">
                您能看到这个认证页面是因为在{{$systemConfig.longName}}IDE插件上点击了快速认证按钮
            </div>
        </div>

        <div class="already" v-show="!changeText">
            <i class="murphy icon-tijiaochenggong"></i>
            <div class="success">
                认证成功
            </div>
            <div>
                您可以关闭此页面，并返回到IDE继续操作
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { clientCertify } from 'api/user';
import { showMessage, getUserInfo } from 'util/tools';
// import { jumpLogin } from 'util/auth';
// import store from 'util/store';

export default {
    setup() {
        const route = useRoute();
        const changeText = ref(true);
        const userInfo = getUserInfo();

        const ideaCertifyHandle = async (uuid) => {
            const res = await clientCertify(uuid);
            if (res.data.code === 200) {
                showMessage(res.data.err_msg, 'success');
                window.localStorage.removeItem('ideaCertifyId');
                changeText.value = false;
            } else {
                showMessage(res.data.err_msg, 'error');
            }
        };

        if (window.localStorage.getItem('ideaCertifyId')) {
            ideaCertifyHandle(window.localStorage.getItem('ideaCertifyId'));
        }

        // 认证
        const clientCertifyHand = async () => {
            if (!userInfo) {
                showMessage('您还未登录', 'warning');
                window.localStorage.setItem(
                    'ideaCertifyId',
                    route.query.uuid,
                );
                // if (store.envInfo.type === 'saas') {
                //     jumpLogin(`${window.location.origin}${window.location.pathname}`);
                // } else {
                window.location.href = '/console/login';
                // }
                return;
            }
            ideaCertifyHandle(route.query.uuid);
        };

        return {
            changeText,
            clientCertifyHand,
        };
    },
};
</script>

<style lang="less" scoped>
#ideac {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;

    .img_intro {
        flex: 1;
        height: 100%;
        background: linear-gradient(to right, #193b62, #204a79e2);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 50px;
        padding-bottom: 80px;
        box-sizing: border-box;

        img {
            &:nth-of-type(2) {
                width: 90%;
            }

            align-self: flex-start;
        }

        .func {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 660px;
            height: 60px;
            padding: 0 40px;
            background-color: #1d4470;
            border: 2px solid #7da9dd;
            border-radius: 10px;
            font-size: 18px;
            color: #d5e9ff;
        }
    }

    .certify,
    .already {
        width: 575px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 130px 88px;
        box-sizing: border-box;
        color: #285180;

        .name {
            font-size: 24px;
            font-weight: bold;
        }

        .desc {
            font-size: 16px;
            font-weight: 600;
            line-height: 38px;
            text-align: center;
        }

        .el-button {
            width: 130px;
            height: 44px;
            font-size: 18px;
            border-radius: 27px;
        }

        .tip {
            font-size: 12px;
            color: #999;
        }
    }

    .already {
        justify-content: center;

        i {
            font-size: 32px;
            color: #3dbcad;
        }

        .success {
            margin: 72px 0;
            font-size: 22px;
            font-weight: 600;
        }
    }
}</style>
