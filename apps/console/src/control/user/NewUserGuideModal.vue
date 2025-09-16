<template>
    <el-dialog width="1100px" :show-close="!store.userInfo.is_guide" :close-on-press-escape="false" :close-on-click-modal="false">
        <div class="step" v-if="activeStep===1">
            <div class="content">
                <div>
                    <div class="title">
                        1/4 <span class="color_text">漏洞触发点</span>分析
                    </div>
                    <div class="desc">
                        <i class="murphy icon-duihao1"></i>
                        处理效率提升<span>95%</span>
                    </div>
                    <div class="desc">
                        <i class="murphy icon-duihao1"></i>
                        真实影响<span>清晰可见</span>
                    </div>
                </div>
                <div class="video" v-if="!$systemConfig.isClose">
                    <!-- <img class="video" src="https://private-images-1257309290.cos.ap-beijing.myqcloud.com/assets_FE/01.gif" alt=""> -->
                </div>
            </div>
            <div class="btns">
                <el-button @click="activeStep=2" class="main_btn">下一步 <i class="murphy icon-youjiantou11"></i></el-button>
            </div>
        </div>

        <div class="step" v-if="activeStep===2 ">
            <div class="content">
                <div>
                    <div class="title">
                        2/4 开发阶段<span class="color_text">一键修复</span>
                    </div>
                    <div class="desc">
                        <i class="murphy icon-duihao1"></i>
                        IDE插件一键检测修复
                    </div>
                    <div class="desc">
                        <i class="murphy icon-duihao1"></i>
                        <span>&nbsp;安全风险上线前避免</span>
                    </div>
                </div>
                <div class="video" v-if="!$systemConfig.isClose">
                    <!-- <img class="video" src="https://private-images-1257309290.cos.ap-beijing.myqcloud.com/assets_FE/02.gif" alt=""> -->
                </div>
            </div>
            <div class="btns">
                <el-button class="minor_btn" style="width: auto; height: 32px; background-color: #fff;border: 1px solid #6C87FF;color: #6C87FF;" @click="activeStep=1"><i style="transform: rotate(180deg) translateX(5px);" class="murphy icon-youjiantou11"></i> 返回上一步</el-button>
                <el-button @click="activeStep=3" class="main_btn">下一步 <i class="murphy icon-youjiantou11" style="transform: translateX(5px)"></i></el-button>
            </div>
        </div>

        <div class="step" v-if="activeStep===3 ">
            <div class="content">
                <div>
                    <div class="title">
                        3/4 组件升级<span class="color_text">兼容性分析</span>
                    </div>
                    <div class="desc">
                        <i class="murphy icon-duihao1"></i>
                        <span>&nbsp;3个维度</span>兼容性评估
                    </div>
                    <div class="desc">
                        <i class="murphy icon-duihao1"></i>
                        升级完再也不担心服务挂
                    </div>
                </div>
                <div class="video" v-if="!$systemConfig.isClose">
                    <!-- <img class="video" src="https://private-images-1257309290.cos.ap-beijing.myqcloud.com/assets_FE/03.gif" alt=""> -->
                </div>
            </div>
            <div class="btns">
                <el-button class="minor_btn" style="width: auto; height: 32px;background-color: #fff;border: 1px solid #6C87FF;color: #6C87FF;" @click="activeStep=2"><i style="transform: rotate(180deg) translateX(5px);" class="murphy icon-youjiantou11"></i> 返回上一步</el-button>
                <el-button @click="activeStep=4" class="main_btn">下一步 <i class="murphy icon-youjiantou11" style="transform: translateX(5px)"></i></el-button>
            </div>
        </div>

        <div class="step" v-if="activeStep===4 ">
            <div class="content">
                <div>
                    <div class="title">
                        4/4 <span class="color_text">独家漏洞&投毒情报</span>
                    </div>
                    <div class="desc">
                        <i class="murphy icon-duihao1"></i>
                        <span>&nbsp;超25个专业漏洞字段</span>
                    </div>
                    <div class="desc">
                        <i class="murphy icon-duihao1"></i>
                        独家漏洞及投毒情报
                    </div>
                </div>
                <div class="video" v-if="!$systemConfig.isClose">
                    <!-- <img class="video" src="https://private-images-1257309290.cos.ap-beijing.myqcloud.com/assets_FE/04.gif" alt=""> -->
                </div>
            </div>
            <div class="btns">
                <el-button class="minor_btn" style="width: auto; height: 32px;background-color: #fff;border: 1px solid #6C87FF;color: #6C87FF;" @click="activeStep=3"><i style="transform: rotate(180deg) translateX(5px);" class="murphy icon-youjiantou11"></i> 返回上一步</el-button>
                <el-button class="main_btn" @click="finishGuide">立即进入</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { localStorageUtil, getUserInfo, encrypt } from 'util/tools';
import store from 'util/store';
import { finishGuideApi } from 'api/team';

const activeStep = ref<number>(1);

const finishGuide = async () => {
    await finishGuideApi({ guide: true });
    store.isShowNewUserGuide = false;
    localStorageUtil('set', 'g-u', encrypt({
        ...getUserInfo(),
        is_guide: false,
    }));
    store.userInfo.is_guide = false;
    activeStep.value = 1;
};
</script>

<style lang='less' scoped>
.step {
    height: 500px;
}

.content {
    .between();
    padding-top: 16px;
    .title {
        font-weight: 600;
        color: @text-color;
        font-size: 22px;
        margin-bottom: 16px;
    }

    .color_text {
        background: linear-gradient(95.3deg, #9940FE 21.48%, #6C87FF 58.63%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .desc {
        font-size: 18px;
        font-weight: 500;
        color: #858585;
        margin-bottom: 4px;
        i {
            font-size: 14px;
            color: #38C728;
            margin-right: 4px;
        }
        span {
            font-weight: 600;
            color: #525252;
        }
    }

    .video {
        width: 760px;
        height: 428px;
        background-color: beige;
        border-radius: 6px;
        border: 1px solid #000;
    }
}

.btns {
    margin-top: 24px;
    float: right;
}</style>
