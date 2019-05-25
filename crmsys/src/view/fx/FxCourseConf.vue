<template>
  <fxCourse-type @change="statusChange" v-if="status === 1" />
  <fxCourse-cfg @change="statusChange" v-else-if="status === 2" />
</template>

<script>
import FxCourseCfg from '@/view/fx/FxCourseCfg'
import FxCourseType from '@/view/fx/FxCourseType'
export default {
  name: 'fx-course-conf',
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
    FxCourseCfg,
    FxCourseType
  }
}
</script>
