<template>
  <el-dialog
    class="edit-dialog"
    title="添加银行卡"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="银行名称"
        prop="bankName"
        :rules="{required: true, message: '银行名称不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.bankName"
          placeholder="请输入银行名称">
        </el-input>
      </el-form-item>
      <el-form-item
        label="银行卡"
        prop="cardCode"
        :rules="{required: true, message: '银行卡不能为空'}">
        <el-input
          v-model="form.cardCode"
          placeholder="请输入银行卡">
        </el-input>
      </el-form-item>
      <el-form-item
        label="所属分行"
        prop="branchName"
        :rules="{required: true, message: '所属分行不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.branchName"
          placeholder="请输入所属分行">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">添加</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 添加银行卡子组件
export default {
  name: 'bank-card',
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
