<template>
  <div class="content-box">
    <div class="header__title">门店人员接单记录</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="接单时间-起:">
          <el-date-picker
            v-model="searchForm.startReceviceDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="接单时间-止:">
          <el-date-picker
            v-model="searchForm.endReceviceDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请时间-起:">
          <el-date-picker
            v-model="searchForm.startApplyDate"
            type="date"
            editable
            :picker-options="startApplyOptions"
            @change="startApplyChange"
            placeholder="申请开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请时间-止:">
          <el-date-picker
            v-model="searchForm.endApplyDate"
            type="date"
            editable
            :picker-options="endApplyOptions"
            @change="endApplyChange"
            placeholder="申请结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.applyName"
            placeholder="客户姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="接单人姓名:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeRealName"
            placeholder="接单人姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in status"
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
            placeholder="请选择">
            <el-option
              v-for="item,key,index in orderStatusArr"
              :label="item.name"
              :value="item.val"
              :key="index">
            </el-option>
          </el-select>
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
            filterable
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
        <el-form-item label="分配类型:">
          <el-select
            v-model="searchForm.orderType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in orderType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理描述:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.handleDesc"
            placeholder="请输入处理描述">
          </el-input>
        </el-form-item>
        <el-form-item label="渠道来源:" v-if="adminRole">
          <el-input
            class="kf-search-input"
            v-model="searchForm.channelDetail"
            placeholder="渠道来源">
          </el-input>
        </el-form-item>
        <el-form-item label="渠道类型:">
          <el-select
            v-model="searchForm.channelType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in channelType"
              :label="val"
              :value="key"
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
      :data="tableData"
      border>
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
        label="客户手机"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        label="贷款额度(万)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="loanDeadline"
        label="贷款期限(月)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="statusText"
        label="状态"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="orderStatusText"
        label="门店状态"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="storeRealName"
        label="接单人"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="分配类型"
        min-width="100">
        <template slot-scope="scope">{{orderType[scope.row.orderType]}}</template>
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="所属门店"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="所属组名"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="receiveTime"
        label="接单时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="handleDesc"
        label="处理描述"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="渠道来源"
        min-width="200"
        v-if="adminRole">
        <template slot-scope="scope">
          {{scope.row.channelCode}}-{{scope.row.channelName}}
        </template>
      </el-table-column>
      <el-table-column
         prop="channelTypeText"
        label="渠道类型"
        min-width="120">
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
  </div>
</template>

<script>
// 待分配处理订单页面
export default {
  name: 'store-record',
  data () {
    let {today} = this.$searchDate()
    let authRole = this.$localStorage('userRole')
    let adminRole = authRole === '1' && this.$localStorage('allOrgs') === 'all'
    let isAuth = authRole === '1' || authRole === '6' || authRole === '7' || authRole === '8'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userOrgId = this.$localStorage('userOrgId')
    let userRole = this.$localStorage('userRole') === '1'
    let showOrgId = userRole ? '' : Number(userOrgId)
    // 缓存查询条件
    let store = this.$getStore('storeRecord')
    return {
      searchForm: {
        cityName: store['cityName'] || '',
        orgId: store['orgId'] || showOrgId,
        // 管理员角色(authRole=1、6、7)加上默认的搜索时间
        startReceviceDate: isAuth ? today : '',
        endReceviceDate: '',
        startApplyDate: store['startApplyDate'] || '',
        endApplyDate: store['endApplyDate'] || '',
        applyName: store['applyName'] || '',
        handleDesc: store['handleDesc'] || '',
        channelDetail: store['channelDetail'] || '',
        storeRealName: store['storeRealName'] || '',
        groupName: '',
        orderStatus: store['orderStatus'] || '',
        status: store['status'] || '',
        orderType: store['orderType'] || '',
        channelType: store['channelType'] || '',
        currentPage: store['currentPage'] || 1
      },
      groupNameList: [], // 门店组名列表
      loading: false,
      tableData: [],
      totalRecord: 1,
      adminRole,
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
          return time.getTime() > Date.now()
        }
      },
      // 申请开始时间禁用
      startApplyOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 申请结束时间禁用
      endApplyOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
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
      ],
      // 状态
      status: {
        0: '待处理',
        1: '客服锁定中',
        2: '门店锁定中',
        3: '可转信贷经理',
        4: '转信贷经理中',
        5: '转信贷经理成功',
        6: '转信贷经理失败',
        7: '门店退回',
        8: '过期失效'
      },
      // 经手类型
      orderType: {
        1: '新申请',
        2: '再分配'
      },
      // 渠道类型
      channelType: {
        1: '自有平台',
        2: '推广渠道',
        3: 'API接口',
        4: '历史数据',
        6: '测试数据'
      }
    }
  },
  created () {
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
    this.searchHandle()
  },
  methods: {
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
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startReceviceDate = date || ''
      this.searchForm.endReceviceDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endReceviceDate = date || ''
    },
    // 开始时间改变处理
    startApplyChange (date) {
      this.searchForm.startApplyDate = date || ''
      this.searchForm.endApplyDate = ''
      this.endApplyOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endApplyChange (date) {
      this.searchForm.endApplyDate = date || ''
    },
    // 查询处理
    searchHandle () {
      let searchFlag = !this.searchForm.startReceviceDate && !this.searchForm.endReceviceDate && !this.searchForm.startApplyDate && !this.searchForm.endApplyDate && !this.searchForm.cityName && !this.searchForm.applyName && !this.searchForm.handleDesc && !this.searchForm.channelDetail && !this.searchForm.storeRealName && !this.searchForm.orgId && !this.searchForm.orderStatus && !this.searchForm.status && !this.searchForm.orderType
      if (searchFlag) {
        if (this.searchForm.orderStatus !== 0 && this.searchForm.status !== 0) {
          this.$msg('请至少选择一个条件查询')
          return
        }
      }
      this.tableData = []
      // 缓存查询条件
      this.$setStore('storeRecord', this.searchForm, ['startReceviceDate', 'endReceviceDate'])
      this.$ajax({
        url: '/store/account/work/storeRecord/queryStoreRecRecord',
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