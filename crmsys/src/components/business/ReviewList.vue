<template>
  <div class="record-content">
    <!-- 查看 -->
    <el-table
      class="content__table table__gap"
      :data="tableData"
      border
      v-loading="loading"
      element-loading-text="拼命加载中">
      <el-table-column
        prop="reviewType"
        label="复核类型"
        width="100">
        <template slot-scope="scope">{{reviewType[scope.row.reviewType]}}</template>
      </el-table-column>
      <el-table-column
        prop="reviewDate"
        label="复核时间"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="reviewStatus"
        label="复核状态"
        min-width="100">
        <template slot-scope="scope">{{reviewStatus[scope.row.reviewStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        label="申请金额(万元)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="loanDeadline"
        label="贷款期限(月)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="repayType"
        label="还款方式"
        min-width="120">
        <template slot-scope="scope">{{repayTypes[scope.row.repayType]}}</template>
      </el-table-column>
      <el-table-column
        prop="monRepAmo"
        label="每月还款金额(元)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="firMonRepAmo"
        label="第一个月还款金额(元)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="monCutAmo"
        label="每月递减金额(元)"
        min-width="120">
      </el-table-column>
      
      <el-table-column
        prop="reviewDes"
        label="复核描述"
        min-width="150">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'review-list',
  props: {
    applyId: [String, Number]
  },
  data () {
    return {
      loading: false,
      reviewType: {
        0: '系统',
        1: '人工'
      },
      reviewStatus: {
        0: '通过',
        1: '不通过',
        2: '退回'
      },
      checkForm: {
        repayType: 1,
        checkStatus: '',
        applyId: this.$route.query.applyId || '',
        applyAmount: '',
        reviewDes: '',
        deadline: ''
      },
      deadlineList: {
        12: '12个月',
        24: '24个月',
        36: '36个月'
      },
      tableData: [],
      totalRecord: 1,
      currentPage: 1,
      flag: false,
      type: this.$route.query.type || '',
      repayTypes: {
        1: '等额本息',
        2: '等额本金',
        3: '按月利率'
      }
    }
  },
  watch: {
    info (obj) {}
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 查询审核记录
    searchHandle () {
      this.$ajax({
        url: '/crmsys/account/user/custInfo/queryRecord',
        data: {applyId: this.checkForm.applyId},
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
