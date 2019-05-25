<template>
  <el-dialog class="edit-dialog" title="导入" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="手机号">
        <el-input type="text" :maxlength="11" v-model="form.teamManagerTel" placeholder="请输入团队管理员手机号"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-upload class="upload-demo" :action="excelImportPath" accept="xls" :data="excelForm" :show-file-list="false" :before-upload="beforeUp" :on-success="upSuccess">
          <el-button size="small" icon="upload" type="primary" class="excelBtn" :loading="loading" @click.stop="uploadBtn" :disabled="loading" style="background: #4093d6;">导入</el-button>
      </el-upload>
    </div>
  </el-dialog>
</template>



<script>
export default {
  name: 'team-import',
  props: {
    value: Boolean
  },
  data () {
    let signId = JSON.parse(this.$localStorage('signId')).v
    return {
      visible: this.value,
      form: {
        teamManagerTel: ''
      },
      excelImportPath: this.$baseURL + 'store/account/fx/fxCust/teamCustImport',
      excelForm: {
        signId: signId
      },
      loading: false
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
    // 文件上传之前处理
    beforeUp () {
      this.loading = true
    },
    // 文件上传成功处理
    upSuccess (res) {
      this.loading = false
      if (res.success) {
        if (res.message) {
          this.$msg(res.message)
        } else {
          this.$msg('导入成功！', 'success')
        }
      } else {
        this.$msg(res.message, 'error')
      }
    },
     // 文件上传处理
    uploadBtn () {
      if (this.form['teamManagerTel'].length !== 11) {
        this.$message('手机号码有误')
        return
      }
      this.excelForm['teamManagerTel'] = this.form['teamManagerTel']
      let fileBtn = document.getElementsByClassName('el-upload__input')
      fileBtn[0].click()
      this.$emit('change', false)
    }
  }
}
</script>
