<template>
    <div class="cli_config">
        <div class="title">
            如何与 JenKins 集成进行项目检测
        </div>

        <el-timeline>
            <el-timeline-item>
                <div class="step_name">
                    步骤一：快速安装
                </div>
                <div class="order">
                    <div>1、点此下载或右键复制下载链接</div>
                    <a href="/files/murphysec-linux-amd64" target="_blank">
                        <div class="download">
                            <div class="info">
                                <i class="murphy icon-file-zip"
                                   style="font-size: 30px;color: #FCD165;margin-right: 12px;"></i>
                                <div>
                                    <div class="name">murphysec-linux-amd64</div>
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
                    <div>2、将下载的客户端文件放置在Jenkins服务器上，并执行命令：</div>
                    <el-input readonly type="textarea" resize="none" style="width: 568px;margin: 10px 0;" v-model="order2"
                              placeholder="Please input">
                              <!-- <template #append>
                            <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="order2"
                                @click="copyFunc('#copy_token')"></i>
                        </template> -->
                    </el-input>
                </div>
            </el-timeline-item>

            <el-timeline-item>
                <div class="step_name">
                    步骤二：配置Jenkins Pipeline
                </div>
                <div class="order">
                    <div style="margin-bottom: 8px;">编辑您的 jenkinsfile 文件，在 stages 中添加用于检测的 stage</div>
                    <div>注意：--server 参数可以用来指定{{ $systemConfig.longName }}私有部署服务地址</div>
                    <el-input readonly type="textarea" :rows="10" resize="none" style="width: 568px;margin: 10px 0;"
                              v-model="order" placeholder="Please input">
                              <!-- <template #append>
                            <i class="murphy icon-fuzhi1" id="copy_token" :data-clipboard-text="order2"
                                @click="copyFunc('#copy_token')"></i>
                        </template> -->
                    </el-input>

                    <!-- <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.idea4.small"
                        :preview-src-list="showImgs.idea4.big">
                    </el-image> -->
                </div>
            </el-timeline-item>

            <!-- <el-timeline-item>
                <div class="video_text">
                    视频教程是否对你有帮助？如有疑问您可以查看
                    <a href="/docs/faqs/integration/jenkins.html" target="_blank">文档说明 <i
                            class="murphy icon-jiantou-you"></i></a>
                </div>
            </el-timeline-item> -->

            <!-- <el-timeline-item>
                <div class="step_name">
                    步骤三：配置Pipeline
                </div>
                <div class="order">
                    <div>编辑您的jenkinsfile，在stages中添加用于检测的stage</div>
                    <el-image style="width: 568px;" :hide-on-click-modal="true" :src="showImgs.idea4.small"
                        :preview-src-list="showImgs.idea4.big">
                    </el-image>
                </div>
            </el-timeline-item>

            <el-timeline-item>
                <div class="step_name">
                    步骤四： 如有疑问您可以查看
                    <a href="/docs/faqs/integration/jenkins.html" target="_blank">文档说明 <i
                            class="murphy icon-jiantou-you"></i></a>
                </div>
            </el-timeline-item> -->
        </el-timeline>

        <div class="video" v-if="!$systemConfig.isClose">
            <video :src="`${origin}/files/video/jenkins-tutorial-video.mp4`" width="508"
                   height="282" controls
                   :poster="`${origin}/files/video/jenkins-tutorial-cover.jpg`"></video>
            <div class="video_text flex items-center">
                视频教程是否对你有帮助？如有疑问您可以查看
                <a href="/docs/faqs/integration/jenkins.html" target="_blank" class="button-text-blue">
                    文档说明
                    <i class="murphy icon-jiantou-you"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
import { ref, onBeforeMount } from 'vue';
// import { copyFunc } from 'util/tools';
import { getTokenApi } from 'api/project';
// import idea4 from 'ast/configImg/idea4.png';
import origin from '../../../constants/index';

const order2 = ref<string>('chmod +x murphysec-linux-amd64 \n mv murphysec-linux-amd64 /usr/bin/murphysec');
const order = ref<string>();

onBeforeMount(async () => {
    const res = await getTokenApi({
        team_id: store.teamInfo.team_id,
    });
    order.value = `stage("murphysec scan") {
steps{
     sh  '''
           murphysec scan . --server ${window.location.origin} --token ${res.data.Token} --deep

          '''
     }
}`;
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
