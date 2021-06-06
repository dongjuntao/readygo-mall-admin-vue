import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils/auth'
import Moment from 'moment'

import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

import ElementUI from 'element-ui'
Vue.use(ElementUI)

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.axios = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth //认证方法

// 定义全局时间戳过滤器
Vue.filter('formatDate', function(value) {
  return Moment(value).format('YYYY-MM-DD')
})
Vue.filter('formatDateTime', function(value) {
  return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
