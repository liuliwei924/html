<template>
  <div class="wx-info-box">
    <div class="icon"></div>
    <div class="text">{{errorText}}</div>
    <div class="back" @click="backLogin">返回登录</div>
  </div>
</template>

<script>
// 错误提示页面-微信扫码登录失败
export default {
  name: 'wx-info',
  data () {
    return {
      type: '', // 工程类型
      errorText: '' // 错误提示语
    }
  },
  beforeRouteEnter (to, from, next) {
    // 错误代码
    let errorCode = to.query.errorCode || 0
    // 工程类型
    let project = to.query.project
    if (project === 'xxcrm') {
      next(vm => {
        vm.type = 'xxcrm'
      })
    } else if (project === 'kf') {
      next(vm => {
        vm.type = 'kf'
      })
    } else if (project === 'manage') {
      next(vm => {
        vm.type = 'manage'
      })
    } else if (project === 'collect') {
      next(vm => {
        vm.type = 'collect'
      })
    }
    if (errorCode === '1') {
      next(vm => {
        vm.errorText = '未匹配到您的用户信息，请关注小小金融公众号，如已关注请重新关注即可！'
      })
    } else if (errorCode === '2') {
      next(vm => {
        vm.errorText = '您还不是系统认可的用户，请联系管理员为你配置权限！'
      })
    } else if (errorCode === '3') {
      next(vm => {
        vm.errorText = '您暂未开通微信登录权限，可联系管理员开通！'
      })
    } else if (errorCode === '4') {
      next(vm => {
        vm.errorText = '未配置微信登录权限用户，请联系管理员为您进行配置！'
      })
    }
  },
  methods: {
    backLogin () {
      if (this.type === 'xxcrm') {
        // 客户关系管理系统
        window.location.href = 'https://kefu.xxjr.com/xxcrmpage/login'
      } else if (this.type === 'kf') {
        // 客服跟单系统
        window.location.href = 'https://kefu.xxjr.com/login'
      } else if (this.type === 'manage') {
        // 管理后台系统
        window.location.href = 'https://sys.xxjr.com/views/login.html'
      } else if (this.type === 'collect') {
        // 财务收款系统
        window.location.href = 'https://collect.xxjr.com/login'
      }
    }
  }
}
</script>

<style lang="less">
.wx-info-box {
  width: 320px;
  height: 320px;
  margin: 0 auto;
  .icon {
    width: 320px;
    height: 160px;
    padding-top: 80px;
    background: url(../assets/images/wx_info_bg.png) no-repeat center 80px;
  }
  .text {
    line-height: 24px;
    padding-top: 16px;
    font-size: 16px;
    color: #999;
    text-align: center;
  }
  .back {
    width: 100px;
    height: 28px;
    margin: 16px auto 0;
    line-height: 28px;
    font-size: 14px;
    color: #e6986e;
    text-align: center;
    border: 1px solid #e6986e;
    cursor: pointer;
  }
}
</style>
