<template>
    <div class="font-medium flex justify-between items-center mb-3">
        <div class="flex items-center">
            <SvgIcon name="fix-plan" class="w-4 h-4 mr-2" />
            修复方案
        </div>
        <el-checkbox v-model="checkNoUpdate" @change="actions.useNotUpgradeFixPlan"
                     class="check_no_update font-normal text-3c" label="仅使用非升级修复方案" size="large" />
    </div>

    <!-- 升级版本方案：（目标可达成） -->
    <div v-if="isUpgradeVersion && !curFixPlan.fix_plan_detail?.unfixed_vulns?.length"
         class="flex items-center mb-6 h-[96px]">
        <div @click="checkOtherPlan"
             class=" relative fix_plan cursor-pointer mr-2 flex-1 h-full flex flex-col justify-center">
            <div class="flex items-center mb-2">
                <TagComp
                    v-if="curFixPlan.fix_plan_suggest_version === curFixPlan.fix_plan_select_version || (curFixPlan.fix_plan_suggest_version && !curFixPlan.fix_plan_select_version)"
                    class="mr-2 h-6" content="推荐选择" />
                <div class="text-base flex items-center font-medium">
                    升级组件版本
                    <span class="bg-[#F34D3D1A] rounded inline-block h-6 px-1 ml-2 line-through">{{
                        issueInfo.comp_version }}</span>
                    <i class="murphy icon-jiantou-you mx-1" style="font-size: 12px;font-weight: 600;"></i>
                    <span class="bg-[#38C7281A] rounded inline-block h-6 px-1">{{ curFixPlan.fix_plan_select_version ||
                        curFixPlan.fix_plan_suggest_version }}</span>

                    <span
                        v-if="curFixPlan.fix_plan_suggest_version === curFixPlan.fix_plan_select_version || (curFixPlan.fix_plan_suggest_version && !curFixPlan.fix_plan_select_version)">
                        <el-tag v-if="!curFixPlan.compatibility_problem" class="align-[1px] h-6 ml-2 font-normal"
                                :disable-transitions="true" :color="'#38C7281A'" :style="{ color: '#38C728' }" size="small">
                            <i class="murphy icon-jinggaotubiaosvg g-f-12 g-vertical--1"></i>
                            此版本暂未发现兼容性风险
                        </el-tag>
                        <el-tag @click.stop="isShowCompatibleModal = true" v-else
                                class="text-[#F34D3D] bg-[#F34D3D0D] ml-2">
                            <i class="murphy icon-jinggaotubiaosvg g-f-12 g-vertical--1"></i>
                            存在兼容性风险</el-tag>
                    </span>
                </div>
            </div>
            <div class="text-sm text-85" v-if="curFixPlan.fix_plan_detail?.unfixed_vulns?.length">
                目标漏洞中可修复 {{ curFixPlan.fix_plan_detail?.fixed_vulns?.length }} 个漏洞，无法修复 {{
                    curFixPlan.fix_plan_detail?.unfixed_vulns?.length }} 个漏洞
            </div>
            <div class="text-sm text-85" v-else>
                达成修复目标，可修复 {{ curFixPlan.fix_plan_detail?.fixed_vulns?.length }} 个目标漏洞
            </div>

            <i class="murphy icon-jiantou-you front_icon" style="font-size: 18px;"></i>
        </div>

        <div @click="checkOtherPlan" :class="{ 'disable_other': loadingMessage || errorMessage }"
             class="h-full fix_plan other_plan_btn w-[80px] box-border leading-5 flex items-center text-3c text-xs cursor-pointer"
             style="padding: 0 16px;">
            其他方案
            <i class="murphy icon-jiantou-you" style="font-size: 18px;color: #3c3c3c"></i>
        </div>
    </div>

    <!-- 非升级版本 当前版本 -->
    <div v-else-if="isNoUpgradeVersion && !curFixPlan.fix_plan_detail?.unfixed_vulns?.length"
         class="flex items-center mb-6 h-[96px]">
        <div @click="checkOtherPlan"
             class="hover:bg-ff fix_plan cursor-pointer mr-2 flex-1 h-full flex flex-col justify-center">
            <div class="mb-2 flex items-center">
                <TagComp class="mr-2 h-6" c="#3c3c3c" bgc="#C7C7C799" content="当前使用" />
                <span class="text-base font-medium">继续使用组件版本 {{ issueInfo.comp_version }}</span>
            </div>
            <div class="text-sm text-85" v-if="curFixPlan.fix_plan_detail?.unfixed_vulns?.length">
                目标漏洞中可修复 {{ curFixPlan.fix_plan_detail?.fixed_vulns?.length }} 个漏洞，无法修复 {{
                    curFixPlan.fix_plan_detail?.unfixed_vulns?.length }} 个漏洞
            </div>
            <div class="text-sm text-85" v-else>
                达成修复目标，可修复 {{ curFixPlan.fix_plan_detail?.fixed_vulns?.length }} 个目标漏洞
            </div>
            <i class="murphy icon-jiantou-you front_icon" style="font-size: 18px;"></i>
        </div>

        <div @click="checkOtherPlan" :class="{ 'disable_other': loadingMessage || errorMessage }"
             class="h-full fix_plan other_plan_btn w-[80px] box-border leading-5 flex items-center text-3c text-xs cursor-pointer"
             style="padding: 0 16px;">
            其他方案
            <i class="murphy icon-jiantou-you" style="font-size: 18px;color: #3c3c3c;"></i>
        </div>
    </div>

    <!-- 目标漏洞不存在： -->
    <div v-else-if="!curFixPlan.fix_plan_detail?.all_vulns?.length"
         class="mb-6 h-[96px] fix_plan flex flex-col justify-center">
        <div class="mb-2 flex items-center">
            <span class="text-base font-medium">修复目标已达成</span>
        </div>
        <div class="text-sm text-85">
            当前修复目标没有需要修复的漏洞，无需任何操作
        </div>
    </div>

    <div v-else-if="curFixPlan.fix_plan_detail?.unfixed_vulns?.length" class="flex items-center mb-6 h-[96px]">
        <div class="cursor-pointer fix_plan mr-2 flex-1 h-full flex flex-col justify-center">
            <div class="mb-2 flex items-center">
                <span class="text-base font-medium">暂无推荐修复方案</span>
            </div>
            <div class="text-sm text-85 flex items-center">
                当前修复目标无法达成，可尝试 <span @click="(!loadingMessage && !errorMessage) && (fixRangeDialogVisible = true)"
                                     class="button-text-blue mx-1">调整目标范围</span> 来修复部分漏洞
            </div>
        </div>

        <div @click="checkOtherPlan" :class="{ 'disable_other': loadingMessage || errorMessage }"
             class="h-full fix_plan other_plan_btn w-[80px] box-border leading-5 flex items-center text-3c text-xs cursor-pointer"
             style="padding: 0 16px;">
            其他方案
            <i class="murphy icon-jiantou-you" style="font-size: 18px;color: #3c3c3c"></i>
        </div>
    </div>

    <OtherPlan v-model="otherPlanModal" v-if="otherPlanModal" />

    <CompatibleModal v-model="isShowCompatibleModal" v-if="isShowCompatibleModal" :tid="issueInfo.project_id"
                     :sid="issueInfo.subtask_id" :info="issueInfo" :compatibleTargetVersion="curFixPlan?.fix_plan_suggest_version" />
</template>

<script setup lang="ts">
import {
    ref, toRefs, computed,
} from 'vue';
import OtherPlan from './OtherPlan.vue';
import { fixState } from '../composable/use-issue-fix';
import CompatibleModal from './CompatibleModal.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const { issueInfo } = toRefs(fixState);
const isShowCompatibleModal = ref(false);
const {
    loadingMessage, errorMessage, fixRangeDialogVisible,
} = toRefs(fixState.fixRange);

const {
    actions, curFixPlan, checkNoUpdate,
} = toRefs(fixState.fixPlan);

const otherPlanModal = ref(false);
actions.value.getFixPlan();

const checkOtherPlan = () => {
    // eslint-disable-next-line no-unused-expressions
    (!loadingMessage.value && !errorMessage.value) && (otherPlanModal.value = true);
};

const isUpgradeVersion = computed(() => {
    const suggestVersion = curFixPlan.value.fix_plan_suggest_version;
    const selectVersion = curFixPlan.value.fix_plan_select_version;
    const currentVersion = issueInfo.value.comp_version;
    if (selectVersion) {
        return !(selectVersion === currentVersion);
    }
    if (suggestVersion) {
        return !(suggestVersion === currentVersion);
    }
    return false;

    // return !((selectVersion && selectVersion === currentVersion) || (suggestVersion && suggestVersion === currentVersion));
});
const isNoUpgradeVersion = computed(() => {
    const suggestVersion = curFixPlan.value.fix_plan_suggest_version;
    const selectVersion = curFixPlan.value.fix_plan_select_version;
    const currentVersion = issueInfo.value.comp_version;
    if (selectVersion) {
        return (selectVersion === currentVersion);
    }
    if (suggestVersion) {
        return (suggestVersion === currentVersion);
    }
    return false;
});

</script>

<style lang="less" scoped>
.no_click {
    @apply  opacity-50;
}

.fix_plan {
    &:hover {
        background-color: #fff;

        .front_icon {
            display: block;
        }
    }

    .front_icon {
        display: none;
        position: absolute;
        right: 24px;
        top: 38px;
    }

    @apply bg-f7 rounded-md box-border py-5 px-6 border border-solid border-[#E7E8EB];
}

.other_plan_btn:hover {
    background-color: #fff;
    color: #3c3c3c !important;
    i {
        transform: translateX(4px);
        transition: transform 0.1s ease;
    }
}

.other_plan_btn i {
    transition: transform 0.1s ease;
}

.disable_other {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>

<style>
.check_no_update.el-checkbox.el-checkbox--large {
    height: auto !important;
}

.check_no_update.el-checkbox.el-checkbox--large .el-checkbox__inner {
    border-radius: 50%;
}
</style>
