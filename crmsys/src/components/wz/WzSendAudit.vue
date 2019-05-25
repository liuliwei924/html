<template>
  <el-dialog class="edit-dialog" title="发放审核" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="发放时间"
        prop="sendTime">
        <el-date-picker
          v-model="form.sendTime"
          type="datetime"
          editable
          @change="sendTimeChange"
          placeholder="请选择">
        </el-date-picker>
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
  name: 'wzSend-audit',
  props: {
    value: Boolean,
    commIds: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        sendTime: ''
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
    commIds (val) {
      this.form.commIds = JSON.stringify(val)
    }
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 时间改变赋值
    sendTimeChange (date) {
      this.form.sendTime = date
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/wz/wzWithdraw/checkSend',
            data: {
              str: JSON.stringify({commIds: this.commIds}),
              sendTime: this.form.sendTime
            },
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
