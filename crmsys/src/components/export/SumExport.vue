<template>
<el-dialog class="edit-dialog" title="导出" v-model="show">
  <el-form :model="form" ref="form" label-width="150px">
    <el-form-item label="请输入文件名" prop="fileName" :rules="{required: true, message: '文件名必填', trigger: 'blur'}">
        <el-input v-model="form.fileName"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
</el-dialog>
</template>
<script>
export default{
  name: 'sum-export',
  props: {
    defileName: String
  },
  data () {
    return {
      loading: false,
      show: false,
      title: '导出',
      isEdit: false,
      form: {
        fileName: this.defileName || ''
      }
    }
  },
  methods: {
    close () {
      this.show = false
    },
    confirm () {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message({message: '请按提示规则输入', type: 'error'})
          return false
        }
        this.loading = true
        let form = this.$parent.exportForm
        form['fileName'] = this.form.fileName
        form['exportParams'] = JSON.stringify(this.$parent.exportSearchParams)
        this.$ajax({
          url: '/store/account/user/export/insert',
          data: form,
          success: () => {
            this.show = false
            this.loading = false
            this.$message({message: '操作成功,请于数据列表中下载', type: 'success'})
          },
          fail: err => {
            this.loading = false
            this.$message({message: err.message, type: 'error'})
          }
        })
      })
    }
  }
}
</script>
