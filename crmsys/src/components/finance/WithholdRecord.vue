<template>
  <div class="repay-content">
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="扣款状态:">
          <el-select
            v-model="searchForm.colStatus"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in colStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代扣记录id:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.recordId"
            placeholder="代扣记录id">
          </el-input>
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
        prop="colStatus"
        label="扣款状态"
        min-width="100">
        <template slot-scope="scope">{{colStatus[scope.row.colStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="tradeAmount"
        label="交易金额"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="colPoundage"
        label="代扣手续费"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="holderName"
        label="银行卡户主"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="bankName"
        label="银行"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="bankCardNo"
        label="银行卡号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="certificateNo"
        label="身份证"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="loanOrg"
        label="机构名称"
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
        prop="platformOrderId"
        label="支付平台代扣交易号"
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
          <el-button type="text" size="small" @click="queryHandle(scope.row.colRecordId)">继续支付</el-button>
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
        colStatus: '',
        recordId: '',
        currentPage: 1
      },
      colStatus: {
        0: '待审核',
        1: '成功',
        2: '失败',
        3: '交易处理中',
        4: '交易异常',
        5: '银行拒绝'
      },
      tableData: [],
      totalRecord: 1
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    queryHandle (colRecordId) {
      this.$ajax({
        url: '/crmsys/account/dai/repay/queryColRepayStatus',
        data: {
          colRecordId
        },
        success: data => {
          this.searchHandle()
        }
      })
    },
    // 查询审核记录
    searchHandle () {
      this.$ajax({
        url: '/crmsys/account/dai/repay/queryRepayColRecords',
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
