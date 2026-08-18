import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/types',
      name: 'types',
      component: () => import('@/views/TypesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('@/views/ArticlesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/articles/create',
      name: 'article-create',
      component: () => import('@/views/ArticleCreateView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/articles/:id',
      name: 'article-detail',
      component: () => import('@/views/ArticleDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/articles/:id/edit',
      name: 'article-edit',
      component: () => import('@/views/ArticleEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

let authInitialized = false

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authInitialized) {
    await authStore.initializeAuth()
    authInitialized = true
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
