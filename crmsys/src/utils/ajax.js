import qs from 'qs'
import {expireStore} from '@/utils/utils'

// axios网络请求
function ajax (Vue, axios) {
  if (ajax.installed) return

  axios.defaults.timeout = 20000

  Vue.prototype.$baseURL = axios.defaults.baseURL = (process.env.NODE_ENV === 'production') ? '/' : 'http://120.78.68.90/'

  window.$axios = axios
  // 序列化对象
  Vue.prototype.$serialize = params => qs.stringify(params)
  Vue.prototype.$ajax = function (params) {
    let data = params['data'] || {}
    let signId = expireStore('signId')
    // 获取缓存中signId,如果存在并且noToken为false就传参
    if (signId && !params['noToken']) data['signId'] = signId
    // 判断是否有加载动画，如果有就显示
    if (params['loading']) this.loading = true
    // 整屏加载动画
    let loadInst = null
    if (params['data'] && !params['data'].hasOwnProperty('fullLoading')) {
      loadInst = this.$loading({ fullscreen: true, text: '拼命加载中' })
    }
    axios.post(params['url'], qs.stringify(data)).then(res => {
      // 整屏加载动画关闭
      if (params['data'] && !params['data'].hasOwnProperty('fullLoading')) loadInst.close()
      let signId = res.headers.signid
      if (signId === 'needLogin') this.$alt('需要登录', () => this.$router.replace('/login'))
      else if (signId === 'noRole') this.$alt('没有权限', () => this.$router.back())
      else if (signId === 'offline') this.$alt('已在其他地方登录', () => this.$router.replace('/login'))
      else {
        if (signId) expireStore('signId', signId)
        if (params['loading']) this.loading = false
        let data = res.data
        if (data.success) {
          // 成功回调
          if (params['success'] !== undefined) params.success(data)
        } else {
          if (!params['fail']) this.$message(data.message)
          else params.fail(data)
        }
      }
    }, err => {
      if (params['loading']) this.loading = false
      if (params['error'] !== undefined) params.error(err)
      loadInst.close()
    })
  }

  // 文件上传
  Vue.prototype.$upload = function (params) {
    let formData = new window.FormData()
    for (let key in params['data']) {
      formData.append(key, params['data'][key])
    }
    formData.append('signId', expireStore('signId'))
    axios.post(params['url'], formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    }).then(res => {
      let data = res.data
      if (data.state === 'SUCCESS') {
        if (params['success'] !== undefined) params.success(data)
      } else {
        if (!params['fail']) this.$msg(data.statusText)
      }
    })
  }

  // 客户资料上传
  Vue.prototype.$custupload = function (params) {
    let formData = new window.FormData()
    for (let key in params['data']) {
      formData.append(key, params['data'][key])
    }
    formData.append('signId', expireStore('signId'))
    axios.post(params['url'], formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    }).then(res => {
      let data = res.data
      if (data.success) {
        if (params['success'] !== undefined) params.success(data)
      } else {
        if (!params['fail']) this.$msg(data.message)
        else params.fail(data)
      }
    })
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ajax)
}

export default ajax
