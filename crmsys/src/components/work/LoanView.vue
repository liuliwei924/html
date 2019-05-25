<template>
  <div class="record-content">
    <el-button class="record-edit-btn" icon="search" @click="queryLoanInfo" style="width: 120px;">查询CFS进件</el-button>
    <div class="el-form__view">
      <el-table
        class="content__table"
        :data="curLoanInfo"
        border>
        <el-table-column
        prop="reContractId"
        label="合同编号"
        min-width="150">
        </el-table-column>
        <el-table-column
          prop="statusText"
          label="贷款进度"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="approvalAmount"
          label="批复金额(元)"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          label="放款总额(元)"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="approvalTime"
          label="批复时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="loanDesc"
          label="贷款进度描述"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="queryStatusText"
          label="查询状态"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="errorMessage"
          label="错误信息"
          min-width="170">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// 签单子组件
export default {
  name: 'loan-view',
  props: {
    loanInfo: Array,
    applyId: [Number, String]
  },
  data () {
    return {
      // 签单类型
      signType: {
        1: '银行',
        2: '小额'
      },
      curLoanInfo: this.loanInfo
    }
  },
  watch: {
    loanInfo (val) {
      this.curLoanInfo = val
    }
  },
  methods: {
    // 查询CFS进件信息
    queryLoanInfo () {
      this.$alert('此操作查询CFS进件信息', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/work/waitDeal/queryCFSLoanInfo',
              data: {
                applyId: this.applyId
              },
              success: () => {
                this.$message({
                  type: 'success',
                  message: '查询CFS进件成功!'
                })
                this.queryLoanRecord()
              },
              fail: (error) => {
                this.$msg(error.message)
              }
            })
          }
        }
      })
    },
    queryLoanRecord () {
      this.$ajax({
        url: '/store/account/work/applyInfo/queryLoanRecord',
        data: {
          applyId: this.applyId
        },
        success: data => {
          let rows = data.rows || []
          this.curLoanInfo = rows || []
        }
      })
    }
  }
}
</script>
