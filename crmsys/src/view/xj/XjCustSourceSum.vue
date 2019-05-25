<template>
  <all-toDay @change="statusChange" v-if="status === 1" />
  <all-day @change="statusChange" v-else-if="status === 2" />
  <all-month @change="statusChange" v-else />
</template>

<script>
import AllToDay from '@/components/xj/XjCustSourceSumToday'
import AllDay from '@/components/xj/XjCustSourceSumDay'
import AllMonth from '@/components/xj/XjCustSourceSumMonth'
// 总的统计
export default {
  name: 'all-count',
  data () {
    return {
      status: 1
    }
  },
  methods: {
    // 处理状态改变监听
    statusChange (val) {
      this.status = val
    }
  },
  components: {
    AllToDay,
    AllDay,
    AllMonth
  }
}
</script>
