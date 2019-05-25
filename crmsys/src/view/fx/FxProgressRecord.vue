  <template>
    <div class="content-box">
      <div class="header__title">信用卡进度查询记录</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm" ref="searchForm">
          <!-- 查询条件 -->
          <el-form-item label="工号" prop="workNo">
            <el-input v-model="searchForm.workNo" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="查询状态" prop="applyStatus">
          <el-select v-model="searchForm.applyStatus" clearable placeholder="状态">
            <el-option label="待确认" value="1"></el-option>
            <el-option label="审核中" value="4"></el-option>
            <el-option label="未通过" value="2"></el-option>
            <el-option label="已结算" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自动发放状态" prop="autoReward">
          <el-select v-model="searchForm.autoReward" clearable placeholder="状态">
            <el-option label="未发放" value="0"></el-option>
            <el-option label="已发放" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="prodId">
          <el-select v-model="searchForm.prodId" clearable placeholder="产品名称">
            <el-option label="交通银行" value="2"></el-option>
            <el-option label="浦发银行" value="3"></el-option>
            <el-option label="兴业银行" value="1"></el-option>
            <el-option label="中信银行" value="4"></el-option>
            <el-option label="民生银行" value="5"></el-option>
            <el-option label="光大银行" value="10"></el-option>
            <el-option label="招商银行" value="12"></el-option>
          </el-select>
          </el-select>
      </el-form-item>
      <el-form-item label="查询开始日期:" prop="startTime">
          <el-date-picker
            v-model="searchForm.startTime"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="查询开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="查询结束日期:" prop="endTime">
          <el-date-picker
            v-model="searchForm.endTime"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="查询结束日期">
          </el-date-picker>
        </el-form-item>
          <el-form-item label="结算日期-起:" prop="settleStartDate">
          <el-date-picker v-model="searchForm.settleStartDate" type="date" editable @change="settleStartChange" :picker-options="startDateOptions" placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结算日期-止:" prop="settleEndDate">
          <el-date-picker v-model="searchForm.settleEndDate" type="date" editable @change="settleEndChange" :picker-options="endDateOptions" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" @click="searchHandle">查询</el-button>
          <el-button @click="resetForm('searchForm')">重置</el-button>
          <el-button :loading="loading" @click="autoRewardCount">自动佣金发放统计</el-button>
          <el-button @click="excelExportHandle">导出</el-button>
        </el-form-item>
        </el-form>
      </div>
      <el-table class="content__table"
       :data="tableData"
       @sort-change="sortEvent"
        border>
        <el-table-column
          prop="workNo"
          label="工号" align="center" min-width="65">
        </el-table-column>
        <el-table-column
          prop="applyName"
          label="姓名" align="center" min-width="70">
        </el-table-column>
        <el-table-column
          prop="applyTel"
          label="手机号" align="center" min-width="70">
        </el-table-column>
        <el-table-column
          prop="cardNo"
          label="身份证号码" align="center" min-width="75">
        </el-table-column>
        <el-table-column
          prop="prodName"
          label="产品名称" align="center" min-width="75">
        </el-table-column>
        <el-table-column
          prop="settleAmt"
          label="结算金额" align="center" min-width="75">
        </el-table-column>
        <el-table-column
          prop="settleDate"
          label="结算日期" align="center" min-width="75">
        </el-table-column>
        <el-table-column
          prop="proApplyTime"
          sortable
          label="产品申请时间" align="center" min-width="75">
        </el-table-column>
        <el-table-column
          prop="applyTime"
          sortable
          label="申请时间" align="center"min-width="75">
        </el-table-column>
        <el-table-column
          prop="auditTime"
          sortable
          label="审核时间" align="center" min-width="75">
        </el-table-column>
        <el-table-column prop="applyStatus" sortable label="申请状态" align="center" min-width="75">
          <template slot-scope="scope">
            <el-tag v-if ="scope.row.applyStatus=== 1 && scope.row.status != 4">待确认</el-tag>
            <el-tag v-if ="scope.row.applyStatus=== 1 && scope.row.status === 4">审核中</el-tag>
            <el-tag v-if ="scope.row.applyStatus=== 2" type="primary">未通过</el-tag>
            <el-tag v-if ="scope.row.applyStatus=== 3" type="success">已结算</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="autoReward" sortable label="自动发放状态" align="center" min-width="75">
          <template slot-scope="scope">
            <el-tag v-if ="scope.row.autoReward=== 0">未发放</el-tag>
            <el-tag v-if ="scope.row.autoReward=== 1" type="success">已发放</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="createTime"
          label="查询时间"  align="center" min-width="75">
        </el-table-column>
        <el-table-column
          sortable
          prop="sendErrorDesc"
          label="自动发送错误描述" align="center" min-width="80">
        </el-table-column>
        <el-table-column
          prop="operator"
          sortable
          label="操作人" align="center">
        </el-table-column>
          <el-table-column
            prop="operatorTime"
            sortable
            label="操作时间" align="center">
          </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <span>
              <el-button type="text" size="small" @click="userProcessQuery(scope.row)">用户查询状态</el-button>
              <el-button type="text" size="small" @click="processQuery(scope.row)">查询最新状态</el-button>
              <span v-if ="scope.row.applyStatus == 1 || scope.row.applyStatus == 2">
                <el-button type="text" size="small" @click="processAudit(scope.row)">审核</el-button>
              </span>
            </span>
        </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="content__page fr"
        @current-change="pageHandle"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="totalRecord">
      </el-pagination>
      <process-query v-model="processQueryShow" :processQueryData="processQueryData" @change="processQueryChange" />
      <user-process-query v-model="userProcessQueryShow" :showResult="showResult" :userProcessQueryData="userProcessQueryData" @change="userProcessQueryChange" />
      <fx-auto-reward-count v-model="autoRewardShow" :autoRewardData="autoRewardData" @change="autoRewardChange" />
      <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="fxProgress">
    </form>
    </div>
  </template>

<script>
import ProcessQuery from '@/components/fx/ProcessQuery'
import UserProcessQuery from '@/components/fx/UserProcessQuery'
import FxAutoRewardCount from '@/components/fx/FxAutoRewardCount'
export default {
  name: 'fx-activity-record',
  data () {
    let {lastMonth} = this.$monthDate()
    let store = this.$getStore('rechargeData')
    let currentPage = Number(this.$sessionStorage('fxProgressRecordPage') || 1)
    return {
      tableData: [],
      currentPage,
      totalRecord: 1,
      custIdentifyData: {},
      processQueryData: {},
      userProcessQueryData: {},
      exportParams: '',
      exportTitles: '',
      processQueryShow: false,
      userProcessQueryShow: false,
      showResult: false,
      showResulting: false,
      applyStatus: '',
      summary: {},
      autoRewardData: [],
      signId: '',
      searchForm: {
        orderBy: 'createTime',
        orderValue: 'desc',
        workNo: '',
        prodId: '',
        applyStatus: '',
        status: '',
        autoReward: '',
        startTime: store['startDate'] || lastMonth,
        endTime: '',
        settleStartDate: '',
        settleEndDate: '',
        currentPage
      },
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
      addShow: false,
      editShow: false,
      autoRewardShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    // 信用卡查询
    processQuery (row) {
      this.processQueryData = row
      this.processQueryShow = true
    },
    userProcessQuery (row) {
      this.showResult = false
      this.userProcessQueryData = row
      this.userProcessQueryShow = true
      if (row.status === 4) {
        this.showResulting = true
      } else {
        this.showResulting = false
      }
    },
    processAudit (row) {
      this.showResult = true
      this.userProcessQueryData = row
      this.userProcessQueryShow = true
    },
    // 修改申请信息弹窗监听
    processQueryChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.processQueryShow = false
      } else {
        this.processQueryShow = val
      }
    },
    // 修改申请信息弹窗监听
    userProcessQueryChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.userProcessQueryShow = false
      } else {
        this.userProcessQueryShow = val
      }
    },
    // 时间条件处理
    startDateChange (date) {
      this.searchForm.startTime = date || ''
      this.searchForm.endTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.endTime = date || ''
    },
    // 结算时间
    settleStartChange (date) {
      this.searchForm.settleStartDate = date || ''
      this.searchForm.settleEndDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    settleEndChange (date) {
      this.searchForm.settleEndDate = date || ''
    },
    sortEvent (column) {
      if (column.prop === null) {
        if (this.searchForm.hasOwnProperty('orderBy')) { delete this.searchForm['orderBy'] }
        if (this.searchForm.hasOwnProperty('orderValue')) { delete this.searchForm['orderValue'] }
      } else {
        this.searchForm.orderBy = column.prop
        this.searchForm.orderValue = column.order === 'ascending' ? 'asc' : 'desc'
      }
      this.searchHandle()
    },
    // 自动佣金发放统计
    autoRewardCount (row) {
      this.autoRewardShow = true
    },
    // 自动佣金发放弹窗监听
    autoRewardChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.autoRewardShow = false
      } else {
        this.autoRewardShow = val
      }
    },
    // 查询
    searchHandle () {
      let tempStatus = this.searchForm.applyStatus
      if (tempStatus === '4') {
        this.searchForm.applyStatus = '1'
        this.searchForm.status = '4'
      } else if (tempStatus === '1') {
        this.searchForm.status = ''
      }
      this.$ajax({
        url: '/store/account/fx/applyData/queryProcessRecord',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
          if (tempStatus === '4') {
            this.searchForm.applyStatus = '4'
            this.searchForm.status = '4'
          }
          this.totalRecord = data.page.totalRecords
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
              {'name': 'applyName', 'title': '申请人姓名'},
              {'name': 'applyTel', 'title': '申请人手机号'},
              {'name': 'prodName', 'title': '申请产品'},
              {'name': 'settleAmt', 'title': '结算佣金'},
              {'name': 'settleDate', 'title': '结算日期'}
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
      this.$sessionStorage('fxProgressRecordPage', page)
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    ProcessQuery,
    UserProcessQuery,
    FxAutoRewardCount
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
  .sumRed {
    color: red;
  }
</style>
