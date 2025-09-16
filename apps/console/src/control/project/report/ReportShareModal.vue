<template>
    <el-dialog width="520px" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="popup_content">
            <div class="title">
                将项目报告以徽章方式加入到开源项目首页
            </div>
            <div class="tip">
                复制这段代码，添加到readme.md中，让更多开发者信任您的项目安全
            </div>
            <div class="badge_content">
                <el-tabs v-model="activeName" class="template_tabs">
                    <el-tab-pane label="MARKDOWN" name="1">
                        <span style="line-height: 25px;word-break: break-all;">
                            [![Security Status]({{ origin + store.reportShowInfo.badge_url }})]({{ reportLink }})
                        </span>
                    </el-tab-pane>
                    <el-tab-pane label="HTML" name="2">
                        <span style="line-height: 25px;word-break: break-all;">
                            {{ `<a href="${reportLink}" alt="Security Status"><img src="${origin + store.reportShowInfo.badge_url}" /></a>` }}
                        </span>
                    </el-tab-pane>
                    <el-tab-pane label="LINK" name="3">
                        <span style="line-height: 25px;word-break: break-all;">
                            {{ origin + store.reportShowInfo.badge_url }}
                        </span>
                    </el-tab-pane>
                    <el-tab-pane label="预览" name="4">
                        <img style="width: 100%;" :src="`${ origin + store.reportShowInfo.badge_url}`" alt="">
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import store from 'util/store';

const route = useRoute();
const activeName = ref<string>('1');
const { origin } = window.location;
const reportLink = `${origin}/console/share-report/${route.params.tid}/${route.params.sid}`;
</script>

<style lang='less' scoped>
.popup_content .title {
    color: #3D3D3D;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
}

.tip {
    font-size: 12px;
    color: #6E6D79;
    margin-bottom: 15px;
}

.link_copy {
    display: flex;
    font-size: 14px;
    color: #3D3D3D;
    margin-bottom: 40px;

    .input {
        width: 100%;
        height: 40px;
        border-radius: 6px;
        border: 1px solid #ECECEC;
        line-height: 40px;
        padding-left: 10px;
        font-weight: 500;
        .ellipsis();
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .el-button {
        width: 86px;
        height: 40px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}

.badge_content {
    width: 460px;
    height: 218px;
    background: #F9FBFE;
    border-radius: 10px;
    padding: 16px 25px;
    box-sizing: border-box;
}
</style>
