<template>
  <div class="content-box">
    <el-form class="xx-form" label-width="100px">
      <el-form-item label="Redis键">
        <el-input type="text" v-model="key" placeholder="请输入Redis键"></el-input>
      </el-form-item>
      <div class="xx-form-footer">
        <button class="xx-form-btn" :class="isDisabled && 'l-disabled'" :isLoding="isDisabled" type="button" @click="sysRedisQuery" :disabled="isDisabled">获取</button>
        <button class="xx-form-btn t3" :class="isDisabled && 'l-disabled'" :isLoding="isDisabled" type="button" @click="sysRedisUpdate" :disabled="isDisabled">设置</button>
        <button class="xx-form-btn t4" :class="isDisabled && 'l-disabled'" :isLoding="isDisabled" type="button" @click="sysRedisDelete" :disabled="isDisabled">删除</button>
      </div>
      <el-form-item label="Redis值" class="textarea-long">
        <el-input type="textarea" v-model="values"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isDisabled: false,
      key: '',
      values: '',
      objectType: ''
    }
  },
  created () {},
  methods: {
    sysRedisQuery () {
      if (!this.key) {
        this.$msg('请输入Redis键')
        return
      }
      this.isDisabled = true
      this.$ajax({
        url: '/store/account/config/redisset/query',
        data: {
          key: this.key
        },
        loading: true,
        success: data => {
          this.objectType = data.attr.objectType || ''
          this.values = data.attr.values
          this.isDisabled = false
        }
      })
    },
    sysRedisDelete () {
      if (!this.key) {
        this.$msg('请输入Redis键')
        return
      }
      this.isDisabled = true
      this.$ajax({
        url: '/store/account/config/redisset/delete',
        data: {
          key: this.key
        },
        loading: true,
        success: data => {
          this.$msg('redis删除成功')
          this.isDisabled = false
        }
      })
    },
    sysRedisUpdate () {
      if (!this.objectType) {
        this.$msg('请先查询objectType')
        return
      }
      this.isDisabled = true
      this.$ajax({
        url: '/store/account/config/redisset/update',
        data: {
          key: this.key,
          objectType: this.objectType,
          values: this.values
        },
        loading: true,
        success: data => {
          this.$msg('redis设置成功')
          this.isDisabled = false
        }
      })
    }
  }
}
</script>
<style>
.xx-base-input {
  padding-left: 100px;
  padding-top: 60px;
  width: 800px;
}
.xx-form-footer {
  text-align: left;
  padding-left: 100px;
}
.xx-form-btn {
  border-radius: 0;
  color: #fff;
  border: none;
  background: #0c78b1; /*深蓝色*/
  min-width: 80px;
  height: 36px;
  cursor: pointer;
  outline: none;
  border-right: 10px;
}
.t4 {/*红色*/
  background: #dd504c;
}
.t3 {/*绿色*/
  background: #5eb95e;
}
.t2 {/*灰色*/
  color: #999;
  background: #f9f9f9;
  border: 1px solid #dcdcdc;
  margin: 0 10px;
}
</style>
