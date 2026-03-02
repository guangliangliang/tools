<template>
  <div class="markdown-editor">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📝</span>
          Markdown 编辑
        </h1>
        <p class="page-desc">实时预览的 Markdown 编辑器，支持语法高亮</p>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-group toolbar-format">
        <button @click="insertBold" class="btn btn-icon-only" title="加粗">
          <span class="btn-icon-content">B</span>
        </button>
        <button @click="insertItalic" class="btn btn-icon-only" title="斜体">
          <span class="btn-icon-content btn-italic">I</span>
        </button>
        <button @click="insertHeading" class="btn btn-icon-only" title="标题">
          <span class="btn-icon-content btn-heading">H</span>
        </button>
        <button @click="insertLink" class="btn btn-icon-only" title="链接">
          <span class="btn-icon-content btn-link">🔗</span>
        </button>
        <button @click="insertCode" class="btn btn-icon-only" title="代码">
          <span class="btn-icon-content btn-code">&lt;/&gt;</span>
        </button>
        <button @click="insertList" class="btn btn-icon-only" title="列表">
          <span class="btn-icon-content btn-list">•</span>
        </button>
        <button @click="insertQuote" class="btn btn-icon-only" title="引用">
          <span class="btn-icon-content btn-quote">❝</span>
        </button>
      </div>
      <div class="toolbar-group">
        <button @click="copyMarkdown" class="btn btn-secondary btn-sm">
          <span class="btn-icon">📋</span>
          <span class="btn-text">复制 MD</span>
        </button>
        <button @click="copyHtml" class="btn btn-primary btn-sm">
          <span class="btn-icon">📄</span>
          <span class="btn-text">复制 HTML</span>
        </button>
        <button @click="clearAll" class="btn btn-ghost btn-sm">
          <span class="btn-icon">🗑️</span>
        </button>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-panel">
        <div class="panel-header">
          <div class="header-left">
            <span class="header-icon">📥</span>
            <span>Markdown 输入</span>
          </div>
          <span class="char-count">{{ charCount }} 字符</span>
        </div>
        <textarea
          v-model="markdownInput"
          placeholder="请输入 Markdown 内容..."
          class="editor-input"
          spellcheck="false"
          @input="updatePreview"
        ></textarea>
      </div>

      <div class="editor-panel">
        <div class="panel-header">
          <div class="header-left">
            <span class="header-icon">👁️</span>
            <span>实时预览</span>
          </div>
          <span class="preview-mode">Preview</span>
        </div>
        <div class="preview-output" v-html="previewHtml"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'

const markdownInput = ref('')
const previewHtml = ref('')

const charCount = computed(() => markdownInput.value.length)

onMounted(() => {
  markdownInput.value = `# 欢迎使用 Markdown 编辑器

## 功能特点

- **实时预览**：输入内容即刻显示效果
- **工具栏快捷插入**：快速添加常用格式
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

开始编辑吧！ ✨`
  updatePreview()
})

const updatePreview = () => {
  previewHtml.value = marked.parse(markdownInput.value) as string
}

const insertAtCursor = (before: string, after = '') => {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = markdownInput.value

  const selectedText = text.substring(start, end) || '文本'
  const replacement = before + selectedText + after

  markdownInput.value = text.substring(0, start) + replacement + text.substring(end)
  
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    updatePreview()
  }, 0)
}

const insertBold = () => insertAtCursor('**', '**')
const insertItalic = () => insertAtCursor('*', '*')
const insertHeading = () => insertAtCursor('## ')
const insertLink = () => insertAtCursor('[', '](https://)')
const insertCode = () => insertAtCursor('`', '`')
const insertList = () => insertAtCursor('- ')
const insertQuote = () => insertAtCursor('> ')

const copyMarkdown = async () => {
  if (!markdownInput.value) return
  try {
    await navigator.clipboard.writeText(markdownInput.value)
  } catch (e) {
    console.error('复制失败')
  }
}

const copyHtml = async () => {
  if (!previewHtml.value) return
  try {
    await navigator.clipboard.writeText(previewHtml.value)
  } catch (e) {
    console.error('复制失败')
  }
}

const clearAll = () => {
  markdownInput.value = ''
  updatePreview()
}
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
  color: var(--text-color);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.75rem;
}

.page-desc {
  color: var(--text-light);
  font-size: 0.95rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.02);
  gap: 1rem;
  flex-wrap: wrap;
  transition: all 0.3s ease;
}

@media (min-width: 1024px) {
  .toolbar {
    padding: 1.5rem;
    border-radius: 18px;
  }
}

@media (prefers-color-scheme: dark) {
  .toolbar {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15);
  }
}

.toolbar-group {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-icon {
  font-size: 1rem;
}

.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
}

.btn-icon-only {
  width: 40px;
  height: 40px;
  padding: 0;
  background: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-icon-only:hover {
  background: var(--border-color);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-icon-content {
  font-size: 1rem;
  font-weight: 600;
}

.btn-icon-content.btn-italic {
  font-style: italic;
  font-family: Georgia, serif;
}

.btn-icon-content.btn-heading {
  font-size: 0.85rem;
}

.btn-icon-content.btn-link {
  font-size: 0.9rem;
}

.btn-icon-content.btn-code {
  font-family: 'Consolas', monospace;
  font-size: 0.85rem;
}

.btn-icon-content.btn-list {
  font-size: 1.25rem;
}

.btn-icon-content.btn-quote {
  font-size: 1.1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
}

.btn-ghost {
  background: transparent;
  color: var(--text-light);
}

.btn-ghost:hover {
  color: #ef4444;
  background: #fef2f2;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  min-height: calc(100vh - 280px);
}

@media (min-width: 1200px) {
  .editor-container {
    gap: 2rem;
    min-height: calc(100vh - 320px);
  }
}

.editor-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
}

@media (min-width: 1024px) {
  .editor-panel {
    border-radius: 20px;
  }
}

@media (prefers-color-scheme: dark) {
  .editor-panel {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15);
  }
}

.editor-panel:focus-within {
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15), 0 4px 8px rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-2px);
}

.editor-panel:focus-within {
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: linear-gradient(180deg, var(--bg-color) 0%, transparent 100%);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-icon {
  font-size: 1rem;
}

.char-count,
.preview-mode {
  color: var(--text-light);
  font-size: 0.8rem;
  font-weight: 400;
  background: var(--card-bg);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--border-color);
}

.preview-mode {
  background: var(--primary-light);
  border-color: var(--primary-light);
  color: var(--primary-color);
}

.editor-input {
  flex: 1;
  padding: 1rem;
  border: none;
  resize: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.8;
  outline: none;
  min-height: 450px;
  background: transparent;
}

.editor-input::placeholder {
  color: var(--text-light);
  opacity: 0.6;
}

.preview-output {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  line-height: 1.8;
  background: #fafbfc;
}

.preview-output :deep(*) {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.preview-output :deep(h1) {
  font-size: 2em;
  margin-bottom: 0.75em;
  padding-bottom: 0.3em;
  border-bottom: 2px solid var(--border-color);
  color: var(--text-color);
}

.preview-output :deep(h2) {
  font-size: 1.5em;
  margin-bottom: 0.6em;
  padding-bottom: 0.25em;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
}

.preview-output :deep(h3) {
  font-size: 1.25em;
  margin-bottom: 0.5em;
  color: var(--text-color);
}

.preview-output :deep(h4),
.preview-output :deep(h5),
.preview-output :deep(h6) {
  font-size: 1em;
  margin-bottom: 0.5em;
  color: var(--text-color);
}

.preview-output :deep(p) {
  margin-bottom: 1em;
  color: var(--text-color);
}

.preview-output :deep(ul),
.preview-output :deep(ol) {
  margin-bottom: 1em;
  padding-left: 2em;
}

.preview-output :deep(li) {
  margin-bottom: 0.25em;
}

.preview-output :deep(blockquote) {
  border-left: 4px solid var(--primary-color);
  padding-left: 1em;
  margin: 1em 0;
  color: var(--text-light);
  font-style: italic;
  background: rgba(79, 70, 229, 0.05);
  padding: 0.75em 1em;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.preview-output :deep(code) {
  background: var(--bg-color);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.85em;
  color: #e11d48;
  border: 1px solid var(--border-color);
}

.preview-output :deep(pre) {
  background: #1e293b;
  padding: 1em;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin-bottom: 1em;
  box-shadow: var(--shadow-sm);
}

.preview-output :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #e2e8f0;
  border: none;
  font-size: 0.9em;
}

.preview-output :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.preview-output :deep(a:hover) {
  border-bottom-color: var(--primary-color);
}

.preview-output :deep(hr) {
  border: none;
  border-top: 2px solid var(--border-color);
  margin: 2em 0;
}

.preview-output :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
  background: var(--card-bg);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.preview-output :deep(th),
.preview-output :deep(td) {
  border: 1px solid var(--border-color);
  padding: 0.75em 1em;
  text-align: left;
}

.preview-output :deep(th) {
  background: var(--bg-color);
  font-weight: 600;
}

.preview-output :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-sm);
  margin: 1em 0;
}

/* 桌面端优化 */
@media (min-width: 1200px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .title-icon {
    font-size: 1.75rem;
  }
  
  .page-desc {
    font-size: 1rem;
  }
  
  .btn {
    padding: 0.625rem 1.125rem;
    font-size: 0.95rem;
  }
  
  .btn-icon-only {
    width: 44px;
    height: 44px;
  }
  
  .editor-input {
    font-size: 0.95rem;
    padding: 1.25rem;
  }
}

/* 平板和手机端响应式 */
@media (max-width: 992px) {
  .editor-container {
    grid-template-columns: 1fr;
  }

  .editor-panel {
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .markdown-editor {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .title-icon {
    font-size: 1.5rem;
  }

  .toolbar {
    padding: 1rem;
    border-radius: 12px;
  }

  .toolbar-format {
    order: 1;
    width: 100%;
    justify-content: center;
    margin-bottom: 0.75rem;
  }

  .toolbar-group:last-child {
    width: 100%;
    justify-content: center;
  }

  .btn-icon-only {
    width: 40px;
    height: 40px;
  }

  .btn-text {
    display: inline;
  }

  .panel-header {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .editor-input {
    padding: 1rem;
    font-size: 0.9rem;
  }

  .char-count,
  .preview-mode {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }

  .preview-output {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .markdown-editor {
    padding: 0.75rem;
  }

  .header-content {
    padding: 1rem;
    border-radius: 12px;
  }

  .page-title {
    font-size: 1.1rem;
  }

  .page-desc {
    font-size: 0.85rem;
  }

  .toolbar-format .btn-icon-only {
    width: 36px;
    height: 36px;
  }

  .toolbar-format .btn-icon-content {
    font-size: 0.9rem;
  }

  .editor-panel {
    border-radius: 12px;
  }

  .preview-output {
    padding: 1rem;
  }

  .preview-output :deep(h1) {
    font-size: 1.5em;
  }

  .preview-output :deep(h2) {
    font-size: 1.25em;
  }
}
</style>
