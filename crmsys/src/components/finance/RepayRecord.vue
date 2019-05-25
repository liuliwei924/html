<template>
  <div class="repay-content">
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="交易开始时间:">
          <el-date-picker
            v-model="startTime"
            type="date"
            @change="startPickerChange"
            editable
            placeholder="交易开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易结束时间:">
          <el-date-picker
            v-model="endTime"
            type="date"
            @change="endPickerChange"
            editable
            placeholder="交易结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户名/用户电话:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.searchKey"
            placeholder="用户名/用户电话">
          </el-input>
        </el-form-item>
        <el-form-item label="订单状态:">
          <el-select
            v-model="searchForm.orderStatus"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in orderStatus"
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
        prop="name"
        label="用户名"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="用户电话"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="loanOrg"
        label="机构名称"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="repayDate"
        label="还款日期"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="tradeAmount"
        label="交易金额"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        width="100">
        <template slot-scope="scope">{{orderStatus[scope.row.orderStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="tradeStatus"
        label="交易状态"
        min-width="100">
        <template slot-scope="scope">{{tradeStatus[scope.row.tradeStatus]}}</template>
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
        prop="colRecordId"
        label="代扣记录id"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="payRecordId"
        label="代付记录id"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="tradeTime"
        label="交易时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="queryHandle(scope.row.recordId)">查看</el-button>
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
    <view-record v-model="isShow" :recordId="recordId" :orderStatus="orderStatus" :tradeStatus="tradeStatus" />
  </div>
</template>

<script>
import ViewRecord from '@/components/finance/ViewRecord'
export default {
  name: 'repay-record',
  data () {
    return {
      loading: false,
      searchForm: {
        startTime: '',
        endTime: '',
        searchKey: '',
        orderStatus: '',
        currentPage: 1
      },
      isShow: false,
      recordId: '',
      startTime: '',
      endTime: '',
      orderStatus: {
        0: '初始',
        1: '成功',
        2: '失败',
        3: '还款中'
      },
      tradeStatus: {
        0: '初始',
        1: '代扣成功',
        2: '代扣失败',
        3: '代扣交易处理中',
        4: '代付初始化',
        5: '代付成功',
        6: '代付失败',
        7: '代付交易进行中'
      },
      tableData: [],
      totalRecord: 1
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    queryHandle (recordId) {
      this.recordId = recordId
      this.isShow = true
    },
    // 查询审核记录
    searchHandle () {
      this.$ajax({
        url: '/crmsys/account/dai/repay/queryRepayRecords',
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
    // 开始时间改变
    startPickerChange (val) {
      this.searchForm.startTime = val
    },
    // 结束时间改变
    endPickerChange (val) {
      this.searchForm.endTime = val
    }
  },
  components: {
    ViewRecord
  }
}
</script>
