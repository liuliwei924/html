<template>
  <div class="content-box">
    <div class="header__title">分单信息</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.realName"
            placeholder="姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="能力等级:">
          <el-select
            v-model="searchForm.gradeCode"
            clearable
            placeholder="请选择能力等级">
            <el-option
              v-for="item,index in rankList"
              :label="item.gradeName"
              :value="item.gradeCode"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分单状态:">
          <el-select
            v-model="searchForm.isAllotOrder"
            clearable
            placeholder="请选择分单状态">
            <el-option
              v-for="val,key,index in isAllotOrder"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上线状态:">
          <el-select
            v-model="searchForm.loginStatus"
            clearable
            placeholder="请选择上线状态">
            <el-option
              v-for="val,key,index in loginStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店:">
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
        <el-form-item label="关闭分单原因:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.allotDesc"
            placeholder="关闭分单原因">
          </el-input>
        </el-form-item>
        <el-form-item label="查询状态:">
          <el-select
            v-model="searchForm.queryStatus"
            clearable
            placeholder="请选择查询状态">
            <el-option
              v-for="val,key,index in queryStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工编号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.employeeNo"
            placeholder="员工编号">
          </el-input>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <div class="header__control">
      <el-button icon="setting" @click="batchGetEmployeeNo">批量获取员工编号</el-button>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      @sort-change="sortEvent"
      :data="tableData"
      border 
      @selection-change="selectChange">
      <el-table-column
        type="selection"
        fixed="left"
        width="55">
      </el-table-column>
      <el-table-column
        prop="employeeNo"
        label="员工编号"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="queryStatus"
        label="查询状态"
        min-width="110">
        <template slot-scope="scope">{{queryStatus[scope.row.queryStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="realName"
        label="姓名"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="门店名称"
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
        label="分单状态"
        min-width="110">
        <template slot-scope="scope">{{isAllotOrder[scope.row.isAllotOrder]}}</template>
      </el-table-column>
      <el-table-column
        label="上线状态"
        min-width="110">
        <template slot-scope="scope">{{loginStatus[scope.row.loginStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="allotDesc"
        label="关闭分单原因"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="gradeName"
        label="能力等级"
        min-width="110">
      </el-table-column>
      <el-table-column
        label="业务员能否抢单"
        min-width="130">
        <template slot-scope="scope">{{isRobOrder[scope.row.isRobOrder]}}</template>
      </el-table-column>
      <el-table-column
        prop="ordTotalCount"
        label="分单总数/天"
        sortable
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="dealOrderCount"
        label="处理中笔数"
        sortable
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="notDealCount"
        label="未及时处理数(新分配)"
        sortable
        min-width="190">
      </el-table-column>
      <el-table-column
        prop="agAllotCount"
        label="再分配笔数"
        sortable
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="agNotDealCount"
        label="未及时处理数"
        sortable
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="visitCount"
        label="上门单量/天"
        sortable
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="signCount"
        label="签单数量/天"
        sortable
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="backCount"
        label="回款笔数/天"
        sortable
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="backAmount"
        label="回款金额/天"
        sortable
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="invalidCount"
        label="不能做单数"
        sortable
        min-width="130">
      </el-table-column>
      <!--<el-table-column
        prop="stopAllotDate"
        label="计算回款数日期"
        min-width="130">
      </el-table-column>-->
      <el-table-column
	      fixed="right"
	      label="操作"
	      width="150">
	      <template slot-scope="scope">
           <el-button type="text" size="small" @click="leaveDealWith(scope.row)">离职处理</el-button>
           <el-button v-if="scope.row.queryStatus === 0 || scope.row.queryStatus === 2" type="text" size="small" @click="updateEmployee(scope.row)">修改编号</el-button>
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
    <!-- 模块组件 -->
      <leave-dealWith 
      v-model="isLeaveShow" 
      :userOrgs="userOrgs"
      :leavelCustId="leavelCustId"
      :realName="realName"
      @change="leaveEditHandle" />
      <allot-orderEdit 
      v-model="isInfoShow" 
      :editData="editData"
      @change="allotEditHandle" />
	</div>
</template>

<script>
import LeaveDealWith from '@/components/work/LeaveDealWith'
import AllotOrderEdit from '@/components/config/AllotOrderEdit'
// 操作员列表页面
export default {
  name: 'allotOrderInfo',
  data () {
    // 缓存查询条件
    let store = this.$getStore('allotOrderInfo')
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    return {
      searchForm: {
        realName: store['realName'] || '',
        orgId: store['orgId'] || '',
        gradeCode: store['gradeCode'] || '',
        isAllotOrder: store['isAllotOrder'] || '',
        loginStatus: store['loginStatus'] || '',
        groupName: store['groupName'] || '',
        teamName: store['teamName'] || '',
        allotDesc: store['allotDesc'] || '',
        employeeNo: store['employeeNo'] || '',
        queryStatus: store['queryStatus'] || '',
        currentPage: store['currentPage'] || 1,
        userOrgs, // 门店数据
        orderBy: '',
        orderValue: ''
      },
      userOrgs, // 门店数据
      leavelCustId: '',
      realName: '',
      loading: false,
      tableData: [],
      totalRecord: 1,
      isShow: false, // 弹窗是否显示
      isInfoShow: false, // 编辑信息弹窗是否显示
      isLeaveShow: false, // 编辑信息弹窗是否显示
      editData: {},
      custInfo: [], // table选中
      leaveData: {},
      roleList: [], // 权限角色列表
      groupNameList: [],
      teamNameList: [], // 门店队名列表
      rankList: [], // 能力等级列表
      netOrgList: [], // 网销门店数据
      // 是否可抢单
      isAllotOrder: {
        0: '不可分单',
        1: '可分单',
        2: '暂停分单',
        3: '请假中',
        4: '准分单'
      },
      // 业务员能否抢单
      isRobOrder: {
        0: '不可抢',
        1: '可抢'
      },
      // 在线状态
      loginStatus: {
        0: '离线',
        1: '在线',
        2: '忙碌',
        3: '离开',
        4: '自动退出'
      },
      queryStatus: {
        0: '未查询',
        1: '查询成功',
        2: '查询失败'
      }
    }
  },
  created () {
    this.searchHandle()
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
    this.getRankList()
    this.getNetOrgList()
  },
  methods: {
     // table表格选择
    selectChange (arr) {
      this.custInfo = []
      arr.forEach(item => {
        this.custInfo.push({
          customerId: item['customerId'],
          realName: item['realName'],
          queryStatus: item['queryStatus'],
          orgNo: item['orgNo']
        })
      })
    },
    // 批量获取员工编号
    batchGetEmployeeNo () {
      if (this.custInfo.length === 0) this.$msg('请至少选择一个用户!')
      else {
        this.$alert('批量获取员工编号', '提示', {
          type: 'warning',
          customClass: 'msg-delete__dialog',
          showCancelButton: true,
          callback: action => {
            if (action === 'confirm') {
              this.$ajax({
                url: '/store/account/config/allotOrderInfo/batchGetEmployeeNo',
                data: {
                  str: JSON.stringify({custInfo: this.custInfo})
                },
                success: () => {
                  this.$message('操作成功')
                  this.searchHandle()
                }
              })
            }
          }
        })
      }
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
    // 获取能力等级列表
    getRankList () {
      this.$ajax({
        url: '/store/account/config/allotOrderInfo/queryRankList',
        success: data => {
          this.rankList = data.attr['rankList'] || []
        }
      })
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('allotOrderInfo', this.searchForm)
      this.$ajax({
        url: '/store/account/config/allotOrderInfo/queryAllotOrderList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 离职处理
    leaveDealWith (obj) {
      this.leavelCustId = obj.customerId || ''
      this.realName = obj.realName
      this.isLeaveShow = true
    },
    // 离职处理组件监听
    leaveEditHandle (val) {
      if (val === 'search') {
        this.searchHandle()
        this.isLeaveShow = false
      } else {
        this.isLeaveShow = val
      }
    },
     // 修改信息
    updateEmployee (obj) {
      this.editData = obj
      this.isInfoShow = true
    },
    // 编辑组件监听
    allotEditHandle (val) {
      if (val === 'search') {
        this.searchHandle()
        this.isInfoShow = false
      } else {
        this.isInfoShow = val
      }
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    LeaveDealWith,
    AllotOrderEdit
  }
}
</script>
