<template>
  <fx-recard-cfg  @change="statusChange" v-if="showStatus === 1" />
  <fx-referer-cfg @change="statusChange" v-else-if="showStatus === 2" />
  <fx-grade-cfg @change="statusChange" v-else-if="showStatus === 3" />
  <fx-bill-cfg @change="statusChange" v-else-if="showStatus === 4" />
</template>

<script>
import FxRecardCfg from '@/view/fx/FxRecardCfg'
import FxRefererCfg from '@/view/fx/FxRefererCfg'
import FxGradeCfg from '@/view/fx/FxGradeCfg'
import FxBillCfg from '@/view/fx/FxBillCfg'
export default {
  name: 'fx-referer',
  data () {
    return {
      showStatus: 1
    }
  },
  methods: {
    // 处理状态改变监听
    statusChange (val) {
      this.showStatus = val
    }
  },
  components: {
    FxRecardCfg,
    FxRefererCfg,
    FxGradeCfg,
    FxBillCfg
  }
}
</script>
