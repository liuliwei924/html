<template>
  <fx-source-reg-sum @change="statusChange" v-if="status === 1" />
  <fx-source-apply-sum @change="statusChange" v-else-if="status === 2" />
</template>

<script>
import FxSourceRegSum from '@/components/fx/FxSourceRegSum'
import FxSourceApplySum from '@/components/fx/FxSourceApplySum'
export default {
  name: 'fx-source-count',
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
    FxSourceRegSum,
    FxSourceApplySum
  }
}
</script>
