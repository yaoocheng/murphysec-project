<template>
    <a-modal
        :open="modelValue"
        :title="null"
        :width="1400"
        :footer="null"
        :bodyStyle="{ padding: '0' }"
        :closable="false"
        :wrapClassName="'template-library-modal'"
        :centered="true"
        @update:open="$emit('update:modelValue', $event)"
        @ok="handleOk"
    >
        <!-- 模板库列表视图 -->
        <div v-if="currentView === 'list'" class="template-list-view">
            <!-- 自定义头部 -->
            <div class="modal-header">
                <div class="modal-header-content">
                    <div class="modal-title">模板库</div>
                    <div class="modal-description">选择合适的模板快速创建插件，提升数据接入效率</div>
                </div>
                <button class="modal-close-btn" @click="$emit('update:modelValue', false)">
                    <CloseOutlined />
                </button>
            </div>

            <div class="modal-body">
                <!-- 固定区域：搜索框和分类标签 -->
                <div class="fixed-section">
                    <!-- 搜索框 -->
                    <div class="mb-4">
                        <a-input
                            v-model:value="searchText"
                            placeholder="搜索模板..."
                            class="search-input"
                            allow-clear
                        >
                            <template #prefix>
                                <SearchOutlined class="text-gray-400" />
                            </template>
                        </a-input>
                    </div>

                    <!-- 分类标签 -->
                    <div class="mb-6">
                        <a-tag
                            v-for="category in categories"
                            :key="category.type"
                            :class="['category-tag', selectedCategory === category.type ? 'category-tag-selected' : '']"
                            @click="selectedCategory = category.type"
                        >
                            {{ category.name }}
                            <span class="ml-1 text-xs">{{ category.count }}</span>
                        </a-tag>
                    </div>
                </div>

                <!-- 可滚动区域：模板列表 -->
                <div class="scrollable-section">
                    <div class="template-grid">
                        <div
                            v-for="template in filteredTemplates"
                            :key="template.template_id"
                            class="template-card"
                            @click="selectTemplate(template)"
                        >
                            <!-- 类型标签 -->
                            <div :class="['plugin-type-badge', `plugin-type-${template.type}`]">
                                {{ getPluginTypeText(template.type) }}
                            </div>

                            <div class="template-content">
                                <div class="template-header">
                                    <div class="template-icon">
                                        <div :class="['icon-wrapper', getIconClass(template.type)]">
                                            <component :is="getIconComponent(template.type)" class="icon" />
                                        </div>
                                    </div>
                                    <div class="template-info">
                                        <div class="template-title">
                                            {{ template.name }}
                                        </div>
                                        <div class="template-tags">
                                            <template v-for="(tag, index) in template.tags || []">
                                                <span
                                                    v-if="tag && tag.trim()"
                                                    class="template-tag"
                                                    :key="index"
                                                >
                                                    {{ tag }}
                                                </span>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <div class="template-desc">{{ template.description }}</div>
                            </div>

                            <div class="template-footer">
                                <span class="template-author">{{ template.author }}</span>
                                <div class="version-info">
                                    <TagOutlined class="version-icon" />
                                    <span class="template-version">{{ template.version }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分页组件 -->
                    <div class="pagination-section" v-if="total > 0">
                        <a-pagination
                            v-if="total > pageSize"
                            v-model:current="currentPage"
                            :total="total"
                            :page-size="pageSize"
                            :show-size-changer="false"
                            :show-quick-jumper="false"
                            :show-total="(total, range) => `共 ${total} 个模板`"
                            @change="handlePageChange"
                        />
                        <div v-else class="pagination-info">
                            共 {{ total }} 个模板
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 模板预览详情视图 -->
        <div v-else-if="currentView === 'detail'" class="template-detail-view">
            <!-- 详情页头部 -->
            <div class="detail-header">
                <div class="detail-header-content">
                    <button class="back-btn" @click="backToList">
                        <ArrowLeftOutlined />
                        返回模板库
                    </button>

                    <div class="header-divider"></div>

                    <div class="template-info-section">
                        <div class="template-icon">
                            <div :class="['icon-wrapper', getIconClass(selectedTemplate.type)]">
                                <component :is="getIconComponent(selectedTemplate.type)" class="icon" />
                            </div>
                        </div>
                        <div class="template-details">
                            <div class="template-name">{{ selectedTemplate.name }}</div>
                            <div class="template-meta-line">
                                <div class="author-info">
                                    <UserOutlined class="author-icon" />
                                    <span class="template-author">{{ selectedTemplate.author }}</span>
                                </div>
                                <div class="version-info">
                                    <TagOutlined class="version-icon" />
                                    <span class="template-version">{{ selectedTemplate.version }}</span>
                                    <div :class="['plugin-type-tag', `plugin-type-${selectedTemplate.type}`]">
                                        {{ getPluginTypeText(selectedTemplate.type) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="modal-close-btn" @click="$emit('update:modelValue', false)">
                    <CloseOutlined />
                </button>
            </div>

            <!-- 详情页主体 -->
            <div class="detail-body">
                <!-- 左侧信息详情 -->
                <div class="detail-left">
                    <!-- 模板说明 -->
                    <div class="detail-section">
                        <h3 class="section-title">模板说明</h3>
                        <div class="section-content">
                            <p>{{ selectedTemplate.description }}</p>
                        </div>
                    </div>

                    <!-- 功能说明 -->
                    <div class="detail-section">
                        <h3 class="section-title">功能说明</h3>
                        <div class="section-content">
                            <MarkDown :text="selectedTemplate.function_description" />
                        </div>
                    </div>

                    <!-- 使用说明 -->
                    <div class="detail-section">
                        <h3 class="section-title">使用说明</h3>
                        <div class="section-content">
                            <MarkDown :text="selectedTemplate.usage_guide" />
                        </div>
                    </div>

                    <!-- 相关标签 -->
                    <div class="detail-section">
                        <h3 class="section-title">相关标签</h3>
                        <div class="section-content">
                            <div class="template-tags">
                                <template v-for="(tag, index) in selectedTemplate.tags || []">
                                    <span
                                        v-if="tag && tag.trim()"
                                        class="template-tag"
                                        :key="index"
                                    >
                                        {{ tag }}
                                    </span>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧核心交互区 -->
                <div class="detail-right">
                    <!-- 配置型模板 -->
                    <div v-if="selectedTemplate.type === 'config'" class="config-section">
                        <h3 class="section-title">配置参数</h3>
                        <div v-if="selectedTemplate.required_params_schema?.length" class="params-info-list">
                            <div
                                v-for="param in selectedTemplate.required_params_schema"
                                :key="param.key"
                                class="param-info-item"
                            >
                                <div class="param-info-header">
                                    <div class="param-name">
                                        <span class="param-label">{{ param.label }}</span>
                                        <span v-if="param.required === true" class="required-mark">*</span>
                                    </div>
                                    <span class="param-type-badge">{{ getParamTypeText(param.type) }}</span>
                                </div>

                                <div class="param-info-details">
                                    <div class="param-key">参数名：<code>{{ param.key }}</code></div>
                                    <div v-if="param.desc" class="param-description">{{ param.desc }}</div>
                                    <div v-if="param.default || param.value" class="param-default">
                                        默认值：<code>{{ param.default || param.value }}</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="no-params-info">
                            <div class="no-params-content">
                                <div class="no-params-icon">⚙️</div>
                                <div class="no-params-text">此配置型模板无需额外配置参数</div>
                                <div class="no-params-desc">可直接使用，无需额外配置</div>
                            </div>
                        </div>
                    </div>

                    <!-- 代码型模板 -->
                    <div v-else-if="selectedTemplate.type === 'code'" class="code-section">
                        <h3 class="section-title">模板代码</h3>
                        <div class="code-preview">
                            <CodeEditor
                                :model-value="selectedTemplate.default_code || '# 暂无模板代码'"
                                language="python"
                                :readonly="true"
                                :max-height="'600px'"
                                theme="dark"
                                placeholder="暂无模板代码"
                            />
                        </div>
                    </div>

                    <!-- 通用型模板 -->
                    <div v-else class="common-section">
                        <h3 class="section-title">模板信息</h3>
                        <div class="common-info">
                            <p>这是一个通用型模板，适用于多种场景。</p>
                            <p>您可以基于此模板快速创建插件项目。</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 详情页底部 -->
            <div class="detail-footer">
                <div class="footer-left">
                    <div class="footer-info">
                        <span class="info-dot"></span>
                        <span class="info-text">选择此模板将为您创建一个预配置的插件项目</span>
                    </div>
                </div>
                <div class="footer-right">
                    <a-button @click="backToList">返回模板库</a-button>
                    <a-button type="primary" @click="createFromTemplate">
                        使用此模板创建
                    </a-button>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import {
    ref, computed, onMounted, watch,
} from 'vue';
import {
    SearchOutlined, CloseOutlined, SettingOutlined, CodeOutlined, AppstoreOutlined, ArrowLeftOutlined, UserOutlined, TagOutlined,
} from '@ant-design/icons-vue';
import MarkDown from '@/components/MarkDown.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import { getPluginTempApi } from '@/api/data';

const props = defineProps({
    modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'select']);

const searchText = ref('');
const selectedCategory = ref('all');
const templates = ref([]);
const loading = ref(false);
const currentView = ref('list'); // 'list' | 'detail'
const selectedTemplate = ref(null);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(9);

// 根据插件类型获取图标组件
const getIconComponent = (type) => {
    switch (type) {
        case 'config':
            return SettingOutlined;
        case 'code':
            return CodeOutlined;
        default:
            return AppstoreOutlined;
    }
};

// 根据插件类型获取图标样式类
const getIconClass = (type) => {
    switch (type) {
        case 'config':
            return 'config-icon';
        case 'code':
            return 'code-icon';
        default:
            return 'common-icon';
    }
};

// 获取插件类型文本
const getPluginTypeText = (type) => {
    switch (type) {
        case 'config':
            return '配置型';
        case 'code':
            return '代码型';
        default:
            return '通用型';
    }
};

// 获取参数类型文本
const getParamTypeText = (type) => {
    switch (type) {
        case 'password':
            return '密码';
        case 'number':
        case 'integer':
            return '数字';
        case 'select':
            return '选择';
        case 'textarea':
            return '文本区域';
        case 'text':
        case 'string':
            return '文本';
        default:
            return '文本';
    }
};

// 过滤模板（不分页）
const allFilteredTemplates = computed(() => {
    let filtered = templates.value;

    // 按分类过滤
    if (selectedCategory.value !== 'all') {
        filtered = filtered.filter((template) => template.data_type === selectedCategory.value);
    }

    // 按搜索文本过滤
    if (searchText.value) {
        const search = searchText.value.toLowerCase();
        filtered = filtered.filter((template) => template.name.toLowerCase().includes(search)
            || template.description.toLowerCase().includes(search)
            || (template.tags && template.tags.some((tag) => tag.toLowerCase().includes(search))));
    }

    return filtered;
});

// 分页后的模板
const filteredTemplates = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return allFilteredTemplates.value.slice(start, end);
});

// 总数据量
const total = computed(() => allFilteredTemplates.value.length);

// 计算分类数据
const categories = computed(() => {
    // 基于搜索过滤后的结果计算分类
    let baseTemplates = templates.value;

    // 如果有搜索文本，先按搜索过滤
    if (searchText.value) {
        const search = searchText.value.toLowerCase();
        baseTemplates = baseTemplates.filter((template) => template.name.toLowerCase().includes(search)
            || template.description.toLowerCase().includes(search)
            || (template.tags && template.tags.some((tag) => tag.toLowerCase().includes(search))));
    }

    // 计算每个类型的数量
    const typeCounts = baseTemplates.reduce((acc, template) => {
        acc[template.data_type] = (acc[template.data_type] || 0) + 1;
        return acc;
    }, {});

    // 构建分类数据
    const allCount = baseTemplates.length;

    const result = [
        { type: 'all', name: '全部', count: allCount },
    ];

    // 添加其他分类
    Object.keys(typeCounts).forEach((type) => {
        // 根据类型获取名称，与创建插件页面保持一致
        let name = '其他';
        if (type === 'organize') name = '组织架构';
        else if (type === 'business') name = '业务系统';
        else if (type === 'carrier') name = '应用载体';
        else if (type === 'organize-user') name = '组织成员';
        else if (type === 'component') name = '软件成分';
        else if (type === 'vuln') name = '漏洞';
        else if (type === 'application') name = '应用';

        result.push({
            type,
            name,
            count: typeCounts[type],
        });
    });

    return result;
});

// 视图切换方法
const selectTemplate = (template) => {
    selectedTemplate.value = template;
    currentView.value = 'detail';
};

const backToList = () => {
    currentView.value = 'list';
    selectedTemplate.value = null;
};

const createFromTemplate = () => {
    emit('select', selectedTemplate.value);
    emit('update:modelValue', false);
};

// 分页处理
const handlePageChange = (page) => {
    currentPage.value = page;
};

// 重置分页（搜索或分类变化时）
const resetPagination = () => {
    currentPage.value = 1;
};

// 处理确认
const handleOk = () => {
    emit('update:modelValue', false);
};

// 获取模板数据
const fetchTemplates = async () => {
    loading.value = true;
    try {
        const { data } = await getPluginTempApi();
        // 将API返回的数据转换为模板格式
        templates.value = data.data.map((item) => ({
            template_id: item.plug_built_id,
            name: item.plug_name,
            type: item.plug_type,
            data_type: item.plug_data_type,
            description: item.plug_desc,
            function_description: item.func_desc,
            tags: item.tags || [],
            usage_guide: item.usage_guide,
            version: item.version,
            author: item.author,
            required_params_schema: item.required_params_schema || [],
            default_code: item.plug_code,
            updated_at: item.updated_at,
        }));
    } catch (error) {
        console.error('获取模板数据失败:', error);
    } finally {
        loading.value = false;
    }
};

// 监听搜索和分类变化，重置分页
watch([searchText, selectedCategory], () => {
    resetPagination();
});

// 监听模态框开启/关闭，重置视图状态
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        // 打开模态框时，确保回到列表视图
        currentView.value = 'list';
        selectedTemplate.value = null;
    }
});

onMounted(() => {
    fetchTemplates();
});
</script>

<style>
/* 全局样式 - 仅影响模板库弹窗 */
.template-library-modal .ant-modal-content {
    padding: 0 !important;
    overflow: hidden;
    border-radius: 8px;
}

.template-library-modal .ant-modal-body {
    padding: 0 !important;
}
</style>

<style scoped>
/* 弹窗头部样式 */
.modal-header {
    background-color: #F7F8FA;
    padding: 24px;
    border-bottom: 1px solid #E5E6EB;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header-content {
    flex: 1;
}

.modal-title {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    color: #1D2129;
    margin-bottom: 4px;
}

.modal-description {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #86909C;
}

.modal-close-btn {
    background: transparent;
    border: none;
    font-size: 16px;
    color: #86909C;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    transition: all 0.2s;
}

.modal-close-btn:hover {
    background-color: rgba(0, 0, 0, 0.04);
    color: #1D2129;
}

/* 弹窗内容区域 - 修复高度计算 */
.modal-body {
    display: flex;
    flex-direction: column;
    height: calc(85vh - 88px); /* 减去头部高度 */
    max-height: calc(900px - 88px);
    min-height: calc(700px - 88px);
}

/* 固定区域 */
.fixed-section {
    padding: 24px 24px 0 24px;
    flex-shrink: 0;
}

/* 可滚动区域 */
.scrollable-section {
    flex: 1;
    overflow-y: auto;
    padding: 0 24px 24px 24px;
}

/* 详情页面样式 - 使用相同的高度设置 */
.template-detail-view {
    display: flex;
    flex-direction: column;
    height: 85vh;
    max-height: 900px;
    min-height: 700px;
}

/* 模板列表视图 - 确保使用相同的高度设置 */
.template-list-view {
    display: flex;
    flex-direction: column;
    height: 85vh;
    max-height: 900px;
    min-height: 700px;
}

.detail-header {
    background-color: #F7F8FA;
    padding: 16px 24px;
    border-bottom: 1px solid #E5E6EB;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.detail-header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.back-btn {
    background: transparent;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 14px;
    color: #344054;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s;
}

.back-btn:hover {
    background-color: #E8E8E8;
}

.header-divider {
    width: 1px;
    height: 24px;
    background-color: #E5E6EB;
}

.template-info-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

.template-icon {
    margin-right: 12px;
    flex-shrink: 0;
}

.icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon {
    font-size: 20px;
    color: white;
}

.config-icon {
    background-color: #4080ff;
}

.code-icon {
    background-color: #7265e6;
}

.common-icon {
    background-color: #00b96b;
}

.template-details {
    flex: 1;
}

.template-name {
    font-size: 18px;
    font-weight: 600;
    color: #1D2129;
    margin-bottom: 4px;
}

.template-meta-line {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
    font-size: 14px;
    color: #86909C;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 6px;
}

.author-icon {
    font-size: 16px;
    color: #86909C;
}

.version-info {
    display: flex;
    align-items: center;
    gap: 6px;
}

.template-author {
    color: #595959;
    font-size: 14px;
}

.template-version {
    color: #8c8c8c;
    font-size: 14px;
}

/* 头部插件类型标签样式 */
.plugin-type-tag {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.plugin-type-tag.plugin-type-config {
    background-color: rgba(24, 144, 255, 0.1);
    color: #1890ff;
    border: 1px solid rgba(24, 144, 255, 0.2);
}

.plugin-type-tag.plugin-type-code {
    background-color: rgba(114, 46, 209, 0.1);
    color: #722ed1;
    border: 1px solid rgba(114, 46, 209, 0.2);
}

.plugin-type-tag.plugin-type-common {
    background-color: rgba(82, 196, 26, 0.1);
    color: #52c41a;
    border: 1px solid rgba(82, 196, 26, 0.2);
}

.detail-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    height: calc(85vh - 88px - 72px); /* 减去头部和底部高度 */
    max-height: calc(900px - 88px - 72px);
    min-height: calc(700px - 88px - 72px);
}

.detail-left {
    flex: 0 0 58%;
    padding: 24px;
    overflow-y: auto;
    border-right: 1px solid #E5E6EB;
}

.detail-right {
    flex: 0 0 42%;
    padding: 24px;
    overflow-y: auto;
    background-color: #FAFBFC;
}

.detail-section {
    background-color: #FAFBFC;
    border: 1px solid #E5E6EB;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
}

.detail-section:last-child {
    margin-bottom: 0;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1D2129;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #E5E6EB;
}

.section-content {
    font-size: 14px;
    line-height: 1.6;
    color: #4E5969;
}

.section-content p {
    margin: 0;
    line-height: 1.6;
}

/* 参数信息列表样式 */
.params-info-list {
    .param-info-item {
        margin-bottom: 16px;
        padding: 16px;
        border: 1px solid #E5E6EB;
        border-radius: 8px;
        background: #FAFBFC;

        .param-info-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            .param-name {
                display: flex;
                align-items: center;
                gap: 8px;

                .param-label {
                    font-weight: 600;
                    color: #1D2129;
                    font-size: 14px;
                }

                .required-mark {
                    color: #ff4d4f;
                    margin-left: 4px;
                    font-weight: 600;
                    font-size: 16px;
                }
            }

            .param-type-badge {
                background: #1890ff;
                color: white;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
            }
        }

        .param-info-details {
            .param-key,
            .param-description,
            .param-default {
                margin-bottom: 6px;
                font-size: 13px;
                line-height: 1.5;
            }

            .param-key {
                color: #595959;

                code {
                    background: #F2F3F5;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    color: #d46b08;
                }
            }

            .param-description {
                color: #666;
            }

            .param-default {
                color: #595959;

                code {
                    background: #e6f7ff;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    color: #1890ff;
                }
            }
        }
    }
}

/* 无参数信息样式 */
.no-params-info {
    text-align: center;
    padding: 40px;
    background: #FAFBFC;
    border: 1px dashed #E5E6EB;
    border-radius: 8px;

    .no-params-content {
        .no-params-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }

        .no-params-text {
            color: #595959;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .no-params-desc {
            color: #86909C;
            font-size: 12px;
        }
    }
}

/* 代码预览样式 */
.code-preview {
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #E5E6EB;
    background-color: #282c34; /* 深色背景 */
}

.code-preview :deep(.code-editor-wrapper) {
    border-radius: 6px;
}

.code-preview :deep(.cm-editor) {
    border: none;
    background-color: #282c34; /* 深色背景 */
}

.code-preview :deep(.cm-content) {
    background-color: #282c34; /* 深色背景 */
    font-size: 13px;
    line-height: 1.6;
}

.code-preview :deep(.cm-scroller) {
    max-height: 600px;
}

.code-preview :deep(.cm-gutters) {
    background-color: #282c34; /* 深色背景 */
    border: none;
}

.code-preview :deep(.cm-lineNumbers) {
    color: #5c6370;
    background-color: transparent;
}

/* 通用信息样式 */
.common-info p {
    margin-bottom: 12px;
    line-height: 1.6;
}

.common-info p:last-child {
    margin-bottom: 0;
}

/* 详情页底部 */
.detail-footer {
    padding: 16px 24px;
    border-top: 1px solid #E5E6EB;
    background-color: #FAFBFC;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.footer-left {
    flex: 1;
}

.footer-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #1890ff;
    flex-shrink: 0;
}

.info-text {
    font-size: 14px;
    color: #4E5969;
    line-height: 1.5;
}

.footer-right {
    display: flex;
    gap: 12px;
}

/* 其他样式 */
.search-input {
    width: 100%;
    height: 40px;
}

.category-tag {
    margin-right: 8px;
    margin-bottom: 8px;
    padding: 4px 12px;
    border-radius: 16px;
    cursor: pointer;
    background-color: #f5f5f5;
    border: 1px solid #e8e8e8;
    color: #595959;
}

.category-tag-selected {
    background-color: #e6f7ff;
    border-color: #91d5ff;
    color: #1890ff;
}

.template-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

@media (max-width: 1200px) {
    .template-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .template-grid {
        grid-template-columns: 1fr;
    }
}

.template-card {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
    background: #fafafa;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 220px;
}

.template-card:hover {
    border-color: #d0d0d0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 插件类型徽章 - 右上角 */
.plugin-type-badge {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 0 8px 0 8px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.plugin-type-config {
    background-color: rgba(24, 144, 255, 0.1);
    color: #1890ff;
}

.plugin-type-code {
    background-color: rgba(114, 46, 209, 0.1);
    color: #722ed1;
}

.plugin-type-common {
    background-color: rgba(82, 196, 26, 0.1);
    color: #52c41a;
}

.template-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.template-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
}

.template-icon {
    margin-right: 12px;
    flex-shrink: 0;
}

.icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon {
    font-size: 20px;
    color: white;
}

.config-icon {
    background-color: #4080ff;
}

.code-icon {
    background-color: #7265e6;
}

.common-icon {
    background-color: #00b96b;
}

.template-info {
    flex: 1;
}

.template-title {
    font-size: 16px;
    font-weight: 500;
    color: #262626;
    margin-bottom: 8px;
    line-height: 1.4;
}

.template-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.template-tag {
    display: inline-block;
    padding: 2px 8px;
    font-size: 12px;
    border-radius: 10px;
    background-color: #f5f5f5;
    color: #595959;
    margin-right: 4px;
    border: 1px solid #e8e8e8;
}

.template-desc {
    font-size: 14px;
    color: #8c8c8c;
    line-height: 1.5;
    height: 63px; /* 固定3行高度: 1.5 * 14px * 3 = 63px */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin-bottom: 12px;
}

.template-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #bfbfbf;
    padding-top: 8px;
    border-top: 1px solid #f0f0f0;
}

.template-footer .template-author {
    color: #595959;
    font-size: 12px;
}

.template-footer .template-version {
    color: #8c8c8c;
    font-size: 12px;
}

.version-icon {
    font-size: 16px;
    color: #86909C;
}

/* 分页样式 */
.pagination-section {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: center;
}

.pagination-info {
    color: #8c8c8c;
    font-size: 14px;
    text-align: center;
}
</style>
