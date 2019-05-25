<template>
  <div class="content-box">
    <div class="header__title">门店签单统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
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
        <el-form-item label="城市:">
          <el-select
            v-model="searchForm.cityName"
            filterable
            clearable
            placeholder="请选择">
            <el-option-group
              v-for="group,gIndex in cityList"
              :label="group.provinceName"
              :key="gIndex">
              <el-option
                v-for="item,index in group.citys"
                :label="item.cityName"
                :value="item.cityName"
                :key="index">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
        <el-button @click="exportData()" v-if="isExport" class="export-btn">导出</el-button>
      </el-form>
    </div>
    <div class="header__check">
      <el-checkbox v-model="checked">网销</el-checkbox>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      @sort-change="sortEvent"
      :data="tableData"
      border>
      <el-table-column
        width="120"
        prop="recordDate"
        label="记录日期">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="orgName"
        label="门店名称">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="cityName"
        label="城市">
      </el-table-column>
      <el-table-column
        prop="totalSignCount"
        min-width="100"
        label="总签单数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '已签约客户量')}">
      </el-table-column>
      <el-table-column
        prop="totalSignAmt"
        min-width="100"
        label="总签单金额(万)"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '已签约客户总金额')}">
      </el-table-column>  
      <el-table-column
        prop="sucSignCount"
        label="成功签单数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '办理完成的签单客户量')}">
      </el-table-column>
      <el-table-column
        prop="sucSignAmt"
        label="成功签单金额(万)"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '办理完成的签单客户总金额')}">
      </el-table-column>
      <el-table-column
        prop="treatyWill"
        label="预计创收"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '预计创收金额')}">
      </el-table-column>
      <el-table-column
        prop="failSignCount"
        min-width="100"
        label="黄单数量"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '办理失败的签单客户量')}">
      </el-table-column>
      <el-table-column
        prop="failSignAmt"
        min-width="100"
        label="黄单金额(万)"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '办理失败的签单客户总金额')}">
      </el-table-column>
      <el-table-column
        prop="sucRetCount"
        label="成功回款单量"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '总部已经核算过的回款数量')}">
      </el-table-column>
      <el-table-column
        prop="chkRetAmount"
        label="未确定业绩"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '总部未核对的回款金额')}">
      </el-table-column>
      <el-table-column
        prop="sucRetAmount"
        label="已确定业绩"
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
    <!-- 导出 -->
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
          <input type="text" name="exportParams" v-model="exportParams">
          <input type="text" name="exportTitles" v-model="exportTitles">
          <input type="text" name="signId" v-model="signId">
          <input type="text" name="exportType" value="orgSignExp">
    </form>
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
// 门店统计今日
export default {
  name: 'orgBase-count',
  data () {
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('orgDay')
    return {
      exportPath: this.$baseURL + 'store/account/user/export/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      activeClass: 'active',
      errorClass: 'span',
      titileBar: '门店签单统计列表',
      searchForm: {
        cityName: store['cityName'] || '',
        orgId: store['orgId'] || '',
        currentPage: store['currentPage'] || 1,
        isNet: 1,
        orderBy: '',
        orderValue: ''
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      totalRecord: 1,
      userOrgs, // 门店数据
      cityList, // 城市数据
      checked: true
    }
  },
  created () {
    this.searchHandle()
  },
  watch: {
    checked (val) {
      if (val) {
        this.searchForm.isNet = 1
      } else {
        this.searchForm.isNet = ''
      }
      this.searchHandle()
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

      // this.exportParams = JSON.stringify({startDate: this.startDate, endDate: this.endDate})
      this.signId = expireStore('signId')
      let title = [
        {'name': 'recordDate', 'title': '记录日期'},
        {'name': 'orgName', 'title': '门店名称'},
        {'name': 'cityName', 'title': '城市'},
        {'name': 'totalSignCount', 'title': '总签单数'},
        {'name': 'totalSignAmt', 'title': '总签单金额(万)'},
        {'name': 'sucSignCount', 'title': '成功签单数'},
        {'name': 'sucSignAmt', 'title': '成功签单金额(万)'},
        {'name': 'treatyWill', 'title': '预计创收'},
        {'name': 'failSignCount', 'title': '黄单数量'},
        {'name': 'failSignAmt', 'title': '黄单金额(万)'},
        {'name': 'sucRetCount', 'title': '成功回款数'},
        {'name': 'chkRetAmount', 'title': '未确定业绩'},
        {'name': 'sucRetAmount', 'title': '已确定业绩'}
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
        url: '/store/account/dataset/orgCount/queryOrgSign',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
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