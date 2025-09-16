<template>
    <div class="cli_config">
        <div class="title">
            如何通过 CLI 客户端进行检测
        </div>

        <el-timeline>
            <el-timeline-item>
                <div class="step_name">步骤一：快速安装</div>
                <div class="step_name">
                    在Linux上安装
                </div>
                <div class="order">
                    <div>1、点击下载</div>
                    <a href="/files/murphysec-linux-amd64" target="_blank">
                        <div class="download">
                            <div class="info">
                                <i class="murphy icon-file-zip"
                                   style="font-size: 30px;color: #FCD165;margin-right: 12px;"></i>
                                <div>
                                    <div class="name">murphysec-linux-amd64</div>
                                    <!-- <div>XZ - 15.2M</div> -->
                                </div>
                            </div>
                            <!-- <i class="murphy icon-xiazai1" style="cursor: pointer;"></i> -->
                            <div class="button-icon-grey">
                                <i class="murphy icon-xiazai1"></i>
                            </div>

                        </div>
                    </a>
                </div>

                <div class="order" style="margin-bottom: 0;">
                    <div>2、执行命令</div>
                    <el-input readonly type="textarea" resize="none" style="width: 568px;margin: 10px 0;" v-model="order6"
                              placeholder="Please input">
                        <template #append>
                            <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="order6"
                               @click="copyFunc('#copy_token')"></i>
                        </template>
                    </el-input>
                </div>

                <div class="step_name">
                    在macOS上安装
                </div>
                <div class="order">
                    <div>1、点击下载</div>
                    <a href="/files/murphysec-darwin-amd64" target="_blank">
                        <div class="download">
                            <div class="info">
                                <i class="murphy icon-file-zip"
                                   style="font-size: 30px;color: #FCD165;margin-right: 12px;"></i>
                                <div>
                                    <div class="name">murphysec-macOS-amd64</div>
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

                <div class="order" style="margin-bottom: 0;">
                    <div>2、执行命令</div>
                    <el-input readonly type="textarea" resize="none" style="width: 568px;margin: 10px 0;" v-model="order7"
                              placeholder="Please input">
                        <template #append>
                            <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="order7"
                               @click="copyFunc('#copy_token')"></i>
                        </template>
                    </el-input>
                </div>

                <div class="step_name">
                    在Windows上安装
                </div>
                <div class="order">
                    <a href="/files/murphysec-windows-amd64.exe" target="_blank">
                        <div class="download">
                            <div class="info">
                                <i class="murphy icon-file-zip"
                                   style="font-size: 30px;color: #FCD165;margin-right: 12px;"></i>
                                <div>
                                    <div class="name">murphysec-windows-amd64</div>
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
            </el-timeline-item>

            <el-timeline-item>
                <div class="step_name">
                    步骤二：客户端检测命令
                </div>
                <div class="step_name">
                    客户端检测命令
                </div>
                <div class="order" style="margin-bottom: 0;">
                    <el-input readonly style="width: 568px;margin: 10px 0;" v-model="order8" placeholder="Please input">
                        <template #append>
                            <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="order8"
                               @click="copyFunc('#copy_token')"></i>
                        </template>
                    </el-input>
                </div>

                <div class="step_name">
                    访问令牌
                </div>
                <div class="order" style="margin-bottom: 0;">
                    <el-input readonly style="width: 568px;margin: 10px 0;" type="password" v-model="order4" placeholder="Please input">
                        <template #append>
                            <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="order4"
                               @click="copyFunc('#copy_token')"></i>
                        </template>
                    </el-input>
                </div>
            </el-timeline-item>

            <!-- <el-timeline-item>
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="https://www.murphysec.com/docs/faqs/integration/cli.html" target="_blank">文档说明 <i
                        class="murphy icon-jiantou-you"></i>
                </a>
            </el-timeline-item> -->
        </el-timeline>

        <div class="video" v-if="!$systemConfig.isClose">
            <video :src="`${origin}/files/video/cli-tutorial-video.mp4`" width="508"
                   height="282" controls
                   :poster="`${origin}/files/video/cli-tutorial-cover.jpg`"></video>
            <div class="video_text">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/cli.html" target="_blank">文档说明 <i
                    class="murphy icon-jiantou-you"></i></a>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref, onBeforeMount } from 'vue';
import { copyFunc } from 'util/tools';
import { getTokenApi } from 'api/project';
import origin from '../../../constants/index';

// const order1 = ref<string>('wget -q https://s.murphysec.com/release/install.sh -O - | /bin/bash');
// const order2 = ref<string>('curl -fsSL https://s.murphysec.com/release/install.sh | /bin/bash');
// const order3 = ref<string>('powershell -Command "iwr -useb https://s.murphysec.com/release/install.ps1 | iex"');
const order4 = ref<string>('');
// const order5 = 'murphysec auth login';

const order6 = ref<string>('chmod +x murphysec-linux-amd64 \nmv murphysec-linux-amd64 /usr/bin/murphysec');
const order7 = ref<string>('chmod +x murphysec-darwin-amd64 \nmv murphysec-darwin-amd64 /usr/local/bin/murphysec');
const order8 = ref<string>();

onBeforeMount(async () => {
    const res = await getTokenApi({
        team_id: store.teamInfo.team_id,
    });
    order4.value = res.data.Token;
    order8.value = `murphysec scan /your/project/dir --server ${window.location.origin} --token ${res.data.Token}`;
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

}
</style>
