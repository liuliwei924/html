<template>
  <orgDealOrder-day @change="statusChange" v-if="status === 1" />
  <orgDealOrder-month @change="statusChange" v-else-if="status === 2" />
  <orgDealOrder-today @change="statusChange" v-else />
</template>

<script>
import OrgDealOrderDay from '@/components/count/OrgDealOrderDay'
import OrgDealOrderMonth from '@/components/count/OrgDealOrderMonth'
import OrgDealOrderToday from '@/components/count/OrgDealOrderToday'
// 订单状态统计
export default {
  name: 'OrgDealOrder-count',
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
    OrgDealOrderDay,
    OrgDealOrderMonth,
    OrgDealOrderToday
  }
}
</script>
