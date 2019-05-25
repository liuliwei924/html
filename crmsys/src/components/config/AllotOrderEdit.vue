<template>
  <el-dialog
    class="edit-dialog"
    title="修改员工编号"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
          label="姓名">
          <div class="el-form-item__contents">{{form.realName}}</div>
      </el-form-item>
      <el-form-item
          label="手机号码">
          <div class="el-form-item__contents">{{form.telephone}}</div>
      </el-form-item>
      <el-form-item
        label="员工编号"
        prop="employeeNo"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.employeeNo"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'allot-orderEdit',
  props: {
    value: Boolean,
    editData: Object
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        customerId: '',
        realName: '',
        telephone: '',
        employeeNo: ''
      },
      custInfo: [],
      groupNameList: []
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    // 编辑数据变化
    editData (obj) {
      this.form = {
        customerId: obj['customerId'] || '',
        realName: obj['realName'] || '',
        telephone: obj['telephone'] || '',
        employeeNo: obj['employeeNo'] || ''
      }
    }
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let loadInst = this.$loading({ fullscreen: true, text: '拼命加载中' })
          this.$ajax({
            url: '/store/account/config/allotOrderInfo/updateStoreEmployee',
            data: {
              employeeNo: this.form.employeeNo,
              customerId: this.form.customerId
            },
            success: data => {
              this.$message('修改成功')
              this.$emit('change', 'search')
              loadInst.close()
            },
            fail: (error) => {
              this.$msg(error.message)
              loadInst.close()
            }
          })
        }
      })
    }
  }
}
</script>
