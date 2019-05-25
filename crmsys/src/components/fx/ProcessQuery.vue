<template>
  <el-dialog class="edit-dialog" :class="showResult && 'double-dialog'" :title="showResult ? '查询信用卡结果' : '查询信用卡状态'" v-model="visible">
    <div class="fx-query-result" v-if="showResult">
      <el-table class="content__table" :data="tableData" border>
        <el-table-column :prop="'cols_' + index" :label="th" align="center" v-for="th, index in tableTh" :key="index">
        </el-table-column>
      </el-table>
    </div>
    <el-form  v-else :model="form" ref="form" label-width="150px">
      <el-form-item label="申请人姓名">
        <el-input v-model="form.applyName" placeholder="请输入申请人姓名" readonly="readonly" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="申请人身份证号">
        <el-input v-model="form.cardNo" placeholder="请输入申请人身份证号" readonly="readonly" disabled="disabled"></el-input>
      </el-form-item>
       <el-form-item label="申请人手机号">
        <el-input v-model="form.applyTel" placeholder="请选择产品名称" readonly="readonly" disabled="disabled"></el-input>
      </el-form-item>
      <!-- <el-form-item label="图形验证码" prop="fxCardNo"
      :rules="{required: true, message: '申请人身份证号不能为空', trigger: 'blur'}">
        <el-input v-model="form.fxCardNo" placeholder="请输入申请人身份证号"></el-input>
      </el-form-item> -->
      <el-form-item label="图形验证码" v-if="needImg">
        <div class="fx-form-input">
          <el-input v-model="form.vCode" placeholder="请输入图形验证码"></el-input>
        </div>
        <img class="fx-form-code" :src="imgCodeUrl" @click="getImgCodeUrl" />
      </el-form-item>
      <el-form-item label="短信验证码" v-if="needMsg">
        <div class="fx-form-input">
          <el-input v-model="form.smsCode" placeholder="请输入短信验证码"></el-input>
        </div>
        <span class="fx-form-btn" :class="timer && 'l-disabled'" @click="getCode">{{codeText}}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="!showResult">
      <el-button @click="toQuery" :class="{'com-btn-loading' : isLoding }" :disabled="isLoding">{{isLoding ? '查询中...' : '查询'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'fx-apply-modify',
  props: {
    value: Boolean,
    processQueryData: Object
  },
  data () {
    return {
      sendCoded: false,
      isQRShow: false,
      QRObj: {},
      banks: [
        {prodId: 2, bankName: '交通信用卡', logo: 'jt', type: 2},
        {prodId: 3, bankName: '浦发信用卡', logo: 'pf', type: 2},
        {prodId: 1, bankName: '兴业信用卡', logo: 'xy', type: 1},
        {prodId: 4, bankName: '中信信用卡', logo: 'zx', type: 3},
        {prodId: 5, bankName: '民生信用卡', logo: 'ms', type: 4},
        {prodId: 6, bankName: '平安信用卡', logo: 'pa', type: 3},
        {prodId: 7, bankName: '上海信用卡', logo: 'sh', type: 2},
        {prodId: 9, bankName: '花旗信用卡', logo: 'hq', type: 1}
      ],
      isLoding: false,
      visible: this.value,
      form: {
        applyId: '',
        prodId: '',
        applyName: '',
        cardNo: '',
        applyTel: '',
        vCode: '',
        smsCode: ''
      },
      imgCodeUrl: '',
      calcTime: 60,
      codeText: '获取验证码',
      timer: null,
      showResult: false,
      tableTh: [],
      tableData: []
    }
  },
  computed: {
    needImg () {
      if (this.processQueryData) {
        let prodId = Number(this.processQueryData.prodId)
        if (prodId === 2 || prodId === 3 || prodId === 5 || prodId === 7 || prodId === 9 || prodId === 10 || prodId === 11) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    needMsg () {
      if (this.processQueryData) {
        let prodId = Number(this.processQueryData.prodId)
        if (prodId === 4 || prodId === 5 || prodId === 10 || prodId === 11 || prodId === 12 || prodId === 13) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    processQueryData (data) {
      this.showResult = false
      this.getImgCodeUrl()
      for (let i in data) {
        for (let j in this.form) {
          if (i === j) {
            this.form[j] = data[i]
          }
        }
      }
    },
    calcTime (val) {
      this.codeText = val === 60 ? '获取验证码' : `${val}s`
    }
  },
  // created () {
  //   this.getImgCodeUrl()
  // },
  methods: {
    toQuery () {
      this.$ajax({
        url: '/store/account/fx/applyData/queryProgress',
        data: this.form,
        success: res => {
          this.tableTh = res.attr.title.split(';')
          this.tableData = res.rows
          this.showResult = true
        },
        fail: err => {
          this.$message(err.message)
          this.getImgCodeUrl()
        }
      })
    },
    // 获取验证码
    getCode () {
      if (this.timer) return
      this.timer = window.setInterval(() => {
        if (this.calcTime === 60) {
          this.$ajax({
            url: '/store/account/fx/applyData/sendSms',
            data: {
              applyId: this.form.applyId,
              prodId: this.form.prodId,
              vCode: this.form.vCode
            },
            success: data => {
              this.$message(data.message)
            },
            fail: data => {
              this.$message(data.message)
            }
          })
        }
        if (--this.calcTime === 0) {
          window.clearInterval(this.timer)
          this.timer = null
          this.calcTime = 60
        }
      }, 1000)
    },
    getImgCodeUrl () {
      let signId = JSON.parse(this.$localStorage('signId')).v
      this.imgCodeUrl = `${this.$baseURL}store/account/fx/applyData/getViewCode?signId=${signId}&prodId=${this.processQueryData.prodId}&random=${Math.random()}`
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
  width: 800px;
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
