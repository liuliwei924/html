<template>
  <div class="content-box">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="businessType" label="业务类型" width="200"/>
      <el-table-column prop="businessId" label="业务Id号" width="200"/>
      <el-table-column prop="serverName" label="服务名称" width="200"/>
      <el-table-column prop="startTime" label="开始时间" width="200"/>
      <el-table-column prop="executeDesc" label="执行描述" width="350"/>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteLock(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="searchTable"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="everyPage"
      layout="total, sizes, prev, pager, next"
      :total="totalRecords">
    </el-pagination>
</div>

</template>

<script>
export default {
  data () {
    return {
      jobInfo: {},
      searchForm: {
        title: ''
      },
      tableData: [],
      currentPage: 1,
      everyPage: 10,
      totalRecords: 0
    }
  },
  created () {
    this.searchTable(this.currentPage)
  },
  methods: {
    // 查询列表
    searchTable (currentPage) {
      this.currentPage = currentPage
      this.$ajax({
        url: '/store/account/config/joblock/queryJobLock',
        data: {
          currentPage,
          everyPage: this.everyPage,
          ...this.searchForm
        },
        success: data => {
          this.tableData = data.rows
          this.totalRecords = data.page.totalRecords
        }
      })
    },
    // 每页几条
    handleSizeChange (val) {
      this.everyPage = val
      this.searchTable(1)
    },
    deleteLock (obj) {
      this.$alert('是否确定删除?', '提示', {
        showCancelButton: true,
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.$ajax({
            url: '/store/account/config/joblock/deleteJobLock',
            data: {
              lockId: obj.lockId
            },
            success: data => {
              this.$message({message: '删除成功', type: 'success'})
              this.searchTable(this.currentPage)
            }
          })
        }
      })
    },
    // 关闭弹窗
    closeDialog (val) {
      this.showDialog = false
      if (val === 'refresh') this.searchTable(this.currentPage)
    }
  }
}
</script>
