<template>
  <fx-total-credit-count  @change="statusChange" v-if="showStatus === 1" />
  <fx-total-ins-count @change="statusChange" v-else-if="showStatus === 2" />
  <fx-total-loan-count @change="statusChange" v-else-if="showStatus === 3" />
</template>

<script>
import FxTotalCreditCount from '@/view/fx/FxTotalCreditCount'
import FxTotalInsCount from '@/view/fx/FxTotalInsCount'
import FxTotalLoanCount from '@/view/fx/FxTotalLoanCount'
export default {
  name: 'fx-total-count',
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
    FxTotalCreditCount,
    FxTotalInsCount,
    FxTotalLoanCount
  }
}
</script>