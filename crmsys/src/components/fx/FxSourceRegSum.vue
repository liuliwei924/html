<template>
  <div class="content-box">
    <div class="header__title">注册数据</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
          <!-- 注册时间 -->
        <el-form-item label="开始日期:" prop="startDate">
          <el-date-picker v-model="searchForm.startDate" type="date" editable @change="startChange" :picker-options="startDateOptions" placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:" prop="endDate">
          <el-date-picker v-model="searchForm.endDate" type="date" editable @change="endChange" :picker-options="endDateOptions" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请渠道名称" prop="sourceType">
          <el-input v-model.trim="searchForm.sourceType" placeholder="请输入申请渠道名称"></el-input>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form>
    </div>
      <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="1">注册</el-radio>
        <el-radio :label="2">申请</el-radio>
      </el-radio-group>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="registerDate"
        label="注册日期" align="center">
      </el-table-column>
      <el-table-column
        prop="regNums"
        label="注册人数" align="center">
      </el-table-column>
      <el-table-column
        prop="sourceType"
        label="申请渠道" align="center">
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
export default {
  name: 'fx-source-reg-sum',
  data () {
    let {curMonth} = this.$monthDate()
    let store = this.$getStore('rechargeData')
    return {
      summary: {},
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      rechargeData: {},
      loading: false,
      status: 1,
      searchForm: {
        sourceType: '',
        startDate: store['startDate'] || curMonth,
        endDate: '',
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
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  methods: {
     // 注册时间
    startChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endChange (date) {
      this.searchForm.endDate = date || ''
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxSourceCount/queryRegSourceOfDay',
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
  .sumRed {
    color: red;
  }
</style>
