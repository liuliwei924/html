<template>
  <four-day @change="statusChange" v-if="status === 1" />
  <four-month @change="statusChange" v-else />
</template>

<script>
import FourDay from '@/components/count/FourDay'
import FourMonth from '@/components/count/FourMonth'
// 四手数据页面
export default {
  name: 'four-total',
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
    FourDay,
    FourMonth
  }
}
</script>
