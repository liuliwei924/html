<template>
  <div class="content-box">
    <div class="header__title">用户管理</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="注册日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="显示名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.nickNameAndTel"
            placeholder="显示名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="用户姓名:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.realName"
            placeholder="用户姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="用户状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择用户状态">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实名状态:">
          <el-select
            v-model="searchForm.identityStatus"
            clearable
            placeholder="请选择实名状态">
            <el-option
              v-for="val,key,index in identityStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="customerId"
        label="用户编号"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="用户昵称"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="用户姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="用户状态"
        min-width="100">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        label="实名状态"
        min-width="100">
        <template slot-scope="scope">{{identityStatus[scope.row.identityStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="usableCoin"
        label="用户资产"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="freezeCoin"
        label="冻结资产"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="注册时间"
        min-width="170">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="最近登录时间"
        min-width="170">
      </el-table-column>
      <el-table-column
        prop="lastLoginIp"
        label="最近登录IP"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
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
    <xjTranCust-edit v-model="editShow" :custData="custData" @change="editChange" :status="status"/>
  </div>
</template>

<script>
import XjTranCustEdit from '@/components/xj/XjTranCustEdit'
export default {
  name: 'xj-tranCust',
  data () {
    let {lastWeekDay} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjTranCust')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      searchForm: {
        startDate: '' || lastWeekDay,
        endDate: '',
        nickNameAndTel: store['nickNameAndTel'] || '',
        realName: store['realName'] || '',
        status: store['status'] || '',
        identityStatus: store['identityStatus'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 用户状态
      status: {
        0: '正常',
        1: '冻结'
      },
      // 实名状态
      identityStatus: {
        0: '待审核',
        1: '正确',
        2: '不正确',
        3: '未实名'
      },
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
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
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
    // 编辑
    editHandle (row) {
      this.custData = row
      this.editShow = true
    },
    // 编辑弹窗监听
    editChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.editShow = false
      } else {
        this.editShow = val
      }
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('xjTranCust', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjTranCust/queryCust',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    XjTranCustEdit
  }
}
</script>

