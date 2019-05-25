<template>
  <div class="content-box">
    <div class="header__title">对外分配池</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="创建时间-起:">
          <el-date-picker
            v-model="searchForm.startCreateDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间-止:">
          <el-date-picker
            v-model="searchForm.endCreateDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item
        v-if="notOutUser"
        label="处理人:"
        :rules="{required: false, message: '处理人不能为空'}">
        <el-select
          v-model="searchForm.customerId"
          filterable
          clearable
          placeholder="请选择处理人">
          <el-option
            v-for="item,index in externalUser"
            :label="item.realName"
            :value="item.customerId"
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
      border>
      <el-table-column
        prop="createTime"
        label="日期"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="exportCount"
        label="数量"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="处理人"
        min-width="130">
      </el-table-column>
      <el-table-column
        v-if="outUser"
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="exportData(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 导出-->
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
          <input type="text" name="exportParams" v-model="exportParams">
          <input type="text" name="exportTitles" v-model="exportTitles">
          <input type="text" name="signId" v-model="signId">
          <input type="text" name="exportType" value="foreignAllotPond">
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
// 预约中页面
export default {
  name: 'foreignAllotPond',
  data () {
    let {today} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let authRole = this.$localStorage('userRole')
    let notOutUser = authRole !== '10'
    let outUser = authRole === '10' || authRole === '1'
    let isAuth = authRole === '1' || authRole === '6' || authRole === '7' || authRole === '8'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('foreignAllotPond')
    return {
      exportPath: this.$baseURL + 'store/account/user/export/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      activeClass: 'active',
      errorClass: 'span',
      titileBar: '对外分配列表',
      searchForm: {
        // 管理员角色(userRole=1)加上默认的搜索时间
        startCreateDate: isAuth ? today : '',
        endCreateDate: '',
        customerId: store['customerId'] || '',
        currentPage: store['currentPage'] || 1
      },
      authRole,
      userRole,
      notOutUser,
      outUser,
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      totalRecord: 1,
      applyId: '', // 申请ID
      isShow: false, // 弹窗是否显示
      userOrgs, // 门店数据
      cityList, // 城市数据
      externalUser: [], // 外部人员渠道信息
      // 开始时间禁用
      startDateOptions: {
        // disabledDate (time) {
        //   return time.getTime() < Date.now() - 8.64e7
        // }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created () {
    this.searchHandle()
    if (this.notOutUser) {
      this.getExternalUser()
    }
  },
  methods: {
    exportData (row) {
      let params = {}
      let roleType = this.$localStorage('userRole')
      let customerId = row.customerId
      let createTime = row.createTime
      Object.assign(params, this.searchForm, {
        roleType, customerId, createTime
      })
      this.exportParams = JSON.stringify(params)
      this.signId = expireStore('signId')
      let title = [
        {'name': 'recordDate', 'title': '创建日期'},
        {'name': 'applyName', 'title': '客户姓名'},
        {'name': 'telephone', 'title': '客户手机'},
        {'name': 'cityName', 'title': '城市'},
        {'name': 'houseType', 'title': '房产情况'},
        {'name': 'carType', 'title': '车产情况'},
        {'name': 'insure', 'title': '保险情况'},
        {'name': 'loanAmount', 'title': '申请金额(万)'},
        {'name': 'haveWeiLi', 'title': '微粒贷额度(元)'},
        {'name': 'zimaScore', 'title': '芝麻信用分'},
        {'name': 'fundType', 'title': '公积金情况'},
        {'name': 'socialType', 'title': '社保情况'},
        {'name': 'income', 'title': '月收入'},
        {'name': 'wagesType', 'title': '工资发放形式'}
      ]
      this.exportTitles = JSON.stringify(title)
      let formDom = document.getElementById('JS-form-export')
      window.setTimeout(function () {
        formDom.submit()
      }, 100)
    },
    // 开始时间改变
    startDateChange (date) {
      this.searchForm.startCreateDate = date || ''
      this.searchForm.endCreateDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变
    endDateChange (date) {
      this.searchForm.endCreateDate = date || ''
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
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('foreignAllotPond', this.searchForm, ['startCreateDate', 'endCreateDate'])
      this.$ajax({
        url: '/store/account/work/foreignAllotPond/queryForeignAllotPond',
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
    // 获取外部渠道人员信息
    getExternalUser () {
      this.$ajax({
        url: '/store/account/user/comm/queryExternalUser',
        success: data => {
          this.externalUser = data.rows || []
        }
      })
    }
  }
}
</script>
