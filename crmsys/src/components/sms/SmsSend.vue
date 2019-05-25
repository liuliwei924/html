<template>
  <el-dialog class="edit-dialog" title="发送短信" v-model="visible">
    <el-form :model="form" ref="form" :rules="rules" label-width="150px">
      <el-form-item label="渠道名称" prop="channelId">
        <el-select v-model="form.channelId" filterable clearable placeholder="渠道名称">
          <el-option v-for="val,key,index in smsChannelData" :label="val.channelName" :value="val.channelId" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称" prop="tempId">
        <el-select v-model="form.tempId" filterable clearable placeholder="模板名称">
          <el-option v-for="val,key,index in smsTempData" :label="val.tempName" :value="val.tempId" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信发送条数" prop="startNum">
        <el-input v-model.number="form.sendNum" placeholder="请输入发送条数"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm('form')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'sms-send',
  props: {
    value: Boolean
  },
  data () {
    const checkSendNum = (rule, value, callback) => {
      if (this.form.sendNum !== '' || this.form.esendNum !== '') {
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'))
          } else {
            callback()
          }
        }, 500)
      } else {
        callback()
      }
    }
    const checkChannelName = (rule, value, callback) => {
      if (!(value)) {
        callback(new Error('请选择短信渠道'))
      } else {
        callback()
      }
    }
    const checkTempName = (rule, value, callback) => {
      if (!(value)) {
        callback(new Error('请选择模板名称'))
      } else {
        callback()
      }
    }
    return {
      visible: this.value,
      smsTempData: [],
      smsChannelData: [],
      form: {
        tempId: '',
        channelId: '',
        sendNum: ''
      },
      rules: {
        sendNum: [
        { validator: checkSendNum, trigger: 'blur' }
        ],
        channelId: [
        { validator: checkChannelName, trigger: 'blur' }
        ],
        tempId: [
        { validator: checkTempName, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getSmsTemplate()
    this.getSmsChannellate()
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
    // 获取短信模板
    getSmsTemplate () {
      this.$ajax({
        url: '/store/account/sms/smsTemp/querySmsTempInfo',
        success: data => {
          this.smsTempData = data.rows || []
        }
      })
    },
    // 获取短信渠道
    getSmsChannellate () {
      this.$ajax({
        url: '/store/account/sms/smsChannel/querySmsChannelInfo',
        success: data => {
          this.smsChannelData = data.rows || []
        }
      })
    },
    // 确定
    confirm (form) {
      let totalRecord = this.$parent.totalRecord
      let sendNum = this.form.sendNum
      if (sendNum > totalRecord) {
        this.$msg('短信发送条数不能大于查询出来的条数!')
        return
      }
      if (sendNum > 200000 || (totalRecord > 200000 && (sendNum === undefined || sendNum === ''))) {
        this.$msg('一次最多发送20万条短信，请重新查询或限制条数!')
        return
      }
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/sms/data/sendSms',
            data: Object.assign(this.form, this.$parent.searchForm),
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