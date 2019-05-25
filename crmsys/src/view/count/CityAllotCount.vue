<template>
  <cityAllot-day @change="statusChange" v-if="status === 1" />
  <cityAllot-week @change="statusChange" v-else-if="status === 2" />
  <cityAllot-month @change="statusChange" v-else />
</template>

<script>
import CityAllotDay from '@/components/count/CityAllotDay'
import CityAllotWeek from '@/components/count/CityAllotWeek'
import CityAllotMonth from '@/components/count/CityAllotMonth'
// 四手数据页面
export default {
  name: 'cityAllot-count',
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
    CityAllotDay,
    CityAllotWeek,
    CityAllotMonth
  }
}
</script>
