<template>
  <div class="content-box">
    <div class="header__title">所有订单</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
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
        <el-form-item label="申请时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
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
        <el-form-item label="职业身份:">
          <el-select
            v-model="searchForm.workType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in workType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="high-query">
          <div class="query-wrap" v-show="highQuery">
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
            <el-form-item label="处理描述:">
              <el-input
                class="kf-search-input"
                v-model="searchForm.handleDesc"
                placeholder="请输入处理描述">
              </el-input>
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
             <el-form-item v-if="userRole === '1'">>
              <el-select v-model="searchForm.channelCode" filterable clearable placeholder="请选择渠道代号">
                <el-option
                  v-for="(item,index) in channels"
                  :label="item.channelCode"
                  :value="item.channelCode" :key="index">
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
                  :value="Number(key)"
                  :key="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年龄-起:">
              <el-input
                class="kf-search-input"
                v-model="searchForm.startAge"
                placeholder="请输入年龄">
              </el-input>
            </el-form-item>
            <el-form-item label="年龄-止:">
              <el-input
                class="kf-search-input"
                v-model="searchForm.endAge"
                placeholder="请输入年龄">
              </el-input>
            </el-form-item>
            <el-form-item label="性别:">
              <el-select
                v-model="searchForm.sex"
                clearable
                placeholder="请选择">
                <el-option
                  v-for="val,key,index in sex"
                  :label="val"
                  :value="String(key)"
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
            <el-form-item label="客户等级:">
              <el-select
                v-model="searchForm.custLabel"
                clearable
                multiple
                placeholder="请选择">
                <el-option
                  v-for="val,key,index in custLabel"
                  :label="val"
                  :value="String(key)"
                  :key="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="未跟进天数:">
              <el-select
                v-model="searchForm.notDealDay"
                clearable
                placeholder="请选择">
                <el-option
                  v-for="val,key,index in notDealDay"
                  :label="val"
                  :value="String(key)"
                  :key="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="最近成功通话时长:">
              <el-input
                class="kf-search-input"
                v-model="searchForm.curDuration"
                placeholder="最近成功通话时长(分钟)">
              </el-input>
            </el-form-item>
            <el-form-item label="是否专属单:">
              <el-select
                v-model="searchForm.isExOrderFlag"
                clearable
                placeholder="请选择">
                <el-option
                  v-for="val,key,index in isExOrderFlag"
                  :label="val"
                  :value="String(key)"
                  :key="index">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <el-button @click="exportData()" class="export-btn" v-if="isExport">导出</el-button>
        <el-button :loading="loading" @click="clickHighQ" v-if="isExport">{{highQuery ? '高级查询 -' : '高级查询 +'}}</el-button>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button icon="setting" @click="orderSet">设置专属单</el-button>
      <el-button icon="setting" @click="transOther" v-if="isTrans && showCheck">转信贷经理</el-button>
      <div class="header__check">
        <el-radio-group v-model="curOrderStatus">
          <el-radio :disabled="loading" :label="1">所有(<span class="header-mark__text">{{summary['allOrderCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="2">待处理(<span class="header-mark__text">{{summary['waitOrderCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="3">跟进中(<span class="header-mark__text">{{summary['followOrderCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="4">未上门待签约(<span class="header-mark__text">{{summary['notWaitSignCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="5">已上门待签约(<span class="header-mark__text">{{summary['waitSignCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="6">已上门签约(<span class="header-mark__text">{{summary['signedOrderCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="7">进件审核中(<span class="header-mark__text">{{summary['checkOrderCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="8">银行已放款(<span class="header-mark__text">{{summary['loanOrderCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="9">银行已拒绝(<span class="header-mark__text">{{summary['refuseOrderCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="10">无效客户(<span class="header-mark__text">{{summary['invalidOrderCount']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="11">空号/错号(<span class="header-mark__text">{{summary['nullOrderCount']}}</span>)</el-radio>
        </el-radio-group>
      </div>
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
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="sexText"
        label="性别"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        label="申请额度(万)"
        min-width="120">
      </el-table-column>
       <el-table-column
        prop="orderStatusText"
        label="处理状态"
        min-width="130">
        <template slot-scope="scope">
         <el-tag :type="orderStatusType[scope.row.orderStatus]">{{scope.row.orderStatusText}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="handleDesc"
        label="处理描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="客户描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="assetInfo"
        label="资产描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="notDealDay"
        label="未跟进天数"
        min-width="120">
      </el-table-column> 
      <el-table-column
        prop="handleTime"
        label="最近处理时间"
        sortable
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        sortable
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="currentDeal"
        label="处理业务员"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="处理门店"
        min-width="180">
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
        prop="callInfo"
        label="通话情况"
        min-width="180">
      </el-table-column>
       <el-table-column
        prop="curDuration"
        label="最近成功通话时长"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="channelText"
        label="渠道来源"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="channelTypeText"
        label="渠道类型"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="isExOrderFlag"
        label="是否专属单"
        min-width="150">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="130">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="abandonFollow(scope.row)">放弃跟进</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      @size-change="handleSizeChange"
      :page-sizes="[10, 30, 50]"
      :page-size="searchForm.everyPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRecord">
    </el-pagination>
    <!-- 模块组件 -->
    <trans-other
      v-model="otherShow"
      :userOrgs="userOrgs"
      :orders="orders"
      @change="otherChange" />
     <abandon-follow 
      v-model="isAbandonShow" 
      :abandonData="abandonData" 
      @change="abandonEditHandle" />
      <sum-export :defileName="defileName" ref="sumExport"/>
  </div>
</template>

<script>
import TransOther from '@/components/work/TransOther'
import {expireStore} from '@/utils/utils'
import AbandonFollow from '@/components/work/AbandonFollow'
import SumExport from '@/components/export/SumExport.vue'
// 所有订单页面
export default {
  name: 'all-order',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let userRole2 = this.$localStorage('userRole') === '1' ||
    this.$localStorage('userRole') === '6' ||
    this.$localStorage('userRole') === '7' ||
    this.$localStorage('userRole') === '8' ||
    this.$localStorage('userRole') === '9'
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1'
    let showStartDate = isAuth ? lastWeekDay : ''
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isTrans = userRole2
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    let userOrgId = this.$localStorage('userOrgId')
    // 缓存查询条件
    let store = this.$getStore('allOrder')
    let curOrderStatus = Number(this.$sessionStorage('curOrderStatus')) || 1
    let showOrgId = !userRole ? Number(userOrgId) : ''
    return {
      highQuery: true,
      showCheck: 0,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeAllOrder',
        exportParams: ''
      },
      defileName: 'allOrder',
      searchForm: {
        orderStatus: store['orderStatus'] || '',
        status: '',
        // 管理员角色加上默认的搜索时间
        startDate: store['startDate'] || '',
        endDate: store['endDate'] || '',
        startHandleDate: store['startHandleDate'] || showStartDate,
        endHandleDate: store['endHandleDate'] || '',
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        curOrderStatus: store['curOrderStatus'] || 1,
        handleDesc: store['handleDesc'] || '',
        channelCode: store['channelCode'] || '',
        channelType: store['channelType'] || '',
        assetInfo: store['assetInfo'] || '',
        custLabel: store['custLabel'] || '',
        notDealDay: store['notDealDay'] || '',
        curDuration: store['curDuration'] || '',
        custLabelIn: '',
        assetInfoIn: '',
        currentPage: store['currentPage'] || 1,
        orderType: store['orderType'] || '',
        orgId: store['orgId'] || showOrgId,
        groupName: '',
        teamName: '',
        sex: store['sex'] || '',
        workType: store['workType'] || '',
        startAge: store['startAge'] || '',
        endAge: store['endAge'] || '',
        isExOrderFlag: store['isExOrderFlag'] || '',
        everyPage: 10
      },
      // 统计数字
      summary: {
        allOrderCount: '',
        waitOrderCount: '',
        followOrderCount: '',
        waitSignCount: '',
        notWaitSignCount: '',
        signedOrderCount: '',
        checkOrderCount: '',
        loanOrderCount: '',
        refuseOrderCount: '',
        invalidOrderCount: '',
        nullOrderCount: ''
      },
      groupNameList: [], // 门店组名列表
      teamNameList: [], // 门店队名列表
      isTrans, // 是否可以转信贷经理
      isExport, // 是否可以导出
      curOrderStatus: curOrderStatus || 1, // 订单状态(默认待处理)
      loading: false,
      tableData: [],
      searchDetailFlag: '',
      totalRecord: 0,
      applyId: '', // 申请ID
      isShow: false, // 弹窗是否显示
      isAbandonShow: false, // 弹窗是否显示
      abandonData: {},
      otherShow: false,
      userOrgs, // 门店数据
      cityList, // 城市数据
      channels: [],
      orders: [], // table选中
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
      // 单子类型
      orderType: {
        1: '新申请',
        2: '再分配'
      },
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
      // 订单状态样式
      orderStatusType: {
        '-1': 'danger',
        0: 'following',
        1: 'novisit',
        2: 'visited',
        3: 'primary',
        4: 'primary',
        5: 'success',
        6: 'danger',
        7: 'gray',
        8: ''
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
      // 性别
      sex: {
        0: '女',
        1: '男',
        2: '未知'
      },
      muLoanStatus: {
        1: '未查询',
        2: '未命中',
        3: '命中未超过三次',
        4: '命中三次以上',
        5: '查询失败'
      },
      channelType: {
        1: '自有平台',
        2: '推广渠道',
        3: 'API接口',
        4: '历史数据',
        6: '测试数据'
      },
      workType: {
        1: '无固定职业',
        2: '企业主',
        3: '个体户',
        4: '上班族',
        5: '学生'
      },
      notDealDay: {
        1: '1-3天',
        2: '4-7天',
        3: '7天以上'
      },
      // 专属单标识
      isExOrderFlag: {
        1: '是',
        2: '否'
      }
    }
  },
  created () {
    this.getMenuRole()
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
    let searchFlag = !this.searchForm.orgId && !this.searchForm.handleDesc && !this.searchForm.orderType && !this.searchForm.channelDetail && !this.searchForm.sex && !this.searchForm.channelType && !this.searchForm.startAge && !this.searchForm.endAge && !this.searchForm.notDealDay && !this.searchForm.curDuration && !this.searchForm.isExOrderFlag
    let userType = this.$localStorage('userRole') === '1' && this.$localStorage('allOrgs') === 'all'
    let flag = this.searchForm.custLabel.length === 0 && this.searchForm.assetInfo.length === 0
    if (userType && searchFlag && flag) {
      this.highQuery = false
    }

    if(userType){
       this.$ajax({
        url: '/store/user/code/queryAll',
        success: data => {
          this.channels = data.rows
        }
      })
    }
  },
  watch: {
    // 订单状态改变监听
    curOrderStatus (val) {
      this.searchHandle()
    }
  },
  methods: {
    clickHighQ () {
      this.highQuery = !this.highQuery
    },
    exportData () {
      this.$refs.sumExport.show = true
      this.signId = expireStore('signId')
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
    // 开始时间改变处理
    startHandleChange (date) {
      this.searchForm.startHandleDate = date || ''
      this.searchForm.endHandleDate = ''
      this.endHandleOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endHandleChange (date) {
      this.searchForm.endHandleDate = date || ''
    },
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
    // 统计处理
    countHandle () {
      if (this.searchForm.custLabel) {
        this.searchForm.custLabelIn = this.searchForm.custLabel.toString()
      }
      if (this.searchForm.assetInfo) {
        this.searchForm.assetInfoIn = this.searchForm.assetInfo.toString()
      }
      let params = Object.assign({}, this.searchForm)
      delete params.status
      delete params.orderStatus
      this.$ajax({
        url: '/store/account/work/allOrder/queryAllSummary',
        data: params,
        success: data => {
          let count = data.rows[0] || {}
          this.summary = {
            allOrderCount: count['allOrderCount'],
            waitOrderCount: count['waitOrderCount'],
            followOrderCount: count['followOrderCount'],
            notWaitSignCount: count['notWaitSignCount'],
            waitSignCount: count['waitSignCount'],
            signedOrderCount: count['signedOrderCount'],
            checkOrderCount: count['checkOrderCount'],
            loanOrderCount: count['loanOrderCount'],
            refuseOrderCount: count['refuseOrderCount'],
            invalidOrderCount: count['invalidOrderCount'],
            nullOrderCount: count['nullOrderCount']
          }
        }
      })
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
    // 设置专属单
    orderSet () {
      if (this.orders.length === 0) this.$msg('请至少选择一个订单!')
      else {
        this.$alert('设置成专属单后,该单将永久保存在您名下,不再重新分配,是否设置专属单?(每个人的专属单有限，请谨慎设置!)', '提示', {
          type: 'warning',
          customClass: 'msg-delete__dialog',
          showCancelButton: true,
          callback: action => {
            if (action === 'confirm') {
              this.$ajax({
                url: '/store/account/work/waitDeal/orderSet',
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
    // 查看详情
    detailHandle (obj) {
      let queryObj = {
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          handleDesc: this.searchForm.handleDesc,
          searchDetailFlag: this.searchDetailFlag,
          storeSearchKey: this.searchForm.storeSearchKey,
          type: 'allOrder'
        }
      }
      let desc = obj.applyName
      if (!obj.applyName) {
        desc = obj.applyId
      }
      this.$emit('addTab', desc + '', queryObj)
      this.$router.push(queryObj)
    },
    changeStatus () {
      let type = this.curOrderStatus
      this.searchForm.status = 2
      if (type === 2) {
        this.searchForm.orderStatus = -1
      } else if (type === 3) {
        this.searchForm.orderStatus = '0'
      } else if (type === 4) {
        this.searchForm.orderStatus = 1
      } else if (type === 5) {
        this.searchForm.orderStatus = 2
      } else if (type === 6) {
        this.searchForm.orderStatus = 3
      } else if (type === 7) {
        this.searchForm.orderStatus = 4
      } else if (type === 8) {
        this.searchForm.orderStatus = 5
      } else if (type === 9) {
        this.searchForm.orderStatus = 6
      } else if (type === 10) {
        this.searchForm.orderStatus = 7
      } else if (type === 11) {
        this.searchForm.orderStatus = 8
      } else {
        this.searchForm.orderStatus = ''
      }
    },
    // 查询处理
    searchHandle () {
      let userRole = this.$localStorage('userRole') === '1'
      let searchFlag = !this.searchForm.startDate && !this.searchForm.endDate && !this.searchForm.startHandleDate && !this.searchForm.endHandleDate && !this.searchForm.searchKey && !this.searchForm.storeSearchKey && !this.searchForm.handleDesc && !this.searchForm.orderType && !this.searchForm.orgId && !this.searchForm.channelDetail && !this.searchForm.sex && !this.searchForm.channelType && !this.searchForm.workType && !this.searchForm.startAge && !this.searchForm.endAge && !this.searchForm.notDealDay && !this.searchForm.curDuration && !this.searchForm.isExOrderFlag
      if (searchFlag && userRole) {
        if (this.searchForm.custLabel.length === 0 && this.searchForm.assetInfo.length === 0) {
          this.$msg('请至少选择一个条件查询')
          return
        }
      }
      this.exportSearchParams = this.searchForm
      this.$sessionStorage('curOrderStatus', this.curOrderStatus)
      this.changeStatus()
      this.countHandle()
      this.tableData = []
      // 缓存查询条件,管理员不存储时间缓存
      this.$setStore('allOrder', this.searchForm)
      if (this.searchForm.custLabel) {
        this.searchForm.custLabelIn = this.searchForm.custLabel.toString()
      }
      if (this.searchForm.assetInfo) {
        this.searchForm.assetInfoIn = this.searchForm.assetInfo.toString()
      }
      this.$ajax({
        url: '/store/account/work/allOrder/queryAllList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
          this.searchDetailFlag = data.attr.searchDetailFlag
        }
      })
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    },
    handleSizeChange (val) {
      this.searchForm['everyPage'] = val
      this.searchForm.currentPage = 1
      this.searchHandle()
    },
    // 放弃跟进
    abandonFollow (obj) {
      let params = {
        applyId: obj.applyId,
        customerId: obj.lastStore
      }
      this.abandonData = params
      this.isAbandonShow = true
    },
    // 编辑组件监听
    abandonEditHandle (val) {
      if (val === 'search') {
        this.searchHandle()
        this.isAbandonShow = false
      } else {
        this.isAbandonShow = val
      }
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
    TransOther,
    AbandonFollow,
    SumExport
  }
}
</script>
<style>
  .high-query{
    position: relative;
  }
  .high-query .btn{
    border: 1px solid #dcdcdc;
    text-align: center;
    position: absolute;
    width: 90px;
    line-height: 36px;
    top: 0;
    left: 0;
  }
  .header-mark__text{
    color: red;
  }
  .all-order-btn-wrap {
    overflow: hidden;
    width: 100%;
  }
</style>

