<template>
  <el-dialog class="edit-dialog" title="反馈数据审核" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="审核意见" prop="auditDesc">
        <el-input rows="5" cols="5" type="textarea" v-model="form.auditDesc" placeholder="请输入审核意见"></el-input>
      </el-form-item>
      <el-form-item label="审核状态" class="gradeImg-uploader" required>
        <el-form-item class="el-col" prop="auditStatus">
          <el-radio-group v-model="form.auditStatus">
            <el-radio-button :label="1">通过</el-radio-button>
            <el-radio-button :label="2">不通过</el-radio-button>
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
  name: 'feedback-audit',
  props: {
    value: Boolean,
    succIds: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        auditStatus: 1,
        auditDesc: ''
      },
      succIdArr: []
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    succIds (data) {
      this.succIds = data
    }
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      let params = this.form
      let succIds = ''
      for (let i = 0; i < this.succIds.length; i++) {
        succIds += this.succIds[i] + ','
      }
      params.succIds = succIds
      this.$refs['form'].validate(valid => {
        if (this.form.auditStatus === 1) {
          if (valid) {
            this.$ajax({
              url: '/store/account/fx/feedbackData/dataAuditPass',
              data: params,
              success: data => {
                this.$emit('change', 'search')
              }
            })
          }
        } else if (this.form.auditStatus === 2) {
          if (valid) {
            this.$ajax({
              url: '/store/account/fx/feedbackData/dataAuditNoPass',
              data: params,
              success: data => {
                this.$emit('change', 'search')
              }
            })
          }
        }
      })
    }
  }
}
</script>
