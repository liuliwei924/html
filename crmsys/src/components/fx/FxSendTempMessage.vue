<template>
  <el-dialog class="edit-dialog" title="发送项目进展消息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="标题" prop="content" :rules="{required: true, message: '标题不能为空', trigger: 'blur'}">
        <el-input v-model="form.content" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName" :rules="{required: true, message: '项目名称不能为空', trigger: 'blur'}">
        <el-input v-model="form.projectName" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目进展" prop="proProcess" :rules="{required: true, message: '项目进展不能为空', trigger: 'blur'}">
        <el-input :rows="5" :cols="5" type="textarea"
          v-model="form.proProcess" placeholder="请输入项目进展">
        </el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input :rows="5" :cols="5" type="textarea"
          v-model="form.remark" placeholder="请输入备注">
        </el-input>
      </el-form-item>
      <el-form-item label="模板示例" prop="tempImg">
        <img :src="this.tempImg" style="width:282px;">
      </el-form-item>
      <el-form-item 
        label="提示"
        :rules="{required: true}">
        <div class="el-form-item__content">根据帅选条件发送给关注了小小攒钱的用户</div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm" :loading="loading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'fx-send-temp-message',
  props: {
    value: Boolean,
    newSearchForm: Object
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        content: '',
        proProcess: '',
        projectName: '',
        remark: ''
      },
      tempImg: 'https://static.xxjr.com/upfile/fxCardImg/dd23751d-c849-4634-a70e-266e85126fa1.png'
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
      let _this = this
      this.$refs['form'].validate(valid => {
        if (valid) {
          let form = Object.assign(this.form, this.newSearchForm)
          this.loading = true
          this.$ajax({
            url: '/store/account/fx/fxCust/sendAgentMessage',
            data: form,
            success: data => {
              window.setTimeout(() => {
                _this.loading = false
                _this.$emit('change', 'search')
              }, 5000)
            }
          })
        }
      })
    }
  }
}
</script>
