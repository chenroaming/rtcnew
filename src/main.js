import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import './registerServiceWorker'
import router from './router'//引用router文件
import store from './store'//引用vuex文件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from './api/apiList'//引入api列表文件
Vue.prototype.$api = api//修改原型链方法全局引入$api
Vue.use(ElementUI)
Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
