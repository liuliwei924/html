<template>
  <el-dialog class="edit-dialog" title="编辑狗窝公告" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="公告标题"
        prop="nottifyTitle"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.nottifyTitle"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="notifyText" :rules="{required: false, message: '公告内容不能为空'}">
        <el-input v-model="form.notifyText" type="textarea" :rows="10" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item
        label="公告类型"
        prop="notifyType"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.notifyType"  placeholder="请选择公告类型">
          <el-option
            v-for="val,key,index in notifyType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="公告状态"
        prop="status"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.status"  placeholder="请选择公告状态">
          <el-option
            v-for="val,key,index in status"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="开始日期"
        prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="date"
          editable
          :picker-options="startDateOptions"
          @change="thawChangeStart"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="结束日期"
        prop="endTime">
        <el-date-picker
          v-model="form.endTime"
          type="date"
          editable
          :picker-options="endDateOptions"
          @change="thawChangeEnd"
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
  name: 'xjNotify-edit',
  props: {
    value: Boolean,
    custData: Object,
    status: Object,
    notifyType: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        notifyId: '',
        nottifyTitle: '',
        notifyText: '',
        status: '',
        notifyType: '',
        startTime: '',
        endTime: ''
      },
       // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
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
    custData (obj) {
      this.first = true
      this.form = {
        notifyId: obj['notifyId'] || '',
        nottifyTitle: obj['nottifyTitle'] || '',
        notifyText: obj['notifyText'] || '',
        status: obj['status'] || 1,
        notifyType: obj['notifyType'] || 1,
        startTime: obj['startTime'] || '',
        endTime: obj['endTime'] || ''
      }
      console.log(126, this.form)
    }
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
    thawChangeStart (date) {
      this.form.startTime = date || ''
      this.form.endTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    thawChangeEnd (date) {
      this.form.endTime = date || ''
    },
    // 确定
    confirm () {
      console.log(154, this.form)
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/xj/xjNotifyCfg/updateNotifyInfo',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
            }
          })
          this.close()
        }
      })
    }
  }
}
</script>
