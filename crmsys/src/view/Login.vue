<template>
  <div class="login-box">
    <!-- 登录背景+粒子动画 -->
    <div class="login-bg" ref="particle">
      <div class="login-bg__img"></div>
    </div>
    <!-- 登录框 -->
    <div class="login-block">
      <div class="login-logo"></div>
      <div class="login-wrapper">
        <div class="login-content">
          <div class="login-content__header clearfix">
            <!-- <div class="login-content__tab fl" :class="{active: tab === 2}" @click.stop="switchTab(2)">扫码登录</div>
            <div class="login-content__tab fl" :class="{active: tab === 1}" @click.stop="switchTab(1)">微信登录</div>  -->
            <div class="login-content__tab fl" :class="{active: tab === 3}" @click.stop="switchTab(3)">手机登录</div>
          </div>
          <div class="login-content__body">
            <!-- 微信扫码登录 -->
            <div id="wxLogin" class="login-content__wx" v-show="tab === 1"></div>
            <!-- 手机登录 -->
            <el-form :model="codeForm" ref="codeForm" class="login-content__panel" v-show="tab == 2">
              <div class="app-scan">
                <img :src="appQrcode" alt="">
              </div>
              <div class="two-app-btn">
                <el-button class="download-btn" @click.prevent="download">下载小小云APP</el-button>
                <el-button class="download-btn" @click.prevent="downloadACR">下载ACR</el-button>
              </div>
            </el-form>
            <!-- 手机登录 -->
            <el-form :model="codeForm" ref="codeForm" class="login-content__panel" v-show="tab == 3">
              <div class="login-content__group">
                <i class="login-icon__user fl"></i>
                <el-form-item class="fl" prop="telephone" :rules="{validator: checkPhone, trigger: 'blur'}">
                  <el-input v-model="codeForm.telephone" :maxlength="11" placeholder="请输入您的手机号码"></el-input>
                </el-form-item>
              </div>
              <div class="login-content__group">
                <i class="login-icon__code fl"></i>
                <el-form-item class="fl" prop="password" :rules="{required: true, message: '请输入您的密码', trigger: 'blur'}">
                  <el-input v-model="codeForm.password" placeholder="请输入您的密码"></el-input>
                </el-form-item>
                <!-- <span class="login-text__code" @click="getCode">{{codeText}}</span> -->
              </div>
              <el-button native-type="submit" class="login-btn" @click.prevent="codeLogin">登&nbsp;录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="mask-box" @click="markClose" v-if="markShow">
      <div class="mark-img">
        <div class="mark-title">请使用手机浏览器扫一扫下载</div>
        <img :src="markImg" @click.stop="">
      </div>
    </div>
    <div class="mask-box" @click="markACRClose" v-if="markACRShow">
      <div class="mark-img">
        <div class="mark-title">请使用手机浏览器扫一扫下载</div>
        <img :src="markACRImg" @click.stop="">
      </div>
    </div>
  </div>
</template>

<script>
import canvasParticle from '@/utils/particle'
// 登录页
export default {
  name: 'login',
  data () {
    let dev = (process.env.NODE_ENV === 'production')
    return {
      appQrcode: '',
      tab: 3,
      codeForm: {
        telephone: '',
        password: ''
      },
      // 校验手机格式
      checkPhone (rule, value, callback) {
        /^1[34578]\d{9}$/.test(value) ? callback() : callback(new Error('手机号码格式不正确'))
      },
      dev,
      calcTime: 60,
      codeText: '获取验证码',
      timer: null,
      markImg: 'https://kefu.xxjr.com/store/sysAction/downloadXxyunApp',
      markShow: false,
      markACRImg: 'https://kefu.xxjr.com/store/sysAction/downloadACRApp',
      markACRShow: false
    }
  },
  watch: {
    // 倒计时
    calcTime (val) {
      this.codeText = val === 60 ? '获取验证码' : `${val}s`
    }
  },
  beforeCreate () {
    // 清理缓存
    this.$rmLocalStorage('signId') // 授权id
    this.$rmLocalStorage('menus') // 菜单
    this.$rmLocalStorage('userName') // 用户名
    this.$rmLocalStorage('userRole') // 用户角色
    this.$rmLocalStorage('cityList') // 城市列表
    this.$rmLocalStorage('orgList') // 门店列表
    this.$rmLocalStorage('userOrgs') // 用户门店列表
    this.$rmLocalStorage('allOrgs') // 用户门店列表
    this.$rmLocalStorage('path')
    this.$rmLocalStorage('subPath')
    this.$rmLocalStorage('subMenus')
    this.$rmLocalStorage('checkMenus')
    this.$rmLocalStorage('userOrgId') // 用户门店ID
    this.$rmLocalStorage('tabObject') // 标签页
    this.$rmLocalStorage('queryPath') // 请求参数
    let cacheAllOrder = ['allOrder']
    cacheAllOrder.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheAllotOrder = ['allotOrder']
    cacheAllotOrder.forEach(allotOrder => {
      this.$rmLocalStorage(allotOrder)
    })
    let cacheCustVisit = ['custVisit']
    cacheCustVisit.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheExcOrder = ['excOrder']
    cacheExcOrder.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheProcessing = ['waitSignOrder']
    cacheProcessing.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheReserving = ['reserving']
    cacheReserving.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheSigning = ['signing']
    cacheSigning.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheWaitDeals = ['waitDeals']
    cacheWaitDeals.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheAgainAllot = ['againAllot']
    cacheAgainAllot.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheWaitRecognized = ['waitRecognized']
    cacheWaitRecognized.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheNotWaitSignOrder = ['notWaitSignOrder']
    cacheNotWaitSignOrder.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheVisitOrder = ['visitOrder']
    cacheVisitOrder.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheContractItem = ['contractItem']
    cacheContractItem.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheBackDeal = ['backDeal']
    cacheBackDeal.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheCfsSign = ['cfsSign']
    cacheCfsSign.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheWinPrize = ['winPrize']
    cacheWinPrize.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheStoreRecord = ['storeRecord']
    cacheStoreRecord.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheAgainAllotPond = ['againAllotPond']
    cacheAgainAllotPond.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheForeignAllotPond = ['foreignAllotPond']
    cacheForeignAllotPond.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheInvalidCustomer = ['invalidCustomer']
    cacheInvalidCustomer.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheBackOrder = ['backOrder']
    cacheBackOrder.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheOperator = ['operator']
    cacheOperator.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheStoreToDay = ['storeToDay']
    cacheStoreToDay.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheStoreDay = ['storeDay']
    cacheStoreDay.forEach(item => {
      this.$rmLocalStorage(item)
    })
    let cacheStoreMonth = ['storeMonth']
    cacheStoreMonth.forEach(item => {
      this.$rmLocalStorage(item)
    })
  },
  mounted () {
    this.getSessionId()
    // 生成微信登录二维码
    this.createCode()
    // 初始化粒子动画
    canvasParticle({el: this.$refs.particle})
  },
  methods: {
    getSessionId () {
      let _this = this
      window.$axios.get('https://kefu.xxjr.com/store/sysAction/sessionIdDeal', {}).then(function (res) {
        let sessionId = res.data.attr.signId
        _this.appQrcode = res.data.attr.url + '?sessionId=' + sessionId
        if (sessionId) {
          _this.$localStorage('sessionId', sessionId)
          _this.$webSocket.send({cmdName: '0001', sessionId: sessionId, signId: '', success: true})
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 切换登录方式
    switchTab (index) {
      this.tab = index
    },
    // 显示微信登陆二维码
    createCode () {
      /* eslint-disable no-new */
      new window.WxLogin({
        id: 'wxLogin',
        appid: 'wx6790df17e01c3653',
        scope: 'snsapi_login',
        redirect_uri: encodeURI('https://www.xxjr.com/page/cust/wxLogin?project=xxcrm'),
        href: 'https://kefu.xxjr.com/xxcrmpage/static/css/wxLogin.css'
      })
    },
    // 获取验证码
    getCode () {
      if (this.timer) return
      // 校验手机号码
      this.$refs['codeForm'].validateField('telephone', err => {
        if (!err) {
          this.timer = window.setInterval(() => {
            if (this.calcTime === 60) {
              this.$ajax({
                url: '/store/smsAction/nologin/kjlogin',
                data: {
                  telephone: this.codeForm.telephone
                },
                success: data => {
                  this.$message(data.message)
                }
              })
            }
            if (--this.calcTime === 0) {
              window.clearInterval(this.timer)
              this.timer = null
              this.calcTime = 60
            }
          }, 1000)
        }
      })
    },
    // 验证码登录
    codeLogin () {
      this.$refs['codeForm'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/user/login',
            data: this.codeForm,
            noToken: true,
            success: data => {
              let row = data.rows[0] || {}
              // 存储用户名和用户角色
              this.$localStorage('userName', row.userName)
              this.$localStorage('userRole', row.userRole)
              this.$localStorage('allOrgs', row.allOrgs)
              this.$localStorage('userOrgId', row.userOrgId)
              this.$router.push('/')
            }
          })
        }
      })
    },
    download () {
      this.markShow = true
    },
    markClose () {
      this.markShow = false
    },
    downloadACR () {
      this.markACRShow = true
    },
    markACRClose () {
      this.markACRShow = false
    }
  }
}
</script>

<style lang="less" scope>
.app-scan{
  text-align: center;
  padding: .20px;
  img{
    width: 180px;
    height: 180px;
    background: #fff;
  }
}
.two-app-btn{
  overflow:hidden;
  padding-left:37px;
}
.download-btn {
  float: left;
  display: block;
  height: 32px;
  width: 136px;
  line-height: 32px;
  padding: 0 16px;
  margin: 12px auto 0;
  font-size: 14px;
  color: #fff;
  border: 0;
  outline: 0;
  background: #4b94c7;
  border-radius: 0;
  span {
    color: #fff;
  }
}
.mask-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .3);
  .mark-title {
    padding-top: 18px;
    line-height: 20px;
    font-size: 18px;
    background: #fff;
    text-align: center;
    margin-bottom: 50px;
  }
  .mark-img {
    position: absolute;
    top: 55%;
    left: 50%;
    width: 300px;
    height: 340px;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
    background: #fff;
    img {
      width: 200px;
      height: 200px;
    }
  }
}
</style>
