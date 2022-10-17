import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import admin from './modules/admin'
import user from './modules/user'
import goods from "./modules/goods";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    admin,
    user,
    goods
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
