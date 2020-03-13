import apiList from './apiList'

const install = (Vue) => {
  return Object.defineProperties(Vue.prototype, {
    $api: {
      get() {
        return apiList
      }
    }
  })
}

export default {
  install
}
