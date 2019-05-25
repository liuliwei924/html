<template>
  <el-dialog class="edit-dialog notify-dialog" title="通知信息" :visible.sync="visible" @close="close">
    <el-radio-group v-model="radio">
      <el-radio-button :label="1">未读通知</el-radio-button>
      <el-radio-button :label="2">已读通知</el-radio-button>
    </el-radio-group>
    <div class="notify-item clearfix" v-show="radio === 1">
      <el-button class="read-btn" @click="readHandle">设为已读</el-button>
      <el-table
        :data="tableData"
        border
        @selection-change="selectChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="siNotifyTime"
          label="时间"
          min-width="150">
        </el-table-column>
        <el-table-column
          label="描述"
          min-width="200">
          <template slot-scope="scope">{{scope.row.applyName}} {{scope.row.typeText}}通知</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detailHandle(scope.row.applyId, scope.row.notifyId)">详情</el-button>
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
    <div class="notify-item clearfix" v-show="radio === 2">
      <el-table
        :data="table"
        border>
        <el-table-column
          prop="siNotifyTime"
          label="时间"
          min-width="150">
        </el-table-column>
        <el-table-column
          label="描述"
          min-width="200">
          <template slot-scope="scope">{{scope.row.applyName}} {{scope.row.typeText}}通知</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detailHandle(scope.row.applyId)">详情</el-button>
          </template>
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
    <div slot="footer">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
let flag = false
export default {
  name: 'notify',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      radio: 1,
      notifyIds: [],
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      table: [],
      page: 1,
      record: 1
    }
  },
  watch: {
    value (val) {
      if (val) this.radio === 1 ? this.notifyList() : this.notifiedList()
      this.visible = flag = val
    },
    radio (val) {
      this.getNotify()
    }
  },
  created () {
    this.timerNotify()
  },
  methods: {
    detailHandle (applyId, notifyId) {
      this.$router.push({
        path: 'workDetail',
        query: {
          applyId: applyId
        }
      })
      if (notifyId) {
        this.$ajax({
          url: '/store/account/user/notify/dealNotify',
          data: {
            notifyIds: notifyId
          },
          success: data => {
            console.log('此消息已读')
          }
        })
      }
      this.close()
      if (this.$route.name === 'WorkDetail') {
        this.$router.go(0)
      }
    },
    getNotify () {
      if (flag) {
        flag = false
        this.radio === 1 ? this.notifyList() : this.notifiedList()
      }
    },
    timerNotify () {
      this.notifyList()
      this.notifiedList()
    },
    notifyList () {
      this.$ajax({
        url: '/store/account/user/notify/queryNotifyList',
        data: {
          currentPage: this.currentPage
        },
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = this.$parent.notifyNum = data.page.totalRecords
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
    },
    // table表格选择
    selectChange (rows) {
      let notifyIds = []
      rows.forEach(item => {
        notifyIds.push(item['notifyId'])
      })
      this.notifyIds = notifyIds
    },
    readHandle () {
      if (!this.notifyIds.length) this.$msg('请至少选择一条记录!')
      else {
        this.$ajax({
          url: '/store/account/user/notify/dealNotify',
          data: {
            notifyIds: this.notifyIds.join(',')
          },
          success: data => {
            flag = true
            this.notifyList()
          }
        })
      }
    },
    // 关闭
    close () {
      this.$emit('input', false)
    }
  }
}
</script>
