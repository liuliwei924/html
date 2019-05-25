<template>
  <div class="content-box">
    <div class="header__title">门店分组排名统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
            clearable
            @change="changeOrgHandle"
            placeholder="请选择门店">
            <el-option
              v-for="item,index in userOrgs"
              :label="item.orgNo + '-' + item.orgName"
              :value="item.orgId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组名:">
          <el-select
            v-model="searchForm.groupName"
            clearable
            placeholder="请选择组名">
            <el-option
              v-for="item,index in groupNameList"
              :label="item.groupName"
              :value="item.groupName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      @sort-change="sortEvent"
      :data="tableData"
      border
      :summary-method="getSummaries"
      show-summary>
      <el-table-column
        type="index"
        width="80"
        label="排名">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="groupName"
        label="组名">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="groupLeader"
        label="组长">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop=""
        label="角色">
        <template slot-scope="scope">
          <span>门店组长</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="orgName"
        label="门店名称">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="retAmountSum"
        label="创收金额(元)"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '当月回款金额')}">
      </el-table-column>
      <el-table-column
        min-width="160"
        prop="todayMonthDur"
        label="当日/当月通话时长(分钟)"
        :render-header="(h, options) => {
        return renderHeader(h, options, '当日/当月通话时长')}">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="growthDurRate"
        label="环比增长率(%)"
        :render-header="(h, options) => {
        return renderHeader(h, options, '今天跟昨天通话比较')}">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="avgAmountSum"
        label="人均创收(元)"
        :render-header="(h, options) => {
        return renderHeader(h, options, '当月人均回款金额')}">
      </el-table-column>
      <el-table-column
        min-width="150"       
        prop="todayAmountSum"      
        label="今日新增创收(元)"
        :render-header="(h, options) => {
        return renderHeader(h, options, '今日回款金额')}">
      </el-table-column>
      <el-table-column
        min-width="150"      
        prop="todayMonthVisit"      
        label="当日/当月上门"
        :render-header="(h, options) => {
        return renderHeader(h, options, '当日/当月上门量')}">
      </el-table-column>
      <el-table-column
        prop="todayMonthSign"
        min-width="150"
        label="当日/当月进件"
        :render-header="(h, options) => {
        return renderHeader(h, options, '当日/当月签单量')}">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="retAmountCount"
        label="收款件数"
        :render-header="(h, options) => {
        return renderHeader(h, options, '当月回款单数')}">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="sucRetAmount"
        label="已确定业绩(元)"
        :render-header="(h, options) => {
        return renderHeader(h, options, '总部已经核算过的当月回款金额')}">
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
    <!-- 导出 -->
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
          <input type="text" name="exportParams" v-model="exportParams">
          <input type="text" name="exportTitles" v-model="exportTitles">
          <input type="text" name="signId" v-model="signId">
          <input type="text" name="exportType" value="groupRank">
    </form>
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
export default {
  name: 'groupRank',
  data () {
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('groupRank')
    return {
      exportPath: this.$baseURL + 'store/account/user/export/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      activeClass: 'active',
      errorClass: 'span',
      titileBar: '门店分组统计排名',
      searchForm: {
        orgId: store['orgId'] || '',
        groupName: store['groupName'] || '',
        teamName: store['teamName'] || '',
        currentPage: store['currentPage'] || 1,
        orderBy: '',
        orderValue: ''
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      orgRankData: {},
      groupNameList: [], // 门店组名列表
      growthDurRateTotal: '',
      totalRecord: 1,
      userOrgs, // 门店数据
      cityList  // 城市数据
    }
  },
  methods: {
    getSummaries (param) {
      let nines = ['retAmountSumTotal', 'todayMonthDurTotal', 'growthDurRateTotal', 'avgAmountSumTotal', 'todayAmountSumTotal', 'todayMonthVisitTotal', 'todayMonthSignTotal', 'retAmountCountTotal', 'sucRetAmountTotal']
      let sums = ['总计', '', '', '', '']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        if (i === 2) {
          arr[2] = this.growthDurRateTotal
        } else {
          arr[i] = this.orgRankData[nines[i]]
        }
      }
      return sums.concat(arr)
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
    renderHeader (h, options, text) {
      let label = options.column.label
      return h('el-tooltip', {props: {content: text, placement: 'top'}}, [h('span', label)])
    },
    exportData () {
      let params = {}
      let roleType = this.$localStorage('userRole')
      Object.assign(params, this.searchForm, {
        roleType
      })
      this.exportParams = JSON.stringify(params)
      this.signId = expireStore('signId')
      let title = [
        {'name': 'groupName', 'title': '组名'},
        {'name': 'groupLeader', 'title': '组长'},
        {'name': 'roleName', 'title': '角色'},
        {'name': 'orgName', 'title': '门店名称'},
        {'name': 'retAmountSum', 'title': '创收金额(元)'},
        {'name': 'todayMonthDur', 'title': '当日/当月通话时长(分钟)'},
        {'name': 'growthDurRate', 'title': '环比增长率(%)'},
        {'name': 'avgAmountSum', 'title': '人均创收(元)'},
        {'name': 'todayAmountSum', 'title': '今日新增创收(元)'},
        {'name': 'todayMonthVisit', 'title': '当日/当月上门'},
        {'name': 'todayMonthSign', 'title': '当日/当月进件'},
        {'name': 'retAmountCount', 'title': '收款件数'},
        {'name': 'sucRetAmount', 'title': '已确定业绩(元)'}
      ]
      this.exportTitles = JSON.stringify(title)
      let formDom = document.getElementById('JS-form-export')
      window.setTimeout(function () {
        formDom.submit()
      }, 100)
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/groupRank/queryOrgGroupRank',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
          this.growthDurRateTotal = data.attr.growthDurRateTotal
        }
      })
      this.queryOrgGroupSumRank()
    },
    // 查询门店分组排名求和
    queryOrgGroupSumRank () {
      this.orgRankData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/groupRank/queryOrgGroupSumRank',
        data: this.searchForm,
        success: data => {
          this.orgRankData = data.rows[0] || {}
        }
      })
    },
    // 改变门店的状态
    changeOrgHandle () {
      if (this.searchForm.orgId) {
        this.getGroupList()
      } else {
        this.searchForm.groupName = ''
        this.groupNameList = []
      }
    },
    // 获取组列表
    getGroupList () {
      this.$ajax({
        url: '/store/account/user/comm/queryOrgGroupList',
        data: {
          orgId: this.searchForm.orgId,
          fullLoading: true
        },
        success: data => {
          this.groupNameList = data.rows || []
          this.searchForm.groupName = ''
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