<template>
  <store-day @change="statusChange" v-if="status === 1" />
  <store-month @change="statusChange" v-else-if="status === 2" />
  <store-toDay @change="statusChange" v-else />
</template>

<script>
import StoreDay from '@/components/count/StoreDay'
import StoreMonth from '@/components/count/StoreMonth'
import StoreToDay from '@/components/count/StoreToDay'
// 四手数据页面
export default {
  name: 'store-count',
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
    StoreDay,
    StoreMonth,
    StoreToDay
  }
}
</script>
