<template>
  <div class="current-status">
    <div class="status-title">回款处理记录</div>
    <div class="status-item" v-for="item in backData" :key="item.recordId">
      <el-form :inline="true" label-position="left" :model="item">
        <el-form-item label="申请金额：">{{item.applyAmount}}万元</el-form-item>
        <el-form-item label="放款机构：">{{item.loanOrg}}</el-form-item>
        <el-form-item label="放款金额：">{{item.loanAmount}}万元</el-form-item>
        <el-form-item label="放款期限：">{{item.loanDeadline}}个月</el-form-item>
        <el-form-item label="放款类型：">
          <template v-if="item.loanType === 1">信用贷</template>
          <template v-if="item.loanType === 2">抵押贷</template>
        </el-form-item>
        <el-form-item label="放款日期：">{{item.loanDate}}</el-form-item>
        <el-form-item label="首期还款日期：">{{item.nextRetDate}}</el-form-item>
        <el-form-item label="首期还款金额：">{{item.nextRetAmount}}元</el-form-item>
        <el-form-item label="回款日期：">{{item.feeAmountDate}}</el-form-item>
        <el-form-item label="回款金额：">{{item.feeAmount}}元</el-form-item>
        <el-form-item label="按揭人员：">{{item.anjiePerson}}</el-form-item>
        <el-form-item label="描述：">{{item.recordDesc}}</el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 回款记录组件
export default {
  name: 'back-record',
  props: {
    backData: Array
  }
}
</script>
