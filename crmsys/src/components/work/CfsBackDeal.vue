<template>
  <el-dialog
    class="edit-dialog"
    title="同步CFS回款"
    v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item 
        label="查询开始日期-起:"
        prop="startDate"
        :rules="{required: true, message: '查询开始日期不能为空'}">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          editable
          :picker-options="startDateOptions"
          @change="startDateChange"
          placeholder="开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item 
        label="查询结束日期-止:"
        prop="endDate"
        :rules="{required: true, message: '查询结束日期不能为空'}">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          editable
          :picker-options="endDateOptions"
          @change="endDateChange"
          placeholder="结束日期">
        </el-date-picker>
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
  name: 'cfsBackDeal',
  // 父组件传递参数
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        startDate: '',
        endDate: ''
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
    // 监听父组件传递的参数变化
    value (val) {
      this.visible = val
    },
    // 弹窗显示改变传递给父组件
    visible (val) {
      this.$emit('change', val)
    }
  },
  methods: {
     // 开始时间改变处理
    startDateChange (date) {
      this.form.startDate = date || ''
      this.form.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.form.endDate = date || ''
    },
    // 弹窗关闭
    close () {
      this.visible = false
    },
    // 确定
    saveHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/work/cfsSign/updateCFSBackInfo',
            data: {
              startDate: this.form.startDate,
              endDate: this.form.endDate
            },
            success: () => {
              this.$message('操作成功')
              this.$emit('change', 'search')
            },
            fail: (error) => {
              this.$message(error.message)
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
