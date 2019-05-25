<template>
  <el-dialog
    class="edit-dialog"
    title="预约上门"
    v-model="visible">
    <!-- 表单处理 -->
    <el-form
      ref="form"
      :model="form"
      label-width="150px">
      <el-form-item
          label="预约城市"
          prop="applyCity"
          :rules="{required: true, message: '请输入预约城市', trigger: 'blur'}">
        <el-input v-model="form.applyCity" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item
          label="预约地址"
          prop="address"
          :rules="{required: true, message: '请输入预约地址', trigger: 'blur'}">
        <el-input v-model="form.address" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="预约日期" :rules="{required: true, message: '请输入预约日期'}">
          <el-date-picker
            v-model="reservationTime"
            type="datetime"
            :picker-options="pickerOptions"
            @change="pickerChange"
            editable
            placeholder="预约日期">
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
  name: 'reservation-visit',
  // 父组件传递参数
  props: {
    value: Boolean,
    applyId: [Number, String]
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        applyId: '',
        applyCity: '',
        reservationTime: '',
        address: ''
      },
      reservationTime: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
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
    // 弹窗关闭
    close () {
      this.visible = false
    },
    // 保存处理
    saveHandle () {
      this.form.applyId = this.applyId
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/crmsys/account/busi/fillInfo/reservationVisit',
            data: this.form,
            loading: true,
            success: data => {
              this.$emit('change', 'search')
            }
          })
        }
      })
    },
    pickerChange (val) {
      this.form.reservationTime = val
      this.pickerOptions.disabledDate = (time) => {
        return time.getTime() < Date.now()
      }
    }
  }
}
</script>
