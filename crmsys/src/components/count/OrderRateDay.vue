<template>
  <div class="content-box">
    <div class="header__title">门店订单评分统计</div>
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
        <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
            clearable
            placeholder="请选择门店">
            <el-option
              v-for="item,index in userOrgs"
              :label="item.orgNo + '-' + item.orgName"
              :value="item.orgId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店编号:">
            <el-input
                class="kf-search-input"
                v-model="searchForm.orgName"
                placeholder="请输入门店编号">
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
      :summary-method="getSummaries"
      show-summary>
       <el-table-column
          width="120"
          prop="recordDate"
          align="center"
          label="记录日期">
        </el-table-column>
        <el-table-column
          width="150"
          prop="orgName"
          align="center"
          label="门店">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="totalCount"
          align="center"
          label="总计">
        </el-table-column>
        <el-table-column
          prop="rateOneCount"
          min-width="150"
          align="center"
          label="1分">
        </el-table-column>
        <el-table-column
          prop="rateTwoCount"
          min-width="150"
          align="center"
          label="2分">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="rateThreeCount"
          align="center"
          label="3分">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="rateFourCount"
          align="center"
          label="4分">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="rateFiveCount"
          align="center"
          label="5分">
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
export default {
  name: 'orderRate-day',
  data () {
    let {firstDay, yesterday} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('orderRateDay')
    return {
      status: 1,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeOrderRateDay',
        exportParams: ''
      },
      defileName: 'orderRateDay',
      searchForm: {
        startRecordDate: firstDay,
        endRecordDate: yesterday,
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
      let nines = ['totalCountSum', 'rateOneCountSum', 'rateTwoCountSum', 'rateThreeCountSum', 'rateFourCountSum', 'rateFiveCountSum']
      let sums = ['总计', '']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        arr[i] = this.sumTotalData[nines[i]]
      }
      return sums.concat(arr)
    },
    // 查询总计求和
    queryRateDaySum () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/orderRateCount/queryRateDaySum',
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
      this.$setStore('orderRateDay', this.searchForm, ['startRecordDate', 'endRecordDate'])
      this.$ajax({
        url: '/store/account/dataset/orderRateCount/queryRateDay',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.queryRateDaySum()
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