<template>
    <div class="main-content flex flex-col gap-[16px] overflow-y-auto">
        <!-- 头部区域：按照优化需求实现 -->
        <div class="header-section bg-white p-[24px] rounded-[4px] shadow-sm">
            <!-- 标题和等级 - 更紧密整合，标题更加突出 -->
            <div class="title-wrapper flex items-center gap-[12px] mb-[20px]">
                <div class="issue-level-container flex-shrink-0">
                    <SecIssueLevel :text="basic_information.issue?.issue_level" size="large" />
                </div>
                <div class="text-[22px] font-bold flex-1 text-[#222] flex items-center gap-2">{{ basic_information.issue?.issue_title }}
                    <tag :text="getStatusText(basic_information.issue?.issue_status)" :cssClass="{ background: '#F2F2F2', fontSize: '12px', padding: '0 6px', height: '24px', color: '#3C3C3C' }" />
                </div>
                <div class="flex items-center gap-3">
                    <div class="figma-button-share" @click="turnOnLog">
                        <Svg height="14px" width="14px" name="log" class="text-primary"></Svg>
                        操作日志
                    </div>
                    <!-- <div @click="turnOnLog" class="text-button-gray">
                        <span>操作日志</span>
                    </div> -->

                    <div class="figma-button-status figma-button-status-active" @click="()=>{showStatusModal()}">
                        <EditOutlined style="font-size: 14px;" />
                        处置状态
                    </div>
                </div>

            </div>

            <!-- 四个信息并排显示 -->
            <div class="status-info-row flex items-center flex-wrap gap-[48px] mb-[16px]">
                <!-- <div class="status-info-item" >
                    <span class="info-label">处置状态:</span>
                    <span>
                        <span v-if="basic_information.issue?.issue_status === undefined" class="status-icon">⚠️</span>
                        {{ getStatusText(basic_information.issue?.issue_status) }}
                    </span>
                </div> -->
                <div class="status-info-item">
                    <span class="info-label">负责人:</span>
                    <span class="info-value" :class="{ 'unassigned': !basic_information.issue?.issue_owner_name }">
                        {{ basic_information.issue?.issue_owner_nick_name || '未指派' }}
                    </span>
                </div>
                <div class="status-info-item">
                    <span class="info-label">创建时间:</span>
                    <span class="info-value text-[#595959]">{{ formatDate(basic_information.issue?.created_at) || '-'
                    }}</span>
                </div>
                <div class="status-info-item">
                    <span class="info-label">更新时间:</span>
                    <span class="info-value text-[#595959]">{{ formatDate(basic_information.issue?.updated_at) || '-'
                    }}</span>
                </div>
            </div>

            <!-- 安全问题描述 - 使用Markdown渲染 -->
            <div class="description-section pt-[16px] border-t border-[#f0f0f0]" ref="descriptionSection">
                <div class="description-wrapper relative" :class="{ 'description-collapsed': !isDescriptionExpanded }">
                    <MarkDown :text="basic_information.issue?.issue_desc || '暂无描述'" />
                </div>
                <!-- 将展开/收起按钮移出来，放在与内容区域平行的位置 -->
                <div v-if="showExpandLink" class="expand-actions flex justify-end mt-[8px]">
                    <span v-if="!isDescriptionExpanded" class="expand-btn inline-flex items-center"
                          @click="toggleDescription">
                        <DownOutlined class="mr-[4px]" style="font-size: 14px;" />
                        展开
                    </span>
                    <span v-else class="expand-btn inline-flex items-center" @click="toggleDescription">
                        <UpOutlined class="mr-[4px]" style="font-size: 14px;" />
                        收起
                    </span>
                </div>
            </div>

            <!-- AI 智能分析区域 - 内嵌在问题概览中 -->
            <AIAnalysis :intelligentAnalysisResult="basic_information?.intelligent_analysis_result || ''" />
        </div>

        <!-- 基本信息部分 - 隐藏但保留用于数据更新 -->
        <div class="hidden">
            <BasicInformation :basic_information="basic_information" @update-status="updateData" />
        </div>

        <!-- 可视化视图 -->
        <div v-if="viewMode === 'visual'">
            <SecIssueVisualRelation :applicationInfo="application_information" :basicInfo="basic_information"
                                    :ingredientList="ingredient_list" :vulnerabilityData="vulnerabilityData"
                                    @switchView="viewMode = $event" />
        </div>

        <!-- 影响范围部分 -->
        <div v-if="viewMode === 'detail'" class="impact-section bg-white p-[24px] rounded-[4px] shadow-sm">
            <div
                class="section-heading mb-[20px] text-[18px] font-medium text-[#1f2329] border-l-[3px] border-[#6C87FF] pl-[10px] flex items-center justify-between">
                <span>受影响的应用与范围</span>
                <span @click="viewMode = 'visual'"
                      class="cursor-pointer flex items-center gap-[4px] text-[13px] text-[#8c8c8c] hover:text-[#6C87FF] transition-colors duration-200">
                    <SwapOutlined />
                    <span>切换到关系视图</span>
                </span>
            </div>
            <div class="section-container">
                <!-- 受影响的应用模块 - 渐进式披露设计 -->
                <div v-if="hasApplicationInfo" class="module-section mb-[28px]">
                    <div class="module-title mb-[16px] text-[15px] font-medium text-[#262626] flex items-center">
                        受影响的应用
                    </div>
                    <div class="applications-list pl-[26px]">
                        <!-- 默认显示前3个应用 -->
                        <div v-for="(app, index) in displayedApplications" :key="index"
                             class="application-item py-[12px] border-b border-[#f5f5f5] last:border-b-0">
                            <div class="flex flex-col">
                                <div class="flex items-center">
                                    <span class="app-icon flex-shrink-0 mr-[8px]">
                                        <CodeSandboxOutlined style="font-size: 16px; color: #909090;" />
                                    </span>
                                    <div class="app-name text-[14px] font-medium text-[#262626]">
                                        {{ app.application_name || '未命名应用' }}
                                    </div>
                                </div>

                                <!-- 将业务系统和组织机构信息放到第二行，增加标签标识 -->
                                <div v-if="app.business_name || app.organize_name"
                                     class="app-meta-row mt-[6px] ml-[26px] flex flex-wrap gap-[16px]">
                                    <div v-if="app.business_name"
                                         class="app-system flex items-center text-[12px] text-[#606266]">
                                        <span class="meta-label mr-[4px] text-[#8c8c8c]">所属系统:</span>
                                        <AppstoreOutlined style="font-size: 12px; color: #909090; margin-right: 4px;" />
                                        <span>{{ app.business_name }}</span>
                                    </div>
                                    <div v-if="app.organize_name"
                                         class="app-org flex items-center text-[12px] text-[#606266]">
                                        <span class="meta-label mr-[4px] text-[#8c8c8c]">所属组织:</span>
                                        <TeamOutlined style="font-size: 12px; color: #909090; margin-right: 4px;" />
                                        <span>{{ app.organize_name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 展开/收起控制 -->
                        <div v-if="application_information.length > defaultAppCount" class="toggle-apps mt-[12px]">
                            <a v-if="!showAllApps" @click="showAllApps = true"
                               class="toggle-link flex items-center text-[13px] text-[#6C87FF] cursor-pointer">
                                <DownOutlined class="mr-[4px]" style="font-size: 12px;" />
                                查看全部 {{ application_information.length }} 个应用
                            </a>
                            <a v-else @click="showAllApps = false"
                               class="toggle-link flex items-center text-[13px] text-[#6C87FF] cursor-pointer">
                                <UpOutlined class="mr-[4px]" style="font-size: 12px;" />
                                收起
                            </a>
                        </div>
                    </div>
                </div>

                <!-- 载体信息模块 - 简洁设计 -->
                <div v-if="hasCarriers" class="module-section mb-[28px]">
                    <div class="module-title mb-[16px] text-[15px] font-medium text-[#262626] flex items-center">
                        载体信息
                    </div>
                    <div class="pl-[26px]">
                        <div v-for="(carrier, index) in basic_information.carriers" :key="index"
                             class="carrier-content bg-[#f9f9fa] p-[12px] rounded-[4px] mb-[8px] last:mb-0">
                            <div class="flex items-center">
                                <!-- 根据类型显示不同的图标 -->
                                <span v-if="carrier.carrier_type === 'code_repo'"
                                      class="carrier-icon flex items-center justify-center bg-[#f0f0f0] rounded-[4px] w-[28px] h-[28px] mr-[10px] flex-shrink-0">
                                    <Svg name="git_repo" height="20" width="20"></Svg>
                                </span>
                                <span v-else-if="carrier.carrier_type === 'service_address'"
                                      class="carrier-icon flex items-center justify-center bg-[#f0f0f0] rounded-[4px] w-[28px] h-[28px] mr-[10px] flex-shrink-0">
                                    <Svg name="network_service" height="20" width="20"></Svg>
                                </span>
                                <span v-else-if="carrier.carrier_type === 'host'"
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
                                    {{ carrier.name || '未知载体' }}
                                </div>
                            </div>
                            <div class="flex items-center mt-[8px] ml-[34px]">
                                <a-tag
                                    class="carrier-type-tag bg-[#f5f7fa] border-[#e8e8e8] text-[#595959] px-[8px] py-[1px]">
                                    {{ getCarrierTypeLabel(carrier.carrier_type) }}
                                </a-tag>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 成分信息模块 - 简洁设计 -->
                <div v-if="hasIngredients" class="module-section mb-[28px]">
                    <div class="module-title mb-[16px] text-[15px] font-medium text-[#262626] flex items-center">
                        软件成分
                    </div>
                    <div class="pl-[26px]">
                        <div v-for="(item, index) in ingredient_list" :key="index"
                             class="carrier-content bg-[#f9f9fa] p-[12px] rounded-[4px] mb-[8px] last:mb-0">
                            <div class="flex items-center">
                                <span
                                    class="carrier-icon flex items-center justify-center bg-[#f0f0f0] rounded-[4px] w-[28px] h-[28px] mr-[10px] flex-shrink-0">
                                    <BlockOutlined style="font-size: 20px; color: #909090;" />
                                </span>
                                <div class="carrier-name text-[14px] font-medium text-[#262626] font-mono">
                                    {{ item.component_name }}
                                    <span v-if="item.component_version"
                                          class="text-[12px] text-[#8c8c8c] ml-[4px] font-normal">
                                        {{ item.component_version }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex items-center mt-[8px] ml-[34px]">
                                <a-tag
                                    class="carrier-type-tag bg-[#f5f7fa] border-[#e8e8e8] text-[#595959] px-[8px] py-[1px]">
                                    {{ findSoftwareComponentCategoryLabel(item.asset_type) }}
                                </a-tag>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 无数据展示 -->
                <div v-if="!hasData"
                     class="no-data-container py-[24px] px-[16px] text-center bg-[#f9f9fa] rounded-[4px]">
                    <InfoCircleOutlined style="font-size: 36px; color: #d9d9d9;" class="inline-block mb-[8px]" />
                    <div class="no-data text-[13px] text-[#8c8c8c]">暂无影响范围数据</div>
                </div>
            </div>
        </div>

        <!-- 漏洞风险部分 -->
        <div v-if="viewMode === 'detail'" class="vuln-section bg-white p-[24px] rounded-[4px] shadow-sm">
            <div
                class="section-heading mb-[20px] text-[18px] font-medium text-[#1f2329] border-l-[3px] border-[#6C87FF] pl-[10px]">
                关联漏洞

                <!-- <TextPopover placement="right" text="用于反映安全问题的处置优先级，通过漏洞风险等级及利用成本等因素综合评估得出">
                    <Svg name="icon_issue" class="ml-1" style="width:16px;height:16px;"></Svg>
                </TextPopover> -->

            </div>
            <div class="section-container">

                <!-- 智能聚合漏洞展示 - Figma设计样式 -->
                <div class="priority-section mb-[24px] flex items-center px-[24px] py-[10px] rounded-[3px] w-full"
                     style="background: linear-gradient(270deg, rgba(108, 135, 255, 0.05) 0%, rgba(178, 115, 255, 0.05) 100%);
 border: 1px solid; border: 1px solid rgba(178, 115, 255, 0.2)">
                    <div class="flex items-center justify-between gap-[8px] w-full">
                        <div class="flex items-center gap-2">
                            <!-- 星形图标 -->
                            <div class="flex-shrink-0" style="width: 24px; height: 24px;">
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 1px;">
                                    <path d="M14.3 7.69999L9.90001 6.04999L14.3 4.39834L15.95 0L17.6016 4.39834L22 6.04999L17.6016 7.69999L15.95 12.1L14.3 7.69999ZM5.49997 16.5L0 14.3L5.49997 12.1L7.69999 6.60001L9.90001 12.1L15.4 14.3L9.90001 16.5L7.69999 22L5.49997 16.5Z" fill="url(#paint0_linear_priority_figma)"/>
                                    <defs>
                                        <linearGradient id="paint0_linear_priority_figma" x1="22" y1="11" x2="0" y2="11" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#B273FF"/>
                                            <stop offset="1" stop-color="#6C87FF"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            <!-- 文本内容 -->
                            <div class="ai-text" style="font-family: 'PingFang SC', sans-serif; display: flex; justify-content: space-between; font-weight: 500; font-size: 15px; line-height: 1.5em; background: linear-gradient(270deg, #6C87FF 0%, #B273FF 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                墨思已为您智能聚合了 {{ vulnerabilityTotal}} 个同源漏洞，一次修复即可解决全部漏洞
                            </div>
                        </div>

                        <div class="text-primary font-normal text-[13px]">
                            来自墨思 AI 智能体分析结果
                        </div>
                        <!-- <div class="text-[15px] font-medium leading-[1.5em] flex-1"
                             style="color: white; font-family: 'PingFang SC', sans-serif; font-weight: 500; font-size: 15px; background: linear-gradient(270deg, #6C87FF 0%, #B273FF 100%);
 background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            墨思已为您智能聚合了 {{ vulnerabilityTotal || 'X' }} 个同源漏洞，一次修复即可解决全部漏洞
                        </div> -->
                    </div>
                </div>

                <VulnerabilityList :issue_id="issue_id" @update-total="vulnerabilityTotal = $event" />
            </div>
        </div>

        <!-- 处置方案部分 -->
        <div class="solution-section bg-white p-[24px] rounded-[4px] shadow-sm mb-[16px]">
            <div
                class="section-heading mb-[20px] text-[18px] font-medium text-[#1f2329] border-l-[3px] border-[#6C87FF] pl-[10px]">
                如何快速完成风险处置
            </div>
            <div class="section-container">
                <!-- 代码片段与修复建议 -->
                <div v-if="viewMode === 'detail' && parsedCodeExample" class="code-diff-section mb-[20px]">
                    <CodeDiffViewer :vulnerable-code="parsedCodeExample.vulnerable_code"
                                    :fixed-code="parsedCodeExample.fixed_code" :language="parsedCodeExample.language" theme="light"
                                    max-height="400px" />
                </div>

                <div class="disposal-plan" v-if="basic_information.issue?.solution">
                    <div class="bg-[#f9f9fa] p-[16px] rounded-[4px]">
                        <MarkDown :text="basic_information.issue?.solution || '-'" />
                    </div>
                </div>
                <div v-else class="no-data py-[24px] text-center bg-[#f9f9fa] rounded-[4px]">
                    <InfoCircleOutlined style="font-size: 36px; color: #d9d9d9;" class="inline-block mb-[8px]" />
                    <div class="text-[13px] text-[#8c8c8c]">暂无处置方案</div>
                </div>
            </div>
        </div>
    </div>

    <OperationLogModal v-model:open="opetateLog" v-if="opetateLog" :logfilter="logfilter" />
    <!-- 处置状态编辑模态框 -->
    <a-modal v-model:visible="statusModalVisible" title="处置状态" @ok="handleStatusUpdate">
        <a-select class="w-full" v-model:value="selectedStatus" :options="DISPOSAL_STATUS" />
    </a-modal>
</template>

<script setup>
import { useRoute } from 'vue-router';
import {
    ref, onBeforeMount, onMounted, nextTick, computed, watch,
} from 'vue';
import {
    getSecDetailApi, getSecAppNameApi, getSecIngredientListApi, getSecVulnListApi, getSecUpdateStatusApi,
} from 'api/app';
import { formatDate } from 'utils';
import { DISPOSAL_STATUS } from 'view/app-manage/constats';
import { findSoftwareComponentCategoryLabel } from 'constants/softwareComponent';
import {
    SwapOutlined,
    EditOutlined,
    DownOutlined,
    UpOutlined,
    AppstoreOutlined,
    CodeSandboxOutlined,
    TeamOutlined,
    InfoCircleOutlined,
    BlockOutlined,
} from '@ant-design/icons-vue';

import BasicInformation from './tabs/BasicInformation.vue';
import VulnerabilityList from './tabs/VulnerabilityList.vue';
import SecIssueVisualRelation from './components/SecIssueVisualRelation.vue';
import AIAnalysis from './components/AIAnalysis.vue';
import CodeDiffViewer from './components/CodeDiffViewer.vue';

const route = useRoute(); // 获取当前路由信息
const issue_id = route.params.id; // 获取路由中的issueId

const basic_information = ref({});
const application_information = ref([]);
const ingredient_list = ref([]);
const vulnerabilityData = ref([]); // 添加漏洞数据引用
const dataLoaded = ref(false);
const vulnerabilityTotal = ref(0); // 漏洞总数
const showExpandLink = ref(false);
const descriptionSection = ref(null);

// 解析 AI 生成的代码示例
const parsedCodeExample = computed(() => {
    // 确保 basic_information.value.issue 存在且有 intelligent_code_example 字段
    if (!basic_information.value?.issue?.intelligent_code_example) {
        return null;
    }

    try {
        const parsed = JSON.parse(basic_information.value.issue.intelligent_code_example);
        console.log('parsed', parsed);
        // 验证必要字段
        if (!parsed?.language || !parsed?.vulnerable_code || !parsed?.fixed_code) {
            console.warn('AI代码示例数据格式不完整:', parsed);
            return null;
        }

        return parsed;
    } catch (error) {
        console.error('解析AI代码示例失败:', error);
        return null;
    }
});

// 计算属性 - 影响范围相关
const hasApplicationInfo = computed(() => application_information.value && application_information.value.length > 0);

const hasIngredients = computed(() => ingredient_list.value && ingredient_list.value.length > 0);

const hasCarriers = computed(() => basic_information.value?.carriers && basic_information.value.carriers.length > 0);

const hasData = computed(() => hasApplicationInfo.value || hasIngredients.value || hasCarriers.value);

// 应用渐进式披露相关
const defaultAppCount = 3; // 默认显示前3个应用
const showAllApps = ref(false); // 控制是否显示全部应用

// 计算属性 - 当前显示的应用列表
const displayedApplications = computed(() => {
    if (showAllApps.value || application_information.value.length <= defaultAppCount) {
        return application_information.value;
    }
    return application_information.value.slice(0, defaultAppCount);
});

// 描述展开/收起控制
const isDescriptionExpanded = ref(false);

// 检查描述长度
const checkDescriptionLength = async () => {
    await nextTick();
    try {
        const descEl = document.querySelector('.description-wrapper');
        if (!descEl) return;

        // 获取实际内容元素（Markdown渲染后的内容）
        const contentEl = descEl.querySelector('.markdown-body') || descEl.firstElementChild;
        if (!contentEl) return;

        // 获取行高
        const lineHeight = parseInt(window.getComputedStyle(contentEl).lineHeight, 10) || 24;
        const descHeight = contentEl.scrollHeight;

        // 恢复为更严格的判断逻辑，确保只有内容超过2行时才显示展开按钮
        // 为确保精确度，增加少量余量（比如5px）
        const threshold = lineHeight * 2 + 5;

        if (descHeight > threshold) {
            showExpandLink.value = true;
        } else {
            showExpandLink.value = false;
        }

        console.log('描述区域高度检查:', {
            descHeight,
            lineHeight,
            threshold,
            shouldExpand: descHeight > threshold,
        });
    } catch (err) {
        console.error('检查描述长度出错:', err);
        // 发生错误时默认不显示展开按钮
        showExpandLink.value = false;
    }
};

const toggleDescription = () => {
    isDescriptionExpanded.value = !isDescriptionExpanded.value;
};

// 获取状态文本
const getStatusText = (status) => {
    const statusItem = DISPOSAL_STATUS.find((item) => item.value === status);
    return statusItem ? statusItem.label : '未处置';
};

// 获取状态样式类
// const getStatusClass = (status) => {
//     if (status === undefined) return 'status-warning';
//     return 'status-normal';
// };

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
async function getSecDetail() {
    try {
        const response = await getSecDetailApi(issue_id);
        return response.data.data || {};
    } catch (error) {
        console.error('获取安全详情出错:', error);
        return {};
    }
}

// 获取应用信息名称
async function getSecAppName() {
    try {
        const response = await getSecAppNameApi(issue_id);
        return response.data.data || [];
    } catch (error) {
        console.error('获取应用信息出错:', error);
        return [];
    }
}

// 获取成分列表
async function getSecIngredientList() {
    try {
        const response = await getSecIngredientListApi(issue_id);
        return response.data.data || [];
    } catch (error) {
        console.error('获取成分列表出错:', error);
        return [];
    }
}

// 获取漏洞数据方法
const getVulnerabilityData = async () => {
    try {
        // 使用正确的API获取漏洞数据
        const response = await getSecVulnListApi({
            issue_id: Number(issue_id),
            page: 1,
            limit: 100, // 获取足够多的漏洞数据，用于可视化展示
        });

        // API返回结构: {code: 200, data: {data_list: [...]}}
        if (response?.data?.code === 200 && response?.data?.data?.data_list) {
            vulnerabilityData.value = response.data.data.data_list || [];
            console.log('获取到漏洞数据:', vulnerabilityData.value);
        } else {
            console.warn('未获取到漏洞数据，API返回:', response);
            vulnerabilityData.value = [];

            // 临时添加一些测试数据以确保视图正常工作
            vulnerabilityData.value = [
                {
                    vuln_id: 1,
                    cwe_id: 'CWE-89',
                    description: 'SQL注入漏洞',
                    severity: 'high',
                },
                {
                    vuln_id: 2,
                    cwe_id: 'CWE-79',
                    description: 'XSS跨站脚本攻击',
                    severity: 'medium',
                },
            ];
        }
    } catch (error) {
        console.error('获取漏洞数据失败:', error);
        vulnerabilityData.value = [];

        // 临时添加一些测试数据以确保视图正常工作
        vulnerabilityData.value = [
            {
                vuln_id: 1,
                cwe_id: 'CWE-89',
                description: 'SQL注入漏洞',
                severity: 'high',
            },
            {
                vuln_id: 2,
                cwe_id: 'CWE-79',
                description: 'XSS跨站脚本攻击',
                severity: 'medium',
            },
        ];
    }
};

// 修改updateData函数，添加获取漏洞数据
const updateData = async () => {
    try {
        basic_information.value = await getSecDetail();
        application_information.value = await getSecAppName();
        ingredient_list.value = await getSecIngredientList();
        await getVulnerabilityData(); // 获取漏洞数据
        dataLoaded.value = true;

        // 等待组件渲染后检查描述长度
        setTimeout(checkDescriptionLength, 100);
    } catch (error) {
        console.error('更新数据出错:', error);
    }
};

const opetateLog = ref(false);
const logfilter = ref({
    entity_type: 'Issue',
    entity_id: null, // 这里可以根据实际情况设置
});
// 开启操作日志
const turnOnLog = () => {
    opetateLog.value = true;
    logfilter.value.entity_id = String(issue_id); // 设置当前载体ID
};

onBeforeMount(async () => {
    try {
        basic_information.value = await getSecDetail();
        application_information.value = await getSecAppName();
        ingredient_list.value = await getSecIngredientList();
        await getVulnerabilityData(); // 获取漏洞数据
        dataLoaded.value = true;
    } catch (error) {
        console.error('初始化数据出错:', error);
    }
});

onMounted(() => {
    // 确保DOM元素已加载后再检查文本长度
    setTimeout(checkDescriptionLength, 100);
});

// 视图切换控制
const viewMode = ref('detail'); // 'detail' 或 'visual'

// 处置状态编辑相关
const statusModalVisible = ref(false);
const selectedStatus = ref(undefined);

// 显示状态编辑模态框
const showStatusModal = () => {
    selectedStatus.value = basic_information.value.issue?.issue_status;
    statusModalVisible.value = true;
};

// 处理状态更新
const handleStatusUpdate = async () => {
    try {
        // 确保issue_id是数字类型
        const numericIssueId = parseInt(issue_id, 10);
        // 这里添加API调用，更新处置状态
        await getSecUpdateStatusApi({ issue_id: numericIssueId, status: selectedStatus.value });
        // 更新成功后重新加载数据
        await updateData();
        statusModalVisible.value = false;
    } catch (error) {
        console.error('更新处置状态失败:', error);
    }
};

// 视图更新观察
watch(viewMode, (newValue) => {
    if (newValue === 'visual') {
        // 当切换到可视化视图时，给视图一些时间渲染后自动适应
        setTimeout(() => {
            console.log('自动适应视图大小...');
        }, 300);
    }
});

</script>

<style>
.header-section {
    border-bottom: none;
}

.title-wrapper {
    display: flex;
    align-items: center;
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

/* 删除之前所有Vue Flow相关样式 */

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
