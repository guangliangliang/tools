<template>
  <div class="json-diff">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🔀</span>
          JSON 对比工具
        </h1>
      </div>
    </div>

    <div class="tabs-container">
      <div class="tabs">
        <button 
          v-for="(example, idx) in examples" 
          :key="idx"
          class="tab-item" 
          :class="{ active: currentExample === idx }"
          @click="loadExample(idx)"
        >
          {{ example.name }}
        </button>
      </div>
      <div class="status-info" v-if="hasCompared">
        <span class="status-icon" v-if="diffCount > 0">Tips:</span>
        <span class="status-text" v-if="diffCount > 0">两侧JSON比对完成！共有 {{ diffCount }} 处不一致！</span>
        <span class="status-text" v-else>两侧JSON完全一致！</span>
      </div>
    </div>

    <transition name="slide">
      <div v-if="errorMessage" class="message message-error">
        <span class="message-icon">⚠️</span>
        <span class="message-text">{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="message-close">×</button>
      </div>
    </transition>

    <div class="diff-container">
      <div class="diff-panel">
        <div class="diff-editor">
          <div class="line-numbers">
            <span v-for="n in lines1.length" :key="`l1-${n}`">{{ n }}</span>
          </div>
          <div class="code-content">
            <div 
              v-for="(line, idx) in lines1" 
              :key="`line1-${idx}`" 
              class="code-line"
              :class="getLineClass1(idx)"
            >
              <span v-html="renderLine(line, 1, idx)"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="diff-panel">
        <div class="diff-editor">
          <div class="line-numbers">
            <span v-for="n in lines2.length" :key="`l2-${n}`">{{ n }}</span>
          </div>
          <div class="code-content">
            <div 
              v-for="(line, idx) in lines2" 
              :key="`line2-${idx}`" 
              class="code-line"
              :class="getLineClass2(idx)"
            >
              <span v-html="renderLine(line, 2, idx)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="toolbar-bottom">
      <div class="toolbar-group">
        <button @click="showInputModal = true" class="btn btn-secondary">
          <span class="btn-icon">✏️</span>
          <span class="btn-text">编辑 JSON</span>
        </button>
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
        <button @click="clearAll" class="btn btn-ghost">
          <span class="btn-icon">🗑️</span>
          <span class="btn-text">清空</span>
        </button>
      </div>
    </div>

    <div class="input-modal" v-if="showInputModal">
      <div class="modal-overlay" @click="showInputModal = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>编辑 JSON</h3>
          <button class="btn-close" @click="showInputModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-input-group">
            <label>左侧 JSON</label>
            <textarea
              v-model="inputJson1"
              class="modal-textarea"
              spellcheck="false"
            ></textarea>
          </div>
          <div class="modal-input-group">
            <label>右侧 JSON</label>
            <textarea
              v-model="inputJson2"
              class="modal-textarea"
              spellcheck="false"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showInputModal = false">取消</button>
          <button class="btn btn-primary" @click="applyAndClose">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const inputJson1 = ref('')
const inputJson2 = ref('')
const errorMessage = ref('')
const hasCompared = ref(false)
const showInputModal = ref(false)
const currentExample = ref(0)

const diffMapping = ref<{[key: number]: {side1: 'removed' | 'unchanged', side2: 'added' | 'unchanged'}}>({})
const charDiffs = ref<{[key: string]: number[]}>({})

const lines1 = ref<string[]>([])
const lines2 = ref<string[]>([])

const examples = [
  {
    name: '示例数据',
    json1: {
      "id": 1001,
      "name": "张三",
      "age": 28,
      "email": "zhangsan@example.com",
      "address": {
        "city": "北京",
        "district": "朝阳区",
        "street": "建国路88号"
      },
      "tags": ["前端", "JavaScript", "Vue"],
      "isActive": true,
      "lastLogin": "2024-01-15T08:00:00"
    },
    json2: {
      "id": 1001,
      "name": "张三",
      "age": 30,
      "email": "zhangsan@example.com",
      "address": {
        "city": "上海",
        "district": "浦东新区",
        "street": "建国路88号"
      },
      "tags": ["前端", "JavaScript", "React"],
      "isActive": true,
      "lastLogin": "2024-02-20T10:45:00"
    }
  },
  {
    name: '用户信息',
    json1: { "name": "李四", "role": "user" },
    json2: { "name": "李四", "role": "admin" }
  },
  {
    name: '商品数据',
    json1: { "product": "手机", "price": 2999 },
    json2: { "product": "手机", "price": 2799 }
  },
  {
    name: '配置选项',
    json1: { "theme": "light", "font": "14px" },
    json2: { "theme": "dark", "font": "16px" }
  },
  {
    name: 'API响应',
    json1: { "code": 200, "msg": "success" },
    json2: { "code": 500, "msg": "error" }
  }
]

const diffCount = computed(() => {
  let count = 0
  for (const key in diffMapping.value) {
    if (diffMapping.value[key].side1 !== 'unchanged' || diffMapping.value[key].side2 !== 'unchanged') {
      count++
    }
  }
  return count
})

const loadExample = (index: number) => {
  currentExample.value = index
  const example = examples[index]
  inputJson1.value = JSON.stringify(example.json1, null, 2)
  inputJson2.value = JSON.stringify(example.json2, null, 2)
  compareJson()
}

const compareJson = () => {
  errorMessage.value = ''
  hasCompared.value = false
  diffMapping.value = {}
  charDiffs.value = {}

  if (!inputJson1.value.trim() && !inputJson2.value.trim()) {
    return
  }

  let obj1: any, obj2: any
  try {
    if (inputJson1.value.trim()) {
      obj1 = JSON.parse(inputJson1.value)
    }
  } catch (e) {
    errorMessage.value = `左侧 JSON 格式错误：${(e as Error).message}`
    return
  }

  try {
    if (inputJson2.value.trim()) {
      obj2 = JSON.parse(inputJson2.value)
    }
  } catch (e) {
    errorMessage.value = `右侧 JSON 格式错误：${(e as Error).message}`
    return
  }

  const str1 = inputJson1.value.trim() ? JSON.stringify(obj1, null, 2) : ''
  const str2 = inputJson2.value.trim() ? JSON.stringify(obj2, null, 2) : ''

  lines1.value = str1.split('\n')
  lines2.value = str2.split('\n')

  generateDiff(lines1.value, lines2.value)
  hasCompared.value = true
}

const generateDiff = (linesA: string[], linesB: string[]) => {
  const maxLen = Math.max(linesA.length, linesB.length)
  
  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i] || ''
    const lineB = linesB[i] || ''
    
    if (!linesA[i]) {
      diffMapping.value[i] = { side1: 'unchanged', side2: 'added' }
    } else if (!linesB[i]) {
      diffMapping.value[i] = { side1: 'removed', side2: 'unchanged' }
    } else if (lineA !== lineB) {
      diffMapping.value[i] = { side1: 'removed', side2: 'added' }
      computeCharDiffs(lineA, lineB, i)
    } else {
      diffMapping.value[i] = { side1: 'unchanged', side2: 'unchanged' }
    }
  }
}

const computeCharDiffs = (lineA: string, lineB: string, idx: number) => {
  const diffsA: number[] = []
  const diffsB: number[] = []
  
  const minLen = Math.min(lineA.length, lineB.length)
  
  for (let i = 0; i < minLen; i++) {
    if (lineA[i] !== lineB[i]) {
      diffsA.push(i)
      diffsB.push(i)
    }
  }
  
  if (lineA.length > lineB.length) {
    for (let i = lineB.length; i < lineA.length; i++) {
      diffsA.push(i)
    }
  }
  
  if (lineB.length > lineA.length) {
    for (let i = lineA.length; i < lineB.length; i++) {
      diffsB.push(i)
    }
  }
  
  charDiffs.value[`1-${idx}`] = diffsA
  charDiffs.value[`2-${idx}`] = diffsB
}

const getLineClass1 = (idx: number) => {
  if (!diffMapping.value[idx]) return ''
  return `line-${diffMapping.value[idx].side1}`
}

const getLineClass2 = (idx: number) => {
  if (!diffMapping.value[idx]) return ''
  return `line-${diffMapping.value[idx].side2}`
}

const renderLine = (line: string, side: number, idx: number) => {
  const key = `${side}-${idx}`
  const diffIndices = charDiffs.value[key]
  
  if (!diffIndices || diffIndices.length === 0) {
    return escapeHtml(line)
  }
  
  let result = ''
  let inDiff = false
  let currentPart = ''
  
  for (let i = 0; i < line.length; i++) {
    const isDiff = diffIndices.includes(i)
    
    if (isDiff !== inDiff) {
      if (currentPart) {
        result += inDiff 
          ? `<span class="highlight-diff">${escapeHtml(currentPart)}</span>` 
          : escapeHtml(currentPart)
        currentPart = ''
      }
      inDiff = isDiff
    }
    currentPart += line[i]
  }
  
  if (currentPart) {
    result += inDiff 
      ? `<span class="highlight-diff">${escapeHtml(currentPart)}</span>` 
      : escapeHtml(currentPart)
  }
  
  return result
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
  
  if (hasCompared.value) {
    compareJson()
  }
}

const clearAll = () => {
  inputJson1.value = ''
  inputJson2.value = ''
  errorMessage.value = ''
  hasCompared.value = false
  lines1.value = []
  lines2.value = []
  diffMapping.value = {}
  charDiffs.value = {}
}

const applyAndClose = () => {
  showInputModal.value = false
  compareJson()
}

onMounted(() => {
  loadExample(0)
})
</script>

<style scoped>
.json-diff {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.page-header {
  flex-shrink: 0;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.header-content {
  padding: 12px 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-link {
  background: transparent;
  color: #4b5563;
}

.btn-link:hover {
  color: #1f2937;
}

.btn-primary-outline {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.btn-primary-outline:hover {
  background: #eff6ff;
}

.btn-primary {
  background: #3b82f6;
  color: #ffffff;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-info {
  background: #06b6d4;
  color: #ffffff;
}

.btn-info:hover {
  background: #0891b2;
}

.btn-ghost {
  background: transparent;
  color: #6b7280;
}

.btn-ghost:hover {
  background: #f3f4f6;
  color: #374151;
}

.badge {
  background: #3b82f6;
  color: white;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 12px;
}

.tabs {
  display: flex;
  gap: 4px;
}

.tab-item {
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: #4b5563;
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.tab-item:hover {
  background: #f3f4f6;
}

.tab-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.status-icon {
  color: #dc2626;
  font-weight: 600;
}

.status-text {
  color: #4b5563;
}

.message {
  margin: 12px 20px;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  flex-shrink: 0;
}

.message-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.message-icon {
  font-size: 16px;
}

.message-text {
  flex: 1;
}

.message-close {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
  padding: 0;
  line-height: 1;
  color: #dc2626;
}

.message-close:hover {
  opacity: 1;
}

.diff-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.diff-panel {
  border-right: 1px solid #e5e7eb;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.diff-panel:last-child {
  border-right: none;
}

.diff-editor {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.line-numbers {
  background: #f9fafb;
  padding: 12px 8px;
  border-right: 1px solid #e5e7eb;
  text-align: right;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #9ca3af;
  user-select: none;
  flex-shrink: 0;
  overflow: hidden;
}

.line-numbers span {
  display: block;
  height: 20.8px;
}

.code-content {
  flex: 1;
  padding: 12px 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow: auto;
}

.code-line {
  white-space: pre;
  min-height: 20.8px;
  padding: 0 4px;
  margin: 0 -4px;
  border-radius: 2px;
}

.code-line.line-removed {
  background: #fee2e2;
}

.code-line.line-added {
  background: #dcfce7;
}

.code-line.line-unchanged {
  background: transparent;
}

.highlight-diff {
  background: #fef08a;
  border-radius: 2px;
}

.toolbar-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.input-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  line-height: 1;
}

.btn-close:hover {
  color: #374151;
}

.modal-body {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  overflow: auto;
  flex: 1;
}

.modal-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-input-group label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.modal-textarea {
  flex: 1;
  min-height: 200px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.modal-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
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

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .tabs-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .diff-container {
    grid-template-columns: 1fr;
  }
  
  .diff-panel {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-body {
    grid-template-columns: 1fr;
  }
  
  .toolbar-bottom {
    flex-direction: column;
  }
  
  .toolbar-group {
    justify-content: center;
    width: 100%;
  }
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
