<template lang="html">
  <el-dialog title="设置新密码" :visible.sync="isShowPwd" class="edit-dialog" center :show-close="false" :close-on-click-modal="false">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="新密码" prop="password" :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.password" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="xx-form-btn" @click="confirm">确认</el-button>
        <el-button class="xx-form-btn t2" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'edit-pwd',
  props: {
    isShowPwd: Boolean,
    curCustomerId: String
  },
  data () {
    return {
      isEdit: false,
      form: {
        curCustomerId: '',
        password: ''
      }
    }
  },
  watch: {
    curCustomerId (obj) {
      this.form.curCustomerId = obj
    }
  },
  methods: {
    confirm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.password.length < 6) {
            this.$warning('密码长度必须大于等于6位', 'warning')
            return
          }
          if (!this.form.curCustomerId || this.form.curCustomerId.length === 0) {
            this.$warning('请选择一个用户', 'warning')
            return
          }
          this.$ajax({
            url: '/store/account/config/operator//resetPwd',
            data: this.form,
            success: data => {
              this.$warning('重置密码成功', 'success')
              this.resetData()
              this.$emit('close', 'refresh')
            }
          })
        }
      })
    },
    cancel () {
      this.resetData()
      this.$emit('close')
    },
    resetData () {
      this.form = {
        curCustomerId: '',
        password: ''
      }
    }
  }
}
</script>
