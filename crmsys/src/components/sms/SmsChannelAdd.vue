<template>
  <el-dialog class="edit-dialog" title="添加短信渠道" v-model="visible">
    <el-form :model="form" ref="form"  label-width="150px">
      <el-form-item label="渠道名称" prop="channelName" :rules="{required: true, message: '渠道名称不能为空', trigger: 'blur'}">
        <el-input v-model="form.channelName" placeholder="请输入渠道名称"></el-input>
      </el-form-item>

      <el-form-item label="渠道类型" prop="channelKey" :rules="{required: true, message: '渠道类型不能为空', trigger: 'blur'}">
        <el-input  v-model="form.channelKey" placeholder="请输入渠道类型"></el-input>
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
  name: 'sms-channel-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        channelName: '',
        channelKey: '',
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
            url: '/store/account/sms/smsChannel/addSmsChannelInfo',
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
