<template>
  <div class="content-box">
    <div class="header__title">门店统计</div>
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
      border
      :summary-method="getSummaries"
      show-summary>
      <el-table-column
        width="120"
        prop="recordDate"
        label="记录日期">
      </el-table-column>
      <el-table-column
        min-width="150"
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
        prop="costCount"
        label="成本单量"
        sortable
        :render-header="(h,options) => {
          return renderHeader(h, options, '成本单量')}">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="backCostCount"
        label="成本退单数"
        sortable
        :render-header="(h,options) => {
          return renderHeader(h, options, '成本退单数')}">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="dealCount"
        label="新单未处理"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '新单未跟进数')}">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="receiveCount"
        label="新申请"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '当前分配的客户数量')}">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="newApplyCount"
        label="分配新申请"
        sortable
        :render-header="(h,options) => {
        return renderHeader(h, options, '分配新申请')}">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="noHandlCount"
        label="再分配单未处理"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '再分配单未跟进数')}">
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
        min-width="120"
        prop="feedBackCount"
        label="跟进单数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '接单后处理操作反馈次数')}">
      </el-table-column>
      <el-table-column
        prop="custLabel0"
        min-width="100"
        label="0星"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '0星客户')}">
      </el-table-column>
      <el-table-column
        prop="custLabel1"
        min-width="100"
        label="1星"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '1星客户')}">
      </el-table-column>
      <el-table-column
        prop="custLabel2"
        min-width="100"
        label="2星"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '2星客户')}">
      </el-table-column>
      <el-table-column
        prop="custLabel3"
        min-width="100"
        label="2星+"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '2星+客户')}">
      </el-table-column>
      <el-table-column
        prop="custLabel4"
        min-width="100"
        label="3星"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '3星客户')}">
      </el-table-column>
      <el-table-column
        prop="custLabel5"
        min-width="100"
        label="4星"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '4星客户')}">
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="handelTime"
        label="分配跟进时效(分钟)"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '员工的新单分配时间到跟进时间处理时效/单数')}">
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="applyHandelTime"
        label="申请跟进时效(分钟)"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '员工的新单申请时间到跟进时间处理时效/单数')}">
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="applyAllotTime"
        label="申请分配时效(分钟)"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '员工的新单申请时间到分配时间处理时效/单数')}">
      </el-table-column>
      <el-table-column  
        min-width="100"     
        prop="sucBookCount"      
        label="上门量"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '上门量包含手工记录和访客登记')}">
      </el-table-column>
      <el-table-column    
        min-width="120"   
        prop="recPersonCount"      
        label="接单人数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '门店的接单人数')}">
      </el-table-column>
      <el-table-column
        prop="totalSignCount"
        min-width="120"
        label="总签单数"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '已签约客户量')}">
      </el-table-column>
      <el-table-column
        prop="totalSignAmt"
        min-width="150"
        label="总签单金额(万)"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '已签约客户总金额')}">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="treatyWill"
        label="预计创收"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '预计创收金额')}">
      </el-table-column>
      <el-table-column
        prop="failSignCount"
        min-width="120"
        label="黄单数量"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '办理失败的签单客户量')}">
      </el-table-column>
      <el-table-column
        prop="failSignAmt"
        min-width="150"
        label="黄单金额(万)"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '办理失败的签单客户总金额')}">
      </el-table-column>
      <el-table-column
        min-width="140"
        prop="sucRetCount"
        label="成功回款单量"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '总部已经核算过的回款数量')}">
      </el-table-column>
      <el-table-column
        min-width="140"
        prop="chkRetAmount"
        label="未确定业绩"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '总部未核对的回款金额')}">
      </el-table-column>
      <el-table-column
        min-width="140"
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
    <sum-export :defileName="defileName" ref="sumExport"/>
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
import SumExport from '@/components/export/SumExport.vue'
// 门店人员统计本月
export default {
  name: 'org-day',
  data () {
    let {firstDay, yesterday} = this.$searchDate()
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('orgDay')
    return {
      status: 1,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeOrgDay',
        exportParams: ''
      },
      defileName: 'orgDay',
      searchForm: {
        startRecordDate: firstDay,
        endRecordDate: yesterday,
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
      sumTotalData: {},
      totalRecord: 1,
      userOrgs, // 门店数据
      cityList, // 城市数据
      // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() >= Date.now() - 8.64e7
        }
      },
      checked: true
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
      let nines = ['costCountSum', 'backCostCountSum', 'dealCountSum', 'receiveCountSum', 'newApplyCountSum', 'noHandlCountSum', 'againAlltoSum', 'feedBackCountSum', 'custLabel0Sum', 'custLabel1Sum', 'custLabel2Sum', 'custLabel3Sum', 'custLabel4Sum', 'custLabel5Sum', 'handelTimeSum', 'applyHandelTimeSum', 'applyAllotTimeSum', 'sucBookCountSum', 'recPersonCountSum', 'totalSignCountSum', 'totalSignAmtSum', 'treatyWillSum', 'failSignCountSum', 'failSignAmtSum', 'sucRetCountSum', 'chkRetAmountSum', 'sucRetAmountSum']
      let sums = ['总计', '', '']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        arr[i] = this.sumTotalData[nines[i]]
      }
      return sums.concat(arr)
    },
    // 查询总计求和
    queryByStoreTotal () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/dataset/orgCount/queryByStoreTotal',
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
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startRecordDate = date || ''
      this.searchForm.endRecordDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
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
      this.$setStore('orgDay', this.searchForm, ['startRecordDate', 'endRecordDate'])
      this.$ajax({
        url: '/store/account/dataset/orgCount/queryOrgDay',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.queryByStoreTotal()
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