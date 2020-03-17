import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/modules/app'
import user from '@/store/modules/user'
import caseInfo from '@/store/modules/caseInfo'
import getters from '@/store/getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    caseInfo
  },
  getters
})
