<template>
  <div class="content-box">
    <div class="header__title">操作记录统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
         <el-form-item label="用户姓名:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.realName"
            placeholder="用户姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="用户角色:">
          <el-select
            v-model="searchForm.roleType"
            clearable
            placeholder="请选择角色">
            <el-option
              v-for="val,key,index in roleType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
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
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
        <!-- <el-button @click="exportData()" v-if="isExport" class="export-btn">导出</el-button> -->
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
      @sort-change="sortEvent"
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
          prop="realName"
          align="center"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          width="120"
          prop="roleType"
          align="center"
          label="用户角色">
          <template slot-scope="scope">{{roleType[scope.row.roleType]}}</template>
        </el-table-column>
        <el-table-column
          width="180"
          prop="orgName"
          align="center"
          label="门店">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="traOrderCount"
          align="center"
          sortable
          label="转单次数">
        </el-table-column>
        <el-table-column
          width="120"
          prop="backOrderCount"
          align="center"
          sortable
          label="退单次数">
        </el-table-column>
        <el-table-column
          prop="authCount"
          min-width="150"
          align="center"
          sortable
          label="开通权限次数">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="leaDealCount"
          align="center"
          sortable
          label="离职处理次数">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="onlineTime"
          align="center"
          sortable
          label="在线时长(分钟)">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="cfsCount"
          align="center"
          sortable
          label="CFS关联次数">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="audioCount"
          align="center"
          sortable
          label="录音查询次数">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="exportCount"
          align="center"
          sortable
          label="导出次数">
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
  name: 'handleRecord-toDay',
  data () {
    let {today} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('handleRecordToDay')
    return {
      status: 3,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeHandleRecordToDay',
        exportParams: ''
      },
      defileName: 'handleRecordToDay',
      searchForm: {
        recordDate: today,
        realName: store['realName'] || '',
        orgId: store['orgId'] || '',
        orderBy: '',
        orderValue: '',
        currentPage: store['currentPage'] || 1
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      sumTotalData: {},
      userOrgs, // 门店数据
      totalRecord: 1,
      // 用户角色
      roleType: {
        1: '管理员',
        2: '客服',
        3: '业务员',
        6: '门店负责人',
        7: '门店经理',
        8: '门店主管',
        9: '门店队长',
        10: '外部渠道用户'
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
    getSummaries (param) {
      let nines = ['traOrderCountSum', 'backOrderCountSum', 'authCountSum', 'leaDealCountSum', 'onlineTimeSum', 'cfsCountSum', 'audioCountSum', 'exportCountSum']
      let sums = ['总计', '', '', '']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        arr[i] = this.sumTotalData[nines[i]]
      }
      return sums.concat(arr)
    },
     // 查询总计求和
    queryHandleRecordDaySum () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/handleRecordCount/queryHandleRecordSum',
        data: this.searchForm,
        success: data => {
          this.sumTotalData = data.rows[0] || {}
        }
      })
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
      this.$setStore('handleRecordToDay', this.searchForm)
      this.$ajax({
        url: '/store/account/dataset/handleRecordCount/queryHandRecordByDate',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.queryHandleRecordDaySum()
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