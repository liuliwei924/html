<template>
  <fx-pyq-tg  @change="statusChange" v-if="status === 1" />
  <fx-pyq-config @change="statusChange" v-else-if="status === 2" />
</template>

<script>
import FxPyqTg from '@/view/fx/FxPyqTg'
import FxPyqConfig from '@/view/fx/FxPyqConfig'
export default {
  name: 'fx-pyq-poster',
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
    FxPyqTg,
    FxPyqConfig
  }
}
</script>
