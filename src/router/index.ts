import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/json-format',
      name: 'json-format',
      component: () => import('../views/JsonFormatView.vue'),
    },
    {
      path: '/json-diff',
      name: 'json-diff',
      component: () => import('../views/JsonDiffView.vue'),
    },
    {
      path: '/markdown-editor',
      name: 'markdown-editor',
      component: () => import('../views/MarkdownEditorView.vue'),
    },
    {
      path: '/sql-converter',
      name: 'sql-converter',
      component: () => import('../views/SqlConverterView.vue'),
    },
    {
      path: '/sql-to-entity',
      name: 'sql-to-entity',
      component: () => import('../views/SqlToEntityView.vue'),
    },
  ],
})

export default router
