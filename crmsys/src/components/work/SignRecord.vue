<template>
  <div class="current-status">
    <div class="status-title">签单记录</div>
    <div class="status-item" v-for="item in signData" :key="item.applyId">
      <el-form :inline="true" label-position="left" :model="item">
        <el-form-item label="客户姓名：">{{item.applyName}}</el-form-item>
        <el-form-item label="客户手机：">{{item.telephone}}</el-form-item>
        <el-form-item label="客户身份证号：">{{item.cardNo}}</el-form-item>
        <el-form-item label="签单金额：">{{item.signAmount}}万元</el-form-item>
        <el-form-item label="合同项目：">{{item.treatyName}}</el-form-item>
        <el-form-item label="合同费用类型：">
          <template v-if="item.feeType === 1">固定金额</template>
          <template v-if="item.feeType === 2">按比例</template>
        </el-form-item>
        <el-form-item v-if="item.feeType === 1" label="固定金额">{{item.feeAmount}}元</el-form-item>
        <el-form-item v-if="item.feeType === 2" label="按比例">{{item.feeRate}}%</el-form-item>
        <el-form-item label="收取定金：">{{item.treatyAmount}}元</el-form-item>
        <el-form-item label="预计创收：">{{item.treatyWill}}元</el-form-item>
        <el-form-item label="按揭人员：">{{item.anjiePerson}}</el-form-item>
        <el-form-item label="银行返点：">{{item.bankRetPoint}}%</el-form-item>
        <el-form-item label="累计报销：">{{item.treatyFee}}元</el-form-item>
        <el-form-item label="办理状态：">
          <template v-if="item.status === 1">提交按揭中</template>
          <template v-if="item.status === 2">全部结案</template>
          <template v-if="item.status === 3">已结束</template>
          <template v-if="item.status === 4">无贷款</template>
          <template v-if="item.status === 5">贷款未提交</template>
          <template v-if="item.status === 6">部分结案</template>
        </el-form-item>
        <el-form-item label="签单类型：">
          <template v-if="item.signType === 1">银行</template>
          <template v-if="item.signType === 2">小贷</template>
        </el-form-item>
        <el-form-item label="实际签单时间：">{{item.signTime}}</el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 签单记录组件
export default {
  name: 'sign-record',
  props: {
    signData: Array
  }
}
</script>