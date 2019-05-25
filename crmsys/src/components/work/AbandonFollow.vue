<template>
  <el-dialog
    class="edit-dialog"
    title="放弃跟进"
    v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
    <!-- 表单处理 -->
       <el-form-item
        label="建议下次跟进日期"
        prop="days"
        :rules="{type: 'number',required: true, message: '放弃跟进天数不能为空',trigger: 'change'}">
        <el-select
          v-model.number="form.days"
          @change="daysChange"
          placeholder="请选择建议下次跟进日期">
          <el-option
            v-for="val,key,index in days"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="下次跟进日期"
        prop="">
        <el-date-picker
          v-model="form.nextRecordDate"
          type="date"
          editable
          @change="nextRecordChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="提示"
        :rules="{required: true}">
        <div class="el-form-item__content">放弃跟进后，该单将重新分配</div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="saveHandle">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 操作员编辑组件
export default {
  name: 'abandon-follow',
  // 父组件传递参数
  props: {
    value: Boolean,
    abandonData: Object
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        days: '',
        nextRecordDate: ''
      },
      // 天数
      days: {
        0: '立即',
        7: '一周',
        14: '两周',
        30: '一个月',
        60: '两个月',
        180: '半年'
      }
    }
  },
  watch: {
    // 监听父组件传递的参数变化
    value (val) {
      this.visible = val
    },
    // 弹窗显示改变传递给父组件
    visible (val) {
      this.$emit('change', val)
    }
  },
  created () {
    let nowday = this.formateData(new Date())
    this.form.nextRecordDate = nowday
  },
  methods: {
    formateData (data) {
      let dateObj = data
      let [year, month, day] = [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()]
      if (month <= 9) month = `0${month}`
      if (day <= 9) day = `0${day}`
      return `${year}-${month}-${day}`
    },
    // 时间改变赋值
    nextRecordChange (date) {
      this.form.nextRecordDate = date
    },
    daysChange () {
      let oldData = new Date()
      oldData.setDate(oldData.getDate() + Number(this.form.days))
      this.form.nextRecordDate = this.formateData(oldData)
    },
    // 弹窗关闭
    close () {
      this.visible = false
    },
    // 保存处理
    saveHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/work/waitDeal/abandonFollowOrder',
            data: {
              nextRecordDate: this.form.nextRecordDate,
              applyId: this.abandonData.applyId,
              customerId: this.abandonData.customerId
            },
            success: data => {
              this.$message('操作成功')
              this.$emit('change', 'search')
              if (this.abandonData.reBackFlag) {
                window.history.go(-1)
              }
            },
            fail: (error) => {
              this.$msg(error.message)
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
