<template>
  <div class="content-box">
    <div class="header__title">用户管理</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="工号" prop="workNo">
          <el-input v-model.trim="searchForm.workNo" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="用户名/手机号" prop="userName">
          <el-input v-model.trim="searchForm.userName" placeholder="请输入用户名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户身份证号" prop="cardNo">
          <el-input v-model.trim="searchForm.cardNo" placeholder="用户身份证号"></el-input>
        </el-form-item>
        <el-form-item label="代理人工号/姓名/手机" prop="refererName">
          <el-input v-model.trim="searchForm.refererName" placeholder="代理人工号/姓名/手机"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="grade">
          <el-select v-model="searchForm.grade" clearable placeholder="等级">
            <el-option label="实习专员" value="1"></el-option>
            <el-option label="专员 " value="2"></el-option>
            <el-option label="经理" value="3"></el-option>
            <el-option label="行长" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="用户状态">
            <el-option label="正常" value="1"></el-option>
            <el-option label="锁定 " value="2"></el-option> 
          </el-select>
        </el-form-item>
        </el-form-item>
        </el-form-item>
        <!-- 注册时间 -->
        <el-form-item label="注册开始时间:" prop="regStartTime">
          <el-date-picker v-model="searchForm.regStartTime" type="date" editable @change="regStartChange" :picker-options="startDateOptions" placeholder="注册开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册结束时间:" prop="regEndTime">
          <el-date-picker v-model="searchForm.regEndTime" type="date" editable @change="regEndChange" :picker-options="endDateOptions" placeholder="注册结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button :loading="loading" @click="upgradeHandle">用户升级处理</el-button>
        <el-button :loading="loading" @click="modifyRelation">修改上下级关系</el-button>
        <el-button :loading="loading" @click="lockFxCust">锁定用户</el-button>
        <el-button :loading="loading" @click="sendReward">用户奖励发放</el-button>
        <el-button @click="sendTempMessage">发送项目进展消息</el-button>
        <el-button @click="sendActiveMessage">发送活动消息</el-button>
        <el-button @click="sendNotifyMessage">发送服务通知</el-button>
        <el-button icon="upload" @click="TIHandle">团队成员导入</el-button>
        <el-button @click="excelExportHandle" v-if="isExport">导出</el-button>
        <el-button @click="sendAppMessage">发送App消息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table class="content__table"
      :data="tableData"
      border
      style="width: 100%"
      highlight-current-row 
      @current-change="handleCurrentChange"
      @sort-change="sortEvent">
      <el-table-column
        prop="workNo"
        label="工号"
        align="center"
        min-width="50">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="姓名"
        align="center"
        min-width="55">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        align="center"
        min-width="60">
      </el-table-column>
      <el-table-column
        prop="cardNo"
        label="身份证号"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="gradeName"
        label="用户等级"
        align="center"
        min-width="60">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="注册时间"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="rewardAmount"
        label="累计收入"
        width="180"
        align="center"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '累计收入')}">
      </el-table-column>
      <el-table-column
        prop="usableAmount"
        label="可提现"
        width="180"
        align="center"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '可提现')}">
      </el-table-column>
      <el-table-column prop="status" label="用户状态" align="center" min-width="40">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status===2" type="danger">锁定</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160"
        align="center">
        <template slot-scope="scope">
            <el-button type="text" size="small" @click="queryDtlHandle(scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="refreshCache(scope.row.custId)" v-if="isExport">刷新缓存</el-button>
            <el-button type="text" size="small" @click="modifyCustInfo(scope.row)">修改信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @size-change="handleSizeChange"
      @current-change="pageHandle"
      :current-page="currentPage"
      :page-size="everyPage"
      layout="total, prev, pager, next" 
      :total="totalRecord">
    </el-pagination>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
    <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="fxCust">
    </form>
    <fx-send-temp-message v-model="queryShow" @change="queryChange" :newSearchForm="newSearchForm"/>
    <fx-send-active-message v-model="activeShow" @change="activeChange" :newSearchForm="newSearchForm"/>
    <fx-send-notify-message v-model="notifyShow" @change="notifyChange" :newSearchForm="newSearchForm"/>
    <cust-identify v-model="modifyCustShow" :modifyCustData="modifyCustData" @change="modifyCustChange" />
    <cust-send-reward v-model="sendRewardShow" :sendRewardData="sendRewardData" @change="sendRewardChange" />
    <team-import v-model="TIShow" @change="TIChange"/>
    <fx-send-app-message v-model="appShow" @change="appChange" :newSearchForm="newSearchForm"/>
    <!-- 修改上下级关系弹框 -->
    <el-dialog  class="edit-dialog" title="修改上下级关系" v-model="relationShow" @change="relationChange">
      <el-form ref="relForm" :model="relForm" label-width="150px">
        <el-form-item label="上级工号" prop="upWorkNo" :rules="{required: true, message: '上级工号不能为空', trigger: 'blur'}">
          <el-input  v-model.trim="relForm.upWorkNo" placeholder="请输入上级工号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="relationShow=false">取消</el-button>
        <el-button :loading="loading" @click="relationSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import FxSendTempMessage from '@/components/fx/FxSendTempMessage'
import FxSendActiveMessage from '@/components/fx/FxSendActiveMessage'
import FxSendNotifyMessage from '@/components/fx/FxSendNotifyMessage'
import TeamImport from '@/components/fx/TeamImport'
import CustIdentify from '@/components/fx/CustIdentify'
import CustSendReward from '@/components/fx/CustSendReward'
import FxSendAppMessage from '@/components/fx/FxSendAppMessage'
export default {
  name: 'fx-cust',
  data () {
    let {lastMonth} = this.$monthDate()
    let store = this.$getStore('rechargeData')
    let isExport = this.$localStorage('userRole') === '1'
    return {
      TIShow: false,
      isBigImg: false,
      bigImgUrl: '',
      tableData: [],
      modifyCustData: {},
      exportParams: '',
      exportTitles: '',
      currentPage: 1,
      everyPage: 10,
      totalRecord: 1,
      queryShow: false,
      activeShow: false,
      notifyShow: false,
      appShow: false,
      relationShow: false,
      custIds: [],
      signId: '',
      sendMessageCount: 5000,
      newSearchForm: {},
      fxCustDtlData: {},
      sendRewardData: {},
      searchForm: {
        workNo: '',
        userName: '',
        cardNo: '',
        refererName: '',
        grade: '',
        status: '',
        regStartTime: store['startDate'] || lastMonth,
        regEndTime: '',
        currentPage: 1
      },
      relForm: {
        upWorkNo: '',
        custId: ''
      },
      isExport, // 是否可以导出
      excelExportPath: this.$baseURL + 'store/account/fx/fxDataCount/fxDataExport',
      // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      loading: false,
      addShow: false,
      modifyCustShow: false,
      custDtlShow: false,
      sendRewardShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    TIHandle () {
      this.TIShow = true
    },
    TIChange (val) {
      this.TIShow = val
    },
    // 选择某一条记录
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // 每页几条
    handleSizeChange (val) {
      this.everyPage = val
      this.searchTable(1)
    },
    // 修改用户信息方法
    modifyCustInfo (row) {
      this.modifyCustData = row
      this.modifyCustShow = true
    },
     // 修改用户信息弹窗监听
    modifyCustChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.modifyCustShow = false
      } else {
        this.modifyCustShow = val
      }
    },
    // 用户奖励发放弹窗监听
    sendRewardChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.sendRewardShow = false
      } else {
        this.sendRewardShow = val
      }
    },
    // 用户奖励发放方法
    sendReward () {
      if (!this.currentRow) {
        this.$message({message: '请先选中一条数据', type: 'warning'})
        return
      }
      this.sendRewardShow = true
      this.sendRewardData = this.currentRow
    },
    // 修改上下级关系弹窗监听
    relationChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.relationShow = false
      } else {
        this.relationShow = val
      }
    },
    // 修改上下级关系方法
    modifyRelation () {
      if (!this.currentRow) {
        this.$message({message: '请先选中一条数据', type: 'warning'})
        return
      }
      this.relationShow = true
      this.relForm = this.currentRow
    },
    // 修改上下级关系确定
    relationSubmit () {
      this.$refs['relForm'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxCust/modifyRelation',
            data: this.relForm,
            loading: true,
            success: data => {
              this.searchHandle()
              this.relationShow = false
              this.$message({message: '修改成功', type: 'success'})
            }
          })
        }
      })
    },
    // 添加弹窗监听
    queryChange (val) {
      if (val === 'search') {
        this.queryShow = false
      } else {
        this.queryShow = val
      }
    },
    sendTempMessage () {
      let searchFlag = !this.searchForm.workNo && !this.searchForm.userName && !this.searchForm.grade && !this.searchForm.regStartTime && !this.searchForm.regEndTime
      if (searchFlag) {
        this.$msg('请至少选择一个条件查询')
        return
      }
      let totalRecord = this.totalRecord
      if (totalRecord > this.sendMessageCount) {
        this.$msg('一次最多发送' + this.sendMessageCount + '条消息，请重新帅选条件发送')
        return
      }
      this.queryShow = true
      this.newSearchForm = this.searchForm
    },
    // 添加弹窗监听
    activeChange (val) {
      if (val === 'search') {
        this.activeShow = false
      } else {
        this.activeShow = val
      }
    },
    sendActiveMessage () {
      let searchFlag = !this.searchForm.workNo && !this.searchForm.userName && !this.searchForm.grade && !this.searchForm.regStartTime && !this.searchForm.regEndTime
      if (searchFlag) {
        this.$msg('请至少选择一个条件查询')
        return
      }
      let totalRecord = this.totalRecord
      if (totalRecord > this.sendMessageCount) {
        this.$msg('一次最多发送' + this.sendMessageCount + '条消息，请重新帅选条件发送')
        return
      }
      this.activeShow = true
      this.newSearchForm = this.searchForm
    },
     // 添加弹窗监听
    notifyChange (val) {
      if (val === 'search') {
        this.notifyShow = false
      } else {
        this.notifyShow = val
      }
    },
    sendNotifyMessage () {
      let searchFlag = !this.searchForm.workNo && !this.searchForm.userName && !this.searchForm.grade && !this.searchForm.regStartTime && !this.searchForm.regEndTime
      if (searchFlag) {
        this.$msg('请至少选择一个条件查询')
        return
      }
      let totalRecord = this.totalRecord
      if (totalRecord > this.sendMessageCount) {
        this.$msg('一次最多发送' + this.sendMessageCount + '条消息，请重新帅选条件发送')
        return
      }
      this.notifyShow = true
      this.newSearchForm = this.searchForm
    },
    // 添加弹窗监听
    appChange (val) {
      if (val === 'search') {
        this.appShow = false
      } else {
        this.appShow = val
      }
    },
    sendAppMessage () {
      let searchFlag = !this.searchForm.workNo && !this.searchForm.userName && !this.searchForm.grade && !this.searchForm.regStartTime && !this.searchForm.regEndTime
      if (searchFlag) {
        this.$msg('请至少选择一个条件查询')
        return
      }
      let totalRecord = this.totalRecord
      if (totalRecord > this.sendMessageCount) {
        this.$msg('一次最多发送' + this.sendMessageCount + '条消息，请重新帅选条件发送')
        return
      }
      this.appShow = true
      this.newSearchForm = this.searchForm
    },
    // Excel导出弹框
    excelExportHandle () {
      this.$alert('您是否确定导出数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            let totalRecord = this.totalRecord
            if (totalRecord > 1000) {
              this.$msg('一次最多导出1000条数据，请重新查询或限制条数!')
              return
            }
            let params = {}
            let roleType = this.$localStorage('userRole')
            Object.assign(params, this.searchForm, {
              roleType
            })
            this.exportParams = JSON.stringify(params)
            let signId = JSON.parse(this.$localStorage('signId')).v
            this.signId = signId
            let title = [
              {'name': 'realName', 'title': '姓名'},
              {'name': 'telephone', 'title': '手机号码'},
              {'name': 'gradeName', 'title': '用户等级'}
            ]
            this.exportTitles = JSON.stringify(title)
            let formDom = document.getElementById('JS-form-export')
            window.setTimeout(function () {
              formDom.submit()
            }, 100)
          }
        }
      })
    },
    alertBigImg (url) {
      this.bigImgUrl = url
      this.isBigImg = true
    },
    // 注册时间
    regStartChange (date) {
      this.searchForm.regStartTime = date || ''
      this.searchForm.regEndTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    regEndChange (date) {
      this.searchForm.regEndTime = date || ''
    },
    sortEvent (column) {
      if (column.prop === null) {
        if (this.searchForm.hasOwnProperty('orderBy')) { delete this.searchForm['orderBy'] }
        if (this.searchForm.hasOwnProperty('orderValue')) { delete this.searchForm['orderValue'] }
      } else {
        this.searchForm.orderBy = column.prop
        this.searchForm.orderValue = column.order === 'ascending' ? 'ASC' : 'DESC'
      }
      this.searchHandle()
    },
    renderHeader (h, options, text) {
      let label = options.column.label
      return h('el-tooltip', {props: {content: text, placement: 'top'}}, [h('span', label)])
    },
    // 查询详情
    queryDtlHandle (row) {
      this.$router.push({
        path: 'fxCustDetail',
        query: {
          custId: row.custId
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxCust/queryCustManagerList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
          this.totalRecord = data.page.totalRecords
          this.sendMessageCount = data.attr.sendMessageCount
        }
      })
    },
    // 刷新用户缓存
    refreshCache (custId) {
      this.$alert('您是否确定刷新该用户缓存?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxCust/refreshCustCache',
              data: {
                custId
              },
              success: data => {
                this.searchHandle()
                this.$message({
                  message: '刷新成功',
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    // 手动升级专员处理
    upgradeHandle () {
      if (!this.currentRow) {
        this.$message({message: '请先选中一条数据', type: 'warning'})
        return
      }
      this.$alert('您是否确定升级该用户?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxCust/upgradeHandle',
              data: {custId: this.currentRow.custId},
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({
                  message: '升级处理成功！',
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    // 手动锁定用户处理
    lockFxCust () {
      if (!this.currentRow) {
        this.$message({message: '请先选中一条数据', type: 'warning'})
        return
      }
      this.$alert('您是否确定锁定该用户?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxCust/lockFxCust',
              data: {custId: this.currentRow.custId},
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({
                  message: '锁定成功！',
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    FxSendTempMessage,
    FxSendActiveMessage,
    FxSendNotifyMessage,
    TeamImport,
    CustIdentify,
    CustSendReward,
    FxSendAppMessage
  }
}
</script>

<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
</style>

</script>
<style lang="less">
.alertImg-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,0.8);
  z-index: 2000;
  .content{
    width: 1000px;
    height: 600px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .big-img{
      height: 100%;
    }
  }
}
.input-wrapp{
  padding-left: 20px;
  margin-bottom: 10px;
  input{
    height: 30px;
    width: 200px;
  }
}
.exam-wrap{
  // overflow: hidden;
}
.exam-w{
  float: left;
  width:350px;
  border: 1px solid #dcdcdc;
  margin: 20px;
  position: relative;
  .no-info{
    position: absolute;
    width: 120px;
    top: 120px;
    right: 40px;
  }
  .tit{
    padding-left: 20px;
    color: white;
    line-height: 40px;
  }
  .color1{
    background: #5FBAD1;
  }
  .color2{
    background: #E6986E;
  }
  .color3{
    background: #CBBB92;
  }
  .info{
    overflow: hidden;
  }
  .img-w{
    padding: 10px;
    width: 130px;
    height: 130px;
    float: left;
    overflow: hidden;
    img{
      width: 100%
    }
  }
  .status{
    text-align: center;
    font-size: 20px;
    width: 200px;
    float: right;
    padding-top: 50px;
  }
  .statu0{
    color: #539cd2;
  }
  .statu1{
    color: green;
  }
  .statu2{
    color: #F53C44;
  }
  .p{
    padding-left: 20px;
    margin:10px 0;
  }
  .btn-w{
    margin: 10px 0;
    padding-left: 85px;
    button{
      border:none;
      border-radius: 0;
      color: white;
    }
  }
  .btn-l{
    background: #53BF8A;
  }
  .btn-r{
    background: #F53C44;
  }
}
.three-pic{
  overflow: hidden;
  .pic-w{
    width: 100px;
    float: left;
    margin-left: 10px;
    h3{
      text-align: center;
    }
    img{
      width: 100%;
    }
  }
}
</style>
