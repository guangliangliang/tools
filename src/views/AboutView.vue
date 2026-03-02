<template>
  <div class="about">
    <div class="about-card">
      <h1>About Page</h1>
      <p>This is a modern about page with enhanced styling</p>
      <div class="about-features">
        <div class="feature">
          <span class="feature-icon">🎨</span>
          <span class="feature-text">Modern Design</span>
        </div>
        <div class="feature">
          <span class="feature-icon">⚡</span>
          <span class="feature-text">Fast Performance</span>
        </div>
        <div class="feature">
          <span class="feature-icon">📱</span>
          <span class="feature-text">Responsive Layout</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 2rem;
}

.about-card {
  background: linear-gradient(135deg, var(--color-background-soft) 0%, var(--color-background) 100%);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (hover: hover) {
  .about-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg), var(--shadow-glow);
    border-color: var(--vt-c-gradient-start);
  }
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--vt-c-gradient-start), var(--vt-c-gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

p {
  color: var(--color-text);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.about-features {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: var(--color-background);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

@media (hover: hover) {
  .feature:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    border-color: var(--vt-c-accent);
  }
}

.feature-icon {
  font-size: 2rem;
}

.feature-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
  }

  .about-card {
    padding: 4rem;
  }

  h1 {
    font-size: 3rem;
  }
}
</style>
