import Home from '../views/Home.vue'

const Main = () => import('../views/Main.vue')
const caseList = () => import('../views/caseList/caseList.vue')
const addCase = () => import('../views/addCase/addCase.vue')
const roleManage = () => import('../views/roleManage/roleManage.vue')
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta:{
            title:'全在线庭审平台'
        }
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
                name: 'caseList',
                component: caseList,
                meta:{
                    title: '案件列表',
                }
            },
            {
                path: '/main/addCase',
                name: 'addCase',
                component: addCase,
                meta:{
                    title: '添加案件',
                }
            },
            {
                path: '/main/roleManage',
                name: 'roleManage',
                component: roleManage,
                meta:{
                    title: '角色管理',
                }
            },
        ]
    }
]

export default routes
  