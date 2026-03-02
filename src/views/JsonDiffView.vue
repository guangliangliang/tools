<template>
  <div class="json-diff">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🔀</span>
          JSON 对比
        </h1>
        <p class="page-desc">对比两个 JSON 文件的差异，直观展示变化内容</p>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-group">
        <button @click="compareJson" class="btn btn-primary">
          <span class="btn-icon">🔍</span>
          <span class="btn-text">开始对比</span>
        </button>
        <button @click="swapJson" class="btn btn-info">
          <span class="btn-icon">🔄</span>
          <span class="btn-text">交换位置</span>
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

    <div class="input-container">
      <div class="editor-panel">
        <div class="panel-header">
          <div class="header-left">
            <span class="header-badge badge-1">1</span>
            <span>原始 JSON</span>
          </div>
          <span class="char-count">{{ input1Length }} 字符</span>
        </div>
        <textarea
          v-model="inputJson1"
          placeholder="请粘贴第一个 JSON 内容..."
          class="editor-input"
          spellcheck="false"
        ></textarea>
      </div>

      <div class="compare-divider">
        <span class="vs-badge">VS</span>
      </div>

      <div class="editor-panel">
        <div class="panel-header">
          <div class="header-left">
            <span class="header-badge badge-2">2</span>
            <span>对比 JSON</span>
          </div>
          <span class="char-count">{{ input2Length }} 字符</span>
        </div>
        <textarea
          v-model="inputJson2"
          placeholder="请粘贴第二个 JSON 内容..."
          class="editor-input"
          spellcheck="false"
        ></textarea>
      </div>
    </div>

    <transition name="slide">
      <div v-if="errorMessage" class="message message-error">
        <span class="message-icon">⚠️</span>
        <span class="message-text">{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="message-close">×</button>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="hasCompared && !diffResult" class="result-box result-same">
        <div class="result-icon">✅</div>
        <h3>完全一致</h3>
        <p>两个 JSON 内容完全相同</p>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="diffResult" class="result-container">
        <div class="result-header">
          <h3 class="result-title">📊 对比结果</h3>
          <div class="legend">
            <span class="legend-item legend-added">
              <span class="legend-dot"></span>
              新增
            </span>
            <span class="legend-item legend-removed">
              <span class="legend-dot"></span>
              删除
            </span>
            <span class="legend-item legend-unchanged">
              <span class="legend-dot"></span>
              不变
            </span>
          </div>
        </div>
        <div class="diff-content" v-html="diffResult"></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const inputJson1 = ref('')
const inputJson2 = ref('')
const errorMessage = ref('')
const diffResult = ref('')
const hasCompared = ref(false)

const input1Length = computed(() => inputJson1.value.length)
const input2Length = computed(() => inputJson2.value.length)

const compareJson = () => {
  errorMessage.value = ''
  diffResult.value = ''
  hasCompared.value = false

  if (!inputJson1.value.trim() || !inputJson2.value.trim()) {
    errorMessage.value = '请输入两个 JSON 内容'
    return
  }

  let obj1: any, obj2: any
  try {
    obj1 = JSON.parse(inputJson1.value)
  } catch (e) {
    errorMessage.value = `JSON 1 格式错误：${(e as Error).message}`
    return
  }

  try {
    obj2 = JSON.parse(inputJson2.value)
  } catch (e) {
    errorMessage.value = `JSON 2 格式错误：${(e as Error).message}`
    return
  }

  const str1 = JSON.stringify(obj1, null, 2)
  const str2 = JSON.stringify(obj2, null, 2)

  if (str1 === str2) {
    hasCompared.value = true
    return
  }

  diffResult.value = generateDiff(str1, str2)
}

const generateDiff = (str1: string, str2: string): string => {
  const lines1 = str1.split('\n')
  const lines2 = str2.split('\n')
  const result: string[] = []

  const maxLen = Math.max(lines1.length, lines2.length)

  for (let i = 0; i < maxLen; i++) {
    const line1 = lines1[i] ?? ''
    const line2 = lines2[i] ?? ''

    if (lines1[i] === undefined) {
      result.push(`<div class="diff-line added"><span class="diff-marker">+</span><span class="diff-text">${escapeHtml(line2)}</span></div>`)
    } else if (lines2[i] === undefined) {
      result.push(`<div class="diff-line removed"><span class="diff-marker">-</span><span class="diff-text">${escapeHtml(line1)}</span></div>`)
    } else if (line1 !== line2) {
      result.push(`<div class="diff-line removed"><span class="diff-marker">-</span><span class="diff-text">${escapeHtml(line1)}</span></div>`)
      result.push(`<div class="diff-line added"><span class="diff-marker">+</span><span class="diff-text">${escapeHtml(line2)}</span></div>`)
    } else {
      result.push(`<div class="diff-line unchanged"><span class="diff-marker"> </span><span class="diff-text">${escapeHtml(line1)}</span></div>`)
    }
  }

  return result.join('')
}

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const swapJson = () => {
  const temp = inputJson1.value
  inputJson1.value = inputJson2.value
  inputJson2.value = temp
  diffResult.value = ''
  hasCompared.value = false
}

const clearAll = () => {
  inputJson1.value = ''
  inputJson2.value = ''
  errorMessage.value = ''
  diffResult.value = ''
  hasCompared.value = false
}

const loadTestData = () => {
  // 原始 JSON - 版本 1
  const jsonData1 = {
    name: "开发者工具集",
    version: "1.0.0",
    description: "提升开发效率的在线工具集合",
    author: {
      name: "Developer",
      email: "dev@example.com"
    },
    features: [
      "JSON 格式化",
      "JSON 对比"
    ],
    config: {
      theme: "light",
      language: "zh-CN"
    }
  }
  
  // 对比 JSON - 版本 2（有一些差异）
  const jsonData2 = {
    name: "开发者工具集 Pro",
    version: "2.0.0",
    description: "提升开发效率的在线工具集合 - 专业版",
    author: {
      name: "Developer Team",
      email: "team@example.com",
      website: "https://example.com"
    },
    features: [
      "JSON 格式化",
      "JSON 对比",
      "Markdown 编辑器",
      "代码高亮"
    ],
    config: {
      theme: "dark",
      language: "zh-CN",
      autoSave: true
    },
    createdAt: "2024-01-15T08:00:00.000Z"
  }
  
  inputJson1.value = JSON.stringify(jsonData1, null, 2)
  inputJson2.value = JSON.stringify(jsonData2, null, 2)
  errorMessage.value = '已加载测试数据，点击"开始对比"查看差异'
}
</script>

<style scoped>
.json-diff {
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
  .json-diff {
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

.input-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
}

@media (min-width: 1200px) {
  .input-container {
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

.header-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
}

.badge-1 {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.badge-2 {
  background: linear-gradient(135deg, #ec4899, #db2777);
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

.editor-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: none;
  resize: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  outline: none;
  background: transparent;
  min-height: 150px;
}

.editor-input::placeholder {
  color: var(--text-light);
  opacity: 0.6;
}

.compare-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.vs-badge {
  background: linear-gradient(135deg, var(--primary-color), #7c3aed);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.4rem 0.625rem;
  border-radius: 9999px;
  box-shadow: var(--shadow-md);
  z-index: 1;
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

.message-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
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

.result-same {
  padding: 2rem;
  background: var(--card-bg);
  border: 2px dashed #bbf7d0;
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--text-light);
  flex-shrink: 0;
}

.result-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.result-same h3 {
  color: #16a34a;
  font-size: 1.1rem;
  margin-bottom: 0.375rem;
}

.result-same p {
  font-size: 0.85rem;
}

.result-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(180deg, var(--bg-color) 0%, transparent 100%);
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 0.75rem;
  flex-shrink: 0;
}

.result-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
}

.legend {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.legend-added .legend-dot {
  background: #16a34a;
}

.legend-removed .legend-dot {
  background: #dc2626;
}

.legend-unchanged .legend-dot {
  background: var(--text-light);
}

.diff-content {
  padding: 0.75rem 1rem;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.8;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.diff-line {
  display: flex;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  margin-bottom: 1px;
}

.diff-line.added {
  background: rgba(34, 197, 94, 0.15);
}

.diff-line.removed {
  background: rgba(239, 68, 68, 0.15);
}

.diff-line.unchanged {
  background: transparent;
}

.diff-marker {
  width: 1.25rem;
  flex-shrink: 0;
  text-align: center;
  font-weight: 700;
  font-size: 0.7rem;
}

.diff-line.added .diff-marker {
  color: #16a34a;
}

.diff-line.removed .diff-marker {
  color: #dc2626;
}

.diff-line.unchanged .diff-marker {
  color: var(--text-light);
  opacity: 0.5;
}

.diff-text {
  flex: 1;
  word-break: break-all;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  
  .editor-input {
    font-size: 0.95rem;
    padding: 1.25rem;
  }
}

/* 平板和手机端响应式 */
@media (max-width: 992px) {
  .input-container {
    grid-template-columns: 1fr;
  }

  .compare-divider {
    padding: 0.5rem 0;
  }

  .vs-badge {
    transform: rotate(90deg);
  }
}

@media (max-width: 768px) {
  .json-diff {
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

  .editor-input {
    padding: 1rem;
    font-size: 0.9rem;
  }

  .char-count {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .legend {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .json-diff {
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

  .diff-content {
    font-size: 0.8rem;
    padding: 0.75rem;
  }

  .diff-marker {
    width: 1.25rem;
  }
}
</style>
