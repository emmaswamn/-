import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import localCache from './../utils/cache'
// import WelcomeMain from './../components/main/welcome/WelcomeMain.vue'
// import UsersList from './../components/main/users/UsersList.vue'
// import RightView from './../components/main/power/RightView.vue'
// import RoleView from './../components/main/power/RoleView.vue'
// import GoodCate from './../components/main/good/GoodCate.vue'
// import GoodParam from './../components/main/good/GoodParam.vue'
// import GoodList from './../components/main/good/GoodList.vue'
// import OrderList from './../components/main/order/OrderList.vue'
// import ReportChart from './../components/main/report/ReportChart.vue'

const routes: Array<RouteRecordRaw> = [
  {path:'/', redirect:'/login'},
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( '../views/HomeView.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import(/* webpackChunkName: "about" */ '../views/HomeView.vue'),
    children: [
      {path:'/welcome', component: () => import('@/components/main/welcome/WelcomeMain.vue')},
      {path:'/users', component: () => import('@/components/main/users/UsersList.vue')},
      {path:'/rights', component: () => import('@/components/main/power/RightView.vue')},
      {path:'/roles', component: () => import('@/components/main/power/RoleView.vue')},
      {path:'/categories', component: () => import('@/components/main/good/GoodCate.vue')},
      {path:'/params', component: () => import('@/components/main/good/GoodParam.vue')},
      {path:'/goods', component: () => import('@/components/main/good/GoodList.vue')},
      {path:'/orders', component: () => import('@/components/main/order/OrderList.vue')},
      {path:'/reports', component: () => import('@/components/main/report/ReportChart.vue')}
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( '../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.path !== '/login') {
    const token = localCache.getCache('token')
    if (!token) {
      return '/login'
    }
  }
});

export default router
