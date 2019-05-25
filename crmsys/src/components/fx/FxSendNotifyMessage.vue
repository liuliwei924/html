<template>
  <el-dialog class="edit-dialog" title="发送服务通知" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="内容" prop="content" :rules="{required: true, message: '内容不能为空', trigger: 'blur'}">
        <el-input v-model="form.content" :rows="5" :cols="5" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="通知内容" prop="notifyContent" :rules="{required: true, message: '通知内容不能为空', trigger: 'blur'}">
         <el-input v-model="form.notifyContent" placeholder="请输入通知内容"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone" :rules="{required: true, message: '联系电话不能为空', trigger: 'blur'}">
         <el-input v-model="form.contactPhone" placeholder="请输入联系电话"></el-input>
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
  name: 'fx-send-notify-message',
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
        notifyContent: '',
        remark: '',
        contactPhone: '0755-23607473'
      },
      tempImg: 'https://static.xxjr.com/upfile/fxCardImg/e08beec4-b903-4eda-bed8-30d94f39e349.png'
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
            url: '/store/account/fx/fxCust/sendNotifyMessage',
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
