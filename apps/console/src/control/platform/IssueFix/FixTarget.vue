<template>
    <div class="font-medium flex items-center mb-3">
        <SvgIcon name="fix-target" class="w-4 h-4 mr-2" />
        修复目标
    </div>
    <div class="mb-8 bg-f7 rounded-md px-6 py-5 border border-solid border-[#EBEBEB]">
        <div class="flex justify-between items-center">
            <div class="text-base text-3c font-medium">
                修复<span v-for="item in curFixRange?.mps_high_suggest" :key="item">{{ rangeTypeMap[item] }}</span>漏洞
            </div>
            <Tooltip v-if="!$route.path.includes('issue-report')&&!$route.path.includes('share-report')" :disabled="!loadingMessage && !errorMessage" content="修复目标正在更新中，「调整目标」不可用">
                <div class="button-text-blue"
                     :class="{ 'button-text-disable': loadingMessage || errorMessage }"
                     @click="(!loadingMessage && !errorMessage) && (fixRangeDialogVisible = true)">
                    <!-- <div class="text-sm text-85 cursor-pointer flex items-center hover:text-3c"
                     :class="{ 'no_click': loadingMessage || errorMessage }"
                     @click="(!loadingMessage && !errorMessage) && (fixRangeDialogVisible = true)"> -->
                    <!-- <i class="murphy icon-Union2 g-vertical--1 mr-1" style="font-size: 14px;"></i> -->
                    <i class="murphy icon-Union2"></i>
                    <span>调整目标范围</span>
                </div>
            </Tooltip>
        </div>
        <div v-if="curFixRange.mps_list?.length" class="text-sm text-85 mt-2">
            目标涉及漏洞数：{{ curFixRange.mps_list?.length }}个
            <!-- 修复当前组件漏洞 {{ curFixRange.mps_list?.length }}/{{ fixState.issueInfo?.comp_info?.effects?.length }} -->
        </div>
    </div>
    <FixRange v-model="fixRangeDialogVisible" v-if="fixRangeDialogVisible" />
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import FixRange from './FixRange.vue';
import { fixState } from '../composable/use-issue-fix';

const {
    actions, curFixRange, fixRangeDialogVisible, loadingMessage, errorMessage,
} = toRefs(fixState.fixRange);
actions.value.getFixRange();

// 修复范围类型映射
const rangeTypeMap: any = {
    all: '全部',
    custom: '自定义',
    StrongRecommend: '「强烈建议修复」',
    Recommend: '「建议修复」',
    Critical: '「严重」',
    High: '「高危」',
};
</script>
