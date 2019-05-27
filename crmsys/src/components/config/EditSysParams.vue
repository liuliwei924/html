<template lang="html">
  <el-dialog class="edit-dialog" title="系统参数" :visible.sync="isShow" width="560px" center :show-close="false" :close-on-click-modal="false">
    <el-form :model="form" ref="form" label-width="100px" size="small">
      <el-form-item label="系统Key" prop="paramCode" 
        :rules="{ required: true, message: '请输入系统Key', trigger: 'blur' }">
        <el-input v-model="form.paramCode" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="系统值" prop="paramValue" 
        :rules="{ required: true, message: '请输入系统值', trigger: 'blur' }">
        <el-input v-model="form.paramValue"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="paramName" 
        :rules="{ required: true, message: '请输入系统描述', trigger: 'blur' }">
        <el-input v-model="form.paramName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'edit-sysparams',
  props: {
    isShow: Boolean,
    sysParamsInfo: Object,
    isEdit: Boolean
  },
  data () {
    return {
      form: {
        paramCode: '',
        paramVaule: '',
        paramName: ''
      }
    }
  },
  watch: {
    sysParamsInfo (obj) {
      this.form = obj
    }
  },
  methods: {
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.$ajax({
              url: '/store/account/config/paramset/update',
              data: this.form,
              success: data => {
                this.$message({message: '修改成功', type: 'success'})
                this.$emit('close', 'refresh')
              }
            })
          } else {
            this.$ajax({
              url: '/store/account/config/paramset/insert',
              data: this.form,
              success: data => {
                this.$message({message: '保存成功', type: 'success'})
                this.$emit('close', 'refresh')
              }
            })
          }
        }
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
