<template>
  <div class="content-box">
    <div class="header__title">活动管理</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="工号" prop="workNo">
          <el-input v-model="searchForm.workNo" placeholder="请输入工号"></el-input>
        </el-form-item>
        <!-- 查询条件 -->
        <el-form-item label="用户名/手机号" prop="userName">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="activityType">
          <el-select v-model="searchForm.activityType" clearable placeholder="请选择活动类型">
            <el-option label="内部员工锁粉奖励活动" value="1"></el-option>
            <el-option label="办卡连续补贴活动" value="2"></el-option>
            <el-option label="月核卡奖励活动" value="3"></el-option>
            <el-option label="信用卡双旦奖励活动" value="4"></el-option>
            <el-option label="贷款双旦奖励活动" value="5"></el-option>
            <el-option label="寻找代理商奖励活动" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发放状态" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="请选择发放状态">
            <el-option label="待处理" value="0"></el-option>
            <el-option label="已发放" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动奖励金额" prop="activeAmount">
          <el-input v-model="searchForm.activeAmount" placeholder="请输入活动奖励金额"></el-input>
        </el-form-item>
       
         <el-button :loading="loading" @click="searchHandle">查询</el-button>
         <el-button @click="resetForm('searchForm')">重置</el-button>
         <el-button @click="excelExportHandle">导出</el-button>
        <!-- <el-upload class="upload-demo" :action="excelImportPath" accept="xls" :data="excelForm" :show-file-list="false" :before-upload="beforeUp" :on-success="upSuccess">
          <el-button size="small" icon="upload" type="primary" class="excelBtn" :loading="loading" @click.stop="uploadBtn" :disabled="loading">内部员工锁粉导入</el-button>
        </el-upload>
        <el-button :loading="loading" @click="activityCheck">内部员工锁粉奖励发放</el-button> 
        <el-button :loading="loading" @click="queryCreditReward">信用卡双旦活动数据初始化</el-button>
        <el-button :loading="loading" @click="sendCreditReward">信用卡双旦奖励发放</el-button>
        <el-button :loading="loading" @click="queryLoanReward">贷款双旦活动数据初始化</el-button>
        <el-button :loading="loading" @click="sendLoanReward">贷款双旦奖励发放</el-button>
        <el-button :loading="loading" @click="queryFindAgentReward">寻找代理商活动数据初始化</el-button>
        <el-button :loading="loading" @click="sendFindAgentReward">寻找代理商奖励发放</el-button>
        -->
      </el-form>
      <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="fxActivity">
      </form>
    </div>
    <el-table class="content__table"
      :data="tableData"
      border
      @selection-change="selectChange"
      @sort-change="sortEvent">
      <el-table-column
        prop="workNo"
        label="工号"
        align="center"
        min-width="55">
      </el-table-column>
      <el-table-column
        prop="userName"
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
      <el-table-column prop="status" label="活动状态" align="center" min-width="60 ">
        <template slot-scope="scope">
           <el-tag v-if="scope.row.status===0">待处理</el-tag>
           <el-tag v-if="scope.row.status===1" type="success">已发放</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="活动奖励金额"
        width="180"
        align="center"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '活动奖励金额')}">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
        sortable
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="时间"
        align="center"
        sortable
        min-width="120">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next" :total="totalRecord">
    </el-pagination>
  </div>
</template>


<script>
export default {
  name: 'fx-activity',
  data () {
    let signId = JSON.parse(this.$localStorage('signId')).v
    return {
      tableData: [],
      exportParams: '',
      exportTitles: '',
      currentPage: 1,
      activeShow: false,
      totalRecord: 1,
      status: 1,
      signId: '',
      sendMessageCount: 5000,
      newSearchForm: {},
      fxCustDtlData: {},
      searchForm: {
        workNo: '',
        activityType: '',
        status: '',
        userName: '',
        activeAmount: '',
        currentPage: 1
      },
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
      excelForm: {
        signId: signId
      },
      excelExportPath: this.$baseURL + 'store/account/fx/fxDataCount/fxDataExport',
      excelImportPath: this.$baseURL + 'store/account/fx/fxActivity/activityCustImport',
      loading: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 文件上传之前处理
    beforeUp () {
      this.loading = true
    },
    // 文件上传成功处理
    upSuccess (res) {
      this.loading = false
      if (res.success) {
        if (res.message) {
          this.$msg(res.message)
        } else {
          this.$msg('导入成功！', 'success')
        }
        this.searchHandle()
      } else {
        this.$msg(res.message, 'error')
      }
    },
     // 文件上传处理
    uploadBtn () {
      let fileBtn = document.getElementsByClassName('el-upload__input')
      fileBtn[0].click()
    },
    // table表格选择
    selectChange (arr) {
      let custIds = []
      for (let i = 0; i < arr.length; i++) {
        custIds.push(arr[i]['custId'])
      }
      this.custIds = custIds
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
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxActivity/queryFxActivityList',
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
    // 奖励发放
    activityCheck () {
      if (this.searchForm.status !== '0') {
        this.$message('请选择活动状态为待处理的进行奖励发放')
        return
      }
      if (this.searchForm.activityType !== '1') {
        this.$message('请选择活动类型为内部员工锁粉奖励活动进行奖励发放')
        return
      }
      if (!this.searchForm.lockNums || Number(this.searchForm.lockNums) < 10) {
        this.$message('锁粉数量大于等于10的用户才能进行奖励发放')
        return
      }
      let totalRecord = this.totalRecord
      if (totalRecord > this.sendMessageCount) {
        this.$msg('一次最多发送奖励' + this.sendMessageCount + '个，请重新帅选条件')
        return
      }
      this.$ajax({
        url: '/store/account/fx/fxActivity/activityCheck',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.$message({
            message: '发送奖励成功',
            type: 'success'
          })
          window.setTimeout(() => {
            this.searchHandle()
          }, 1000)
        }
      })
    },
    // 信用卡双旦活动数据初始化
    queryCreditReward () {
      this.$alert('您是否确定初始化数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxActivity/queryCreditReward',
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({
                  message: data.message,
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    // 信用卡双旦活动奖励发放
    sendCreditReward () {
      if (this.searchForm.status !== '0') {
        this.$message('请选择活动状态为待处理的进行奖励发放')
        return
      }
      if (this.searchForm.activityType !== '4') {
        this.$message('请选择信用卡双旦活动奖励')
        return
      }
      this.$alert('您是否确定双旦活动奖励发放?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxActivity/sendCreditReward',
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({
                  message: data.message,
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    // 贷款双旦活动数据初始化
    queryLoanReward () {
      this.$alert('您是否确定初始化数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxActivity/queryLoanReward',
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({
                  message: data.message,
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    // 贷款双旦活动奖励发放
    sendLoanReward () {
      if (this.searchForm.status !== '0') {
        this.$message('请选择活动状态为待处理的进行奖励发放')
        return
      }
      if (this.searchForm.activityType !== '5') {
        this.$message('请选择贷款双旦活动奖励')
        return
      }
      this.$alert('您是否确定双旦活动奖励发放?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxActivity/sendLoanReward',
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({
                  message: data.message,
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    // 寻找代理商活动数据初始化
    queryFindAgentReward () {
      this.$alert('您是否确定初始化数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxActivity/queryFindAgentReward',
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({
                  message: data.message,
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    // 寻找代理商活动奖励发放
    sendFindAgentReward () {
      if (this.searchForm.status !== '0') {
        this.$message('请选择活动状态为待处理的进行奖励发放')
        return
      }
      if (this.searchForm.activityType !== '6') {
        this.$message('请选择寻找代理商活动奖励')
        return
      }
      this.$alert('您是否确定寻找代理商奖励发放?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxActivity/sendFindAgentReward',
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({
                  message: data.message,
                  type: 'success'
                })
              }
            })
          }
        }
      })
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
              {'name': 'fullTel', 'title': '手机号'},
              {'name': 'activityDesc', 'title': '活动类型'},
              {'name': 'amount', 'title': '发放金额'},
              {'name': 'sendTime', 'title': '发放日期'}
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>
