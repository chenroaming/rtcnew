import Home from '../views/Home.vue'

const Main = () => import('../views/Main.vue')
const caseList = () => import('../views/caseList/caseList.vue')
const addCase = () => import('../views/addCase/addCase.vue')
const roleManage = () => import('../views/roleManage/roleManage.vue')
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/main',
        name: 'Main',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
        component:Main,
        children:[
            {
                path: '/main/caseList',
                title: '首页',
                name: 'caseList',
                component: caseList
            },
            {
                path: '/main/addCase',
                title: '首页',
                name: 'addCase',
                component: addCase
            },
            {
                path: '/main/roleManage',
                title: '首页',
                name: 'roleManage',
                component: roleManage
            },
        ]
    }
]

export default routes
  