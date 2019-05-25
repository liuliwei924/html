<template>
  <el-dialog class="width900" title="经手记录" v-model="visible">
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="recordData"
      border>
      <el-table-column
        prop="hanleName"
        label="经手人"
        width="150">
      </el-table-column>
      <el-table-column
        label="经手类型"
        width="200">
        <template slot-scope="scope">{{orderType[scope.row.orderType]}}</template>
      </el-table-column>
      <el-table-column
        prop="handleTypeText"
        label="当前状态"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="handleTime"
        label="经手时间">
      </el-table-column>
    </el-table>
    <div class="btn-dialog-group text-center">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'handle-record',
  // 父组件传递参数
  props: {
    value: Boolean,
    applyId: [Number, String],
    orderType: Object
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      recordData: []
    }
  },
  watch: {
    // 监听父组件传递的参数变化
    value (val) {
      this.visible = val
    },
    // 弹窗显示改变传递给父组件
    visible (val) {
      this.$emit('change', val)
    },
    // 监听applyId重新获取数据
    applyId (val) {
      this.queryRecord(val)
    }
  },
  methods: {
    // 查询经手记录收据
    queryRecord (applyId) {
      this.$ajax({
        url: '/store/account/work/waitDeal/queryHandleRecord',
        data: {
          applyId
        },
        loading: true,
        success: data => {
          this.recordData = data.rows || []
        }
      })
    },
    // 弹窗关闭
    close () {
      this.visible = false
    }
  }
}
</script>
