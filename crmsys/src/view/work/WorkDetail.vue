<template>
  <div class="content-box bgf2">
    <div class="all-info clearfix">
      <div class="all-info-item">
        <div class="all-info-header">申请信息
          <span class="header-tips">{{saveText}}</span>
          <button type="button" class="header-btn" @click="saveHandle">保存</button>
          <span class="fr" v-if="mainInfo.channelTypeText">渠道类型：{{mainInfo.channelTypeText}}</span>
        </div>
        <record-main :mainInfo="mainInfo" ref="mainInfoRef" @change="formSave" />
      </div>
      <div class="all-info-item">
        <record-base title="基本信息" :baseInfo="baseInfo" ref="baseInfoRef" @change="formSave" />
      </div>
      <div class="all-info-item">
        <record-other title="其它信息" :otherInfo="otherInfo" ref="otherInfoRef" @change="formSave" />
      </div>  
    </div>
    <!-- 业务处理 -->
    <order-deal
      @changeLabel="changeLabelValue"
      @changeStatus="changeStatusValue"
      :path="path"
      :execOders="execOders"
      :applyId="applyId"
      :orgCFSFlag="orgCFSFlag"
      :custLabelVal="custLabelVal"
      :orderStatusVal="orderStatusVal"
      :dealOrderTypeVal="dealOrderType"
      :orderRateVal="orderRate"
      :customerId="customerId"
      :orderType="orderType"
      :storeStatus="storeStatus"
      :bookStatus="bookStatus"
      :custInfo="custInfo"
      :mainInfo="mainInfo"
      :bookInfo="bookInfo"
      :storeSearchKey="storeSearchKey"
      :handleDesc="handleDesc"
      :backDesc="backDesc"
      :backStatus="backStatus"
      :identifyNo="identifyNo"
      :searchDetailFlag="searchDetailFlag"
      :updateStatusFlag="updateStatusFlag"/>
    <!-- tab数据 -->
    <el-tabs class="record-box record-wrap mb20 new-tabs-area" v-model="activeTab">
      <el-tab-pane class="clearfix" label="跟进记录" name="first">
        <div class="clearfix" style="background:#fff;width:1100px;">
          <div class="fl">
            <trace-record :recordInfo="recordInfo" :applyId="applyId" :bookStatus="bookStatus" :customerId="customerId" @change="traceChange"  :preCustLabelValue="preCustLabelValue" :prevOrderStatusVal="prevOrderStatusVal" @changeDateFlag="changeDateFlag"/>
            <div>
              <el-pagination
                class="content__page fr"
                @current-change="tracePageHandle"
                :current-page="tCurrentPage"
                layout="total, prev, pager, next"
                :total="tTotalRecord">
              </el-pagination>
            </div>
          </div>
          <div class="fr">
            <callAudio-record :callAudioRecord="callAudioRecord"/>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="处理记录" name="second">
        <el-collapse v-model="collapseTwo">
          <el-collapse-item title="预约" name="21">
            <book-view :bookInfo="bookInfo" @cancelHandel="queryDealRecord"/>
          </el-collapse-item>
          <el-collapse-item title="上门" name="24">
            <door-view :doorInfo="doorInfo" />
          </el-collapse-item>
          <el-collapse-item title="签单" name="22">
            <sign-view :signInfo="signInfo" :orgCFSFlag="orgCFSFlag"/>
          </el-collapse-item>
          <el-collapse-item title="进件" name="25" v-if="orgCFSFlag">
            <loan-view :loanInfo="loanInfo" :applyId="applyId"/>
          </el-collapse-item>
          <el-collapse-item title="回款" name="23">
            <back-view :backInfo="backInfo" :applyId="applyId" :orgCFSFlag="orgCFSFlag" />
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="投诉通话" name="complaint">
        <el-collapse v-model="collapseTwo">
          <el-collapse-item title="投诉记录" name="31">
            <complaint-view :complaintRecord="complaintRecord" :applyId="applyId" :customerId="customerId" @change="complaintChange"/>
          </el-collapse-item>
          <el-collapse-item title="通话记录" name="32">
            <call-view :callRecord="callRecord" :applyId="applyId" :customerId="customerId"/>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
    <div class="work-detail-mask" v-if="searchDetailFlag"><el-button class="order-set__btn" @click="againFollowOrder">订单找回</el-button></div>
  </div>
</template>

<script>
import BookRecord from '@/components/work/BookRecord'
import SignRecord from '@/components/work/SignRecord'
import BackRecord from '@/components/work/BackRecord'
import OrderDeal from '@/components/work/OrderDeal'
import RecordMain from '@/components/work/RecordMain'
import RecordBase from '@/components/work/RecordBase'
import RecordOther from '@/components/work/RecordOther'
import TraceRecord from '@/components/work/TraceRecord'
import BookView from '@/components/work/BookView'
import SignView from '@/components/work/SignView'
import BackView from '@/components/work/BackView'
import DoorView from '@/components/work/DoorView'
import FileMaterial from '@/components/work/FileMaterial'
import LoanView from '@/components/work/LoanView'
import ComplaintView from '@/components/work/ComplaintView'
import CallView from '@/components/work/CallView'
import CallAudioRecord from '@/components/work/CallAudioRecord'
const TIME_COUNT = 60
// 录单详情页面
export default {
  name: 'work-detail',
  beforeRouteLeave (to, form, next) {
    clearInterval(this.timer)
    if (to.name === 'Login') {
      next()
    } else {
      if (this.timer) {
        this.timer = null
        this.saveText = '保存中...'
        this.$ajax({
          url: '/store/account/work/applyInfo/saveAllInfo',
          data: {
            applyId: this.applyId,
            mainInfo: JSON.stringify(this.$refs.mainInfoRef.form),
            baseInfo: JSON.stringify(this.$refs.baseInfoRef.form),
            otherInfo: JSON.stringify(this.$refs.otherInfoRef.form)
          },
          loading: true,
          success: data => {
            next()
          },
          fail: data => {
            next()
          }
        })
      } else {
        next()
      }
    }
  },
  data () {
    let query = this.$route.query
    return {
      tCurrentPage: 1,
      tTotalRecord: 1,
      aCurrentPage: 1,
      aTotalRecord: 1,
      dateFlag: 0,
      saveText: '修改后，' + TIME_COUNT + '秒后自动保存',
      countdown: TIME_COUNT,
      timer: null,
      isEditForm: false,
      path: query['path'] || '',
      applyId: query['applyId'],
      storeSearchKey: query['storeSearchKey'],
      handleDesc: query['handleDesc'],
      searchDetailFlag: query['searchDetailFlag'],
      hideFlag: query['hideFlag'],
      customerId: '',
      identifyNo: '',
      recordId: '',
      orderType: '',
      backStatus: '',
      backDesc: '',
      storeStatus: -1,
      bookStatus: '',
      orderStatusVal: '',
      custLabelVal: '',
      dealOrderType: '',
      orderRate: 0,
      treatyNo: '',
      orgCFSFlag: true,
      curType (arr) {
        return new Set(arr).has(query['type'])
      },
      activeTab: 'first',
      type: 'doc',
      collapseOne: ['11', '12', '13'],
      collapseTwo: ['21', '22', '23', '24', '25', '31', '32'],
      requestFlag: false,
      requestFlags: false,
      execOders: 0, // 专属单状态
      mainInfo: {},
      baseInfo: {},
      otherInfo: {}, // 其它信息
      custInfo: {},
      bookInfo: [], // 预约记录数据
      signInfo: [], // 签单记录数据
      doorInfo: [], // 上门记录数据
      recordInfo: [],
      callAudioRecord: [], // 通话录音数据
      backInfo: [], // 回款记录数据
      loanInfo: [], // 进件记录数据
      preCustLabelValue: '',
      prevOrderStatusVal: '',
      complaintRecord: [], // 投诉记录数据
      callRecord: [], // 通话记录数据
      updateStatusFlag: '1' // 是否能更改状态标识
    }
  },
  created () {
    this.queryInfo()
  },
  mounted () {
    if (this.searchDetailFlag) {
      document.getElementsByTagName('body')[0].className = 'work-detail-overflow'
    }
  },
  watch: {
    activeTab (val) {
      if (val === 'second' && !this.requestFlag) this.queryDealRecord()
      if (val === 'complaint' && !this.requestFlags) this.queryComplaintAndCallRecord()
    }
  },
  methods: {
    formSave () {
      if (!this.timer) {
        this.dealCountDown()
      }
    },
    // 获取全局数据
    queryInfo () {
      let urlPath = '/store/account/work/applyInfo/queryMainBaseInfo'
      if (this.searchDetailFlag === '1') {
        urlPath = '/store/account/work/applyInfo/queryBorrowMainInfo'
      }
      this.$ajax({
        url: urlPath,
        data: {
          applyId: this.applyId,
          searchDetailFlag: this.searchDetailFlag,
          hideFlag: this.hideFlag
        },
        success: data => {
          let attr = data.attr || {}
          this.execOders = attr['execOders'] || 0 // 专属单状态
          this.mainInfo = attr['mainInfo'] || {}
          this.baseInfo = attr['baseInfo'] || {}
          this.otherInfo = attr['baseInfo'] || {}
          this.custInfo = attr['custInfo'] || {}
          this.orgCFSFlag = attr['orgCFSFlag']
          this.customerId = attr.customerId || ''
          this.orderType = attr.orderType || ''
          this.backStatus = attr.backStatus || ''
          this.identifyNo = this.baseInfo['identifyNo'] || ''
          this.backDesc = attr.backDesc || ''
          this.storeStatus = attr.orderStatus !== undefined ? attr.orderStatus : ''
          this.bookStatus = this.mainInfo.bookStatus || ''
          this.custLabelVal = this.mainInfo['custLabel'] !== undefined ? this.mainInfo['custLabel'] : ''
          this.preCustLabelValue = this.custLabelVal // 客户星级初始化赋值
          this.queryFollowRecord()
          this.queryCallAudioRecord()
          let type = this.$route.query['type'] || ''
          if (type === 'signing' || type === 'signed' || type === 'visitDeal' || type === 'reserving' || type === 'backDeal') {
            this.queryDealRecord()
          }
          this.orderStatusVal = this.mainInfo['orderStatus'] !== undefined ? this.mainInfo['orderStatus'] : ''
          this.prevOrderStatusVal = this.orderStatusVal // 处理状态初始化赋值
          this.dealOrderType = this.mainInfo['dealOrderType'] !== undefined ? this.mainInfo['dealOrderType'] : '-1'
          this.orderRate = this.mainInfo['orderRate'] !== undefined ? this.mainInfo['orderRate'] : 0
        }
      })
    },
    // 分页处理
    tracePageHandle (page) {
      this.tCurrentPage = page
      this.changeDateFlag(this.dateFlag)
    },
    audioPageHandle (page) {
      this.aCurrentPage = page
      this.queryCallAudioRecord()
    },
    changeDateFlag (val) {
      this.dateFlag = val
      this.queryFollowRecord(val)
    },
    queryFollowRecord (dateFlag = 0) {
      this.$ajax({
        url: '/store/account/work/applyInfo/queryFollowRecord',
        data: {
          currentPage: this.tCurrentPage,
          applyId: this.applyId,
          searchDetailFlag: this.searchDetailFlag,
          dateFlag
        },
        success: data => {
          let rows = data.rows || {}
          this.recordInfo = rows || []
          this.tTotalRecord = data.page.totalRecords
          var createTime = data.rows.length === 0 ? '' : data.rows[0].createTime
          var now = new Date()
          now.setMinutes(now.getMinutes() - 10)
          var handleType = data.rows.length === 0 ? '' : data.rows[0].handleType
          if (data.rows.length === 0) return
          if (now.getTime() <= new Date(createTime).getTime() && handleType !== '0') {
            this.updateStatusFlag = '1'
          } else {
            this.updateStatusFlag = ''
          }
        }
      })
    },
    queryCallAudioRecord () {
      this.callAudioRecord = []
      this.$ajax({
        url: '/store/account/work/applyInfo/queryCallAudioRecord',
        data: {
          currentPage: this.aCurrentPage,
          applyId: this.applyId,
          searchDetailFlag: this.searchDetailFlag
        },
        success: data => {
          let rows = data.rows || {}
          this.callAudioRecord = rows || []
          this.aTotalRecord = data.page.totalRecords
        }
      })
    },
    queryDealRecord () {
      let urlArr = ['queryBookRecord', 'queryVisitRecord', 'querySignRecord', 'queryRetRecord', 'queryLoanRecord']
      urlArr.forEach((item, index) => {
        let url = `/store/account/work/applyInfo/${item}`
        this.$ajax({
          url,
          data: {
            applyId: this.applyId,
            searchDetailFlag: this.searchDetailFlag
          },
          success: data => {
            this.requestFlag = true
            let rows = data.rows || {}
            if (item === 'queryBookRecord') {
              this.bookInfo = rows || []
            } else if (item === 'queryRetRecord') {
              this.backInfo = rows || []
            } else if (item === 'querySignRecord') {
              this.signInfo = rows || []
            } else if (item === 'queryVisitRecord') {
              this.doorInfo = rows || []
            } else if (item === 'queryLoanRecord') {
              this.loanInfo = rows || []
            }
          }
        })
      })
    },
    queryComplaintAndCallRecord () {
      let urlArr = ['queryComplaintRecord', 'queryCallRecord']
      urlArr.forEach((item, index) => {
        let url = `/store/account/work/applyInfo/${item}`
        this.$ajax({
          url,
          data: {
            applyId: this.applyId,
            searchDetailFlag: this.searchDetailFlag
          },
          success: data => {
            this.requestFlags = true
            let rows = data.rows || {}
            if (item === 'queryComplaintRecord') {
              this.complaintRecord = rows || []
            } else if (item === 'queryCallRecord') {
              this.callRecord = rows || []
            }
          }
        })
      })
    },
    traceChange () {
      this.queryFollowRecord()
    },
    changeLabelValue (val) {
      this.preCustLabelValue = val
    },
    changeStatusValue (val) {
      this.prevOrderStatusVal = val
    },
    complaintChange (value) {
      if (value === 'search') {
        this.queryComplaintAndCallRecord()
      }
    },
    editHandle () {
      this.isEditForm = !this.isEditForm
      this.$refs.mainInfoRef.mode = !this.$refs.mainInfoRef.mode
      this.$refs.baseInfoRef.mode = !this.$refs.baseInfoRef.mode
      this.$refs.otherInfoRef.mode = !this.$refs.otherInfoRef.mode
    },
    dealCountDown () {
      if (!this.timer) {
        this.countdown = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= TIME_COUNT) {
            this.saveText = this.countdown + '秒后自动保存'
            this.countdown--
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.saveText = '保存中...'
            this.$ajax({
              url: '/store/account/work/applyInfo/saveAllInfo',
              data: {
                applyId: this.applyId,
                mainInfo: JSON.stringify(this.$refs.mainInfoRef.form),
                baseInfo: JSON.stringify(this.$refs.baseInfoRef.form),
                otherInfo: JSON.stringify(this.$refs.otherInfoRef.form)
              },
              loading: true,
              success: data => {
                this.$message('保存成功')
                this.saveText = '修改后，' + TIME_COUNT + '秒后自动保存'
              },
              fail: data => {
                this.$alt(data.message, () => {
                  this.saveText = '修改后，' + TIME_COUNT + '秒后自动保存'
                })
              }
            })
          }
        }, 1000)
      }
    },
    saveHandle () {
      this.countdown = 0
    },
    // 订单找回
    againFollowOrder () {
      this.$alert('执行订单找回后，会把订单从无效订单池中删除，是否执行?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/work/waitDeal/againFollowOrder',
              data: {
                applyId: this.applyId
              },
              loading: true,
              success: data => {
                this.$message('操作成功')
                document.body.removeAttribute('class', 'work-detail-overflow')
                window.history.go(-1)
              },
              fail: (error) => {
                this.$msg(error.message)
                window.history.go(-1)
              }
            })
          }
        }
      })
    }
  },
  components: {
    BookRecord,
    SignRecord,
    BackRecord,
    OrderDeal,
    RecordMain,
    RecordBase,
    RecordOther,
    TraceRecord,
    BookView,
    SignView,
    BackView,
    DoorView,
    FileMaterial,
    LoanView,
    ComplaintView,
    CallView,
    CallAudioRecord
  },
  beforeDestroy () {
    document.body.removeAttribute('class', 'work-detail-overflow')
  }
}
</script>

<style lang="less">
.work-detail-overflow {
  padding-right: 17px;
  overflow: hidden !important;
}
</style>

