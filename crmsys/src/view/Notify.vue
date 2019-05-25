<template>
  <div class="content-box">
    <div class="header__title">通知信息</div>
    <div class="notify-box clearfix">
      <div class="notify-item fl">
        <div class="notify-title">未读通知</div>
        <el-table
          :data="tableData"
          border>
          <el-table-column
            prop="notifyId"
            label="通知编号"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="applyId"
            label="申请编号"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="applyName"
            label="申请人"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="typeText"
            label="通知类型"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="notifyTime"
            label="通知时间"
            sortable
            min-width="180">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="notityHandle(scope.row.notifyId)">我知道了</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="content__page fr"
          @current-change="pageHandle"
          :current-page="currentPage"
          layout="total, prev, pager, next"
          :total="totalRecord">
        </el-pagination>
      </div>
      <div class="notify-item fl">
        <div class="notify-title">已读通知</div>
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="notifyId"
            label="通知编号"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="applyId"
            label="申请编号"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="applyName"
            label="申请人"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="typeText"
            label="通知类型"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="notifyTime"
            label="通知时间"
            sortable
            min-width="180">
          </el-table-column>
        </el-table>
        <el-pagination
          class="content__page fr"
          @current-change="pageChange"
          :current-page="page"
          layout="total, prev, pager, next"
          :total="record">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notify',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      table: [],
      page: 1,
      record: 1
    }
  },
  created () {
    this.notifyList()
    this.notifiedList()
  },
  methods: {
    notityHandle (notifyId) {
      this.$ajax({
        url: '/store/account/user/notify/dealNotify',
        data: {
          notifyId
        },
        success: data => {
          this.notifyList()
          this.notifiedList()
        }
      })
    },
    notifyList () {
      this.$ajax({
        url: '/store/account/user/notify/queryNotifyList',
        data: {
          currentPage: this.currentPage
        },
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    notifiedList () {
      this.$ajax({
        url: '/store/account/user/notify/queryOldNotifyList',
        data: {
          currentPage: this.page
        },
        success: data => {
          this.table = data.rows || []
          this.record = data.page.totalRecords
        }
      })
    },
    pageHandle (page) {
      this.currentPage = page
      this.notifyList()
    },
    pageChange (page) {
      this.page = page
      this.notifiedList()
    }
  }
}
</script>