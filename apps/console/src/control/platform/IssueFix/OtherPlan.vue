<template>
    <el-dialog @close="emits('update:modelValue', false)" title="其他版本方案" width="calc(100vw - 80px)" align-center>
        <div class="mt-6 flex gap-6" style="height: calc(100vh - 231px);">
            <div class="w-[420px] h-full">
                <div class="flex items-center justify-between mb-6">
                    <div class="text-[14px] font-medium">修复方案</div>
                    <el-radio-group @change="watchPlanType" text-color="#fff" fill="#2A2C32" class="font-normal"
                                    v-model="planType" size="small">
                        <el-radio-button :label="1" class="!mr-0">推荐选择</el-radio-button>
                        <el-radio-button :label="2" class="!mr-0">已知最新</el-radio-button>
                        <el-radio-button :label="3" class="!mr-0">正在使用</el-radio-button>
                    </el-radio-group>
                </div>

                <div class="overflow-auto" style="height: calc(100% - 76px)">
                    <div :class="{ 'active_item': selectVersion === item.version, [item.version]: true }"
                         @click="changeVersionHandle(item.version)" v-for="item in currentPageData" :key="item.version"
                         class="rounded cursor-pointer hover:bg-eb px-4 mb-3 py-3 border border-solid bg-[#EBEBEB80] border-[#EBEBEB]">
                        <div class="mb-1 version font-medium flex items-center">
                            <span class="mr-1">{{ item.version }}</span>
                            <Tooltip content="达成该修复目标推荐升级版本"
                                     v-if="item.version === versionKind.fix_plan_suggest_version">
                                <TagComp :c="selectVersion === item.version ? '#2946C7' : '#3C3C3C'"
                                         :bgc="selectVersion === item.version ? '#4966E633' : '#C7C7C799'" content="推荐选择"
                                         class="ml-1 font-normal" />
                            </Tooltip>

                            <Tooltip content="目前该组件已知的最新版本" v-if="item.version === versionKind.latest_version">
                                <TagComp :c="'#3C3C3C'" :bgc="'#C7C7C799'" content="已知最新" class="ml-1 font-normal" />
                            </Tooltip>

                            <Tooltip content="项目中正在使用的缺陷组件版本" v-if="item.version === versionKind.comp_version">
                                <TagComp :c="'#3C3C3C'" :bgc="'#C7C7C799'" content="正在使用" class="ml-1 font-normal" />
                            </Tooltip>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="text-85 text-xs">
                                {{ item.release_date || '暂无发布时间' }}
                            </div>
                            <div class="flex gap-1 vuln_level">
                                <span :class="{ 'tag-disabled': !item.vuln_summary.critical_vulns }"
                                      class="bg-[#F54A4533] text-[#F34D3D]">{{ item.vuln_summary.critical_vulns
                                      }}</span>
                                <span :class="{ 'tag-disabled': !item.vuln_summary.high_vulns }"
                                      class="bg-[#FF994033] text-[#FF9940]">{{ item.vuln_summary.high_vulns }}</span>
                                <span :class="{ 'tag-disabled': !item.vuln_summary.medium_vulns }"
                                      class="bg-[#FFCC3333] text-[#FCBE03]">{{ item.vuln_summary.medium_vulns }}</span>
                                <span :class="{ 'tag-disabled': !item.vuln_summary.low_vulns }"
                                      class="bg-[#A7AECC33] text-[#A7AECC]">{{ item.vuln_summary.low_vulns }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 分页 -->
                <PageComp style="margin-top: 16px;" :background="false" :total="versionList.length"
                          :current-page="currentPage" :page-size="pageSize" @current-change="handlePageChange" />
            </div>

            <div class="flex-1">
                <div class="text-[14px] mb-2 font-medium flex justify-between">
                    修复效果
                    <div @click="allVulnModal = true" class="font-normal button-text-blue">
                        <i class="murphy icon-loudong" style="font-size: 14px;"></i>
                        当前版本漏洞情况
                    </div>
                </div>

                <div style="height: calc(100% - 76px);" class="rounded p-6 bg-f7">
                    <div class="mb-4 flex items-center justify-between">
                        <div>
                            目标漏洞中可修复 {{ curVersionInfo.fixed_vulns?.length }} 个漏洞 ，无法修复 {{
                                curVersionInfo.unfixed_vulns?.length }} 个漏洞
                        </div>
                        <el-button v-if="selectVersion === versionKind.fix_plan_suggest_version"
                                   @click="isShowCompatibleModal = true" class="minor_btn w-auto h-8">兼容性分析</el-button>
                    </div>

                    <div class="overflow-auto" style="height: calc(100% - 66px);">
                        <div class="repair mb-2 py-4 px-6 rounded-md bg-ff">
                            <div @click="upgradeFixedVulns.length && (expandRepair = !expandRepair)"
                                 class="flex font-medium items-center justify-between">
                                升级版本解决 {{ upgradeFixedVulns.length }} 个漏洞

                                <div class="flex cursor-pointer font-normal expand_i" v-if="upgradeFixedVulns.length">
                                    {{ expandRepair ? '收起详情' : '查看详情' }}
                                    <ExpandIcon class="ml-2" :type="'t'" :expand="expandRepair" />
                                </div>

                            </div>
                            <div class="mt-4" v-show="expandRepair">
                                <VulnItem v-for="(item, i) in upgradeFixedVulns" :key="i" :info="item.info" />
                            </div>
                        </div>

                        <div class="repair mb-2 py-4 px-6 rounded-md bg-ff">
                            <div @click="nonUpgradeFixedVulns?.length && (expandNoUpdateRepair = !expandNoUpdateRepair)"
                                 class="flex font-medium items-center justify-between">
                                非升级版本解决 {{ nonUpgradeFixedVulns?.length }} 个漏洞

                                <div class="flex cursor-pointer font-normal expand_i"
                                     v-if="nonUpgradeFixedVulns?.length">
                                    {{ expandNoUpdateRepair ? '收起详情' : '查看详情' }}
                                    <ExpandIcon class="ml-2" :type="'t'" :expand="expandNoUpdateRepair" />
                                </div>
                            </div>
                            <div class="mt-4" v-show="expandNoUpdateRepair">
                                <VulnItem v-for="(item, i) in nonUpgradeFixedVulns" :key="i" :info="item.info" />
                            </div>
                        </div>

                        <div class="un_repair mb-2 py-4 px-6 rounded-md bg-ff">
                            <div @click="curVersionInfo.unfixed_vulns?.length && (expandNotReapir = !expandNotReapir)"
                                 class="flex font-medium items-center justify-between">
                                无法修复 {{ curVersionInfo.unfixed_vulns?.length }} 个漏洞

                                <div class="flex cursor-pointer font-normal expand_i"
                                     v-if="curVersionInfo.unfixed_vulns?.length">
                                    {{ expandNotReapir ? '收起详情' : '查看详情' }}
                                    <ExpandIcon class="ml-2" :type="'t'" :expand="expandNotReapir" />
                                </div>
                            </div>
                            <div class="mt-4" v-show="expandNotReapir">
                                <VulnItem v-for="(item, i) in curVersionInfo.unfixed_vulns" :key="i"
                                          :info="item.info" />
                            </div>
                        </div>
                        <!-- <div class="all_vuln py-4 px-6 rounded-md bg-ff">
                            <div class="flex font-medium items-center justify-between">
                                组件版本漏洞 {{ curVersionInfo.all_vulns?.length }} 个
                            </div>
                            <div v-if="curVersionInfo.all_vulns?.length" class="mt-4">
                                <VulnItem v-for="(item, i) in curVersionInfo.all_vulns" :key="i" :info="item.info" />
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>

        <CompatibleModal v-model="isShowCompatibleModal" v-if="isShowCompatibleModal"
                         :tid="fixState.issueInfo.project_id" :sid="fixState.issueInfo.subtask_id" :info="fixState.issueInfo"
                         :compatibleTargetVersion="selectVersion" />

        <template v-if="!$route.path.includes('issue-report') && !$route.path.includes('share-report')" #footer>
            <div class="w-full flex justify-end items-center">
                <div class="text-85 mr-4">已选：{{ selectVersion }}</div>
                <el-button @click="submitVersionChange(); emits('update:modelValue', false)"
                           class="h-auto w-20">应用方案</el-button>
            </div>
        </template>

        <el-dialog v-model="allVulnModal" align-center title="当前版本漏洞情况" width="840px">
            <div class="text-85 text-sm my-6 mb-3 flex items-center justify-between h-[18px]">
                <span>
                    共 <span class="text-3c">{{ curVersionInfo.all_vulns?.length }}</span> 条数据
                </span>

                <div class="flex gap-1 vuln_level">
                    <span :class="{ 'tag-disabled': !selectVersionVulnNum.critical }"
                          class="bg-[#F54A4533] text-[#F34D3D]">{{
                              selectVersionVulnNum.critical
                          }}</span>
                    <span :class="{ 'tag-disabled': !selectVersionVulnNum.high }"
                          class="bg-[#FF994033] text-[#FF9940]">{{
                              selectVersionVulnNum.high }}</span>
                    <span :class="{ 'tag-disabled': !selectVersionVulnNum.medium }"
                          class="bg-[#FFCC3333] text-[#FCBE03]">{{
                              selectVersionVulnNum.medium }}</span>
                    <span :class="{ 'tag-disabled': !selectVersionVulnNum.low }"
                          class="bg-[#A7AECC33] text-[#A7AECC]">{{
                              selectVersionVulnNum.low }}</span>
                </div>
            </div>
            <div class="max-h-[500px] overflow-auto all_vuln">
                <VulnItem v-for="(item, i) in curVersionInfo.all_vulns" :key="i" :info="item.info" />
                <NoData v-if="!curVersionInfo.all_vulns?.length" />
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script setup lang="ts">
import PageComp from '@/components/PageComp.vue';
import VulnItem from '../comp/VulnItem.vue';
import CompatibleModal from './CompatibleModal.vue';
import { useIssueFixPlan, fixState } from '../composable/use-issue-fix';

const emits = defineEmits(['update:modelValue']);
const {
    planType,
    selectVersion,
    currentPage,
    pageSize,
    versionList,
    currentPageData,
    expandRepair,
    expandNoUpdateRepair,
    expandNotReapir,
    versionKind,
    curVersionInfo,
    isShowCompatibleModal,
    upgradeFixedVulns,
    nonUpgradeFixedVulns,
    allVulnModal,
    selectVersionVulnNum,
    watchPlanType,
    handlePageChange,
    changeVersionHandle,
    submitVersionChange,
} = useIssueFixPlan();

</script>

<style>
.el-radio-button__inner {
    color: #858585;
    font-weight: 400;
}

.el-radio-button__inner:hover {
    color: #858585;
}

.vuln_level {
    span {
        transform: scale(0.8);
        border-radius: 2px;
        padding: 1px 5px;
    }
}

.active_item {
    border-color: #6C87FF;
    background-color: #6C87FF1A !important;

    .version {
        color: #6C87FF;
    }
}

.tag-disabled {
    background-color: #EBEBEB !important;
    color: #c7c7c7 !important;
}

.repair {
    border-left: 4px solid #38C728;

    .item {
        margin-left: 0;
    }
}

.un_repair {
    border-left: 4px solid #C7C7C7;

    .item {
        margin-left: 0;
    }
}

.all_vuln .item {
    margin-left: 0;
}

.expand_i {
    &:hover {
        color: #6C87FF;
        i {
            color: #6C87FF;

        }
    }
}
</style>
