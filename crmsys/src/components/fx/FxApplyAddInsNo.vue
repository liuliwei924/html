<template>
  <el-dialog class="edit-dialog" title="保单号录入" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="申请姓名" prop="applyName">
        <el-input v-model="form.applyName" placeholder="申请姓名" readonly="readonly" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="申请手机号" prop="telephone" >
         <el-input v-model="form.telephone" placeholder="申请手机号" readonly="readonly" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="保单号" prop="insuranceNo" :rules="{required: true, message: '保单号不能为空', trigger: 'blur'}">
        <el-input v-model.trim="form.insuranceNo" placeholder="请输入保单号"></el-input>
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
  name: 'fx-apply-add-insno',
  props: {
    value: Boolean,
    addInsNoData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        applyName: '',
        telephone: '',
        insuranceNo: ''
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
    addInsNoData (data) {
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
            url: '/store/account/fx/applyData/addInsNoHandle',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
              this.$message({
                message: '录入成功！',
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
