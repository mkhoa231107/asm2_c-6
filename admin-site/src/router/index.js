import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Users from '../views/Users.vue';
import FoodItems from '../views/FoodItems.vue';
import Combos from '../views/Combos.vue';
import Orders from '../views/Orders.vue';

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/users', 
    name: 'Users', 
    component: Users,
    meta: { requiresAuth: true }
  },
  { 
    path: '/fooditems', 
    name: 'FoodItems', 
    component: FoodItems,
    meta: { requiresAuth: true }
  },
  { 
    path: '/combos', 
    name: 'Combos', 
    component: Combos,
    meta: { requiresAuth: true }
  },
  { 
    path: '/orders', 
    name: 'Orders', 
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token');
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
