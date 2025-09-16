<template>
    <a-spin :spinning="globalState.loading" :indicator="indicator">
        <div class="overflow-auto p-6 bg-white"
             style="height: calc(100vh - 56px - 48px);border-top: 8px solid #F2F2F2;">

            <!-- 空状态引导页面 -->
            <div v-if="isEmpty" class="empty-state-container">
                <div class="empty-state-content">
                    <div class="empty-state-text">
                        <div class="title-section">
                            <h2 class="empty-state-title">数据接入</h2>
                            <div class="title-subtitle">通过插件连接各种数据源，实现数据统一管理</div>
                        </div>

                        <div class="empty-state-steps">
                            <div class="step-section">
                                <div class="step-header">
                                    <div class="step-number">
                                        <span class="number-text">1</span>
                                    </div>
                                    <div class="step-content">
                                        <div class="step-title">完成数据插件的创建</div>
                                        <div class="step-description">
                                            插件是连接数据源的"适配器"，您可以选择以下任一方式获取：
                                        </div>
                                    </div>
                                </div>
                                <div class="step-options">
                                    <div class="option-item">
                                        <div class="option-dot"></div>
                                        <span class="option-text">从模版快速完成插件创建（推荐）</span>
                                    </div>
                                    <div class="option-item">
                                        <div class="option-dot"></div>
                                        <span class="option-text">通过OpenAPI、SDK实现自定义插件创建</span>
                                    </div>
                                </div>
                            </div>

                            <div class="step-section">
                                <div class="step-header">
                                    <div class="step-number">
                                        <span class="number-text">2</span>
                                    </div>
                                    <div class="step-content">
                                        <div class="step-title">创建插件执行任务</div>
                                        <div class="step-description">
                                            完成插件创建后，前往「任务管理」创建执行计划
                                        </div>
                                    </div>
                                </div>
                                <div class="step-options">
                                    <div class="option-item">
                                        <div class="option-dot"></div>
                                        <span class="option-text">选择已创建的插件</span>
                                    </div>
                                    <div class="option-item">
                                        <div class="option-dot"></div>
                                        <span class="option-text">灵活配置执行方式，实现数据自动化同步</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="empty-state-buttons">
                            <a-button @click="openTemplateModal = true" class="empty-state-button primary" type="primary">
                                <InboxOutlined />
                                <span>从模版创建</span>
                            </a-button>
                            <a-button @click="goToCreatePage" class="empty-state-button secondary">
                                创建
                            </a-button>
                        </div>
                    </div>
                    <div class="empty-state-image">
                        <img src="~assets/img/create-data.png" alt="数据接入引导" />
                    </div>
                </div>
            </div>

            <!-- 原有的插件列表内容 -->
            <div v-else>
                <div class="flex items-center justify-between">
                    <div class="font-medium">已创建插件（{{pluginList.length}}）</div>
                    <div class="flex gap-3 justify-end">
                        <a-button @click="openTemplateModal = true" class="base-button template-button" type="primary">
                            <InboxOutlined />
                            <span>从模板创建</span>
                        </a-button>
                        <a-button @click="goToCreatePage" class="base-button">创建</a-button>
                    </div>
                </div>

                <div class="flex flex-wrap justify-start gap-6 mt-6">
                    <div class="plugin-item box-border" v-for="plugin in pluginList" :key="plugin.plug_name" @click="goToViewPage(plugin)" :style="{ backgroundImage: getPluginBackground(plugin.plug_data_type), backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: '0 0' }">
                        <div class="plugin-content">
                            <div class="flex justify-between items-center mb-3">
                                <img class="w-10 h-10 mr-2" :src="getPluginIcon(plugin.plug_data_type)" alt="">
                                <span class="h-[26px] px-[11px] text-xs leading-[26px]" style="border: 1px solid #E6E6E6; border-radius: 20px;">{{ getDataTypeName(plugin.plug_data_type) }}</span>
                            </div>
                            <div class="font-medium text-lg mb-2">{{ plugin.plug_name }}</div>
                            <div class="text-xs text-gray-500 plugin-desc mb-2">
                                {{ plugin.plug_desc || '暂无插件描述信息' }}
                            </div>
                            <div class="flex items-center justify-between text-[13px] font-normal text-[#666] pt-[6px] mt-auto" style="border-top: 1px solid #F2F2F2;">
                                <div>{{ getCreateMethod(plugin.plug_built_id) }}</div>
                                <div>{{ formatDate(plugin.created_at) }}</div>
                            </div>
                        </div>

                        <div class="plugin-actions" @click.stop>
                            <a-popover :overlayStyle="{ zIndex: 500 }"
                                       :overlayInnerStyle="{ padding: '6px 0px', width: '142px' }" placement="bottomLeft"
                                       :arrow="false">
                                <template #content>
                                    <div class="cursor-pointer">
                                        <div @click="goToEditPage(plugin)" class="table-operation-item px-6 py-2">
                                            <span>编辑</span>
                                        </div>
                                        <div class="table-operation-item text-error px-6 py-2"
                                             @click="canDeletePlugin(plugin.plug_market_id)">
                                            <span>删除</span>
                                        </div>
                                    </div>
                                </template>
                                <span class="icon-hover w-6 h-6 hover:bg-f2 cursor-pointer">
                                    <EllipsisOutlined class="text-3c text-base" />
                                </span>
                            </a-popover>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </a-spin>

    <!-- 使用模板库组件 -->
    <TemplateLibrary v-model="openTemplateModal" @select="handleTemplateSelect" />
</template>

<script setup lang='ts'>
import {
    ref, h, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { EllipsisOutlined, InboxOutlined } from '@ant-design/icons-vue';
import { indicator } from 'utils';
import { getPluginApi, delPluginApi, checkPluginDeleteApi } from 'api/data';
import { Modal } from 'ant-design-vue';
import organize from 'assets/img/organize.png';
import asset from 'assets/img/asset.png';
import danger from 'assets/img/danger.png';
import orgBackground from 'assets/img/org-back.png';
import assetBackground from 'assets/img/asset-back.png';
import dangerBackground from 'assets/img/danger-back.png';
import { editPluginData, pluginMarket } from '../constants';
import { globalState } from '@/store';
import { ROUTER_PATH } from '@/constants';
import { formatDate } from '@/utils';
import TemplateLibrary from './components/TemplateLibrary.vue';
import warningIcon from '/src/assets/svg/data/icon_warning_colorful-dm.svg';

const router = useRouter();
const openTemplateModal = ref(false);

// 跳转到创建页面
const goToCreatePage = () => {
    router.push({ path: ROUTER_PATH.pluginCreate });
};

// 跳转到查看页面
const goToViewPage = (plugin) => {
    // 将插件数据存储到全局状态中，供查看页面使用
    editPluginData.value = plugin;
    router.push({ path: ROUTER_PATH.pluginView.replace(':id', plugin.plug_market_id) });
};

// 跳转到编辑页面
const goToEditPage = (plugin) => {
    // 将插件数据存储到全局状态中，供编辑页面使用
    editPluginData.value = plugin;
    router.push({ path: ROUTER_PATH.pluginEdit.replace(':id', plugin.plug_market_id) });
};

// 处理模板选择
const handleTemplateSelect = (template) => {
    console.log('选择模板:', template);
    // 将模板数据存储到全局状态中，供创建页面使用
    editPluginData.value = {
        ...template,
        plug_name: template.name,
        plug_data_type: template.data_type, // 映射数据接入类型
        plug_type: 2, // 自定义类型
        plug_built_id: template.template_id, // 传递模板ID
        // 确保代码内容被传递
        default_code: template.default_code,
        code: template.code || template.default_code,
        plug_file_text: template.plug_file_text || template.default_code,
    };
    router.push({ path: ROUTER_PATH.pluginCreate });
};

// 插件数据列表
const pluginList = ref([]);

// 计算是否为空状态
const isEmpty = computed(() => pluginList.value.length === 0);

// 数据类型映射
const getDataTypeName = (dataType) => {
    const dataTypeMap = {
        organize: '组织架构 ',
        'organize-user': '组织成员',
        business: '业务系统',
        application: '应用',
        carrier: '应用载体',
        component: '软件成分',
        vuln: '漏洞',
    };
    return dataTypeMap[dataType] || '未知数据类型';
};

// 根据插件数据类型获取图标
const getPluginIcon = (dataType) => {
    const iconMap = {
        organize,
        'organize-user': organize,
        business: asset,
        application: asset,
        carrier: asset,
        component: asset,
        vuln: danger,
    };
    return iconMap[dataType] || asset; // 默认使用 asset 图标
};

// 根据插件数据类型获取背景图
const getPluginBackground = (dataType) => {
    const backgroundMap = {
        organize: `url(${orgBackground})`,
        'organize-user': `url(${orgBackground})`,
        business: `url(${assetBackground})`,
        application: `url(${assetBackground})`,
        carrier: `url(${assetBackground})`,
        component: `url(${assetBackground})`,
        vuln: `url(${dangerBackground})`,
    };
    return backgroundMap[dataType] || `url(${assetBackground})`; // 默认使用 asset 背景
};

// 获取创建方式
const getCreateMethod = (plugBuiltId) => (plugBuiltId ? '基于模版创建' : '自定义创建');

// 格式化创建时间
// const formatCreateTime = (timeStr) => {
//     if (!timeStr) return '2025-03-10 23:10:55';
//     // 如果有真实时间数据，可以在这里格式化
//     return timeStr;
// };

const getPluginDataHandle = async () => {
    try {
        const { data } = await getPluginApi();
        pluginMarket.value = data.data;
        pluginList.value = data.data || [];
        console.log('插件数据:', pluginList.value);
    } catch (error) {
        console.log(error);
    }
};
getPluginDataHandle();

const deletePluginHandle = async (id) => {
    try {
        await delPluginApi({ id });
        getPluginDataHandle();
    } catch (error) {
        console.log(error);
    }
};

// 判断能否删除插件
const canDeletePlugin = async (plugin_id) => {
    console.log('判断是否可以删除应用:', plugin_id);
    const { data } = await checkPluginDeleteApi(plugin_id);
    console.log('判断结果:', data);

    if (!data.data) {
        Modal.confirm({
            class: 'delete-confirm-modal',
            title: '确认删除此数据吗？',
            icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
                h('img', { src: warningIcon, alt: '信息图标' }),
            ]),
            content: '数据删除后将不可恢复，请谨慎操作！',
            async onOk() {
                try {
                    console.log('删除', plugin_id);
                    await deletePluginHandle(plugin_id);
                } catch {
                    return console.log('Oops errors!');
                }
            },
            onCancel() {

            },
        });
    } else {
        Modal.confirm({
            class: 'delete-confirm-modal',
            title: '无法删除',
            icon: h('span', { role: 'img', 'aria-label': 'exclamation-circle', class: 'anticon anticon-exclamation-circle' }, [
                h('img', { src: warningIcon, alt: '信息图标' }),
            ]),
            content: '该插件下存在执行任务，请先删除相关的执行任务后再删除插件',
            okCancel: false, // ✅ 去掉取消按钮
            okText: '确定',
            async onOk() {
                console.log('确定删除');
            },
            onCancel() { },
        });
    }
};
</script>

<style scoped>
/* 空状态样式 */
.empty-state-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    min-height: 580px;
}

.empty-state-content {
    display: flex;
    align-items: center;
    gap: 80px;
    max-width: 1100px;
    width: 100%;
}

.empty-state-text {
    flex: 1;
    max-width: 500px;
}

.title-section {
    margin-bottom: 32px;
}

.empty-state-title {
    font-size: 28px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 8px;
    margin-top: 0;
}

.title-subtitle {
    font-size: 16px;
    color: #8C8C8C;
    line-height: 1.5;
}

.empty-state-steps {
    margin-bottom: 32px;
}

.step-section {
    margin-bottom: 24px;
    position: relative;
}

.step-section:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 20px;
    top: 50px;
    bottom: -14px;
    width: 1px;
    background: linear-gradient(to bottom, #E8E8E8, transparent);
}

.step-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
}

.step-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #6C87FF 0%, #5A7AFF 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(108, 135, 255, 0.2);
}

.number-text {
    color: white;
    font-size: 16px;
    font-weight: 600;
}

.step-content {
    flex: 1;
    padding-top: 2px;
}

.step-title {
    color: #262626;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 8px;
}

.step-description {
    color: #8C8C8C;
    font-size: 15px;
    line-height: 1.6;
}

.step-options {
    margin-left: 56px;
}

.option-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    padding: 8px 0;
}

.option-dot {
    width: 6px;
    height: 6px;
    background-color: #6C87FF;
    border-radius: 50%;
    margin-right: 12px;
    margin-top: 8px;
    flex-shrink: 0;
}

.option-text {
    color: #595959;
    font-size: 15px;
    line-height: 1.6;
    flex: 1;
}

.empty-state-buttons {
    margin-top: 36px;
    display: flex;
    gap: 16px;
}

.empty-state-button {
    height: 44px;
    padding: 0 24px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
}

.empty-state-button.primary {
    background: linear-gradient(135deg, #6C87FF 0%, #5A7AFF 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(108, 135, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 6px;
}

.empty-state-button.primary :deep(.anticon) {
    font-size: 22px !important;
    width: 22px !important;
    height: 22px !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-state-button.primary:hover {
    background: linear-gradient(135deg, #5A7AFF 0%, #4A6DFF 100%);
    box-shadow: 0 4px 12px rgba(108, 135, 255, 0.3);
    transform: translateY(-1px);
}

.empty-state-button.secondary {
    background-color: #F8F9FA;
    color: #595959;
    border-color: #E8E8E8;
}

.empty-state-button.secondary:hover {
    background-color: #F0F0F0;
    color: #262626;
    border-color: #D9D9D9;
}

.empty-state-button :deep(.anticon) {
    font-size: 18px;
}

.empty-state-button.primary span {
    margin: 0 !important;
    padding: 0 !important;
}

.empty-state-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 40px;
}

.empty-state-image img {
    max-width: 100%;
    max-height: 420px;
    object-fit: contain;
    border-radius: 12px;
}

.plugin-item {
    @apply w-[32%] rounded pt-6 px-6 pb-4 flex flex-col border border-solid border-[#E6E6E699];
    height: 200px;
    transition: all 0.15s ease;
    position: relative;
    cursor: pointer;
    background-position: 12px 12px;
    background-repeat: no-repeat;
    background-size: 40px 40px;
    background-blend-mode: soft-light;
}

.plugin-item:nth-child(3n) {
    margin-right: 0;
}

.plugin-item:hover {
    @apply border-[#6C87FF] shadow-sm;
    /* background-color: #FAFAFA; */
    transform: translateY(-1px);
}

.plugin-content {
    @apply flex-1 min-w-0;
    display: flex;
    flex-direction: column;
    /* padding-right: 32px;  */
}

.plugin-desc {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    max-height: calc(1.4em * 2); /* 两行的最大高度 */
}

.plugin-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
}

.template-button {
    display: flex;
    align-items: center;
    font-weight: 500;
}

/* 增强图标样式 */
.template-button :deep(.anticon) {
    font-size: 16px;
    margin-right: 2px;
}
</style>
