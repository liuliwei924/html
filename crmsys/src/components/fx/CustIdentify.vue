<template>
  <el-dialog class="edit-dialog" title="修改用户信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="用户姓名" prop="fxRealName" :rules="{required: true, message: '用户姓名不能为空', trigger: 'blur'}">
        <el-input v-model="form.fxRealName" placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="用户身份证号" prop="fxCardNo" 
      :rules="{required: true, message: '用户身份证号不能为空', trigger: 'blur'}">
        <el-input v-model="form.fxCardNo" placeholder="请输入用户身份证号"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>



<script>
export default {
  name: 'cust-identify',
  props: {
    value: Boolean,
    modifyCustData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        realName: '',
        cardNo: ''
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    modifyCustData (data) {
      this.form = data
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
          this.$ajax({
            url: '/store/account/fx/fxCust/modifyCustInfo',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
              this.$message({
                message: '修改成功！',
                type: 'success'
              })
            }
          })
        }
      })
    }
  }
}
</script>
