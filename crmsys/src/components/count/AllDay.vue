<template>
  <div class="content-box">
    <div class="header__title">总的统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始日期:">
          <el-date-picker
            v-model="searchForm.startRecordDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:">
          <el-date-picker
            v-model="searchForm.endRecordDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
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
          label="当日花费金额">
        </el-table-column>
        <el-table-column
          prop="costMoney"
          min-width="100"
          label="花费成本">
        </el-table-column>
        <el-table-column
          prop="browseCount"
          label="当日浏览量">
        </el-table-column>
        <el-table-column
          prop="applyCount"
          label="当日申请数">
        </el-table-column>
        <el-table-column
          prop="seniorCount"
          label="当日优质单数">
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
// 总的统计本月
export default {
  name: 'all-day',
  data () {
    let {firstDay, yesterday} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('allDay')
    return {
      status: 1,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeAllDay',
        exportParams: ''
      },
      defileName: 'allDay',
      searchForm: {
        startRecordDate: firstDay,
        endRecordDate: yesterday,
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
          return time.getTime() > Date.now() - 8.64e7
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
    queryDaySumTotal () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/allCount/queryDaySumTotal',
        data: this.searchForm,
        success: data => {
          this.sumTotalData = data.rows[0] || {}
        }
      })
    },
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
    exportData () {
      this.$refs.sumExport.show = true
      this.signId = expireStore('signId')
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.exportSearchParams = this.searchForm
      // 缓存查询条件
      this.$setStore('allDay', this.searchForm, ['startRecordDate', 'endRecordDate'])
      this.$ajax({
        url: '/store/account/dataset/allCount/querySumaryDay',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.queryDaySumTotal()
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