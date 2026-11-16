import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminPages from '../views/admin/AdminPages.vue'
import { isAuthenticated } from '../utils/auth'

const adminRoutes = [
  ['dashboard', '数据总览'],
  ['products', '商品管理'],
  ['orders', '订单管理'],
  ['users', '用户管理'],
  ['categories', '分类管理'],
  ['reviews', '审核中心'],
  ['transactions', '交易记录'],
  ['operations', '运营活动'],
  ['messages', '消息中心'],
  ['settings', '系统设置'],
].map(([section, title]) => ({
  path: `/admin/${section}`,
  name: `admin-${section}`,
  component: AdminPages,
  meta: { requiresAuth: true, title },
}))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/admin/dashboard' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/admin', redirect: '/admin/dashboard' },
    ...adminRoutes,
    { path: '/admin/products/:id', name: 'admin-product-detail', component: AdminPages, meta: { requiresAuth: true, title: '商品详情' } },
    { path: '/:pathMatch(.*)*', redirect: '/admin/dashboard' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const authenticated = isAuthenticated()
  if (to.meta.requiresAuth && !authenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && authenticated) return '/admin/dashboard'
})

export default router
