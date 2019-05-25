<template>
  <el-dialog
    class="edit-dialog"
    title="二维码收款"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-form-item
        label="金额"
        prop="signAmount"
        :rules="{type: 'number',required: true, message: '金额不能为空',trigger: 'blur'}">
        <el-input
          v-model.number="form.signAmount"
          placeholder="请输入金额">
          <template slot="append">万元</template>
        </el-input>
        <el-button class="order-other__btn code_btn">生成二维码</el-button>
      </el-form-item>
      <div class="code-area">
        <div class="code-area-img"></div>
        <div class="code-area-tips">请用微信扫码</div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
// 代扣申请子组件
export default {
  name: 'code-collect',
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
        selectDesc: [],
        inputDesc: ''
      },
      selectDesc: ['联系不上', '额度太低', '不要了']
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
          let handleDesc = `${this.form.selectDesc.join(',')},${this.form.inputDesc}`
          this.$ajax({
            url: '/store/account/work/waitDeal/notNeedDeal',
            data: {
              applyId: this.applyId,
              customerId: this.customerId,
              handleDesc
            },
            loading: true,
            success: data => {
              this.visible = false
            }
          })
        }
      })
    }
  }
}
</script>
