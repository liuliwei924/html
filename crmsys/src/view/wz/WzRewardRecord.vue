<template>
  <div class="content-box">
    <div class="header__title">奖励记录</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="用户姓名或手机号:">
          <el-input
            v-model="searchForm.searchKey"
            placeholder="请输入用户姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="领取状态:">
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
        <el-form-item label="奖励时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="奖励时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button icon="plus" @click="auditHandle()">领取审核</el-button>
      </el-form>
    </div>
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
        prop="realName"
        label="姓名"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="rewardDate"
        label="奖励时间"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="rewardType"
        label="奖励类型"
        align="center"
        min-width="120">
        <template slot-scope="scope">{{rewardType[scope.row.rewardType]}}</template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="领取状态"
        align="center"
        min-width="120">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="getDate"
        label="更新时间"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="dealDesc"
        label="处理描述"
        align="center"
        min-width="120">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <wzRawardRecord-edit v-model="auditShow" :commIds="commIds" @change="auditChange" :status="status"/>
  </div>
  </div>
</template>

<script>
import WzRawardRecordEdit from '@/components/wz/WzRawardRecordEdit'
export default {
  name: 'wzRewardRecord-Record',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1'
    return {
      tableData: [],
      totalRecord: 0,
      commIds: [],
      ids: [],
      custData: {},
      addShow: false,
      editShow: false,
      loading: false,
      searchForm: {
        searchKey: '',
        status: '',
        startDate: isAuth ? lastWeekDay : '',
        endDate: '',
        endUpdateDate: '',
        currentPage: 1
      },
      auditShow: false,
      // 支付状态
      status: {
        0: '未领取',
        1: '已领取',
        2: '领取失败'
      },
      // 奖励类型
      rewardType: {
        1: '展业海报周卡'
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
      },
      // 开始时间禁用
      startUpdateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endUpdateOptions: {
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
    // 提现审核
    auditHandle (row) {
      if (this.commIds.length === 0) {
        this.$msg('请先选择要操作的记录！')
        return
      }
      this.auditShow = true
    },
    // 提现审核弹窗监听
    auditChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.auditShow = false
      } else {
        this.auditShow = val
      }
    },
    // table表格选择
    selectChange (arr) {
      this.commIds = []
      arr.forEach(item => {
        this.commIds.push({
          status: item['status'],
          customerId: item['customerId'],
          telephone: item['telephone']
        })
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
      this.$ajax({
        url: '/store/account/wz/wzRewardRecord/queryRewardRecord',
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
    WzRawardRecordEdit
  }
}
</script>
