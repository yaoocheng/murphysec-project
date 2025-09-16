<template>
    <div class="file-diff-header">
        <!-- 左侧区域：语言图标和名称 -->
        <div class="left-section">
            <div class="language-icon">
                <Svg height="16" width="16" :name="getLanguageIcon(languageIconName)" />
            </div>
            <span class="language-name">{{ languageName }}</span>
        </div>

        <!-- 右侧区域：统计信息 -->
        <div class="right-section">
            <div class="change-stats">
                <span class="additions-count">+{{ additionsCount }}</span>
                <span class="deletions-count">-{{ deletionsCount }}</span>

                <!-- 可视化方块 -->
                <div class="change-blocks">
                    <div v-for="(block, index) in visualBlocks" :key="index" class="visual-block" :class="block.state">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// 从MarkDown.vue复制的语言到图标映射
const languageToIconMap = {
    config: 'config',
    groovy: 'groovy',
    java: 'java',
    js: 'js',
    json: 'json',
    kotlin: 'kotlin',
    markdown: 'markdown',
    python: 'python',
    shell: 'shell',
    sql: 'sql',
    text: 'text',
    vue: 'vue',
    xml: 'xml',
    yaml: 'yaml',
    javascript: 'js',
    jsonc: 'json',
    kt: 'kotlin',
    md: 'markdown',
    py: 'python',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    txt: 'text',
    yml: 'yaml',
    ini: 'config',
    properties: 'config',
    cpp: 'text',
    c: 'text',
    go: 'text',
    rust: 'text',
    php: 'text',
    typescript: 'js',
    ts: 'js',
};

// 定义props
const props = defineProps({
    languageIconName: {
        type: String,
        default: 'python',
    },
    languageName: {
        type: String,
        default: 'Python',
    },
    additionsCount: {
        type: Number,
        default: 0,
    },
    deletionsCount: {
        type: Number,
        default: 0,
    },
});

// 获取语言图标
const getLanguageIcon = (lang) => `file_types-${languageToIconMap[lang?.toLowerCase()] || 'text'}`;

// 计算可视化方块
const visualBlocks = computed(() => {
    const totalChanges = props.additionsCount + props.deletionsCount;

    // 处理总变更数为0的情况
    if (totalChanges === 0) {
        return Array(5).fill({ state: 'empty' });
    }

    // 计算绿色方块数量（新增）
    const greenBlocksCount = Math.floor((props.additionsCount / totalChanges) * 5);

    // 计算红色方块数量（删除）
    const redBlocksCount = 5 - greenBlocksCount;

    const blocks = [];

    // 添加绿色方块（新增）
    for (let i = 0; i < greenBlocksCount; i++) {
        blocks.push({ state: 'added' });
    }

    // 添加红色方块（删除）
    for (let i = 0; i < redBlocksCount; i++) {
        blocks.push({ state: 'deleted' });
    }

    // 如果方块数不足5个，用空白方块填充
    while (blocks.length < 5) {
        blocks.push({ state: 'empty' });
    }

    return blocks;
});
</script>

<style scoped>
/* 根容器 - 严格按照JSON规范，头部不包含边框 */
.file-diff-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: #f6f8fa;
    border: none;
    border-bottom: 1px solid #d0d7de;
    border-radius: 6px 6px 0 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #24292f;
}

/* 左侧区域 */
.left-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

.language-icon {
    display: flex;
    align-items: center;
    color: #57606a;
}

.language-name {
    font-weight: 600;
    color: #24292f;
}

/* 右侧区域 */
.right-section {
    display: flex;
    align-items: center;
    gap: 16px;
}

.change-stats {
    display: flex;
    align-items: center;
    gap: 8px;
}

.additions-count {
    color: #1f883d;
    font-weight: 600;
}

.deletions-count {
    color: #cf222e;
    font-weight: 600;
}

/* 可视化方块容器 */
.change-blocks {
    display: flex;
    gap: 2px;
}

/* 方块基础样式 - 调整为9x9px */
.visual-block {
    width: 9px;
    height: 9px;
    border-radius: 2px;
}

/* 方块状态样式 - 完全匹配GitHub样式 */
.visual-block.added {
    background-color: #1f883d;
    border-color: #1f883d;
}

.visual-block.deleted {
    background: repeating-linear-gradient(to right bottom,
            rgba(255, 255, 255, 0.6),
            rgba(255, 255, 255, 0.6) 0.11rem,
            #cf222e 0.11rem,
            #cf222e 0.22rem);
    background-color: #cf222e;
    border-color: #cf222e;
}

.visual-block.empty {
    background-color: #d0d7de;
}
</style>