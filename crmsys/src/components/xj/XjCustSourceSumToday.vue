<template>
  <div class="content-box">
    <div class="header__title">用户渠道统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="用户渠道:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.sourceType"
            placeholder="用户渠道">
          </el-input>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="1">今日</el-radio>
        <el-radio :label="2">本月</el-radio>
        <el-radio :label="3">月度</el-radio>
      </el-radio-group>
    </div>
    <!-- table表格数据 -->
     <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="recordDate"
        label="记录日期"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="sourceType"
        label="用户渠道"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="newCust"
        label="新注册用户数"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="identifyNewCust"
        label="新实名用户数"
        min-width="150">
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
  name: 'all-toDay',
  data () {
    // 缓存查询条件
    let store = this.$getStore('custSourceSumToday')
    return {
      status: 1,
      signId: '',
      activeClass: 'active',
      errorClass: 'span',
      searchForm: {
        sourceType: store['sourceType'] || '',
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
    // 查询处理
    searchHandle () {
      // 缓存查询条件
      this.$setStore('custSourceSumToday', this.searchForm, ['sourceType'])
      this.$ajax({
        url: '/store/account/xj/xjCustSourceSum/queryToday',
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