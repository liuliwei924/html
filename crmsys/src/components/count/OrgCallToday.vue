<template>
  <div class="content-box">
    <div class="header__title">门店通话统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="所属门店:">
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
      @sort-change="sortEvent"
      :data="tableData"
      border>
       <el-table-column
          min-width="150"
          prop="recordDate"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="orgName"
          min-width="120"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="cityName"
          min-width="100"
          label="城市">
        </el-table-column>
        <el-table-column
          prop="personCount"
          min-width="150"
          sortable
          label="上传总人数">
        </el-table-column>
        <el-table-column
          prop="avgSuc"
          min-width="150"
          sortable
          label="人均成功通话单数">
        </el-table-column>
        <el-table-column
          prop="avgCall60"
          min-width="150"
          sortable
          label="人均1分钟以上通话单数">
        </el-table-column>
        <el-table-column
          prop="avgCall180"
          min-width="150"
          sortable
          label="人均3分钟以上通话单数">
        </el-table-column>
        <el-table-column
          prop="avgtotalDuration"
          min-width="150"
          sortable
          label="人均总通话时长/分">
        </el-table-column>
        <el-table-column
          prop="callOutCount"
          min-width="120"
          sortable
          label="呼出单数">
        </el-table-column>
        <el-table-column
          prop="sucTotalCount"
          min-width="150"
          sortable
          label="成功通话单数">
        </el-table-column>
        <el-table-column
          min-width="150"
          sortable
          prop="sucCallOutCount"
          label="成功呼出单数">
        </el-table-column>
        <el-table-column
          min-width="180"
          sortable
          prop="callCount60"
          label="1分钟以上通话单数">
        </el-table-column>
        <el-table-column
          prop="callCount180"
          sortable
          min-width="180"
          label="3分钟以上通话单数">
        </el-table-column>
        <el-table-column
          prop="totalDuration"
          min-width="150"
          sortable
          label="总通话时长/分">
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
// 门店通话统计
export default {
  name: 'call-day',
  data () {
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userRole = this.$localStorage('userRole') === '1' || this.$localStorage('userRole') === '7' // 管理员或门店经理
    let isExport = userRole
    // 缓存查询条件
    let store = this.$getStore('StoreCallToday')
    return {
      status: 3,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeOrgCallToDay',
        exportParams: ''
      },
      defileName: 'orgCallToDay',
      searchForm: {
        orgId: store['orgId'] || '',
        groupName: store['groupName'] || '',
        teamName: store['teamName'] || '',
        cityName: store['cityName'] || '',
        realName: store['realName'] || '',
        currentPage: store['currentPage'] || 1
      },
      cityList,
      userOrgs,
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      groupNameList: [],
      teamNameList: [],
      totalRecord: 1
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
    exportData () {
      this.$refs.sumExport.show = true
      this.signId = expireStore('signId')
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.exportSearchParams = this.searchForm
      // 缓存查询条件
      this.$setStore('StoreCallToday', this.searchForm)
      this.$ajax({
        url: '/store/account/dataset/queryStoreCallToday',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
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