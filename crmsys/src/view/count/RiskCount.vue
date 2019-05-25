<template>
  <risk-day @change="statusChange" v-if="status === 1" />
  <risk-month @change="statusChange" v-else-if="status === 2" />
  <risk-toDay @change="statusChange" v-else />
</template>

<script>
import RiskDay from '@/components/count/RiskDay'
import RiskMonth from '@/components/count/RiskMonth'
import RiskToDay from '@/components/count/RiskToDay'
// 风控统计
export default {
  name: 'risk-count',
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
    RiskDay,
    RiskMonth,
    RiskToDay
  }
}
</script>
