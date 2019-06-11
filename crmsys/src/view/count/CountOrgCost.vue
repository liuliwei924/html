<template>
  <div class="content-box">
    <div class="header__title">门店成本统计</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm" >
          <el-form-item label="开始日期" v-if="routeParams === 2">
            <el-date-picker
              v-model="startRecordDate"
              type="date"
              :editable="false"
              placeholder="开始日期"
              @change="startTimeHandle($event)"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" v-if="routeParams === 2">
            <el-date-picker
              v-model="endRecordDate"
              type="date"
              :editable="false"
              placeholder="结束日期"
              @change="endTimeHandle($event)"
              :picker-options="endTimeOptions"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开始月份" v-if="routeParams === 3">
            <el-date-picker
              v-model="startRecordMonth1"
              type="month"
              :editable="false"
              @change="startMonthHandle($event)"
              placeholder="开始月份">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束月份" v-if="routeParams === 3">
            <el-date-picker
              v-model="endRecordMonth1"
              type="month"
              :editable="false"
              @change="endMonthHandle($event)"
              placeholder="结束月份">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开始日期" v-if="routeParams === 4">
            <el-date-picker
              v-model="startRecordDate"
              type="date"
              :editable="false"
              placeholder="开始日期"
              @change="startTimeHandle($event)"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" v-if="routeParams === 4">
            <el-date-picker
              v-model="endRecordDate"
              type="date"
              :editable="false"
              placeholder="结束日期"
              @change="endTimeHandle($event)"
              :picker-options="endTimeOptions"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
            clearable
            placeholder="请选择门店">
            <el-option
              v-for="(item,index) in userOrgs"
              :label="item.orgNo + '-' + item.orgName"
              :value="item.orgId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
            <!-- <el-button class="kf-btn" @click="searchDay(1)" v-if="routeParams === 1" :loading="searchLoading">查询</el-button> -->
            <el-button class="kf-btn" @click="searchMonth(1)" v-if="routeParams === 2" :loading="searchLoading">查询</el-button>
            <el-button class="kf-btn" @click="searchAllMonth(1)" v-if="routeParams === 3" :loading="searchLoading">查询</el-button>
            <el-button class="kf-btn" @click="searchSection(1)" v-if="routeParams === 4" :loading="searchLoading">查询</el-button>
            <el-button @click="sumExport()" class="export-btn" v-if="routeParams !== 1">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="header__check">
        <el-radio-group v-model="routeParams" @change="changeRoute">
          <el-radio :label="2">本月</el-radio>
          <el-radio :label="3">月度</el-radio>
          <el-radio :label="4">区间</el-radio>
        </el-radio-group>
      </div>
      <table-list v-if="routeParams === 2"
        :data="tableData"
        :columns="listConfig"
        @currentChange="searchMonth"
        :currentPage="formCurrentPage"
        :totalRecords="formTotalRecords"/>
      <table-list v-if="routeParams === 3"
        :data="monthList"
        :columns="listConfig"
        @currentChange="searchAllMonth"
        :currentPage="formCurrentPage3"
        :totalRecords="formTotalRecords3"/>
      <table-list v-if="routeParams === 4"
        :data="sectionList"
        :columns="listConfig"
        @currentChange="searchSection"
        :currentPage="formCurrentPage4"
        :totalRecords="formTotalRecords4"/>
    <sum-export ref="sumExport"/>
  </div>
</template>

<script>
import SumExport from '../../components/export/SumExport.vue'
export default {
  name: 'count-org-cost',
  data () {
    let {curMonth, lastMonth} = this.$monthDate()
    let {firstDay, yesterday} = this.$searchDate()
    let startMonth = lastMonth
    let endMonth = curMonth
    let dateNow = firstDay
    let dateNow2 = yesterday
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    return {
      routeParams: '',
      exportPath: this.$baseURL + 'account/data/export/checkChannel',
      signId: '',
      titileBar: '每月统计',
      activeClass: 'active',
      errorClass: 'span',
      searchForm: {
        startRecordDate: dateNow,
        endRecordDate: dateNow2,
        orgId: ''
      },
      userOrgs,
      exportSearchParams: {},
      exportForm: {
        dateType: 'day',
        exportType: 'orgCost',
        sumType: 'orgCostSum',
        exportParams: '',
        url: this.$baseURL + 'account/data/export/checkChannel'
      },
      dateType: '',
      url: '',
      sumType: '',
      exportParams: '',
      exportTitles: '',
      startRecordMonth: startMonth,
      startRecordMonth1: startMonth,
      endRecordMonth: endMonth,
      endRecordMonth1: endMonth,
      sectionList: [],
      monthList: [],
      todayList: [],
      tableData: [],
      teams: [],
      citys: [],
      endTimeOptions: {
        disabledDate (time) {
          return time.getTime() < new Date(dateNow).getTime() - 8.64e7 || time.getTime() > new Date(dateNow).getTime() + 3600 * 1000 * 24 * 31 * 6
        }
      },
      startRecordDate: new Date(dateNow),
      endRecordDate: new Date(dateNow2),
      formTotalRecords: 0,
      formCurrentPage: 1,
      formTotalRecords3: 0,
      formCurrentPage3: 1,
      formTotalRecords4: 0,
      formCurrentPage4: 1,
      searchLoading: false,
      listConfig: {}
    }
  },
  components: {
    SumExport
  },
  created () {
    let routeParams = '2'
    if (routeParams === '1') {
      // 数据库中改有点麻烦，直接如果是1就进入2的
      this.routeParams = 2
      this.titileBar = '每月统计'
    } else if (routeParams === '2') {
      this.routeParams = 2
      this.titileBar = '每月统计'
    } else if (routeParams === '3') {
      this.routeParams = 3
      this.titileBar = '月度统计'
    }
  },
  mounted () {
    this.listConfig = {
      multistage: true,
      rows: [
        {
          label: '基本信息',
          rows: [
            {label: '记录日期', prop: 'recordDate', minWidth: 200},
            {label: '门店名称', prop: 'orgName', minWidth: 120},
            {label: '门店编号', prop: 'orgNo', minWidth: 120},
            {label: '城市', prop: 'cityName', minWidth: 120}
          ]
        },
        {
          label: 'API数据',
          rows: [
            {label: '有效量', prop: 'apiNeedCount', minWidth: 200},
            {label: '有效成本', prop: 'apiNeedCost', minWidth: 120},
            {label: '无效量', prop: 'apiNotCount', minWidth: 120},
            {label: '无效成本', prop: 'apiNotCost', minWidth: 120}
          ]
        },
        {
          label: '流量数据',
          rows: [
            {label: '有效量', prop: 'flowNeedCount', minWidth: 200},
            {label: '有效成本', prop: 'flowNeedCost', minWidth: 120},
            {label: '无效量', prop: 'flowNotCount', minWidth: 120},
            {label: '无效成本', prop: 'flowNotCost', minWidth: 120}
          ]
        },
        {
          label: '历史数据',
          rows: [
            {label: '有效量', prop: 'historyNeedCount', minWidth: 200},
            {label: '有效成本', prop: 'historyNeedCost', minWidth: 120},
            {label: '无效量', prop: 'historyNotCount', minWidth: 120},
            {label: '无效成本', prop: 'historyNotCost', minWidth: 120}
          ]
        },
        {
          label: '其他数据',
          rows: [
            {label: '有效量', prop: 'otherNeedCount', minWidth: 200},
            {label: '有效成本', prop: 'otherNeedCost', minWidth: 120},
            {label: '无效量', prop: 'otherNotCount', minWidth: 120},
            {label: '无效成本', prop: 'otherNotCost', minWidth: 120}
          ]
        }
      ]
    }
  },
  methods: {
    sumExport () {
      if (this.routeParams === 2) {
        this.exportSearchParams = Object.assign({}, this.searchForm)
        if (!this.searchForm.endRecordDate || !this.searchForm.startRecordDate) {
          this.$msg('请选择日期')
          return
        }
      } else if (this.routeParams === 3) {
        let obj = Object.assign({}, this.searchForm)
        obj.dateType = 'month'
        obj.startRecordDate = this.startRecordMonth
        obj.endRecordDate = this.endRecordMonth
        this.exportSearchParams = obj
        if (!this.startRecordMonth || !this.endRecordMonth) {
          this.$msg('请选择日期')
          return
        }
      } else if (this.routeParams === 4) {
        this.exportSearchParams = Object.assign({}, this.searchForm)
        if (!this.searchForm.endRecordDate || !this.searchForm.startRecordDate) {
          this.$msg('请选择日期')
          return
        }
      }
      this.$refs.sumExport.show = true
    },
    searchMonth (page) {
      if (!this.searchForm.endRecordDate || !this.searchForm.startRecordDate) {
        this.$msg('请选择日期')
        return
      }
      let obj = this.searchForm
      obj.currentPage = page
      obj.dateType = 'day'
      this.formCurrentPage = page
      this.tableData = []
      this.searchLoading = true
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/dataset/orgCost/query',
          data: obj,
          success: data => {
            this.searchLoading = false
            this.tableData = data.rows
            this.formTotalRecords = data.page.totalRecords
          }
        })
      }
    },
    searchAllMonth (page) {
      if (!this.startRecordMonth) {
        this.$msg('请选择开始月份')
        return
      }
      this.monthList = []
      this.formCurrentPage3 = page
      this.searchLoading = true
      let obj = Object.assign({}, this.searchForm)
      obj.dateType = 'month'
      obj.startRecordDate = this.startRecordMonth
      obj.endRecordDate = this.endRecordMonth
      obj.currentPage = page
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/dataset/orgCost/query',
          data: obj,
          success: data => {
            this.searchLoading = false
            this.monthList = data.rows
            this.formTotalRecords3 = data.page.totalRecords
          }
        })
      }
    },
    searchSection (page) {
      if (!this.searchForm.endRecordDate || !this.searchForm.startRecordDate) {
        this.$msg('请选择日期')
        return
      }
      let obj = this.searchForm
      obj.currentPage = page
      obj.dateType = 'range'
      this.formCurrentPage = page
      this.sectionList = []
      this.searchLoading = true
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/dataset/orgCost/query',
          data: obj,
          success: data => {
            this.searchLoading = false
            this.sectionList = data.rows
            this.formTotalRecords4 = data.page.totalRecords
          }
        })
      }
    },
    changeRoute () {
      console.log(1111)
      if (this.routeParams === 2) {
        this.changeRoute2()
      } else if (this.routeParams === 3) {
        this.changeRoute3()
      } else if (this.routeParams === 4) {
        this.changeRoute4()
      }
    },
    changeRoute2 () {
      this.dateType = 'day'
      this.exportForm['dateType'] = 'day'
      this.titileBar = '每月统计'
      // this.searchMonth(1)
    },
    changeRoute3 () {
      this.dateType = 'month'
      this.exportForm['dateType'] = 'month'
      this.titileBar = '月度统计'
      // this.searchAllMonth(1)
    },
    changeRoute4 () {
      this.dateType = 'range'
      this.exportForm['dateType'] = 'range'
      this.titileBar = '区间统计'
    },
    startTimeHandle (start) {
      this.searchForm.startRecordDate = start || ''
      if (this.startRecordDate && this.endRecordDate) {
        let cha = this.endRecordDate.getTime() - this.startRecordDate.getTime()
        if (cha > 3600 * 1000 * 24 * 31 || cha < 0) {
          this.searchForm.endRecordDate = ''
          this.endRecordDate = ''
        }
      }
      this.endTimeOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(start).getTime() - 8.64e7 || time.getTime() > new Date(start).getTime() + 3600 * 1000 * 24 * 31 * 6
        }
      }
    },
    startMonthHandle (val) {
      this.startRecordMonth = val || ''
    },
    endMonthHandle (val) {
      this.endRecordMonth = val || ''
    },
    endTimeHandle (end) {
      this.searchForm.endRecordDate = end || ''
    }
  }
}
</script>

<style>
  .kf-box .el-table--border th {
    border: 1px solid #000 !important;;
  }
</style>
