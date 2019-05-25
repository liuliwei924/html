<template>
  <div class="content-box">
    <div class="header__title">评价统计</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="讲师姓名或手机号" prop="userName">
          <el-input v-model="searchForm.userName" placeholder="请输入讲师姓名或手机号"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="startTime"
            type="datetime"
            :editable="true"
            placeholder="开始时间"
            @change="startTimeHandle($event)"
            class="kf-search-date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="endTime"
            type="datetime"
            :editable="true"
            placeholder="结束时间"
            @change="endTimeHandle($event)"
            :picker-options="endTimeOptions"
            class="kf-search-date">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form>
    </div>

    <el-table class="content__table"
     :data="tableData"
     @sort-change="sortEvent"
     border>
      <el-table-column
        prop="userName"
        label="讲师姓名" align="center">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="讲师手机号" align="center">
      </el-table-column>
      <el-table-column
        prop="workNo"
        sortable
        label="讲师工号" align="center">
      </el-table-column>
      <el-table-column prop="grade" sortable label="讲师等级" align="center">
        <template slot-scope="scope">
          <span v-if ="scope.row.grade=== 1">实习专员</span>
          <span v-if ="scope.row.grade=== 2">专员</span>
          <span v-if ="scope.row.grade=== 3">经理</span>
          <span v-if ="scope.row.grade=== 4">行长</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="star1"
        sortable
        label="1星" align="center">
      </el-table-column>
      <el-table-column
        prop="star2"
        sortable
        label="2星" align="center">
      </el-table-column>
      <el-table-column
        prop="star3"
        sortable
        label="3星" align="center">
      </el-table-column>
      <el-table-column
        prop="star4"
        sortable
        label="4星" align="center">
      </el-table-column>
      <el-table-column
        prop="star5"
        sortable
        label="5星" align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
</template>

<script>
let d = new Date()
let msec = ((d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds()) * 1000
let date = new Date(Date.now() - 7 * 8.64e7 - msec)
export default {
  name: 'rechargeData',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      rechargeData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        orderBy: '',
        orderValue: '',
        userName: '',
        rechargeType: '',
        startTime: '',
        endTime: '',
        currentPage: 1
      },
      endTimeOptions: '',
      startTime: date,
      endTime: d
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 查询
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
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxEval/evalCount',
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
    startTimeHandle (start) {
      // 开始时间选择
      this.searchForm.startTime = start || ''
      this.endTimeOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(start).getTime() - 8.64e7
        }
      }
    },
    endTimeHandle (end) {
      // 结束时间处理
      this.searchForm.endTime = end || ''
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
</style>
