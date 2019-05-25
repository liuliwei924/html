<template>
  <fx-poster-cfg  @change="statusChange" v-if="status === 1" />
  <fx-prod-dtl-cfg @change="statusChange" v-else-if="status === 2" />
  <fx-effect-cfg @change="statusChange" v-else-if="status === 3" />
</template>

<script>
import FxPosterCfg from '@/view/fx/FxPosterCfg'
import FxProdDtlCfg from '@/view/fx/FxProdDtlCfg'
import FxEffectCfg from '@/view/fx/FxEffectCfg'
export default {
  name: 'fx-poster',
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
    FxPosterCfg,
    FxProdDtlCfg,
    FxEffectCfg
  }
}
</script>
