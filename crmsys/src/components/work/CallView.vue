<template>
  <div class="record-content">
    <!-- 查看 -->
    <div class="el-form__view">
      <el-table
        class="content__table"
        :data="callRecord"
        border>
        <el-table-column
          prop="realName"
          label="业务员"
          min-width="125">
        </el-table-column>
        <el-table-column
          prop="startCallTime"
          label="开始通话时间"
          min-width="170">
        </el-table-column>
        <el-table-column
          prop="endCallTime"
          label="结束通话时间"
          min-width="170">
        </el-table-column>
        <el-table-column
          label="通话时长"
          min-width="110">
          <template slot-scope="scope">
            <span>{{secondToDate(scope.row.duration)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="主被叫类型"
          min-width="110">
          <template slot-scope="scope">{{callType[scope.row.callType]}}</template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="上传时间"
          min-width="170">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// 预约子组件
export default {
  name: 'call-view',
  props: {
    callRecord: Array,
    applyId: [Number, String],
    customerId: [Number, String]
  },
  data () {
    return {
      status: {
        0: '未匹配',
        1: '匹配成功',
        2: '匹配失败'
      },
      callType: {
        1: '主叫',
        2: '被叫'
      },
      num: 0
    }
  },
  methods: {
    secondToDate (val) {
      let result = ''
      let minute = Math.floor(val / 60)
      let second = val % 60
      if (minute > 0 && second === 0) {
        result = minute + '分钟'
      } else if (minute > 0 && second > 0) {
        result = minute + '分钟' + second + '秒'
      } else if (minute === 0 && second > 0) {
        result = second + '秒'
      } else {
        result = '0秒'
      }
      return result
    }
  }
}
</script>
