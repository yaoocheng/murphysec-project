<template>
    <div class="plugin-form-container">
        <a-spin :spinning="globalState.loading" :indicator="indicator">
            <!-- 页面头部操作区 -->
            <div class="page-header">
                <div class="header-left">
                    <a-button
                        type="text"
                        @click="goBack"
                        class="back-button"
                    >
                        <span class="back-icon-wrapper">
                            <LeftOutlined />
                        </span>
                        <span class="back-text">返回</span>
                    </a-button>
                </div>
                <div class="header-actions">
                    <template v-if="isViewMode">
                        <a-button @click="goToEdit" type="primary" class="base-button">
                            编辑
                        </a-button>
                    </template>
                    <template v-else>
                        <a-button @click="goBack" class="base-button">取消</a-button>
                        <a-button
                            @click="handleSubmitClick"
                            type="primary"
                            class="base-button"
                            :loading="globalState.loading"
                            :disabled="!isFormValid"
                        >
                            {{ formState.plug_market_id ? '保存' : '创建' }}
                        </a-button>
                    </template>
                </div>
            </div>

            <!-- 主要内容区域 -->
            <div class="form-content">
                <!-- 左侧信息区域 -->
                <div class="info-area">
                    <!-- 基本信息卡片 -->
                    <BasicInfoSection
                        :form-data="formState"
                        :view-mode="isViewMode"
                        :from-template="!!formState.plug_built_id"
                        @update:plug_name="formState.plug_name = $event"
                        @update:plug_data_type="formState.plug_data_type = $event"
                        @update:plug_description="formState.plug_description = $event"
                        ref="basicInfoRef"
                    />

                    <!-- 开发指南或模板使用说明 -->
                    <div v-if="createType === 'direct'" class="white-card">
                        <h3 class="card-title">开发指南</h3>
                        <div class="guide-content">
                            <div class="guide-item">
                                <Svg name="icon_info_colorful" class="guide-icon" />
                                <span>您可以基于我们的 API 文档编写自定义插件代码</span>
                            </div>
                            <div class="guide-item">
                                <Svg name="icon_info_colorful" class="guide-icon" />
                                <span>支持 Python 3.8+ 环境，可以使用常见的第三方库</span>
                            </div>
                            <div class="guide-item">
                                <Svg name="icon_info_colorful" class="guide-icon" />
                                <span>插件需要实现标准的数据获取和处理接口</span>
                            </div>
                            <div class="guide-item">
                                <Svg name="icon_info_colorful" class="guide-icon" />
                                <span>建议先在本地测试代码逻辑，再在平台上进行集成测试</span>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="formState.plug_built_id && formState.plug_built_id !== 0" class="white-card">
                        <h3 class="card-title">模板使用说明</h3>
                        <div class="template-info" v-if="selectedTemplate">
                            <div class="template-source">
                                <Svg name="icon_file_add_colorful" class="template-icon" />
                                <span>基于 <strong>{{ selectedTemplate.name }}</strong> 模板创建</span>
                            </div>
                            <div class="template-usage">
                                <MarkDown :text="selectedTemplate.usage_guide" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧操作区域 -->
                <div class="operation-area">
                    <!-- 配置型模板创建 -->
                    <ConfigFormSection
                        v-if="createType === 'config'"
                        :selected-template="selectedTemplate"
                        :config-data="formState.config"
                        :testing="testing"
                        :test-result="testResult"
                        :view-mode="isViewMode"
                        @update:config="updateConfig"
                        @test-connection="testConnection"
                        ref="configFormRef"
                    />

                    <!-- 代码型模板创建 / 直接创建 -->
                    <CodeFormSection
                        v-else
                        :code-value="formState.plug_file_text"
                        :running="running"
                        :run-result="runResult"
                        :view-mode="isViewMode"
                        @update:code="formState.plug_file_text = $event"
                        @run-code="handleRunCode"
                    />
                </div>
            </div>
        </a-spin>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LeftOutlined } from '@ant-design/icons-vue';
import { indicator } from 'utils';
import { globalState } from '@/store';
import { ROUTER_PATH } from '@/constants';
import MarkDown from '@/components/MarkDown.vue';
import Svg from '@/components/Svg.vue';
import BasicInfoSection from './components/BasicInfoSection.vue';
import ConfigFormSection from './components/ConfigFormSection.vue';
import CodeFormSection from './components/CodeFormSection.vue';
import { usePluginForm } from './hooks/usePluginForm.js';
import { usePluginTest } from './hooks/usePluginTest.js';
import { usePluginSubmit } from './hooks/usePluginSubmit.js';
import { editPluginData } from '../constants';
import { getPluginTempApi } from '@/api/data';

const route = useRoute();
const router = useRouter();

// 检测是否为查看模式
const isViewMode = computed(() => route.meta?.viewMode === true);

// 使用 composition hooks
const {
    formState,
    createType,
    selectedTemplate,
    originalPluginData,
    isFormValid,
    initializeForm,
} = usePluginForm();

const {
    testing,
    testResult,
    running,
    runResult,
    testConnection,
    runCode,
} = usePluginTest();

const {
    handleSubmit,
    goBack,
} = usePluginSubmit();

// 组件引用
const basicInfoRef = ref();
const configFormRef = ref();

// 更新配置
const updateConfig = (key, value) => {
    formState.config[key] = value;
};

// 运行代码
const handleRunCode = () => {
    runCode(formState.plug_file_text);
};

// 跳转到编辑页面
const goToEdit = () => {
    const pluginId = route.params.id;
    editPluginData.value = formState;
    router.push({ path: ROUTER_PATH.pluginEdit.replace(':id', pluginId) });
};

// 提交表单
const handleSubmitClick = () => {
    // 根据插件类型选择合适的表单引用
    const formRefs = {
        basic: basicInfoRef,
        config: createType.value === 'config' ? configFormRef : null,
    };

    handleSubmit(
        formRefs,
        formState,
        originalPluginData,
        createType,
        selectedTemplate,
    );
};

// 根据plug_built_id获取模板信息
const fetchTemplateInfo = async (plugBuiltId) => {
    try {
        const { data } = await getPluginTempApi();
        const templates = data.data || [];
        const template = templates.find((item) => item.plug_built_id === plugBuiltId);

        if (template) {
            selectedTemplate.value = {
                template_id: template.plug_built_id,
                name: template.plug_name,
                type: template.plug_type,
                data_type: template.plug_data_type,
                description: template.plug_desc,
                function_description: template.func_desc,
                tags: template.tags || [],
                usage_guide: template.usage_guide,
                version: template.version,
                author: template.author,
                required_params_schema: template.required_params_schema || [],
                default_code: template.plug_code,
            };
        }
    } catch (error) {
        console.error('获取模板信息失败:', error);
    }
};

// 初始化
onMounted(async () => {
    if (editPluginData.value) {
        // 保存一份数据副本，避免后续丢失
        const pluginData = { ...editPluginData.value };
        initializeForm(pluginData);

        // 如果有plug_built_id但没有selectedTemplate信息，则获取模板信息
        if (formState.plug_built_id && !selectedTemplate.value?.name) {
            await fetchTemplateInfo(formState.plug_built_id);
        }

        // 清除全局编辑数据
        editPluginData.value = null;
    } else {
        // 直接创建时，设置默认代码
        createType.value = 'direct';
        formState.plug_file_text = `# 请在此编写您的插件代码
import json

def main():
    # 在这里实现您的业务逻辑
    print("Hello, Plugin!")
    return {"status": "success", "message": "插件执行成功"}

if __name__ == "__main__":
    result = main()
    print(json.dumps(result, ensure_ascii=False))`;
    }
});
</script>

<style scoped>
/* 容器布局 */
.plugin-form-container {
    background: #f7f9fc;
    padding: 24px;
    height: calc(100vh - 56px);
    overflow-y: auto;
}

/* 页面头部 */
.page-header {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-left {
    display: flex;
    align-items: center;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border: none;
    background: transparent;
    color: #6b7280;
    transition: all 0.2s;
    border-radius: 4px;
    line-height: 1;
}

.back-button:hover {
    background: rgba(108, 135, 255, 0.1);
    color: #6c87ff;
}

.back-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.back-text {
    font-size: 14px;
    line-height: 1;
}

.header-actions {
    display: flex;
    gap: 8px;
}

/* 主要内容区域 */
.form-content {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 8px;
    align-items: start;
}

/* 左侧信息区域 */
.info-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* 右侧操作区域 */
.operation-area {
    display: flex;
    flex-direction: column;
}

/* 白色卡片统一样式 */
.white-card {
    background: white;
    border: 1px solid #e1e8f0;
    padding: 20px;
}

/* 卡片标题 */
.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
}

/* 指南内容 */
.guide-content {
    margin: 0;
}

.guide-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 13px;
    line-height: 1.5;
    color: #595959;
}

.guide-item:last-child {
    margin-bottom: 0;
}

.guide-icon {
    width: 14px;
    height: 14px;
    margin-top: 2px;
    flex-shrink: 0;
}

/* 模板信息 */
.template-info {
    margin: 0;
}

.template-source {
    display: flex;
    align-items: center;
    background-color: #f0f7fb;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 12px;
    font-size: 13px;
    color: #0366d6;
}

.template-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    flex-shrink: 0;
}

/* 响应式 */
@media (max-width: 1200px) {
    .plugin-form-container {
        padding: 16px;
    }

    .page-header {
        margin-bottom: 16px;
    }

    .header-actions {
        gap: 8px;
    }

    .form-content {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .info-area,
    .operation-area {
        width: 100%;
    }
}
</style>
