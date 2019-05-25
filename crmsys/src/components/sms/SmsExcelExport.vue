<template>
  <el-dialog class="edit-dialog" title="导出" v-model="visible">
    <el-form :model="form" ref="form" :rules="rules" label-width="150px">
      <el-form-item label="导出条数" prop="exportNum">
        <el-input v-model.number="form.exportNum" placeholder="请输入导出限制条数"></el-input>
      </el-form-item>
      <el-form-item label="是否标记发送"  prop="exportStatus">
          <el-radio-group v-model="form.exportStatus">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="模板名称" prop="tempId">
        <el-select v-model="form.tempId" filterable clearable placeholder="模板名称">
          <el-option v-for="val,key,index in smsTempData" :label="val.tempName" :value="val.tempId" :key="index"></el-option>
        </el-select>
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
  name: 'sms-excel-export',
  props: {
    value: Boolean
  },
  data () {
    const checkExportNum = (rule, value, callback) => {
      if (this.form.status === '1') {
        if (this.form.exportNum !== '') {
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
      } else {
        callback()
      }
    }
    const checkTempName = (rule, value, callback) => {
      if (this.form.exportStatus === '1') {
        if (!(value)) {
          callback(new Error('请选择模板名称'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      visible: this.value,
      smsTempData: [],
      signId: '',
      form: {
        tempId: '',
        exportStatus: 0
      },
      rules: {
        exportNum: [
        { validator: checkExportNum, trigger: 'change' }
        ],
        tempId: [
        { validator: checkTempName, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getSmsTemplate()
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
    // Excel确认导出
    confirm (form) {
      let totalRecord = this.$parent.totalRecord
      let exportNum = this.form.exportNum
      if (exportNum > 200000 || (totalRecord > 200000 && (exportNum === undefined || exportNum === ''))) {
        this.$msg('一次最多导出20万条数据，请重新查询或限制条数!')
        return
      }
      this.$refs[form].validate(valid => {
        if (valid) {
          let params = {}
          let roleType = this.$localStorage('userRole')
          Object.assign(params, this.$parent.searchForm, {roleType}, this.form)
          this.$parent.exportParams = JSON.stringify(params)
          this.$parent.exportData()
          this.$emit('change', 'search')
        }
      })
    }
  }
}
</script>