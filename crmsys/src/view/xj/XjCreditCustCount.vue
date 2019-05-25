<template>
  <div class="content-box">
    <div class="header__title">用户统计</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="姓名/手机号码" prop="realName">
            <el-input v-model="searchForm.realName" placeholder="姓名/手机号码"></el-input>
        </el-form-item>
        <!--<el-form-item label="开始日期-起:" prop="startDate">
          <el-date-picker v-model="searchForm.startDate" type="date" editable @change="startDateChange" :picker-options="startDateOptions" placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期-止:" prop="endDate">
          <el-date-picker v-model="searchForm.endDate" type="date" editable @change="endDateChange" :picker-options="endDateOptions" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>-->
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <!-- <el-button @click="excelExportHandle">导出</el-button>
        <el-form-item label="导出条数:" prop="limitNum" class="child-input100">
            <el-input v-model="limitNum" placeholder="导出条数"></el-input>
        </el-form-item> -->
      </el-form>
    </div>
    <el-table class="content__table" 
      :data="tableData"
      @sort-change="sortEvent"
      border>
      <el-table-column
        prop="realName"
        label="姓名" 
        align="center">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码" align="center">
      </el-table-column>
      <el-table-column
        prop="apply1"
        sortable
        label="申请数" align="center">
      </el-table-column>
      <el-table-column
        prop="batch1"
        sortable
        label="批卡数" align="center">
      </el-table-column>
      <el-table-column
        prop="apply2"
        sortable
        label="一级好友申请数" align="center">
      </el-table-column>
      <el-table-column
        prop="batch2"
        sortable
        label="一级好友批卡数" align="center">
      </el-table-column>
      <el-table-column
        prop="apply3"
        sortable
        label="二级好友申请数" align="center">
      </el-table-column>
      <el-table-column
        prop="batch3"
        sortable
        label="二级好友批卡数" align="center">
      </el-table-column>
      <el-table-column
        prop="rewardAmount"
        sortable
        label="总佣金" align="center">
      </el-table-column>
      <el-table-column
        prop="withdrawAmt"
        sortable
        label="提现总额" align="center">
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
        <input type="text" name="exportType" value="fxCustCount">
    </form>
  </div>
</template>

<script>
export default {
  name: 'fxCustCount',
  data () {
    let store = this.$getStore('fxCustCount')
    let {today} = this.$searchDate()
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      exportParams: '',
      limitNum: 100,
      exportTitles: '',
      loading: false,
      signId: '',
      searchForm: {
        realName: '',
        startDate: store['startDate'] || '',
        endDate: store['endDate'] || today,
        orderBy: '',
        orderValue: '',
        currentPage: 1
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
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
     // 申请时间
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.endDate = date || ''
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
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('fxCustCount', this.searchForm)
      this.$ajax({
        url: '/store/account/xjCredit/creditCustCount/queryCustList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // Excel导出弹框
    excelExportHandle () {
      this.$alert('您是否确定导出数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            if (this.limitNum > 1000) {
              this.$msg('一次最多导出1000条数据，请重新输入导出条数!')
              return
            }
            let params = {limitNum: this.limitNum}
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
              {'name': 'refererApplyNum', 'title': '推荐的申请数(进件)'},
              {'name': 'succNum', 'title': '批卡数量'},
              {'name': 'lockNums', 'title': '锁粉数量'},
              {'name': 'rewardAmount', 'title': '总佣金'},
              {'name': 'withdrawAmt', 'title': '提现总额'}
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
.content-box .header__search .child-input100 .el-input__inner{
  width:100px;
}
</style>