import Vue from 'vue'
import VueRouter from 'vue-router'


const Home = () => import('views/home/Home.vue')
const Category = () => import('views/category/Category.vue')
const Cart = () => import('views/cart/Cart.vue')
const Profile = () => import('views/profile/Profile.vue')
const Detail = () => import('views/detail/Detail.vue')

//1.安装插件
Vue.use(VueRouter)

//2.创建router
const routes = [
    {
        path: '',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home,
        meta: { footShow: true }
    },
    {
        path: '/cart',
        component: Cart,
        meta: { footShow: true }
    },
    {
        path: '/category',
        component: Category,
        meta: { footShow: true }
    },
    {
        path: '/profile',
        component: Profile,
        meta: { footShow: true }
    },
    {
        path: '/detail:iid',
        component: Detail,

    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

//3.导出到main.js挂载
export default router