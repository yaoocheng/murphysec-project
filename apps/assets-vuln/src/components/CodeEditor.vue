<template>
  <div class="code-editor-wrapper" :style="wrapperStyle">
    <code-mirror
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :lang="lang"
      :linter="linter"
      :extensions="extensions"
      :readonly="readonly"
      :placeholder="placeholder"
      class="code-editor"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, lineNumbers, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, insertNewlineAndIndent } from '@codemirror/commands';
import { bracketMatching, indentOnInput, indentUnit } from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import CodeMirror from 'vue-codemirror6';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'python',
    validator: (value) => ['python'].includes(value)
  },
  readonly: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  theme: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value)
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  maxHeight: {
    type: String,
    default: '400px'
  },
  showLineNumbers: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

// 计算编辑器高度
const editorHeight = computed(() => {
  return typeof props.height === 'number' ? `${props.height}px` : props.height;
});

// 包装器样式
const wrapperStyle = computed(() => {
  if (props.height === '100%') {
    return {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    };
  }
  return {
    height: editorHeight.value
  };
});

// 语言支持
const lang = computed(() => {
  switch (props.language) {
    case 'python':
      return python();
    default:
      return python();
  }
});

// 语法检查器
const linter = computed(() => {
  // Python 目前没有内置的 linter，可以根据需要添加
  return null;
});

// 扩展配置
const extensions = computed(() => {
  const exts = [];
  
  // 基础功能扩展
  exts.push(
    history(),
    keymap.of([
      ...defaultKeymap, 
      ...historyKeymap, 
      ...searchKeymap,
      {
        key: 'Enter',
        run: insertNewlineAndIndent
      }
    ]),
    bracketMatching(),
    indentOnInput(),
    indentUnit.of('    '), // 4个空格缩进
    EditorView.lineWrapping // 启用自动换行
  );
  
  // 行号
  if (props.showLineNumbers) {
    exts.push(lineNumbers());
  }
  
  // 主题
  if (props.theme === 'dark') {
    exts.push(oneDark);
  }
  
  // 编辑器配置
  exts.push(EditorView.theme({
    '&': {
      height: editorHeight.value === '100%' ? '100%' : editorHeight.value,
      maxHeight: editorHeight.value === '100%' ? '100%' : props.maxHeight,
    },
    '.cm-content': {
      padding: '12px',
      fontSize: '14px',
      fontFamily: '"Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
      lineHeight: '1.5',
    },
    '.cm-focused': {
      outline: 'none'
    },
    '.cm-editor': {
      borderRadius: '6px',
      border: '1px solid #e1e5e9',
    },
    '.cm-scroller': {
      overflow: 'auto',
      height: '100%',
    },
    '.cm-lineNumbers': {
      fontSize: '13px',
      color: props.theme === 'dark' ? '#5c6370' : '#999',
      backgroundColor: 'transparent',
      borderRight: props.theme === 'dark' ? '1px solid #3e4451' : '1px solid #eee',
      paddingRight: '8px',
      marginRight: '8px'
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      border: 'none'
    }
  }));
  
  // 只读模式配置
  if (props.readonly) {
    exts.push(EditorState.readOnly.of(true));
  }
  
  return exts;
});
</script>

<style scoped>
.code-editor-wrapper {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
}

.code-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.cm-editor) {
  border-radius: 6px;
  border: 1px solid #e1e5e9;
  height: 100% !important;
  overflow: hidden;
}

:deep(.cm-content) {
  padding: 12px;
  font-size: 14px;
  font-family: "Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace;
  line-height: 1.5;
}

:deep(.cm-focused) {
  outline: none;
  border-color: #1890ff;
}

:deep(.cm-scroller) {
  overflow: auto !important;
  height: 100% !important;
}

/* 只读模式样式 */
:deep(.cm-editor.cm-readonly) {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
}

:deep(.cm-readonly .cm-content) {
  color: #595959;
}
</style> 