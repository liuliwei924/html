<template>
  <el-dialog class="edit-dialog" title="添加风险规则模板" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="规则类型描述" prop="typeDesc" :rules="{required: true, message: '规则类型描述不能为空', trigger: 'blur'}">
        <el-input v-model="form.typeDesc" placeholder="请输入规则类型描述"></el-input>
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
  name: 'risk-rule-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        typeDesc: ''
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
          this.$ajax({
            url: '/crmsys/account/config/riskRule/addRuleType',
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
