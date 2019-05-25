<template>
  <div class="content-box">
    <div class="header__title">订单状态统计（门店）</div>
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
          prop="orgName"
          align="center"
          label="门店">
        </el-table-column>
        <el-table-column
          width="120"
          prop="groupName"
          align="center"
          label="组名">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="totalCount"
          align="center"
          label="总计">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('totalCount', scope.row)">
              {{scope.row.totalCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="noCondition"
          align="center"
          label="无条件">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('noCondition', scope.row)">
              {{scope.row.noCondition}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="smallLoansCount"
          min-width="150"
          align="center"
          label="微粒贷/小贷">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('smallLoansCount', scope.row)">
              {{scope.row.smallLoansCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="carCount"
          align="center"
          label="车">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('carCount', scope.row)">
              {{scope.row.carCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="insuranceCount"
          align="center"
          label="保险">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('insuranceCount', scope.row)">
              {{scope.row.insuranceCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="replaceCount"
          align="center"
          label="代发">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('replaceCount', scope.row)">
              {{scope.row.replaceCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="houseCount"
          align="center"
          label="本地房">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('houseCount', scope.row)">
              {{scope.row.houseCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="otherHouseCount"
          align="center"
          label="外地房">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('otherHouseCount', scope.row)">
              {{scope.row.otherHouseCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="rejectCallCount"
          align="center"
          label="未接/拒接">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('rejectCallCount', scope.row)">
              {{scope.row.rejectCallCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="notOneselfCount"
          align="center"
          label="非本人">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('notOneselfCount', scope.row)">
              {{scope.row.notOneselfCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="emptyCount"
          align="center"
          label="异地/空号">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('emptyCount', scope.row)">
              {{scope.row.emptyCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="noneedCount"
          align="center"
          label="不需要">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('noneedCount', scope.row)">
              {{scope.row.noneedCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="notDealCount"
          align="center"
          label="未了解">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('notDealCount', scope.row)">
              {{scope.row.notDealCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="taxesEntLoanCount"
          align="center"
          label="税金企业贷">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('taxesEntLoanCount', scope.row)">
              {{scope.row.taxesEntLoanCount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="accumulationFundCount"
          align="center"
          label="公积金">
          <template slot-scope="scope">
            <div style="cursor:pointer" @click="openOrderDtl('accumulationFundCount', scope.row)">
              {{scope.row.accumulationFundCount}}
            </div>
          </template>
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
    <orderDealType-detail 
      v-model="isShow" 
      :curOrgId="curOrgId" 
      :curGroupName="curGroupName" 
      :curColumnName="curColumnName" 
      @change="orderEditHandle" />
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
import SumExport from '@/components/export/SumExport.vue'
import OrderDealTypeDetail from '@/components/count/OrderDealTypeDetail'
// 总的统计本月
export default {
  name: 'orgDealOrder-Today',
  data () {
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userOrgId = this.$localStorage('userOrgId')
    let showOrgId = !userRole ? Number(userOrgId) : ''
    // 缓存查询条件
    let store = this.$getStore('orgDealOrderToday')
    return {
      status: 3,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeOrgDealOrderToDay',
        exportParams: ''
      },
      defileName: 'orgDealOrderToDay',
      searchForm: {
        startRecordDate: '',
        endRecordDate: '',
        orgId: store['orgId'] || showOrgId,
        groupName: '',
        currentPage: store['currentPage'] || 1
      },
      isExport, // 是否可以导出
      loading: false,
      isShow: false, // 弹窗是否显示
      tableData: [],
      curOrgId: '',
      curColumnName: '',
      curGroupName: '',
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
    orderEditHandle (val) {
      this.isShow = false
    },
    openOrderDtl (columnName, rows) {
      this.curOrgId = rows.orgId
      this.curColumnName = columnName
      this.curGroupName = rows.groupName
      this.isShow = true
    },
    getSummaries (param) {
      let nines = ['totalCount', 'noCondition', 'smallLoansCount', 'carCount', 'insuranceCount', 'replaceCount', 'houseCount', 'otherHouseCount', 'rejectCallCount', 'notOneselfCount', 'emptyCount', 'noneedCount', 'notDealCount', 'taxesEntLoanCount', 'accumulationFundCount']
      let sums = ['总计', '', '']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        arr[i] = this.sumTotalData[nines[i]]
      }
      return sums.concat(arr)
    },
    // 查询总计求和
    queryorgDealOrderTodaySum () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/orgDealOrderCount/queryOrgDealOrderTodaySum',
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
      this.$setStore('orgDealOrderToday', this.searchForm, ['startRecordDate', 'endRecordDate'])
      this.$ajax({
        url: '/store/account/dataset/orgDealOrderCount/queryOrgDealOrderToday',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.queryorgDealOrderTodaySum()
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    SumExport,
    OrderDealTypeDetail
  }
}
</script>