<template>
  <all-day @change="statusChange" v-if="status === 1" />
  <all-month @change="statusChange" v-else-if="status === 2" />
  <all-toDay @change="statusChange" v-else />
</template>

<script>
import AllDay from '@/components/xj/XjCustInfoSumDay'
import AllMonth from '@/components/xj/XjCustInfoSumMonth'
import AllToDay from '@/components/xj/XjCustInfoSumToday'
// 总的统计
export default {
  name: 'all-count',
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
    AllDay,
    AllMonth,
    AllToDay
  }
}
</script>
