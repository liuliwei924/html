<template>
  <handleRecord-day @change="statusChange" v-if="status === 1" />
  <handleRecord-month @change="statusChange" v-else-if="status === 2" />
  <handleRecord-toDay @change="statusChange" v-else />
</template>

<script>
import HandleRecordDay from '@/components/count/HandleRecordDay'
import HandleRecordMonth from '@/components/count/HandleRecordMonth'
import HandleRecordToDay from '@/components/count/HandleRecordToDay'
// 订单状态统计
export default {
  name: 'handleRecord-count',
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
    HandleRecordDay,
    HandleRecordMonth,
    HandleRecordToDay
  }
}
</script>
