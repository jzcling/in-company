import Vue from 'vue'
import VueRouter from 'vue-router'
// import Dashboard from '../views/Dashboard.vue'
import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Dashboard',
  //   component: Dashboard,
  //   beforeEnter: authGuard
  // },
    {
        path: '/',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
        beforeEnter: authGuard
    },
    {
        path: '/joblistings',
        name: 'Job Posts',
        component: () => import(/* webpackChunkName: "joblistings" */ '../views/Joblistings.vue'),
        beforeEnter: authGuard
    },
    {
        path: '/joblistings/:id',
        name: 'Job Post Show',
        component: () => import(/* webpackChunkName: "joblistingshow" */ '../views/JoblistingShow.vue'),
        beforeEnter: authGuard
    },
    
    {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: () => import(/* webpackChunkName: "unauthorized" */ '../views/Unauthorized.vue')
    },
    {
        path: '*',
        name: 'Not Found',
        component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
