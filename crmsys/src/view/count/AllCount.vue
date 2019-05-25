<template>
  <all-day @change="statusChange" v-if="status === 1" />
  <all-month @change="statusChange" v-else-if="status === 2" />
  <all-toDay @change="statusChange" v-else />
</template>

<script>
import AllDay from '@/components/count/AllDay'
import AllMonth from '@/components/count/AllMonth'
import AllToDay from '@/components/count/AllToDay'
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
