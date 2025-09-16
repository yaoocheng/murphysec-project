<template>
    <div class="visual-view bg-white p-[24px] rounded-[4px] shadow-sm" :class="{ 'page-fullscreen': isFullscreen }">
        <div class="section-heading mb-[20px] text-[18px] font-medium text-[#1f2329] border-l-[3px] border-[#6C87FF] pl-[10px] flex items-center justify-between">
            <span>安全问题关系可视化</span>
            <span
                @click="switchToDetail"
                class="cursor-pointer flex items-center gap-[4px] text-[13px] text-[#8c8c8c] hover:text-[#6C87FF] transition-colors duration-200">
                <SwapOutlined />
                <span>切换到详情视图</span>
            </span>
        </div>
        <div class="vue-flow-container relative" :style="isFullscreen ? 'height: calc(100vh - 120px);' : 'height: 700px;'" style="overflow: hidden;" ref="flowContainer" @mouseenter="showControls = true" @mouseleave="showControls = false">
            <VueFlow
                v-model="elements"
                class="bg-[#fafafa]"
                :min-zoom="0.1"
                :max-zoom="4"
                @nodeClick="onNodeClick"
                @paneClick="onPaneClick"
                fit-view
                :fit-view-options="{
                    padding: 0.2,
                    minZoom: 0.1,
                    maxZoom: 2,
                    includeHiddenNodes: false
                }"
                :default-edge-options="{
                    type: 'smoothstep',
                    animated: false,
                    style: { strokeWidth: 1.8 }
                }"
                :default-viewport="{
                    x: 0,
                    y: 0,
                    zoom: 1
                }"
                :panOnDrag="isModifierKeyPressed"
                :zoomOnScroll="isModifierKeyPressed"
                :panOnScroll="isModifierKeyPressed"
                :panOnScrollMode="'free'"
                @nodesChange="handleNodesChange"
                @init="onInit"
            >
                <template #node-custom="nodeProps">
                    <div :class="['custom-node bg-white border border-[#e0e0e0] rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex items-start relative',
                                  {'vulnerability-node': nodeProps.data.type === 'vulnerability'}]">
                        <!-- 左侧连接点 -->
                        <Handle
                            id="left"
                            type="target"
                            :position="Position.Left"
                            :style="{
                                background: 'transparent',
                                border: 'none',
                                width: '16px',
                                height: '16px',
                                top: '50%',
                                opacity: 0
                            }"
                        />

                        <!-- 右侧连接点 -->
                        <Handle
                            id="right"
                            type="source"
                            :position="Position.Right"
                            :style="{
                                background: 'transparent',
                                border: 'none',
                                width: '16px',
                                height: '16px',
                                top: '50%',
                                opacity: 0
                            }"
                        />

                        <!-- 普通节点显示方式 -->
                        <template v-if="nodeProps.data.type !== 'vulnerability'">
                            <div class="p-[16px] flex items-start">
                                <!-- 图标部分 -->
                                <div :class="`icon-container icon-${nodeProps.data.type} mr-[12px] rounded-[4px] flex-shrink-0`">
                                    <!-- 组织图标 -->
                                    <TeamOutlined v-if="nodeProps.data.type === 'organization'" class="icon-inner text-white" />

                                    <!-- 业务系统图标 -->
                                    <AppstoreOutlined v-else-if="nodeProps.data.type === 'business'" class="icon-inner text-white" />

                                    <!-- 应用图标 -->
                                    <CodeSandboxOutlined v-else-if="nodeProps.data.type === 'application'" class="icon-inner text-white" />

                                    <!-- 载体/仓库图标 -->
                                    <div v-else-if="nodeProps.data.type === 'carrier'" class="icon-inner-wrapper">
                                        <Svg v-if="getCarrierTypeFromDescription(nodeProps.data.description) === 'code_repo'" name="git_repo" height="24" width="24" color="#ffffff" />
                                        <Svg v-else-if="getCarrierTypeFromDescription(nodeProps.data.description) === 'service_address'" name="network_service" height="24" width="24" color="#ffffff" />
                                        <Svg v-else-if="getCarrierTypeFromDescription(nodeProps.data.description) === 'host'" name="host" height="24" width="24" color="#ffffff" />
                                        <svg v-else class="icon-inner" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>

                                    <!-- 软件成分图标 -->
                                    <svg v-else-if="nodeProps.data.type === 'ingredient'" class="icon-inner" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>

                                    <!-- 默认图标 -->
                                    <svg v-else class="icon-inner" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>

                                <!-- 文本内容部分 -->
                                <div class="text-content">
                                    <div class="text-[15px] font-medium text-[#333333]">{{ nodeProps.data.label }}</div>
                                    <div class="text-[13px] text-[#6b7280]">{{ nodeProps.data.description || '' }}</div>
                                </div>
                            </div>
                        </template>

                        <!-- 漏洞节点特殊显示方式 -->
                        <template v-else>
                            <div class="vuln-content w-full p-[12px]">
                                <!-- 漏洞头部 -->
                                <div class="vuln-header flex items-center mb-[10px]">
                                    <div class="icon-container icon-vulnerability rounded-[4px] mr-[8px]">
                                        <BugOutlined class="icon-inner text-white" />
                                    </div>
                                    <div class="vuln-title-area flex-1 min-w-0">
                                        <a-tooltip :title="nodeProps.data.label" placement="top">
                                            <div class="vuln-title text-[15px] font-medium text-[#333333] truncate">
                                                {{ nodeProps.data.label }}
                                            </div>
                                        </a-tooltip>
                                        <div class="vuln-type text-[12px] text-[#6b7280]">漏洞</div>
                                    </div>
                                </div>

                                <!-- 漏洞详情 -->
                                <div class="vuln-details">
                                    <!-- 漏洞元数据 -->
                                    <div class="vuln-meta">
                                        <!-- 漏洞等级和来源 -->
                                        <div class="vuln-meta-item flex items-center gap-[8px] mb-[8px]">
                                            <span class="severity-tag"
                                                  :style="{
                                                      backgroundColor: getDangerLevel(nodeProps.data.severity).bgc,
                                                      color: getDangerLevel(nodeProps.data.severity).color
                                                  }">
                                                {{ getDangerLevel(nodeProps.data.severity).text }}
                                            </span>
                                            <div class="divider"></div>
                                            <span class="vuln-source flex items-center">
                                                {{ nodeProps.data.security_capability_name || '未知能力' }}
                                            </span>
                                        </div>

                                        <!-- 分隔线 -->
                                        <div class="h-[1px] bg-[#f0f0f0] my-[8px]"></div>

                                        <!-- 处置状态和时间 - 优化空间利用率 -->
                                        <div class="vuln-meta-row flex items-center justify-between text-[12px]">
                                            <div class="vuln-status flex items-center">
                                                <span class="status-dot mr-[6px]" :class="getStatusClass(nodeProps.data.status, 'dot')"></span>
                                                <span>
                                                    {{ getStatusText(nodeProps.data.status) }}
                                                </span>
                                            </div>
                                            <a-tooltip title="漏洞发现时间" placement="top">
                                                <div class="vuln-time text-[#606266]">
                                                    {{ formatDateTime(nodeProps.data.foundTime) }}
                                                </div>
                                            </a-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
                <Background :pattern-color="'#aaa'" :gap="16" />
            </VueFlow>

            <!-- 提示用户使用修饰键交互的提示框，与控制按钮一起显示/隐藏 -->
            <div class="modifier-key-hint" :class="{ 'visible': showControls }">
                <div class="hint-content flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1">
                        <rect x="3" y="11" width="18" height="7" rx="1" ry="1"></rect>
                        <text x="7.5" y="16.5" font-size="6" font-weight="bold" fill="currentColor">{{ isMac ? '⌘' : 'Ctrl' }}</text>
                    </svg>
                    <span v-if="!isFullscreen">按住<span class="font-bold mx-1">{{ modifierKeyText }}</span>激活图表交互模式</span>
                    <span v-else class="text-green-600 font-medium">全屏模式下交互已自动激活</span>
                    <span v-if="isModifierKeyPressed && !isFullscreen" class="text-green-600 font-medium ml-1">(已激活)</span>
                </div>
            </div>

            <!-- 控制按钮组 - 图表内右上角 -->
            <div class="custom-controls-wrapper" :class="{ 'controls-visible': showControls }">
                <div class="custom-controls">
                    <a-tooltip placement="bottom" title="放大视图 - 放大查看图表细节" :mouseEnterDelay="0.5">
                        <button class="control-btn" @click="zoomIn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </button>
                    </a-tooltip>
                    <a-tooltip placement="bottom" title="缩小视图 - 缩小查看更多内容" :mouseEnterDelay="0.5">
                        <button class="control-btn" @click="zoomOut">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </button>
                    </a-tooltip>
                    <a-tooltip placement="bottom" title="适配视图 - 自动调整图表以适应屏幕大小" :mouseEnterDelay="0.5">
                        <button class="control-btn" @click="fitView">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="2"></rect>
                                <circle cx="12" cy="12" r="4"></circle>
                            </svg>
                        </button>
                    </a-tooltip>
                    <a-tooltip placement="bottom" title="全屏显示 - 将图表展开为全屏模式" :mouseEnterDelay="0.5">
                        <button class="control-btn" @click="toggleFullscreen">
                            <svg v-if="!isFullscreen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 14h6m0 0v6m0-6l-7 7m17-11h-6m0 0V4m0 6l7-7"></path>
                            </svg>
                        </button>
                    </a-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref, watch, onMounted, onUnmounted, computed,
} from 'vue';
import {
    VueFlow, Handle, Position, MarkerType,
} from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import { Background } from '@vue-flow/background';
import {
    SwapOutlined,
    TeamOutlined,
    AppstoreOutlined,
    CodeSandboxOutlined,
    BugOutlined,
} from '@ant-design/icons-vue';
import { getDangerLevel } from 'utils';
import { findSoftwareComponentCategoryLabel } from 'constants/softwareComponent';
import Svg from '@/components/Svg.vue'; // 添加Svg组件导入

const props = defineProps({
    applicationInfo: {
        type: Array,
        default: () => [],
    },
    basicInfo: {
        type: Object,
        default: () => ({}),
    },
    ingredientList: {
        type: Array,
        default: () => [],
    },
    vulnerabilityData: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['switchView']);

const switchToDetail = () => {
    emit('switchView', 'detail');
};

// 节点和边数据
const elements = ref([]);
const flowInstance = ref(null);
const flowContainer = ref(null);
const isFullscreen = ref(false);
const showControls = ref(false);
const isModifierKeyPressed = ref(false); // 修饰键状态跟踪

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

// 检测操作系统类型
const isMac = ref(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

// 修饰键提示文本
const modifierKeyText = computed(() => (isMac.value ? 'Command键 (⌘)' : 'Ctrl键'));

// 生成Vue Flow图表元素
const generateFlowElements = () => {
    const nodes = [];
    const edges = [];
    let nodeId = 1;

    // X轴位置 - 增加水平间距
    const xPositions = {
        organization: 0, // 最左侧组织节点
        business: 350, // 业务系统节点 (增加间距)
        application: 700, // 应用节点 (增加间距)
        carrier: 1050, // 载体节点 (增加间距)
        ingredient: 1400, // 软件成分节点 (增加间距)
        vulnerability: 1750, // 最右侧漏洞节点 (增加间距)
    };

    // 提取并分组组织、业务系统、应用信息
    const organizeMap = new Map(); // 存储组织信息 {organize_name: [apps]}
    const businessMap = new Map(); // 存储业务系统信息 {business_name: [apps]}

    if (props.applicationInfo && props.applicationInfo.length > 0) {
        // 首先按组织和业务系统分组应用
        props.applicationInfo.forEach((app) => {
            // 处理组织
            const orgName = app.organize_name || '未知组织';
            if (!organizeMap.has(orgName)) {
                organizeMap.set(orgName, []);
            }
            organizeMap.get(orgName).push(app);

            // 处理业务系统
            const businessName = app.business_name || '未知业务系统';
            if (!businessMap.has(businessName)) {
                businessMap.set(businessName, []);
            }
            businessMap.get(businessName).push(app);
        });
    }

    // 创建组织节点
    const organizationNodes = [];
    const organizations = Array.from(organizeMap.keys());
    const orgSpacing = 220; // 增加垂直间距

    organizations.forEach((orgName, index) => {
        // 增加垂直方向错落排布，使节点分布更均匀
        const yOffset = index * 20;

        const orgNode = {
            id: `org-${nodeId++}`,
            type: 'custom',
            position: {
                x: xPositions.organization,
                y: 100 + index * orgSpacing + yOffset,
            },
            data: {
                label: orgName,
                description: '组织机构',
                type: 'organization',
                apps: organizeMap.get(orgName),
            },
        };
        nodes.push(orgNode);
        organizationNodes.push(orgNode);
    });

    // 创建业务系统节点
    const businessNodes = [];
    const businesses = Array.from(businessMap.keys());
    const businessSpacing = 220; // 增加垂直间距

    businesses.forEach((businessName, index) => {
        // 查找此业务系统属于哪个组织(取第一个应用的组织作为业务系统的组织)
        const apps = businessMap.get(businessName);
        const firstApp = apps[0];
        const orgName = firstApp?.organize_name || '未知组织';

        // 增加垂直方向错落排布
        const yOffset = index * 25;

        const businessNode = {
            id: `bus-${nodeId++}`,
            type: 'custom',
            position: {
                x: xPositions.business,
                y: 100 + index * businessSpacing + yOffset,
            },
            data: {
                label: businessName,
                description: '业务系统',
                type: 'business',
                organizeName: orgName,
                apps,
            },
        };
        nodes.push(businessNode);
        businessNodes.push(businessNode);

        // 连接组织到业务系统
        const parentOrg = organizationNodes.find((org) => org.data.label === orgName);
        if (parentOrg) {
            edges.push({
                id: `e-org-${parentOrg.id}-bus-${businessNode.id}`,
                source: parentOrg.id,
                target: businessNode.id,
                animated: false,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 15,
                    height: 15,
                    color: '#bbb',
                },
                style: { stroke: '#bbb', strokeWidth: 1.5 },
                type: 'default',
                sourceHandle: 'right',
                targetHandle: 'left',
            });
        }
    });

    // 应用节点
    const applicationNodes = [];
    if (props.applicationInfo && props.applicationInfo.length > 0) {
        const appSpacing = 180; // 增加垂直间距

        props.applicationInfo.forEach((app, index) => {
            // 增加垂直方向错落排布
            const yOffset = index * 15;

            const appNode = {
                id: `app-${nodeId++}`,
                type: 'custom',
                position: {
                    x: xPositions.application,
                    y: 100 + index * appSpacing + yOffset,
                },
                data: {
                    label: app.application_name || '未命名应用',
                    description: '应用',
                    type: 'application',
                    organize_name: app.organize_name,
                    business_name: app.business_name,
                },
            };
            nodes.push(appNode);
            applicationNodes.push(appNode);

            // 连接业务系统到应用
            const parentBusiness = businessNodes.find((bus) => bus.data.label === app.business_name);
            if (parentBusiness) {
                edges.push({
                    id: `e-bus-${parentBusiness.id}-app-${appNode.id}`,
                    source: parentBusiness.id,
                    target: appNode.id,
                    animated: false,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 15,
                        height: 15,
                        color: '#bbb',
                    },
                    style: { stroke: '#bbb', strokeWidth: 1.5 },
                    type: 'default',
                    sourceHandle: 'right',
                    targetHandle: 'left',
                });
            }
        });
    }

    // 载体节点
    const carrierNodes = [];
    if (props.basicInfo?.carriers && props.basicInfo.carriers.length > 0) {
        // 计算应用节点的中间位置作为参考点
        const avgAppPositionY = applicationNodes.length > 0
            ? applicationNodes.reduce((sum, node) => sum + node.position.y, 0) / applicationNodes.length
            : 200;

        // 创建每个载体的节点
        props.basicInfo.carriers.forEach((carrier, index) => {
            // 计算垂直偏移，使多个载体节点错开排列
            const offsetY = (props.basicInfo.carriers.length > 1)
                ? (index - (props.basicInfo.carriers.length - 1) / 2) * 150
                : 0;

            const carrierNode = {
                id: `carrier-${index + 1}`,
                type: 'custom',
                position: {
                    x: xPositions.carrier,
                    y: avgAppPositionY + offsetY,
                },
                data: {
                    label: carrier.name || '载体',
                    description: getCarrierTypeLabel(carrier.carrier_type) || '未知类型',
                    carrierType: carrier.carrier_type, // 保存原始类型值
                    type: 'carrier',
                },
            };
            nodes.push(carrierNode);
            carrierNodes.push(carrierNode);

            // 连接所有应用到当前载体
            // 如果只有一个载体，则连接所有应用
            // 如果有多个载体，则尝试建立合理的连接（这里简化处理，每个载体连接部分应用）
            let appsToConnect = applicationNodes;
            if (props.basicInfo.carriers.length > 1 && applicationNodes.length > 1) {
                // 简单分配：每个载体连接部分应用
                const appsPerCarrier = Math.max(1, Math.floor(applicationNodes.length / props.basicInfo.carriers.length));
                const startIdx = index * appsPerCarrier;
                const endIdx = index === props.basicInfo.carriers.length - 1
                    ? applicationNodes.length
                    : startIdx + appsPerCarrier;
                appsToConnect = applicationNodes.slice(startIdx, endIdx);
            }

            // 连接应用到载体
            appsToConnect.forEach((appNode) => {
                edges.push({
                    id: `e-app-${appNode.id}-carrier-${carrierNode.id}`,
                    source: appNode.id,
                    target: carrierNode.id,
                    animated: false,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 15,
                        height: 15,
                        color: '#bbb',
                    },
                    style: { stroke: '#bbb', strokeWidth: 1.5 },
                    type: 'default',
                    sourceHandle: 'right',
                    targetHandle: 'left',
                });
            });
        });
    }

    // 软件成分节点
    const ingredientNodes = [];
    if (props.ingredientList && props.ingredientList.length > 0) {
        const ingredientCount = Math.min(props.ingredientList.length, 5); // 限制显示数量
        const ingredientSpacing = ingredientCount > 3 ? 150 : 180; // 增加节点间距

        // 计算软件成分节点的起始Y坐标，使其分布更均匀
        let startY;
        if (carrierNodes.length > 0) {
            // 如果有载体节点，将成分节点垂直对齐到载体节点的位置
            startY = carrierNodes[carrierNodes.length - 1].position.y + 100;
        } else {
            startY = 150;
        }

        for (let i = 0; i < ingredientCount; i++) {
            const ingredient = props.ingredientList[i];
            const ingredientNode = {
                id: `ing-${nodeId++}`,
                type: 'custom',
                position: {
                    x: xPositions.ingredient,
                    y: startY + i * ingredientSpacing,
                },
                data: {
                    label: ingredient.component_name + (ingredient.component_version ? `@${ingredient.component_version}` : '') || '未知成分',
                    description: findSoftwareComponentCategoryLabel(ingredient.asset_type) || '软件组件',
                    type: 'ingredient',
                },
            };
            nodes.push(ingredientNode);
            ingredientNodes.push(ingredientNode);

            // 连接载体到软件成分
            if (carrierNodes.length > 0) {
                edges.push({
                    id: `e-carrier-ing-${ingredientNode.id}`,
                    source: carrierNodes[carrierNodes.length - 1].id,
                    target: ingredientNode.id,
                    animated: false,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 15,
                        height: 15,
                        color: '#bbb',
                    },
                    style: { stroke: '#bbb', strokeWidth: 1.5 },
                    type: 'default',
                    sourceHandle: 'right',
                    targetHandle: 'left',
                });
            }
        }
    }

    // 使用实际获取的漏洞数据
    const vulnNodes = [];
    if (props.vulnerabilityData && props.vulnerabilityData.length > 0) {
        const vulnCount = Math.min(props.vulnerabilityData.length, 5); // 限制显示数量
        const vulnSpacing = vulnCount > 3 ? 200 : 230; // 增加漏洞节点间距

        // 计算起始Y坐标，使漏洞节点居中对齐
        let startY;
        if (ingredientNodes.length > 0) {
            // 如果有软件成分节点，使漏洞节点与软件成分节点对齐
            startY = ingredientNodes.reduce((sum, node) => sum + node.position.y, 0) / ingredientNodes.length - (((vulnCount - 1) * vulnSpacing) / 2);
        } else if (carrierNodes.length > 0) {
            // 如果只有载体节点，使漏洞节点与载体节点垂直对齐
            startY = carrierNodes[carrierNodes.length - 1].position.y - (((vulnCount - 1) * vulnSpacing) / 2);
        } else {
            // 如果没有其他节点，则将漏洞节点放在默认位置
            startY = 150;
        }

        for (let i = 0; i < vulnCount; i++) {
            const vuln = props.vulnerabilityData[i];
            const vulnNode = {
                id: `vuln-${vuln.vuln_id || i}`,
                type: 'custom',
                position: {
                    x: xPositions.vulnerability,
                    y: startY + i * vulnSpacing,
                },
                data: {
                    // 优先使用漏洞名称作为标题，其次才使用CWE ID
                    label: vuln.vuln_name || vuln.title || vuln.name || vuln.cwe_id || (vuln.description ? `${vuln.description.substring(0, 20)}...` : '未知漏洞'),
                    type: 'vulnerability',
                    severity: vuln.severity || 'medium',
                    status: vuln.status || 'unresolved',
                    source: vuln.source || '未知',
                    security_capability_name: vuln.security_capability_name || '未知能力',
                    foundTime: vuln.created_at || new Date().toISOString(),
                },
            };
            nodes.push(vulnNode);
            vulnNodes.push(vulnNode);

            // 如果有软件成分，连接软件成分到漏洞
            if (ingredientNodes.length > 0) {
                // 连接到最相关的软件成分（这里简单地连接到第一个）
                const sourceNode = ingredientNodes[i % ingredientNodes.length];
                edges.push({
                    id: `e-ing-${sourceNode.id}-vuln-${vulnNode.id}`,
                    source: sourceNode.id,
                    target: vulnNode.id,
                    animated: true,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 15,
                        height: 15,
                        color: '#d9534f',
                    },
                    style: { stroke: '#d9534f', strokeWidth: 1.5 },
                    type: 'default',
                    sourceHandle: 'right',
                    targetHandle: 'left',
                });
            } else if (carrierNodes.length > 0) {
                // 如果没有软件成分但有载体，直接连接载体到漏洞
                edges.push({
                    id: `e-carrier-vuln-${vulnNode.id}`,
                    source: carrierNodes[carrierNodes.length - 1].id,
                    target: vulnNode.id,
                    animated: true,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 15,
                        height: 15,
                        color: '#d9534f',
                    },
                    style: { stroke: '#d9534f', strokeWidth: 1.5 },
                    type: 'default',
                    sourceHandle: 'right',
                    targetHandle: 'left',
                });
            }
        }
    }

    return [...nodes, ...edges];
};

// 更新Flow元素
const updateFlowElements = () => {
    elements.value = generateFlowElements();

    // 在下一个渲染周期强制重新自适应视图
    setTimeout(() => {
        if (flowInstance.value) {
            flowInstance.value.fitView({
                padding: 0.2,
                minZoom: 0.1,
                maxZoom: 2,
                includeHiddenNodes: false,
                duration: 800,
            });
        }
    }, 100);
};

// 处理节点变化事件
const handleNodesChange = () => {
    // 当节点改变时触发自适应
    if (flowInstance.value) {
        flowInstance.value.fitView({
            padding: 0.2,
            duration: 200,
        });
    }
};

// 初始化完成后保存实例
const onInit = (instance) => {
    flowInstance.value = instance;
    console.log('Vue Flow 初始化完成');

    // 确保图表正确自适应
    setTimeout(() => {
        if (flowInstance.value) {
            flowInstance.value.fitView({
                padding: 0.2,
                duration: 400,
            });
        }
    }, 300);
};

// 用于图标显示的载体类型判断函数
const getCarrierTypeFromDescription = (description) => {
    if (!description) return '';

    if (description.includes('代码仓库')) {
        return 'code_repo';
    } if (description.includes('服务地址')) {
        return 'service_address';
    } if (description.includes('主机')) {
        return 'host';
    }
    return '';
};

// 事件处理函数
const onNodeClick = (event, node) => {
    console.log('Node clicked:', node);
    // 这里可以处理节点点击事件，例如显示详细信息
};

const onPaneClick = () => {
    console.log('Pane clicked');
    // 这里可以处理画布点击事件，例如取消节点选择
};

// 监听props变化，更新视图
watch(() => [
    props.applicationInfo,
    props.basicInfo,
    props.ingredientList,
    props.vulnerabilityData,
], () => {
    updateFlowElements();
}, { deep: true });

// 窗口大小改变时自适应
const handleResize = () => {
    if (flowInstance.value) {
        flowInstance.value.fitView({
            padding: 0.2,
            duration: 300,
        });
    }
};

// 修饰键事件处理函数
const handleKeyDown = (event) => {
    // 区分处理macOS和Windows的修饰键
    if (isMac.value) {
        // macOS下只用Command(Meta)键激活
        if (event.metaKey && !event.repeat) {
            isModifierKeyPressed.value = true;
            if (flowInstance.value) {
                flowInstance.value.setInteractive(true);
            }
        }
    } else if (event.ctrlKey && !event.repeat) {
        // Windows/Linux下用Ctrl键激活
        isModifierKeyPressed.value = true;
        if (flowInstance.value) {
            flowInstance.value.setInteractive(true);
        }
    }
};

const handleKeyUp = (event) => {
    // 区分处理macOS和Windows的修饰键释放
    if (isMac.value && event.key === 'Meta') {
        // macOS下释放Command键
        isModifierKeyPressed.value = false;
        if (flowInstance.value) {
            flowInstance.value.setInteractive(false);
        }
    } else if (!isMac.value && event.key === 'Control') {
        // Windows/Linux下释放Ctrl键
        isModifierKeyPressed.value = false;
        if (flowInstance.value) {
            flowInstance.value.setInteractive(false);
        }
    }
};

// 组件挂载时更新一次
onMounted(() => {
    updateFlowElements();
    window.addEventListener('resize', handleResize);

    // 添加键盘事件监听
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 默认设置为非交互模式（除非按下修饰键）
    if (flowInstance.value) {
        flowInstance.value.setInteractive(false);
    }
});

// 组件卸载时移除事件监听
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);

    // 移除键盘事件监听
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
});

// 格式化日期时间为更友好的格式 (YYYY-MM-DD HH:MM)
const formatDateTime = (dateString) => {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return '-'; // 替换为 Number.isNaN

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
        return '-';
    }
};

// 获取处置状态文本
const getStatusText = (status) => {
    if (!status) return '未处置';

    switch (status.toLowerCase()) {
        case 'resolved':
            return '已处置';
        case 'processing':
            return '处置中';
        case 'ignored':
            return '已忽略';
        case 'unresolved':
        default:
            return '未处置';
    }
};

// 获取处置状态样式类
const getStatusClass = (status, type = 'text') => {
    if (!status) return type === 'dot' ? 'status-dot-warning' : 'text-[#fa8c16]';

    const statusClasses = {
        resolved: type === 'dot' ? 'status-dot-success' : 'text-[#52c41a]',
        processing: type === 'dot' ? 'status-dot-processing' : 'text-[#6C87FF]',
        ignored: type === 'dot' ? 'status-dot-default' : 'text-[#8c8c8c]',
        unresolved: type === 'dot' ? 'status-dot-warning' : 'text-[#fa8c16]',
    };

    return statusClasses[status.toLowerCase()] || statusClasses.unresolved;
};

// 自定义控制按钮功能
const zoomIn = () => {
    if (flowInstance.value) {
        flowInstance.value.zoomIn({ duration: 300 });
    }
};

const zoomOut = () => {
    if (flowInstance.value) {
        flowInstance.value.zoomOut({ duration: 300 });
    }
};

const fitView = () => {
    if (flowInstance.value) {
        flowInstance.value.fitView({
            padding: 0.2,
            includeHiddenNodes: false,
            duration: 800,
        });
    }
};

// 切换全屏模式
const toggleFullscreen = () => {
    if (!flowContainer.value) return;

    isFullscreen.value = !isFullscreen.value;

    // 更新交互模式状态
    if (isFullscreen.value) {
        isModifierKeyPressed.value = true;
        if (flowInstance.value) {
            flowInstance.value.setInteractive(true);
        }
    } else {
        isModifierKeyPressed.value = false;
        if (flowInstance.value) {
            flowInstance.value.setInteractive(false);
        }
    }

    // 重新适配视图大小
    setTimeout(() => {
        fitView();
    }, 300);
};
</script>

<style scoped>
/* 可视化视图样式 */
.vue-flow-container {
    width: 100%;
    height: 700px;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    position: relative;
    transition: height 0.3s ease;
}

/* 页面内全屏样式 */
.page-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    padding: 16px;
    border-radius: 0;
    background-color: #fff;
}

.page-fullscreen .vue-flow-container {
    border-radius: 0;
    border: none;
}

/* 图标容器样式 */
.icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    padding: 0; /* 清除内部边距 */
    overflow: hidden; /* 确保内容不溢出 */
}

.icon-container :deep(svg) {
    width: 24px !important;
    height: 24px !important;
    display: block; /* 消除inline元素的基线对齐问题 */
}

/* 不同类型节点的图标样式 */
.icon-organization {
    background-color: #1976D2; /* 深蓝色 */
}

.icon-business {
    background-color: #388E3C; /* 绿色 */
}

.icon-application {
    background-color: #4FC3F7; /* 青色 */
}

.icon-carrier {
    background-color: #7E57C2; /* 紫色 */
}

.icon-ingredient {
    background-color: #8e44ad; /* 深紫色 */
}

.icon-vulnerability {
    background-color: #FF7043; /* 橙红色 */
}

/* 节点卡片样式 */
.custom-node {
    min-width: 200px;
    transition: all 0.2s ease;
}

.custom-node:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

/* Vue Flow 边标签样式 */
:deep(.vue-flow__edge-text) {
    background-color: rgba(245, 245, 245, 0.9);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    color: #666;
    border: 1px solid #e0e0e0;
}

:deep(.vue-flow__edge) {
    cursor: pointer;
}

:deep(.vue-flow__edge path) {
    stroke: #bbb;
    stroke-width: 1.5;
}

:deep(.vue-flow__edge.animated path) {
    stroke-dasharray: 5;
    animation: dashdraw 0.5s linear infinite;
}

@keyframes dashdraw {
    from {
        stroke-dashoffset: 10;
    }
}

/* Vue Flow 连接点样式 */
:deep(.vue-flow__handle) {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    z-index: 10;
    opacity: 0;
    background: transparent;
    border: none;
}

:deep(.vue-flow__handle-left) {
    left: -8px;
}

:deep(.vue-flow__handle-right) {
    right: -8px;
}

/* 贝塞尔曲线调整 */
:deep(.vue-flow__edge-path) {
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* 边标签样式 */
:deep(.vue-flow__edge-text) {
    background-color: rgba(245, 245, 245, 0.9);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    color: #666;
    border: 1px solid #e0e0e0;
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

/* 漏洞节点特殊样式 */
.vulnerability-node {
    min-width: 300px;
    width: 340px;
    padding: 0;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid rgba(255, 112, 67, 0.3) !important; /* 浅红色边框 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.vulnerability-node:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-3px);
    border-color: rgba(255, 112, 67, 0.5) !important; /* 加深边框颜色 */
}

/* 漏洞等级样式 */
.vuln-level-badge {
    color: white;
    font-size: 12px;
    padding: 1px 6px;
    border-radius: 10px;
    font-weight: 500;
}

/* 分隔符 */
.divider {
    width: 1px;
    height: 12px;
    background-color: #e0e0e0;
}

/* 来源样式 */
.source-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #722ed1;
}

/* 状态点样式 */
.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-dot-success {
    background-color: #52c41a;
}

.status-dot-processing {
    background-color: #6C87FF;
}

.status-dot-warning {
    background-color: #fa8c16;
}

.status-dot-default {
    background-color: #8c8c8c;
}

/* 漏洞元数据 */
.vuln-meta {
    padding: 2px 0;
}

.vuln-meta-item {
    margin-bottom: 8px;
}

/* 截断超长文本 */
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 自定义控制按钮容器 */
.custom-controls-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    pointer-events: none;
}

.controls-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
}

/* 自定义控制按钮 */
.custom-controls {
    display: flex;
    gap: 8px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 6px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-btn {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background-color: white;
    border: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
}

.control-btn:hover {
    background-color: #f5f5f5;
    color: #6C87FF;
}

.control-btn:active {
    transform: translateY(1px);
}

/* 去除默认的Controls组件 */
:deep(.vue-flow__controls) {
    display: none;
}

/* 图标相关样式 */
.icon-inner {
    width: 24px;
    height: 24px;
    display: block;
}

.icon-inner-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

/* 漏洞等级标签样式 */
.severity-tag {
    font-size: 12px;
    padding: 1px 8px;
    border-radius: 10px;
    font-weight: 500;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 提示用户使用修饰键交互的提示框，与控制按钮一起显示/隐藏 */
.modifier-key-hint {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
}

.visible {
    opacity: 1;
    pointer-events: all;
}

.hint-content {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 6px 12px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: center;
    white-space: nowrap;
}
</style>
