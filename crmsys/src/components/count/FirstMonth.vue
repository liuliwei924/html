<template>
  <div class="content-box">
    <div class="header__title">一手数据</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始月份:">
          <el-date-picker
            v-model="searchForm.startMonth"
            type="month"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束月份:">
          <el-date-picker
            v-model="searchForm.endMonth"
            type="month"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束月份">
          </el-date-picker>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="1">本月</el-radio>
        <el-radio :label="2">月度</el-radio>
      </el-radio-group>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border>
      <el-table-column
        prop="dateTime"
        label="日期"
        min-width="100">
      </el-table-column>
       <el-table-column
        prop="applyType"
        label="跟单类型"
        min-width="100">
        <template slot-scope="scope">{{applyType[scope.row.applyType]}}</template>
      </el-table-column>
      <el-table-column
        prop="bookcount"
        label="上门量"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="signcount"
        label="签单量"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="signAmount"
        label="签单金额"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="recount"
        label="回款量"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="feeAmount"
        label="回款金额"
        min-width="100">
      </el-table-column>
    </el-table>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
</template>

<script>
// 一手数据月度
export default {
  name: 'first-month',
  data () {
    let {curMonth, lastMonth} = this.$monthDate()
    return {
      status: 2,
      searchForm: {
        startMonth: lastMonth,
        endMonth: curMonth,
        currentPage: 1
      },
      loading: false,
      tableData: [],
      totalRecord: 1,
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
      // 单子类型
      applyType: {
        1: '优质单',
        2: '普通单',
        3: '垃圾单',
        4: '不押车贷',
        5: '微店单',
        6: '准优质单'
      }
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
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endDate = date || ''
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.$ajax({
        url: '/store/account/dataset/firstTotal/queryFirstData',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>