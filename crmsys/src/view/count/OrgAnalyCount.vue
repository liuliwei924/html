<template>
  <orgAnaly-Day @change="statusChange" v-if="status === 1" />
  <orgAnaly-month @change="statusChange" v-else-if="status === 2" />
  <orgAnaly-Week @change="statusChange" v-else/>
</template>

<script>
import OrgAnalyWeek from '@/components/count/OrgAnalyWeek'
import OrgAnalyMonth from '@/components/count/OrgAnalyMonth'
import OrgAnalyDay from '@/components/count/OrgAnalyDay'
// 城市分析统计页面
export default {
  name: 'orgAnaly-count',
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
    OrgAnalyWeek,
    OrgAnalyMonth,
    OrgAnalyDay
  }
}
</script>
