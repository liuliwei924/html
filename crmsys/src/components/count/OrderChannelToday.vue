<template>
  <div class="content-box">
    <div class="header__title">订单状态渠道统计</div>
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
            disabled
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
            disabled
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="渠道:">
            <el-input
                class="kf-search-input"
                v-model="searchForm.channelCode"
                placeholder="请输入渠道代号">
              </el-input>
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
      @sort-change="sortEvent"
      :summary-method="getSummaries"
      show-summary>
       <el-table-column
          width="120"
          prop="recordDate"
          align="center"
          label="记录日期">
        </el-table-column>
        <el-table-column
          width="120"
          prop="channel"
          align="center"
          label="渠道">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="totalCount"
          align="center"
          label="总计">
        </el-table-column>
        <el-table-column
          width="120"
          sortable
          prop="noCondition"
          align="center"
          label="无条件">
        </el-table-column>
        <el-table-column
          prop="smallLoansCount"
          min-width="150"
          sortable
          align="center"
          label="微粒贷/小贷">
        </el-table-column>
        <el-table-column
          min-width="150"
          sortable
          prop="carCount"
          align="center"
          label="车">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="insuranceCount"
          align="center"
          label="保险">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="replaceCount"
          align="center"
          label="代发">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="houseCount"
          align="center"
          label="本地房">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="otherHouseCount"
          align="center"
          label="外地房">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="rejectCallCount"
          align="center"
          label="未接/拒接">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="notOneselfCount"
          align="center"
          label="非本人">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="emptyCount"
          align="center"
          label="异地/空号">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="noneedCount"
          align="center"
          label="不需要">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="notDealCount"
          align="center"
          label="未了解">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="taxesEntLoanCount"
          align="center"
          label="税金企业贷">
        </el-table-column>
        <el-table-column
          min-width="120"
          sortable
          prop="accumulationFundCount"
          align="center"
          label="公积金">
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
  name: 'orderChannel-Today',
  data () {
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('orderChannelToday')
    return {
      status: 3,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeOrderChannelToDay',
        exportParams: ''
      },
      defileName: 'orderChannelToday',
      searchForm: {
        startRecordDate: '',
        endRecordDate: '',
        currentPage: store['currentPage'] || 1
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      sumTotalData: {},
      groupNameList: [], // 门店组名列表
      userOrgs, // 门店数据
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
      let nines = ['totalCount', 'noCondition', 'smallLoansCount', 'carCount', 'insuranceCount', 'replaceCount', 'houseCount', 'otherHouseCount', 'rejectCallCount', 'notOneselfCount', 'emptyCount', 'noneedCount', 'notDealCount', 'taxesEntLoanCount', 'accumulationFundCount']
      let sums = ['总计', '']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        arr[i] = this.sumTotalData[nines[i]]
      }
      return sums.concat(arr)
    },
    // 查询总计求和
    queryOrderChannelTodaySum () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/orderChannelCount/queryOrderChannelTodaySum',
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
    exportData () {
      this.$refs.sumExport.show = true
      this.signId = expireStore('signId')
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endRecordDate = date || ''
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.exportSearchParams = this.searchForm
      // 缓存查询条件
      this.$setStore('orderChannelToday', this.searchForm, ['startRecordDate', 'endRecordDate'])
      this.$ajax({
        url: '/store/account/dataset/orderChannelCount/queryOrderChannelToday',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.queryOrderChannelTodaySum()
    },
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