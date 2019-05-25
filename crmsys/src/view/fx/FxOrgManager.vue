<template>
  <fx-employee-list  @change="statusChange" v-if="status === 1" />
  <fx-org-list @change="statusChange" v-else-if="status === 2" />
</template>

<script>
import FxEmployeeList from '@/view/fx/FxEmployeeList'
import FxOrgList from '@/view/fx/FxOrgList'
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
    FxEmployeeList,
    FxOrgList
  }
}
</script>
