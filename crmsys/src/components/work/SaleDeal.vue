<template>
  <el-dialog
    class="edit-dialog"
    title="挂卖处理"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item label="描述">
        <el-input type="textarea" v-model.trim="form.inputDesc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 不能做子组件
export default {
  name: 'sale-deal',
  props: {
    value: Boolean,
    applyId: [Number, String],
    customerId: [Number, String]
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        inputDesc: ''
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
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
          let handleDesc = this.form.inputDesc
          this.$ajax({
            url: '/store/account/work/waitDeal/saleDeal',
            data: {
              applyId: this.applyId,
              customerId: this.customerId,
              handleDesc
            },
            loading: true,
            success: data => {
              this.$emit('change', 'back')
              this.visible = false
            }
          })
        }
      })
    }
  }
}
</script>
