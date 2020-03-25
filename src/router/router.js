import Home from '../views/Home.vue'

const Main = () => import('../views/Main.vue')
const caseList = () => import('../views/caseList/caseList.vue')
const addCase = () => import('../views/addCase/addCase.vue')
const roleManage = () => import('../views/roleManage/roleManage.vue')
const Room = () => import('../views/room/room.vue')
const nopage = () => import('../views/noPage/noPage.vue')
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta:{
            access:['法官','当事人','代理人','书记员','开庭小助手'],
            title:'全在线庭审平台',
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
                access:['法官','当事人','代理人','书记员','开庭小助手'],
                component: caseList,
                meta:{
                    title: '案件列表',
                    imgSrc:require('../assets/img/left-icon1.png'),
                    access:['法官','当事人','代理人','书记员','开庭小助手'],
                }
            },
            {
                path: '/main/addCase',
                name: 'addCase',
                access:['法官','书记员'],
                component: addCase,
                meta:{
                    title: '案件编辑',
                    imgSrc:require('../assets/img/left-icon2.png'),
                    access:['法官','当事人','代理人','书记员','开庭小助手'],
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
                    access:['法官','书记员'],
                }
            },
        ]
    },
    {
        path: '/room',
        name: 'Room',
        component:Room,
        access:['法官','当事人','书记员','代理人','开庭小助手'],
        meta:{
            title:'庭审房间',
            access:['法官','当事人','书记员','代理人','开庭小助手'],
        }
    },
    {
        path: '/noPage',
        name: 'noPage',
        component:nopage,
        access:['法官','当事人','书记员','代理人','开庭小助手'],
        meta:{
            title:'一个没有页面的页面',
            access:['法官','当事人','书记员','代理人','开庭小助手'],
        }
    },
]

export default routes
  