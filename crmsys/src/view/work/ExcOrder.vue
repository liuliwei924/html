<template>
  <div class="content-box">
    <div class="header__title">专属订单</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="分配时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分配时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="最近处理时间-起:">
          <el-date-picker
            v-model="searchForm.startHandleDate"
            type="date"
            editable
            :picker-options="startHandleOptions"
            @change="startHandleChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最近处理时间-止:">
          <el-date-picker
            v-model="searchForm.endHandleDate"
            type="date"
            editable
            :picker-options="endHandleOptions"
            @change="endHandleChange"
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
        <el-form-item label="处理员业务姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeSearchKey"
            placeholder="处理员业务姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="处理状态:">
          <el-select
            v-model="searchForm.orderStatus"
            clearable
            placeholder="请选择处理状态">
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
            clearable
            @change="changeGroupHandle"
            placeholder="请选择组名">
            <el-option
              v-for="item,index in groupNameList"
              :label="item.groupName"
              :value="item.groupName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属队名:">
          <el-select
            v-model="searchForm.teamName"
            clearable
            placeholder="请选择队名">
            <el-option
              v-for="item,index in teamNameList"
              :label="item.teamName"
              :value="item.teamName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户等级:">
          <el-select
            v-model="searchForm.custLabel"
            clearable
            multiple
            placeholder="请选择">
            <el-option
              v-for="val,key,index in custLabel"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产描述:">
           <el-select
            v-model="searchForm.assetInfo"
            clearable
            multiple
            placeholder="请选择">
            <el-option
              v-for="val,key,index in assetInfoType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道类型">
           <el-select v-model="searchForm.channelType"
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
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button icon="setting" @click="cancelOrder">批量取消专属单</el-button>
      <el-button icon="setting" @click="transOther" v-if="isTrans && showCheck">转信贷经理</el-button>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border
      @selection-change="selectChange">
      <el-table-column
        type="selection"
        fixed="left"
        width="55">
      </el-table-column>
      <el-table-column
        prop="applyName"
        label="客户姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="custLabel"
        label="客户等级(标星)"
        min-width="200">
        <template slot-scope="scope">{{custLabel[scope.row.custLabel]}}</template>
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="客户手机"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        label="申请金额(万)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="assetInfo"
        label="资产描述"
        min-width="200">
      </el-table-column> 
      <el-table-column
        prop="orderStatusText"
        label="处理状态"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="handleDesc"
        label="处理描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="handleTime"
        label="最近处理时间"
        sortable
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="分配时间"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="处理门店"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="currentDeal"
        label="业务处理员"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="所属组名"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="teamName"
        label="所属队名"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="分配类型"
        min-width="100">
        <template slot-scope="scope">{{orderType[scope.row.orderType]}}</template>
      </el-table-column>
      <el-table-column
        prop="channelTypeText"
        label="渠道类型"
        min-width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <trans-other
      v-model="otherShow"
      :userOrgs="userOrgs"
      :orders="orders"
      :excOrderFlag="excOrderFlag"
      @change="otherChange" />
  </div>
</template>

<script>
import TransOther from '@/components/work/TransOther'
// 专属订单页面
export default {
  name: 'exc-order',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1' || authRole === '6' || authRole === '7' || authRole === '8'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isTrans = authRole === '1' || this.$localStorage('userRole') === '7'
    // 缓存查询条件
    let store = this.$getStore('excOrder')
    return {
      searchForm: {
        orgId: store['orgId'] || '',
        cityName: store['cityName'] || '',
        // 管理员角色(authRole=1、6、7)加上默认的搜索时间
        startDate: isAuth ? lastWeekDay : '',
        endDate: '',
        startHandleDate: store['startHandleDate'] || '',
        endHandleDate: store['endHandleDate'] || '',
        custLabel: store['custLabel'] || '',
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        orderStatus: store['orderStatus'] || '',
        assetInfo: store['assetInfo'] || '',
        custLabelIn: '',
        assetInfoIn: '',
        groupName: '',
        teamName: '',
        channelType: store['channelType'] || '',
        currentPage: store['currentPage'] || 1
      },
      groupNameList: [], // 门店组名列表
      teamNameList: [], // 门店队名列表
      loading: false,
      tableData: [],
      totalRecord: 1,
      excOrderFlag: '1',
      otherShow: false,
      userOrgs, // 门店数据
      cityList, // 城市数据
      orders: [], // table选中
      isTrans, // 是否可以转信贷经理
      showCheck: 0,
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
      // 处理开始时间禁用
      startHandleOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 处理结束时间禁用
      endHandleOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 经手类型
      orderType: {
        1: '新申请',
        2: '再分配'
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
      // 查询资产信息
      assetInfoType: {
        0: '本地房',
        1: '外地房',
        2: '车产',
        3: '保单',
        4: '社保',
        5: '公积金',
        6: '微粒贷'
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
    this.getMenuRole()
    this.searchHandle()
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
  },
  methods: {
     // 改变门店的状态
    changeOrgHandle () {
      if (this.searchForm.orgId) {
        this.getGroupList()
      } else {
        this.searchForm.groupName = ''
        this.searchForm.teamName = ''
        this.groupNameList = []
      }
    },
    // 改变组名的状态
    changeGroupHandle () {
      if (this.searchForm.groupName) {
        this.getTeamList()
      } else {
        this.searchForm.teamName = ''
        this.teamNameList = []
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
    // 获取队列表
    getTeamList () {
      if (!this.searchForm.groupName) {
        return
      }
      this.$ajax({
        url: '/store/account/user/comm/queryOrgTeamList',
        data: {
          orgId: this.searchForm.orgId,
          groupName: this.searchForm.groupName,
          fullLoading: true
        },
        success: data => {
          this.teamNameList = data.rows || []
          this.searchForm.teamName = ''
        }
      })
    },
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endDate = date || ''
    },
    // 开始处理时间改变
    startHandleChange (date) {
      this.searchForm.startHandleDate = date || ''
      this.searchForm.endHandleDate = ''
      this.endHandleOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束处理时间改变
    endHandleChange (date) {
      this.searchForm.endHandleDate = date || ''
    },
    // table表格选择
    selectChange (arr) {
      this.orders = []
      arr.forEach(item => {
        this.orders.push({
          applyId: item['applyId'],
          orderType: item['orderType'],
          customerId: item['customerId']
        })
      })
    },
    // 转信贷经理
    transOther () {
      if (this.orders.length === 0) this.$msg('请至少选择一个订单!')
      else {
        this.otherShow = true
      }
    },
        // 转信贷经理组件监听
    otherChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.otherShow = false
      } else {
        this.otherShow = val
      }
    },
    // 批量取消专属单
    cancelOrder () {
      if (this.orders.length === 0) this.$msg('请至少选择一个订单!')
      else {
        this.$alert('取消专属后,这些订单立即会被重新分配,是否取消?', '提示', {
          type: 'warning',
          customClass: 'msg-delete__dialog',
          showCancelButton: true,
          callback: action => {
            if (action === 'confirm') {
              this.$ajax({
                url: '/store/account/work/waitDeal/cancleOrder',
                data: {
                  str: JSON.stringify({orders: this.orders})
                },
                success: () => {
                  this.searchHandle()
                }
              })
            }
          }
        })
      }
    },
    // 查看详情
    detailHandle (obj) {
      let queryObj = {
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          storeSearchKey: this.searchForm.storeSearchKey
        }
      }
      let desc = obj.applyName
      if (!obj.applyName) {
        desc = obj.applyId
      }
      this.$emit('addTab', desc + '', queryObj)
      this.$router.push(queryObj)
    },
    // 经手记录组件监听
    recordChange (val) {
      this.isShow = val
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('excOrder', this.searchForm, ['startDate', 'endDate'])
      if (this.searchForm.custLabel) {
        this.searchForm.custLabelIn = this.searchForm.custLabel.toString()
      }
      if (this.searchForm.assetInfo) {
        this.searchForm.assetInfoIn = this.searchForm.assetInfo.toString()
      }
      this.$ajax({
        url: '/store/account/work/excOrder/queryExeOrderList',
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
    },
    // 获取菜单权限
    getMenuRole () {
      let menuCode = this.$localStorage('subPath')
      let checkUrl = this.$localStorage('checkMenus')
      if (checkUrl.indexOf(menuCode) >= 0) {
        this.showCheck = 1
      } else {
        this.showCheck = 0
      }
    }
  },
  components: {
    TransOther
  }
}
</script>
