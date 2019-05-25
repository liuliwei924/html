<template>
  <el-dialog
    class="edit-dialog double-dialog"
    title="签单处理"
    :visible.sync="visible">
    <el-form
      class="clearfix"
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="客户姓名"
        prop="applyName"
        :rules="{required: true, message: '客户姓名不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.applyName"
          placeholder="请输入客户姓名">
        </el-input>
      </el-form-item>
      <el-form-item
        label="客户手机"
        prop="telephone">
        <!-- :rules="[{required: true, message: '手机号格式有误',trigger: 'blur'}, {validator: (rule, value, callback) => {/^1[34578]\d{9}$/.test(value) ? callback() : callback('手机号码格式不正确')}, trigger: 'blur'}]" -->
        <el-input
          v-model.number="form.telephone"
          placeholder="请输入客户手机" :maxlength="11">
        </el-input>
      </el-form-item>
      <el-form-item
        label="客户身份证号"
        prop="cardNo"
        :rules="[{required: true, message: '客户身份证号不能为空',trigger: 'blur'}, {validator: (rule, value, callback) => {/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) ? callback() : callback('身份证号不正确')},trigger: 'blur'}]">
        <el-input
          v-model="form.cardNo"
          placeholder="请输入客户身份证号" :maxlength="18">
        </el-input>
      </el-form-item>
      <el-form-item
        label="签单金额"
        prop="signAmount"
        :rules="{type: 'number',required: true, message: '签单金额不能为空',trigger: 'blur'}">
        <el-input
          v-model.number="form.signAmount"
          placeholder="请输入签单金额">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="合同项目"
        prop="treatyName"
        :rules="{required: true, message: '合同项目不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.treatyName"
          placeholder="请输入合同项目">
        </el-input>
      </el-form-item>
      <el-form-item
        label="合同费用类型"
        prop="feeType"
        :rules="{type: 'number',required: true, message: '合同费用类型不能为空',trigger: 'change'}">
        <el-radio-group
          v-model.number="form.feeType"
          placeholder="请选择合同费用类型">
          <el-radio
            v-for="val,key,index in feeType"
            :label="Number(key)"
            :key="index">{{val}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="固定金额"
        prop="feeAmount"
        :rules="{type: 'number', required: true, message: '固定金额不能为空',trigger: 'blur'}"
        v-if="form.feeType === 1">
        <el-input
          v-model.number="form.feeAmount"
          placeholder="请输入固定金额">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
       <el-form-item
         label="按比例"
         prop="feeRate"
         :rules="{type: 'number',required: true, min: 0,max: 100, message: '比例不能为空',trigger: 'blur'}"
         v-if="form.feeType === 2">
        <el-input
          v-model.number="form.feeRate"
          placeholder="请输入比例">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="收取定金"
        prop="treatyAmount"
        :rules="{type: 'number', required: true, message: '收取定金不能为空',trigger: 'blur'}">
        <el-input
          v-model.number="form.treatyAmount"
          placeholder="请输入收取定金">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="预计创收"
        prop="treatyWill"
        :rules="{type: 'number', required: true, message: '预计创收不能为空',trigger: 'blur'}">
        <el-input
          v-model.number="form.treatyWill"
          placeholder="请输入预计创收">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="按揭人员"
        prop="anjiePerson">
        <el-input
          v-model="form.anjiePerson"
          placeholder="请输入按揭人员">
        </el-input>
      </el-form-item>
      <el-form-item
        label="银行返点"
        prop="bankRetPoint">
        <el-input
          v-model.number="form.bankRetPoint"
          placeholder="请输入银行返点">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="累计报销"
        prop="treatyFee">
        <el-input
          v-model.number="form.treatyFee"
          placeholder="请输入累计报销">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="签单类型"
        prop="signType"
        :rules="{type: 'number', required: true, message: '签单类型不能为空',trigger: 'change'}">
        <el-select
          v-model.number="form.signType"
          placeholder="请选择签单类型">
          <el-option
            v-for="val,key,index in signType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="签单时间"
        prop="signTime">
        <el-date-picker
          v-model="form.signTime"
          type="datetime"
          editable
          @change="signTimeChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="办理状态"
        prop="status"
        :rules="{type: 'number', required: true, message: '办理状态不能为空',trigger: 'change'}">
        <el-select
          v-model.number="form.status"
          placeholder="请选择办理状态">
          <el-option
            v-for="val,key,index in status"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.status === 2"
        label="签约失败原因"
        prop="failureCause">
        <el-select
          v-model.number="form.failureCause"
          placeholder="请选择签单失败原因">
          <el-option
            v-for="val,key,index in failureCause"
            :label="val"
            :value="String(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 签单处理子组件
export default {
  name: 'sign-deal',
  props: {
    value: Boolean,
    applyId: [Number, String],
    customerId: [Number, String],
    signInfo: Object
  },
  data () {
    let userRole = this.$localStorage('userRole') === '1'
    return {
      userRole,
      visible: this.value,
      loading: false,
      form: {
        applyId: this.applyId,
        customerId: this.customerId,
        treatyNo: '',
        applyName: '',
        telephone: '',
        cardNo: '',
        signAmount: '',
        treatyName: '',
        feeType: 1,
        feeAmount: '',
        feeRate: '',
        treatyAmount: '',
        treatyWill: '',
        anjiePerson: '',
        bankRetPoint: '',
        treatyFee: '',
        signTime: '',
        signType: 1,
        status: 1
      },
      // 合同费用类型
      feeType: {
        1: '固定金额',
        2: '按比例'
      },
      // 办理状态
      status: {
        1: '提交按揭中',
        2: '结案',
        5: '贷款未提交'
      },
      // 签单类型
      signType: {
        1: '银行',
        2: '小额'
      },
      // 退单失败原因
      failureCause: {
        '大数据检测未通过': '大数据检测未通过',
        '征信体现不了/查询次数多': '征信体现不了/查询次数多',
        '历史或当前逾期': '历史或当前逾期',
        '负债过高': '负债过高',
        '网贷太多/小额笔数多': '网贷太多/小额笔数多',
        '系统综合评级不足': '系统综合评级不足',
        '门拒/电核不通过': '门拒/电核不通过',
        '利息高不接受/额度低不接受/客户自行取消': '利息高不接受/额度低不接受/客户自行取消',
        '禁入行业/同行已操作': '禁入行业/同行已操作'
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    customerId (val) {
      this.customerId = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    signInfo (obj) {
      this.form = {
        applyId: this.applyId,
        customerId: this.customerId,
        treatyNo: obj['treatyNo'] || '',
        applyName: obj['applyName'] || '',
        telephone: obj['telephone'] || '',
        cardNo: obj['cardNo'] || '',
        signAmount: obj['signAmount'] || '',
        treatyName: obj['treatyName'] || '',
        feeType: obj['feeType'] || 1,
        feeAmount: obj['feeAmount'] || '',
        feeRate: obj['feeRate'] || '',
        treatyAmount: obj['treatyAmount'] || '',
        treatyWill: obj['treatyWill'] || '',
        anjiePerson: obj['anjiePerson'] || '',
        bankRetPoint: obj['bankRetPoint'] || '',
        treatyFee: obj['treatyFee'] || '',
        signType: obj['signType'] || 1,
        signTime: obj['signTime'] || '',
        status: obj['status'] || 1,
        failureCause: obj['failureCause'] || ''
      }
    }
  },
  methods: {
    // 时间改变赋值
    signTimeChange (date) {
      this.form.signTime = date
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      if (this.form.status !== 2) {
        this.form.failureCause = ''
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/work/waitDeal/signDeal',
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
