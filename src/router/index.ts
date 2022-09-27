import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import localCache from './../utils/cache'
import WelcomeMain from './../components/main/welcome/WelcomeMain.vue'
import UsersList from './../components/main/users/UsersList.vue'
import RightView from './../components/main/power/RightView.vue'
import RoleView from './../components/main/power/RoleView.vue'
import GoodCate from './../components/main/good/GoodCate.vue'
import GoodParam from './../components/main/good/GoodParam.vue'
import GoodList from './../components/main/good/GoodList.vue'
import OrderList from './../components/main/order/OrderList.vue'

const routes: Array<RouteRecordRaw> = [
  {path:'/', redirect:'/login'},
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: HomeView,
    children: [
      {path:'/welcome', component: WelcomeMain},
      {path:'/users', component: UsersList},
      {path:'/rights', component: RightView},
      {path:'/roles', component: RoleView},
      {path:'/categories', component: GoodCate},
      {path:'/params', component: GoodParam},
      {path:'/goods', component: GoodList},
      {path:'/orders', component: OrderList}
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
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
