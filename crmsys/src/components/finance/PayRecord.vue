<template>
  <div class="repay-content">
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="代扣记录id:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.recordId"
            placeholder="代付记录id">
          </el-input>
        </el-form-item>
        <el-form-item label="代付状态:">
          <el-select
            v-model="searchForm.payStatus"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in payStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 查看 -->
    <el-table
      class="content__table table__gap"
      :data="tableData"
      border
      v-loading="loading"
      element-loading-text="拼命加载中">
      <el-table-column
        prop="orderNo"
        label="订单号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="bankName"
        label="银行"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="bankCardNo"
        label="银行卡号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="holderName"
        label="银行卡户主"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="tradeAmount"
        label="交易金额"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="payStatus"
        label="代付状态"
        min-width="120">
        <template slot-scope="scope">{{payStatus[scope.row.payStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="platformOrderId"
        label="支付平台代扣交易号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="platformBatchId"
        label="平台批次号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="errorCode"
        label="错误码"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="errorMsg"
        label="错误消息"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="payPoundage"
        label="代付手续费"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="loanOrg"
        label="机构名称"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="repayDate"
        label="还款日期"
        min-width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="queryHandle(scope.row.payRecordId)">继续支付</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'repay-record',
  props: {
    applyId: [String, Number]
  },
  data () {
    return {
      loading: false,
      searchForm: {
        recordId: '',
        payStatus: '',
        currentPage: 1
      },
      payStatus: {
        0: '初始化',
        1: '成功',
        2: '失败',
        3: '交易处理中'
      },
      tableData: [],
      totalRecord: 1
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    queryHandle (payRecordId) {
      this.$ajax({
        url: '/crmsys/account/dai/repay/queryPayRepayStatus',
        data: {
          payRecordId
        },
        success: data => {
          this.searchHandle()
        }
      })
    },
    // 查询审核记录
    searchHandle () {
      this.$ajax({
        url: '/crmsys/account/dai/repay/queryRepayPayRecords',
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
    }
  }
}
</script>
