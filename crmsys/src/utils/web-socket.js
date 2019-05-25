import {expireStore} from '@/utils/utils'
export var init = function (options) {
  let connected = false
  let _ws = null
  const start = () => {
    this._ws = new window.WebSocket(options.path)
    _ws = this._ws
    // 连接成功
    this._ws.onopen = (e) => {
      connected = true
      var homeUserName = document.getElementById('homeUserName')
      if (homeUserName) {
        homeUserName.style.color = 'white'
      }
      let _this = this
      setInterval(() => {
        _this.send({cmdName: '0001', sessionId: window.localStorage.getItem('sessionId'), signId: expireStore('signId') || '', success: true})
      }, 30000)
      options.success()
    }
    // 监听返回消息
    this._ws.onmessage = (msg) => {
      const message = JSON.parse(msg.data)
      if (message.signId && message.cmdName === '0003' && message.success) {
        expireStore('signId', message.signId)
        // 通知APP登录成功
        this.send({cmdName: '0003', sessionId: window.localStorage.getItem('sessionId'), signId: message.signId || '', success: true})
        window.localStorage.setItem('userName', message.userName)
        window.localStorage.setItem('userRole', message.userRole)
        window.localStorage.setItem('allOrgs', message.allOrgs)
        window.localStorage.setItem('userOrgId', message.userOrgId)
        options.router.push('/')
      } else if (message.cmdName === '0004') { // 拨打电话
        options.vue.prototype.$message({
          showClose: true,
          duration: 2000,
          message: message.message,
          type: 'success'
        })
      } else if (message.cmdName === '0005') { // 服务断开或数据格式错误
        options.vue.prototype.$message({
          showClose: true,
          duration: 3000,
          message: message.message,
          type: 'error'
        })
      } else if (message.cmdName === '0006') { // 发送个人消息
        if (message.applyId) {
          options.vue.prototype.$notify({
            title: '分单消息提醒',
            message: message.message + '点击查看详情',
            type: 'info',
            duration: 5000,
            onClick: () => {
              onclickDetail(message.applyId)
            }
          })
        } else {
          options.vue.prototype.$notify({
            title: '回收消息提醒',
            message: message.message,
            duration: 5000,
            type: 'info'
          })
        }
      }
    }
    // 断开
    this._ws.onclose = (e) => {
      connected = false
      options.success()
      var homeUsername = document.getElementById('homeUserName')
      if (homeUsername) {
        homeUsername.style.color = 'red'
      }
      if (expireStore('signId')) {
        start()
      }
    }
    // 连接失败
    this._ws.onerror = (e) => {
      options.success()
    }
  }

  // 发送消息
  this.send = (data) => {
    sendMsg(data)
  }
  function sendMsg (msg) {
    if (connected) {
      _ws.send(JSON.stringify(msg))
    }
  }
  function onclickDetail (obj) {
    if (window.location.pathname.indexOf('workDetail') > -1) {
      window.location.href = window.location.origin + window.location.pathname + '?applyId=' + obj
    } else {
      options.router.push({
        path: 'workDetail?applyId=' + obj
      })
    }
  }
  start()
  return this
}
