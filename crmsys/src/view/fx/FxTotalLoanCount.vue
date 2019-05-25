<template>
  <div class="content-box">
    <div class="header__title">贷款申请统计</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="申请日期-起:" prop="startDate">
          <el-date-picker v-model="searchForm.startDate" type="date" editable @change="startDateChange" :picker-options="startDateOptions" placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请日期-止:" prop="endDate">
          <el-date-picker v-model="searchForm.endDate" type="date" editable @change="endDateChange" :picker-options="endDateOptions" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="excelExportHandle">导出</el-button>
      </el-form>
    </div> 
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="showStatus">
        <el-radio :label="1">信用卡</el-radio>
        <el-radio :label="2">保险</el-radio>
        <el-radio :label="3">贷款</el-radio>
      </el-radio-group>
    </div> 
    <el-table class="content__table" 
      @sort-change="sortEvent"
      :data="tableData"
      border>
      <el-table-column
        prop="applyTimeStr"
        label="申请日期" align="center">
      </el-table-column>
      <el-table-column
        prop="applyLoanNums"
        sortable
        label="贷款申请数" align="center">
      </el-table-column>
      <el-table-column
        prop="applyLoanCustNums"
        sortable
        label="贷款申请人数" align="center">
      </el-table-column>
      <el-table-column
        prop="loanNums"
        sortable
        label="贷款完成数" align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="totalRecord">
    </el-pagination>
    <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="fxTotalCount">
    </form>
  </div>
</template>

<script>
export default {
  name: 'fx-total-loan-count',
  data () {
    let {halfMonthDay} = this.$searchDate()
    let store = this.$getStore('rechargeData')
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      exportParams: '',
      exportTitles: '',
      loading: false,
      signId: '',
      showStatus: 3,
      searchForm: {
        startDate: store['startDate'] || halfMonthDay,
        endDate: '',
        orderBy: '',
        orderValue: '',
        prodType: 3,
        currentPage: 1
      },
      excelExportPath: this.$baseURL + 'store/account/fx/fxDataCount/fxDataExport',
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
  watch: {
    // 处理状态改变监听
    showStatus (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    sortEvent (column) {
      if (column.prop === null) {
        if (this.searchForm.hasOwnProperty('orderBy')) { delete this.searchForm['orderBy'] }
        if (this.searchForm.hasOwnProperty('orderValue')) { delete this.searchForm['orderValue'] }
      } else {
        this.searchForm.orderBy = column.prop
        this.searchForm.orderValue = column.order === 'ascending' ? 'asc' : 'desc'
      }
      this.searchHandle()
    },
    // 申请时间
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.endDate = date || ''
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('fxTotalCount', this.searchForm)
      this.$ajax({
        url: '/store/account/fx/fxTotalCount/queryFxTotalCountList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // Excel导出弹框
    excelExportHandle () {
      this.$alert('您是否确定导出数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            let totalRecord = this.totalRecord
            if (totalRecord > 1000) {
              this.$msg('一次最多导出1000条数据，请重新查询或限制条数!')
              return
            }
            let params = {}
            let roleType = this.$localStorage('userRole')
            Object.assign(params, this.searchForm, {
              roleType
            })
            this.exportParams = JSON.stringify(params)
            let signId = JSON.parse(this.$localStorage('signId')).v
            this.signId = signId
            let title = [
              {'name': 'applyTimeStr', 'title': '申请日期'},
              {'name': 'applyLoanNums', 'title': '贷款申请数'},
              {'name': 'applyLoanCustNums', 'title': '贷款申请人数'},
              {'name': 'loanNums', 'title': '贷款完成数'}
            ]
            this.exportTitles = JSON.stringify(title)
            let formDom = document.getElementById('JS-form-export')
            window.setTimeout(function () {
              formDom.submit()
            }, 100)
          }
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
  }
}
</script>
<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
  .sumRed {
    color: red;
  }
</style>