<template>
  <el-dialog
    class="edit-dialog double-dialog"
    title="回款处理"
    :visible.sync="visible">
    <el-form
      class="clearfix"
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="申请金额"
        prop="applyAmount"
        :rules="{type: 'number',required: true, message: '申请金额不能为空'}">
        <el-input
          v-model.number="form.applyAmount"
          placeholder="请输入申请金额">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="放款机构"
        prop="loanOrg"
        :rules="{required: true, message: '放款机构不能为空'}">
        <el-input
          v-model="form.loanOrg"
          placeholder="请输入放款机构">
        </el-input>
      </el-form-item>
      <el-form-item
        label="放款金额"
        prop="loanAmount"
        :rules="{type: 'number',required: true, message: '放款金额不能为空'}">
        <el-input
          v-model.number="form.loanAmount"
          placeholder="请输入放款金额">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="放款期限"
        prop="loanDeadline"
        :rules="{type: 'number',required: true, message: '放款期限不能为空'}">
        <el-input
          v-model.number="form.loanDeadline"
          placeholder="请输入放款期限">
          <template slot="append">个月</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="放款类型"
        prop="loanType"
        :rules="{type: 'number',required: true, message: '放款类型不能为空'}">
        <el-select
        v-model.number="form.loanType"
        placeholder="请选择放款类型">
          <el-option
            v-for="val,key,index in loanType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="放款日期"
        prop="loanDate"
        :rules="{required: true, message: '放款日期不能为空'}">
        <el-date-picker
          v-model="form.loanDate"
          type="date"
          editable
          @change="loanDateChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="首期还款日期"
        prop="nextRetDate"
        :rules="{required: true, message: '首期还款日期不能为空'}">
        <el-date-picker
          v-model="form.nextRetDate"
          type="date"
          editable
          @change="nextRetDateChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="首期还款金额"
        prop="nextRetAmount"
        :rules="{type: 'number',required: true, message: '首期还款金额不能为空'}">
        <el-input
          v-model.number="form.nextRetAmount"
          placeholder="请输入首期还款金额">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="回款日期"
        prop="feeAmountDate"
        :rules="{required: true, message: '回款日期不能为空'}">
        <el-date-picker
          v-model="form.feeAmountDate"
          type="date"
          editable
          @change="feeAmountDateChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="回款金额"
        prop="feeAmount"
        :rules="{type: 'number', required: true, message: '回款金额不能为空'}">
        <el-input
          v-model.number="form.feeAmount"
          placeholder="请输入回款金额">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="按揭人员"
        prop="anjiePerson"
        :rules="{required: true, message: '按揭人员不能为空'}">
        <el-input
          v-model="form.anjiePerson"
          placeholder="请输入按揭人员">
        </el-input>
      </el-form-item>
      <el-form-item
        label="回款状态"
        prop="status"
        :rules="{type: 'number',required: true, message: '回款状态不能为空'}">
        <el-select
        v-model.number="form.status"
        placeholder="请选择回款状态">
          <el-option
            v-for="val,key,index in status"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="描述"
        prop="recordDesc">
        <el-input
          type="textarea"
          v-model.trim="form.recordDesc">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 回款处理子组件
export default {
  name: 'ret-loan-deal',
  props: {
    value: Boolean,
    applyId: [Number, String],
    customerId: [Number, String],
    newBackInfo: Object
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        applyId: this.applyId,
        customerId: this.customerId,
        applyAmount: '',
        loanOrg: '',
        loanAmount: '',
        loanDeadline: '',
        loanType: '',
        loanDate: '',
        nextRetDate: '',
        nextRetAmount: '',
        feeAmountDate: '',
        feeAmount: '',
        recordDesc: '',
        anjiePerson: '',
        status: ''
      },
      // 放款类型
      loanType: {
        1: '信用贷',
        2: '抵押贷'
      },
      // 回款状态 1未核算- 2-已核算 3-审核失败
      status: {
        1: '未核算',
        2: '已核算',
        3: '审核失败'
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
    customerId (val) {
      this.form.customerId = val
    },
    newBackInfo (obj) {
      this.form = {
        recordId: obj['recordId'] || '',
        applyId: obj['applyId'] || '',
        customerId: obj['customerId'] || '',
        treatyNo: obj['treatyNo'] || '',
        applyAmount: obj['applyAmount'] || '',
        loanOrg: obj['loanOrg'] || '',
        loanAmount: obj['loanAmount'] || '',
        loanDeadline: obj['loanDeadline'] || '',
        loanType: obj['loanType'] || '',
        loanDate: obj['loanDate'] || '',
        nextRetDate: obj['nextRetDate'] || '',
        nextRetAmount: obj['nextRetAmount'] || '',
        feeAmountDate: obj['feeAmountDate'] || '',
        feeAmount: obj['feeAmount'] || '',
        recordDesc: obj['recordDesc'] || '',
        anjiePerson: obj['anjiePerson'] || '',
        status: obj['status'] || ''
      }
    }
  },
  methods: {
    // 改变放款日期
    loanDateChange (date) {
      this.form.loanDate = date
    },
    // 改变首期还款日期
    nextRetDateChange (date) {
      this.form.nextRetDate = date
    },
    // 改变回款日期
    feeAmountDateChange (date) {
      this.form.feeAmountDate = date
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/work/waitDeal/retLoanDeal',
            data: this.form,
            loading: true,
            success: data => {
              this.$emit('change', 'back')
            }
          })
        }
      })
    }
  }
}
</script>
