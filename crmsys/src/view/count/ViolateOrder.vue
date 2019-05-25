<template>
  <div class="content-box">
    <div class="header__title">不规范订单列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始日期:">
          <el-date-picker
            v-model="searchForm.startTime"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:">
          <el-date-picker
            v-model="searchForm.endTime"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户姓名或者手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.searchKey"
            placeholder="客户姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="处理业务员姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeSearchKey"
            placeholder="处理业务员姓名或手机号">
          </el-input>
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
        <el-form-item label="客户等级:">
          <el-select
            v-model="searchForm.custLabel"
            clearable
            placeholder="请选择客户等级">
            <el-option
              v-for="val,key,index in custLabel"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店状态:">
          <el-select
            v-model="searchForm.orderStatus"
            clearable
            placeholder="请选择门店状态">
            <el-option
              v-for="item,key,index in orderStatusArr"
              :label="item.name"
              :value="item.val"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <!-- <el-button @click="exportData()" class="export-btn" v-if="isExport">导出</el-button> -->
      </el-form>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border
      @selection-change="selectChange">
      <el-table-column
        prop="applyId"
        label="申请ID"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="applyName"
        label="客户姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="客户号码"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="处理门店"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="currentName"
        label="当前处理人"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="orderStatusText"
        label="门店状态"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="custLabelText"
        label="客户等级(标星)"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="130">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 导出-->
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
          <input type="text" name="exportParams" v-model="exportParams">
          <input type="text" name="exportTitles" v-model="exportTitles">
          <input type="text" name="signId" v-model="signId">
          <input type="text" name="exportType" value="reserving">
    </form>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <!-- 模块组件 -->
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
// 预约中页面
export default {
  data () {
    let userRole = this.$localStorage('userRole') === '1'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('violateOrder')
    return {
      exportPath: this.$baseURL + 'store/account/user/export/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      activeClass: 'active',
      errorClass: 'span',
      titileBar: '不规范操作订单列表',
      searchForm: {
        // 管理员角色(userRole=1)加上默认的搜索时间
        startTime: userRole ? today : '',
        endTime: '',
        orgId: store['orgId'] || '',
        currentName: store['currentName'] || '',
        orderStatus: store['orderStatus'] || '',
        custLabel: store['custLabel'],
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        applyName: store['applyName'] || ''
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      totalRecord: 1,
      applyId: '', // 申请ID
      otherShow: false, // 弹窗是否显示
      userOrgs, // 门店数据
      externalUser: [], // 外部人员渠道信息
      cityList, // 城市数据
      orders: [], // table选中
      // 开始时间禁用
      startDateOptions: {
        // disabledDate (time) {
        //   return time.getTime() < Date.now() - 8.64e7
        // }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      // 客户等级
      custLabel: {
        0: '0星：默认未了解的客户',
        1: '1星：无条件无可贷点',
        2: '2星：有条件暂时不能进件的',
        3: '2星+：有需求邀约上门客户',
        4: '3星：可做小贷的客户',
        5: '4星：可做银行的客户'
      },
      // 门店跟进状态
      orderStatusArr: [
        {val: -1, name: '-1：待跟进:尚未跟进客户'},
        {val: 0, name: '0：跟进过:未了解客户'},
        {val: 1, name: '1：未上门待签约'},
        {val: 2, name: '2：已上门待签约'},
        {val: 3, name: '3：已上门签约'},
        {val: 4, name: '4：进件审核中'},
        {val: 5, name: '5：银行已放款'},
        {val: 6, name: '6：银行已拒绝'},
        {val: 7, name: '7：无可贷点，同行，捣乱无效客户'},
        {val: 8, name: '8：空号/错号'}
      ]
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    exportData () {
      let params = {}
      let roleType = this.$localStorage('userRole')
      Object.assign(params, this.searchForm, {
        roleType
      })
      this.exportParams = JSON.stringify(params)
      this.signId = expireStore('signId')
      let title = [
        {'name': 'applyName', 'title': '客户姓名'},
        {'name': 'custLabelText', 'title': '客户等级(标星)'},
        {'name': 'telephone', 'title': '客户手机'},
        {'name': 'bookTime', 'title': '预约时间'},
        {'name': 'handleTime', 'title': '处理时间'},
        {'name': 'handleDesc', 'title': '处理描述'},
        {'name': 'currentDeal', 'title': '处理业务员'},
        {'name': 'groupName', 'title': '所属组名'},
        {'name': 'teamName', 'title': '所属队名'},
        {'name': 'applyTypeText', 'title': '单子类型'},
        {'name': 'orderTypeText', 'title': '经手类型'},
        {'name': 'orgName', 'title': '处理门店'}
      ]
      this.exportTitles = JSON.stringify(title)
      let formDom = document.getElementById('JS-form-export')
      window.setTimeout(function () {
        formDom.submit()
      }, 100)
    },
    // 开始时间改变
    startDateChange (date) {
      this.searchForm.startTime = date || ''
      this.searchForm.endTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变
    endDateChange (date) {
      this.searchForm.endTime = date || ''
    },
    // table表格选择
    selectChange (arr) {
      this.orders = []
      arr.forEach(item => {
        this.orders.push({
          applyId: item['applyId'],
          orderType: item['orderType']
        })
      })
    },
    // 查看详情
    detailHandle (obj) {
      this.$router.push({
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          type: 'violateOrder'
        }
      })
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('violateOrder', this.searchForm, ['startTime', 'endTime'])
      this.$ajax({
        url: '/store/account/dataset/violateOrder/queryViolateOrderList',
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
