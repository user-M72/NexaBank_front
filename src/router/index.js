import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/profile' },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/accounts',
    component: () => import('../views/AccountsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/accounts/:id',
    component: () => import('../views/AccountDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transfer',
    component: () => import('../views/TransferView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  if (to.meta.requiresAuth && !token) return next('/login')
  if (to.meta.guest && token) return next('/profile')
  next()
})

export default router
