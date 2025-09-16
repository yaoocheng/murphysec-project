<template>
    <el-dialog width="840" align-center title="检测结果准确性受限" :close-on-click-modal="false">
        <template #title>
            <div class="g-mb-8">
                检测结果准确性受限
            </div>
            <div class="g-color-3 g-f-14 g-fw-400">由于部分检测条件未满足或存在检测配置问题，本次检测结果可能不完全准确，无法反映项目的实际依赖状况
                <a href="/docs/glossary/The-accuracy-of-the-results-is-limited.html#%E6%9C%AA%E5%90%AF%E7%94%A8%E7%BC%96%E8%AF%91%E6%9E%84%E5%BB%BA"
                    target="_blank">查看文档</a>
            </div>
        </template>

        <div class="max-h-[500px] overflow-auto">
        <div v-if="info?.length === 1" v-for="(item, i) in info" :key="i">
            <div class="g-f-14 g-color-1 g-mt-8">
                <div class="g-mb-24">
                    <div class="g-fw-500 g-mb-8">原因</div>
                    <div class="g-bg-f7 g-p-16 g-bdr-4" style="padding: 12px 16px;">
                        {{ mavenInfo[item.kind].desc }}
                    </div>
                </div>
                <div>
                    <div class="g-fw-500 g-mb-8">解决方案</div>
                    <div class="g-bg-f7 g-p-16 g-bdr-6" style="padding: 12px 16px;">
                        <pre style="overflow: auto;line-height: 24px;">{{ mavenInfo[item.kind].plan }}</pre>
                    </div>
                </div>
                <div v-if="item.content">
                    <div class="g-fw-500 g-mb-8 g-mt-24">
                        错误日志
                        <el-tooltip placement="right">
                            <template #content>
                                <div style="max-width: 400px;">
                                    错误日志最多展示100行，若需查看更多详细信息，可在“项目管理 > 项目 ＞ 任务列表 ＞ 操作”中导出任务日志进行查看
                                </div>
                            </template>
                            <i class="murphy icon-wenhaoxiao g-f-14 g-fw-400"></i>
                        </el-tooltip>
                    </div>
                    <div class="g-bdr-6 g-p-24"
                        style="line-height: 25px; height: 360px; border: 1px solid #C7C7C7;background-color: #EBEBEB4D;overflow: auto;">
                        <pre>{{ item.content }}</pre>
                    </div>
                </div>
            </div>
        </div>

        <el-tabs v-else v-model="activeName">
            <el-tab-pane v-for="(item, i) in info" :key="i" :label="`原因${i + 1}`" :name="`${i + 1}`">
                <div class="g-f-14 g-color-1">
                    <div class="g-mb-24">
                        <div class="g-bg-f7 g-p-16 g-bdr-4" style="padding: 12px 16px;">
                            {{ mavenInfo[item.kind].desc }}
                        </div>
                    </div>
                    <div>
                        <div class="g-fw-500 g-mb-8">解决方案：</div>
                        <div class="g-bg-f7 g-p-16 g-bdr-6" style="padding: 12px 16px;">
                            <pre style="overflow: auto;line-height: 24px;">{{ mavenInfo[item.kind].plan }}</pre>
                        </div>
                    </div>
                    <div v-if="item.content">
                        <div class="g-fw-500 g-mb-8 g-mt-24">
                            错误日志
                            <TipComp :width="400"
                                :content="'错误日志最多展示100行，若需查看更多详细信息，可在“项目管理 > 项目 ＞ 任务列表 ＞ 操作”中导出任务日志进行查看'" />
                        </div>
                        <div class="g-bdr-6 g-p-24"
                            style="line-height: 25px; height: 360px; border: 1px solid #C7C7C7;background-color: #EBEBEB4D;overflow: auto;">
                            <pre>{{ item.content }}</pre>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>

    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import TipComp from 'comp/TipsComp.vue';
import { mavenInfo } from '../../constants/constants';

defineProps(['info']);

const activeName = ref<string>('1');
</script>

<style lang='less'></style>
