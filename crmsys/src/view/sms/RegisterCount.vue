<template>
  <registerCount-month @change="statusChange" v-if="status === 2" />
  <registerCount-day @change="statusChange" v-else />
</template>

<script>
import registerCountDay from '@/components/sms/RegisterCountDay'
import registerCountMonth from '@/components/sms/RegisterCountMonth'
// 四手数据页面
export default {
  name: 'registercount',
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
    registerCountDay,
    registerCountMonth
  }
}
</script>
