<template>
  <div class="content-box">
    <div class="header__title">佣金记录</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="创建时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户姓名或手机号:">
          <el-input
            v-model="searchForm.searchKey"
            placeholder="请输入用户姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="被推荐用户姓名:">
          <el-input
            v-model="searchForm.recCustName"
            placeholder="请输入被推荐用户姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="佣金类型:">
          <el-select
            v-model="searchForm.commiType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in commiType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="佣金状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="realName"
        label="用户姓名"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="用户手机号码"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="佣金金额"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column 
        prop="commiRate" 
        label="佣金比例"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="commiType"
        label="佣金类型"
        align="center"
        min-width="120">
        <template slot-scope="scope">{{commiType[scope.row.commiType]}}</template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="佣金状态"
        align="center"
        min-width="120">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="recCustName"
        label="被推荐人"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="rechargeTime"
        label="充值时间"
        align="center"
        min-width="120">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
  </div>
</template>

<script>
export default {
  name: 'wzComm-Record',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let showStartDate = lastWeekDay || ''
    // 缓存查询条件
    let comm = this.$getStore('commRecord')
    return {
      tableData: [],
      totalRecord: 0,
      addShow: false,
      editShow: false,
      loading: false,
      searchForm: {
        searchKey: comm['searchKey'] || '',
        commiType: comm['commiType'] || '',
        status: comm['status'] || '',
        recCustName: comm['recCustName'] || '',
        startDate: comm['startDate'] || showStartDate,
        endDate: comm['endDate'] || '',
        currentPage: 1
      },
      auditShow: false,
      // 佣金类型
      commiType: {
        1: '个人vip佣金',
        2: '企业佣金'
      },
      // 佣金状态
      status: {
        0: '未领取',
        1: '已领取',
        2: '领取失败'
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
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('commRecord', this.searchForm)
      this.$ajax({
        url: '/store/account/wz/wzCommRecord/queryCommRecord',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>
