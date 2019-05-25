<template>
  <div class="content-box">
    <div class="header__title">用户数据统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始日期:">
          <el-date-picker
            v-model="searchForm.startRecordDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:">
          <el-date-picker
            v-model="searchForm.endRecordDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
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
        <el-radio :label="3">今日</el-radio>
        <el-radio :label="1">本月</el-radio>
        <el-radio :label="2">月度</el-radio>
      </el-radio-group>
    </div>
    <!-- table表格数据 -->
     <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="recordDate"
        label="记录日期"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="totalCust"
        label="总用户"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="newCust"
        label="新注册用户"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="identifyCust"
        label="实名认证用户"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="identifyNewCust"
        label="新增实名认证用户"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="activeCust"
        label="活跃用户"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="totalWallet"
        label="钱包总数"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="newWallet"
        label="钱包新注册数"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="activeWallet"
        label="钱包活跃用户"
        min-width="80">
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
// 总的统计本月
export default {
  name: 'all-day',
  data () {
    let {firstDay, yesterday} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('custInfoSumDay')
    return {
      status: 1,
      signId: '',
      activeClass: 'active',
      errorClass: 'span',
      searchForm: {
        startRecordDate: firstDay,
        endRecordDate: yesterday,
        currentPage: store['currentPage'] || 1
      },
      loading: false,
      tableData: [],
      sumTotalData: {},
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
          return time.getTime() > Date.now() - 8.64e7
        }
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
      this.searchForm.startRecordDate = date || ''
      this.searchForm.endRecordDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endRecordDate = date || ''
    },
    // 查询处理
    searchHandle () {
      // 缓存查询条件
      this.$setStore('custInfoSumDay', this.searchForm, ['startRecordDate', 'endRecordDate'])
      this.$ajax({
        url: '/store/account/xj/xjCustInfoSum/queryByDay',
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