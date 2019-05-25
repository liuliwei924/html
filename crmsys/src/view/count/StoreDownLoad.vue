<template>
  <div class="content-box">
    <div class="header__title">下载列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始时间-起:">
          <el-date-picker
            v-model="searchForm.startRecordDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间-止:">
          <el-date-picker
            v-model="searchForm.endRecordDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="导出人:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.exportMan"
            placeholder="导出人">
          </el-input>
        </el-form-item>
        <el-form-item label="文件名:">
          <el-input 
            v-model="searchForm.fileName" 
            placeholder="文件名" 
            class="kf-search-input">
          </el-input>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border>
      <el-table-column
        min-width="110"
        prop="createTime"
        label="导出日期">
      </el-table-column>
      <el-table-column
        min-width="110"
        prop="exportMan"
        label="导出人">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="fileName"
        label="文件名">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
            <span v-if="scope.row.status === 1">正在生成文件中... 请重新刷新页面</span>
            <div v-if="scope.row.status === 2">
              <el-button @click="newExport(scope.row.exportUrl)" type="text" size="small" style="color:#3ebd7f;">导出</el-button>
              <el-button @click="delet(scope.row)" type="text" size="small" style="color:red;margin-left: 8px">删除</el-button>
            </div>
            <span v-if="scope.row.status === 3">文件已过期</span>
          </template>
      </el-table-column>
    </el-table>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'again-allot',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('storeDownLoad')
    return {
      searchForm: {
        startRecordDate: lastWeekDay || '',
        endRecordDate: '',
        fileName: store['fileName'] || '',
        exportMan: store['exportMan'] || '',
        currentPage: store['currentPage'] || 1
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      totalRecord: 1,
      // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startRecordDate = date || ''
      this.searchForm.endRecordDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endRecordDate = date || ''
    },
    // 查询处理
    searchHandle () {
      // 缓存查询条件
      this.$setStore('storeDownLoad', this.searchForm, ['startRecordDate', 'endRecordDate'])
      this.$ajax({
        url: '/store/account/dataset/storeDownLoad/query',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    newExport (exportUrl) {
      let _this = this
      let loading = false
      this.loadInst = this.$loading({ fullscreen: true, text: '拼命加载中' })
      if (!loading) {
        window.location = `${exportUrl}`
        loading = true
        setTimeout(function () {
          _this.loadInst.close()
          loading = false
        }, 2000)
      }
    },
    delet (obj) {
      this.$alert('此操作将删除该条信息, 是否继续?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/dataset/storeDownLoad/delete',
              data: {
                recordId: obj.recordId
              },
              success: () => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.searchHandle()
              },
              fail: (error) => {
                this.$msg(error.message)
              }
            })
          }
        }
      })
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>