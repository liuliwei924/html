<template>
  <fx-activity-record  @change="statusChange" v-if="status === 1" />
  <fx-lottery-record @change="statusChange" v-else-if="status === 2" />
</template>

<script>
import FxActivityRecord from '@/view/fx/FxActivityRecord'
import FxLotteryRecord from '@/view/fx/FxLotteryRecord'
export default {
  name: 'activity-reward',
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
    FxActivityRecord,
    FxLotteryRecord
  }
}
</script>
