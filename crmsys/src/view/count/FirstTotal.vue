<template>
  <first-day @change="statusChange" v-if="status === 1" />
  <first-month @change="statusChange" v-else />
</template>

<script>
import FirstDay from '@/components/count/FirstDay'
import FirstMonth from '@/components/count/FirstMonth'
// 一手数据页面
export default {
  name: 'first-total',
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
    FirstDay,
    FirstMonth
  }
}
</script>
