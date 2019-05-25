<template>
  <org-day @change="statusChange" v-if="status === 1" />
  <org-month @change="statusChange" v-else-if="status === 2" />
  <org-toDay @change="statusChange" v-else/>
</template>

<script>
import OrgDay from '@/components/count/OrgDay'
import OrgMonth from '@/components/count/OrgMonth'
import OrgToDay from '@/components/count/OrgToDay'
// 门店统计页面
export default {
  name: 'org-count',
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
    OrgDay,
    OrgMonth,
    OrgToDay
  }
}
</script>
