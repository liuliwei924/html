<template>
  <el-dialog class="edit-dialog" title="添加机构" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="规则类别">
        <span>{{form.typeDesc}}</span>
      </el-form-item>
      <el-form-item label="规则描述" prop="ruleDesc" :rules="{required: true, message: '规则描述不能为空', trigger: 'blur'}">
        <el-input v-model="form.ruleDesc" placeholder="请输入规则描述"></el-input>
      </el-form-item>
      <el-form-item label="风险定级方式" prop="ruleGrade" :rules="{type: 'number', required: true, message: '风险定级方式不能为空', trigger: 'blur'}">
        <el-radio-group v-model.number="form.ruleGrade">
          <el-radio :label="1">高</el-radio>
          <el-radio :label="2">中</el-radio>
          <el-radio :label="3">低</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否启用" prop="status" :rules="{type: 'number', required: true, message: '是否启用不能为空', trigger: 'blur'}">
        <el-radio-group v-model.number="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="来源规则id" prop="sourceId" :rules="{required: true, message: '来源规则id不能为空', trigger: 'blur'}">
        <el-input v-model="form.sourceId" placeholder="请输入来源规则id"></el-input>
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
  name: 'risk-rule-edit',
  props: {
    value: Boolean,
    ruleData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        typeDesc: '',
        ruleDesc: '',
        ruleGrade: '',
        status: '',
        sourceId: ''
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
    ruleData (data) {
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
            url: '/crmsys/account/config/riskRule/updateRule',
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
