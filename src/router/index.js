import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserCenter from "@/views/UserCenter.vue";
import Login from "../views/Login.vue"
import Detail from "../views/Detail.vue";


const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/cate',
        name: 'cate',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/CateView.vue')
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
            notShowNav: true,
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
            title: '购物车',
            notShowNav: true,
        }
    },
    {
        path: '/personalinfo',
        name: 'personalinfo',
        component: () => import('../views/PersonalInfo.vue'),
        meta: {
            title: '个人信息',
            notShowNav: true,
            notShowBar: true
        }
    },
    {
        path: '/changemsg',
        name: 'changemsg',
        component: () => import('../views/ChangeMsg.vue'),
        meta: {
            notShowNav: true,
            notShowBar: true
        }
    },
    {
        path: '/subOrder',
        name: 'subOrder',
        component: () => import('../views/SubmitOrderView.vue'),
        meta: {
            notShowNav: true,
            notShowBar: true
        }
    },
    {
        path: '/addressList',
        name: 'addressList',
        component: () => import('../views/AddressList.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/addAddress',
        name: 'addAddress',
        component: () => import('../views/AddAddress.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/orderDetail',
        name: 'orderDetail',
        component: () => import('../views/OrderDetail.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/ExamineUser',
        name: 'ExamineUser',
        component: () => import('../views/ExamineUser.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/ExaminePasswd',
        name: 'ExaminePasswd',
        component: () => import('../views/ExaminePasswd.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/ordersList',
        name: 'ordersList',
        component: () => import('../views/OrdersList.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/unPaidOrders',
        name: 'UnPaidOrders',
        component: () => import('../views/UnPaidOrders.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/unShippedOrders',
        name: 'UnShippedOrders',
        component: () => import('../views/UnShippedOrders.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/ShippedOrders',
        name: 'ShippedOrders',
        component: () => import('../views/ShippedOrders.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },
    {
        path: '/receivedOrders',
        name: 'ReceivedOrders',
        component: () => import('../views/ReceivedOrders.vue'),
        meta: {
            notShowBar: true,
            notShowNav: true
        }
    },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
