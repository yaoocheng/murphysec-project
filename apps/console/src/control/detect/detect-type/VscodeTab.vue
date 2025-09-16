<template>
    <div class="cli_config">
        <div class="title">
            如何通过 VSCode 插件进行检测
        </div>

        <el-timeline>
            <el-timeline-item>
                <div class="step_name">
                    步骤一：快速安装
                </div>
                <div class="order">
                    <div>1、点击下载 VSCode 插件</div>
                    <a href="/files/murphysec-vscode-plugin.vsix" target="_blank">
                        <div class="download">
                            <div class="info">
                                <i class="murphy icon-file-zip"
                                   style="font-size: 30px;color: #FCD165;margin-right: 12px;"></i>
                                <div>
                                    <div class="name">murphysec-vscode-plugin.vsix</div>
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
                    <div>2、在 VSCode 中打开拓展面板，选择从VSIX安装，然后选择本地下载的VSCode插件</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.vscode1.small"
                              :preview-src-list="showImgs.vscode1.big">
                    </el-image>
                </div>
            </el-timeline-item>

            <el-timeline-item>
                <div class="step_name">
                    步骤二：完成认证
                </div>
                <div class="order">
                    <div>1、拓展列表点击Murphysec Vscode Extension插件设置按钮，点击拓展设置</div>
                </div>
                <div class="order">
                    <div>2、在Token处输入{{$systemConfig.shortName}}账号访问令牌，Url处输入{{$systemConfig.longName}}平台地址完成认证配置</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.vscode2.small"
                              :preview-src-list="showImgs.vscode2.big">
                    </el-image>
                </div>
            </el-timeline-item>

            <el-timeline-item>
                <div class="step_name">
                    步骤三：开始检测
                </div>
                <div class="order">
                    <div>1、右击项目目录空白处，点击扫描这个目录，开始检测项目</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.vscode3.small"
                              :preview-src-list="showImgs.vscode3.big">
                    </el-image>
                </div>
            </el-timeline-item>

            <!-- <el-timeline-item>
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/vscode-ide-plugin.html" target="_blank">文档说明 <i
                        class="murphy icon-jiantou-you"></i></a>
            </el-timeline-item> -->
        </el-timeline>

        <!-- <div class="video" v-if="!$systemConfig.isClose">
            <video src="/files/video/vscode-tutorial-video.mp4" width="508"
                height="282" controls
                poster="/files/video/vscode-tutorial-cover.jpg"></video>
            <div class="video_text">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/vscode-ide-plugin.html" target="_blank">文档说明 <i
                        class="murphy icon-jiantou-you"></i></a>
            </div>
        </div> -->
    </div>
</template>

<script setup lang='ts'>
import vscode1 from 'ast/configImg/vscode1.png';
import vscode2 from 'ast/configImg/vscode2.png';
import vscode3 from 'ast/configImg/vscode3.png';

const showImgs = {
    vscode1: {
        small: vscode1,
        big: [vscode1],
    },
    vscode2: {
        small: vscode2,
        big: [vscode2],
    },
    vscode3: {
        small: vscode3,
        big: [vscode3],
    },
};
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
