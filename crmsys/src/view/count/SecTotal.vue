<template>
  <sec-day @change="statusChange" v-if="status === 1" />
  <sec-month @change="statusChange" v-else />
</template>

<script>
import SecDay from '@/components/count/SecDay'
import SecMonth from '@/components/count/SecMonth'
// 二手数据页面
export default {
  name: 'sec-total',
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
    SecDay,
    SecMonth
  }
}
</script>
