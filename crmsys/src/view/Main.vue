<template>
  <div class="content-box bgf2">
    <div class="common-wrap">
      <div class="user-main-table clearfix">
        <div class="main-table-itme right-border fl">
          <div class="table-item-title">今日概况 (门店可用余额：{{orgBalanceAmt}} 元)</div>
          <div class="table-wrap">
            <table border="1" cellspacing="0" class="table-info-wrap">
              <tr>
                <td class="info-left" rowspan="2">今日工作</td>
                <td class="info-right">
                  <span class="info-title">新申请</span>
                  <span class="info-data">{{toDayCase.receiveCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">未处理</span>
                  <span class="info-data">{{toDayCase.dealCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">再分配</span>
                  <span class="info-data">{{toDayCase.againAllto}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">未处理</span>
                  <span class="info-data">{{toDayCase.noHandlCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">进件笔数</span>
                  <span class="info-data">{{toDayCase.signingCount}}</span>
                </td>
              </tr>
              <tr>
                <td class="info-right">
                  <span class="info-title">进件金额</span>
                  <span class="info-data">{{toDayCase.signingAmt}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">批款笔数</span>
                  <span class="info-data">{{toDayCase.approvalCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">批款金额</span>
                  <span class="info-data">{{toDayCase.approvalAmount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">创收</span>
                  <span class="info-data">{{toDayCase.retAmount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">已确认业绩</span>
                  <span class="info-data">{{toDayCase.sucRetAmount}}</span>
                </td>
              </tr>
            </table>
            <table border="1" cellspacing="0" class="table-info-wrap">
              <tr>
                <td class="info-left" rowspan="2">本周工作</td>
                <td class="info-right">
                  <span class="info-title">新申请</span>
                  <span class="info-data">{{yesterDayCase.receiveCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">未处理</span>
                  <span class="info-data">{{yesterDayCase.dealCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">再分配</span>
                  <span class="info-data">{{yesterDayCase.againAllto}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">未处理</span>
                  <span class="info-data">{{yesterDayCase.noHandlCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">进件笔数</span>
                  <span class="info-data">{{yesterDayCase.signingCount}}</span>
                </td>
              </tr>
              <tr>
                <td class="info-right">
                  <span class="info-title">进件金额</span>
                  <span class="info-data">{{yesterDayCase.signingAmt}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">批款笔数</span>
                  <span class="info-data">{{yesterDayCase.approvalCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">批款金额</span>
                  <span class="info-data">{{yesterDayCase.approvalAmount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">创收</span>
                  <span class="info-data">{{yesterDayCase.retAmount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">已确认业绩</span>
                  <span class="info-data">{{yesterDayCase.sucRetAmount}}</span>
                </td>
              </tr>
            </table>
            <!-- <table border="1" cellspacing="0" class="table-info-wrap">
              <tr>
                <td class="info-comment">主管点评</td>
                <td class="info-right">
                  <span class="info-title">累计点评</span>
                  <span class="info-data">33</span>
                </td>
                <td class="info-right">
                  <span class="info-title">未回复</span>
                  <span class="info-data">0</span>
                </td>
              </tr>
            </table> -->
          </div>
        </div>
        <div class="main-table-itme fl">
          <div class="table-item-title">本月工作</div>
          <div class="table-wrap">
            <table border="1" cellspacing="0" class="table-info-wrap">
              <tr>
                <td class="info-right">
                  <span class="info-title">新申请</span>
                  <span class="info-data">{{monthWork.receiveCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">分配新申请</span>
                  <span class="info-data">{{monthWork.newApplyCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">未处理</span>
                  <span class="info-data">{{monthWork.dealCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">再分配</span>
                  <span class="info-data">{{monthWork.againAllto}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">未处理</span>
                  <span class="info-data">{{monthWork.noHandlCount}}</span>
                </td>
              </tr>
            </table>
            <table border="1" cellspacing="0" class="table-info-wrap">
              <tr>
                <td class="info-right">
                  <span class="info-title">进件笔数</span>
                  <span class="info-data">{{monthWork.signingCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">进件金额</span>
                  <span class="info-data">{{monthWork.signingAmt}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">批款笔数</span>
                  <span class="info-data">{{monthWork.approvalCount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">批款金额</span>
                  <span class="info-data">{{monthWork.approvalAmount}}</span>
                </td>
              </tr>
            </table>
            <table border="1" cellspacing="0" class="table-info-wrap">
              <tr>
                <td class="info-right">
                  <span class="info-title">未确认业绩</span>
                  <span class="info-data">{{monthWork.chkRetAmount}}</span>
                </td>
                <td class="info-right">
                  <span class="info-title">已确认业绩</span>
                  <span class="info-data">{{monthWork.sucRetAmount}}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!-- 用户基本信息 -->
      <!-- <div class="user-main-info clearfix">
        <div class="user-photo">
          <img :src="userInfo.userImage" alt="头像">
        </div>
        <div class="user-right">
          <div class="user-name">{{userInfo.userName}}</div>
          <div class="user-more">
            <div class="option-row clearfix">
              <div class="option-col">
                <div class="option-label">所属部门</div>：
                <div class="option-value">{{userInfo.orgName}}</div>
              </div>
              <div class="option-col">
                <div class="option-label">能力值</div>：
                <div class="option-value">
                  <el-progress :percentage="userInfo.totalAbility" :stroke-width="9"></el-progress>
                </div>
              </div>
            </div>
            <div class="option-row clearfix">
              <div class="option-col">
                <div class="option-label">等　　级</div>：
                <div class="option-value">{{levelType[userInfo.levelType]}}</div>
              </div>
              <div class="option-col">
                <div class="option-label">分单状态</div>：
                <div class="option-value">{{isOtOrder[userInfo.isOtOrder]}}</div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 反馈通知 -->
      <div class="user-info-table clearfix">
        <div class="main-table-itme right-border fl">
          <div class="table-item-title">系统通知</div>
          <el-table
            class="table-wrap"
            :data="sysNotifyData"
            border>
            <el-table-column
              prop="notifyDate"
              label="通知日期"
              width="200">
            </el-table-column>
            <el-table-column
              prop="notifyText"
              label="通知内容"
              width="365">
            </el-table-column>
          </el-table>
          <el-pagination
            class="fr"
            @current-change="pageHandle"
            :current-page="nCurrentPage"
            layout="total, prev, pager, next"
            :total="nTotalRecord"
            :page-size="2">
          </el-pagination>
        </div>
        <div class="main-table-itme fl">
          <div class="table-item-title">
            反馈
            <el-button type="text" class="add-btn fr" @click="dealFeed"  v-if="userRole">处理</el-button>
            <el-button type="text" class="add-btn fr" @click="addFeed">添加</el-button>
          </div>
          <el-table
            class="table-wrap"
            :data="sysFeedbackData"
            border
            @selection-change="selectChange">
            <el-table-column
              type="selection"
              width="35">
            </el-table-column>
            <el-table-column
              prop="realName"
              label="反馈人"
              width="80">
            </el-table-column>
            <el-table-column
              prop="orgName"
              label="所属门店"
              width="100">
            </el-table-column>
            <el-table-column
              prop="feedDate"
              label="反馈时间"
              width="170">
            </el-table-column>
            <el-table-column
              prop="feedText"
              label="反馈内容"
              width="180">
            </el-table-column>
          </el-table>
          <el-pagination
            class="fr"
            @current-change="feedPageHandle"
            :current-page="fCurrentPage"
            layout="total, prev, pager, next"
            :total="fTotalRecord"
            :page-size="2">
          </el-pagination>
        </div>
      </div>
    </div>
    <feed-add v-model="addShow" @change="addChange"></feed-add>
  </div>
</template>
<script>
import FeedAdd from '@/components/all/FeedAdd'
// 首页
export default {
  name: 'main',
  data () {
    let userRole = this.$localStorage('userRole') === '1'
    return {
      addShow: false,
      dealShow: false,
      userInfo: {
        userImage: require('@/assets/images/default_user_photo.png'), // 用户头像
        userName: '', // 用户名
        orgName: '', // 所属部门
        totalAbility: 0, // 能力值
        levelType: 1, // 等级
        isOtOrder: 1 // 分单状态
      },
      userRole,
      dealOrders: '', // 待处理的反馈列表
      toDayCase: {
        receiveCount: 0,
        dealCount: 0,
        againAllto: 0,
        noHandlCount: 0,
        preBookCount: 0,
        sucBookCount: 0,
        feedBackCount: 0,
        signingCount: 0,
        signingAmt: 0,
        approvalCount: 0,
        approvalAmount: 0,
        retAmount: 0,
        sucRetAmount: 0
      },
      yesterDayCase: {
        receiveCount: 0,
        dealCount: 0,
        againAllto: 0,
        noHandlCount: 0,
        preBookCount: 0,
        sucBookCount: 0,
        feedBackCount: 0,
        signingCount: 0,
        signingAmt: 0,
        approvalCount: 0,
        approvalAmount: 0,
        retAmount: 0,
        sucRetAmount: 0
      },
      monthWork: {
        receiveCount: 0,
        newApplyCount: 0,
        dealCount: 0,
        againAllto: 0,
        noHandlCount: 0,
        signingCount: 0,
        signingAmt: 0,
        approvalCount: 0,
        approvalAmount: 0,
        chkRetAmount: 0,
        sucRetAmount: 0,
        toMonthFailExamCount: 0,
        sysStopVisitCount: 0
      },
       // 等级
      levelType: {
        1: '新手',
        2: '高手'
      },
      orders: [], // table选中
      // 分单状态
      isOtOrder: {
        1: '可以分单',
        0: '关闭分单'
      },
      nCurrentPage: 1,
      orgBalanceAmt: '',
      fCurrentPage: 1,
      nTotalRecord: 1,
      fTotalRecord: 1,
      sysNotifyData: [],
      sysFeedbackData: []
    }
  },
  created () {
    // this.getInfo()
    this.getToDayCase()
    this.getThisWeekCase()
    this.getMonthWork()
    this.getSysNotify()
    this.getSysFeedback()
  },
  methods: {
    // 新增反馈
    addFeed () {
      this.addShow = true
    },
    getInfo () {
      this.$ajax({
        url: '/store/account/user/info/getUserInfo',
        success: data => {
          let attr = data.attr
          let userInfo = attr.userInfo
          this.userInfo = {
            userImage: userInfo['userImage'] || require('@/assets/images/default_user_photo.png'),
            userName: userInfo['userName'] || '',
            orgName: userInfo['orgName'] || '',
            totalAbility: userInfo['totalAbility'] || 0,
            levelType: userInfo['levelType'] || 1,
            isOtOrder: userInfo['isOtOrder'] || 1
          }
        }
      })
    },
    getToDayCase () {
      this.$ajax({
        url: '/store/account/user/info/queryToDayCase',
        success: data => {
          this.orgBalanceAmt = data.attr.orgBalanceAmt || 0
          let ToDayCase = data.attr.ToDayWork || {}
          this.toDayCase = {
            receiveCount: ToDayCase['receiveCount'] || 0,
            dealCount: ToDayCase['dealCount'] || 0,
            againAllto: ToDayCase['againAllto'] || 0,
            noHandlCount: ToDayCase['noHandlCount'] || 0,
            preBookCount: ToDayCase['preBookCount'] || 0,
            sucBookCount: ToDayCase['sucBookCount'] || 0,
            feedBackCount: ToDayCase['feedBackCount'] || 0,
            signingCount: ToDayCase['signingCount'] || 0,
            signingAmt: ToDayCase['signingAmt'] || 0,
            approvalCount: ToDayCase['approvalCount'] || 0,
            approvalAmount: ToDayCase['approvalAmount'] || 0,
            retAmount: ToDayCase['retAmount'] || 0,
            sucRetAmount: ToDayCase['sucRetAmount'] || 0
          }
        }
      })
    },
    getThisWeekCase () {
      this.$ajax({
        url: '/store/account/user/info/queryThisWeekCase',
        success: data => {
          let YesterDayCase = data.attr.YesterDayWork || {}
          this.yesterDayCase = {
            receiveCount: YesterDayCase['receiveCount'] || 0,
            dealCount: YesterDayCase['dealCount'] || 0,
            againAllto: YesterDayCase['againAllto'] || 0,
            noHandlCount: YesterDayCase['noHandlCount'] || 0,
            preBookCount: YesterDayCase['preBookCount'] || 0,
            sucBookCount: YesterDayCase['sucBookCount'] || 0,
            feedBackCount: YesterDayCase['feedBackCount'] || 0,
            signingCount: YesterDayCase['signingCount'] || 0,
            signingAmt: YesterDayCase['signingAmt'] || 0,
            approvalCount: YesterDayCase['approvalCount'] || 0,
            approvalAmount: YesterDayCase['approvalAmount'] || 0,
            retAmount: YesterDayCase['retAmount'] || 0,
            sucRetAmount: YesterDayCase['sucRetAmount'] || 0
          }
        }
      })
    },
    getMonthWork () {
      this.$ajax({
        url: '/store/account/user/info/queryToMonthWork',
        success: data => {
          let MonthWork = data.attr.ToMonthWork || {}
          this.monthWork = {
            receiveCount: MonthWork['receiveCount'] || 0,
            newApplyCount: MonthWork['newApplyCount'] || 0,
            dealCount: MonthWork['dealCount'] || 0,
            againAllto: MonthWork['againAllto'] || 0,
            noHandlCount: MonthWork['noHandlCount'] || 0,
            signingCount: MonthWork['signingCount'] || 0,
            signingAmt: MonthWork['signingAmt'] || 0,
            approvalCount: MonthWork['approvalCount'] || 0,
            approvalAmount: MonthWork['approvalAmount'] || 0,
            chkRetAmount: MonthWork['chkRetAmount'] || 0,
            sucRetAmount: MonthWork['sucRetAmount'] || 0
          }
        }
      })
    },
    getSysNotify () {
      this.$ajax({
        url: '/store/account/user/info/querySysNotify',
        data: {
          currentPage: this.nCurrentPage
        },
        success: data => {
          this.sysNotifyData = data.rows || []
          this.nTotalRecord = data.page.totalRecords
        }
      })
    },
    getSysFeedback () {
      this.$ajax({
        url: '/store/account/user/info/querySysFeedback',
        data: {
          currentPage: this.fCurrentPage
        },
        success: data => {
          this.sysFeedbackData = data.rows || []
          this.fTotalRecord = data.page.totalRecords
        }
      })
    },
    dealFeed () {
      if (this.orders.length === 0) this.$msg('请至少选择一条反馈!')
      else {
        this.$alert('处理反馈后将不显示在列表中，是否处理？', '提示', {
          type: 'warning',
          customClass: 'msg-delete__dialog',
          showCancelButton: true,
          callback: action => {
            if (action === 'confirm') {
              this.$ajax({
                url: '/store/account/user/info/dealFeedBack',
                data: {
                  str: JSON.stringify({orders: this.orders})
                },
                success: data => {
                  this.getSysFeedback()
                }
              })
            }
          }
        })
      }
    },
    // table表格选择
    selectChange (arr) {
      this.orders = []
      arr.forEach(item => {
        this.orders.push({
          feedId: item['feedId'],
          telephone: item['feedText'].split(',')[1] || '',
          customerId: item['customerId']
        })
      })
    },
    // 系统通知分页处理
    pageHandle (page) {
      this.nCurrentPage = page
      this.getSysNotify()
    },
    // 反馈分页处理
    feedPageHandle (page) {
      this.fCurrentPage = page
      this.getSysFeedback()
    },
    addChange (val) {
      this.addShow = val
    },
    dealChange (val) {
      this.dealShow = val
    }
  },
  components: {
    FeedAdd
  }
}
</script>