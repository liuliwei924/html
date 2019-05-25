<template>
  <three-day @change="statusChange" v-if="status === 1" />
  <three-month @change="statusChange" v-else />
</template>

<script>
import ThreeDay from '@/components/count/ThreeDay'
import ThreeMonth from '@/components/count/ThreeMonth'
// 三手数据页面
export default {
  name: 'three-total',
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
    ThreeDay,
    ThreeMonth
  }
}
</script>
