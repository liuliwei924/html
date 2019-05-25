<template>
  <div class="trace-record">
    <follow-record v-model="isShow" :applyId="applyId" :bookStatus="bookStatus" :customerId="customerId" :prevOrderStatusVal="prevOrderStatusVal" @change="followChange"></follow-record>
    <el-tabs class="record-box record-wrap mb20 new-tabs-area" v-model="activeTab">
      <el-tab-pane class="clearfix" label="3个月内" name="0"></el-tab-pane>
      <el-tab-pane class="clearfix" label="3-6个月" name="3"></el-tab-pane>
      <el-tab-pane class="clearfix" label="6-9个月" name="6"></el-tab-pane>
    </el-tabs>
    <div class="record-item" v-for="item in recordInfo">
      <div class="record-info">
        <span class="record-name">{{item.name}}</span>于<span class="record-time">{{item.createTime}}</span>
      </div>
      <div class="record-info">更新状态为<span class="record-status">{{handleType[item.handleType]}}</span></div>
      <p class="record-desc">处理描述：{{item.handleDesc}}</p>
    </div>
  </div>
</template>

<script>
import FollowRecord from '@/components/work/FollowRecord'
// 跟踪记录子组件
export default {
  name: 'trace-record',
  props: {
    recordInfo: Array,
    applyId: [Number, String],
    bookStatus: [Number, String],
    customerId: [Number, String],
    preCustLabelValue: [Number, String],
    prevOrderStatusVal: [Number, String]
  },
  data () {
    return {
      handleType: {
        '-1': '客服转门店',
        0: '接单',
        1: '跟进中',
        2: '客户预约',
        3: '签单',
        4: '回款',
        5: '不能做(退单),失败',
        6: '签单办理完成',
        7: '门店退款成功',
        8: '门店退款失败',
        9: '已上门',
        10: '预约未上门',
        11: '签约失败',
        12: '门店回款成功',
        13: '门店回款失败',
        14: '不需要',
        15: '设置专属单',
        16: '取消专属单',
        17: '跟进中继续跟进',
        18: '预约中继续跟进',
        19: '已上门继续跟进',
        20: '签单中继续跟进',
        21: '跟进中:未了解客户',
        22: '已上门待签约',
        23: '已上门签约',
        24: '进件审核中',
        25: '银行已放款',
        26: '银行已拒绝',
        27: '无效客户',
        28: '空号/错号',
        29: '订单回收',
        30: '放弃跟进',
        31: '门店历史数据',
        32: '未上门待签约',
        33: '退单处理',
        34: '新单转门店',
        35: '删除签单及回款',
        36: '删除回款'
      },
      activeTab: '0',
      isShow: false
    }
  },
  watch: {
    activeTab (val) {
      this.$emit('changeDateFlag', val)
      // if (val === 'second' && !this.requestFlag) this.queryDealRecord()
      // if (val === 'three' && !this.requestFlags) this.queryComplaintAndCallRecord()
    }
  },
  methods: {
    addFollowRecord () {
      this.isShow = true
    },
    followChange () {
      this.$emit('change')
    }
  },
  components: {
    FollowRecord
  }
}
</script>

<style lang="less">
.trace-record {
  .new-tabs-area {
    padding-bottom: 20px;
    min-width: 100%;
  }
  .el-tabs__item {
    display: inline-block;
  }
}
</style>