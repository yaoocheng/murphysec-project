<template>
    <el-dialog class="screen-dialog" width="100%">
        <div class="container">
            <div class="g-f-24 g-color-1 g-fw-600 g-mb-16">
                <img class="file_icon g-mr-4" style="width: 26px;" :src="getFileImg(name)" alt="">
                {{ name }}
            </div>

            <el-tabs v-model="activeName">
                <el-tab-pane lazy label="文件详情" name="1">
                    <FileDetailComp :sid="($route.params.sid as string)" :fileParams="fileParams" :reqFunc="getSbomFileDetailInfoApi"  />
                </el-tab-pane>

                <el-tab-pane lazy label="ASCII字符串" name="2">
                    <ASCIIComp :sid="($route.params.sid as string)" :fileParams="fileParams" :reqFunc="getSbomASCIIDataApi" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getSbomASCIIDataApi, getSbomFileDetailInfoApi } from 'api/asset';
import { getFileImg } from '@/constants/file-icon';
import FileDetailComp from '@/control/detect/components/FileDetailComp.vue';
import ASCIIComp from '@/control/detect/components/ASCIIComp.vue';

defineProps<{
    name: string,
    fileParams: any,
}>();

const activeName = ref('1');

</script>

<style lang='less' scoped>
.container {
    padding: 32px 120px;
    padding-bottom: 0;
    background-color: #fff;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;

    .file-tab {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid var(--004, #C7C7C7);
        background: #FFF;
        font-size: 14px;
        .g-color-1();
        margin-right: 12px;
        margin-bottom: 24px;
        cursor: pointer;
    }

    .file-tab.active {
        .g-color-5();
        border-color: @primary;
        background-color: rgba(108, 135, 255, 0.10);
        ;
    }

    :deep(.el-tabs__item) {
        font-size: 16px;
    }

    .file-wrap {
        height: 70vh;

        .left-content {
            width: 208px;
            height: 100%;
            background-color: #F7F8FB;
            border-radius: 6px;
            overflow: auto;
        }

        .item {
            padding: 16px;
            margin-bottom: 2px;
            cursor: pointer;
        }
    }
}
</style>
