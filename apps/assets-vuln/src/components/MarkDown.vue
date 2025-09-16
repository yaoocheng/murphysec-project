<template>
    <div class="markdown-container">
        <div class="markdown-body" v-html="renderedContent" />

        <!-- SVG图标渲染组件 - 将在代码块中使用 -->
        <div ref="svgIconsContainer" style="display: none;">
            <div v-for="(iconName, lang) in languageToIconMap" :key="lang" :data-lang="lang" class="svg-icon-template">
                <span class="svg-icon-wrapper">
                    <Svg height="16" width="16" :name="`file_types-${iconName}`"></Svg>
                </span>
            </div>
            <div data-lang="default" class="svg-icon-template">
                <span class="svg-icon-wrapper">
                    <Svg height="16" width="16" name="file_types-text"></Svg>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref, computed, onMounted, watch, nextTick,
} from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// 语言到图标的映射
const languageToIconMap = {
    // --- Direct Matches ---
    config: 'config', // config files (generic)
    groovy: 'groovy', // Groovy
    java: 'java', // Java
    js: 'js', // JavaScript
    json: 'json', // JSON
    kotlin: 'kotlin', // Kotlin
    markdown: 'markdown', // Markdown
    python: 'python', // Python
    shell: 'shell', // Shell script (generic)
    sql: 'sql', // SQL
    text: 'text', // Plain text
    vue: 'vue', // Vue.js
    xml: 'xml', // XML
    yaml: 'yaml', // YAML

    // --- Aliases & Common Variations ---
    javascript: 'js', // Alias for JavaScript
    jsonc: 'json', // JSON with Comments often uses the same icon
    kt: 'kotlin', // Alias for Kotlin
    md: 'markdown', // Alias for Markdown
    py: 'python', // Alias for Python
    sh: 'shell', // Alias for Shell
    bash: 'shell', // Bash script (uses shell icon)
    zsh: 'shell', // Zsh script (uses shell icon)
    txt: 'text', // Alias for Text
    yml: 'yaml', // Alias for YAML
    ini: 'config', // INI files
    properties: 'config', // Java Properties files
};

const svgIconsContainer = ref(null);

// 添加自定义处理
function enhanceMarkdownContent() {
    // 处理列表样式
    const lists = document.querySelectorAll('.markdown-body ol, .markdown-body ul');
    lists.forEach((list) => {
        if (!list.classList.contains('enhanced-list')) {
            list.classList.add('enhanced-list');

            // 为有序列表添加自定义风格
            if (list.tagName === 'OL') {
                list.classList.add('custom-ol');
                // 重置计数器
                list.style.counterReset = 'custom-counter';

                // 处理列表项 - 只处理直接子列表项，不处理嵌套的子列表项
                const items = Array.from(list.children).filter((el) => el.tagName === 'LI');
                items.forEach((item, index) => {
                    item.classList.add('custom-li');
                    item.setAttribute('data-index', index + 1);

                    // 仅为顶级列表项添加分隔线
                    if (list.parentElement.classList.contains('markdown-body')
                        && index < items.length - 1) {
                        item.classList.add('with-divider');
                    }

                    // 处理嵌套的列表 - 确保嵌套列表有正确的样式但不影响序号
                    const nestedLists = item.querySelectorAll('ol, ul');
                    nestedLists.forEach((nestedList) => {
                        if (!nestedList.classList.contains('enhanced-list')) {
                            nestedList.classList.add('enhanced-list');

                            if (nestedList.tagName === 'OL') {
                                nestedList.classList.add('custom-ol');
                                nestedList.classList.add('nested-list');
                            } else if (nestedList.tagName === 'UL') {
                                nestedList.classList.add('custom-ul');
                                nestedList.classList.add('nested-list');
                            }

                            // 为嵌套列表项添加样式，但不设置data-index属性
                            const nestedItems = nestedList.querySelectorAll('li');
                            nestedItems.forEach((nestedItem) => {
                                nestedItem.classList.add('custom-li');
                                nestedItem.classList.add('nested-li');
                            });
                        }
                    });
                });
            } else if (list.tagName === 'UL') {
                list.classList.add('custom-ul');

                // 处理列表项 - 只选择直接子列表项
                const items = Array.from(list.children).filter((el) => el.tagName === 'LI');
                items.forEach((item) => {
                    item.classList.add('custom-li');

                    // 处理嵌套的列表
                    const nestedLists = item.querySelectorAll('ol, ul');
                    nestedLists.forEach((nestedList) => {
                        if (!nestedList.classList.contains('enhanced-list')) {
                            nestedList.classList.add('enhanced-list');

                            if (nestedList.tagName === 'OL') {
                                nestedList.classList.add('custom-ol');
                                nestedList.classList.add('nested-list');
                            } else if (nestedList.tagName === 'UL') {
                                nestedList.classList.add('custom-ul');
                                nestedList.classList.add('nested-list');
                            }

                            const nestedItems = nestedList.querySelectorAll('li');
                            nestedItems.forEach((nestedItem) => {
                                nestedItem.classList.add('custom-li');
                                nestedItem.classList.add('nested-li');
                            });
                        }
                    });
                });
            }
        }
    });

    // 获取SVG图标的DOM元素
    function getLanguageIconElement(lang) {
        if (!svgIconsContainer.value) return '';

        // 尝试找到对应语言的图标模板
        const iconTemplate = svgIconsContainer.value.querySelector(`[data-lang="${lang.toLowerCase()}"]`);

        // 如果找不到，使用默认图标
        if (!iconTemplate) {
            const defaultTemplate = svgIconsContainer.value.querySelector('[data-lang="default"]');
            if (defaultTemplate) {
                return defaultTemplate.innerHTML;
            }
            return '';
        }

        return iconTemplate.innerHTML;
    }

    // 添加代码块增强
    const codeBlocks = document.querySelectorAll('.markdown-body pre.hljs');
    codeBlocks.forEach((block) => {
        if (block.classList.contains('enhanced-code')) return;
        block.classList.add('enhanced-code');

        block.style.position = 'relative';

        // 创建代码头部
        const codeHeader = document.createElement('div');
        codeHeader.className = 'code-header';

        // 添加代码语言标签和复制按钮
        const code = block.querySelector('code');
        let langName = 'text';

        if (code && code.className) {
            const langMatch = code.className.match(/language-(\w+)/);
            if (langMatch && langMatch[1]) {
                langName = langMatch[1].toLowerCase();
            }
        }

        // 创建语言标签
        const langLabel = document.createElement('div');
        langLabel.className = 'code-lang';

        // 使用预渲染的SVG组件
        const iconHtml = getLanguageIconElement(langName);
        langLabel.innerHTML = `${iconHtml}<span>${langName}</span>`;
        codeHeader.appendChild(langLabel);

        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg> 复制';
        codeHeader.appendChild(copyBtn);

        // 添加到代码块
        block.insertBefore(codeHeader, block.firstChild);

        // 设置复制功能
        copyBtn.addEventListener('click', async () => {
            const codeText = block.querySelector('code').innerText;

            try {
                // 首先尝试使用现代剪贴板API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(codeText);
                } else {
                    // 降级到传统方法
                    const textArea = document.createElement('textarea');
                    textArea.value = codeText;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();

                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);

                    if (!successful) {
                        throw new Error('execCommand copy failed');
                    }
                }

                // 成功复制
                copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 已复制!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg> 复制';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('无法复制代码: ', err);
                copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> 复制失败';
                setTimeout(() => {
                    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg> 复制';
                }, 2000);
            }
        });

        // 添加行号
        if (code) {
            const codeLines = code.innerHTML.split('\n');
            if (codeLines.length > 1) {
                const lineNumbers = document.createElement('div');
                lineNumbers.className = 'line-numbers';

                // 移除最后一个空行（如果有）
                const effectiveLines = [...codeLines];
                if (effectiveLines.length > 0 && effectiveLines[effectiveLines.length - 1].trim() === '') {
                    effectiveLines.pop();
                }

                // 创建行号 - 修复行号显示问题
                for (let i = 0; i < effectiveLines.length; i++) {
                    // 只为非空行或非最后一行创建行号
                    if (!(effectiveLines[i].trim() === '' && i === effectiveLines.length - 1)) {
                        const lineSpan = document.createElement('span');
                        lineSpan.className = 'line-number';
                        lineSpan.setAttribute('data-line', i + 1);
                        lineSpan.innerText = i + 1;
                        lineNumbers.appendChild(lineSpan);
                    }
                }

                // 确保代码行和行号一一对应
                code.innerHTML = effectiveLines.join('\n');

                block.insertBefore(lineNumbers, code);
                block.classList.add('has-line-numbers');
            }
        }
    });

    // 增强图片点击效果
    const images = document.querySelectorAll('.markdown-body img');
    images.forEach((img) => {
        if (!img.classList.contains('enhanced')) {
            img.classList.add('enhanced');
            img.addEventListener('click', () => {
                img.classList.toggle('expanded');
            });
        }
    });

    // 外部链接新窗口打开
    const links = document.querySelectorAll('.markdown-body a');
    links.forEach((link) => {
        if (!link.hasAttribute('target') && link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            if (!link.classList.contains('external-link')) {
                link.classList.add('external-link');
            }
        }
    });
}

const props = defineProps(['text']);
const copyButtonsAdded = ref(false);

// 配置markdown-it，启用代码高亮和其他功能
const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true, // 将换行符转换为 <br>
    highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                const highlightedCode = hljs.highlight(str, { language: lang }).value;
                return `<pre class="hljs"><code class="language-${lang}">${highlightedCode}</code></pre>`;
            } catch (e) {
                console.error('代码高亮出错:', e);
            }
        }
        return `<pre class="hljs"><code>${markdown.utils.escapeHtml(str)}</code></pre>`;
    },
});

// 渲染内容
const renderedContent = computed(() => {
    if (!props.text) return '';
    // 直接使用markdown-it渲染原始文本
    return markdown.render(props.text);
});

// 监听props变化，重新初始化交互元素
watch(() => props.text, () => {
    if (props.text) {
        nextTick(() => {
            enhanceMarkdownContent();
        });
    }
});

// 在组件挂载后添加交互元素
onMounted(() => {
    if (!copyButtonsAdded.value) {
        nextTick(() => {
            enhanceMarkdownContent();
            copyButtonsAdded.value = true;
        });
    }
});
</script>

<style scoped>
.markdown-container {
    width: 100%;
}

.markdown-body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #24292e;
    padding: 0;
    word-wrap: break-word;
}

/* 在外部 CSS 中加入全局样式 */
:deep(.markdown-body) {
    /* 标题样式 */
    h1, h2, h3, h4, h5, h6 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
    }
    h1 {
        font-size: 2em;
        padding-bottom: 0.3em;
        border-bottom: 1px solid #eaecef;
        margin-top: 0;
    }
    h2 {
        font-size: 1.5em;
        padding-bottom: 0.3em;
        border-bottom: 1px solid #eaecef;
        margin-top: 32px;
    }
    h3 { font-size: 1.25em; margin-top: 28px; }
    h4 { font-size: 1em; margin-top: 24px; }
    h5 { font-size: 0.875em; margin-top: 24px; }
    h6 { font-size: 0.85em; color: #6a737d; margin-top: 24px; }

    /* 段落和链接样式 */
    p {
        margin-top: 0;
        margin-bottom: 12px;
        line-height: 1.6;
    }
    a {
        color: #0366d6;
        text-decoration: none;
        position: relative;
        transition: color 0.2s ease;
    }
    a:hover {
        text-decoration: underline;
        color: #044289;
    }
    a.external-link::after {
        content: "↗";
        display: inline-block;
        margin-left: 3px;
        font-size: 0.9em;
        vertical-align: top;
    }

    /* 列表样式 - 使用类选择器 */
    ol.custom-ol, ul.custom-ul {
        padding-left: 0;
        margin-top: 0.5em;
        margin-bottom: 1.2em;
        list-style: none !important;
    }

    ol.custom-ol {
        counter-reset: custom-counter;
    }

    ol.custom-ol > li.custom-li {
        position: relative;
        padding-left: 2.5em;
        margin-bottom: 0.6em;
        padding-bottom: 0.6em;
    }

    ol.custom-ol > li.custom-li.with-divider {
        border-bottom: 1px dashed rgba(0, 0, 0, 0.07);
    }

    ol.custom-ol > li.custom-li::before {
        content: attr(data-index) ".";
        position: absolute;
        left: 0.2em;
        top: 0;
        font-weight: 600;
        color: #0366d6;
    }

    ul.custom-ul > li.custom-li {
        position: relative;
        padding-left: 1.8em;
        margin-bottom: 0.4em;
        line-height: 1.5;
    }

    ul.custom-ul > li.custom-li::before {
        content: "•";
        position: absolute;
        left: 0.5em;
        top: 0;
        color: #0366d6;
        font-weight: bold;
        font-size: 1.2em;
    }

    /* 嵌套列表样式 */
    ol.custom-ol.nested-list, ul.custom-ul.nested-list {
        padding-left: 0;
        margin-top: 0.8em;
        margin-bottom: 0.2em;
    }

    /* 嵌套的有序列表 */
    ol.custom-ol.nested-list {
        counter-reset: nested-counter;
    }

    ol.custom-ol.nested-list > li.custom-li.nested-li {
        padding-left: 2em;
        margin-bottom: 0.3em;
        padding-bottom: 0.3em;
        border-bottom: none;
    }

    ol.custom-ol.nested-list > li.custom-li.nested-li::before {
        content: counters(nested-counter, ".") ".";
        counter-increment: nested-counter;
        left: 0;
        color: #0366d6;
        opacity: 0.8;
    }

    /* 嵌套的无序列表样式 */
    ul.custom-ul.nested-list > li.custom-li.nested-li {
        padding-left: 1.5em;
        margin-bottom: 0.3em;
    }

    ul.custom-ul.nested-list > li.custom-li.nested-li::before {
        content: "◦";
        left: 0.3em;
        color: #6ca0e8;
    }

    /* 禁用嵌套列表项的data-index */
    li.custom-li.nested-li::before {
        content: "◦" !important;
        font-size: 1em;
        color: #6ca0e8;
    }

    ol.custom-ol.nested-list > li.custom-li.nested-li::before {
        content: "◦" !important;
    }

    /* 列表层级样式 */
    ul.custom-ul ul.custom-ul > li.custom-li::before {
        content: "◦";
        color: #6ca0e8;
    }

    ul.custom-ul ul.custom-ul ul.custom-ul > li.custom-li::before {
        content: "▪";
        font-size: 0.8em;
        color: #adc6eb;
    }

    /* 兼容性样式 - 针对原生列表 */
    ol, ul {
        padding-left: 1.5em;
    }

    ol > li {
        position: relative;
        margin-bottom: 6px;
        padding-left: 0.5em;
    }

    ul > li {
        position: relative;
        margin-bottom: 4px;
    }

    /* 代码样式 */
    code {
        padding: 0.2em 0.4em;
        margin: 0;
        font-size: 90%;
        background-color: rgba(27, 31, 35, 0.05);
        border-radius: 3px;
        font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
    }

    pre {
        word-wrap: normal;
        padding: 8px 16px 8px 16px;
        padding-top: 40px;
        overflow: auto;
        font-size: 90%;
        line-height: 1.6;
        background-color: #f8fafc;
        border-radius: 8px;
        margin-top: 0;
        margin-bottom: 16px;
        box-shadow: none;
        position: relative;
        border: 1px solid #e8ecf1;
        transition: none;
    }

    pre:hover {
        box-shadow: none;
        border-color: #e8ecf1;
    }

    pre.has-line-numbers {
        padding-left: 54px;
    }

    pre code {
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: 0;
        word-break: normal;
        white-space: pre;
        display: block;
        overflow-x: auto;
        font-size: inherit;
        line-height: 1.6;
        font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
        padding-top: 0;
    }

    /* 代码头部样式 */
    :deep(.code-header) {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f1f5fa;
        border-bottom: 1px solid #e1e4e8;
        border-radius: 8px 8px 0 0;
        overflow: hidden;
        z-index: 2;
    }

    /* 代码语言标签 */
    :deep(.code-lang) {
        padding: 0 12px;
        font-size: 12px;
        color: #444;
        font-weight: 500;
        user-select: none;
        display: flex;
        align-items: center;
        height: 100%;
        max-width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :deep(.code-lang .svg-icon-wrapper) {
        margin-right: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    :deep(.code-lang span) {
        vertical-align: middle;
        max-width: calc(100% - 24px);
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* 代码复制按钮样式 */
    :deep(.copy-btn) {
        padding: 0 12px;
        height: 100%;
        font-size: 12px;
        background-color: transparent;
        border: none;
        border-left: 1px solid #e1e4e8;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        color: #444;
        font-weight: 500;
        display: flex;
        align-items: center;
    }

    :deep(.copy-btn svg) {
        margin-right: 5px;
        flex-shrink: 0;
    }

    :deep(.copy-btn:hover) {
        background-color: #e6eef6;
    }

    :deep(.copy-btn:active) {
        background-color: #d1dbe6;
    }

    :deep(.copy-btn.copied) {
        background-color: #e6f7ee;
        color: #0d652d;
    }

    /* 行号样式 */
    :deep(.line-numbers) {
        position: absolute;
        top: 32px;
        left: 0;
        width: 42px;
        text-align: right;
        padding: 8px 0 8px 0;
        color: #8e8e9c;
        font-size: inherit;
        line-height: 1.6;
        user-select: none;
        border-right: 1px solid #e8ecf1;
        background-color: #f8fafc;
        bottom: 0;
        overflow: hidden;
        border-radius: 0 0 0 8px;
        box-sizing: border-box;
        font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
        z-index: 1;
    }

    :deep(.line-number) {
        display: block;
        padding-right: 1em;
        text-align: right;
        min-width: 1.5em;
        position: relative;
        line-height: 1.6;
        box-sizing: border-box;
    }

    :deep(pre code) {
        position: relative;
        z-index: 0;
        padding: 0;
    }

    /* 表格样式 */
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 16px 0;
        display: block;
        overflow: auto;
        border-radius: 3px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    table th, table td {
        padding: 8px 13px;
        border: 1px solid #dfe2e5;
    }

    table th {
        font-weight: 600;
        background-color: #f2f7fd;
    }

    table tr {
        background-color: #fff;
        border-top: 1px solid #c6cbd1;
    }

    table tr:nth-child(2n) {
        background-color: #f8f9fa;
    }

    table tr:hover {
        background-color: #f2f7fd;
    }

    /* 引用样式 */
    blockquote {
        padding: 0.5em 1em;
        color: #5c6975;
        border-left: 0.25em solid #6ca0e8;
        background-color: #f2f7fd;
        margin: 0 0 16px 0;
        border-radius: 0 3px 3px 0;
    }
    blockquote > :first-child {
        margin-top: 0;
    }
    blockquote > :last-child {
        margin-bottom: 0;
    }

    /* 分割线样式 */
    hr {
        height: 0.25em;
        padding: 0;
        margin: 24px 0;
        background-color: #e1e4e8;
        border: 0;
    }

    /* 图片样式 */
    img {
        max-width: 100%;
        box-sizing: border-box;
        border-style: none;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        cursor: pointer;
    }

    img.expanded {
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0,0,0,0.18);
    }

    /* 提示信息 */
    .info, .warning, .error, .success {
        padding: 12px 16px;
        margin: 16px 0;
        border-left: 4px solid;
        border-radius: 3px;
    }

    .info {
        background-color: #f0f7fb;
        border-left-color: #4a9cf6;
    }

    .warning {
        background-color: #fffbf0;
        border-left-color: #f1c40f;
    }

    .error {
        background-color: #fdf7f7;
        border-left-color: #e74c3c;
    }

    .success {
        background-color: #f0fbf5;
        border-left-color: #2ecc71;
    }
}

/* 响应式设计优化 */
@media (max-width: 768px) {
    :deep(.markdown-body) {
        h1 { font-size: 1.8em; }
        h2 { font-size: 1.4em; }
        h3 { font-size: 1.2em; }

        pre {
            font-size: 80%;
            border-radius: 4px;
        }

        table {
            font-size: 90%;
        }

        table th, table td {
            padding: 6px 10px;
        }
    }
}
</style>
