<template>
  <div class="home">
    <div class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>开发者工具集 v1.0</span>
        </div>
        <h1 class="hero-title">
          <span class="hero-icon">🛠️</span>
          <span class="title-text">开发者工具集</span>
        </h1>
        <p class="hero-subtitle">提升开发效率的在线工具，让工作更简单</p>
        <div class="hero-features">
          <span class="feature-tag">✨ 快速高效</span>
          <span class="feature-tag">🔒 安全本地</span>
          <span class="feature-tag">📱 响应式设计</span>
        </div>
      </div>
      <div class="hero-decoration">
        <div class="floating-icon">📋</div>
        <div class="floating-icon icon-2">🔀</div>
        <div class="floating-icon icon-3">📝</div>
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
      </div>
    </div>

    <div class="tools-grid">
      <div
        v-for="tool in tools"
        :key="tool.path"
        class="tool-card"
        @click="navigateTo(tool.path)"
      >
        <div class="tool-card-inner">
          <div class="tool-icon-wrapper">
            <span class="tool-icon">{{ tool.icon }}</span>
          </div>
          <h3 class="tool-title">{{ tool.name }}</h3>
          <p class="tool-desc">{{ tool.description }}</p>
          <div class="tool-footer">
            <span class="tool-link">立即使用</span>
            <span class="tool-arrow">→</span>
          </div>
          <div class="card-glow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const tools = [
  {
    name: 'JSON 格式化',
    icon: '📋',
    description: '格式化、压缩 JSON 数据，支持语法高亮和错误提示',
    path: '/json-format'
  },
  {
    name: 'JSON 对比',
    icon: '🔀',
    description: '对比两个 JSON 文件的差异，直观展示变化内容',
    path: '/json-diff'
  },
  {
    name: 'Markdown 编辑',
    icon: '📝',
    description: '实时预览的 Markdown 编辑器，支持语法高亮',
    path: '/markdown-editor'
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100%;
  background: transparent;
}

.hero {
  margin: 0 auto 3rem;
  text-align: center;
  padding: 4rem 3rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(241, 245, 249, 0.6) 100%);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.6);
  max-width: 900px;
}

@media (min-width: 1024px) {
  .hero {
    padding: 5rem 4rem;
    border-radius: 32px;
  }
}

@media (min-width: 1400px) {
  .hero {
    max-width: 1100px;
    padding: 6rem 5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .hero {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.5) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6366f1;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@media (prefers-color-scheme: dark) {
  .hero-badge {
    color: #a5b4fc;
  }
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .hero-title {
    color: #e2e8f0;
  }
}

.hero-icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

@media (min-width: 768px) {
  .hero-icon {
    font-size: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .hero-icon {
    font-size: 4rem;
  }
}

.title-text {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: #64748b;
  max-width: 550px;
  margin: 0 auto 1.25rem;
  line-height: 1.7;
}

@media (prefers-color-scheme: dark) {
  .hero-subtitle {
    color: #94a3b8;
  }
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 0.5rem 0.875rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s ease;
}

@media (prefers-color-scheme: dark) {
  .feature-tag {
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.15);
    color: #cbd5e1;
  }
}

.feature-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  font-size: 4rem;
  opacity: 0.08;
  animation: float 6s ease-in-out infinite;
  filter: blur(1px);
}

.floating-icon.icon-2 {
  right: 10%;
  top: 20%;
  animation-delay: 2s;
}

.floating-icon.icon-3 {
  left: 10%;
  bottom: 20%;
  animation-delay: 4s;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: orb-float 8s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #6366f1 0%, transparent 70%);
  top: -50px;
  right: -50px;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #ec4899 0%, transparent 70%);
  bottom: -30px;
  left: -30px;
  animation-delay: 4s;
}

@keyframes orb-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.tools-grid {
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
}

@media (min-width: 1024px) {
  .tools-grid {
    gap: 2.5rem;
    max-width: 1400px;
  }
}

@media (min-width: 1400px) {
  .tools-grid {
    gap: 3rem;
    max-width: 1600px;
  }
}

.tool-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .tool-card {
    padding: 2.5rem;
    min-height: 320px;
    border-radius: 24px;
  }
}

@media (prefers-color-scheme: dark) {
  .tool-card {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15);
  }
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tool-card:hover::before {
  transform: scaleX(1);
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
}

@media (prefers-color-scheme: dark) {
  .tool-card:hover {
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
  }
}

.tool-card:active {
  transform: translateY(-4px);
}

.tool-card-inner {
  position: relative;
  z-index: 1;
}

.tool-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(99, 102, 241, 0.15);
}

.tool-card:hover .tool-icon-wrapper {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.tool-icon {
  font-size: 1.875rem;
  transition: all 0.4s ease;
}

.tool-card:hover .tool-icon {
  filter: brightness(0) invert(1);
  transform: scale(1.05);
}

.tool-title {
  font-size: 1.1875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .tool-title {
    color: #e2e8f0;
  }
}

.tool-card:hover .tool-title {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tool-desc {
  color: #64748b;
  line-height: 1.7;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  min-height: 3rem;
}

@media (prefers-color-scheme: dark) {
  .tool-desc {
    color: #94a3b8;
  }
}

.tool-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6366f1;
  font-weight: 600;
  font-size: 0.875rem;
  transition: gap 0.3s ease;
}

.tool-card:hover .tool-footer {
  gap: 0.75rem;
}

.tool-arrow {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tool-card:hover .tool-arrow {
  transform: translateX(6px);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              rgba(99, 102, 241, 0.1) 0%,
              transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.tool-card:hover .card-glow {
  opacity: 1;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@media (max-width: 992px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

/* 平板和手机端响应式 */
@media (max-width: 992px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .home {
    padding: 0;
  }

  .hero {
    padding: 2.5rem 1.5rem;
    margin-bottom: 2rem;
    border-radius: 20px;
  }

  .hero-title {
    font-size: 1.75rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero-icon {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-features {
    gap: 0.5rem;
  }

  .feature-tag {
    font-size: 0.85rem;
    padding: 0.5rem 0.75rem;
  }

  .tools-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 0 1rem;
  }

  .tool-card {
    padding: 1.75rem;
    min-height: 260px;
  }

  .tool-icon-wrapper {
    width: 60px;
    height: 60px;
    margin-bottom: 1.25rem;
  }

  .tool-icon {
    font-size: 1.75rem;
  }

  .tool-title {
    font-size: 1.125rem;
  }

  .tool-desc {
    font-size: 0.9rem;
    min-height: auto;
    margin-bottom: 1.25rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 2rem 1.25rem;
    border-radius: 16px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .floating-icon {
    display: none;
  }

  .hero-features {
    display: none;
  }

  .tools-grid {
    padding: 0 0.75rem;
    gap: 1rem;
  }

  .tool-card {
    padding: 1.5rem;
    min-height: 240px;
    border-radius: 16px;
  }

  .tool-icon-wrapper {
    width: 54px;
    height: 54px;
    margin-bottom: 1rem;
    border-radius: 12px;
  }

  .tool-icon {
    font-size: 1.6rem;
  }

  .tool-desc {
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
}
</style>
