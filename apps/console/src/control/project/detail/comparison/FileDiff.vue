<template>
    <el-dialog width="1200px" top="3%">
        <template #header>
            <div class="text-base font-medium text-3c mb-2">
                文件对比详情
            </div>
            <div class="text-sm text-85 font-normal">
                路径：{{ path }}
            </div>
        </template>

        <div class="mt-6 bg-ff rounded-md h-[590px]" style="border: 1px solid #EBEBEB;">
            <div class="flex">
                <div class="flex-1">
                    <div class="border bg-f7 text-base font-medium text-3c px-4 py-3">当前文件</div>
                    <div class="p-4 pb-0 text-sm text-3c font-normal ">
                        <div class="font-medium mb-3">
                            基本信息
                        </div>
                        <div class="mb-2 flex justify-between">
                            <!-- <span class="flex-1">名称：{{ fileDiffCode.leftInfo?.name }}</span> -->
                            <span class="flex-1">文件大小：{{ (fileDiffCode.leftInfo?.size / 1000).toFixed(2) }} KB</span>
                            <span class="flex-1">编码格式：{{ fileDiffCode.leftInfo?.encoding || '-' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="flex-1 ellipsis mr-2">MD5：{{ fileDiffCode.leftInfo?.hash || '-' }}</span>
                        </div>

                    </div>
                </div>

                <el-divider style="border-color: #EBEBEB;" direction="vertical" class="h-[160px] mx-0" />

                <div class="flex-1">
                    <div class="border bg-f7 text-base font-medium text-3c px-4 py-3">对比文件</div>
                    <div class="p-4 pb-- text-sm text-3c font-normal">
                        <div class="font-medium mb-3">
                            基本信息
                        </div>
                        <div class="mb-2 flex justify-between">
                            <!-- <span class="flex-1">名称：{{ fileDiffCode.rightInfo?.name }}</span> -->
                            <span class="flex-1">文件大小：{{ (fileDiffCode.rightInfo?.size / 1000).toFixed(2) }} KB</span>
                            <span class="flex-1">编码格式：{{ fileDiffCode.rightInfo?.encoding || '-' }}</span>
                        </div>
                        <div class=" flex justify-between">
                            <span class="flex-1 ellipsis mr-2">MD5：{{ fileDiffCode.rightInfo?.hash || '-' }}</span>
                        </div>

                        <!-- <div class="font-medium mb-3">
                        详细内容对比
                    </div>

                    <CodeDiff v-if="fileDiffCode.left_tree||fileDiffCode.right_tree" :old-string="fileDiffCode.left_tree" :new-string="fileDiffCode.right_tree" diffStyle="char" output-format="line-by-line" />
                    <NoData v-else /> -->
                    </div>
                </div>
            </div>

            <div style="border-top: 1px solid #EBEBEB;" class="font-medium text-3c mb-3 pt-3 pl-4">
                详细内容对比
            </div>
            <div class="p-4 pt-0 overflow-auto" style="height: calc(100% - 220px);">
                <!-- <CodeDiff style="margin-top: 0;" v-if="fileDiffCode.left_tree && fileDiffCode.right_tree" :old-string="fileDiffCode.left_tree"
                          :new-string="fileDiffCode.right_tree" diffStyle="char" output-format="side-by-side" /> -->
                <!-- <NoData class="mt-6" description="因当前文件内容过大等原因，暂不支持展示" v-else /> -->
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
// import { CodeDiff } from 'v-code-diff';
import NoData from '@/components/NoData.vue';

// import { ref, reactive, onBeforeMount, onMounted, watch } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
// import {  } from 'util/tools';
// import store from 'util/store';
// import { } from 'api/project';

// const route = useRoute();
// const router = useRouter();
defineProps(['fileDiffCode', 'path']);
// onBeforeMount(() => {
// })

// onMounted(() => {
// })
</script>
