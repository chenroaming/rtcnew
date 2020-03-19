import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import ViewUI from 'view-design';
import routes from '@/router/router.js'
import store from '@/store'
Vue.use(VueRouter)
// Vue.use(ViewUI)
// const About = () => import('../views/About.vue')
// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/about',
//     name: 'About',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//     component:About
//   }
// ]

const router = new VueRouter({
  // mode: 'history',//history模式需要后端支持，不然上线到服务器后会出现路由跳转报错问题
  base: process.env.BASE_URL,
  routes//将上述的路由列表引入
})

router.beforeEach((to,from,next) => {
  // next()
  store.dispatch('getUserInfo').then(res => {
    console.log(to.meta.access,res.roleName)
    if(to.name != 'Home' && res.state != 100){
      document.title = '全在线庭审平台'
      next({
        name:'Home'
      })
    }else if(to.name == 'Home' && res.state == 100){
      document.title = '案件列表'
      next({
        name:'caseList'
      })
    }else{
      document.title = to.meta.title
      next()
    }
  })
  // .catch(err => {
  //   console.log(err)
  //   // next({
  //   //   name:'Home'
  //   // })
  // })
})

router.afterEach(route => {
  // ViewUI.LoadingBar.finish();
})

export default router
