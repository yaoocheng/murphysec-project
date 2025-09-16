<template>
    <div class="main-content flex flex-col gap-[16px] overflow-y-auto">
        <!-- 头部区域：按照优化需求实现 -->
        <div class="header-section bg-white p-[24px] rounded-[4px] shadow-sm">
            <!-- 主要内容区域：左侧信息 + 右侧CRI卡片 -->
            <div class="header-main-content flex items-center gap-[24px]">
                <!-- 左侧：标题和状态信息 -->
                <div class="header-left-content flex-1 w-0">
                    <!-- 标题和等级 -->
                    <div class="title-wrapper flex items-center gap-[12px] mb-[16px]">
                        <div class="issue-level-container">
                            <div class="priority-tag-container" :class="getPriorityContainerClass(taskInfo.priority)">
                                <span class="priority-tag-text" :style="getPriorityTextStyle(taskInfo.priority)">
                                    {{ getPriorityText(taskInfo.priority) }}
                                </span>
                            </div>
                        </div>
                        <div class="text-[22px] font-bold flex-1 w-0 text-[#222] leading-[1.3] flex items-center">
                            <div class="truncate max-w-[80%]">{{ taskInfo.title }}</div>

                            <div class="cri-reduction-card rounded-3">
                                <a-tooltip placement="left" overlay-class-name="cri-tooltip" :arrow="{ pointAtCenter: true }" :align="{ offset: [-20, 0] }">
                                    <template #title>
                                        <div v-html="getCriTooltipText(taskInfo.cri_reduction)"></div>
                                    </template>
                                    <div class="cri-reduction-content flex items-center">
                                        <Svg name="reduce" width="15" height="15" color="#059669"></Svg>
                                        <div class="cri-reduction-text flex items-center">
                                            <div class="cri-reduction-label">CRI预计降低：</div>
                                            <div class="cri-reduction-value">{{ formatCriReduction(taskInfo.cri_reduction) }}</div>
                                        </div>
                                    </div>
                                </a-tooltip>
                            </div>

                            <!-- <tag :text="getStatusText(taskInfo.status)" :cssClass="{ background: '#F2F2F2', fontSize: '12px', padding: '0 6px', height: '24px', color: '#3C3C3C' }" /> -->
                        </div>

                    </div>

                    <!-- 四个信息并排显示 -->
                    <div class="status-info-row flex items-center flex-wrap gap-[48px]">
                        <div class="status-info-item">
                            <span class="info-label">处置状态:</span>
                            <span class="info-value" :class="getStatusClass(taskInfo.status)">
                                <span v-if="taskInfo.status === undefined" class="status-icon">⚠️</span>
                                {{ getStatusText(taskInfo.status) }}
                            </span>
                            <!-- <span class="edit-icon ml-[8px] cursor-pointer" @click="showStatusModal">
                                <EditOutlined style="font-size: 14px; color: #8c8c8c;" />
                            </span> -->
                        </div>
                        <div class="status-info-item">
                            <span class="info-label">负责人:</span>
                            <span class="info-value" :class="{ 'unassigned': !taskInfo.assignee_name }">
                                {{ taskInfo.assignee_nick_name || '未指派' }}
                            </span>
                            <span class="edit-icon ml-[8px] cursor-pointer" @click="showAssigneeModal">
                                <EditOutlined style="font-size: 14px; color: #8c8c8c;" />
                            </span>
                        </div>
                        <div class="status-info-item">
                            <span class="info-label">创建时间:</span>
                            <span class="info-value text-[#595959]">{{ formatDate(taskInfo.created_at) || '-' }}</span>
                        </div>
                        <div class="status-info-item">
                            <span class="info-label">更新时间:</span>
                            <span class="info-value text-[#595959]">{{ formatDate(taskInfo.updated_at) || '-' }}</span>
                        </div>
                    </div>
                </div>

                <!-- 右侧：CRI 降低信息显示 -->
                <div v-if="taskInfo.cri_reduction" class="header-right-content flex-shrink-0">
                    <div class="flex items-center justify-end gap-2 ">

                        <div class="figma-button-share" @click="showShareModal">
                            <Svg class="cursor-pointer" name="ShareOutline" width="14" height="14"></Svg>
                            分享
                        </div>

                        <a-tooltip v-if="taskInfo.status==='close'" title="已关闭的任务不可修改状态">
                            <div class="figma-button-status" :class="taskInfo.status==='close'?'figma-button-status-disabled':'figma-button-status-active'" @click="()=>{taskInfo.status!=='close'&&showStatusModal()}">
                                <EditOutlined style="font-size: 14px;" />
                                处置状态
                            </div>
                        </a-tooltip>
                        <div v-else class="figma-button-status figma-button-status-active" @click="()=>{taskInfo.status!=='close'&&showStatusModal()}">
                            <EditOutlined style="font-size: 14px;" />
                            处置状态
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- 影响范围部分 -->
        <div class="impact-section bg-white p-[24px] rounded-[4px] shadow-sm">
            <div class="section-heading mb-[20px] text-[18px] font-medium text-[#1f2329] border-l-[3px] border-[#6C87FF] pl-[10px] flex items-center justify-between">
                <span>受影响的载体与组件</span>
            </div>
            <div class="section-container">
                <!-- 载体信息 -->
                <div v-if="hasAffectedCarrier" class="module-section mb-[28px]">
                    <div class="module-title mb-[16px] text-[15px] font-medium text-[#262626] flex items-center">
                        载体信息
                    </div>
                    <div class="pl-[26px]">
                        <div class="carrier-content bg-[#f9f9fa] p-[12px] rounded-[4px]">
                            <div class="flex items-center">
                                <!-- 根据类型显示不同的图标 -->
                                <span v-if="taskInfo.affected_carrier?.carrier_type === 'code_repo'"
                                      class="carrier-icon flex items-center justify-center bg-[#f0f0f0] rounded-[4px] w-[28px] h-[28px] mr-[10px] flex-shrink-0">
                                    <Svg name="git_repo" height="20" width="20"></Svg>
                                </span>
                                <span v-else-if="taskInfo.affected_carrier?.carrier_type === 'service_address'"
                                      class="carrier-icon flex items-center justify-center bg-[#f0f0f0] rounded-[4px] w-[28px] h-[28px] mr-[10px] flex-shrink-0">
                                    <Svg name="network_service" height="20" width="20"></Svg>
                                </span>
                                <span v-else-if="taskInfo.affected_carrier?.carrier_type === 'host'"
                                      class="carrier-icon flex items-center justify-center bg-[#f0f0f0] rounded-[4px] w-[28px] h-[28px] mr-[10px] flex-shrink-0">
                                    <Svg name="host" height="20" width="20"></Svg>
                                </span>
                                <span v-else
                                      class="carrier-icon flex items-center justify-center bg-[#f0f0f0] rounded-[4px] w-[28px] h-[28px] mr-[10px] flex-shrink-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
                                            fill="#909090" />
                                    </svg>
                                </span>
                                <div class="carrier-name text-[14px] font-medium text-[#262626] font-mono">
                                    {{ taskInfo.affected_carrier?.name || '未知载体' }}
                                </div>
                            </div>
                            <div v-if="taskInfo.affected_carrier?.carrier_type" class="flex items-center mt-[8px] ml-[34px]">
                                <a-tag
                                    class="carrier-type-tag bg-[#f5f7fa] border-[#e8e8e8] text-[#595959] px-[8px] py-[4px]">
                                    {{ getCarrierTypeLabel(taskInfo.affected_carrier?.carrier_type) }}
                                </a-tag>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 软件成分 -->
                <div v-if="hasAffectedComponent" class="module-section mb-[28px]">
                    <div class="module-title mb-[16px] text-[15px] font-medium text-[#262626] flex items-center">
                        软件成分
                    </div>
                    <div class="pl-[26px]">
                        <div class="carrier-content bg-[#f9f9fa] p-[12px] rounded-[4px]">
                            <div class="flex items-center">
                                <span class="carrier-icon flex items-center justify-center bg-[#f0f0f0] rounded-[4px] w-[28px] h-[28px] mr-[10px] flex-shrink-0">
                                    <BlockOutlined style="font-size: 20px; color: #909090;" />
                                </span>
                                <div class="carrier-name text-[14px] font-medium text-[#262626] font-mono">
                                    {{ taskInfo.affected_component?.component_name }}
                                    <span v-if="taskInfo.affected_component?.component_version"
                                          class="text-[12px] text-[#8c8c8c] ml-[4px] font-normal">
                                        {{ taskInfo.affected_component.component_version }}
                                    </span>
                                </div>
                            </div>
                            <div v-if="taskInfo.affected_component?.asset_type" class="flex items-center mt-[8px] ml-[34px]">
                                <a-tag
                                    class="carrier-type-tag bg-[#f5f7fa] border-[#e8e8e8] text-[#595959] px-[8px] py-[4px]">
                                    {{ findSoftwareComponentCategoryLabel(taskInfo.affected_component?.asset_type) }}
                                </a-tag>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 无数据展示 -->
                <div v-if="!hasAffectedData"
                     class="no-data-container py-[24px] px-[16px] text-center bg-[#f9f9fa] rounded-[4px]">
                    <InfoCircleOutlined style="font-size: 36px; color: #d9d9d9;" class="inline-block mb-[8px]" />
                    <div class="no-data text-[13px] text-[#8c8c8c]">暂无影响范围数据</div>
                </div>
            </div>
        </div>

        <!-- 关联安全问题部分 -->
        <div class="issues-section bg-white p-[24px] rounded-[4px] shadow-sm">
            <div class="section-heading mb-[20px] text-[18px] font-medium text-[#1f2329] border-l-[3px] border-[#6C87FF] pl-[10px]">
                关联安全问题与处置优先级

                <TextPopover placement="right" text="用于反映风险处置任务的处置优先级，通过关联安全问题的风险等级及影响范围等因素综合评估得出">
                    <Svg name="icon_issue" class="ml-1" style="width:16px;height:16px;"></Svg>
                </TextPopover>
            </div>
            <div class="section-container">
                <!-- 综合处置优先级展示 -->
                <div v-if="taskInfo.priority === 'strongRecommend'"
                     class="priority-section mb-[24px] h-12 flex items-center px-6 rounded-[3px] w-full"
                     style="background: linear-gradient(274.85deg, rgba(255, 102, 247, 0.1) 0%, rgba(255, 108, 110, 0.1) 100%);">
                    <div class="flex items-center justify-between gap-[12px] w-full">
                        <div class="text-[15px] font-medium leading-[1.5em] flex-1"
                             style="background: linear-gradient(274.85deg, #D50004 0%, #FF4C50 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            基于关联安全问题的相关信息，综合判定优先级为"强烈建议修复"，请立即处理
                        </div>
                        <div class="h-auto py-[3px] px-3 rounded-[3px] border border-solid flex items-center justify-center"
                             style="border-color: #ff4c5059; background: linear-gradient(274.85deg, rgba(255, 76, 80, 0.1) 0%, rgba(213, 0, 4, 0.1) 100%);">
                            <span class="text-[14px] font-medium leading-[1.5em] whitespace-nowrap"
                                  style="background: linear-gradient(274.85deg, #FF4C50 0%, #D50004 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                                强烈建议修复
                            </span>
                        </div>
                    </div>
                </div>

                <div v-else-if="taskInfo.priority === 'recommend'"
                     class="priority-section box-border mb-[24px] h-12 flex items-center px-[24px] rounded-[3px] w-full"
                     style="background: linear-gradient(274.85deg, rgba(255, 133, 102, 0.1) 0%, rgba(255, 177, 108, 0.1) 100%);">
                    <div class="flex items-center gap-[12px] w-full">
                        <div class="text-[15px] font-medium leading-[1.5em] flex-1"
                             style="background: linear-gradient(135deg, #D56300 0%, #FFA04C 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'PingFang SC', sans-serif;">
                            基于关联安全问题的相关信息，综合判定优先级为"建议修复"，请排期处理
                        </div>
                        <div class="py-[3px] px-[12px] rounded-[3px] border flex items-center justify-center"
                             style="border: 1px solid; border-color: #ffa04c54; background: linear-gradient(274.85deg, rgba(255, 160, 76, 0.1) 0%, rgba(213, 99, 0, 0.1) 100%);;">
                            <span class="text-[14px] font-medium leading-[1.5em] whitespace-nowrap"
                                  style="background: linear-gradient(135deg, #D56300 0%, #FFA04C 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'PingFang SC', sans-serif;">
                                建议修复
                            </span>
                        </div>
                    </div>
                </div>

                <div v-else class="priority-section box-border mb-[24px] h-12 flex items-center px-[24px] rounded-[3px]"
                     style="background: linear-gradient(274.85deg, rgba(255, 250, 102, 0.1) 0%, rgba(255, 218, 108, 0.1) 100%);">
                    <div class="flex items-center gap-[12px] w-full">
                        <div class="text-[15px] font-medium leading-[1.5em] flex-1"
                             style="background: linear-gradient(274.85deg, #D5A000 0%, #FFCC33 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'PingFang SC', sans-serif;">
                            基于关联安全问题的相关信息，综合判定优先级为"可选修复"，请酌情处理
                        </div>
                        <div class="py-[3px] px-[12px] rounded-[3px] border flex items-center justify-center"
                             style="border: 1px solid; border-color: #ffcc3354; background: linear-gradient(274.85deg, rgba(255, 204, 51, 0.1) 0%, rgba(213, 160, 0, 0.1) 100%);">
                            <span class="text-[14px] font-medium leading-[1.5em] whitespace-nowrap"
                                  style="background: linear-gradient(274.85deg, #FFCC33 0%, #D5A000 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'PingFang SC', sans-serif;">
                                可选修复
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 关联安全问题列表 -->
                <div v-if="relatedIssues.length > 0" class="issues-list">
                    <div v-for="issue in relatedIssues" :key="issue.issue_id"
                         class="issue-item p-[16px] border border-[#e6e6e6] rounded-[4px] hover:shadow-sm transition-shadow mb-[16px] last:mb-0">
                        <!-- 问题头部 -->
                        <div class="issue-header flex items-start justify-between mb-2">
                            <div class="issue-title-wrapper flex items-center gap-[8px] flex-1">
                                <SecIssueLevel :text="issue.issue_level" size="small" />
                                <span class="issue-title text-[16px] font-medium text-blue-600 cursor-pointer hover:underline"
                                      @click="goToIssueDetail(issue.issue_id)">
                                    {{ issue.issue_title }}
                                </span>
                            </div>
                        </div>
                        <div class="issue-meta flex items-center gap-[16px] text-[13px] mb-2 text-[#8c8c8c]">
                            <span>漏洞数: {{ issue.vuln_count || 0 }}</span>
                            <span>处置状态：{{ getIssueStatusText(issue.issue_status) }}</span>
                            <div class="issue-owner">
                                负责人: {{ issue.issue_owner_nick_name || '未指派' }}
                            </div>
                            <div class="issue-times flex items-center gap-[16px]">
                                <span>发现时间: {{ formatDate(issue.discovery_at) || '-' }}</span>
                                <span>创建时间: {{ formatDate(issue.created_at) || '-' }}</span>
                            </div>
                        </div>

                        <!-- 问题描述 -->
                        <div class="issue-description mb-[12px]">
                            <div class="text-[14px] text-[#595959] leading-[20px] line-clamp-2">
                                {{ issue.issue_desc || '暂无描述' }}
                            </div>
                        </div>

                        <!-- 问题底部信息 -->
                        <!-- <div class="issue-footer flex items-center justify-between text-[13px] text-[#8c8c8c]">
                            <div class="issue-owner">
                                负责人: {{ issue.issue_owner_nick_name || '未指派' }}
                            </div>
                            <div class="issue-times flex items-center gap-[16px]">
                                <span>发现时间: {{ formatDate(issue.discovery_at) || '-' }}</span>
                                <span>创建时间: {{ formatDate(issue.created_at) || '-' }}</span>
                            </div>
                        </div> -->
                    </div>
                </div>
                <div v-else class="text-center text-[#999] py-[40px]">
                    暂无关联安全问题
                </div>
            </div>
        </div>

        <!-- 处置方案部分 -->
        <div class="solution-section bg-white p-[24px] rounded-[4px] shadow-sm mb-[16px]">
            <div class="section-heading mb-[20px] text-[18px] font-medium text-[#1f2329] border-l-[3px] border-[#6C87FF] pl-[10px]">
                如何快速完成风险处置
            </div>
            <div class="section-container">
                <!-- 代码片段与修复建议 -->
                <div v-if="parsedCodeExample" class="code-diff-section mb-[20px]">
                    <CodeDiffViewer :vulnerable-code="parsedCodeExample.vulnerable_code"
                                    :fixed-code="parsedCodeExample.fixed_code"
                                    :language="parsedCodeExample.language"
                                    theme="light" max-height="400px" />
                </div>

                <div class="disposal-plan" v-if="taskInfo.solution">
                    <div class="bg-[#f9f9fa] p-[16px] rounded-[4px]">
                        <MarkDown :text="taskInfo.solution || '-'" />
                    </div>
                </div>
                <div v-else class="no-data py-[24px] text-center bg-[#f9f9fa] rounded-[4px]">
                    <InfoCircleOutlined style="font-size: 36px; color: #d9d9d9;" class="inline-block mb-[8px]" />
                    <div class="text-[13px] text-[#8c8c8c]">暂无处置方案</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 处置状态编辑模态框 -->
    <a-modal v-model:visible="statusModalVisible" title="处置状态" @ok="handleStatusUpdate">
        <a-select class="w-full" v-model:value="selectedStatus" :options="STATUS_OPTIONS" />
    </a-modal>

    <!-- 负责人编辑模态框 -->
    <a-modal v-model:visible="assigneeModalVisible" title="修改负责人" @ok="handleAssigneeUpdate">
        <div class="mb-4">
            <div class="mb-2 text-sm font-medium">负责人</div>
            <UserSelect
                v-if="assigneeModalVisible"
                class="w-full user-select"
                v-model:value="selectedAssignee"
                :popupClassName="'user-select-dropdown'"
                placeholder="请搜索并选择负责人"
                :showSearch="true"
                :userid="selectedAssignee"
            />
        </div>
    </a-modal>

    <!-- 分享模态框 -->
    <a-modal
        v-model:visible="shareModalVisible"
        title="处置任务分享"
        :footer="null"
        width="500px"
        centered
    >
        <div class="share-modal-content">
            <div class="share-info-section mb-6">
                <div class="share-info-item">
                    <span class="share-label">获得链接的人</span>
                    <span class="share-value">需登录后查看任务详情</span>
                </div>
                <div class="share-info-item">
                    <span class="share-label">链接有效期</span>
                    <span class="share-value">永久有效</span>
                </div>
            </div>

            <div class="share-link-section">
                <a-button
                    type="primary"
                    block
                    @click="copyShareLink"
                    class="share-copy-btn"
                >
                    复制链接
                </a-button>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import {
    ref, onBeforeMount, onMounted, computed,
} from 'vue';
import {
    getRiskTaskDetailApi, updateRiskTaskStatusApi, updateRiskTaskAssigneeApi,
} from 'api/app';
import { formatDate } from 'utils';
import { message } from 'ant-design-vue';
import {
    EditOutlined,
    InfoCircleOutlined,
    BlockOutlined,
} from '@ant-design/icons-vue';
import useClipboard from 'vue-clipboard3';

import { findSoftwareComponentCategoryLabel } from 'constants/softwareComponent';
import SecIssueLevel from '@/components/SecIssueLevel.vue';
import Svg from '@/components/Svg.vue';
import MarkDown from '@/components/MarkDown.vue';
import TextPopover from '@/components/TextPopover.vue';
import CodeDiffViewer from '../sec-issue/components/CodeDiffViewer.vue';
import UserSelect from '@/components/UserSelect.vue';

const route = useRoute(); // 获取当前路由信息
const router = useRouter();
const task_id = route.params.id; // 获取路由中的taskId
const { toClipboard } = useClipboard();

const taskInfo = ref({});
const relatedIssues = ref([]);
const dataLoaded = ref(false);

// 处置状态选项
const STATUS_OPTIONS = [
    { value: 'pending', label: '待处置' },
    { value: 'in_progress', label: '处置中' },
    { value: 'completed', label: '已完成' },
];

// 根据代码内容推测编程语言
const getCodeLanguage = (code) => {
    if (!code) return 'text';

    // 检测Java
    if (code.includes('public class') || code.includes('import java.') || code.includes('System.out.println')) {
        return 'java';
    }

    // 检测JavaScript/TypeScript
    if (code.includes('function') || code.includes('const ') || code.includes('let ') || code.includes('var ') || code.includes('console.log')) {
        return 'javascript';
    }

    // 检测Python
    if (code.includes('def ') || code.includes('import ') || code.includes('print(') || code.includes('if __name__')) {
        return 'python';
    }

    // 检测PHP
    if (code.includes('<?php') || code.includes('$') || code.includes('echo ')) {
        return 'php';
    }

    // 检测C/C++
    if (code.includes('#include') || code.includes('int main') || code.includes('printf')) {
        return 'cpp';
    }

    // 检测Go
    if (code.includes('package main') || code.includes('func main') || code.includes('fmt.Println')) {
        return 'go';
    }

    // 检测SQL
    if (code.includes('SELECT') || code.includes('INSERT') || code.includes('UPDATE') || code.includes('DELETE')) {
        return 'sql';
    }

    // 检测Shell
    if (code.includes('#!/bin/bash') || code.includes('#!/bin/sh') || code.includes('echo ')) {
        return 'bash';
    }

    // 检测XML/HTML
    if (code.includes('<') && code.includes('>')) {
        return 'xml';
    }

    // 检测JSON
    if (code.trim().startsWith('{') && code.trim().endsWith('}')) {
        return 'json';
    }

    // 默认返回文本
    return 'text';
};

// 解析代码示例
const parsedCodeExample = computed(() => {
    // 如果有repair_example字段，尝试解析为代码差异显示
    if (!taskInfo.value?.repair_example) {
        return null;
    }

    try {
        // 尝试解析JSON格式的代码示例
        const parsed = JSON.parse(taskInfo.value.repair_example);
        if (parsed?.language && parsed?.vulnerable_code && parsed?.fixed_code) {
            return parsed;
        }
    } catch (error) {
        // 如果不是JSON格式，则作为普通代码处理
        console.log('代码示例不是JSON格式，作为普通代码处理');
    }

    // 如果是普通字符串，创建一个简单的代码示例
    return {
        language: getCodeLanguage(taskInfo.value.repair_example),
        vulnerable_code: '// 修复前\n// 请查看右侧的修复建议',
        fixed_code: taskInfo.value.repair_example,
    };
});

// 计算属性 - 影响范围相关
const hasAffectedCarrier = computed(() => {
    const carrier = taskInfo.value?.affected_carrier;
    return carrier && (carrier.name || carrier.carrier_type || carrier.description);
});

const hasAffectedComponent = computed(() => {
    const component = taskInfo.value?.affected_component;
    return component && component.component_name;
});

const hasAffectedData = computed(() => hasAffectedCarrier.value || hasAffectedComponent.value);

// 获取优先级文本
const getPriorityText = (priority) => {
    switch (priority) {
        case 'strongRecommend':
            return '强烈建议修复';
        case 'recommend':
            return '建议修复';
        case 'optional':
            return '可选修复';
        default:
            return '未知优先级';
    }
};

// 获取优先级容器样式
const getPriorityContainerClass = (priority) => {
    switch (priority) {
        case 'strongRecommend':
            return 'priority-critical';
        case 'recommend':
            return 'priority-high';
        case 'optional':
            return 'priority-medium';
        default:
            return '';
    }
};

// 获取优先级文本样式
const getPriorityTextStyle = (priority) => {
    switch (priority) {
        case 'strongRecommend':
            return {
                background: 'linear-gradient(274.85deg, #D50004 0%, #FF4C50 100%)',
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
                'background-clip': 'text',
            };
        case 'recommend':
            return {
                background: 'linear-gradient(135deg, #D56300 0%, #FFA04C 100%)',
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
                'background-clip': 'text',
                'font-family': 'PingFang SC, sans-serif',
            };
        case 'optional':
            return {
                background: 'linear-gradient(274.85deg, #D5A000 0%, #FFCC33 100%)',
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
                'background-clip': 'text',
                'font-family': 'PingFang SC, sans-serif',
            };
        default:
            return {};
    }
};

// 获取状态文本
const getStatusText = (status) => {
    const statusItem = STATUS_OPTIONS.find((item) => item.value === status);
    return statusItem ? statusItem.label : '未处置';
};

// 获取状态样式类
const getStatusClass = (status) => {
    if (status === undefined) return 'status-warning';
    return 'status-normal';
};

// 获取安全问题状态文本
const getIssueStatusText = (status) => {
    switch (status) {
        case 'open':
            return '未处置';
        case 'processing':
            return '处置中';
        case 'completed':
            return '已完成';
        case 'close':
            return '已关闭';
        default:
            return '未知状态';
    }
};

// 获取载体类型标签
const getCarrierTypeLabel = (type) => {
    if (!type) return '未知类型';

    // 根据类型返回友好的名称
    switch (type) {
        case 'code_repo':
            return '代码仓库';
        case 'service_address':
            return '服务地址';
        case 'host':
            return '主机';
        default:
            return type;
    }
};

// 获取详细信息
async function getTaskDetail() {
    try {
        const response = await getRiskTaskDetailApi(task_id);

        if (response?.data?.data) {
            const { data } = response.data;
            taskInfo.value = data;

            // 处理关联数据
            relatedIssues.value = data.issues || [];

            dataLoaded.value = true;
        }
    } catch (error) {
        console.error('获取任务详情出错:', error);
    }
}

// 跳转到安全问题详情
const goToIssueDetail = (issueId) => {
    router.push(`/sec-issue/detail/${issueId}`);
};

// 格式化CRI降低数值
const formatCriReduction = (value) => {
    if (!value && value !== 0) return '0';

    // 确保保留合适的小数位数
    if (typeof value === 'number') {
        // 如果是整数，直接显示
        if (value % 1 === 0) {
            return value.toString();
        }
        // 如果是小数，保留到第一个非零小数位后2位，最多3位小数
        return value.toFixed(3).replace(/\.?0+$/, '');
    }
    return value.toString();
};

// 获取CRI提示文本
const getCriTooltipText = (value) => {
    const formattedValue = formatCriReduction(value);
    return `CRI 是衡量企业软件安全风险的核心指标，CRI 越低越好，完成此风险处置任务预计降低 <span class="cri-highlight">${formattedValue}</span>`;
};

onBeforeMount(async () => {
    try {
        await getTaskDetail();
    } catch (error) {
        console.error('初始化数据出错:', error);
    }
});

onMounted(() => {
    // 组件挂载完成
});

// 处置状态编辑相关
const statusModalVisible = ref(false);
const selectedStatus = ref(undefined);

// 负责人编辑相关状态
const assigneeModalVisible = ref(false);
const selectedAssignee = ref(undefined);

// 分享相关状态
const shareModalVisible = ref(false);

// 显示状态编辑模态框
const showStatusModal = () => {
    selectedStatus.value = taskInfo.value.status;
    statusModalVisible.value = true;
};

// 处理状态更新
const handleStatusUpdate = async () => {
    try {
        const response = await updateRiskTaskStatusApi({
            id: taskInfo.value.risk_disposal_task_id.toString(),
            status: selectedStatus.value,
        });
        if (response.status === 200) {
            message.success('状态更新成功');
            // 更新成功后重新加载数据
            await getTaskDetail();
            statusModalVisible.value = false;
        }
    } catch (error) {
        console.error('更新处置状态失败:', error);
        message.error('状态更新失败');
    }
};

// 显示负责人编辑模态框
const showAssigneeModal = () => {
    // 参考数据预审页面的处理方式，如果assignee_id为0或空值，设置为undefined
    const assigneeId = taskInfo.value.assignee_id;
    if (assigneeId && assigneeId !== 0 && assigneeId !== '0') {
        selectedAssignee.value = assigneeId.toString();
    } else {
        selectedAssignee.value = undefined;
    }
    assigneeModalVisible.value = true;
};

// 处理负责人更新
const handleAssigneeUpdate = async () => {
    try {
        // 处理边界情况：如果选择了空值或'0'，则不更新
        if (!selectedAssignee.value || selectedAssignee.value === '0') {
            message.warning('请选择负责人');
            return;
        }
        const response = await updateRiskTaskAssigneeApi({
            id: taskInfo.value.risk_disposal_task_id.toString(),
            assignee_id: selectedAssignee.value.toString(),
        });
        if (response.status === 200) {
            message.success('负责人更新成功');
            // 更新成功后重新加载数据
            await getTaskDetail();
            assigneeModalVisible.value = false;
        }
    } catch (error) {
        console.error('更新负责人失败:', error);
        message.error('负责人更新失败');
    }
};

// 显示分享模态框
const showShareModal = () => {
    shareModalVisible.value = true;
};

// 复制分享链接
const copyShareLink = async () => {
    try {
        const currentUrl = window.location.href;
        await toClipboard(currentUrl);
        message.success('链接已复制到剪贴板');
        shareModalVisible.value = false;
    } catch (error) {
        console.error('复制链接失败:', error);
        message.error('复制链接失败');
    }
};
</script>

<style>
.header-section {
    border-bottom: none;
}

.title-wrapper {
    display: flex;
    align-items: center;
}

.issue-level-container {
    flex-shrink: 0;
}

/* 关键状态样式 */
.key-status-item {
    display: flex;
    align-items: center;
}

.info-label {
    color: #606266;
    font-size: 14px;
    margin-right: 8px;
    flex-shrink: 0;
}

.key-status-value {
    font-size: 14px;
    font-weight: 500;
    color: #262626;
    display: flex;
    align-items: center;
}

/* 状态信息项样式 */
.status-info-item {
    display: flex;
    align-items: center;
}

.info-value {
    font-size: 14px;
    font-weight: normal;
    color: #262626;
    display: flex;
    align-items: center;
}

.status-icon {
    margin-right: 4px;
}

.status-warning {
    color: #fa8c16;
}

.unassigned {
    color: #fa8c16;
}

/* 元数据样式 */
.metadata-item {
    display: flex;
    align-items: center;
}

.metadata-label {
    margin-right: 8px;
}

.metadata-value {
    color: #595959;
}

/* 描述区域样式 */
.description-section {
    margin-top: 8px;
}

.description-wrapper {
    position: relative;
    font-size: 14px;
    line-height: 1.6;
    color: #262626;
    word-break: break-word;
}

.description-collapsed {
    max-height: 48px;
    /* 恢复为整数行显示（2行），使截断更加清晰 */
    overflow: hidden;
    position: relative;
}

/* 移除旧的绝对定位按钮样式 */
.expand-actions {
    margin-top: 8px;
}

.expand-btn {
    color: #6C87FF;
    font-size: 13px;
    cursor: pointer;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2px 6px;
    border-radius: 3px;
}

.expand-btn:hover {
    text-decoration: underline;
}

/* 区域标题样式 */
.section-heading {
    position: relative;
    border-left: 3px solid #6C87FF;
    padding-left: 10px;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
}

/* 影响范围样式 - 简洁轻量化设计 */
.impact-scope-container {
    margin-bottom: 24px;
}

/* 模块基础样式 */
.module-section {
    margin-bottom: 28px;
}

.module-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #262626;
    display: flex;
    align-items: center;
}

.module-icon {
    margin-right: 8px;
    flex-shrink: 0;
}

/* 应用信息样式 */
.applications-list {
    padding-left: 26px;
}

.application-item {
    padding: 12px 0;
}

.app-icon {
    flex-shrink: 0;
    margin-right: 8px;
}

.app-name {
    font-size: 14px;
    font-weight: 500;
    color: #262626;
}

.app-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 12px;
    color: #606266;
    margin-left: 12px;
}

/* 展开/收起控制 */
.toggle-apps {
    margin-top: 12px;
}

.toggle-link {
    color: #6C87FF;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.toggle-link:hover {
    text-decoration: underline;
}

/* 载体信息样式 */
.carrier-content {
    padding-left: 26px;
}

.carrier-name {
    font-size: 14px;
    font-weight: 500;
    color: #262626;
}

.carrier-type-tag {
    font-size: 12px;
    color: #595959;
    background-color: #f5f5f5;
    border-color: #e8e8e8;
}

/* 成分信息样式 */
.ingredients-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px 20px;
}

.ingredient-icon {
    flex-shrink: 0;
    margin-right: 6px;
}

.ingredient-name {
    font-size: 13px;
    font-weight: 500;
    color: #262626;
}

.ingredient-version {
    font-size: 12px;
    color: #8c8c8c;
    margin-left: 4px;
}

.ingredient-type {
    font-size: 12px;
    color: #606266;
    margin-left: 20px;
    margin-top: 2px;
}

/* 无数据状态 */
.no-data-container {
    text-align: center;
    padding: 12px 16px;
    margin-bottom: 0;
    /* 减少底部边距 */
}

.no-data {
    color: #606266;
    font-size: 13px;
    margin-top: 6px;
}

/* 通用部分 */
.section-container {
    margin-bottom: 16px;
    /* 从32px减少到16px */
    padding-bottom: 0;
    /* 从16px减少到0 */
}

.section-divider {
    height: 1px;
    background-color: #f0f0f0;
    margin: 40px 0 32px 0;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #1f2329;
}

/* 响应式调整 */
@media (min-width: 768px) {
    .ingredients-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .ingredients-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.no-app-text {
    color: #8c8c8c;
    font-size: 14px;
}

/* 优先级标签样式 */
.priority-tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: white;
}

.priority-large {
    padding: 5px 14px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
}

.priority-critical {
    background-color: #cf1322;
}

.priority-high {
    background-color: #f5222d;
}

.priority-medium {
    background-color: #fa8c16;
}

.priority-low {
    background-color: #faad14;
}

.priority-desc {
    color: #606266;
    font-size: 12px;
}

.app-icon svg path,
.ingredient-icon svg path,
.meta-item svg path {
    fill: #909090;
}

/* 影响范围部分 */
.impact-section {
    /* 移除单独的margin-bottom，统一使用flex-gap控制 */
}

/* 视图切换按钮样式 */
.view-switcher {
    font-weight: 500;
}

.view-switcher button {
    position: relative;
    transition: color 0.2s ease;
}

.view-switcher button:hover {
    color: #6C87FF;
}

.view-switcher button.active {
    background-color: white;
    color: #6C87FF;
    font-weight: 500;
}

/* 视图切换控件样式 - 极简化 */
.view-switcher span {
    transition: color 0.2s ease;
}

.expand-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
}

.expand-btn {
    color: #6C87FF;
    font-size: 13px;
    cursor: pointer;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2px 6px;
    border-radius: 3px;
}

.expand-btn-bottom {
    color: #6C87FF;
    font-size: 13px;
    cursor: pointer;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    margin-top: 8px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2px 6px;
    border-radius: 3px;
}

.text-button-gray {
    display: flex;
    align-items: center;
    gap: 4px;
    /* color: #8c8c8c; */
    cursor: pointer;
    transition: color 0.2s ease;
}

/* .text-button-gray:hover {
    color: #6C87FF;
} */

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.issue-item:hover {
    border-color: #6C87FF;
}

.issue-title:hover {
    color: #5a73e6 !important;
}

/* 优先级标签样式 */
.priority-tag-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid;
    font-size: 14px;
    font-weight: 500;
}

.priority-tag-container.priority-critical {
    border-color: #ff4c5059 !important;
    background: linear-gradient(274.85deg, rgba(255, 76, 80, 0.1) 0%, rgba(213, 0, 4, 0.1) 100%) !important;
}

.priority-tag-container.priority-high {
    border-color: #ffa04c54 !important;
    background: linear-gradient(274.85deg, rgba(255, 160, 76, 0.1) 0%, rgba(213, 99, 0, 0.1) 100%) !important;
}

.priority-tag-container.priority-medium {
    border-color: #ffcc3354 !important;
    background: linear-gradient(274.85deg, rgba(255, 204, 51, 0.1) 0%, rgba(213, 160, 0, 0.1) 100%) !important;
}

.priority-tag-text {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;
    font-family: 'PingFang SC', sans-serif;
}

/* 头部布局样式 */
.header-main-content {
    /* align-items: flex-start; */
}

.header-right-content {
    /* display: flex;
    align-items: center;
    justify-content: center; */
    min-height: 70px; /* 确保右侧区域有足够高度 */
}

/* CRI 降低卡片样式 */
.cri-reduction-card {
    background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
    border: 1px solid #A7F3D0;
    /* min-width: 160px; */
    height: 22px;
    line-height: 22px;
    padding-left: 6px;
    padding-right: 6px;
    margin-left: 8px;
    cursor: help;
    transition: all 0.3s ease;
}

/* .cri-reduction-card:hover {
    background: linear-gradient(135deg, #E6FFFA 0%, #D1FAE5 100%);
    border-color: #6EE7B7;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
} */

.cri-reduction-content {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
}

.cri-reduction-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #ECFDF5;
    flex-shrink: 0;
}

.cri-reduction-text {
    /* display: flex;
    flex-direction: column; */
    /* gap: 4px; */
}

.cri-reduction-label {
    font-size: 12px;
    color: #0D634B;
    font-weight: 500;
    line-height: 1.2;
}

.cri-reduction-value {
    font-size: 12px;
    color: #0D634B;
    /* font-weight: 700; */
    line-height: 1.2;
    font-family: 'SF Pro Display', -apple-system, sans-serif;
}

/* CRI Tooltip 专业样式 */
:deep(.cri-tooltip .ant-tooltip-inner) {
    background-color: #1f2937 !important;
    color: #ffffff !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
    padding: 12px 16px !important;
    border-radius: 8px !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
    max-width: 280px !important;
    text-align: left !important;
}

:deep(.cri-tooltip .ant-tooltip-arrow) {
    border-color: #1f2937 !important;
}

:deep(.cri-tooltip .ant-tooltip-arrow::before) {
    background-color: #1f2937 !important;
}

.cri-highlight {
    color: #10b981 !important;
    font-weight: 600 !important;
    background-color: rgba(16, 185, 129, 0.15) !important;
    padding: 2px 6px !important;
    border-radius: 4px !important;
}

/* 负责人编辑模态框样式 */
:deep(.user-select-dropdown) {
    z-index: 1055 !important;
}

:deep(.user-select-dropdown .ant-select-dropdown) {
    border-radius: 6px !important;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;
}

:deep(.user-select-dropdown .ant-select-item-option-selected) {
    background-color: #f0f8ff !important;
    color: #1890ff !important;
}

/* 模态框中的UserSelect样式 */
:deep(.user-select .ant-select-selector) {
    border-radius: 6px !important;
    border: 1px solid #d9d9d9 !important;
    transition: all 0.3s ease !important;
}

:deep(.user-select .ant-select-selector:hover) {
    border-color: #40a9ff !important;
}

:deep(.user-select .ant-select-focused .ant-select-selector) {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

/* 确保选中项能正确显示姓名 */
:deep(.user-select .ant-select-selection-item) {
    font-weight: 500 !important;
    color: #262626 !important;
}

/* 分享模态框样式 */
.share-modal-content {
    padding: 8px 0;
}

.share-info-section {
    margin-bottom: 24px;
}

.share-info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.share-info-item:last-child {
    border-bottom: none;
}

.share-label {
    font-size: 14px;
    color: #262626;
    font-weight: 500;
}

.share-value {
    font-size: 14px;
    color: #8c8c8c;
}

.share-copy-btn {
    height: 44px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    background: #6C87FF;
    border-color: #6C87FF;
}

.share-copy-btn:hover {
    background: #5a73e6;
    /* border-color: #5a73e6; */
}

/* Figma按钮样式 */
.figma-button-share {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 15px;
    background: #FFFFFF;
    border: 1px solid #6682FF;
    border-radius: 3px;
    color: #6682FF;
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5714285714285714em;
    cursor: pointer;
    transition: all 0.2s ease;
}

.figma-button-share:hover {
    background: #f0f4ff;
}

.figma-button-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 15px;
    border-radius: 3px;
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5714285714285714em;
    cursor: pointer;
    transition: all 0.2s ease;
}

.figma-button-status-active {
    background: #6682FF;
    color: #FFFFFF;
}

.figma-button-status-active:hover {
    background: #5a73e6;
}

.figma-button-status-disabled {
    background: #f5f5f5;
    color: #bfbfbf;
    cursor: not-allowed;
}
</style>
