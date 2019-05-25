<template>
  <dealOrderType-day @change="statusChange" v-if="status === 1" />
  <dealOrderType-month @change="statusChange" v-else-if="status === 2" />
  <dealOrderType-toDay @change="statusChange" v-else />
</template>

<script>
import DealOrderTypeDay from '@/components/count/DealOrderTypeDay'
import DealOrderTypeMonth from '@/components/count/DealOrderTypeMonth'
import DealOrderTypeToDay from '@/components/count/DealOrderTypeToDay'
// 订单状态统计
export default {
  name: 'DealOrderType-count',
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
    DealOrderTypeDay,
    DealOrderTypeMonth,
    DealOrderTypeToDay
  }
}
</script>
