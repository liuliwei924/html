<template>
  <div class="content-box">
    <div class="header__title">渠道城市情况统计</div>
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
          <el-form-item label="按实际时间查询">
            <el-select v-model="searchForm.isReal" placeholder="请选择是否按实际时间">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道代号">
            <el-input v-model="searchForm.channelCode" placeholder="请输入渠道代号" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item label="团队">
            <el-select v-model="searchForm.teamNo" clearable filterable placeholder="请选择团队">
              <el-option
                v-for="item in teams"
                :label="item.teamName"
                :value="item.teamNo"
                :key="item.teamNo">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市">
            <el-select v-model="searchForm.cityName" filterable clearable placeholder="请选择申请城市">
              <el-option v-for="(city,index) in citys" :label="city" :value="city" :key="index"></el-option>
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
  name: 'count-channel-city',
  data () {
    let {curMonth, lastMonth} = this.$monthDate()
    let {firstDay, yesterday} = this.$searchDate()
    let startMonth = lastMonth
    let endMonth = curMonth
    let dateNow = firstDay
    let dateNow2 = yesterday
    return {
      routeParams: '',
      exportPath: this.$baseURL + 'account/data/export/checkChannel',
      signId: '',
      titileBar: '每月统计',
      activeClass: 'active',
      errorClass: 'span',
      searchForm: {
        cityName: '',
        teamNo: '',
        channelCode: '',
        startRecordDate: dateNow,
        endRecordDate: dateNow2,
        configCitys: '',
        isReal: '0'
      },
      exportSearchParams: {},
      exportForm: {
        dateType: 'day',
        exportType: 'channelCity',
        sumType: 'channelCitySum',
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
    this.$ajax({
      url: '/store/user/team/queryTeamAll',
      data: {},
      success: data => {
        this.teams = data.rows
      }
    })
    this.$ajax({
      url: '/store/account/user/info/getUserInfo',
      data: {},
      success: data => {
        if (data.attr['configCitys']) {
          this.searchForm.configCitys = data.attr['configCitys']
          this.citys = data.attr['configCitys'].split(',')
          this.citys.push('其他城市')
        }
      }
    })
  },
  mounted () {
    this.listConfig = {
      multistage: false,
      rows: [
        {label: '时间区间', prop: 'recordDate', minWidth: 120},
        {label: '渠道代号', prop: 'channelCode'},
        {label: '渠道名称', prop: 'channelName', minWidth: 100},
        {label: '城市', prop: 'cityName'},
        {label: '总申请量', prop: 'applyCount'},
        {label: '交门店量', prop: 'storeCount'},
        {label: '已跟进量', prop: 'dealStoreCount'},
        {label: '可做率', prop: 'useUv'},
        {label: '可做单', prop: 'useCount'},
        {label: '上门量', prop: 'sucBookCount'},
        {label: '上门率', prop: 'bookRate'},
        {label: '签单量', prop: 'totalSignCount'},
        {label: '签单率', prop: 'signRate'},
        {label: '签单金额(万)', prop: 'totalSignAmount'},
        {label: '回款数量', prop: 'retCount', minWidth: 100},
        {label: '回款金额', prop: 'retAmount', minWidth: 100},
        {label: '回款率', prop: 'retRate'},
        // {label: '成功挂卖数', prop: 'sucSaleCount', minWidth: 100},
        // {label: '成功挂卖金额', prop: 'sucSaleAmt'},
        {label: '放款金额', prop: 'lendAmount'}
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
          url: '/store/account/dataset/channelCity/query',
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
          url: '/store/account/dataset/channelCity/query',
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
          url: '/store/account/dataset/channelCity/query',
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
      console.log(end)
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
