<template>
  <el-dialog class="edit-dialog notify-dialog" title="订单详细信息" :visible.sync="visible" @close="close">
    <el-table
      :data="tableData"
      border>
      <el-table-column
        prop="applyName"
        label="客户姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="客户手机"
        min-width="130">
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
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <div slot="footer">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'orderDealType-detail',
  props: {
    value: Boolean,
    curOrgId: [Number, String],
    curColumnName: String,
    curGroupName: String
  },
  data () {
    return {
      visible: this.value,
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      table: []
    }
  },
  watch: {
    value (val) {
      this.visible = val
      val && this.queryOrgDealDetail()
    }
  },
  methods: {
    detailHandle (applyId) {
      this.$router.push({
        path: 'workDetail',
        query: {
          applyId: applyId
        }
      })
    },
    queryOrgDealDetail () {
      this.$ajax({
        url: '/store/account/dataset/orgDealOrderCount/queryOrgDealDetail',
        data: {
          orgId: this.curOrgId,
          columnName: this.curColumnName,
          groupName: this.curGroupName,
          currentPage: this.currentPage
        },
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = this.$parent.notifyNum = data.page.totalRecords
        }
      })
    },
    pageHandle (page) {
      this.currentPage = page
      this.queryOrgDealDetail()
    },
    // 关闭
    close () {
      this.visible = false
      this.currentPage = 1
      this.$emit('change', 'back')
    }
  }
}
</script>
