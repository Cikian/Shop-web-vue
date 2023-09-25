import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserCenter from "@/views/UserCenter.vue";
import Login from "../views/Login.vue"
import ForgetPW from "@/views/ForgetPW.vue";
import Detail from "../views/Detail.vue";
import Cart from "@/views/Cart.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    {
        path: '/my',
        name: 'my',
        component: UserCenter,
        meta: {
            title: '我的',
            requireAuth: true,
            notShowNav: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '登录',
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/detail',
        name: 'detail',
        component: Detail,
        meta: {
            title: '详细界面',
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/losepw',
        name: 'losepw',
        component: () => import('../views/ForgetPW.vue'),
        meta: {
            title: '找回密码',
            notShowBar: true
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue'),
        meta: {
            title: '用户注册',
            notShowNav: true
        }
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('../views/Cart.vue'),
        meta: {
            title: '购物车'
        }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
