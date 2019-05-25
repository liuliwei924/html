<template>
  <el-dialog class="width900" title="还款记录详情" v-model="visible" @close="close">
    <div class="el-form__view clearfix">
      <div class="el-form-item">
        <div class="el-form-item__label">订单号</div>
        <div class="el-form-item__content">{{recordData.orderNo}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">用户名</div>
        <div class="el-form-item__content">{{recordData.name}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">银行卡户主</div>
        <div class="el-form-item__content">{{recordData.holderName}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">银行</div>
        <div class="el-form-item__content">{{recordData.bankName}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">银行卡号</div>
        <div class="el-form-item__content">{{recordData.bankCardNo}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">交易金额</div>
        <div class="el-form-item__content">{{recordData.tradeAmount}}</div>
      </div>
      <!-- <div class="el-form-item">
        <div class="el-form-item__label">订单状态</div>
        <div class="el-form-item__content">{{orderStatus[recordData.orderStatus]}}</div>
      </div> -->
      <div class="el-form-item">
        <div class="el-form-item__label">交易状态</div>
        <div class="el-form-item__content">{{tradeStatus[recordData.tradeStatus]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">代付状态</div>
        <div class="el-form-item__content">{{payStatus[recordData.payStatus]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">代扣状态</div>
        <div class="el-form-item__content">{{colStatus[recordData.colStatus]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">代扣错误信息</div>
        <div class="el-form-item__content">{{recordData.colErrorMsg}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">代付错误信息</div>
        <div class="el-form-item__content">{{recordData.payErrorMsg}}</div>
      </div>
    </div>
    <div class="btn-dialog-group text-center">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'view-record',
  // 父组件传递参数
  props: {
    value: Boolean,
    recordId: [Number, String],
    orderStatus: Object,
    tradeStatus: Object
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      recordData: {},
      payStatus: {
        0: '初始化',
        1: '成功',
        2: '失败',
        3: '交易处理中'
      },
      colStatus: {
        0: '待审核',
        1: '成功',
        2: '失败',
        3: '交易处理中',
        4: '交易异常',
        5: '银行拒绝'
      }
    }
  },
  created () {
    // this.queryRecord()
  },
  watch: {
    // 监听父组件传递的参数变化
    value (val) {
      this.visible = val
    },
    // 监听applyId重新获取数据
    recordId () {
      this.queryRecord()
    }
  },
  methods: {
    // 查询经手记录收据
    queryRecord () {
      this.$ajax({
        url: '/crmsys/account/dai/repay/recordDetailList',
        data: {
          recordId: this.recordId
        },
        success: data => {
          let rows = data.rows || []
          this.recordData = rows[0] || {}
        }
      })
    },
    // 弹窗关闭
    close () {
      this.$emit('input', false)
    }
  }
}
</script>
