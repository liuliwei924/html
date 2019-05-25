<template>
  <OrgCall-day @change="statusChange" v-if="status === 1" />
  <OrgCall-month @change="statusChange" v-else-if="status === 2" />
  <OrgCall-today @change="statusChange" v-else />
</template>

<script>
import OrgCallDay from '@/components/count/OrgCallDay'
import OrgCallMonth from '@/components/count/OrgCallMonth'
import OrgCallToday from '@/components/count/OrgCallToday'
// 订单状态统计
export default {
  name: 'OrgCall-count',
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
    OrgCallDay,
    OrgCallMonth,
    OrgCallToday
  }
}
</script>
