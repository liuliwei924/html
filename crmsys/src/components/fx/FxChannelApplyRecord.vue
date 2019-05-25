<template>
  <div class="fx-datail-record">
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="工号" prop="workNo">
          <el-input v-model="searchForm.workNo" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="申请姓名/手机号" prop="applyName">
          <el-input v-model="searchForm.applyName" placeholder="请输入姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="申请产品" prop="prodName">
          <el-input v-model="searchForm.prodName" placeholder="请输入申请产品"></el-input>
        </el-form-item>
        <el-form-item label="申请开始日期:" prop="applyStartTime">
          <el-date-picker
            v-model="searchForm.applyStartTime"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="申请开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请结束日期:"  prop="applyEndTime">
          <el-date-picker
            v-model="searchForm.applyEndTime"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="申请结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="状态">
            <el-option label="待确认" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
            <el-option label="已结算" value="3"></el-option>
            <el-option label="已过期" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column prop="workNo" label="工号" align="center" width="90">
      </el-table-column>
      <el-table-column prop="applyName" label="申请人姓名" align="center" min-width="30">
      </el-table-column>
      <el-table-column prop="applyTel" label="申请人手机号" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="cardNo" label="申请人身份证" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="prodName" label="申请产品" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" min-width="60">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="50">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1">待确认</el-tag>
          <el-tag v-if="scope.row.status===2" type="primary">未通过</el-tag>
          <el-tag v-if="scope.row.status===3" type="success">已结算</el-tag>
          <el-tag v-if="scope.row.status===4" type="danger">已过期</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
    </el-pagination>
  </div>
</template>


<script>
export default {
  name: 'fxChannelApply-record',
  data () {
    let directSettleCust = this.$route.query['custId'] || ''
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      custIdentifyData: {},
      searchForm: {
        directSettleCust,
        workNo: '',
        applyStartTime: '',
        applyEndTime: '',
        applyName: '',
        prodName: '',
        status: '',
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
      addShow: false,
      editShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 时间条件处理
    startDateChange (date) {
      this.searchForm.applyStartTime = date || ''
      this.searchForm.applyEndTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.applyEndTime = date || ''
    },
    // 编辑
    editHandle (row) {
      this.custIdentifyData = row
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
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxChannelCust/queryApplyList',
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
