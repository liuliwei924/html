<template lang="html">
  <el-dialog title="充值" :visible.sync="isShow" class="edit-dialog" center :show-close="false" :close-on-click-modal="false">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="充值金额" prop="amount" :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model.number="form.amount" placeholder="请输入充值金额"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="dtlDesc" :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入描述"
          v-model="form.dtlDesc"/>
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
  name: 'recharge-amt',
  props: {
    isShow: Boolean,
    curOrgId: Number
  },
  data () {
    return {
      isEdit: false,
      form: {
        orgId: '',
        amount: '',
        dtlDesc: ''
      }
    }
  },
  watch: {
    curOrgId (val) {
      this.form.orgId = val
    }
  },
  methods: {
    confirm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.orgId <= -1) {
            this.$msg('请选择一行', 'warning')
            return
          }
          this.$ajax({
            url: '/store/account/config/workTimeConf/orgCharge',
            data: this.form,
            success: data => {
              this.$msg('充值成功', 'success')
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
        orgId: '',
        amount: '',
        dtlDesc: ''
      }
    }
  }
}
</script>
