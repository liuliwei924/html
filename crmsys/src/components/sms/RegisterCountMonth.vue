<template>
  <div class="content-box">
    <div class="header__title">用户注册分渠道统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始日期:">
          <el-date-picker
            v-model="searchForm.startMonth"
            type="month"
            editable
            :picker-options="startMonthOptions"
            @change="startMonthChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:">
          <el-date-picker
            v-model="searchForm.endMonth"
            type="month"
            editable
            :picker-options="endMonthOptions"
            @change="endMonthChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="app类型" prop="appType">
          <el-select v-model="searchForm.appType" clearable placeholder="请选择app类型">
            <el-option label="小小金融" value="xxjr"></el-option>
            <el-option label="信贷经理" value="xdjl"></el-option>
            <el-option label="小小贷款" value="xxdk"></el-option>
            <el-option label="打白条" value="dbt"></el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="1">按日</el-radio>
        <el-radio :label="2">按月</el-radio>
      </el-radio-group>
    </div>
    <!-- table表格数据 -->
    <el-table class="content__table" :data="tableData" border>
      <el-table-column min-width="120" prop="recordDate" label="日期">
      </el-table-column>
      <el-table-column prop="appType" label="app类型" min-width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.appType==='xxjr'">小小金融</el-tag>
          <el-tag v-if="scope.row.appType==='xdjl'">信贷经理</el-tag>
          <el-tag v-if="scope.row.appType==='xxdk'">小小贷款</el-tag>
          <el-tag v-if="scope.row.appType==='dbt'">打白条</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="90" prop="totalSize" label="总注册量">
      </el-table-column>
      <el-table-column min-width="110" prop="sms" label="短信注册量">
      </el-table-column>
      <el-table-column min-width="100" prop="AppStore" label="AppStore">
      </el-table-column>
      <el-table-column prop="tencent" label="腾讯">
      </el-table-column>
      <el-table-column prop="tencent2" label="腾讯2">
      </el-table-column>
      <el-table-column prop="360" label="360">
      </el-table-column>
      <el-table-column prop="baidu" label="百度">
      </el-table-column>
      <el-table-column prop="huawei" label="华为">
      </el-table-column>
      <el-table-column prop="oppo" label="OPPO">
      </el-table-column>
      <el-table-column prop="vivo" label="vivo">
      </el-table-column>
      <el-table-column prop="xiaomi" label="小米">
      </el-table-column>
      <el-table-column prop="meizu" label="魅族">
      </el-table-column>
      <el-table-column prop="alibaba" label="阿里">
      </el-table-column>
      <el-table-column min-width="90"  prop="appxqd1" label="新渠道1">
      </el-table-column>
      <el-table-column min-width="90"  prop="appxqd2" label="新渠道2">
      </el-table-column>
      <el-table-column min-width="90"  prop="appxqd3" label="新渠道3">
      </el-table-column>
      <el-table-column min-width="90"  prop="appxqd4" label="新渠道4">
      </el-table-column>
      <el-table-column min-width="90"  prop="appxqd5" label="新渠道5">
      </el-table-column>
      <el-table-column min-width="90"  prop="appxqd6" label="新渠道6">
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
// 门店人员统计本月
export default {
  name: 'registerCount-month',
  data () {
    let {curMonth, lastMonth} = this.$monthDate()
    return {
      status: 2,
      signId: '',
      titileBar: '门店人员日统计列表',
      searchForm: {
        appType: '',
        startMonth: lastMonth,
        endMonth: curMonth
      },
      loading: false,
      tableData: [],
      totalRecord: 1,
      // 开始时间禁用
      startMonthOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endMonthOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      checked: true
    }
  },
  created () {
    this.searchHandle()
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    },
    checked (val) {
      this.searchHandle()
    }
  },
  methods: {
    // 开始时间改变处理
    startMonthChange (date) {
      this.searchForm.startMonth = date || ''
      this.searchForm.endMonth = ''
      this.endMonthOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime()
      }
    },
    // 结束时间改变处理
    endMonthChange (date) {
      this.searchForm.endMonth = date || ''
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/sms/registerCount/channelMonth',
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