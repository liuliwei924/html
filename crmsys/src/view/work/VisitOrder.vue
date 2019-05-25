<template>
  <div class="content-box">
    <div class="header__title">已上门</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
         <el-form-item label="已上门时间-起:">
          <el-date-picker
            v-model="searchForm.startVisitDate"
            type="date"
            editable
            :picker-options="startVisitOptions"
            @change="startHandleChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="已上门时间-止:">
          <el-date-picker
            v-model="searchForm.endVisitDate"
            type="date"
            editable
            :picker-options="endVisitOptions"
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
        <el-form-item label="处理业务员姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeSearchKey"
            placeholder="处理业务员姓名或手机号">
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
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="exportData()" class="export-btn" v-if="isExport">导出</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button icon="setting" @click="orderSet">设置专属单</el-button>
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
        prop="loanAmount"
        label="申请金额(万)"
        sortable
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
        prop="visitTime"
        label="上门时间"
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
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
        </template>
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
// 处理中页面
export default {
  name: 'visitOrder',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1' || authRole === '6' || authRole === '7' || authRole === '8'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('visitOrder')
    return {
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeVisitOrder',
        exportParams: ''
      },
      defileName: 'visitOrder',
      searchForm: {
        orgId: store['orgId'] || '',
        // 管理员角色(userRole=1)加上默认的搜索时间
        startVisitDate: isAuth ? lastWeekDay : '',
        endVisitDate: '',
        custLabel: store['custLabel'],
        handleDesc: store['handleDesc'] || '',
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        currentPage: store['currentPage'] || 1,
        groupName: '',
        teamName: ''
      },
      groupNameList: [], // 门店组名列表
      teamNameList: [], // 门店队名列表
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      totalRecord: 1,
      applyId: '', // 申请ID
      isShow: false, // 弹窗是否显示
      userOrgs, // 门店数据
      cityList, // 城市数据
      orders: [], // table选中
      // 处理开始时间禁用
      startVisitOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 处理结束时间禁用
      endVisitOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 经手类型
      orderType: {
        1: '新申请',
        2: '再分配'
      },
      // 客户等级
      custLabel: {
        0: '0星：默认未了解的客户',
        1: '1星：无条件无可贷点',
        2: '2星：有条件暂时不能进件的',
        3: '2星+：有需求邀约上门客户',
        4: '3星：可做小贷的客户',
        5: '4星：可做银行的客户'
      }
    }
  },
  created () {
    this.searchHandle()
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
  },
  methods: {
    exportData () {
      this.$refs.sumExport.show = true
      this.signId = expireStore('signId')
    },
    // 开始时间改变处理
    startHandleChange (date) {
      this.searchForm.startVisitDate = date || ''
      this.searchForm.endVisitDate = ''
      this.endVisitOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endHandleChange (date) {
      this.searchForm.endVisitDate = date || ''
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
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.exportSearchParams = this.searchForm
      // 缓存查询条件
      this.$setStore('visitOrder', this.searchForm, ['startVisitDate', 'endVisitDate'])
      this.$ajax({
        url: '/store/account/work/visitOrder/queryVisitOrderList',
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
    }
  },
  components: {
    SumExport
  }
}
</script>
