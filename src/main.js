import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/icons'
import '@/assets/scss/index.scss'

import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils/auth'
import Moment from 'moment'

import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
  easing: 'ease',  // 动画方式
  speed: 600,  // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})


import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import ElementUI from 'element-ui'
Vue.use(ElementUI,{size: 'small', locale })

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.axios = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth //认证方法

//全局echarts
import echarts from "echarts";
Vue.prototype.echarts = echarts;

// 定义全局时间戳过滤器
Vue.filter('formatDate', function(value) {
  if (value != null) {
    return Moment(value).format('YYYY-MM-DD')
  }
})
Vue.filter('formatDateTime', function(value) {
  if (value != null) {
    return Moment(value).format('YYYY-MM-DD HH:mm:ss')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
