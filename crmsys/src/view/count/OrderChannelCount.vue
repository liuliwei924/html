<template>
  <orderChannel-day @change="statusChange" v-if="status === 1" />
  <orderChannel-month @change="statusChange" v-else-if="status === 2" />
  <orderChannel-Today @change="statusChange" v-else />
</template>

<script>
import OrderChannelDay from '@/components/count/OrderChannelDay'
import OrderChannelMonth from '@/components/count/OrderChannelMonth'
import OrderChannelToday from '@/components/count/OrderChannelToday'
// 订单状态统计
export default {
  name: 'OrderChannel-count',
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
    OrderChannelDay,
    OrderChannelMonth,
    OrderChannelToday
  }
}
</script>
