<template>
  <feedback-credit  @change="statusChange" v-if="showStatus === 1" />
  <feedback-insurance @change="statusChange" v-else-if="showStatus === 2" />
  <feedback-loan @change="statusChange" v-else-if="showStatus === 3" />
</template>

<script>
import FeedbackCredit from '@/view/fx/FeedbackCredit'
import FeedbackInsurance from '@/view/fx/FeedbackInsurance'
import FeedbackLoan from '@/view/fx/FeedbackLoan'
export default {
  name: 'feedback-data',
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
    FeedbackCredit,
    FeedbackInsurance,
    FeedbackLoan
  }
}
</script>