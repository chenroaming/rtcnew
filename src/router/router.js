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
                access:['法官','当事人','书记员','开庭小助手'],
                component: caseList,
                meta:{
                    title: '案件列表',
                    imgSrc:require('../assets/img/left-icon1.png'),
                }
            },
            {
                path: '/main/addCase',
                name: 'addCase',
                access:['法官','书记员'],
                component: addCase,
                meta:{
                    title: '添加案件',
                    imgSrc:require('../assets/img/left-icon2.png'),
                }
            },
            {
                path: '/main/roleManage',
                name: 'roleManage',
                access:['法官','书记员'],
                component: roleManage,
                meta:{
                    title: '角色管理',
                    imgSrc:require('../assets/img/left-icon3.png'),
                }
            },
        ]
    }
]

export default routes
  