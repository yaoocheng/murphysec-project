<template>
    <div class="background">
        <div class="report_login_content">
            <div class="left" v-if="!$systemConfig.isGf">
                <div class="tag">
                    3分钟提升代码安全质量80%
                </div>
                <div class="name1">
                    识别真漏洞，分钟级修复
                </div>
                <div class="name2">
                    以供应链视角重新定义企业软件安全
                </div>

                <img class="w-[506px] mb-[45px] ml-9" src="~ast/img/login_timeline.png" alt="">

                <div class="lang">
                    <div class="desc">
                        支持多种方式的一键接入，主流语言全覆盖
                    </div>
                    <img style="width: 95%; margin-top: 16px;" src="~ast/img/report_login_lang.png" alt="">
                </div>
                <!-- <div class="company">
                    <div class="desc">
                        超过700+企业的10000+开发者正在使用
                    </div>
                    <img style="width: 96%;height: 26px; margin-top: 20px;" src="~ast/img/report_login_company.png" alt="">
                </div> -->
            </div>

            <div class="login_form">
                <LoginMain v-if="store.loginType === 1" />
                <ResetPwd v-if="store.loginType === 2" />
                <RegisterIndex v-if="store.loginType === 3" />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import LoginMain from './LoginMain.vue';
import ResetPwd from './ResetPwd.vue';
import RegisterIndex from './RegisterIndex.vue';
</script>

<style lang='less' scoped>
.background {
    height: 100%;
    background-image: url('ast/img/mainBack.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.report_login_content {
    display: flex;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .left {
        width: 700px;
        box-sizing: border-box;
        background-image: url('ast/img/report_login_back.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .tag {
        width: 257px;
        height: 48px;
        background: linear-gradient(160deg, #B06BFF 0%, #6B86FF 100%);
        border-radius: 10px 0px 10px 0px;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        line-height: 48px;
        text-align: center;
        margin-bottom: 38px;
    }

    .name1 {
        margin-left: 36px;
        font-weight: 600;
        font-size: 46px;
        line-height: 150%;
        letter-spacing: 0px;
        background: linear-gradient(90deg, #886CFF 1.82%, #2C4DFF 97.73%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .name2 {
        margin-left: 36px;
        margin-bottom: 24px;
        color: #6C87FF;
        font-weight: 500;
        font-size: 28px;
        line-height: 150%;
        letter-spacing: 0px;
    }

    .flow {
        display: flex;
        align-items: center;
        margin-left: 35px;

        i {
            font-size: 24px;
            background: linear-gradient(91deg, #4F6FFF 0%, #A658FF 35%, #4F6FFF 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-right: 20px;
        }
    }

    .flow .item {
        width: 130px;
        height: 60px;
        border-radius: 11px;
        border: 1px solid;
        background: linear-gradient(160deg, #e6c9ff34 0%, #b3c1ff98 100%);
        border: none;
        font-size: 22px;
        line-height: 60px;
        text-align: center;
        margin-right: 20px;

        span {
            background: linear-gradient(91deg, #4F6FFF 0%, #A658FF 35%, #4F6FFF 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .lang,
    .company {
        // margin-top: 220px;
        margin-left: 36px;
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 500;
        color: #3e5a93ad;
    }
}
</style>

<style lang="less">
.login_form {
    width: 500px;
    background-color: #fff;
    border-radius: 0 10px 10px 0;
    padding: 0 90px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;

    .tab {
        display: inline-block;
        margin-right: 40px;
        font-weight: 600;
        font-size: 24px;
        color: #525252;
        margin-bottom: 24px;
        cursor: pointer;
    }

    .input_comp {
        margin-bottom: 16px;

        .name {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: @text-color;
            margin-bottom: 8px;

            span {
                color: #6C87FF;
                font-size: 12px;
                cursor: pointer;
            }
        }
    }

    .el-button {
        width: 100%;
        height: 34px;
        margin-top: 40px;
        font-size: 16px;
    }
}
</style>
