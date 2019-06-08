<template>
  <div class="header__check store-check">
    <span class="label">订单处理：</span>
    <el-radio-group v-model="status">
      <el-radio
        v-for="item,key,index in orderDeal"
        :label="Number(key)"
        :key="index">{{item.text}}</el-radio>
    </el-radio-group>
    <!-- 预约上门弹框 -->
    <template v-if="orderDeal[3]">
      <book-deal v-model="orderDeal[3]['isShow']" :applyId="applyId" :customerId="customerId" :bookInfo="bookInfoArr" :custInfo="custInfo" @change="changeHandle" />
    </template> 
    <!-- 添加上门弹框 -->
    <template v-if="orderDeal[4]">
      <visit-deal v-model="orderDeal[4]['isShow']" :applyId="applyId" :customerId="customerId" :bookInfo="bookInfoArr" :custInfo="custInfo" @change="changeHandle"/>
    </template>  
    <!-- 签单处理弹框 -->
    <template v-if="orderDeal[5]">
      <sign-deal v-model="orderDeal[5]['isShow']" :orgCFSFlag="orgCFSFlag" :applyId="applyId" :customerId="customerId" :signInfo="signInfoArr" @change="changeHandle" />
    </template>
    <!-- 回款处理弹框 -->
    <template v-if="orderDeal[6]">
      <ret-loan-deal v-model="orderDeal[6]['isShow']" :orgCFSFlag="orgCFSFlag" :applyId="applyId" :customerId="customerId" @change="changeHandle" />
    </template>
    <el-button class="order-set__btn" icon="upload" @click="uploadFile">附件上传</el-button>
    <el-button class="order-set__btn" v-if="backStatus === 1" @click="backOrderDeal">退单处理</el-button>
    <span v-else-if="backStatus === 2" :style="`color: #62a2d5;margin-left:20px`">退单中</span>
    <span v-else-if="backStatus === 3" :style="`color: #42a874;margin-left:20px`">退单成功</span>
    <span v-else-if="backStatus === 4" :style="`color: #f66830;margin-left:20px`">退单失败（{{backDesc}}）
      <el-button class="order-set__btn" @click="backOrderDeal">再次退单</el-button>
    </span>
    <span class="sign-right-btn" @click="queryNextOrder">下一笔</span>
    <backOrder-deal v-model="isBackOrderShow" :applyId="applyId" :orderType="orderType" @change="backOrderEditHandle" />
    <br/>
    <br/>
    <span class="label">客户等级：</span>
    <el-select
      v-model="custLabelValue"
      placeholder="请选择"
      @change="custLabelDeal">
      <el-option
        v-for="val,key,index in custLabel"
        :label="val"
        :value="Number(key)"
        :key="index">
      </el-option>
    </el-select>
    <span class="label" style="margin-left:10px">处理状态：</span>
    <el-select
      v-model="orderStatusValue"
      placeholder="请选择处理状态"
      @change="orderStatusDeal">
      <el-option
        v-for="item,key,index in orderStatusArr"
        :label="item.name"
        :value="item.val"
        :key="index">
      </el-option>
    </el-select>
    <span class="label" style="margin-left:10px">订单状态：</span>
    <el-select
      v-model="dealOrderTypeValue"
      placeholder="订单状态"
      size="10"
      @change="orderTypeSelect">
      <el-option
        v-for="val,key,index in dealOrderType"
        :label="val"
        :value="Number(key)"
        :key="index">
     </el-option>
    </el-select> 
    <el-button class="order-set__btn" icon="setting" @click="orderSet" v-if="!execOders">设置专属单</el-button>
    <el-button class="order-cancel__btn" icon="circle-cross" @click="orderSet" v-else>取消专属单</el-button>
    <el-button class="order-set__btn" @click="abandonFollow">放弃跟进</el-button><br><br>
    <span class="label" style="float:left">订单评分：</span><el-rate v-model="orderRate"  show-text :texts="[' 1分', ' 2分', ' 3分', ' 4分', ' 5分']"  
      @change="orderRateChange" style="float:left;margin-left:4px;"></el-rate>
    <br>
    <abandon-follow v-model="isAbandonShow" :abandonData="abandonData" @change="abandonEditHandle" />
    <!-- <file-deal v-model="isUpLoadShow" :applyId="applyId" :upLoadData="upLoadData" @change="uploadEditHandle" @showBigImg="showBigImg" /> -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog> 
  </div>
</template>

<script>
import BookDeal from '@/components/work/BookDeal'
import VisitDeal from '@/components/work/VisitDeal'
import SignDeal from '@/components/work/SignDeal'
import RetLoanDeal from '@/components/work/RetLoanDeal'
import AbandonFollow from '@/components/work/AbandonFollow'
import BackOrderDeal from '@/components/work/BackOrderDeal'
// import FileDeal from '@/components/work/FileDeal'
// 业务处理组件
export default {
  name: 'order-deal',
  props: {
    path: String,
    storeSearchKey: String,
    handleDesc: String,
    backDesc: String,
    execOders: Number,
    applyId: [Number, String],
    customerId: [Number, String],
    orderType: [Number, String],
    backStatus: [Number, String],
    storeStatus: [Number, String],
    bookStatus: [Number, String],
    custInfo: Object,
    bookInfo: Array,
    signInfo: Object,
    mainInfo: Object,
    identifyNo: String,
    custLabelVal: [Number, String],
    orderStatusVal: [Number, String],
    dealOrderTypeVal: [Number, String],
    orderRateVal: [Number, String],
    searchDetailFlag: String,
    updateStatusFlag: String,
    orgCFSFlag: Boolean
  },
  data () {
    let orderDeal = {
      3: {text: '预约上门', isShow: false},
      4: {text: '添加上门', isShow: false},
      5: {text: '签单处理', isShow: false},
      6: {text: '回款处理', isShow: false}
    }
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      status: '',
      orderDeal,
      isBankCard: false,
      userRoleuserRole: false,
      isWithholdApply: false,
      isCodeCollect: false,
      bookInfoArr: this.bookInfo,
      signInfoArr: this.signInfo,
      orderStatusValue: this.orderStatusVal,
      preCustLabelValue: this.custLabelVal, // 单子上一个客户星级
      custLabelValue: this.custLabelVal,
      prevOrderStatusVal: this.orderStatusVal, // 单子上一个状态
      initOrderStatus: this.orderStatusVal, // 单子原始状态
      dealOrderTypeValue: this.dealOrderTypeVal, // 订单状态
      abandonData: {},
      upLoadData: {},
      isAbandonShow: false, // 弹窗是否显示
      isBackOrderShow: false, // 弹窗是否显示
      isUpLoadShow: false, // 弹窗是否显示
      flag: false,
      stautsFlag: false,
      dealOrderTypeFlag: false,
      orderRate: this.orderRateVal, // 订单评分等级
      // 客户等级
      custLabel: {
        0: '0星：默认未了解的客户',
        1: '1星：无条件无可贷点',
        2: '2星：有条件暂时不能进件的',
        3: '2星+：有需求邀约上门客户',
        4: '3星：可做小贷的客户',
        5: '4星：可做银行的客户'
      },
      orderStatusArr: [
        {val: -1, name: '-1：待跟进:尚未跟进客户'},
        {val: 0, name: '0：跟进过:未了解客户'},
        {val: 1, name: '1：未上门待签约'},
        {val: 2, name: '2：已上门待签约'},
        {val: 3, name: '3：已上门签约'},
        {val: 4, name: '4：进件审核中'},
        {val: 5, name: '5：银行已放款'},
        {val: 6, name: '6：银行已拒绝'},
        {val: 7, name: '7：无可贷点，同行，捣乱无效客户'},
        {val: 8, name: '8：空号/错号'}
      ],
      dealOrderType: {
        '-1': ' ',
        '0': '无条件',
        '1': '微粒贷/小贷',
        '2': '车',
        '3': '保险',
        '4': '代发',
        '5': '本地房',
        '6': '未接/拒接',
        '7': '非本人',
        '8': '异地/空号',
        '9': '不需要',
        '10': '未了解',
        '11': '税金企业贷',
        '12': '公积金',
        '13': '外地房'
      }
    }
  },
  watch: {
    status (val, old) {
      let orderStatus = Number(this.prevOrderStatusVal)
      if (val === 3 && orderStatus === -1) {
        this.$msg('您需要修改处理状态才能操作')
        return
      } else if (val === 4 && orderStatus === -1) {
        this.$msg('您需要修改处理状态才能操作')
        return
      } else if (val === 5 && orderStatus === -1) {
        this.$msg('您需要修改处理状态才能操作')
        return
      }
      if (val === 3 && !this.$parent.requestFlag) {
        this.queryBookInfo()
      }
      if (val === 5) {
        this.querySignInfo()
      }
      if (typeof old === 'number') this.orderDeal[old]['isShow'] = false
      if (typeof val === 'number') this.orderDeal[val]['isShow'] = true
    },
    bookInfo (val) {
      this.bookInfoArr = val
    },
    orgCFSFlag (val) {
      if (!val) {
        this.orderDeal[6] = {text: '回款处理', isShow: false}
      }
    },
    signInfo (val) {
      this.signInfoArr = val
    },
    orderStatusVal (val) {
      this.orderStatusValue = val
      this.prevOrderStatusVal = val
      this.initOrderStatus = val
    },
    dealOrderTypeVal (val) {
      this.dealOrderTypeValue = val
    },
    orderRateVal (val) {
      this.orderRate = val
    },
    custLabelVal (val) {
      this.custLabelValue = val
      this.preCustLabelValue = val
      if (this.custLabelValue === 0 && this.orderStatusValue !== -1 && this.orderStatusValue !== 0 && this.orderStatusValue !== 7 && this.orderStatusValue !== 8) {
        this.$message({
          showClose: true,
          duration: 5000,
          message: '客户等级0星对应的处理状态是-1,0,7,8,请及时修改！',
          type: 'info'
        })
        return
      } else if (this.custLabelValue === 1 && this.orderStatusValue !== 7 && this.orderStatusValue !== 8) {
        this.$message({
          showClose: true,
          duration: 5000,
          message: '客户等级1星对应的处理状态是7,8,请及时修改！',
          type: 'info'
        })
        return
      } else if (this.custLabelValue === 2 && this.orderStatusValue !== 1 && this.orderStatusValue !== 2 && this.orderStatusValue !== 7) {
        this.$message({
          showClose: true,
          duration: 5000,
          message: '客户等级2星对应的处理状态是1,2,7,请及时修改！',
          type: 'info'
        })
      } else if (this.custLabelValue === 3 && this.orderStatusValue !== 1 && this.orderStatusValue !== 2 && this.orderStatusValue !== 7) {
        this.$message({
          showClose: true,
          duration: 5000,
          message: '客户等级2星+对应的处理状态是1,2,7,请及时修改！',
          type: 'info'
        })
        return
      } else if (this.custLabelValue === 4 && (this.orderStatusValue === -1 || this.orderStatusValue === 0)) {
        this.$message({
          showClose: true,
          duration: 5000,
          message: '客户等级3星对应的处理状态是1,2,3,4,5,6,7,请及时修改！',
          type: 'info'
        })
        return
      } else if (this.custLabelValue === 5 && (this.orderStatusValue === -1 || this.orderStatusValue === 0)) {
        this.$message({
          showClose: true,
          duration: 5000,
          message: '客户等级4星对应的处理状态是1,2,3,4,5,6,7,请及时修改！',
          type: 'info'
        })
        return
      }
    },
    bookStatus (val) {
      this.changeStatus(val, this.storeStatus)
    },
    storeStatus (val) {
      this.changeStatus(this.bookStatus, val)
    }
  },
  methods: {
    changeStatus (bookStatus, storeStatus) {
      // this.orderDeal = {
      //   3: {text: '预约上门', isShow: false},
      //   4: {text: '添加上门', isShow: false},
      //   5: {text: '签单处理', isShow: false},
      //   6: {text: '回款处理', isShow: false}
      // }
    },
    // 专属单变更
    orderSet () {
      let tipsText = !this.execOders ? '设置成专属单后,该单将永久保存在您名下,不再重新分配,是否设置专属单?(每个人的专属单有限,请谨慎设置!)' : '是否确定取消您的专属单?(取消后将不再分配您的名下,请谨慎设置!)'
      this.$alert(tipsText, '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            let url = !this.execOders ? '/store/account/work/waitDeal/orderSet' : '/store/account/work/waitDeal/cancleOrder'
            let params = {
              applyId: this.applyId,
              orderType: this.orderType
            }
            if (this.execOders) params['storeStatus'] = this.storeStatus
            let data = {
              str: JSON.stringify({
                orders: [params]
              })
            }
            this.$ajax({
              url,
              data,
              success: () => {
                this.$parent.execOders = Number(!this.execOders)
              }
            })
          }
        }
      })
    },
    // 退单处理
    backOrderDeal () {
      let orderStatus = this.orderStatusValue
      if (orderStatus !== 7 && orderStatus !== 8) {
        this.$msg('非无效客户或非空号状态不允许退单')
        return
      }
      this.isBackOrderShow = true
    },
    // 退单编辑组件监听
    backOrderEditHandle (val) {
      if (val === 'search') {
        this.isBackOrderShow = false
      } else {
        this.isBackOrderShow = val
      }
    },
    // 放弃跟进
    abandonFollow () {
      let params = {
        applyId: this.applyId,
        customerId: this.customerId,
        reBackFlag: 1
      }
      this.abandonData = params
      this.isAbandonShow = true
    },
    // 附件上传
    uploadFile () {
      this.$ajax({
        url: '/store/account/work/applyInfo/queryCustMaterial',
        data: {
          applyId: this.applyId
        },
        success: data => {
          this.upLoadData = data.attr || {}
        }
      })
      this.isUpLoadShow = true
    },
    // 编辑组件监听
    uploadEditHandle (val) {
      if (val === 'search') {
        this.isUpLoadShow = false
      } else {
        this.isUpLoadShow = val
      }
    },
    showBigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 编辑组件监听
    abandonEditHandle (val) {
      if (val === 'search') {
        this.isAbandonShow = false
        // this.$router.go(-1)
      } else {
        this.isAbandonShow = val
      }
    },
    // 客户星级处理
    custLabelDeal () {
      if (!this.flag) {
        this.flag = true
      } else {
        if (this.dealOrderTypeValue === -1) {
          this.custLabelValue = this.preCustLabelValue
          this.$msg('请先选择订单状态')
          return
        }
        this.$ajax({
          url: '/store/account/work/waitDeal/custLabelDeal',
          data: {
            applyId: this.applyId,
            customerId: this.customerId,
            custLabel: this.custLabelValue
          },
          loading: true,
          success: data => {
            this.$message('操作成功')
            this.$emit('change', 'back')
            this.$emit('changeLabel', this.preCustLabelValue)
          },
          fail: (error) => {
            this.$msg(error.message)
          }
        })
      }
    },
    // 状态处理
    orderStatusDeal () {
      if (this.dealOrderTypeValue === -1 && this.stautsFlag) {
        this.orderStatusValue = this.prevOrderStatusVal
        this.$msg('请先选择订单状态')
        return
      }
      if (this.orderStatusValue === -1 && this.prevOrderStatusVal !== -1) {
        this.orderStatusValue = this.prevOrderStatusVal
        this.$msg('不允许修改为待跟进状态')
      } else if ((this.orderStatusValue === 3 || this.orderStatusValue === 4 || this.orderStatusValue === 5) &&
          (this.custLabelValue === 0 || this.custLabelValue === 1 || this.custLabelValue === 2)) {
        this.orderStatusValue = this.prevOrderStatusVal
        if (!this.searchDetailFlag) {
          this.$msg('2星+以上才可操作')
        }
      } else if (!this.updateStatusFlag) {
        this.orderStatusValue = this.prevOrderStatusVal
        this.$msg('请先增加跟进记录再更改订单状态')
      } else {
        if (!this.stautsFlag) {
          this.stautsFlag = true
        } else {
          if (this.orderStatusValue === this.prevOrderStatusVal) return
          this.$ajax({
            url: '/store/account/work/waitDeal/updateOrderStatus',
            data: {
              applyId: this.applyId,
              customerId: this.customerId,
              orderStatus: this.orderStatusValue
            },
            loading: true,
            success: data => {
              this.prevOrderStatusVal = this.orderStatusValue
              this.$message('操作成功')
              this.$emit('change', 'back')
              this.$emit('changeStatus', this.prevOrderStatusVal)
            },
            fail: (error) => {
              this.orderStatusValue = this.prevOrderStatusVal
              this.$msg(error.message)
            }
          })
        }
      }
    },
    orderTypeSelect () {
      if (!this.dealOrderTypeFlag) {
        this.dealOrderTypeFlag = true
      } else {
        this.$ajax({
          url: '/store/account/work/waitDeal/updateDealOrderType',
          data: {
            applyId: this.applyId,
            customerId: this.customerId,
            dealOrderType: this.dealOrderTypeValue
          },
          loading: true,
          success: data => {
            this.$message('操作成功')
          },
          fail: (error) => {
            this.$msg(error.message)
          }
        })
      }
    },
    orderRateChange () {
      this.$ajax({
        url: '/store/account/work/waitDeal/updateOrderRate',
        data: {
          applyId: this.applyId,
          customerId: this.customerId,
          orderRate: this.orderRate,
          fullLoading: true
        },
        success: data => {
        }
      })
    },
    // 组件状态监听
    changeHandle (val) {
      if (val === 'back') this.$router.back()
      if (!val) this.status = []
    },
    addBank (val) {
      this.isBankCard = true
    },
    queryBookInfo () {
      this.$ajax({
        url: '/store/account/work/applyInfo/queryBookInfo',
        data: {
          applyId: this.applyId
        },
        success: data => {
          this.bookInfoArr = data['rows'] || []
        }
      })
    },
    querySignInfo () {
      this.$ajax({
        url: '/store/account/work/applyInfo/querySignInfo',
        data: {
          applyId: this.applyId
        },
        success: data => {
          let signInfo = data.rows[0] || {}
          if (!Object.keys(signInfo).length) {
            this.signInfoArr = {
              applyName: this.mainInfo['applyName'],
              telephone: this.mainInfo['telephone'],
              cardNo: this.identifyNo
            }
          } else {
            this.signInfoArr = signInfo
          }
        }
      })
    },
    // 查询下一笔订单
    queryNextOrder () {
      this.$ajax({
        url: '/store/account/work/applyInfo/queryNextOrder',
        data: {
          applyId: this.applyId,
          orderStatus: this.initOrderStatus,
          storeSearchKey: this.storeSearchKey,
          handleDesc: this.handleDesc
        },
        success: data => {
          let type = this.$route.query['type'] || ''
          let key = this.storeSearchKey
          let handleDesc = this.handleDesc
          this.$router.push('/workDetail?applyId=' + data.rows[0].applyId + '&storeSearchKey=' + key + '&handleDesc=' + handleDesc + '&type=' + type)
          this.$router.go(0)
        },
        fail: (error) => {
          this.$msg(error.message)
        }
      })
    }
  },
  components: {
    BookDeal,
    VisitDeal,
    SignDeal,
    RetLoanDeal,
    AbandonFollow,
    BackOrderDeal
    // FileDeal
  }
}
</script>
