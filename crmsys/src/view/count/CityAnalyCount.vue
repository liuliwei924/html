<template>
  <cityAnaly-Day @change="statusChange" v-if="status === 1" />
  <cityAnaly-month @change="statusChange" v-else-if="status === 2" />
  <cityAnaly-Week @change="statusChange" v-else/>
</template>

<script>
import CityAnalyWeek from '@/components/count/CityAnalyWeek'
import CityAnalyMonth from '@/components/count/CityAnalyMonth'
import CityAnalyDay from '@/components/count/CityAnalyDay'
// 城市分析统计页面
export default {
  name: 'cityAnaly-count',
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
    CityAnalyWeek,
    CityAnalyMonth,
    CityAnalyDay
  }
}
</script>
