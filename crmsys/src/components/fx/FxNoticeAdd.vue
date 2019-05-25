<template>
  <el-dialog class="edit-dialog" title="添加公告信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="公告标题" prop="title" :rules="{required: true, message: '公告标题不能为空', trigger: 'blur'}">
        <el-input v-model="form.title" placeholder="请输入公告标题"></el-input>
      </el-form-item>

      <el-form-item label="公告内容" prop="content" :rules="{required: true, message: '公告内容不能为空', trigger: 'blur'}">
        <el-input :rows="15" :cols="15" type="textarea" v-model="form.content" placeholder="请输入公告内容"></el-input>
      </el-form-item>

      <el-form-item label="是否启用" class="gradeImg-uploader" required>
           <el-form-item class="el-col" prop="enable">
            <el-radio-group v-model="form.enable">
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
  name: 'fx-notice-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        title: '',
        content: '',
        enable: 1
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
          let contentStr = this.form.content
          contentStr = contentStr.replace(/\n/g, '<br>')
          this.form.content = contentStr
          this.$ajax({
            url: '/store/account/fx/fxNotice/addNoticeInfo',
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
