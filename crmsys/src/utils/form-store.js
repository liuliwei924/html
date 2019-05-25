// 表单搜索记录
function formStore (Vue, axios) {
  if (formStore.installed) return

  Vue.prototype.$getStore = function (key, fields) {
    return JSON.parse(this.$localStorage(key)) || {}
  }

  Vue.prototype.$setStore = function (key, form, filter = []) {
    form = Object.assign({}, form)
    // filter = filter.concat(['currentPage', 'signId'])
    filter = filter.concat(['signId'])
    filter.map(item => {
      delete form[item]
    })
    this.$localStorage(key, JSON.stringify(form))
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(formStore)
}

export default formStore
