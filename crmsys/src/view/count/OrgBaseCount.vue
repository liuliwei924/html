<template>
  <div class="content-box">
    <div class="header__title">门店基本统计</div>
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
        min-width="120"
        prop="dealCount"
        label="未处理"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '未跟进数')}">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="receiveCount"
        label="新申请"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '分配的客户数量')}">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="againAllto"
        label="再分配"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '再分配的客户数量')}">
      </el-table-column>
      <el-table-column
        prop="feedBackCount"
        label="跟进单数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '接单后处理操作反馈次数')}">
      </el-table-column>
       <el-table-column       
        prop="sucBookCount"      
        label="上门量"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '上门量包含手工记录和访客登记')}">
      </el-table-column>
      <el-table-column       
        prop="recPersonCount"      
        label="接单人数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '门店的接单人数')}">
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
          <input type="text" name="exportType" value="orgBaseExp">
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
      titileBar: '门店基本统计列表',
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
        {'name': 'dealCount', 'title': '未处理'},
        {'name': 'receiveCount', 'title': '新申请'},
        {'name': 'againAllto', 'title': '再分配'},
        {'name': 'feedBackCount', 'title': '跟进单数'},
        {'name': 'sucBookCount', 'title': '上门量'},
        {'name': 'recPersonCount', 'title': '接单人数'}
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
        url: '/store/account/dataset/orgCount/queryOrgBase',
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