
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import EmployeeDashboard from '../views/EmployeeDashboard.vue'
import ManagerDashboard from '../views/ManagerDashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/employee',
    name: 'EmployeeDashboard',
    component: EmployeeDashboard,
    meta: { requiresAuth: true, role: 'employee' }
  },
  {
    path: '/manager',
    name: 'ManagerDashboard',
    component: ManagerDashboard,
    meta: { requiresAuth: true, role: 'manager' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  let user = {}

  try {
    user = JSON.parse(localStorage.getItem('user') || '{}')
  } catch (error) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    token = null
  }

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token && user.role) {
    next(user.role === 'manager' ? '/manager' : '/employee')
  } else if (to.meta.role && to.meta.role !== user.role) {
    next(user.role === 'manager' ? '/manager' : '/employee')
  } else {
    next()
  }
})

export default router
