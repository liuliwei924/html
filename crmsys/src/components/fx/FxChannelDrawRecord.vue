<template>
  <div class="fx-datail-record">
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="工号" prop="workNo">
          <el-input v-model="searchForm.workNo" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="姓名/手机" prop="realName">
          <el-input v-model="searchForm.realName" placeholder="姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="提现状态" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="提现状态">
            <el-option label="待审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="提现取消" value="2"></el-option>
            <el-option label="交易中" value="3"></el-option>
            <el-option label="提现成功" value="4"></el-option>
            <el-option label="失败" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请开始日期:" prop="createStartTime">
          <el-date-picker
            v-model="searchForm.createStartTime"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="申请开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请结束日期:" prop="createEndTime">
          <el-date-picker
            v-model="searchForm.createEndTime"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="申请结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border @selection-change="selectChange">
      <el-table-column prop="workNo" label="工号" align="center" width="90">
      </el-table-column>
      <el-table-column prop="realName" label="姓名" align="center" width="90">
      </el-table-column>
      <el-table-column prop="telephone" label="手机号" align="center">
      </el-table-column>
      <el-table-column prop="cardNo" label="身份证" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="提现金额" align="center">
      </el-table-column>
      <el-table-column prop="realAmount" label="实发金额" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center"  min-width="100">
        <template slot-scope="scope">
          <el-tag v-if ="scope.row.status===0">待审核</el-tag>
          <el-tag v-if ="scope.row.status===1" type="success">审核通过</el-tag>
          <el-tag v-if ="scope.row.status===2" type="danger">提现取消</el-tag>
          <el-tag v-if ="scope.row.status===3" type="primary">交易中</el-tag>
          <el-tag v-if ="scope.row.status===4" type="success">提现成功</el-tag>
          <el-tag v-if ="scope.row.status===5" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="auditDesc" label="审核描述" align="center">
      </el-table-column>
      <el-table-column prop="auditTime" label="审核时间" align="center">
      </el-table-column>
      <el-table-column prop="sendBy" label="发放人" align="center">
      </el-table-column>
      <el-table-column prop="sendTime" label="发放时间" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="提现时间" align="center">
      </el-table-column> 
    </el-table>
    <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
    </el-pagination>
  </div>
</template>


<script>
export default {
  name: 'fxChannelDraw-record',
  data () {
    let custId = this.$route.query['custId'] || ''
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      ids: [],
      withdrawIds: [],
      searchForm: {
        workNo: '',
        custId,
        realName: '',
        status: '',
        createStartTime: '',
        createEndTime: '',
        fundType: '',
        currentPage: 1
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
      auditShow: false,
      rewardAmtShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
     // table表格选择
    selectChange (arr) {
      let ids = []
      let withdrawIds = []
      for (let i = 0; i < arr.length; i++) {
        ids.push(arr[i]['withdrawId'])
        withdrawIds.push(arr[i]['withdrawId'])
      }
      this.ids = ids
      this.withdrawIds = withdrawIds
    },
    // 提现申请时间处理
    startDateChange (date) {
      this.searchForm.createStartTime = date || ''
      this.searchForm.createEndTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.createEndTime = date || ''
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxChannelCust/queryWithdrawList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>
