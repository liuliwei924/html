<template>
  <div class="content-box">
    <div class="header__title">签单失败渠道统计</div>
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
            placeholder="请输入渠道">
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
          width="180"
          prop="channelCode"
          align="center"
          label="渠道">
        </el-table-column>
        <el-table-column
          width="180"
          prop="channelName"
          align="center"
          label="渠道名称">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="totalCount"
          align="center"
          label="总计">
        </el-table-column>
        <el-table-column
          width="120"
          prop="bigDataCount"
          align="center"
          label="大数据检测未通过">
        </el-table-column>
        <el-table-column
          prop="creditCount"
          min-width="150"
          align="center"
          label="征信体现不了/查询次数多">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="overdueCount"
          align="center"
          label="历史或当前逾期">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="liabiCount"
          align="center"
          label="负债过高">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="netLoanCount"
          align="center"
          label="网贷太多/小额笔数多">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="scoreCount"
          align="center"
          label="系统综合评级不足">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="storeRefuseCount"
          align="center"
          label="门拒/电核不通过">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="interestCount"
          align="center"
          label="利息高不接受/额度低不接受/客户自行取消">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="banCount"
          align="center"
          label="禁入行业/同行已操作">
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
  name: 'signFail-toDay',
  data () {
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('signFailToDay')
    return {
      status: 3,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeSignFailToDay',
        exportParams: ''
      },
      defileName: 'storeSignFailToDay',
      searchForm: {
        startRecordDate: '',
        endRecordDate: '',
        channelCode: '',
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
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    getSummaries (param) {
      let nines = ['totalCount', 'bigDataCount', 'creditCount', 'overdueCount', 'liabiCount', 'netLoanCount', 'scoreCount', 'storeRefuseCount', 'interestCount', 'banCount']
      let sums = ['总计', '', '']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        arr[i] = this.sumTotalData[nines[i]]
      }
      return sums.concat(arr)
    },
    // 查询总计求和
    querySignFailTodaySum () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/signFailCount/querySignFailTodaySum',
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
    // 改变门店的状态
    changeOrgHandle () {
      if (this.searchForm.orgId) {
      } else {
        this.searchForm.groupName = ''
        this.groupNameList = []
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
      this.$setStore('signFailToday', this.searchForm, ['startRecordDate', 'endRecordDate'])
      this.$ajax({
        url: '/store/account/dataset/signFailCount/querySignFailToday',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.querySignFailTodaySum()
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