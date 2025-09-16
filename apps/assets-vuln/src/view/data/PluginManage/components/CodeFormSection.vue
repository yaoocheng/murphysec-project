<template>
    <div class="white-card code-editor-card">
        <div class="editor-header">
            <div class="header-info">
                <h3 class="card-title">代码编辑</h3>
                <p class="editor-desc">
                    支持 Python 3.8+ 语言，可使用常用第三方库，
                    <a href="#" class="doc-link" @click.prevent="openDocumentation">查看支持库列表</a>
                </p>
            </div>
            <a-button
                v-if="!viewMode"
                @click="runCode"
                :loading="running"
                type="primary"
                size="small"
                class="run-button"
            >
                <span class="play-icon">▶</span>
                运行测试
            </a-button>
        </div>

        <div class="code-editor-container">
            <div class="code-editor-wrapper">
                <CodeEditor
                    :model-value="codeValue"
                    @update:model-value="$emit('update:code', $event)"
                    height="100%"
                    language="python"
                    theme="dark"
                    :show-line-numbers="true"
                    :readonly="viewMode"
                    placeholder="# 请在此编写您的插件代码&#10;import json&#10;&#10;def main():&#10;    &quot;&quot;&quot;&#10;    插件主函数&#10;    请实现您的业务逻辑&#10;    &quot;&quot;&quot;&#10;    print(&quot;Hello, Plugin!&quot;)&#10;    return {&quot;status&quot;: &quot;success&quot;, &quot;message&quot;: &quot;插件执行成功&quot;}&#10;&#10;if __name__ == &quot;__main__&quot;:&#10;    result = main()&#10;    print(json.dumps(result, ensure_ascii=False))"
                />
            </div>

            <!-- 运行结果区域 -->
            <div class="result-section">
                <div class="result-header">
                    <h4 class="result-title">运行结果</h4>
                    <div v-if="runResult" class="result-status">
                        <span :class="resultStatusClass">{{ runResult.message || runResult.status }}</span>
                    </div>
                </div>
                <div :class="['result-output', runResult?.status]">
                    <div v-if="runResult">
                        <pre>{{ runResult.output }}</pre>
                    </div>
                    <div v-else class="result-placeholder">
                        <div class="placeholder-content">
                            <Svg name="icon_info_colorful" class="placeholder-icon" />
                            <span class="placeholder-text">点击上方"运行测试"按钮来执行代码并查看结果</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import CodeEditor from '@/components/CodeEditor.vue';
import Svg from '@/components/Svg.vue';

const props = defineProps({
    codeValue: {
        type: String,
        default: '',
    },
    running: {
        type: Boolean,
        default: false,
    },
    runResult: {
        type: Object,
        default: null,
    },
    viewMode: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:code', 'run-code']);

// 运行结果状态样式
const resultStatusClass = computed(() => ({
    'status-success': props.runResult?.status === 'success',
    'status-error': props.runResult?.status === 'error',
}));

const runCode = () => {
    emit('run-code');
};

// 打开文档链接
const openDocumentation = () => {
    // 这里可以替换为实际的文档链接
    window.open('https://docs.python.org/3/', '_blank');
};
</script>

<style scoped>
/* 白色卡片基础样式 */
.white-card {
    background: white;
    border: 1px solid #e1e8f0;
    padding: 20px;
    border-radius: 8px;
}

/* 代码编辑器卡片 */
.code-editor-card {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 160px + 50px);
    min-height: 750px;
}

/* 编辑器头部 */
.editor-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 20px;
}

.header-info {
    flex: 1;
}

/* 卡片标题 */
.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
}

/* 编辑器描述 */
.editor-desc {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
}

.doc-link {
    color: #6c87ff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
}

.doc-link:hover {
    color: #5a73e8;
    text-decoration: underline;
}

/* 运行按钮 */
.run-button {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 16px;
    font-size: 14px;
    border-radius: 6px;
    flex-shrink: 0;
}

/* 代码编辑器容器 */
.code-editor-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    min-height: 0;
}

/* 代码编辑器包装 */
.code-editor-wrapper {
    border: 1px solid #e1e8f0;
    overflow: hidden;
    flex: 1;
    height: 100%;
    min-height: 400px;
    max-height: 100%;
}

/* 运行结果区域 */
.result-section {
    border-top: 1px solid #e1e8f0;
    margin-top: 8px;
    flex-shrink: 0;
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 8px;
}

.result-title {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin: 0;
}

.play-icon {
    font-size: 12px;
    line-height: 1;
}

/* 运行结果状态 */
.result-status {
    margin-bottom: 8px;
}

.status-success {
    color: #52c41a;
    font-weight: 500;
    font-size: 14px;
}

.status-error {
    color: #ff4d4f;
    font-weight: 500;
    font-size: 14px;
}

/* 运行结果输出 */
.result-output {
    border: 1px solid #e1e8f0;
    overflow: hidden;
    height: 150px;
    border-radius: 4px;
}

.result-output pre {
    margin: 0;
    padding: 12px;
    background: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.5;
    height: 150px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    box-sizing: border-box;
    unicode-bidi: normal;
    text-align: left;
}

/* 成功状态的输出样式 */
.result-output.success pre {
    background: #0d1117;
    color: #58a6ff;
    border-left: 3px solid #238636;
}

/* 错误状态的输出样式 */
.result-output.error pre {
    background: #0d1117;
    color: #f85149;
    border-left: 3px solid #da3633;
}

/* 运行结果占位符 */
.result-placeholder {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafbfc;
}

.placeholder-content {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #8c8c8c;
}

.placeholder-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.placeholder-text {
    font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .editor-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .run-button {
        align-self: flex-end;
    }

    .editor-desc {
        font-size: 12px;
    }
}
</style>
