<template>
  <div class="content-box">
    <div class="header__title">风控统计</div>
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
            disabled
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
            disabled
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
          <!-- <el-button @click="exportData()" v-if="isExport" class="export-btn">导出</el-button> -->
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
    <el-table
      class="content__table"
      :data="tableData"
      border>
        <el-table-column
          width="120"
          prop="recordDate"
          align="center"
          label="记录日期">
        </el-table-column>
        <el-table-column
          width="120"
          prop="notHitCount"
          align="center"
          label="未命中数">
        </el-table-column>
        <el-table-column
          prop="hitLeTimesCount3"
          min-width="150"
          align="center"
          label="命中未超过三次">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="hitMoTimesCount3"
          align="center"
          label="命中三次以上">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="failCount"
          align="center"
          label="查询失败数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="totalCount"
          align="center"
          label="查询总次数">
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
    <!-- 导出 -->
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
          <input type="text" name="exportParams" v-model="exportParams">
          <input type="text" name="exportTitles" v-model="exportTitles">
          <input type="text" name="signId" v-model="signId">
          <input type="text" name="exportType" value="riskToDay">
    </form>
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
// 总的统计本月
export default {
  name: 'risk-toDay',
  data () {
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('riskToDay')
    return {
      status: 3,
      exportPath: this.$baseURL + 'store/account/user/export/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      activeClass: 'active',
      errorClass: 'span',
      titileBar: '风控今日统计列表',
      searchForm: {
        startRecordDate: '',
        endRecordDate: '',
        currentPage: store['currentPage'] || 1
      },
      isExport, // 是否可以导出
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
    exportData () {
      let params = {}
      let roleType = this.$localStorage('userRole')
      Object.assign(params, this.searchForm, {
        roleType
      })
      this.exportParams = JSON.stringify(params)

      this.signId = expireStore('signId')
      let title = [
        {'name': 'recordDate', 'title': '记录日期'},
        {'name': 'notHitCount', 'title': '未命中数'},
        {'name': 'hitLeTimesCount3', 'title': '命中未超过三次'},
        {'name': 'hitMoTimesCount3', 'title': '命中三次以上'},
        {'name': 'failCount', 'title': '查询失败数'},
        {'name': 'totalCount', 'title': '查询总次数'}
      ]
      this.exportTitles = JSON.stringify(title)
      let formDom = document.getElementById('JS-form-export')
      window.setTimeout(function () {
        formDom.submit()
      }, 100)
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endRecordDate = date || ''
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('riskDay', this.searchForm, ['startRecordDate', 'endRecordDate'])
      this.$ajax({
        url: '/store/account/dataset/riskCount/queryRiskToDay',
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