<template>
  <div class="content-box">
    <div class="header__title">分销统计</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
          <!-- 注册时间 -->
        <el-form-item label="注册开始日期:" prop="regStartDate">
          <el-date-picker v-model="searchForm.regStartDate" type="date" editable @change="regStartChange" :picker-options="startDateOptions" placeholder="注册开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册结束日期:" prop="regEndDate">
          <el-date-picker v-model="searchForm.regEndDate" type="date" editable @change="regEndChange" :picker-options="endDateOptions" placeholder="注册结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button @click="excelExportHandle">导出</el-button>
      </el-form>
    </div>

       <div >
        <b class="strong">截止{{summary.regEndDate || '当天'}}总计:</b>
        总注册人数：<span class="sumRed">{{summary.totalRegNums}}</span>；
        总锁粉人数：<span class="sumRed">{{summary.totalLockNums}}</span>；
        总成功锁粉人数：<span class="sumRed">{{summary.totalRegLockNums}}</span>；
        总实名人数：<span class="sumRed">{{summary.totalIdentifyNums}}</span>；
        总绑卡人数：<span class="sumRed">{{summary.totalBankNums}}</span>；
        总申请数：<span class="sumRed">{{summary.totalApplyNums}}</span>； 
        总申请人数：<span class="sumRed">{{summary.totalApplyCustNums}}</span>； 
        总提现人数：<span class="sumRed">{{summary.txTotalNums}}</span>；
        总提现金额：<span class="sumRed">{{summary.txTotalAmt}}</span>；
        总反馈数据数：<span class="sumRed">{{summary.fbTotalNums}}</span>；
        总核卡数：<span class="sumRed">{{summary.matchTotalNums}}</span>
      </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="recordDate"
        label="注册日期" align="center">
      </el-table-column>
      <el-table-column
        prop="regNums"
        label="注册人数" align="center">
      </el-table-column>
      <el-table-column
        prop="activeRegNums"
        label="注册主动人数" align="center">
      </el-table-column>
      <el-table-column
        prop="lockNums"
        label="锁粉人数" align="center">
      </el-table-column>
      <el-table-column
        prop="succLockNums"
        label="锁粉成功(注册人数)" align="center" min-width="100">
      </el-table-column>
      <el-table-column
        prop="identifyNums"
        label="实名人数" align="center">
      </el-table-column>
      <el-table-column
        prop="bankNums"
        label="绑卡人数" align="center">
      </el-table-column>
      <el-table-column
        prop="withdrawNums"
        label="提现人数" align="center">
      </el-table-column>
      <el-table-column
        prop="withdrawTotalAmt"
        label="提现总额" align="center">
      </el-table-column>
      <el-table-column
        prop="totalApplyNums"
        label="申请总数" align="center">
      </el-table-column>
      <el-table-column
        prop="applyNums"
        label="申请人数" align="center">
      </el-table-column>
      <el-table-column
        prop="activeNums"
        label="每日活跃用户" align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="totalRecord">
    </el-pagination>
    <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="storeDayExp">
    </form>
  </div>
</template>

<script>
export default {
  name: 'rechargeData',
  data () {
    let {halfMonthDay} = this.$searchDate()
    let store = this.$getStore('rechargeData')
    return {
      summary: {},
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      rechargeData: {},
      exportParams: '',
      exportTitles: '',
      loading: false,
      signId: '',
      searchForm: {
        regStartDate: store['startDate'] || halfMonthDay,
        regEndDate: '',
        currentPage: 1
      },
      excelExportPath: this.$baseURL + 'store/account/fx/fxDataCount/fxDataCountExport',
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
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
     // 注册时间
    regStartChange (date) {
      this.searchForm.regStartDate = date || ''
      this.searchForm.regEndDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    regEndChange (date) {
      this.searchForm.regEndDate = date || ''
    },
    // 查询
    searchHandle () {
       // 缓存查询条件
      this.$setStore('rechargeData', this.searchForm)
      this.$ajax({
        url: '/store/account/fx/fxDataCount/queryCustOfDay',
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
      this.$ajax({
        url: '/store/account/fx/fxDataCount/queryCustSummary',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.summary = data.attr.summary || {}
          this.summary.regEndDate = this.searchForm.regEndDate
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
              {'name': 'registerData', 'title': '注册日期'},
              {'name': 'regNums', 'title': '注册人数'},
              {'name': 'activeRegNums', 'title': '注册主动人数'},
              {'name': 'lockNums', 'title': '锁粉人数'},
              {'name': 'identifyNums', 'title': '实名人数'},
              {'name': 'bankNums', 'title': '绑卡人数'},
              {'name': 'withdrawNums', 'title': '提现人数'},
              {'name': 'wTotalAmt', 'title': '提现总额'},
              {'name': 'totalApplyNums', 'title': '申请总数'},
              {'name': 'applyNums', 'title': '申请人数'}
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
