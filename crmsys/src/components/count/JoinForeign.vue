<template>
  <el-dialog
    class="edit-dialog dialog-w1200"
    title="加入第三方"
    :visible.sync="visible">
    <div class="">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
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
    </el-form>
    </div>
    <div class="join-rows">
      <el-row class="rows-head">
        <el-col :span="2">客户姓名</el-col>
        <el-col :span="2">城市</el-col>
        <el-col :span="2">房产情况</el-col>
        <el-col :span="2">车产情况</el-col>
        <el-col :span="2">保险情况</el-col>
        <el-col :span="3">申请金额(万)</el-col>
        <el-col :span="3">微粒贷额度(元)</el-col>
        <el-col :span="3">芝麻信用分</el-col>
        <el-col :span="2">公积金情况</el-col>
        <el-col :span="2">社保情况</el-col>
        <el-col :span="2">月收入</el-col>
        <el-col :span="2">工资发放形式</el-col>
      </el-row>
      <el-row v-for="row,index in rows" class="rows-body" :key="index">
        <el-col :span="2">{{row.applyName || '----'}}</el-col>
        <el-col :span="2">{{row.cityName || '----'}}</el-col>
        <el-col :span="2"><input type="text" v-model="row.houseType"></el-col>
        <el-col :span="2"><input type="text" v-model="row.carType"></el-col>
        <el-col :span="2"><input type="text" v-model="row.insure"></el-col>
        <el-col :span="3"><input type="text" v-model="row.loanAmount"></el-col>
        <el-col :span="3"><input type="text" v-model="row.haveWeiLi"></el-col>
        <el-col :span="3"><input type="text" v-model="row.zimaScore"></el-col>
        <el-col :span="2"><input type="text" v-model="row.fundType"></el-col>
        <el-col :span="2"><input type="text" v-model="row.socialType"></el-col>
        <el-col :span="2"><input type="text" v-model="row.income"></el-col>
        <el-col :span="2"><input type="text" v-model="row.wagesType"></el-col>
      </el-row>
    </div>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 转信贷经理子组件
export default {
  name: 'join-foreign',
  props: {
    value: Boolean,
    userOrgs: Array,
    externalUser: Array,
    orders: Array,
    joinRows: Array
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        customerId: '',
        orders: ''
      },
      rows: []
    }
  },
  watch: {
    joinRows (val) {
      this.rows = val
    },
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    orders (val) {
      this.form.orders = JSON.stringify(val)
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
            url: '/store/account/work/foreignAllotPond/checkJoinThreeDate',
            data: {
              str: JSON.stringify({orders: this.rows}),
              customerId: this.form.customerId
            },
            loading: true,
            success: data => {
              this.$msg(data.message)
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.join-rows{
  overflow: hidden;
  margin-top: 10px;
  .rows-head{
    background: #f2f2f2;
    line-height: 40px;
  }
  .rows-body{
    line-height: 40px;
  }
  .el-row{
    border-bottom: 1px solid #dcdcdc;
  }
  .el-col-2,.el-col-3{
    text-align: center;
    input{
      width: 92px;
      text-align: center;
      height: 30px;
      border: none;
    }
  }
}
</style>
