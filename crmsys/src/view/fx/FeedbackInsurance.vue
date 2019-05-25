<template>
  <div class="content-box">
    <div class="header__title">保险反馈数据</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <!-- 申请人姓名 -->
        <el-form-item label="申请人工号/姓名/手机/身份证" prop="applyName">
          <el-input v-model.trim="searchForm.applyName" placeholder="工号/姓名/手机/身份证"></el-input>
        </el-form-item>
        <el-form-item label="代理人姓名/手机号" prop="refererName">
          <el-input v-model.trim="searchForm.refererName" placeholder="请输入申请人姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="申请产品" prop="prodName">
          <el-input v-model.trim="searchForm.prodName" placeholder="请输入申请产品"></el-input>
        </el-form-item>
        <el-form-item label="保单号" prop="insuranceNo">
          <el-input v-model.trim="searchForm.insuranceNo" placeholder="请输入保单号"></el-input>
        </el-form-item>
        <el-form-item label="反馈ID" prop="succId">
          <el-input v-model.trim="searchForm.succId" placeholder="请输入反馈ID"></el-input>
        </el-form-item>
        <!-- 反馈状态 -->
        <el-form-item label="反馈状态" prop="backStatus">
          <el-select v-model="searchForm.backStatus" clearable placeholder="请选择反馈状态">
            <el-option label="审核中" value="0"></el-option>
            <el-option label="申请成功" value="1"></el-option>
            <el-option label="已拒绝" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- 后台匹配状态 -->
        <el-form-item label="匹配状态" prop="matchStatus">
          <el-select v-model="searchForm.matchStatus" clearable placeholder="请选择匹配状态">
            <el-option label="未匹配" value="0"></el-option>
            <el-option label="待匹配" value="2"></el-option>
            <el-option label="已匹配" value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- 导入时间 -->
        <el-form-item label="导入时间-起:" prop="importStartTime">
          <el-date-picker v-model="searchForm.importStartTime" type="datetime" editable @change="importStartChange" :picker-options="startDateOptions" placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="导入时间-止:" prop="importEndTime">
          <el-date-picker v-model="searchForm.importEndTime" type="datetime" editable @change="importEndChange" :picker-options="endDateOptions" placeholder="结束日期">
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
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-upload class="upload-demo" :action="policyImportPath" accept="xls" :data="excelForm" :show-file-list="false" :before-upload="beforeUp" :on-success="upSuccess">
          <el-button size="small" icon="upload" type="primary" class="excelBtn" :loading="loading" @click.stop="uploadBtn" :disabled="loading">保险数据导入</el-button>
        </el-upload>
        <el-button @click="excelExportHandle">导出</el-button>
        <el-button icon="plus"  @click="download">下载Excel模板</el-button>
        <el-button :loading="loading" @click="settleAmount">数据匹配</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="showStatus">
        <el-radio :label="1">信用卡</el-radio>
        <el-radio :label="2">保险</el-radio>
        <el-radio :label="3">贷款</el-radio>
      </el-radio-group>
    </div>
    <el-table class="content__table" :data="tableData" 
    border @selection-change="selectChange"
    @sort-change="sortEvent">
      <el-table-column prop="succId" label="反馈ID" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="workNo" label="工号" align="center" min-width="70">
      </el-table-column>
      <el-table-column prop="applyName" label="姓名" align="center" min-width="65">
      </el-table-column>
      <el-table-column prop="prodName" label="申请产品" align="center" min-width="70">
      </el-table-column>
      <el-table-column prop="insuranceNo" label="保单号" align="center" min-width="70">
      </el-table-column>
      <el-table-column prop="buyPrice" label="保费" align="center" min-width="65">
      </el-table-column>
      <el-table-column prop="refererName" label="代理姓名" align="center" min-width="65">
      </el-table-column>
      <el-table-column prop="refererTel" label="代理手机" align="center" min-width="80">
      </el-table-column>
      <el-table-column prop="settleAmt" label="结算佣金" align="center" min-width="90"
      sortable :render-header="(h, options) => {return renderHeader(h, options, '结算佣金')}">
      </el-table-column>
      <el-table-column prop="settleDate" label="结算日期" align="center" min-width="75">
      </el-table-column>
      <el-table-column prop="importTime" label="导入时间" align="center" min-width="100">
      </el-table-column>
       <el-table-column prop="backStatus" label="反馈状态" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.backStatus===0">审核中</el-tag>
          <el-tag v-if="scope.row.backStatus===1" type="success">申请成功</el-tag>
          <el-tag v-if="scope.row.backStatus===2" type="danger">已拒绝</el-tag>
        </template>
      </el-table-column>
       <el-table-column prop="matchStatus" label="匹配状态" min-width="70">
        <template slot-scope="scope">
           <el-tag v-if="scope.row.matchStatus===0">未匹配</el-tag>
           <el-tag v-if="scope.row.matchStatus===2" type="primary">待匹配</el-tag>
           <el-tag v-if="scope.row.matchStatus===1" type="success">已匹配</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80" align="center">
        <template slot-scope="scope">
           <span v-if ="scope.row.matchStatus===0 || scope.row.matchStatus===2">
            <el-button type="text" size="small" @click="manualMatch(scope.row)">人工匹配</el-button>
           </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage"
    layout="total, prev, pager, next, jumper" :total="totalRecord">
    </el-pagination>
    <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="storeDayExp">
    </form>
    <feedback-match v-model="editShow" :feedbackData="feedbackData" @change="editChange" />
  </div>
</template>


<script>
import FeedbackAudit from '@/components/fx/FeedbackAudit'
import FeedbackMatch from '@/components/fx/FeedbackMatch'
export default {
  name: 'feedback-insurance',
  data () {
    let signId = JSON.parse(this.$localStorage('signId')).v
    let {lastMonth} = this.$monthDate()
    let store = this.$getStore('rechargeData')
    return {
      smsTempData: [],
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      succIds: [],
      exportParams: '',
      exportTitles: '',
      feedbackData: {},
      editShow: false,
      signId: '',
      showStatus: 2,
      searchForm: {
        applyName: '',
        refererName: '',
        succId: '',
        insuranceNo: '',
        prodName: '',
        backStatus: '',
        matchStatus: '',
        importStartTime: store['startDate'] || lastMonth,
        importEndTime: '',
        settleStartDate: '',
        settleEndDate: '',
        prodType: 2,
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
      excelExportPath: this.$baseURL + 'store/account/fx/feedbackData/feedbackExport',
      policyImportPath: this.$baseURL + 'store/account/fx/feedbackData/policyImport',
      excelForm: {
        signId: signId
      },
      loading: false,
      auditShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  watch: {
    // 处理状态改变监听
    showStatus (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    // table表格选择
    selectChange (arr) {
      let succIds = []
      for (let i = 0; i < arr.length; i++) {
        succIds.push(arr[i]['succId'])
      }
      this.succIds = succIds
    },
    // 编辑
    manualMatch (row) {
      this.feedbackData = row
      this.editShow = true
    },
    // 编辑弹窗监听
    editChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.editShow = false
      } else {
        this.editShow = val
      }
    },
    // 导入时间
    importStartChange (date) {
      this.searchForm.importStartTime = date || ''
      this.searchForm.importEndTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    importEndChange (date) {
      this.searchForm.importEndTime = date || ''
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
    download () {
      let signId = JSON.parse(this.$localStorage('signId')).v
      window.open(this.$baseURL + 'store/account/fx/feedbackData/getFeedbackTemp?signId=' + signId)
    },
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
    // 排序处理
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
        url: '/store/account/fx/feedbackData/queryFeedbackList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 结算佣金
    settleAmount () {
      this.$ajax({
        url: '/store/account/fx/feedbackData/settleAmount',
        data: {matchStatus: status},
        loading: true,
        success: data => {
          this.searchHandle()
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
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    FeedbackAudit,
    FeedbackMatch
  }
}
</script>
