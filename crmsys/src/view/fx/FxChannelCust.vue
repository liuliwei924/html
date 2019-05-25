<template>
  <div class="content-box">
    <div class="header__title">团队管理</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="工号" prop="workNo">
          <el-input v-model="searchForm.workNo" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="用户名/手机号" prop="userName">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="grade">
          <el-select v-model="searchForm.grade" clearable placeholder="等级">
            <el-option label="实习专员" value="1"></el-option>
            <el-option label="专员 " value="2"></el-option>
            <el-option label="经理" value="3"></el-option>
            <el-option label="行长" value="4"></el-option>
          </el-select>
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
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
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
      <el-table-column 
        fixed="right" 
        label="操作" 
        width="160" 
        align="center">
        <template slot-scope="scope">
            <el-button type="text" size="small" @click="queryDtlHandle(scope.row)">详情</el-button>
        </template>
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
  name: 'fx-channel-cust',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      searchForm: {
        workNo: '',
        userName: '',
        grade: '',
        regStartTime: '',
        regEndTime: '',
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
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // table表格选择
    selectChange (arr) {
      let custIds = []
      for (let i = 0; i < arr.length; i++) {
        custIds.push(arr[i]['custId'])
      }
      this.custIds = custIds
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
        path: 'fxChannelCustDetail',
        query: {
          custId: row.custId,
          channelCustFlag: '1'
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxChannelCust/queryTeamManagerList',
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