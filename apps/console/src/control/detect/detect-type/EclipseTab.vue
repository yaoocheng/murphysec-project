<template>
    <div class="cli_config">
        <div class="title">
            如何通过 Eclipse 插件进行检测
        </div>

        <el-timeline>
            <el-timeline-item>
                <div class="step_name">
                    步骤一：快速安装
                </div>
                <div class="order">
                    <div>1、点击下载 Eclipse 插件</div>
                    <a href="/files/murphysec-eclipse-plugin.zip" target="_blank">
                        <div class="download">
                            <div class="info">
                                <i class="murphy icon-file-zip"
                                   style="font-size: 30px;color: #FCD165;margin-right: 12px;"></i>
                                <div>
                                    <div class="name">murphysec-eclipse-plugin.zip</div>
                                    <!-- <div>XZ - 15.2M</div> -->
                                </div>
                            </div>
                            <!-- <i class="murphy icon-xiazai1" style="cursor: pointer;"></i> -->
                            <div class="button-icon-grey">
                                <i class="murphy icon-xiazai1" ></i>
                            </div>
                        </div>
                    </a>
                </div>

                <div class="order">
                    <div>2、打开 Eclipse 插件，点击 Help -> Install New Software… </div>
                </div>

                <div class="order">
                    <div>3、点击Add，输入插件昵称后点击 Archive…选择插件安装包后点击 Add</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.ecl1.small"
                              :preview-src-list="showImgs.ecl1.big">
                    </el-image>
                </div>

                <div class="order">
                    <div>4、勾选下图中选中的区域后点击 Next</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.ecl2.small"
                              :preview-src-list="showImgs.ecl2.big">
                    </el-image>
                </div>

                <div class="order">
                    <div>5、勾选下图中选中的区域后点击 Finish</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.ecl3.small"
                              :preview-src-list="showImgs.ecl3.big">
                    </el-image>
                </div>

                <div class="order">
                    <div>6、点击Add，输入插件昵称后点击 Archive…选择插件安装包后点击 Add</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.ecl4.small"
                              :preview-src-list="showImgs.ecl4.big">
                    </el-image>
                </div>
            </el-timeline-item>

            <el-timeline-item>
                <div class="step_name">
                    步骤二：完成认证
                </div>
                <div class="order">
                    <div>1、勾选下图中选中的区域后点击 Trust Selected 后，点击 Restart Now</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.ecl5.small"
                              :preview-src-list="showImgs.ecl5.big">
                    </el-image>
                </div>
                <div class="order">
                    <div>2、点击 Windows -> Show View -> Other，选择Murphysec 点击 Open</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.ecl6.small"
                              :preview-src-list="showImgs.ecl6.big">
                    </el-image>
                </div>

                <div class="order">
                    <div style="margin-bottom: 8px;line-height: 20px;">3、点击 Eclipse -> Preferences… -> Murphysec
                        ，填写“对应的后台服务地址”与“后台设置 -> 访问令牌中的token”后点击 Apply and Close</div>
                    <div>访问令牌</div>
                    <el-input readonly style="width: 568px;margin: 10px 0;" v-model="order2" placeholder="Please input">
                        <template #append>
                            <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="order2"
                               @click="copyFunc('#copy_token')"></i>
                        </template>
                    </el-input>

                    <div>服务地址</div>
                    <el-input readonly style="width: 568px;margin: 10px 0;" v-model="order1" placeholder="Please input">
                        <template #append>
                            <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="order1"
                               @click="copyFunc('#copy_token')"></i>
                        </template>
                    </el-input>

                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.ecl7.small"
                              :preview-src-list="showImgs.ecl7.big">
                    </el-image>
                </div>
            </el-timeline-item>

            <el-timeline-item>
                <div class="step_name">
                    步骤三：开始检测
                </div>
                <div class="order">
                    <div>1、配置完成后，在 Murphysec 插件面板上点击 “开始”后即可开始扫描</div>
                </div>
                <div class="order">
                    <div>2、检测完成后，可点击“控制台”按钮跳转至后台查看项目检测详情</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.ecl8.small"
                              :preview-src-list="showImgs.ecl8.big">
                    </el-image>
                </div>
            </el-timeline-item>
            <!--
            <el-timeline-item>
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/eclipse-ide-plugin.html" target="_blank">文档说明 <i
                        class="murphy icon-jiantou-you"></i></a>
            </el-timeline-item> -->
        </el-timeline>

        <!-- <div class="video" v-if="!$systemConfig.isClose">
            <video :src="`${origin}/files/video/eclipse-tutorial-video.mp4`" width="508"
                height="282" controls
                :poster="`${origin}/files/video/eclipse-tutorial-cover.jpg`"></video>
            <div class="video_text">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/eclipse-ide-plugin.html" target="_blank">文档说明 <i
                        class="murphy icon-jiantou-you"></i></a>
            </div>
        </div> -->
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref, onBeforeMount } from 'vue';
import { copyFunc } from 'util/tools';
import { getTokenApi } from 'api/project';
import ecl1 from 'ast/configImg/ecl1.png';
import ecl2 from 'ast/configImg/ecl2.png';
import ecl3 from 'ast/configImg/ecl3.png';
import ecl4 from 'ast/configImg/ecl4.png';
import ecl5 from 'ast/configImg/ecl5.png';
import ecl6 from 'ast/configImg/ecl6.png';
import ecl7 from 'ast/configImg/ecl7.png';
import ecl8 from 'ast/configImg/ecl8.png';

const order1 = ref<string>(window.location.origin);
const order2 = ref<string>('');

const showImgs = {
    ecl1: {
        small: ecl1,
        big: [ecl1],
    },
    ecl2: {
        small: ecl2,
        big: [ecl2],
    },
    ecl3: {
        small: ecl3,
        big: [ecl3],
    },
    ecl4: {
        small: ecl4,
        big: [ecl4],
    },
    ecl5: {
        small: ecl5,
        big: [ecl5],
    },
    ecl6: {
        small: ecl6,
        big: [ecl6],
    },
    ecl7: {
        small: ecl7,
        big: [ecl7],
    },
    ecl8: {
        small: ecl8,
        big: [ecl8],
    },
};

onBeforeMount(async () => {
    const res = await getTokenApi({
        team_id: store.teamInfo.team_id,
    });
    order2.value = res.data.Token;
});
</script>

<style lang='less' scoped>
.cli_config {
    margin-top: 24px;
    background-color: #F7F8FB;
    padding: 24px;
    border-radius: 8px;
    position: relative;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #858585;
        margin-bottom: 24px;
    }

    .video {
        position: absolute;
        top: 72px;
        right: 24px;
        background: #FFFFFF;
        width: 508px;
        height: 282px;
        border: 1px solid #EBEBEB;
        box-shadow: 0px 14px 24px rgba(31, 35, 41, 0.08);
        border-radius: 6px;
        padding: 8px;
        font-size: 14px;
        color: #858585;

        a {
            color: #6C87FF;

            i {
                vertical-align: -2px;
            }
        }

        .video_text {
            margin-top: 16px;
        }
    }

    .step_name {
        font-size: 14px;
        color: #3c3c3c;
        margin-bottom: 10px;
    }

    .tag {
        padding: 2px 6px;
        background: #F5F7FA;
        border-radius: 4px;
        border: 1px solid #D2D9E2;
    }

    .order {
        font-size: 12px;
        color: #858585;
        margin-bottom: 16px;
        max-width: 580px;
        a {
            color: #3c3c3c;
        }
        .el-image {
            margin-top: 6px;
        }
    }

    i#copy_token {
        cursor: pointer;
    }

    .download {
        width: 568px;
        height: 58px;
        background: #FFFFFF;
        border: 1px solid #EBEBEB;
        border-radius: 8px;
        .between();
        padding: 10px 16px;
        box-sizing: border-box;
        margin: 8px 0;

        .info {
            .between();
        }

        .name {
            font-size: 14px;
            color: @text-color;
            margin-bottom: 4px;
        }
    }
}</style>
