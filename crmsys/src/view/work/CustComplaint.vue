<template>
  <div class="content-box">
    <div class="header__title">投诉及建议</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="投诉等级:">
          <el-select v-model="searchForm.complaintGrade" clearable placeholder="投诉等级">
            <el-option label="一般投诉" value="1"></el-option>
            <el-option label="严重投诉" value="2"></el-option>
            <el-option label="不合理投诉" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投诉状态:">
          <el-select v-model="searchForm.status" clearable placeholder="处理状态">
            <el-option label="待处理" value="0"></el-option>
            <el-option label="处理中" value="1"></el-option>
            <el-option label="处理完成" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名或手机号:">
          <el-input placeholder="客户姓名或手机号" v-model="searchForm.searchKey" class="kf-search-input"></el-input>
        </el-form-item>
        <el-form-item label="提交开始时间:">
          <el-date-picker
            v-model="searchForm.createTimeStart"
            type="date"
            :editable="false"
            placeholder="提交开始时间"
            @change="startTimeHandle($event)">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提交结束时间:">
          <el-date-picker
            v-model="searchForm.createTimeEnd"
            type="date"
            :editable="false"
            placeholder="提交结束时间"
            @change="endTimeHandle($event)"
            :picker-options="endTimeOptions">
          </el-date-picker>
        </el-form-item>
        <el-button @click="searchHandle('store')" :loading="searchLoading">查询</el-button>
      </el-form>
    </div>
    <el-table
      class="content__table table__gap"
      :data="tableData"
      border
      v-loading="loading"
      element-loading-text="拼命加载中">
      <el-table-column
        min-width="100"
        prop="custName"
        label="客户称呼">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="custTelephone"
        label="客户手机号">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="type"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" type="primary">建议</el-tag>
          <el-tag v-if="scope.row.type === 2" type="danger">投诉</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="busiName"
        label="业务经理称呼">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="busiTelephone"
        label="业务经理手机号">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="detailDesc"
        label="投诉建议描述">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="status"
        label="处理状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="info">待处理</el-tag>
          <el-tag v-if="scope.row.status === 1" type="primary">处理中</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">处理完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="complaintGrade"
        label="投诉等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.complaintGrade === 1" type="primary">一般投诉</el-tag>
          <el-tag v-if="scope.row.complaintGrade === 2" type="danger">严重投诉</el-tag>
          <el-tag v-if="scope.row.complaintGrade === 3" type="warning">不合理投诉</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="serviceTime"
        label="客服处理时间">
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="serviceName"
        label="客服处理人">
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="serviceDesc"
        label="客服描述">
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="formCurrentPage"
      layout="total, prev, pager, next"
      :total="formTotalRecords">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'cust-complaint',
  data () {
    let store = this.$getStore('custComplaint')
    return {
      searchForm: {
        type: '',
        complaintGrade: '',
        status: '',
        searchKey: '',
        createTimeStart: '',
        createTimeEnd: ''
      },
      formTotalRecords: 0,
      formCurrentPage: 1,
      searchLoading: false,
      startTime: store['startApplyTime'] || '',
      endTime: store['endApplyTime'] || '',
      startPickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      endTimeOptions: {},
      loading: false,
      tableData: []
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 查询处理
    searchHandle (params) {
      this.tableData = []
      if (params === 'store') this.$setStore('custComplaint', this.searchForm)
      this.$ajax({
        url: '/store/account/work/custComplaint/queryComplaintList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.formTotalRecords = data.page.totalRecords
        }
      })
    },
    // 分页处理
    pageHandle (page) {
      this.formCurrentPage = page
      this.searchHandle()
    },
    // 开始时间改变
    startTimeHandle (val) {
      this.searchForm.createTimeStart = val || ''
      this.endTimeOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(val).getTime() - 8.64e7
        }
      }
    },
    // 结束时间改变
    endTimeHandle (val) {
      this.searchForm.createTimeEnd = val || ''
    }
  }
}
</script>