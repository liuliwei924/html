<template>
  <call-day @change="statusChange" v-if="status === 1" />
  <call-month @change="statusChange" v-else-if="status === 2" />
  <call-monthly @change="statusChange" v-else-if="status === 3" />
</template>

<script>
import CallDay from '@/components/count/CallDay'
import CallMonth from '@/components/count/CallMonth'
import CallMonthly from '@/components/count/CallMonthly'
// 总的统计
export default {
  name: 'call-count',
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
    CallDay,
    CallMonth,
    CallMonthly
  }
}
</script>
