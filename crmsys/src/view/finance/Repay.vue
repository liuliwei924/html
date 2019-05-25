<template>
  <div class="content-box">
    <div class="header__title">还款记录</div>
    <el-tabs class="record-box" v-model="activeTab">
      <el-tab-pane label="还款记录" name="first">
        <repay-record />
      </el-tab-pane>
      <el-tab-pane label="代扣记录" name="second">
        <withhold-record />
      </el-tab-pane>
      <el-tab-pane label="代付记录" name="third">
        <pay-record />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RepayRecord from '@/components/finance/RepayRecord'
import WithholdRecord from '@/components/finance/WithholdRecord'
import PayRecord from '@/components/finance/PayRecord'
export default {
  name: 'repay',
  data () {
    return {
      activeTab: 'first'
    }
  },
  components: {
    RepayRecord,
    WithholdRecord,
    PayRecord
  }
}
</script>
