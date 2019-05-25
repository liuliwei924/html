<template>
  <div class="content-box">
    <div class="header__title">城市分单情况</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item
          label="城市:"
          :rules="{required: false, message: '城市不能为空'}">
          <el-select
            v-model="searchForm.cityName"
            clearable
            filterable
            placeholder="请选择城市">
            <el-option
              v-for="item,index in cityNameList"
              :label="item.cityName"
              :value="item.cityName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="1">今日</el-radio>
        <el-radio :label="2">本周</el-radio>
        <el-radio :label="3">本月</el-radio>
      </el-radio-group>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      show-summary
      :summary-method="getSummaryData"
      border>
      <el-table-column
        min-width="200"
        prop="recordDate"
        label="记录日期">
      </el-table-column>   
      <el-table-column
        min-width="200"
        prop="cityName"
        label="城市">
      </el-table-column>
      <el-table-column
        min-width="200"
        prop="allotCount"
        label="总分单数">
      </el-table-column>
      <el-table-column
        min-width="200"
        prop="recPersonCount"
        label="分单人数">
      </el-table-column>
      <el-table-column
        min-width="200"
        prop="avgCount"
        label="平均分单数">
      </el-table-column>
    </el-table>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      :page-sizes="[20]"
      layout="total, sizes, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
</template>

<script>
// 门店人员统计今日
export default {
  name: 'cityAllot-Day',
  data () {
    // 缓存查询条件
    let store = this.$getStore('cityAllotWeek')
    return {
      status: 2,
      searchForm: {
        cityName: store['cityName'] || '',
        currentPage: store['currentPage'] || 1
      },
      loading: false,
      tableData: [],
      totalRecord: 1,
      cityNameList: {}
    }
  },
  created () {
    this.searchForm.currentPage = 1
    this.searchHandle()
    this.getCityName()
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    getSummaryData (param) {
      const { columns, data } = param
      const sums = ['总计', '', 0, 0, 0]
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
      })
      sums[4] = Math.round(sums[2] / (sums[3] === 0 ? 1 : sums[3]))
      return sums
    },
    getCityName () {
      this.$ajax({
        url: '/store/account/user/comm/queryNetCity',
        success: data => {
          this.cityNameList = data.attr['cityNameList']
        }
      })
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('cityAllotWeek', this.searchForm)
      this.$ajax({
        url: '/store/account/dataset/cityAllotCount/queryCityAllotWeek',
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