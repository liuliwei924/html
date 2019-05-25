<template>
  <el-dialog class="edit-dialog" title="发送App消息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="标题" prop="title" :rules="{required: true, message: '标题不能为空', trigger: 'blur'}">
         <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" :rules="{required: true, message: '内容不能为空', trigger: 'blur'}">
        <el-input v-model="form.content" :rows="10" :cols="5" type="textarea" :maxlength="500" placeholder="请输入内容"></el-input>
        <p style="text-align: right;padding-right: 22px;">剩余字数：{{500 - form.content.length}}</p>
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
  name: 'fx-send-app-message',
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
        title: ''
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
     // 时间改变赋值
    startDateChange (date) {
      this.form.startTime = date
    },
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
            url: '/store/account/fx/fxCust/sendAppMessage',
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
