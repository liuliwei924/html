<template>
  <WzCard-day @change="statusChange" v-if="status === 1" />
  <WzCard-month @change="statusChange" v-else-if="status === 2" />
  <WzCard-today @change="statusChange" v-else />
</template>

<script>
import WzCardDay from '@/components/wz/WzCardDay'
import WzCardMonth from '@/components/wz/WzCardMonth'
import WzCardToday from '@/components/wz/WzCardToday'
// 订单状态统计
export default {
  name: 'WzCard-count',
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
    WzCardDay,
    WzCardMonth,
    WzCardToday
  }
}
</script>
