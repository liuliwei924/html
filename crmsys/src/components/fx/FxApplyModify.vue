<template>
  <el-dialog class="edit-dialog" title="修改申请信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="申请姓名" prop="fxApplyName" :rules="{required: true, message: '申请人姓名不能为空', trigger: 'blur'}">
        <el-input v-model="form.fxApplyName" placeholder="请输入申请姓名"></el-input>
      </el-form-item>
      <el-form-item label="申请人身份证号" prop="fxCardNo" 
      :rules="{required: true, message: '申请人身份证号不能为空', trigger: 'blur'}">
        <el-input v-model="form.fxCardNo" placeholder="请输入申请人身份证号"></el-input>
      </el-form-item>
       <el-form-item label="产品名称" prop="prodName" >
        <el-input v-model="form.prodName" placeholder="请选择产品名称" readonly="readonly" disabled="disabled"></el-input>
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
  name: 'fx-apply-modify',
  props: {
    value: Boolean,
    modifyApplyData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        applyName: '',
        applyTel: ''
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
    modifyApplyData (data) {
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
            url: '/store/account/fx/applyData/modifyApplyInfo',
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
