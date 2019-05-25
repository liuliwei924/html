<template>
  <el-dialog class="edit-dialog" title="人工匹配" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="申请姓名" prop="matchApplyName" :rules="{required: true, message: '申请人姓名不能为空', trigger: 'blur'}">
        <el-input v-model="form.matchApplyName" placeholder="请输入申请姓名"></el-input>
      </el-form-item>
      <el-form-item label="申请人手机号" prop="matchApplyTel" 
      :rules="{required: true, message: '申请人手机号不能为空', trigger: 'blur'}">
        <el-input v-model="form.matchApplyTel" placeholder="请输入申请人手机号"></el-input>
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
  name: 'feedback-match',
  props: {
    value: Boolean,
    feedbackData: Object,
    prodList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        fxApplyName: '',
        fxApplyTel: '',
        prodId: ''
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
    feedbackData (data) {
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
            url: '/store/account/xj/creditFeedBack/manualMatch',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
