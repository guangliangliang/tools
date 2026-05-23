<template>
  <div class="markdown-editor">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📝</span>
          Markdown 编辑
        </h1>
        <p class="page-desc">功能强大的 Markdown 编辑器，支持语法高亮和实时预览</p>
      </div>
    </div>
    <MdEditor
      v-model="markdownContent"
      :theme="theme"
      :toolbars="toolbars"
      :toolbars-exclude="toolbarsExclude"
      style="height: calc(100vh - 200px)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const markdownContent = ref(`# 欢迎使用 Markdown 编辑器

## 功能特点

- **实时预览**：输入内容即刻显示效果
- **丰富的工具栏**：快速添加常用格式
- **支持标准 Markdown 语法**

## 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!')
}
\`\`\`

## 引用

> 这是一个引用块示例

## 链接

访问 [GitHub](https://github.com) 获取更多信息

---

开始编辑吧！ ✨`)

// 主题切换
const theme = ref<'light' | 'dark'>('light')
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
  theme.value = e.matches ? 'dark' : 'light'
}

onMounted(() => {
  updateTheme(mediaQuery)
  mediaQuery.addEventListener('change', updateTheme)
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', updateTheme)
})

// 工具栏配置
const toolbars = [
  'bold',
  'underline',
  'italic',
  '-',
  'strikeThrough',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  '-',
  'codeRow',
  'code',
  'link',
  'imageLink',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog',
  'github'
]

const toolbarsExclude: string[] = []
</script>

<style scoped>
.markdown-editor {
  width: 100%;
  padding: 1.5rem;
  max-width: 1800px;
  margin: 0 auto;
}

@media (min-width: 1200px) {
  .markdown-editor {
    padding: 2rem;
  }
}

.page-header {
  margin-bottom: 1.5rem;
}

.header-content {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

@media (min-width: 1024px) {
  .header-content {
    padding: 2rem 2.5rem;
    border-radius: 20px;
  }
}

@media (prefers-color-scheme: dark) {
  .header-content {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.15);
  }
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vt-c-text-light-1);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  .page-title {
    color: var(--vt-c-text-dark-1);
  }
}

.title-icon {
  font-size: 1.75rem;
}

.page-desc {
  color: var(--vt-c-text-light-3);
  font-size: 0.95rem;
}

@media (prefers-color-scheme: dark) {
  .page-desc {
    color: var(--vt-c-text-dark-3);
  }
}
</style>
