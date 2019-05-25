<template>
  <OrderRate-day @change="statusChange" v-if="status === 1" />
  <OrderRate-month @change="statusChange" v-else-if="status === 2" />
  <OrderRate-toDay @change="statusChange" v-else />
</template>

<script>
import OrderRateDay from '@/components/count/OrderRateDay'
import OrderRateMonth from '@/components/count/OrderRateMonth'
import OrderRateToDay from '@/components/count/OrderRateToDay'
// 订单状态统计
export default {
  name: 'OrderRate-count',
  data () {
    return {
      status: 3
    }
  },
  methods: {
    // 处理状态改变监听
    statusChange (val) {
      this.status = val
    }
  },
  components: {
    OrderRateDay,
    OrderRateMonth,
    OrderRateToDay
  }
}
</script>
