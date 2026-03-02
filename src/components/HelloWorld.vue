<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What’s next?
    </h3>
  </div>
</template>

<style scoped>
.greetings {
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-background-soft) 0%, var(--color-background) 100%);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

@media (hover: hover) {
  .greetings:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--vt-c-accent);
  }
}

h1 {
  font-weight: 700;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--vt-c-accent), var(--vt-c-gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  animation: gradient-shift 3s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

h3 {
  font-size: 1.15rem;
  color: var(--color-text);
  opacity: 0.9;
  line-height: 1.8;
}

h3 :deep(a) {
  color: var(--vt-c-accent);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

h3 :deep(a:hover) {
  background-color: rgba(66, 185, 131, 0.15);
  color: var(--vt-c-accent-hover);
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings {
    padding: 2.5rem;
  }

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }

  h1 {
    font-size: 3rem;
  }
}
</style>
