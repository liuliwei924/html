export default (Vue) => {
  Vue.prototype.$extend = function () {
    let i = 0
    let len = arguments.length
    let result = {}
    for (; i < len; i++) {
      let attributes = arguments[ i ]
      for (let key in attributes) {
        result[key] = attributes[key]
      }
    }
    return result
  }
}
