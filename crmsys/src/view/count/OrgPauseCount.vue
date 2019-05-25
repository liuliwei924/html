<template>
  <org-pauseReal @change="statusChange" v-if="status === 1" />
  <org-pauseHistory @change="statusChange" v-else-if="status === 2" />
</template>

<script>
import OrgPauseReal from '@/components/count/OrgPauseReal'
import OrgPauseHistory from '@/components/count/OrgPauseHistory'
export default {
  name: 'org-pauseCount',
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
    OrgPauseReal,
    OrgPauseHistory
  }
}
</script>
