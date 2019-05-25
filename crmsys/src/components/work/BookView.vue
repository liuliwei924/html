<template>
  <div class="record-content">
    <!-- 查看 -->
    <div class="el-form__view">
      <el-table
        class="content__table"
        :data="bookInfo"
        border>
        <el-table-column
          prop="bookTime"
          label="预约上门时间"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="预约人"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="180">
        </el-table-column>
        <el-table-column
        label="预约状态"
        min-width="110">
        <template slot-scope="scope">{{bookStatus[scope.row.bookStatus]}}</template>
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="170">
        <template slot-scope="scope">
          <el-button v-if="scope.row.bookStatus !== 1" type="text" size="small" @click="cancelBooke(scope.row)">取消预约</el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// 预约子组件
export default {
  name: 'book-view',
  props: {
    bookInfo: Array
  },
  data () {
    return {
      bookStatus: {
        0: '预约中',
        1: '已取消',
        2: '预约回访'
      }
    }
  },
  methods: {
    // 取消预约
    cancelBooke (obj) {
      this.$alert('您是否确定取消预约?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/work/applyInfo/cancelBookRecord',
              data: {
                detailId: obj.detailId,
                applyId: obj.applyId
              },
              success: data => {
                this.$emit('cancelHandel')
              }
            })
          }
        }
      })
    }
  }
}
</script>
