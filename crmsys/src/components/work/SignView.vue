<template>
  <div class="record-content">
    <el-button class="record-edit-btn" style="width: 120px;"></el-button>
    <div class="el-form__view">
      <el-table
        class="content__table"
        :data="curSignInfo"
        border>
        <el-table-column
        prop="reContractId"
        label="合同编号"
        min-width="150"
        v-if="orgCFSFlag">
        </el-table-column>
        <el-table-column
        prop="treatyNo"
        label="合同编号"
        min-width="150"
        v-if="!orgCFSFlag">
        </el-table-column>
        <el-table-column
          prop="applyName"
          label="客户姓名"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="客户手机"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="cardNo"
          label="客户身份证号"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="signAmount"
          label="签单金额(万)"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="treatyName"
          label="合同项目"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="feeTypeText"
          label="合同费用类型"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="feeAmount"
          label="固定金额(元)"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="treatyAmount"
          label="收取定金(元)"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="treatyWill"
          label="预计创收(元)"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="anjiePerson"
          label="按揭人员"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="bankRetPoint"
          label="银行返点(%)"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="treatyFee"
          label="累计报销(元)"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="statusText"
          label="办理状态"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="failureCause"
          label="签约失败原因"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="signTypeText"
          label="签单类型"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="signTime"
          label="实际签单时间"
          min-width="170">
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
          :width="150">
          <template slot-scope="scope">
            <template v-if="orgCFSFlag">
              <el-button type="text" size="small" v-if="scope.row.upStatus === 1" @click="modeChange(scope.row)">上传CFS</el-button>
              <el-button type="text" size="small" v-else-if="scope.row.upStatus === 2" style="color: #999;" @click="return false">已上传CFS</el-button>
              <el-button type="text" size="small" v-else-if="scope.row.upStatus === 3" @click="modeChange(scope.row)">重新上传CFS</el-button>
            </template>
            <el-button type="text" size="small" v-if="ishaveAuth" @click="deleteSignInfo(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// 签单子组件
export default {
  name: 'sign-view',
  props: {
    signInfo: Array,
    orgCFSFlag: Boolean
  },
  data () {
    let ishaveAuth = this.$localStorage('userRole') === '1' && this.$localStorage('allOrgs') === 'all'
    return {
      // 合同费用类型
      feeType: {
        1: '固定金额',
        2: '按比例'
      },
      // 签约状态
      status: {
        1: '提交按揭中',
        2: '全部结案',
        3: '已结束',
        4: '无贷款',
        5: '贷款未提交',
        6: '部分结案'
      },
      ishaveAuth,
      // 签单类型
      signType: {
        1: '银行',
        2: '小额'
      },
      curSignInfo: this.signInfo
    }
  },
  watch: {
    signInfo (newVal) {
      this.curSignInfo = newVal
    }
  },
  methods: {
    // 上传CFS
    modeChange (obj) {
      this.$alert('此操作将进行上传CFS', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/work/waitDeal/uploadCFS',
              data: {
                applyId: obj.applyId,
                treatyNo: obj.treatyNo
              },
              success: () => {
                this.$message({
                  type: 'success',
                  message: '上传CFS成功!'
                })
                this.querySignRecord(obj.applyId)
              },
              fail: (error) => {
                this.$msg(error.message)
                this.querySignRecord(obj.applyId)
              }
            })
          }
        }
      })
    },
    // 删除签单
    deleteSignInfo (obj) {
      this.$alert('此操作将删除签单以及回款信息', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/work/waitDeal/deleteSignInfo',
              data: {
                applyId: obj.applyId,
                treatyNo: obj.treatyNo,
                reContractId: obj.reContractId
              },
              success: () => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.querySignRecord(obj.applyId)
              },
              fail: (error) => {
                this.$msg(error.message)
                this.querySignRecord(obj.applyId)
              }
            })
          }
        }
      })
    },
    querySignRecord (applyId) {
      this.$ajax({
        url: '/store/account/work/applyInfo/querySignRecord',
        data: {
          applyId: applyId
        },
        success: data => {
          let rows = data.rows || []
          this.curSignInfo = rows || []
        }
      })
    }
  }
}
</script>
