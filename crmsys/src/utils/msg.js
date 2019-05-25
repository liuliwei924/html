function msg (Vue) {
  Vue.prototype.$msg = function (msg, type) {
    // 消息类型: success/info/warning/error
    if (!type) type = 'warning'
    this.$alert(msg, '提示', {
      showConfirmButton: false,
      customClass: 'msg-delete__dialog',
      type: type,
      callback: () => {}
    })
  }

  Vue.prototype.$alt = function (msg, callback) {
    if (!this.$alertInstance) {
      this.$alertInstance = this.$alert(msg, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$alertInstance = null
          callback()
        }
      })
    }
  }
}

export default msg
