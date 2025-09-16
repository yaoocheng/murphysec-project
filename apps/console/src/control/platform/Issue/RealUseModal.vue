<template>
    <el-dialog class="screen-dialog real_use_dialog" width="100%">
        <div style="padding: 0 120px;padding-bottom: 0;" class="g-color-1">
            <div class="g-flex g-align-center g-f-24 g-mb-16">
                <span :style="{ background: getRepaireLevelTool(info?.comp_info?.suggest_level).color }" class="g-display-inline-block g-color-fff g-bdr-6 g-mr-8 title-level">
                    {{ getRepaireLevelTool(info?.comp_info?.suggest_level).text }}
                </span>
                <span class="g-fw-500 g-mr-8">组件名称{{ info?.comp_info?.comp_name || '-' }}</span>
                <span class="tag g-f-14" v-if="info?.comp_info?.is_online">线上依赖</span>
            </div>

            <div class="g-p-16 g-bdr-6 g-bg-f7 g-f-14 g-color-3 g-flex g-justify-between">
                <div>
                    生态仓库类型：<span class="g-color-1">{{ info?.comp_info?.ecosystem }}</span>
                </div>
                <div>
                    依赖类型：<span class="g-color-1">{{ info?.comp_info?.is_direct_dependency?'直接依赖': '间接依赖' }}</span>
                </div>
                <div>
                    组件版本：<span class="g-color-1">{{ info?.comp_info?.comp_version }}</span>
                </div>
                <div>
                    修复状态：<span class="g-color-1">{{ fixObj[info?.fix_status] }}</span>
                </div>
            </div>
        </div>

        <el-tabs v-model="activeName" class="real-use-tabs">
            <el-tab-pane name="1">
                <template #label>
                    <div class="g-f-16 g-fw-400">
                        漏洞触发路径
                        <el-popover placement="top" :width="344" effect="dark"
                            content="展示从组件引入到漏洞缺陷点调用的完整路径，清晰直观了解漏洞的来源和触发情况">
                            <template #reference>
                                <i class="murphy icon-wenhaoxiao"></i>
                            </template>
                        </el-popover>
                    </div>
                </template>
                <TriggerGraphModal v-if="activeName === '1'" :info="info.comp_info" :tid="info.project_id"
                    :sid="info.subtask_id" />
            </el-tab-pane>

            <el-tab-pane v-if="store.conf.is_real_use" name="2">
                <template #label>
                    <div class="g-f-16 g-fw-400">
                        漏洞数据流分析
                        <el-popover placement="top" :width="344" effect="dark"
                            content="基于污点跟踪技术，深入分析漏洞在代码数据流中的传播链路，精准判断漏洞被利用可能性">
                            <template #reference>
                                <i class="murphy icon-wenhaoxiao"></i>
                            </template>
                        </el-popover>
                    </div>
                </template>
                <VulnStream v-if="activeName === '2'" :info="info" />
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import store from 'util/store';
import { getRepaireLevelTool } from 'util/tools';
import VulnStream from './VulnStream.vue';
import TriggerGraphModal from './TriggerGraphModal.vue';

const activeName = ref('1');
defineProps(['info']);

const fixObj:any = {
    1: '待修复',
    2: '已修复',
    3: '7天忽略',
    4: '永久忽略',

};
</script>

<style scoped lang='less'>
.title-level {
    display: inline-block;
    overflow: hidden;
    width: 64px;
    height: 64px;
    line-height: 58px;
    text-align: center;
    background-color: #D83931;
    padding: 4px 8px;
    box-sizing: border-box;
}
</style>

<style lang="less" scoped>
.real-use-tabs {
    height: calc(100% - 110px);
    padding-top: 16px;
    box-sizing: border-box;

    :deep(.el-tabs__header) {
        background-color: #fff;
        margin-bottom: 0;
        padding: 0 120px;
    }

    :deep(.el-tabs__nav-wrap::after) {
        height: 1px;
        background-color: #e4e7ed94;
    }

    :deep(.el-tabs__content) {
        height: calc(100% - 200px);
        padding: 24px 120px;
        box-sizing: border-box;
        background-color: #F7F8FB;
    }
}
</style>

<style lang="less">
.real_use_dialog .el-dialog__header {
    padding: 0;
}
</style>
