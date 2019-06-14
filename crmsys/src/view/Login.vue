<template>
  <div class="login-box">
    <!-- 登录背景+粒子动画 -->
    <div class="login-bg" ref="particle">
      <div class="login-bg__img"></div>
    </div>
    <!-- 登录框 -->
    <div class="login-block">
      <div class="login-logo"></div>
      <div :class="wrapperClass">
        <div :class="contentClass">
         <div class="login-content__header clearfix" style="width: 360px;">
            <!--  <div class="login-content__tab fl" :class="{active: tab === 2}" @click.stop="switchTab(2)">扫码登录</div>-->
            <div class="login-content__tab fl" :class="{active: tab === 1}" @click.stop="switchTab(1)">密码登录</div>
            <div class="login-content__tab_new fl" :class="{active: tab === 3}" @click.stop="switchTab(3)">验证码登录</div>
          </div>
          <div class="login-content__body">
            <!-- 微信扫码登录 -->
            <div id="wxLogin" class="login-content__wx" v-show="tab === 1"></div>
            <!-- 手机登录 -->
             <!-- <el-form :model="codeForm" ref="codeForm" class="login-content__panel" v-show="tab == 2">
              <div class="app-scan">
                <img :src="appQrcode" alt="">
              </div>
             <div class="two-app-btn">
                <el-button class="download-btn" @click.prevent="download">下载小小云APP</el-button>
                <el-button class="download-btn" @click.prevent="downloadACR">下载ACR</el-button>
              </div
            </el-form>> -->
            <!-- 手机登录 -->
            <el-form :model="pwdForm" ref="pwdForm" class="login-content__panel" v-show="tab == 1">
              <div class="login-content__group">
                <i class="login-icon__user fl"></i>
                <el-form-item class="fl" prop="telephone" :rules="{validator: checkPhone, trigger: 'blur'}">
                  <el-input v-model="pwdForm.telephone" :maxlength="11" placeholder="请输入您的手机号码"></el-input>
                </el-form-item>
              </div>
              <div class="login-content__group">
                <i class="login-icon__code fl"></i>
                <el-form-item class="fl" prop="password" :rules="{required: true, message: '请输入您的密码', trigger: 'blur'}">
                  <el-input :type="pwdType" placeholder="请输入您的密码" v-model="pwdForm.password">
                  </el-input>
                </el-form-item>
                <i class="login-icon__pass fl" v-if="isPass" style="margin-left: 40px;" @click="showPwd()"></i>
              </div>
              <el-button native-type="submit" class="login-btn" @click.prevent="pwdLogin">登&nbsp;录</el-button>
            </el-form>
            <!-- 验证码 -->
            <el-form :model="codeForm" ref="codeForm" class="login-content__panel" v-show="tab == 3">
              <div class="login-content__group">
                <i class="login-icon__user fl"></i>
                <el-form-item class="fl" prop="telephone" :rules="{validator: checkPhone, trigger: 'blur'}">
                  <el-input v-model="codeForm.telephone" :maxlength="11" placeholder="请输入您的手机号码"></el-input>
                </el-form-item>
              </div>

              <div class="login-content__group" v-if="isShow">
                <i class="login-icon__code fl"></i>
                <el-form-item class="fl">
                  <el-input placeholder="请输入图形验证码" v-model="smsImgCode">
                  </el-input>
                </el-form-item>
                <img :src="imgUrl" @click="freshImgUrl"/>
              </div>

              <div class="login-content__group">
                <i class="login-icon__code fl"></i>
                <el-form-item class="fl" prop="randomNo" :rules="{required: true, message: '请输入您的验证码', trigger: 'blur'}">
                  <el-input  placeholder="请输入您的验证码" v-model="codeForm.randomNo">
                  </el-input>
                </el-form-item>
                <span class="login-code" @click="confirm" v-if="isShow">{{calcTime === 60 ? '获取验证码' : calcTime+'s'}}</span>
                <span class="login-code" @click="getCode" v-else>{{calcTime === 60 ? '获取验证码' : calcTime+'s'}}</span>
              </div>
              <el-button native-type="submit" class="login-btn" @click.prevent="codeLogin">登&nbsp;录</el-button>
            </el-form>
          </div>
        </div>
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
    let imgCodeKey = ('crmpage' + Math.floor(Math.random() * (99999 - 10000 + 1) + 10000))
    return {
      pwdType: 'password',
      appQrcode: '',
      imgCodeKey,
      tab: 1,
      active: 1,
      imgUrl: (this.$baseURL + '/store/sysAction/getImgCode/' + imgCodeKey),
      smsImgCode: '',
      pwdForm: {
        telephone: '',
        password: ''
      },
      isShow: false,
      oldTelephone: '',
      codeForm: {
        telephone: '',
        randomNo: ''
      },
      // 校验手机格式
      checkPhone (rule, value, callback) {
        /^1[345789]\d{9}$/.test(value) ? callback() : callback(new Error('手机号码格式不正确'))
      },
      dev,
      calcTime: 60,
      codeText: '获取验证码',
      timer: null,
      markImg: '',
      markShow: false,
      markACRImg: '',
      markACRShow: false
    }
  },
  computed: {
    wrapperClass () {
      if (this.isShow && this.tab === 3) {
        return 'login-wrapper wrapper'
      } else {
        return 'login-wrapper'
      }
    },
    contentClass () {
      if (this.isShow && this.tab === 3) {
        return 'login-content content'
      } else {
        return 'login-content'
      }
    },
    isPass () {
      if (this.pwdForm.password && this.pwdForm.password.length > 0) {
        return true
      } else {
        this.pwdType = 'password'
        return false
      }
    }
  },
  watch: {
    // 倒计时
    calcTime (val) {
      this.codeText = val === 60 ? '获取验证码' : `${val}s`
    },
    'codeForm.telephone' (val) {
      this.isShow = false
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
    // this.getSessionId()
    // 生成微信登录二维码
    // this.createCode()
    // 初始化粒子动画
    canvasParticle({el: this.$refs.particle})
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    freshImgUrl () {
      let imgCodeKey = ('crmpage' + Math.floor(Math.random() * (99999 - 10000 + 1) + 10000))
      this.imgCodeKey = imgCodeKey
      this.imgUrl = (this.$baseURL + '/store/sysAction/getImgCode/' + imgCodeKey)
      console.log(this.imgUrl)
    },
    // getSessionId () {
    //   let _this = this
    //   window.$axios.get('https://kefu.xxjr.com/store/sysAction/sessionIdDeal', {}).then(function (res) {
    //     let sessionId = res.data.attr.signId
    //     _this.appQrcode = res.data.attr.url + '?sessionId=' + sessionId
    //     if (sessionId) {
    //       _this.$localStorage('sessionId', sessionId)
    //       _this.$webSocket.send({cmdName: '0001', sessionId: sessionId, signId: '', success: true})
    //     }
    //   }).catch(function (error) {
    //     console.log(error)
    //   })
    // },
    // 切换登录方式
    switchTab (index) {
      this.tab = index
    },
    // 获取验证码
    getCode () {
      if (this.timer) return
      // 校验手机号码
      this.$refs['codeForm'].validateField('telephone', err => {
        if (!err) {
          if (this.calcTime === 60) {
            this.$ajax({
              url: '/store/smsAction/nologin/kjlogin',
              data: {
                telephone: this.codeForm.telephone
              },
              success: data => {
                this.$message(data.message)
                this.timer = window.setInterval(() => {
                  if (--this.calcTime === 0) {
                    window.clearInterval(this.timer)
                    this.timer = null
                    this.calcTime = 60
                  }
                }, 1000)
              },
              fail: data => {
                console.log(data)
                if (data.errorCode === '001') {
                  this.isShow = true
                  this.freshImgUrl()
                  this.$message({showClose: true, message: '验证码限制到上限，请输入图像验证码再获取', type: 'error'})
                } else {
                  this.timer = window.setInterval(() => {
                    if (--this.calcTime === 0) {
                      window.clearInterval(this.timer)
                      this.timer = null
                      this.calcTime = 60
                    }
                  }, 1000)
                  this.$msg(data.message, 'error')
                }
              }
            })
          }
        }
      })
    },
    confirm () {
      if (this.calcTime === 60) {
        if (!this.smsImgCode) {
          this.$message({showClose: true, message: '请输入图像验证码', type: 'error'})
          return
        }
        if (!this.codeForm.telephone) {
          this.$message({showClose: true, message: '请输入手机号', type: 'error'})
          return
        }
        this.$ajax({
          url: '/store/smsAction/nologin/kjlogin',
          data: {
            telephone: this.codeForm.telephone,
            smsImgCode: this.smsImgCode,
            imgCodeKey: this.imgCodeKey
          },
          success: data => {
            this.$message(data.message)
            this.timer = window.setInterval(() => {
              if (--this.calcTime === 0) {
                window.clearInterval(this.timer)
                this.timer = null
                this.calcTime = 60
                this.isShow = false
              }
            }, 1000)
          },
          fail: data => {
            this.$message({showClose: true, message: data.message, type: 'error'})
            this.freshImgUrl()
          }
        })
      }
    },
    // 验证码登录
    pwdLogin () {
      this.$refs['pwdForm'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/user/login',
            data: this.pwdForm,
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
    // 验证码登录
    codeLogin () {
      this.$refs['codeForm'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/user/kjLogin',
            data: this.codeForm,
            noToken: true,
            success: data => {
              let row = data.rows[0] || {}
              this.isShow = false
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
.wrapper {
  height: 378px !important;
}
.content {
  height: 345px !important;
}
.black-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
  display: flex;
  align-items: center;
  justify-content: center;
  .popup-wrap {
    width: 30rem;
    height: 10rem;
    background: #fff;
    border-radius: .1rem;
    padding: .5rem .3rem;
    .title {
      text-align: center;
      padding-bottom: 1rem;
      color: #4b94c7;
      font-size: 1rem;
    }
    .text {
      font-size: .26rem;
      text-align: left;
    }
    .img {
      width: 15rem;
      height: 5rem;
    }
    .btn {
      width: 4rem;
      height: 3rem;
      font-size: .26rem;
      margin: -0.5rem auto 0;
      margin-left: 25rem;
      background: #4b94c7;
      color: #fff;
      border-radius: .1rem;
    }
  }
}
.login-content__panel .login-code {
  display: inline-block;
  width: 120px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-left: 1px solid #dcdcdc;
  font-size: 16px;
  color: #4b94c7;
  cursor: pointer;
}
.show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
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
