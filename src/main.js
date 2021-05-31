import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import VueCookie from 'vue-cookie'
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios

Vue.use(VueCookie)

import ElementUI from 'element-ui'
Vue.use(ElementUI)

Vue.config.productionTip = false

import  qs from 'qs'
//配全局属性配置，在任意组件内可以使用this.$qs获取qs对象
Vue.prototype.$qs = qs

// 挂载全局
Vue.prototype.$axios = httpRequest // ajax请求方法

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
