<template>
  <el-dialog class="edit-dialog" :class="'double-dialog'" :title="showResult ? '审核发放佣金' : '用户查询结果'" v-model="visible">
    <div class="fx-query-result">
      <el-table class="content__table" :data="tableData" border>
        <el-table-column :prop="'cols_' + index" :label="th" align="center" v-for="th, index in tableTh" :key="index">
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="close" v-if="!showResult">确定</el-button>
      <el-button @click="sendAutoReward"  v-if="showResult" :class="{'com-btn-loading' : isLoding }" :disabled="isLoding">{{isLoding ? '审核通过...' : '审核通过'}}</el-button>
      <el-button @click="auditNoPass"  v-if="showResult" :class="{'com-btn-loading' : isLoding }" :disabled="isLoding">{{isLoding ? '审核不通过...' : '审核不通过'}}</el-button>
      <el-button @click="auditPassing"  v-if="showResult" :class="{'com-btn-loading' : isLoding }" :disabled="isLoding">{{isLoding ? '审核中...' : '审核中'}}</el-button>
      <el-button @click="close" v-if="showResult">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'fx-apply-modify',
  props: {
    value: Boolean,
    userProcessQueryData: Object,
    showResulting: Boolean,
    showResult: Boolean
  },
  data () {
    let val = this.userProcessQueryData || {}
    let tableData = []
    let tableTh = ''
    if (val.resultJson) {
      tableData = JSON.parse(val.resultJson).list
      tableTh = JSON.parse(val.resultJson).title.split(';')
      for (let i in tableData) {
        console.log(i)
      }
    }
    return {
      sendCoded: false,
      isQRShow: false,
      QRObj: {},
      isLoding: false,
      visible: this.value,
      form: {
        resultJson: ''
      },
      imgCodeUrl: '',
      calcTime: 60,
      codeText: '获取验证码',
      timer: null,
      tableTh,
      tableData
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    userProcessQueryData: {
      handler: function (val) {
        if (val.resultJson) {
          this.tableData = JSON.parse(val.resultJson).list
          this.tableTh = JSON.parse(val.resultJson).title.split(';')
        }
      },
      deep: true
    }
  },
  methods: {
    sendAutoReward () {
      this.$alert('您是否确定审核通过并发送奖励?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/applyData/sendAutoReward',
              data: this.userProcessQueryData,
              success: res => {
                this.$emit('change', 'search')
                this.$message({
                  message: '发放成功！',
                  type: 'success'
                })
              },
              fail: err => {
                this.$message(err.message)
              }
            })
          }
        }
      })
    },
    auditNoPass () {
      this.$alert('您是否确定审核不通过?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/applyData/auditApplyNoPass',
              data: this.userProcessQueryData,
              success: res => {
                this.$message(res.message)
                this.$router.go(0)
              },
              fail: err => {
                this.$message(err.message)
              }
            })
          }
        }
      })
    },
    auditPassing () {
      this.$alert('您是否确定改为审核中?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/applyData/auditPassing',
              data: this.userProcessQueryData,
              success: res => {
                this.$message(res.message)
                this.$router.go(0)
              },
              fail: err => {
                this.$message(err.message)
              }
            })
          }
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.edit-dialog.w800 .el-dialog {
  width: 920px;
}
.fx-form-input {
  display: inline-block;
  vertical-align: middle;
  width: 180px;
}
.fx-form-code {
  display: inline-block;
  vertical-align: middle;
  height: 36px;
  width: 95px;
  cursor: pointer;
}
.fx-form-btn {
  display: inline-block;
  vertical-align: middle;
  height: 36px;
  background: #4093d6;
  color: #fff;
  width: 95px;
  text-align: center;
  cursor: pointer;
  &.l-disabled {
    background: #ccc;
    color: #999;
  }
}
</style>
