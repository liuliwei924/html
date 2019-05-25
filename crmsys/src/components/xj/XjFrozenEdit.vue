<template>
  <el-dialog class="edit-dialog" title="修改冻结记录" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <!-- <el-form-item
        label="赠送数量"
        prop="frozenValue"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model.number="form.frozenValue"></el-input>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="sendStatus"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.sendStatus"  placeholder="请选择发放状态">
          <el-option
            v-for="val,key,index in sendStatus"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item
        label="解冻日期"
        prop="">
        <el-date-picker
          v-model="form.sendTime"
          type="date"
          editable
          @change="thawChange"
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
  name: 'xjFrozen-edit',
  props: {
    value: Boolean,
    frozenData: Object,
    sendStatus: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        recordId: '',
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
    // 编辑数据变化
    frozenData (obj) {
      this.first = true
      this.form = {
        recordId: obj['recordId'] || '',
        sendTime: obj['sendTime'] || ''
      }
    }
  },
  created () {
    let nowday = this.formateData(new Date())
    this.form.sendTime = nowday
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    formateData (data) {
      let dateObj = data
      let [year, month, day] = [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()]
      if (month <= 9) month = `0${month}`
      if (day <= 9) day = `0${day}`
      return `${year}-${month}-${day}`
    },
    // 时间改变赋值
    thawChange (date) {
      this.form.sendTime = date
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/xj/xjFrozenRecord/updateFrozenRecord',
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