<template>
  <div class="wrap-box" :class="isWrap ? (isCollapse ? 'wrap__fold' : 'wrap__spread') : (isCollapse ? 'wrap__close' : '')">
    <!-- 头部区域 -->
    <div class="header-box clearfix">
      <router-link to="/" class="logo-icon fl"></router-link>
      <roll-notice :notices="notices"></roll-notice>
      <div class="admin-user fr">
        <el-tooltip class="admin-user-name fl" effect="light" :content="allotDesc" placement="bottom" v-if="allotDesc">
          <span>暂停分单</span>
        </el-tooltip>
        <el-button icon="information" class="admin-user-notify fl" @click="notifyHandle">{{notifyNum}}</el-button>
        <div class="admin-user-name fl">当前账号：<span id="homeUserName">{{userName}}</span></div>
        <div class="admin-user-logout fl v-dropdown-menu">
          <el-dropdown  @command="handleCommand">
            <span class="el-dropdown-link">
              <span class="v-icon" :class="'i' + curIcon"></span>{{currStatus}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class=" v-dropdown-menu">
              <el-dropdown-item :command="item.status" v-for="(item, index) in userStatus" :key="index"><span class="v-icon" :class="'i' + item.status"></span>{{item.type}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <div class="admin-user-logout fl"><a @click="logoutHandle">退出</a></div> -->
      </div>
    </div>
    <!-- 一级菜单 -->
    <div class="menu-box clearfix">
      <div class="main-menu fl">
        <el-button class="menu-trigger__btn" @click.stop="toggleMenu"></el-button>
        <div class="el-menu">
          <el-tooltip v-for="item in menus"
            placement="right"
            :key="item.menuId"
            :content="item.menuName"
            :disabled="!isCollapse"
            :open-delay="100">
            <div class="el-menu-item" :class="{'is-active': path === item.menuCode}" @click="menuHandle(item)">
              <i :class="`menu-icon menu-${item.menuCode}__icon`"></i>
              <span v-if="!isCollapse">{{item.menuName}}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
      <!-- 二级菜单 -->
      <div class="sub-menu fl" v-if="subMenus.length">
        <template v-for="(item, index) in subMenus">
          <div class="menu-title" :key="index" @click="slideMenu('menuSection'+index)">{{item.menuName}}</div>
          <section :ref="'menuSection'+index" style="display: block">
            <div
              class="menu-name" v-for="subItem in item['subMenus']"
              :class="{'is-active': subPath === subItem.menuCode}"
              :key="subItem.menuId"
               @click="routeHandle(subItem['menuCode'])">
              {{subItem.menuName}}
              <span id="waitDeal" v-if="subItem['menuCode'] === 'waitDeal'" style="color:red">({{waitDealCount}})</span>
              <span id="againAllot" v-if="subItem['menuCode'] === 'againAllot'" style="color:red">({{againAllotCount}})</span>
              <span id="waitRecognized" v-if="subItem['menuCode'] === 'waitRecognized'" style="color:red">({{waitRecognCount}})</span>
            </div>
          </section>
        </template>
      </div>
    </div>
    <!-- tabs路由标签页 -->
    <div class="tabs-content" v-show="subMenus.length && tabObject.length">
      <el-tabs closable
        v-model="selectTab"
        type="card"
        @tab-remove="removeTab"
        @tab-click="routeHandle(selectTab, 'prevent')">
        <el-tab-pane
          v-for="subItem in tabObject"
          :key="subItem.menuId"
          :label="subItem.menuName"
          :name="subItem.menuCode"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 主体内容-路由容器 -->
    <router-view
      :class="{'active-main': subMenus.length && tabObject.length}"
      @addTab="addTab"></router-view>
    <notify v-model="isShow" />
    <!-- 5分钟无操作 弹窗 -->
    <div class="five-min-window" v-if="showFivemin">
      <div class="five-min-content" v-if="showBusy">
        <div class="timer">{{tenMin}}分{{tenSecond}}秒</div>
        <el-button type="primary" @click="continueLine">进入系统</el-button>
        <el-button type="warning" @click="continueBusy">继续忙碌</el-button>
      </div>
      <div class="five-min-content" v-else>
        <div class="timer">{{thirty}}S</div>
        <el-button type="danger" @click="loginOut">退出</el-button>
        <el-button type="primary" @click="continueLine">继续在线</el-button>
        <el-button type="warning" @click="switchBusy">忙碌中</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {Loading, MessageBox} from 'element-ui'
import {expireStore} from '@/utils/utils'
import Notify from '@/components/all/Notify'
import RollNotice from '@/components/all/RollNotice'
let times = []
let h = null
var fiveMin = 0
var thirtyTimer = null
var tenTimer = null
// 根路由
export default {
  name: 'home',
  data () {
    // 首字符小写
    // let menuActive = this.$route.name.replace(/^\w{1}/, L => L.toLowerCase())
    let menus = JSON.parse(window.localStorage.getItem('menus')) || []
    let userName = this.$localStorage('userName') || ''
    let path = this.$localStorage('path') || 'main'
    let subPath = this.$localStorage('subPath')
    let subMenus = JSON.parse(this.$localStorage('subMenus')) || []
    return {
      waitDealSend: 0,
      againAllotSend: 0,
      waitRecognSend: 0,
      waitDealCount: 0,
      againAllotCount: 0,
      waitRecognCount: 0,
      userName,
      allotDesc: '',
      notifyNum: 0,
      isShow: false,
      isWrap: !!subMenus.length,
      isCollapse: !!subPath,
      path,
      subPath,
      // menuActive,
      menus,
      subMenus,
      notices: [],
      userStatus: [{type: '在线', status: 1}, {type: '忙碌', status: 2}, {type: '离开', status: 3}, {type: '离线', status: 0}],
      currStatus: '在线',
      curIcon: '1',
      showFivemin: false,
      showBusy: false,
      thirty: 30,
      tenMin: 9,
      tenSecond: 59,
      selectTab: '',
      tabObject: [],
      tabIndex: 0,
      queryPath: {}
    }
  },
  mounted () {
    this.fiveMinCount()
    var body = document.querySelector('html')
    body.addEventListener('click', function () {
      fiveMin = 0
    })
    this.tabObject = JSON.parse(this.$localStorage('tabObject')) || []
    this.queryPath = JSON.parse(this.$localStorage('queryPath')) || {}
    this.selectTab = window.localStorage.subPath || ''
  },
  beforeRouteEnter (to, from, next) {
    let sign = to.query.signId // 微信登录跳转携带signId授权标识
    let signId = expireStore('signId') // 请求头缓存的signId授权标识
    // 如果地址栏含有signId参数,判断为微信登陆
    // 否则为手机登录
    if (sign) {
      // 微信登陆
      if (!signId) {
        expireStore('signId', sign)
        // 全屏加载动画
        let loading = Loading.service({fullscreen: true})
        window.$axios.post('/store/user/wxLogin', `signId=${sign}`).then(res => {
          // 如果微信登陆失败,则弹出相关错误提示框
          if (!res.data.success) {
            loading.close()
            MessageBox.alert(res.data.message, '错误提示', {
              type: 'error',
              customClass: 'msg-delete__dialog',
              showCancelButton: true,
              callback: action => {
                next('login')
              }
            })
          } else {
            let row = res.data.rows[0] || {}
            // 存储用户名和用户角色和门店ID
            window.localStorage.setItem('userName', row.userName)
            window.localStorage.setItem('userRole', row.userRole)
            window.localStorage.setItem('allOrgs', row.allOrgs)
            window.localStorage.setItem('userOrgId', row.userOrgId)
            // 获取用户菜单
            window.$axios.post('/store/account/user/info/queryMenus', `signId=${sign}`).then(res => {
              let attr = res.data.attr
              let menus = attr['menus'] || [] // 用户菜单
              let cityList = attr['cityList'] || [] // 城市列表
              let orgList = attr['orgList'] || [] // 门店列表
              let userOrgs = attr['userOrgs'] || [] // 用户门店列表
              let checkMenus = attr['checkMenus'] || [] // 用户审核权限
              window.localStorage.setItem('menus', JSON.stringify(menus))
              window.localStorage.setItem('cityList', JSON.stringify(cityList))
              window.localStorage.setItem('orgList', JSON.stringify(orgList))
              window.localStorage.setItem('userOrgs', JSON.stringify(userOrgs))
              window.localStorage.setItem('checkMenus', JSON.stringify(checkMenus))
              next(vm => {
                loading.close()
                // 重新刷新页面,更新路由
                vm.$router.go()
              })
            }).catch(() => {
              loading.close()
              next()
            })
          }
        }).catch(() => {
          loading.close()
          next()
        })
      } else {
        next()
      }
    } else {
      // 其他登陆
      let menus = window.localStorage.getItem('menus')
      // 如果没有signId则跳入登录页
      // 如果没有菜单则获取菜单权限信息
      if (!signId) {
        next('login')
      } else if (!menus) {
        // 全屏加载动画
        let loading = Loading.service({fullscreen: true})
        // 获取用户菜单
        window.$axios.post('/store/account/user/info/queryMenus', `signId=${signId}`).then(res => {
          let attr = res.data.attr
          let menus = attr['menus'] || [] // 用户菜单
          let cityList = attr['cityList'] || [] // 城市列表
          let orgList = attr['orgList'] || [] // 门店列表
          let userOrgs = attr['userOrgs'] || [] // 用户门店列表
          let checkMenus = attr['checkMenus'] || [] // 用户审核权限
          window.localStorage.setItem('menus', JSON.stringify(menus))
          window.localStorage.setItem('cityList', JSON.stringify(cityList))
          window.localStorage.setItem('orgList', JSON.stringify(orgList))
          window.localStorage.setItem('userOrgs', JSON.stringify(userOrgs))
          window.localStorage.setItem('checkMenus', JSON.stringify(checkMenus))
          next(vm => {
            loading.close()
            // 重新刷新页面,更新路由
            vm.$router.go()
          })
        }).catch(() => {
          loading.close()
          next()
        })
      } else {
        next()
      }
    }
    // 多请求合并
    // const request = url => window.$axios.post(url, `signId=${expireStore('signId')}`)
    // window.$axios.all([request('/store/account/user/comm/allAreaInfo')]).then(window.$axios.spread((allAreaInfo) => {
    // })).catch(() => next())
  },
  created () {
    this.getWaitDealAndAgainAllot()
    if (this.waitDealSend === 1) {
      this.getNewApplycount()
      this.$ajax({
        url: '/store/account/work/waitDeal/queryNewApplayCount',
        success: (res) => {
          this.waitDealCount = res.attr.totalSize
        }
      })
    }
    if (this.againAllotSend === 1) {
      this.getAgainAllotcount()
      this.$ajax({
        url: '/store/account/work/againAllot/queryAgainAllotCount',
        success: (res) => {
          this.againAllotCount = res.attr.totalSize
        }
      })
    }
    if (this.waitRecognSend === 1) {
      this.getWaitRecogncount()
      this.$ajax({
        url: '/store/account/work/waitRecognized/queryWaitRecognCount',
        success: (res) => {
          this.waitRecognCount = res.attr.totalSize
        }
      })
    }
    this.timeNotify()
    h = this.$createElement
    this.$ajax({
      url: '/store/account/user/notify/queryCloseAllotDesc',
      success: data => {
        if (data.rows[0]) this.allotDesc = data.rows[0].allotDesc || ''
      }
    })
    this.$ajax({
      url: '/store/account/user/info/queryScrollSysNotify',
      success: data => {
        let arr = data.rows
        for (let i = 0; i < arr.length; i++) {
          this.notices.push(arr[i].notifyText)
        }
      }
    })
  },
  methods: {
    slideMenu (ref) {
      let disType = this.$refs[ref][0].style.display
      this.$refs[ref][0].style.display = disType === 'block' ? 'none' : 'block'
    },
    // 继续忙碌状态，倒计时10分钟重新开始
    continueBusy () {
      this.tenMin = 9
      this.tenSecond = 59
    },
    // 切换为忙碌中
    switchBusy () {
      this.showBusy = true
      this.handleCommand(2)
      this.tenMinCount()
    },
    loginOut () {
      this.showFivemin = false
      this.$ajax({
        url: '/store/user/statusChange',
        data: {userStatus: 0},
        success: () => {
          this.$router.replace('/login')
        }
      })
    },
    noOpsLoginOut () {
      this.showFivemin = false
      this.$ajax({
        url: '/store/user/statusChange',
        data: {userStatus: 4},
        success: () => {
          this.$router.replace('/login')
        }
      })
    },
    // 10分钟倒计时
    tenMinCount () {
      let _this = this
      tenTimer = setInterval(() => {
        _this.tenSecond--
        if (_this.tenSecond < 0) {
          _this.tenSecond = 59
          if (_this.tenMin > 0) {
            _this.tenMin--
          } else {
            _this.noOpsLoginOut()
            clearInterval(tenTimer)
          }
        }
      }, 1000)
    },
    // 5分倒计时
    fiveMinCount () {
      let _this = this
      let fiveMinTimer = setInterval(() => {
        fiveMin++
        if (fiveMin >= 10) {
          _this.showFivemin = true
          _this.thirty = 30
          _this.thirtyCount()
          clearInterval(fiveMinTimer)
        }
      }, 60000)
    },
    // 30s倒计时
    thirtyCount () {
      let _this = this
      thirtyTimer = setInterval(() => {
        _this.thirty--
        if (_this.showBusy || !_this.showFivemin) {
          _this.thirty = 30
          clearInterval(thirtyTimer)
        }
        if (_this.thirty < 1) {
          _this.showFivemin = false
          clearInterval(thirtyTimer)
          _this.noOpsLoginOut()
        }
      }, 1000)
    },
    // 继续在线
    continueLine () {
      fiveMin = 0
      this.showFivemin = false
      this.showBusy = false
      this.tenMin = 9
      this.tenSecond = 59
      clearInterval(tenTimer)
      clearInterval(thirtyTimer)
      this.fiveMinCount()
    },
    handleCommand (command) {
      if (Number(command) === 0) {
        this.logoutHandle(command)
      } else {
        this.$ajax({
          url: '/store/user/statusChange',
          data: {userStatus: command},
          success: (res) => {
            for (let i = 0; i < this.userStatus.length; i++) {
              if (Number(command) === this.userStatus[i]['status']) {
                this.currStatus = this.userStatus[i]['type']
                this.curIcon = this.userStatus[i]['status']
              }
            }
          }
        })
      }
    },
    // 判断新申请、再分配是否存在
    getWaitDealAndAgainAllot () {
      let menuCode = 'work'
      let menuCodeA = 'waitDeal'
      let menuCodeB = 'againAllot'
      let menuCodeC = 'waitRecognized'
      let menus = JSON.parse(this.$localStorage('menus'))
      if (menus === null) {
        return
      }
      for (let i = 0; i < menus.length; i++) {
        if (menuCode === menus[i].menuCode) {
          let sub = menus[i].subMenus
          for (let j = 0; j < sub.length; j++) {
            let subM = sub[j].subMenus
            for (let k = 0; k < subM.length; k++) {
              if (menuCodeA === subM[k].menuCode) {
                this.waitDealSend = 1
              }
              if (menuCodeB === subM[k].menuCode) {
                this.againAllotSend = 1
              }
              if (menuCodeC === subM[k].menuCode) {
                this.waitRecognSend = 1
              }
            }
          }
        }
      }
    },
    // 定时获取新申请数据条数
    getNewApplycount () {
      setInterval(() => {
        this.$ajax({
          data: {fullLoading: true},
          url: '/store/account/work/waitDeal/queryNewApplayCount',
          success: (res) => {
            this.waitDealCount = res.attr.totalSize
          }
        })
      }, 300000)
    },
    // 定时获取再分配的数据条数
    getAgainAllotcount () {
      setInterval(() => {
        this.$ajax({
          data: {fullLoading: true},
          url: '/store/account/work/againAllot/queryAgainAllotCount',
          success: (res) => {
            this.againAllotCount = res.attr.totalSize
          }
        })
      }, 300000)
    },
    // 定时获取未了解的数据条数
    getWaitRecogncount () {
      setInterval(() => {
        this.$ajax({
          data: {fullLoading: true},
          url: '/store/account/work/waitRecognized/queryWaitRecognCount',
          success: (res) => {
            this.waitRecognCount = res.attr.totalSize
          }
        })
      }, 300000)
    },
    // 退出登录
    logoutHandle (command) {
      this.$alert('您是否确定退出登录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/user/statusChange',
              data: {userStatus: command},
              success: () => {
                this.$router.replace('/login')
              }
            })
          }
        }
      })
    },
    // 折叠菜单
    toggleMenu () {
      this.isWrap = this.subMenus.length
      this.isCollapse = !this.isCollapse
    },
    // 点击一级菜单
    menuHandle (item) {
      this.path = item.menuCode
      this.subMenus = item.subMenus || []
      this.isWrap = this.isCollapse = !!item.subMenus
      this.$localStorage('path', item.menuCode)
      this.$localStorage('subMenus', JSON.stringify(item.subMenus || []))
      if (!item.subMenus) {
        this.$router.push(item.menuCode)
      }
    },
    // 点击二级菜单
    routeHandle (path, prevent) {
      this.subPath = path
      this.$localStorage('subPath', path)
      this.selectTab = path
      this.queryPath.length ? this.addTab(this.selectTab, this.queryPath) : this.addTab(this.selectTab)
      if ((!isNaN(path) || path === 'applyInfo') && prevent) {
        this.tabObject.forEach((v, i) => {
          if (v.menuName.match('录单')) {
            this.$router.push('applyInfo')
            return
          }
        })
        path = path === 'applyInfo' ? 'applyInfo' : 'workDetail'
        this.$router.push(this.queryPath[path])
      } else {
        if (path === 'applyInfo' && !prevent) {
          this.queryPath.applyInfo = {}
          this.$localStorage('queryPath', JSON.stringify(this.queryPath))
          this.tabObject.forEach((v, i) => {
            if (v.menuName.match('录单')) {
              v.menuName = '录单'
            }
          })
          this.$localStorage('tabObject', JSON.stringify(this.tabObject))
        }
        this.$router.push(path)
      }
    },
    // 通知
    timeNotify () {
      this.notify()
      setTimeout(() => {
        times.forEach(timer => {
          clearTimeout(timer)
        })
        this.timeNotify()
      }, 1.8e6)
    },
    notify () {
      this.$ajax({
        url: '/store/account/user/notify/queryNotifyAllList',
        success: data => {
          let rows = data.rows || []
          let now = Date.now() + 1.8e6
          let notifys = []
          rows.forEach(item => {
            let time = new Date(item.notifyTime).getTime()
            if (time <= now) {
              notifys.push(item)
            } else {
              this.showNotify(item, time - now)
            }
          })
          if (notifys.length) this.batchNotify(notifys)
        }
      })
    },
    showNotify (item, time) {
      let timer = setTimeout(() => {
        let notifyInstance = this.$notify({
          title: '通知',
          message: h('div', {class: 'notify-layer'}, [h('p', {class: 'notify-item clearfix'}, [
            h('span', {class: 'notify-text fl'}, `${item.siNotifyTime} ${item.applyName} ${item.typeText}通知!`),
            h('button', {
              class: 'notify-btn fr',
              on: {
                click: () => {
                  this.readHandle(item['notifyId'], notifyInstance)
                }
              }
            }, '我知道了')
          ])]),
          customClass: 'notify-layer-box',
          duration: 1e4
        })
      }, time)
      times.push(timer)
    },
    batchNotify (notifys) {
      let [len, notifyInstance] = [notifys.length, null]
      let vnode = h('div', {class: 'notify-layer'}, notifys.map(item => h('p', {class: 'notify-item clearfix'}, [
        h('span', {class: 'notify-text fl'}, `${item.siNotifyTime} ${item.applyName} ${item.typeText}通知!`),
        h('button', {
          class: 'notify-btn fr',
          on: {
            click: ($event) => {
              let node = $event.target.parentNode
              node.parentNode.removeChild(node)
              if (--len) this.readHandle(item['notifyId'])
              else this.readHandle(item['notifyId'], notifyInstance)
            }
          }
        }, '我知道了')
      ])))
      notifyInstance = this.$notify({
        title: '通知',
        message: vnode,
        customClass: 'notify-layer-box',
        duration: 1e4
      })
    },
    readHandle (notifyIds, instance) {
      this.$ajax({
        url: '/store/account/user/notify/dealNotify',
        data: {
          notifyIds
        },
        success: data => {
          if (instance) instance.close()
        }
      })
    },
    // 通知处理
    notifyHandle () {
      this.isShow = true
    },
    // 添加标签  applyInfo-录单
    addTab (targetName, queryObj) {
      this.selectTab = targetName
      if (queryObj) {
        let str, name, path
        if (queryObj.path === 'applyInfo') {
          str = '录单'
          path = queryObj.path
          name = queryObj.query.applyName
          this.queryPath.applyInfo = Object.assign({}, queryObj)
        } else {
          str = '详情'
          path = queryObj.query.applyId + ''
          name = targetName
          this.queryPath.workDetail = Object.assign({}, queryObj)
        }
        this.tabObject.forEach((v, i) => {
          if (v.menuName.match(str)) {
            this.tabObject.splice(i, 1)
          }
        })
        this.tabObject.push({menuCode: path, menuName: `${str}-${name}`})
        this.selectTab = path
        this.$localStorage('tabObject', JSON.stringify(this.tabObject))
        this.$localStorage('queryPath', JSON.stringify(this.queryPath))
      }
      let hasTab = this.tabObject.every((v, i) => {
        return v.menuCode !== targetName
      })
      if (!hasTab) return
      let arr = Array.from(JSON.parse(JSON.stringify(this.subMenus))) || []
      arr.forEach((v, i) => {
        let newArr = v.subMenus.filter(function (obj) {
          return obj.menuCode === targetName
        })
        if (newArr.length) {
          this.tabObject.push(...newArr)
        }
      })
      if (this.tabObject.length > 8) {
        this.tabObject.splice(0, 1)
      }
      this.$localStorage('tabObject', JSON.stringify(this.tabObject))
    },
    // 移除标签
    removeTab (targetName) {
      let tabs = this.tabObject
      let activeName = this.selectTab
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.menuCode === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.menuCode
            }
          }
        })
      }
      this.selectTab = activeName
      this.subPath = activeName
      if ((!isNaN(activeName) || activeName === 'applyInfo')) {
        activeName = activeName === 'applyInfo' ? 'applyInfo' : 'workDetail'
        this.$router.push(this.queryPath[activeName])
      } else {
        this.$router.push(activeName)
      }
      this.tabObject = tabs.filter(tab => tab.menuCode !== targetName)
      this.$localStorage('subPath', activeName)
      this.$localStorage('tabObject', JSON.stringify(this.tabObject))
    }
  },
  components: {
    Notify,
    RollNotice
  }
}
</script>
