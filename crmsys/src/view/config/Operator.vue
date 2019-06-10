<template>
  <div class="content-box">
    <div class="header__title">操作员列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="用户编号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.customerId"
            placeholder="用户编号">
          </el-input>
        </el-form-item>
        <el-form-item label="用户角色:">
          <el-select
            v-model="searchForm.userRoleId"
            clearable
            placeholder="请选择角色">
            <el-option
              v-for="val,key,index in roleType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.userName"
            placeholder="姓名或手机号">
          </el-input>
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
         <el-button :loading="loading" @click="searchHandle">查询</el-button>
         <el-button  class="kf-btn" @click="addUser()">增加用户</el-button>
         <el-button  class="kf-btn" @click="addUser()">离职处理</el-button>
      </el-form>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border>
      <el-table-column
        prop="customerId"
        label="用户编号"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="orgNo"
        label="门店编号"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="门店名称"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="权限角色"
        min-width="110">
      </el-table-column>
      <el-table-column
        label="用户角色"
        min-width="110">
        <template slot-scope="scope">{{roleType[scope.row.roleType]}}</template>
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="组名"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="teamName"
        label="队名"
        min-width="110">
      </el-table-column>
      <el-table-column
        label="分单状态"
        min-width="110">
        <template slot-scope="scope">{{isAllotOrder[scope.row.isAllotOrder]}}</template>
      </el-table-column>
      <el-table-column
        label="等级"
        min-width="100">
        <template slot-scope="scope">{{gradeCodes[scope.row.gradeCode]}}</template>
      </el-table-column>
      <el-table-column
	      fixed="right"
	      label="操作"
	      width="200">
	      <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)" v-if="userType === '1'">编辑</el-button>
          <el-button type="text" size="small" @click="editInfo(scope.row)">编辑信息</el-button>
          <el-button type="text" size="small" @click="invalidHandle(scope.row.customerId)" v-if="userType === '1'">用户失效</el-button>
          <el-button type="text" size="small" @click="resetPwd" v-if="userType === '1'">重置密码</el-button>
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
    <operator-edit
      v-model="isShow"
      :editData="editData"
      :roleList="roleList"
      :userOrgs="userOrgs"
      :gradeCode="gradeCode"
      :isAllotOrder="isAllotOrder"
      :authId="authId"
      @change="editChange" />
       <!-- 编辑信息弹窗 -->
      <operInfo-edit v-model="isInfoShow"
      :editData="editData"
      :roleList="roleList"
      :userOrgs="userOrgs"
      :gradeCode="gradeCode"
      :isAllotOrder="isAllotOrder"
      @change="infoEditHandle" />
      <edit-pwd :isShowPwd="isShowPwd" @close="closePwdDialog" />
      <!-- 微信变更弹窗 -->
      <weixin-edit v-model="isWexinShow" :customerId="customerId" :oldTel="oldTel" @change="weixinEditHandle" />
      <el-dialog class="edit-dialog" title="增加用户" v-model="showAdduser">
      <el-form ref="form2" :model="adduserForm" label-width="150px">
        <el-form-item label="手机号">
          <el-input v-model="adduserForm.telephone" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="adduserForm.userName" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="渠道">
          <el-input v-model="adduserForm.channelDetail" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item class="kf-dialog-btn">
          <el-button @click="addUserSubmit" :disabled="isLoading" :loading="isLoading">确认</el-button>
          <el-button @click="showAdduser = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
	</div>
</template>

<script>
import OperatorEdit from '@/components/config/OperatorEdit'
import OperInfoEdit from '@/components/config/OperInfoEdit'
import WeixinEdit from '@/components/config/WeixinEdit'
import EditPwd from '@/components/config/EditPwd'
// 操作员列表页面
export default {
  name: 'operator',
  data () {
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userType = this.$localStorage('userRole') || 0
    // 缓存查询条件
    let store = this.$getStore('operator')
    let roleType = {
      2: '客服',
      3: '业务员',
      6: '门店负责人',
      7: '门店经理',
      8: '门店主管',
      9: '门店队长',
      10: '外部渠道用户'
    }
    if (userType === '1') roleType = Object.assign({1: '管理员'}, roleType)
    return {
      searchForm: {
        customerId: store['customerId'] || '',
        userRoleId: store['userRoleId'] || '',
        userName: store['userName'] || '',
        orgId: store['orgId'] || '',
        groupName: store['groupName'] || '',
        teamName: store['teamName'] || '',
        currentPage: 1
      },
      customerId: '',
      groupNameList: [], // 门店组名列表
      teamNameList: [], // 门店队名列表
      oldTel: '',
      loading: false,
      tableData: [],
      totalRecord: 1,
      isShowPwd: false,
      isShow: false, // 弹窗是否显示
      isInfoShow: false, // 编辑信息弹窗是否显示
      isWexinShow: false, // 微信弹窗是否显示
      showAdduser: false,
      isLoading: false,
      editData: {},
      roleList: [], // 权限角色列表
      userOrgs, // 门店数据
      roleType,  // 用户角色
      authId: '', // 权限Id
      // 是否可抢单
      isAllotOrder: {
        0: '不可分单',
        1: '可分单',
        2: '暂停分单',
        3: '请假中',
        4: '准分单'
      },
      // 等级
      gradeCode: {},
      gradeCodes: {},
      userType: userType,
      adduserForm: {
        userName: '',
        telephone: '',
        channelDetail: ''
      }
    }
  },
  created () {
    this.getGrades()
    this.searchHandle()
    this.queryRole()
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
  },
  methods: {
    closePwdDialog (str) {
      this.isShowPwd = false
      if (str) {
        this.searchHandle()
      }
    },
    resetPwd () {
      this.isShowPwd = true
    },
    getGrades () {
      this.$ajax({
        url: '/store/account/config/operator/queryGradeList',
        success: data => {
          let obj = {}
          let objs = {}
          for (var i = 0; i < data.rows.length; i++) {
            obj[data.rows[i]['gradeCode']] = data.rows[i]['gradeName'] + '-最大分单数' + data.rows[i]['maxCount'] + '天'
            objs[data.rows[i]['gradeCode']] = data.rows[i]['gradeName']
          }
          this.gradeCode = obj
          this.gradeCodes = objs
        }
      })
    },
    addUserSubmit () {
      this.isLoading = true
      this.$ajax({
        url: '/store/account/config/operator/addUser',
        data: this.adduserForm,
        success: data => {
          this.$message({message: '添加成功', type: 'success'})
          this.showAdduser = false
          this.isLoading = false
          this.searchHandle()
        },
        fail: data => {
          this.$msg(data.message)
          this.isLoading = false
        }
      })
      this.adduserForm.telephone = ''
      this.adduserForm.channelDetail = ''
      this.adduserForm.userName = ''
    },
    addUser () {
      this.showAdduser = true
    },
    // 查询权限角色列表
    queryRole () {
      this.$ajax({
        url: '/store/account/config/operator/queryRoleList',
        success: data => {
          this.roleList = data.rows || []
        }
      })
    },
    // 编辑处理
    editHandle (row) {
      this.editData = row
      this.authId = row.roleId
      this.isShow = true
    },
    // 编辑信息门店经理权限
    editInfo (row) {
      this.editData = row
      this.isInfoShow = true
    },
    editWeixin (customerId, telephone) {
      this.customerId = customerId
      this.oldTel = telephone
      this.isWexinShow = true
    },
    weixinEditHandle (val) {
      if (!val) {
        this.isWexinShow = false
      }
      this.searchHandle()
    },
    infoEditHandle (val) {
      if (!val) {
        this.isInfoShow = false
      }
      this.searchHandle()
    },
    // 编辑组件监听
    editChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.isShow = false
      } else {
        this.isShow = val
      }
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('operator', this.searchForm)
      this.$ajax({
        url: '/store/account/config/operator/queryUserList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    invalidHandle (customerId) {
      this.$confirm('此操作将该用户设置为失效, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          url: '/store/account/config/operator/userInvalid ',
          data: {customerId},
          success: data => {
            this.search(this.formCurrentPage)
            this.$message({message: '操作成功', type: 'success'})
          }
        })
      }).catch(() => {
      })
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
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    OperatorEdit,
    OperInfoEdit,
    WeixinEdit,
    EditPwd
  }
}
</script>
