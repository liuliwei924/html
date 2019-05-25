<template>
  <div class="error-box">
    <div class="error-text">哎呀...页面开小差了...</div>
    <el-button class="error-back-btn" @click="backHome">返回首页</el-button>
  </div>
</template>

<script>
// 错误提示页面-404路由不存在
export default {
  name: 'error',
  methods: {
    // 返回首页
    backHome () {
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="less">
.error-box {
  height: 100%;
  background: #f8f8f8;
  padding-top: 100px;
  box-sizing: border-box;
  text-align: center;
  .error-text {
    padding-top: 250px;
    line-height: 32px;
    font-size: 20px;
    color: #666;
    background: url(../assets/images/404_img.png) no-repeat center 0;
  }
  .error-back-btn {
    width: 120px;
    margin-top: 16px;
    font-size: 16px;
    color: #fff;
    background: #f76364;
    border: 0;
    border-radius: 0;
  }
}
</style>
