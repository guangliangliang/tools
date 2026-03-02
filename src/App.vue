<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <div class="app">
    <nav class="navbar">
      <div class="nav-content">
        <RouterLink to="/" class="brand">
          <span class="brand-icon">🛠️</span>
          <span class="brand-text">DevTools</span>
        </RouterLink>
        <button class="menu-toggle" @click="toggleMenu" :class="{ active: menuOpen }" aria-label="菜单">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="nav-links" :class="{ open: menuOpen }">
          <RouterLink to="/" class="nav-link" @click="closeMenu">
            <span class="nav-link-icon">🏠</span>
            <span>首页</span>
          </RouterLink>
          <RouterLink to="/json-format" class="nav-link" @click="closeMenu">
            <span class="nav-link-icon">📋</span>
            <span>JSON 格式化</span>
          </RouterLink>
          <RouterLink to="/json-diff" class="nav-link" @click="closeMenu">
            <span class="nav-link-icon">🔀</span>
            <span>JSON 对比</span>
          </RouterLink>
          <RouterLink to="/markdown-editor" class="nav-link" @click="closeMenu">
            <span class="nav-link-icon">📝</span>
            <span>Markdown</span>
          </RouterLink>
        </div>
      </div>
    </nav>
    <div class="menu-overlay" :class="{ active: menuOpen }" @click="closeMenu"></div>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%);
  color: #1e293b;
  line-height: 1.6;
}

@media (prefers-color-scheme: dark) {
  body {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    color: #e2e8f0;
  }
}

.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column; 
}

.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .navbar {
    background: rgba(30, 41, 59, 0.95);
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}

.nav-content {
  width: 100%;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.brand:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.brand-icon {
  font-size: 1.5rem;
  filter: grayscale(0);
  transition: all 0.3s ease;
}

.brand:hover .brand-icon {
  transform: scale(1.1) rotate(5deg);
}

.nav-links {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
}

.nav-link:hover {
  color: #1e293b;
  background: rgba(99, 102, 241, 0.08);
}

@media (prefers-color-scheme: dark) {
  .nav-link {
    color: #94a3b8;
  }

  .nav-link:hover {
    color: #e2e8f0;
    background: rgba(99, 102, 241, 0.15);
  }
}

.nav-link.router-link-exact-active {
  color: #6366f1;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  .nav-link.router-link-exact-active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  }
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.menu-toggle:hover {
  background: rgba(99, 102, 241, 0.1);
}

.menu-toggle span {
  display: block;
  width: 22px;
  height: 2.5px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 auto;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(-10px);
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.main-content {
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 60px);
  overflow: auto;
  padding: 1.5rem;
}

@media (min-width: 1200px) {
  .main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
}

@media (min-width: 1600px) {
  .main-content {
    max-width: 1600px;
    padding: 2.5rem;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移动端菜单遮罩层 */
.menu-overlay {
  display: none;
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }

  .brand-text {
    font-size: 1.1rem;
  }

  .menu-toggle {
    display: flex;
    animation: pulse 2s ease-in-out infinite;
    z-index: 1001;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
  }

  .menu-toggle:hover {
    background: rgba(99, 102, 241, 0.2);
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  /* 遮罩层 */
  .menu-overlay {
    display: none;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 998;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .menu-overlay.active {
    display: block;
    opacity: 1;
  }

  .nav-links {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: stretch;
    padding: 2rem 1.5rem;
    gap: 0.75rem;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  }

  @media (prefers-color-scheme: dark) {
    .nav-links {
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.4);
    }
  }

  .nav-links.open {
    transform: translateX(0);
    animation: slideDown 0.3s ease;
  }

  .nav-link {
    padding: 1.25rem 1.5rem;
    font-size: 1.05rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.2);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .nav-link-icon {
    font-size: 1.25rem;
  }

  @media (prefers-color-scheme: dark) {
    .nav-link {
      background: rgba(51, 65, 85, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.1);
    }
  }

  .nav-link:hover {
    background: rgba(99, 102, 241, 0.15);
    transform: translateX(8px);
  }

  .nav-link.router-link-exact-active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
    border-color: rgba(99, 102, 241, 0.4);
    color: #6366f1;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }

  @media (prefers-color-scheme: dark) {
    .nav-link.router-link-exact-active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
  }
}

@media (max-width: 480px) {
  .brand-text {
    display: none;
  }

  .brand {
    padding: 0.5rem;
  }

  .nav-content {
    padding: 0 0.75rem;
  }
}
</style>
