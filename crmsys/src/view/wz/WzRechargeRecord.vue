<template>
  <div class="content-box">
    <div class="header__title">充值记录</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="用户姓名或手机号:">
          <el-input
            v-model="searchForm.searchKey"
            placeholder="请输入用户姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="支付状态:">
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
        <el-form-item label="充值时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="充值时间-止:">
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
      </el-form>
    </div>
    <el-table
      class="content__table"
      :data="tableData"
      border>
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
        prop="createTime"
        label="充值时间"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="status"
        label="支付状态"
        align="center"
        min-width="120">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="订单编号"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="transactionId"
        label="微信支付订单号"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="rechargeChannel"
        label="充值通道"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="充值金额"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="errCode"
        label="错误代码"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="errCodeDesc"
        label="错误信息"
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
  </div>
  </div>
</template>

<script>
export default {
  name: 'wzRecharge-Record',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1'
    return {
      tableData: [],
      totalRecord: 0,
      ids: [],
      addShow: false,
      editShow: false,
      loading: false,
      searchForm: {
        searchKey: '',
        status: '',
        startDate: isAuth ? lastWeekDay : '',
        endDate: '',
        currentPage: 1
      },
      auditShow: false,
      // 支付状态
      status: {
        0: '待支付',
        1: '支付成功',
        2: '支付失败',
        3: '交易中',
        4: '已退款'
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
    // 查询
    searchHandle () {
      this.tableData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/wz/wzRechargeRecord/queryRechargeRecord',
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

  }
}
</script>
