// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('es6-promise').polyfill()
import Vue from 'vue'
import App from './App'
import router from './router'

// 引用第三方库
import axios from 'axios'
import ElementUI from 'element-ui'

// 引入插件
import ajax from '@/utils/ajax'
import sessionStorage from '@/utils/session-storage'
import localStorage from '@/utils/local-storage'
import msg from '@/utils/msg'
import date from '@/utils/date'
import formStore from '@/utils/form-store'
import Extend from '@/utils/extend'
import TableList from '@/components/TableList'
// import WebSocketClient from '@/utils/web-socket.js'
const WebSocketClient = require('@/utils/web-socket.js')

// 引入样式
import 'element-ui/lib/theme-default/index.css'
import '@/assets/css/reset.less'
import '@/assets/css/style.less'
import '@/assets/css/store.less'

import formatNum from '@/filters/format-num'

// 使用插件
Vue.use(ajax, axios)
Vue.use(ElementUI)
Vue.use(sessionStorage)
Vue.use(localStorage)
Vue.use(msg)
Vue.use(date)
Vue.use(formStore)
Vue.use(Extend)

Vue.filter('formatNum', formatNum)

/** 列表 */
Vue.component(TableList.name, TableList)

// 全局使用echarts
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

let socketUrl = (process.env.NODE_ENV === 'production') ? 'wss://newapp.xxjr.com/pc' : 'ws://192.168.10.208:82/pc'
router.beforeEach((to, from, next) => {
  if (!Vue.prototype.$webSocket) {
    const webSocket = WebSocketClient.init({
      path: `${socketUrl}`,
      success () {
        next()
      },
      router,
      vue: Vue
    })
    Vue.prototype.$webSocket = webSocket
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
