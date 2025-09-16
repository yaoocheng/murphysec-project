<template>
    <div class="code-diff-viewer rounded-3 p-6" style="background: linear-gradient(270deg, rgba(108, 135, 255, 0.05) 0%, rgba(178, 115, 255, 0.05) 100%);
border: 1px solid rgba(178, 115, 255, 0.2);">
        <!-- 顶部区域：AI说明文字和设置图标 -->
        <div class="top-section mb-[12px] w-full flex items-center justify-between">
            <!-- 左侧：AI生成说明 -->
            <div class="flex items-center gap-[8px]">
                <!-- AI图标 -->
                <div class="ai-icon-container flex items-center justify-center" style="width: 24px; height: 24px;">
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
                <!-- 文字内容 -->
                <div class="ai-text" style="font-family: 'PingFang SC', sans-serif; font-weight: 500; font-size: 15px; line-height: 1.5em; background: linear-gradient(270deg, #6C87FF 0%, #B273FF 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    墨思已为您生成风险代码与修复代码示例，未必是您的真实代码，请结合实际情况参考修改
                </div>
            </div>

            <div class="text-primary text-[13px] font-normal">
                来自墨思 AI 智能体分析结果
            </div>

        </div>
        <!-- 右侧：设置图标 -->
        <div class="settings-container flex justify-end">
            <a-dropdown :trigger="['click']" placement="bottomRight">
                <div class="settings-icon">
                    <SettingOutlined />
                </div>
                <template #overlay>
                    <div class="settings-menu">
                        <!-- Layout 布局 -->
                        <div class="menu-section">
                            <div class="menu-section-title">布局</div>
                            <div class="menu-item" @click="setDiffMode('line-by-line')">
                                <span>统一视图</span>
                                <svg v-if="diffMode === 'line-by-line'" width="16" height="16" viewBox="0 0 16 16"
                                     fill="none">
                                    <path d="M13.5 3.5 6 11 2.5 7.5" stroke="currentColor" stroke-width="2"
                                          fill="none" />
                                </svg>
                            </div>
                            <div class="menu-item" @click="setDiffMode('side-by-side')">
                                <span>并排视图</span>
                                <svg v-if="diffMode === 'side-by-side'" width="16" height="16" viewBox="0 0 16 16"
                                     fill="none">
                                    <path d="M13.5 3.5 6 11 2.5 7.5" stroke="currentColor" stroke-width="2"
                                          fill="none" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </template>
            </a-dropdown>
        </div>

        <div class="code-diff-container">
            <!-- 使用新的FileDiffHeader组件 -->
            <FileDiffHeader :language-icon-name="language" :language-name="getDisplayLanguage(language)"
                            :additions-count="diffStat?.addNum || 0" :deletions-count="diffStat?.delNum || 0" />

            <!-- 代码对比区域 -->
            <div class="diff-content">
                <CodeDiff :old-string="vulnerableCode" :new-string="fixedCode" :output-format="diffMode"
                          :language="language" :context="10" :diff-style="diffStyle" :theme="theme" :hide-header="true"
                          :max-height="maxHeight" @diff="onDiffComplete" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';
import FileDiffHeader from './FileDiffHeader.vue';

// 语言显示名称映射
const languageDisplayMap = {
    python: 'Python',
    py: 'Python',
    javascript: 'JavaScript',
    js: 'JavaScript',
    typescript: 'TypeScript',
    ts: 'TypeScript',
    java: 'Java',
    kotlin: 'Kotlin',
    kt: 'Kotlin',
    cpp: 'C++',
    c: 'C',
    go: 'Go',
    rust: 'Rust',
    php: 'PHP',
    shell: 'Shell',
    bash: 'Bash',
    sh: 'Shell',
    zsh: 'Zsh',
    sql: 'SQL',
    json: 'JSON',
    jsonc: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    xml: 'XML',
    markdown: 'Markdown',
    md: 'Markdown',
    vue: 'Vue.js',
    config: 'Config',
    ini: 'INI',
    properties: 'Properties',
    text: 'Text',
    txt: 'Text',
};

// 定义props
defineProps({
    // 漏洞代码
    vulnerableCode: {
        type: String,
        default: '',
    },
    // 修复后的代码
    fixedCode: {
        type: String,
        default: '',
    },
    // 编程语言
    language: {
        type: String,
        default: 'python',
    },
    // 文件名
    filename: {
        type: String,
        default: 'example.py',
    },
    // 主题
    theme: {
        type: String,
        default: 'light',
    },
    // 最大高度
    maxHeight: {
        type: String,
        default: '400px',
    },
});

// 响应式数据 - 默认改为并排视图
const diffMode = ref('side-by-side'); // line-by-line 或 side-by-side
const diffStyle = ref('word'); // word 或 char
const diffStat = ref(null);

// 获取语言显示名称
const getDisplayLanguage = (lang) => languageDisplayMap[lang?.toLowerCase()] || lang?.toUpperCase() || 'TEXT';

// 处理diff完成事件
const onDiffComplete = (result) => {
    diffStat.value = result.stat;
};

// 设置方法
const setDiffMode = (mode) => {
    diffMode.value = mode;
};

onMounted(() => {
    // 组件挂载后的初始化逻辑
    console.log('CodeDiffViewer mounted');
});
</script>

<style scoped>
/* 重置所有可能的边距和边框 */
.code-diff-viewer {
    margin: 0;
}

/* 顶部区域布局 */
.top-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* 设置图标容器 */
.settings-container {
    position: relative;
}

.settings-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    cursor: pointer;
    color: #57606a;
    transition: all 0.2s ease;
    font-size: 16px;
}

.settings-icon:hover {
    background-color: #f3f4f6;
    color: #24292f;
    transform: rotate(90deg);
}

/* 设置菜单样式 */
.settings-menu {
    background: white;
    border: 1px solid #d0d7de;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
    padding: 8px 0;
    min-width: 200px;
    font-size: 14px;
}

.menu-section {
    padding: 0 8px;
}

.menu-section-title {
    font-size: 12px;
    font-weight: 600;
    color: #656d76;
    padding: 8px 8px 4px 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-radius: 4px;
    margin: 0 8px;
}

.menu-item:hover {
    background-color: #f6f8fa;
}

.menu-item svg {
    color: #0969da;
    flex-shrink: 0;
}

.menu-divider {
    height: 1px;
    background-color: #d0d7de;
    margin: 8px 0;
}

/* 代码对比区域样式 - 添加GitHub风格的容器边框 */
.code-diff-container {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    overflow: hidden;
    margin: 0;
    padding: 0;
}

/* diff内容区域 - 移除所有边框和边距 */
.diff-content {
    background-color: white;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
}

/* 覆盖v-code-diff的默认样式以匹配GitHub风格 */
:deep(.d2h-wrapper) {
    border: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
}

:deep(.d2h-file-header) {
    display: none !important;
}

:deep(.d2h-file-wrapper) {
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
}

:deep(.d2h-diff-table) {
    margin: 0 !important;
    border: none !important;
}

:deep(.d2h-diff-tbody) {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;
    font-size: 12px !important;
}

:deep(.d2h-code-line-prefix) {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;
}

:deep(.d2h-code-line) {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;
    font-size: 12px !important;
}

/* 额外的重置样式，确保没有意外的边距和边框 */
:deep(.code-diff-view) {
    margin: 0 !important;
    border: none !important;
    padding: 0 !important;
}

:deep(.hljs) {
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
}

:deep(pre) {
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
}

/* 重置任何可能的默认样式 */
:deep(*) {
    box-sizing: border-box;
}
</style>
