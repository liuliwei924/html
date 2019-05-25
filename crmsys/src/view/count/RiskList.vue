<template>
  <div class="content-box">
    <div class="header__title">命中多头借贷列表</div>
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
        <el-form-item label="客户等级:">
          <el-select
            v-model="searchForm.custLabel"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in custLabel"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单子类型:">
          <el-select
            v-model="searchForm.applyType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in applyType"
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
        <el-form-item label="渠道来源:" v-if="isExport">
          <el-input
            class="kf-search-input"
            v-model="searchForm.channelDetail"
            placeholder="渠道来源">
          </el-input>
        </el-form-item>
        <el-form-item label="资产描述:">
           <el-select
            v-model="searchForm.assetInfo"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in assetInfoType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="城市:">
          <el-select
            v-model="searchForm.cityName"
            clearable
            filterable
            placeholder="请选择城市">
            <el-option
              v-for="item,index in cityNameList"
              :label="item.cityName"
              :value="item.cityName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="命中次数:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.day180appTimes"
            placeholder="命中次数">
          </el-input>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="exportData()" class="export-btn" v-if="isExport">导出</el-button>
      </el-form>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border>
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
        label="多头借贷状态"
        min-width="150">
        <template slot-scope="scope">{{muLoanStatus[scope.row.muLoanStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="day180appTimes"
        label="命中次数"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="handleDesc"
        label="处理描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="assetInfo"
        label="资产描述"
        min-width="200">
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
        label="单子类型"
        min-width="100">
        <template slot-scope="scope">{{applyType[scope.row.applyType]}}</template>
      </el-table-column>
      <el-table-column
        label="分配类型"
        min-width="100">
        <template slot-scope="scope">{{orderType[scope.row.orderType]}}</template>
      </el-table-column>
      <el-table-column
        prop="channelText"
        label="渠道来源"
        min-width="150"
        v-if="isExport">
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
    <!-- 导出-->
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
      <input type="text" name="exportParams" v-model="exportParams">
      <input type="text" name="exportTitles" v-model="exportTitles">
      <input type="text" name="signId" v-model="signId">
      <input type="text" name="exportType" value="riskAllOrder">
    </form>
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
import {expireStore} from '@/utils/utils'
export default {
  name: 'risk-list',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1'
    let showStartDate = isAuth ? lastWeekDay : ''
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('riskList')
    return {
      showCheck: 0,
      exportPath: this.$baseURL + 'store/account/user/export/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      activeClass: 'active',
      errorClass: 'span',
      titileBar: '命中多头借贷列表',
      searchForm: {
        applyType: store['applyType'] || '',
        // 管理员角色加上默认的搜索时间
        startDate: store['startDate'] || '',
        endDate: store['endDate'] || '',
        startHandleDate: store['startHandleDate'] || showStartDate,
        endHandleDate: store['endHandleDate'] || '',
        searchKey: store['searchKey'] || '',
        handleDesc: store['handleDesc'] || '',
        channelDetail: store['channelDetail'] || '',
        assetInfo: store['assetInfo'] || '',
        custLabel: store['custLabel'],
        currentPage: store['currentPage'] || 1,
        orderType: store['orderType'] || '',
        cityName: store['cityName'] || '',
        day180appTimes: store['day180appTimes'] || '',
        everyPage: 10
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      totalRecord: 0,
      cityNameList: [], // 城市数据
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
      // 单子类型
      applyType: {
        1: '优质单',
        2: '普通单',
        3: '垃圾单',
        4: '不押车贷',
        5: '微店单',
        6: '准优质单',
        7: '优质客户'
      },
      // 查询资产信息
      assetInfoType: {
        1: '房产',
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
      muLoanStatus: {
        1: '未查询',
        2: '未命中',
        3: '命中未超过三次',
        4: '命中三次以上',
        5: '查询失败'
      }
    }
  },
  created () {
    this.getMenuRole()
    this.searchHandle()
    this.getCityName()
  },
  methods: {
    // 获取网销城市
    getCityName () {
      this.$ajax({
        url: '/store/account/user/comm/queryNetCity',
        success: data => {
          this.cityNameList = data.attr['cityNameList']
        }
      })
    },
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
        {'name': 'loanAmount', 'title': '申请额度(万)'},
        {'name': 'orderStatusText', 'title': '处理状态'},
        {'name': 'muLoanStatusText', 'title': '多头借贷状态'},
        {'name': 'day180appTimes', 'title': '命中次数'},
        {'name': 'cityName', 'title': '城市'},
        {'name': 'handleDesc', 'title': '处理描述'},
        {'name': 'assetInfo', 'title': '资产描述'},
        {'name': 'handleTime', 'title': '最近处理时间'},
        {'name': 'applyTime', 'title': '申请时间'},
        {'name': 'applyTypeText', 'title': '单子类型'},
        {'name': 'orderTypeText', 'title': '分配类型'},
        {'name': 'channelText', 'title': '渠道来源'}
      ]
      this.exportTitles = JSON.stringify(title)
      let formDom = document.getElementById('JS-form-export')
      window.setTimeout(function () {
        formDom.submit()
      }, 100)
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
    // 查看详情
    detailHandle (obj) {
      let queryObj = {
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          handleDesc: this.searchForm.handleDesc,
          storeSearchKey: this.searchForm.storeSearchKey,
          type: 'riskList'
        }
      }
      let desc = obj.applyName
      if (!obj.applyName) {
        desc = obj.applyId
      }
      this.$emit('addTab', desc + '', queryObj)
      this.$router.push(queryObj)
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件,管理员不存储时间缓存
      this.$setStore('riskList', this.searchForm)
      this.$ajax({
        url: '/store/account/dataset/riskList/queryRiskAllList',
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
  }
}
</script>
