<template>
  <div class="content-box">
    <div class="header__title">门店人员暂停统计</div>
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
        <el-form-item label="门店人员姓名:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.realName"
            placeholder="门店人员姓名">
          </el-input>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="exportData()" v-if="isExport" class="export-btn">导出</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="1">实时</el-radio>
        <el-radio :label="2">历史</el-radio>
      </el-radio-group>
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
        width="120"
        prop="realName"
        label="业务员">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="orgName"
        label="所属门店">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="groupName"
        label="所属组名">
      </el-table-column>
      <el-table-column
        width="120"
        prop="pauseDate"
        label="暂停日期">
      </el-table-column> 
      <el-table-column
        min-width="120"
        prop="pauseDays"
        label="暂停天数">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="followCount"
        label="跟进单数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '接单后处理操作反馈次数')}">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="totalDuration"
        label="总通话时长"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '总通话时长')}">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="sucBookCount"
        label="成功上门数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '成功上门数')}">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="sucSignCount"
        label="成功签单数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '成功签单数')}">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="sucRetCount"
        label="成功回款数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '总部已经核算过的回款数量')}">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="sucRetAmount"
        label="成功回款金额"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '总部已经核算过的回款金额')}">
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
// 门店人员暂停情况统计
export default {
  name: 'store-pauseReal',
  data () {
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    let userOrgId = this.$localStorage('userOrgId')
    let showOrgId = !userRole ? Number(userOrgId) : ''
    // 缓存查询条件
    let store = this.$getStore('storePauseReal')
    return {
      status: 1,
      signId: '',
      exportSearchParams: {},
      exportForm: {
        exportType: 'storePauseReal',
        exportParams: ''
      },
      defileName: 'storePauseReal',
      searchForm: {
        orgId: store['orgId'] || showOrgId,
        realName: store['realName'] || '',
        currentPage: store['currentPage'] || 1,
        orderBy: '',
        orderValue: '',
        groupName: ''
      },
      isExport, // 是否可以导出
      groupNameList: [], // 门店组名列表
      sumTotalData: {},
      loading: false,
      tableData: [],
      totalRecord: 1,
      userOrgs, // 门店数据
      checked: true
    }
  },
  created () {
    this.searchForm.currentPage = 1
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
      let nines = ['pauseDaysSum', 'followCountSum', 'totalDurationSum', 'sucBookCountSum', 'sucSignCountSum', 'sucRetCountSum', 'sucRetAmountSum']
      let sums = ['总计', '', '', '']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        arr[i] = this.sumTotalData[nines[i]]
      }
      return sums.concat(arr)
    },
    // 查询总计求和
    queryStorePauseCountSum () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/storePauseCount/queryStorePauseCountSum',
        data: this.searchForm,
        success: data => {
          this.sumTotalData = data.rows[0] || {}
        }
      })
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
      this.$refs.sumExport.show = true
      this.signId = expireStore('signId')
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.exportSearchParams = this.searchForm
      // 缓存查询条件
      this.$setStore('storePauseReal', this.searchForm)
      this.$ajax({
        url: '/store/account/dataset/storePauseCount/queryStorePauseCount',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.queryStorePauseCountSum()
    },
    // 改变门店的状态
    changeOrgHandle () {
      let orgId = this.searchForm.orgId
      if (orgId) {
        this.getGroupList(orgId)
      } else {
        this.searchForm.groupName = ''
        this.groupNameList = []
      }
    },
    // 获取组列表
    getGroupList (orgId) {
      this.$ajax({
        url: '/store/account/user/comm/queryOrgGroupList',
        data: {
          orgId: orgId,
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
  },
  components: {
    SumExport
  }
}
</script>