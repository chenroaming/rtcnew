import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import routes from '@/router/router.js'
import store from '@/store'
Vue.use(VueRouter)

const router = new VueRouter({
  // mode: 'history',//history模式需要后端支持，不然上线到服务器后会出现路由跳转报错问题
  base: process.env.BASE_URL,
  routes//将上述的路由列表引入
})

router.beforeEach((to,from,next) => {
  store.dispatch('getUserInfo').then(res => {
    if(!to.name){//当访问不存在的页面时跳转至不存在的页面
      next({name:'noPage'})
      return;
    }
    if(
      !to.meta.access.some(unit => {//进入不属于自己权限查看的页面时直接跳转回首页
        return unit == res.roleName
      }) && res.state == 100
    ){
      next({name:'Home'})
      return;
    }
    if(to.name != 'Home' && res.state != 100){//未登录状态跳转至登录页
      document.title = '全在线庭审平台'
      next({name:'Home'})
    }else if(to.name == 'Home' && res.state == 100){//已登录状态刷新跳转至案件列表页
      document.title = '案件列表'
      next({name:'caseList'})
    }else{
      document.title = to.meta.title
      next()
    }
  })
})

router.afterEach(route => {

})

export default router