<template>
  <el-dialog class="edit-dialog" title="编辑短信模板" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="模板名称" prop="tempName" :rules="{required: true, message: '模板名称不能为空', trigger: 'blur'}">
        <el-input v-model="form.tempName" placeholder="请输入模板名称"></el-input>
      </el-form-item>

      <el-form-item label="模板内容" prop="tempContent" :rules="{required: true, message: '模板内容不能为空', trigger: 'blur'}">
        <el-input type="textarea" maxlength="70" v-model="form.tempContent" placeholder="请输入模板内容"></el-input>
      </el-form-item>

      <el-form-item label="是否启用" class="gradeImg-uploader" required>
           <el-form-item class="el-col" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
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
  name: 'sms-template-edit',
  props: {
    value: Boolean,
    smsTempData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        tempName: '',
        tempContent: '',
        status: 1
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
    smsTempData (data) {
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
            url: '/store/account/sms/smsTemp/modifySmsTempInfo',
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
