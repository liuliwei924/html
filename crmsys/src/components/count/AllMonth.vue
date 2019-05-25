<template>
  <div class="content-box">
    <div class="header__title">总的统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始月份:">
          <el-date-picker
            v-model="searchForm.startRecordMonth"
            type="month"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束月份:">
          <el-date-picker
            v-model="searchForm.endRecordMonth"
            type="month"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束月份">
          </el-date-picker>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
          <el-button @click="exportData()" v-if="isExport" class="export-btn">导出</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="3">今日</el-radio>
        <el-radio :label="1">本月</el-radio>
        <el-radio :label="2">月度</el-radio>
      </el-radio-group>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border
      :summary-method="getSummaries"
      show-summary>
     <el-table-column
          width="120"
          prop="recordDate"
          label="记录日期">
        </el-table-column>
        <el-table-column
          width="120"
          prop="costAmount"
          label="当月花费金额">
        </el-table-column>
        <el-table-column
          prop="costMoney"
          min-width="100"
          label="花费成本">
        </el-table-column>
        <el-table-column
          prop="browseCount"
          label="当月浏览量">
        </el-table-column>
        <el-table-column
          prop="applyCount"
          label="当月申请数">
        </el-table-column>
        <el-table-column
          prop="seniorCount"
          label="当月优质单数">
        </el-table-column>
        <el-table-column
          prop="notFillCount"
          label="未填单量">
        </el-table-column>
        <el-table-column
          prop="kfReceivedCount"
          label="交门店量">
        </el-table-column>
        <el-table-column
          prop="storeCount"
          label="门店接单数">
        </el-table-column>
        <el-table-column
          prop="sucBookCount"
          label="上门量">
        </el-table-column> 
        <el-table-column
          prop="feedBackCount"
          label="反馈量">
        </el-table-column>
        <el-table-column
          prop="totalSignCount"
          min-width="100"
          label="总签单数">
        </el-table-column>
        <el-table-column
          prop="totalSignAmt"
          min-width="100"
          label="总签单金额(万)">
        </el-table-column>  
        <el-table-column
          prop="signingCount"
          label="在账签单量">
        </el-table-column>
        <el-table-column
          prop="signingAmt"
          min-width="100"
          label="在账签金额(万) ">
        </el-table-column>
        <el-table-column
          prop="treatyWill"
          min-width="100"
          label="预计创收">
        </el-table-column>           
        <el-table-column
          prop="saleCount"
          label="挂卖数量">
        </el-table-column>
        <el-table-column
          prop="sucSaleCount"
          label="挂卖成功量">
        </el-table-column>
        <el-table-column
          prop="sucSaleAmount"
          label="挂卖成功金额">
        </el-table-column>
        <el-table-column
          prop="failSaleCount"
          label="退单数量">
        </el-table-column>
        <el-table-column
          prop="failSaleAmount"
          label="退单金额">
        </el-table-column>
        <el-table-column
          prop="failSignCount"
          label="黄单数">
        </el-table-column>
        <el-table-column
          prop="failSignAmt"
          label="黄单金额(万)">
        </el-table-column>
        <el-table-column
          prop="chkRetCount"
          label="未核算回款数">
        </el-table-column>
        <el-table-column
          prop="chkRetAmount"
          label="未核算回款金额">
        </el-table-column>
        <el-table-column
          prop="sucRetCount"
          min-width="100"
          label="成功回款笔数">
        </el-table-column>
        <el-table-column
          prop="sucRetAmount"
          min-width="100"
          label="成功回款金额">
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
    <sum-export :defileName="defileName" ref="sumExport"/>
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
import SumExport from '@/components/export/SumExport.vue'
// 总的统计月度
export default {
  name: 'all-month',
  data () {
    let {curMonth, lastMonth} = this.$monthDate()
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('allMonth')
    return {
      status: 2,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeAllMonth',
        exportParams: ''
      },
      defileName: 'allMonth',
      searchForm: {
        startRecordMonth: lastMonth,
        endRecordMonth: curMonth,
        currentPage: store['currentPage'] || 1
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      sumTotalData: {},
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
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    getSummaries (param) {
      let nines = ['costAmountSum', 'costMoneySum', 'browseCountSum', 'applyCountSum', 'seniorCountSum', 'notFillCountSum', 'kfReceivedCountSum', 'storeCountSum', 'sucBookCountSum', 'feedBackCountSum', 'totalSignCountSum', 'totalSignAmtSum', 'signingCountSum', 'signingAmtSum', 'treatyWillSum', 'saleCountSum', 'sucSaleCountSum', 'sucSaleAmountSum', 'failSaleCountSum', 'failSaleAmountSum', 'failSignCountSum', 'failSignAmtSum', 'chkRetCountSum', 'chkRetAmountSum', 'sucRetCountSum', 'sucRetAmountSum']
      let sums = ['总计']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        arr[i] = this.sumTotalData[nines[i]]
      }
      return sums.concat(arr)
    },
    // 查询总计求和
    queryMonthSumTotal () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/allCount/queryMonthSumTotal',
        data: this.searchForm,
        success: data => {
          this.sumTotalData = data.rows[0] || {}
        }
      })
    },
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startRecordMonth = date || ''
      this.searchForm.endRecordMonth = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    exportData () {
      this.$refs.sumExport.show = true
      this.signId = expireStore('signId')
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endRecordMonth = date || ''
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.exportSearchParams = this.searchForm
       // 缓存查询条件
      this.$setStore('allMonth', this.searchForm, ['startRecordMonth', 'endRecordMonth'])
      this.$ajax({
        url: '/store/account/dataset/allCount/querySumaryMonth',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.queryMonthSumTotal()
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    SumExport
  }
}
</script>