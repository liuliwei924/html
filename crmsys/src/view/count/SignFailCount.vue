<template>
  <signFail-day @change="statusChange" v-if="status === 1" />
  <signFail-month @change="statusChange" v-else-if="status === 2" />
  <signFail-today @change="statusChange" v-else />
</template>

<script>
import SignFailDay from '@/components/count/SignFailDay'
import SignFailMonth from '@/components/count/SignFailMonth'
import SignFailToday from '@/components/count/SignFailToday'
// 订单状态统计
export default {
  name: 'SignFail-count',
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
    SignFailDay,
    SignFailMonth,
    SignFailToday
  }
}
</script>
