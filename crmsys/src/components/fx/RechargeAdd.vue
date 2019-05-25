<template>
  <el-dialog class="edit-dialog" title="添加充值信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="持卡人姓名" prop="holderName"  :rules="{required: true, message: '持卡人姓名不能为空', trigger: 'blur'}">
        <el-input v-model="form.holderName" placeholder="请输入持卡人姓名"></el-input>
      </el-form-item>
      <el-form-item label="充值金额" prop="tranAmt" :rules="{type: 'number', required: true, message: '充值金额不能为空', trigger: 'blur'}">
        <el-input v-model.number="form.tranAmt" placeholder="请输入充值金额"></el-input>
      </el-form-item>
      <el-form-item label="充值类型" prop="rechargeType" :rules="{required: true, message: '充值类型不能为空', trigger: 'blur'}">
          <el-select v-model="form.rechargeType" clearable placeholder="充值类型">
            <el-option label="分销系统" value="fx"></el-option>
            <el-option label="推荐贷款" value="tj"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="充值手续费" prop="fee">
        <el-input v-model="form.fee" placeholder="请输入充值手续费" readonly="readonly" disabled="disabled"></el-input>
      </el-form-item>
       <el-form-item label="交易日期:" prop="tranDate" 
       :rules="{type: 'string', required: true, message: '交易日期不能为空', trigger: 'blur'}">
          <el-date-picker
            v-model="form.tranDate"
            type="date"
            editable
            :clearable="false"
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="交易日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
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
  name: 'recharge-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        tranAmt: '',
        rechargeType: 'fx',
        fee: 5,
        holderName: '',
        remark: '',
        tranDate: ''
      },
      startDateOptions: {
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
    }
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    startDateChange (date) {
      this.form.tranDate = date || ''
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/rechargeData/saveRechargeInfo',
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
