<template>
  <el-dialog
    class="edit-dialog"
    title="转优质客户"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item label="价格"
        prop="price"
        :rules="{type: 'number', required: true, message: '价格不能为空', trigger: 'blur'}">
        <el-input
          v-model.number="form.price" placeholder="请输入价格">
        </el-input>
      </el-form-item>
      <el-form-item label="积分"
        prop="score"
        :rules="{type: 'number', required: true, message: '积分不能为空', trigger: 'blur'}">
        <el-input
          v-model.number="form.score" placeholder="请输入积分">
        </el-input>
      </el-form-item>
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
  name: 'senior-deal',
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
            url: '/store/account/work/waitDeal/transSeniorDeal',
            data: {
              applyId: this.applyId,
              customerId: this.customerId,
              price: this.form.price,
              score: this.form.score,
              handleDesc
            },
            loading: true,
            success: data => {
              this.$emit('change', 'back')
              this.visible = false
            },
            fail: data => {
              this.$msg(data.message)
            }
          })
        }
      })
    }
  }
}
</script>
