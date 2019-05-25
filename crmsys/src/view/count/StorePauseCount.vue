<template>
  <store-pauseReal @change="statusChange" v-if="status === 1" />
  <store-pauseHistory @change="statusChange" v-else-if="status === 2" />
</template>

<script>
import StorePauseReal from '@/components/count/StorePauseReal'
import StorePauseHistory from '@/components/count/StorePauseHistory'
export default {
  name: 'store-pauseCount',
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
    StorePauseReal,
    StorePauseHistory
  }
}
</script>
