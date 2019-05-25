<template>
  <div class="xjCoinSum">
    <div class="tips">{{`昨天发放量：${yesterSendCoin}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最近一周发放量：${weekSendCoin}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总发放量：${totalsendCoin}&nbsp;&nbsp;&nbsp;&nbsp;总回收量：${decreaseCoin}`}}</div>
    <all-day @change="statusChange" v-if="status === 1" />
    <all-month @change="statusChange" v-else-if="status === 2" />
    <all-toDay @change="statusChange" v-else />
  </div>
</template>

<script>
import AllDay from '@/components/xj/XjCoinSumDay'
import AllMonth from '@/components/xj/XjCoinSumMonth'
import AllToDay from '@/components/xj/XjCoinSumToday'
// 总的统计
export default {
  name: 'all-count',
  data () {
    return {
      status: 3,
      totalsendCoin: '',
      weekSendCoin: '',
      yesterSendCoin: '',
      decreaseCoin: ''
    }
  },
  created () {
    this.$ajax({
      url: '/store/account/xj/xjCoinSum/queryConin',
      data: '',
      loading: true,
      success: data => {
        this.totalsendCoin = data.rows[0].totalsendCoin
        this.weekSendCoin = data.rows[0].weekSendCoin
        this.yesterSendCoin = data.rows[0].yesterSendCoin
        this.decreaseCoin = data.rows[0].decreaseCoin
      }
    })
  },
  methods: {
    // 处理状态改变监听
    statusChange (val) {
      this.status = val
    }
  },
  components: {
    AllDay,
    AllMonth,
    AllToDay
  }
}
</script>

<style lang="less">
.xjCoinSum {
  position: relative;
  .tips {
    position: absolute;
    left: 341px;
    top: -2px;
    font-size: 15px;
  }
  .content-box {
    padding-top: 0;
  }
}
</style>
