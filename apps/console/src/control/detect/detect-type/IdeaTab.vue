<template>
    <div class="idea_config">
        <div class="title">
            如何通过 {{ name }} 插件进行检测
        </div>
        <el-timeline>
            <el-timeline-item>
                <div class="step_name">
                    步骤一：快速安装
                </div>
                <div class="order">
                    <div>1、点击下载 {{ name }} 插件</div>
                    <a href="/files/murphysec-jetbrains-plugin.zip" target="_blank">
                        <div class="download">
                            <div class="info">
                                <i class="murphy icon-file-zip"
                                   style="font-size: 30px;color: #FCD165;margin-right: 12px;"></i>
                                <div>
                                    <div class="name">murphysec-jetbrains-plugin.zip</div>
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
                    <div>2、在 IDE 中打开插件安装窗口，选择从本地磁盘安装，然后选择本地下载的 {{ name }} 插件</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.idea1.small"
                              :preview-src-list="showImgs.idea1.big">
                    </el-image>
                </div>
            </el-timeline-item>
            <el-timeline-item>
                <div class="part">
                    <div class="name">步骤二：配置访问令牌</div>
                    <div style="margin-bottom: 10px;">点击插件面板中左侧边栏的设置按钮，在插件设置窗口中配置好访问令牌，即可开始检测</div>
                    <el-input readonly style="width: 568px;margin-bottom: 10px;" v-model="token" placeholder="Please input">
                        <template #append>
                            <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="token"
                               @click="copyFunc('#copy_token')"></i>
                        </template>
                    </el-input>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.idea3.small"
                              :preview-src-list="showImgs.idea3.big">
                    </el-image>
                </div>
            </el-timeline-item>
        </el-timeline>

        <!-- <div class="video" v-if="!$systemConfig.isClose">
            <video :src="`${origin}/files/video/ide-tutorial-video.mp4`" width="508" height="282" controls :poster="`${origin}/files/video/ide-tutorial-cover.jpg`"></video>
            <div class="video_text">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/jetbrains-ide-plugin.html" target="_blank">文档说明 <i class="murphy icon-jiantou-you"></i></a>
            </div>
        </div> -->
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import { copyFunc } from 'util/tools';
import store from 'util/store';
import idea1 from 'ast/configImg/idea1.png';
import idea3 from 'ast/configImg/idea3.png';
import idea4 from 'ast/configImg/idea4.png';
import { getTokenApi } from 'api/project';
// import origin from '../../../constants/index';

defineProps(['name']);
const token = ref<string>('');
const showImgs = {
    idea1: {
        small: idea1,
        big: [idea1],
    },
    idea3: {
        small: idea3,
        big: [idea3],
    },
    idea4: {
        small: idea4,
        big: [idea4],
    },
};

onBeforeMount(async () => {
    const res = await getTokenApi({
        team_id: store.teamInfo.team_id,
    });
    token.value = res.data.Token;
});
</script>

<style lang='less' scoped>
.idea_config {
    margin-top: 24px;
    background-color: #F7F8FB;
    padding: 24px;
    border-radius: 8px;
    position: relative;
    .order {
        font-size: 12px;
        color: #858585;
        margin-bottom: 16px;
        max-width: 580px;
        a {
            color: #3c3c3c;
        }
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
    .title {
        font-size: 16px;
        font-weight: 600;
        color: #858585;
        margin-bottom: 24px;
    }

    .part {
        width: 740px;
        font-size: 12px;
        color: #8F959E;
        padding: 24px;
        padding-left: 0;
        padding-top: 0;
        padding-bottom: 0;
        margin-bottom: 20px;
        border-radius: 10px;

        .name {
            font-size: 14px;
            color: #3c3c3c;
            margin-bottom: 5px;
        }

        i#copy_token {
            font-size: 18px;
            cursor: pointer;
        }

        // .download {
        //     display: flex;
        //     justify-content: space-between;
        //     align-items: center;
        //     border-radius: 8px;
        //     width: 300px;
        //     padding: 10px 10px;
        //     box-sizing: border-box;
        //     border: 1px solid #6C87FF;
        //     color: #555362;

        //     i {
        //         font-size: 18px;
        //         color: #6C87FF;
        //     }
        // }

        // .copy_wrap {
        //     width: 620px;
        //     height: 40px;
        //     line-height: 40px;
        //     background: #F5F7FA;
        //     border-radius: 6px;
        //     border: 1px solid #CED6E0;
        //     color: #969DA7;
        //     padding-left: 10px;
        //     margin-top: 10px;
        //     margin-bottom: 20px;

        //     i {
        //         margin-right: 10px;
        //         font-size: 18px;
        //         cursor: pointer;
        //     }
        // }
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
}
</style>
