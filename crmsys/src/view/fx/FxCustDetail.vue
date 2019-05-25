<template>
  <div class="content-box active-main fxCustDetail">
    <div class="header__title">详情</div>
    <div>
      <el-tabs class="kf-pane-wrap" v-model="activePane">
        <el-tab-pane label="基本信息" name="first">
          <fxBase-info v-if="paneObj['first']" />
        </el-tab-pane>
        <el-tab-pane label="资金记录" name="second">
          <fxReward-record v-if="paneObj['second']" />
        </el-tab-pane>
        <el-tab-pane label="提现记录" name="third">
          <fxWithdraw-record v-if="paneObj['third']" />
        </el-tab-pane>
        <el-tab-pane label="锁粉记录" name="fourth">
          <fxFans-record v-if="paneObj['fourth']" />
        </el-tab-pane>
        <el-tab-pane label="推荐申请记录" name="five">
          <fxApply-record v-if="paneObj['five']" />
        </el-tab-pane>
        <el-tab-pane label="核卡记录" name="six">
          <fxFeedBack-record v-if="paneObj['six']" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import FxBaseInfo from '@/components/fx/FxBaseInfo'
import FxRewardRecord from '@/components/fx/FxRewardRecord'
import FxWithdrawRecord from '@/components/fx/FxWithdrawRecord'
import FxFansRecord from '@/components/fx/FxFansRecord'
import FxApplyRecord from '@/components/fx/FxApplyRecord'
import FxFeedBackRecord from '@/components/fx/FxFeedBackRecord'
export default {
  name: 'fxCust-detail',
  data () {
    return {
      activePane: 'first',
      paneObj: {
        first: true,
        second: false,
        third: false,
        fourth: false,
        five: false,
        six: false
      }
    }
  },
  watch: {
    activePane (val) {
      if (!this.paneObj[val]) this.paneObj[val] = true
    }
  },
  components: {
    FxBaseInfo,
    FxRewardRecord,
    FxWithdrawRecord,
    FxFansRecord,
    FxApplyRecord,
    FxFeedBackRecord
  }
}
</script>

<style lang="less">
.fxCustDetail {
  .kf-pane-wrap {
    .el-tabs__item {
      padding: 0 32px;
    }
  }
  .kf-pane-box {
    width: 420px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
    margin-right: 20px;
    margin-bottom: 20px;
    display: inline-block;
    vertical-align: top;
  }
  .kf-pane-head {
    height: 40px;
    line-height: 40px;
    color: #fff;
    padding-left: 10px;
    margin: -1px -1px 20px -1px;
  }
  .kf-pane-head1 {
    margin-bottom: 0;
  }
  .kf-pane-head.ph1 {
    background: #5fbad1;
  }
  .kf-pane-head.ph2 {
    background: #44454a;
  }
  .kf-pane-head.ph3 {
    background: #c5ab6b;
  }
  .kf-pane-head.ph4 {
    background: #3ebd7f;
  }
  .kf-pane-box .el-form-item {
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    box-sizing: border-box;
  }
  .kf-pane-box .pane-item {
    line-height: 40px;
    padding: 0 10px;
  }
  .kf-pane-box .pane-item .label{
    float: left;
    width: 120px;
    color: #999;
  }
  .kf-pane-box .pane-item .text{
    margin-left: 120px;
    color: #33D;
  }
  .kf-pane-box .pane-item:nth-child(2n) {
    background: #ededed;
  }
}
</style>