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

</template>

<script setup lang='ts'>
import store from 'util/store';
import DetailContent from '../detail/DetailContent.vue';
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
