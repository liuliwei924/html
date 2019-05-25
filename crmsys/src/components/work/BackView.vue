<template>
  <div>
    <div class="record-content"><el-button class="record-edit-btn" icon="search" v-if="orgCFSFlag" @click="queryLoan" style="width: 120px;">查询CFS回款</el-button></div>
    <div class="el-form__view">
      <el-table
        class="content__table"
        :data="curBackInfo"
        border>
        <el-table-column
        prop="reContractId"
        label="合同编号"
        min-width="150"
        v-if="orgCFSFlag">
        </el-table-column>
        <el-table-column
          prop="backTypeText"
          label="回款方式"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="feeAmountDate"
          label="回款日期"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="feeAmount"
          label="回款金额(元)"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="loanOrg"
          label="贷款机构"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="payTypeText"
          label="支付方式"
          min-width="110"
          v-if="orgCFSFlag">
        </el-table-column>
        <el-table-column
          prop="recTypeText"
          label="回款类型"
          min-width="110"
          v-if="orgCFSFlag">
        </el-table-column>
        <el-table-column
          prop="statusText"
          label="回款状态"
          min-width="110"
          v-if="!orgCFSFlag">
        </el-table-column>
        <el-table-column
          prop="recStatusText"
          label="回款状态"
          min-width="110"
          v-if="orgCFSFlag">
        </el-table-column>
        <el-table-column
          prop="queryStatusText"
          label="查询状态"
          min-width="110"
          v-if="orgCFSFlag">
        </el-table-column>
        <el-table-column
          prop="errorMessage"
          label="错误信息"
          min-width="170"
          v-if="orgCFSFlag">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          v-if="!orgCFSFlag"
          :width="80">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updateRetLoan(scope.row)">修改</el-button>
            <el-button type="text" size="small" v-if="ishaveAuth" @click="deleteBackAmout(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ret-loan-deal v-model="isShow" :newBackInfo="newBackInfo" @change="changeHandle" />
  </div>
</template>

<script>
import RetLoanDeal from '@/components/work/RetLoanDeal'
// 回款子组件
export default {
  name: 'back-view',
  props: {
    backInfo: Array,
    applyId: [Number, String],
    orgCFSFlag: Boolean
  },
  data () {
    let ishaveAuth = this.$localStorage('userRole') === '1' && this.$localStorage('allOrgs') === 'all'
    return {
      ishaveAuth,
      // 放款类型
      loanType: {
        1: '信用贷',
        2: '抵押贷'
      },
      curBackInfo: this.backInfo,
      isShow: false,
      newBackInfo: {}
    }
  },
  watch: {
    backInfo (val) {
      this.curBackInfo = val
    }
  },
  methods: {
    updateRetLoan (obj) {
      this.newBackInfo = obj
      this.isShow = true
    },
    // 编辑组件监听
    changeHandle (val) {
      if (val === 'back') {
        this.isShow = false
        this.queryRetRecord()
      } else {
        this.isShow = val
      }
    },
    // 查询CFS回款
    queryLoan () {
      this.$alert('此操作将查询CFS回款', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/work/waitDeal/queryCFSBackInfo',
              data: {
                applyId: this.applyId
              },
              success: () => {
                this.$message({
                  type: 'success',
                  message: '查询CFS回款成功!'
                })
                this.queryRetRecord()
              },
              fail: (error) => {
                this.$msg(error.message)
              }
            })
          }
        }
      })
    },
    queryRetRecord () {
      this.$ajax({
        url: '/store/account/work/applyInfo/queryRetRecord',
        data: {
          applyId: this.applyId
        },
        success: data => {
          let rows = data.rows || []
          this.curBackInfo = rows || []
        }
      })
    },
    // 删除回款
    deleteBackAmout (obj) {
      this.$alert('此操作将删除回款信息', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/work/waitDeal/deleteBackAmout',
              data: {
                applyId: obj.applyId,
                recordId: obj.recordId
              },
              success: () => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.queryRetRecord(obj.applyId)
              },
              fail: (error) => {
                this.$msg(error.message)
                this.queryRetRecord(obj.applyId)
              }
            })
          }
        }
      })
    }
  },
  components: {
    RetLoanDeal
  }
}
</script>
