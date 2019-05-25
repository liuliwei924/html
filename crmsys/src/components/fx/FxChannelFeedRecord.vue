<template>
  <div class="fx-datail-record">
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <!-- 申请人姓名 -->
        <el-form-item label="申请人姓名/手机号" prop="applyName">
          <el-input v-model="searchForm.applyName" placeholder="请输入申请人姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="申请人身份证号" prop="cardNo">
          <el-input v-model="searchForm.cardNo" placeholder="请输入申请人身份证号"></el-input>
        </el-form-item>
        <el-form-item label="代理人姓名/手机号" prop="refererName">
          <el-input v-model="searchForm.refererName" placeholder="请输入申请人姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="申请产品" prop="prodName">
          <el-input v-model="searchForm.prodName" placeholder="请输入申请产品"></el-input>
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
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column prop="applyName" label="申请人姓名" align="center" min-width="70">
      </el-table-column>
      <el-table-column prop="applyTel" label="申请人手机" align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="cardNo" label="身份证号" align="center" min-width="80">
      </el-table-column>
      <el-table-column prop="prodName" label="申请产品" align="center" min-width="80">
      </el-table-column>
      <el-table-column prop="auditDate" label="批卡日期" align="center" min-width="80">
      </el-table-column>
      <el-table-column prop="settleAmt" label="结算佣金" align="center" min-width="60">
      </el-table-column>
      <el-table-column prop="refererName" label="代理人姓名" align="center" min-width="70">
      </el-table-column>
       <el-table-column prop="refererTel" label="代理人手机" align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="settleDate" label="结算日期" align="center" min-width="80">
      </el-table-column>
    </el-table>
    <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" 
    layout="total, prev, pager, next, jumper" :total="totalRecord">
    </el-pagination>
  </div>
</template>


<script>
export default {
  name: 'fxChannelFeed-record',
  data () {
    let referer = this.$route.query['custId'] || ''
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      editShow: false,
      searchForm: {
        referer,
        applyName: '',
        refererName: '',
        cardNo: '',
        prodName: '',
        settleStartDate: '',
        settleEndDate: '',
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
      loading: false,
      auditShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
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
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxChannelCust/queryFeedbackList',
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