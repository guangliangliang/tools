<template>
  <div class="json-format">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📋</span>
          JSON 格式化
        </h1>
        <p class="page-desc">格式化、压缩 JSON 数据，支持语法高亮和错误提示</p>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-group">
        <button @click="formatJson" class="btn btn-primary">
          <span class="btn-icon">✨</span>
          <span class="btn-text">格式化</span>
        </button>
        <button @click="compressJson" class="btn btn-success">
          <span class="btn-icon">🗜️</span>
          <span class="btn-text">压缩</span>
        </button>
        <button @click="copyOutput" class="btn btn-info">
          <span class="btn-icon">📋</span>
          <span class="btn-text">复制结果</span>
        </button>
      </div>
      <div class="toolbar-group">
        <button @click="loadTestData" class="btn btn-warning">
          <span class="btn-icon">📥</span>
          <span class="btn-text">测试数据</span>
        </button>
        <button @click="clearAll" class="btn btn-ghost">
          <span class="btn-icon">🗑️</span>
          <span class="btn-text">清空</span>
        </button>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-panel">
        <div class="panel-header">
          <div class="header-left">
            <span class="header-icon">📥</span>
            <span>输入 JSON</span>
          </div>
          <span class="char-count">{{ inputLength }} 字符</span>
        </div>
        <div class="monaco-editor-wrapper">
          <div ref="inputEditorRef" class="monaco-editor"></div>
        </div>
      </div>

      <div class="editor-panel">
        <div class="panel-header">
          <div class="header-left">
            <span class="header-icon">📤</span>
            <span>输出 JSON</span>
          </div>
          <span class="char-count">{{ outputLength }} 字符</span>
        </div>
        <div class="monaco-editor-wrapper">
          <div ref="outputEditorRef" class="monaco-editor"></div>
        </div>
      </div>
    </div>

    <transition name="slide">
      <div v-if="errorMessage" class="message" :class="messageType">
        <span class="message-icon">{{ messageIcon }}</span>
        <span class="message-text">{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="message-close">×</button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

const inputJson = ref('')
const outputJson = ref('')
const errorMessage = ref('')
const inputEditorRef = ref<HTMLElement | null>(null)
const outputEditorRef = ref<HTMLElement | null>(null)

let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null

const inputLength = computed(() => inputJson.value.length)
const outputLength = computed(() => outputJson.value.length)

const messageType = computed(() => {
  if (errorMessage.value.includes('错误')) return 'error'
  return 'success'
})

const messageIcon = computed(() => {
  if (messageType.value === 'error') return '⚠️'
  return '✅'
})

const formatJson = () => {
  const value = inputJson.value.trim()
  if (!value) {
    errorMessage.value = '请输入 JSON 内容'
    return
  }

  try {
    const parsed = JSON.parse(value)
    const formatted = JSON.stringify(parsed, null, 2)
    outputJson.value = formatted
    updateOutputEditor(formatted)
    errorMessage.value = '格式化成功！'
  } catch (e) {
    errorMessage.value = `JSON 格式错误：${(e as Error).message}`
    outputJson.value = ''
    updateOutputEditor('')
  }
}

const compressJson = () => {
  const value = inputJson.value.trim()
  if (!value) {
    errorMessage.value = '请输入 JSON 内容'
    return
  }

  try {
    const parsed = JSON.parse(value)
    const compressed = JSON.stringify(parsed)
    outputJson.value = compressed
    updateOutputEditor(compressed)
    errorMessage.value = '压缩成功！'
  } catch (e) {
    errorMessage.value = `JSON 格式错误：${(e as Error).message}`
    outputJson.value = ''
    updateOutputEditor('')
  }
}

const copyOutput = async () => {
  if (!outputJson.value) {
    errorMessage.value = '没有可复制的内容'
    return
  }

  try {
    await navigator.clipboard.writeText(outputJson.value)
    errorMessage.value = '已复制到剪贴板！'
    setTimeout(() => {
      if (errorMessage.value === '已复制到剪贴板！') {
        errorMessage.value = ''
      }
    }, 2000)
  } catch (e) {
    errorMessage.value = '复制失败，请手动复制'
  }
}

const clearAll = () => {
  inputJson.value = ''
  outputJson.value = ''
  errorMessage.value = ''
  if (inputEditor) {
    inputEditor.setValue('')
  }
  if (outputEditor) {
    outputEditor.setValue('')
  }
}

const loadTestData = () => {
  const testData = {
    name: "开发者工具集",
    version: "1.0.0",
    description: "提升开发效率的在线工具集合",
    author: {
      name: "Developer",
      email: "dev@example.com",
      website: "https://example.com"
    },
    features: [
      "JSON 格式化",
      "JSON 对比",
      "Markdown 编辑器"
    ],
    config: {
      theme: "dark",
      language: "zh-CN",
      autoSave: true,
      maxFileSize: 10485760
    },
    stats: {
      totalUsers: 15280,
      dailyActive: 3420,
      monthlyActive: 8750
    },
    createdAt: "2024-01-15T08:00:00.000Z",
    updatedAt: "2024-03-02T12:30:00.000Z"
  }
  const testDataStr = JSON.stringify(testData, null, 2)
  inputJson.value = testDataStr
  if (inputEditor) {
    inputEditor.setValue(testDataStr)
  }
  errorMessage.value = '已加载测试数据，点击"格式化"或"压缩"查看效果'
}

// 初始化 Monaco Editor
const initEditors = () => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // 输入编辑器
  if (inputEditorRef.value) {
    inputEditor = monaco.editor.create(inputEditorRef.value, {
      value: '',
      language: 'json',
      theme: isDark ? 'vs-dark' : 'light',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      padding: { top: 12, bottom: 12 },
      suggest: {
        showWords: false
      }
    })
    
    // 监听输入变化
    inputEditor.onDidChangeModelContent(() => {
      if (inputEditor) {
        inputJson.value = inputEditor.getValue()
      }
    })
  }
  
  // 输出编辑器（只读）
  if (outputEditorRef.value) {
    outputEditor = monaco.editor.create(outputEditorRef.value, {
      value: '',
      language: 'json',
      theme: isDark ? 'vs-dark' : 'light',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      padding: { top: 12, bottom: 12 },
      readOnly: true,
      suggest: {
        showWords: false
      }
    })
  }
}

// 更新输出编辑器内容
const updateOutputEditor = (value: string) => {
  if (outputEditor) {
    outputEditor.setValue(value)
  }
}

// 监听深色模式变化
const handleThemeChange = (e: MediaQueryListEvent) => {
  monaco.editor.setTheme(e.matches ? 'vs-dark' : 'light')
}

onMounted(() => {
  initEditors()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange)
})

onBeforeUnmount(() => {
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleThemeChange)
  if (inputEditor) {
    inputEditor.dispose()
  }
  if (outputEditor) {
    outputEditor.dispose()
  }
})
</script>

<style scoped>
.json-format {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem;
  max-width: 1800px;
  margin: 0 auto;
}

@media (min-width: 1200px) {
  .json-format {
    padding: 2rem;
    gap: 1.5rem;
  }
}

.page-header {
  flex-shrink: 0;
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
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.5rem;
}

.page-desc {
  color: var(--text-light);
  font-size: 0.85rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.toolbar-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn:active {
  transform: scale(0.97);
}

.btn-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.btn-text {
  flex-shrink: 0;
}

/* 主按钮 - 紫色渐变 */
.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
  transform: translateY(-2px);
}

/* 成功按钮 - 绿色 */
.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
}

.btn-success:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
  transform: translateY(-2px);
}

/* 信息按钮 - 蓝色 */
.btn-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
}

.btn-info:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45);
  transform: translateY(-2px);
}

/* 警告按钮 - 橙色 */
.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
}

.btn-warning:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
  transform: translateY(-2px);
}

/* 次要按钮 - 灰色边框 */
.btn-secondary {
  background: #ffffff;
  color: #374151;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

@media (prefers-color-scheme: dark) {
  .btn-secondary {
    background: #1f2937;
    color: #f3f4f6;
    border-color: #374151;
  }
  
  .btn-secondary:hover {
    background: #374151;
    border-color: #4b5563;
  }
}

/* 幽灵按钮 */
.btn-ghost {
  background: transparent;
  color: #64748b;
  border: 2px solid transparent;
  box-shadow: none;
}

.btn-ghost:hover {
  color: #ef4444;
  background: #fef2f2;
  border-color: #fecaca;
}

@media (prefers-color-scheme: dark) {
  .btn-ghost {
    color: #94a3b8;
  }
  
  .btn-ghost:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #fca5a5;
  }
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
}

@media (min-width: 1200px) {
  .editor-container {
    gap: 2rem;
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
  min-height: 0;
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
  padding: 0.625rem 1rem;
  background: linear-gradient(180deg, var(--bg-color) 0%, transparent 100%);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-color);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-icon {
  font-size: 0.9rem;
}

.char-count {
  color: var(--text-light);
  font-size: 0.75rem;
  font-weight: 400;
  background: var(--card-bg);
  padding: 0.2rem 0.625rem;
  border-radius: 9999px;
  border: 1px solid var(--border-color);
}

/* Monaco Editor 容器 */
.monaco-editor-wrapper {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: transparent;
}

.monaco-editor {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

/* 深色模式下的编辑器背景 */
@media (prefers-color-scheme: dark) {
  .monaco-editor-wrapper {
    background: transparent;
  }
}

.message {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.message.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.message.success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

.message-icon {
  font-size: 1.1rem;
}

.message-text {
  flex: 1;
}

.message-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.6;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.message-close:hover {
  opacity: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 桌面端优化 - 更大的字体和间距 */
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
  
  .monaco-editor {
    min-height: 400px;
  }
}

/* 平板和手机端响应式 */
@media (max-width: 992px) {
  .editor-container {
    grid-template-columns: 1fr;
  }

  .editor-panel {
    min-height: 350px;
  }
  
  .monaco-editor {
    min-height: 280px;
  }
}

@media (max-width: 768px) {
  .json-format {
    padding: 1rem;
    gap: 0.75rem;
  }

  .header-content {
    padding: 1.25rem 1.5rem;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .title-icon {
    font-size: 1.5rem;
  }

  .page-desc {
    font-size: 0.9rem;
  }

  .toolbar {
    padding: 1rem;
    border-radius: 12px;
  }

  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .btn-icon {
    display: inline;
  }

  .panel-header {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .monaco-editor {
    min-height: 250px;
  }

  .char-count {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .json-format {
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

  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .toolbar-group {
    justify-content: center;
  }

  .btn {
    flex: 1;
    justify-content: center;
    min-width: 80px;
  }

  .message {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    border-radius: 12px;
  }
}
</style>
