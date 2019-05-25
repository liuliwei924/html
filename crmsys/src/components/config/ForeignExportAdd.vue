<template>
  <el-dialog class="edit-dialog" title="添加对外导出配置" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="外部渠道人员:"
        :rules="{required: true, message: '外部渠道人员不能为空'}">
        <el-select
          v-model="form.customerId"
          filterable
          placeholder="请选择外部渠道人员">
          <el-option
            v-for="item,index in externalUser"
            :label="item.realName"
            :value="item.customerId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房产情况" prop="houseType" :rules="{required: false, message: '房产情况不能为空'}">
        <el-input v-model="form.houseType" placeholder="请输入房产情况"></el-input>
      </el-form-item>
      <el-form-item label="车产情况" prop="carType" :rules="{required: false, message: '车产情况不能为空'}">
        <el-input v-model="form.carType" placeholder="请输入车产情况"></el-input>
      </el-form-item>
      <el-form-item label="保险情况" prop="insure" :rules="{required: false, message: '保险情况不能为空'}">
        <el-input v-model="form.insure" placeholder="请输入保险情况"></el-input>
      </el-form-item>
      <el-form-item label="申请金额(万元)" prop="loanAmount" :rules="{required: false, message: '申请金额不能为空'}">
        <el-input v-model="form.loanAmount" placeholder="请输入申请金额"></el-input>
      </el-form-item>
      <el-form-item label="微粒贷(元)" prop="havePinan" :rules="{required: false, message: '微粒贷不能为空'}">
        <el-input v-model="form.havePinan" placeholder="请输入微粒贷"></el-input>
      </el-form-item>
      <el-form-item label="公积金" prop="fundType" :rules="{required: false, message: '公积金不能为空'}">
        <el-input v-model="form.fundType" placeholder="请输入公积金"></el-input>
      </el-form-item>
      <el-form-item label="社保情况" prop="socialType" :rules="{required: false, message: '社保情况不能为空'}">
        <el-input v-model="form.socialType" placeholder="请输入社保情况"></el-input>
      </el-form-item>
      <el-form-item label="月收入" prop="incomeData" :rules="{required: false, message: '月收入不能为空'}">
        <el-input v-model="form.incomeData" placeholder="请输入月收入"></el-input>
      </el-form-item>
      <el-form-item label="工资发放形式" prop="wagesType" :rules="{required: false, message: '工资发放形式不能为空'}">
        <el-input v-model="form.wagesType" placeholder="请输入工资发放形式"></el-input>
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
  name: 'foreignExport-add',
  props: {
    value: Boolean,
    externalUser: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        customerId: '',
        houseType: '',
        carType: '',
        insure: '',
        loanAmount: '',
        havePinan: '',
        fundType: '',
        socialType: '',
        wagesType: '',
        incomeData: ''
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
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/config/foreignExportConf/addForeginExport',
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
