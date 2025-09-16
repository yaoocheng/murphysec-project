<template>
    <el-dialog @close="emits('update:modelValue', false); actions.getFixRange()" title="调整目标范围" width="776px"
               align-center>
        <div class="mt-6">
            <div class="text-85 mt-[-16px] mb-6">
                选择不同的标签可以快速调整修复目标范围，如需针对特定漏洞实施精准修复，请选择「自定义」标签
            </div>
            <div class="flex items-center mb-6">
                <div @click="handleAllRangeClick"
                     class="px-6 py-[9px] mr-4 border border-solid border-transparent rounded  bg-[#EBEBEB80] cursor-pointer relative"
                     :class="{ 'active': checkAllRange }">
                    <div class="absolute top-0 rounded-tr rounded-bl right-0 w-4 h-4 flex items-center justify-center text-white text-xs"
                         :class="checkAllRange ? 'bg-primary' : 'bg-[#2A2C32]'">
                        <span style="transform: scale(.8);">默</span>
                    </div>
                    全部
                </div>

                <div class="flex items-center mr-2 px-6 py-[9px] border border-solid border-transparent bg-[#EBEBEB80] rounded cursor-pointer"
                     v-for="item in levelList" :key="item.value" :class="{ 'active_level': item.checked }"
                     @click="toggleLevel(item)">
                    <el-checkbox class="h-auto" @change="toggleLevel(item)" v-model="item.checked"></el-checkbox>
                    <span class="text-sm ml-1.5">{{ item.label }}</span>
                </div>

                <div @click="handleCustomRangeClick"
                     class="px-6 py-[9px] ml-2 box-border border border-solid border-transparent rounded bg-[#EBEBEB80] cursor-pointer relative"
                     :class="{ 'active': checkCustomRange }">
                    自定义
                </div>
            </div>

            <div class="text-3c font-medium mb-1">
                目标预期效果：
            </div>
            <div v-if="checkAllRange" class="text-85">
                修复后不会存在任何漏洞
            </div>
            <div v-if="levelList.some((item) => item.checked)" class="text-85">
                修复后不会存在以下等级的漏洞：
                <TagComp class="mr-1" :content="item.label" bgc="#C7C7C799" c="#3c3c3c"
                         v-for="item in levelList.filter(a => a.checked)" :key="item.label" />
            </div>
            <div v-if="checkCustomRange" class="text-85 flex items-center">
                修复后不会存在选中的漏洞 &nbsp;
                <TagComp class="mr-1" :content="item.full_vuln_data?.cve_id || item.full_vuln_data?.mps_id"
                         bgc="#C7C7C799" c="#3c3c3c" v-for="item in showSelectVulnIds" :key="item.full_vuln_data?.mps_id" />
                <span v-if="selectedVulns.length > 4">等{{
                    selectedVulns.length }}个漏洞</span>
            </div>

            <!-- <div class="text-3c mt-6" v-if="checkAllRange || levelList.some((item) => item.checked)">
                系统将根据已选目标范围生成漏洞修复方案
            </div> -->

            <div v-if="checkCustomRange">
                <div class="flex my-6 mb-4">
                    <SearchComp class="flex-1" v-model="searchKeyword" clearable placeholder="请输入完整的漏洞编号搜索" />
                </div>

                <div style="max-height: calc(100vh - 458px)" class="overflow-auto">
                    <div v-for="(item, key) in filteredVulnList" :key="key" class="flex items-center">
                        <el-checkbox v-model="item.checked" @change="handleVulnSelect(item)"></el-checkbox>
                        <!-- <div class="item flex-1 ml-3">
                            <div class="top">
                                <div class="part_info">
                                    <a class="hover_text g-f-14 g-fw-500 g-color-1 g-mr-4"
                                        :href="generateVulnLink(item.mps_id, item.cve_id)" target="_blank">
                                        {{ item.full_vuln_data.title }}
                                    </a>
                                    <TagComp class="g-mr-4" content="CVE未收录漏洞" v-if="!item?.full_vuln_data?.cve_id">
                                    </TagComp>
                                    <TagComp class="g-mr-4" content="独家漏洞" v-if="item?.full_vuln_data?.is_sole">
                                    </TagComp>
                                    <TagComp content="投毒组件" v-if="item?.full_vuln_data?.cwe_id === 'CWE-506'"></TagComp>
                                    <TagComp bgc="#14C0FF33" c="#049FD7" class="g-mr-4"
                                        v-if="item?.full_vuln_data?.cavd_id" :content="'CAVD漏洞'" />
                                </div>
                            </div>

                            <div class="bottom">
                                <div class="part_info">
                                    编号
                                    <span class="info">{{ item?.full_vuln_data?.cve_id || item?.full_vuln_data?.mps_id
                                        }}</span>
                                </div>

                                <div class="part_info">
                                    POC
                                    <span class="info">{{ item?.full_vuln_data?.poc ? '有' : '无' }}</span>
                                </div>

                                <div class="part_info">
                                    利用成本
                                    <span class="info">{{ item?.full_vuln_data?.exploit_requirement_cost || '暂无'
                                        }}</span>
                                </div>

                                <div class="part_info">
                                    影响范围
                                    <span class="info">{{ item?.full_vuln_data?.scope_influence || '暂无' }}</span>
                                </div>

                                <div class="part_info">
                                    可触发漏洞
                                    <span class="info">{{ item?.full_vuln_data?.is_triggers ? '是' : '否' }}</span>
                                </div>
                            </div>
                        </div> -->
                        <VulnItem :info="item.full_vuln_data" />
                    </div>

                    <NoData v-if="!filteredVulnList.length" description="暂无数据" />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex items-center justify-between">
                <div :class="{ 'opacity-0': !checkCustomRange }">已选择 {{ selectedVulns.length }}/{{ vulnTotal }}</div>
                <div>
                    <el-button class="minor_white_btn h-auto w-20"
                               @click="emits('update:modelValue', false); actions.getFixRange()">取消</el-button>
                    <el-button :disabled="disabledBtn"
                               @click="handleConfirmRange(() => emits('update:modelValue', false));"
                               class="h-auto w-20">确认</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';
import VulnItem from '../comp/VulnItem.vue';
import { fixState, useIssueFixRange } from '../composable/use-issue-fix';

const emits = defineEmits(['update:modelValue']);
const { actions } = toRefs(fixState.fixRange);

const {
    checkAllRange,
    checkCustomRange,
    levelList,
    searchKeyword,
    filteredVulnList,
    selectedVulns,
    vulnTotal,
    handleAllRangeClick,
    handleCustomRangeClick,
    toggleLevel,
    handleVulnSelect,
    handleConfirmRange,
    initFixRangeSelection,
} = useIssueFixRange();

// 回显
initFixRangeSelection();

const disabledBtn = computed(() => (checkCustomRange.value && !selectedVulns.value.length) || (!checkAllRange.value && !levelList.value.some((item) => item.checked) && !checkCustomRange.value));

const showSelectVulnIds = computed(() => {
    const arr = filteredVulnList.value.filter((ele) => selectedVulns.value.includes(ele.mps_id));
    return arr.slice(0, 4);
});
</script>

<style lang="less" scoped>
.active {
    border: 1px solid #6C87FFCC;
    background-color: #f1f3ff;
    color: var(--el-color-primary);
}

.active_level {
    border: 1px solid #6C87FFCC;
    background-color: #f1f3ff;
}

.item {
    height: 84px;
    padding: 16px;
    padding-left: 0;
    box-sizing: border-box;
    background-color: #F7F8FB;
    margin-bottom: 8px;
    border-radius: 4px;

    .tag {
        padding: 3px 6px;
        // background: #34C72433;
        border-radius: 4px;
        display: inline-block;
        font-size: 12px;
        // color: #2EA121;
        font-weight: 500;
        transform: scale(0.8);
        margin-left: -6px;

        i {
            font-size: 12px;
            margin-right: 5px;
        }
    }

    .info {
        font-size: 14px;
        color: #3c3c3c;
        // font-weight: 500;
        display: inline-block;
        vertical-align: -3px;
    }

    .top,
    .bottom {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        color: #8F959E;
    }

    .bottom {
        font-size: 12px;
    }

    .comp-tag .tag {
        margin-left: -8px;
    }

    .part_info {
        margin-left: 16px;

        .tag {
            margin-right: -0;
            color: #2946C7 !important;
            background-color: #4966E633 !important;
        }

        .info {
            margin-left: 4px
        }

        .center();

        a {
            color: @text-color;
        }

        a:hover {
            color: #6c87ff;
            text-decoration: underline;
        }
    }
}
</style>
