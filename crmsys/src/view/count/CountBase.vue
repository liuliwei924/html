<template>
  <div class="content-box">
    <div class="header__title">基础情况</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm">
          <el-form-item label="开始日期" v-if="routeParams === 2 || routeParams === 4">
            <el-date-picker
              v-model="startRecordDate"
              type="date"
              :editable="false"
              placeholder="开始日期"
              @change="startTimeHandle($event)"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" v-if="routeParams === 2 || routeParams === 4">
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
          <el-form-item label="渠道代号">
            <el-input v-model="searchForm.channelCode" placeholder="请输入渠道代号" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item label="渠道名称">
            <el-input v-model="searchForm.channelName" placeholder="请输入渠道名称" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item label="团队">
            <el-select v-model="searchForm.teamNo" clearable filterable placeholder="请选择团队">
              <el-option
                v-for="(item,index) in teams"
                :label="item.teamName"
                :value="item.teamNo" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- <el-button class="kf-btn" @click="searchDay" v-if="routeParams === 1" :loading="searchLoading">查询</el-button> -->
            <el-button class="kf-btn" @click="searchMonth(1)" v-if="routeParams === 2" :loading="searchLoading">查询</el-button>
            <el-button class="kf-btn" @click="searchAllMonth(1)" v-if="routeParams === 3" :loading="searchLoading">查询</el-button>
            <el-button class="kf-btn" @click="searchRange(1)" v-if="routeParams === 4" :loading="searchLoading">查询</el-button>
            <el-button @click="sumExport()" class="export-btn" v-if="routeParams !== 1">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div v-bind:class="[routeParams === 2 ? activeClass : '', errorClass]" @click="changeRoute2()">本月</div>
      <div v-bind:class="[routeParams === 3 ? activeClass : '', errorClass]" @click="changeRoute3()">月度</div>
      <div v-bind:class="[routeParams === 4 ? activeClass : '', errorClass]" @click="changeRoute4()">区间</div> -->
      <!-- 业务操作区域 -->
      <div class="header__check">
        <el-radio-group v-model="routeParams" @change="changeRoute">
          <el-radio :label="2">本月</el-radio>
          <el-radio :label="3">月度</el-radio>
          <el-radio :label="4">区间</el-radio>
        </el-radio-group>
      </div>
      <!--月-->
      <table-list :data="tableData" :columns="listConfig" @currentChange="searchMonth" :currentPage="formCurrentPage" :totalRecords="formTotalRecords" v-if="routeParams === 2"/>
      <!--月度-->
      <table-list :data="monthList" :columns="listConfig" @currentChange="searchAllMonth" :currentPage="formCurrentPage3" :totalRecords="formTotalRecords3" v-if="routeParams === 3"/>
      <!--区间-->
      <table-list :data="tableData" :columns="listConfig" @currentChange="searchRange" :currentPage="formCurrentPage4" :totalRecords="formTotalRecords4" v-if="routeParams === 4"/>
    <sum-export ref="sumExport"/>
  </div>
</template>

<script>
import SumExport from '../../components/export/SumExport.vue'
export default {
  name: 'count-base',
  data () {
    let {curMonth, lastMonth} = this.$monthDate()
    let {firstDay, today} = this.$searchDate()
    console.log(curMonth, lastMonth)
    let startMonth = lastMonth
    let endMonth = curMonth
    let dateNow = firstDay
    let dateNow2 = today
    return {
      listConfig: {
        multistage: true,
        rows: [
          {
            label: '基础数据',
            rows: [
              {label: '记录日期', prop: 'recordDate', minWidth: 200},
              {label: '代号', prop: 'channelCode', minWidth: 120},
              {label: '渠道名称', prop: 'channelName', minWidth: 120},
              {label: '花费金额', prop: 'costAmount', minWidth: 120},
              {label: '花费成本', prop: 'costCB', minWidth: 120},
              {label: '总申请数', prop: 'applyCount', minWidth: 120},
              {label: '优质单数', prop: 'seniorCount', minWidth: 120}
              // {label: 'UV', prop: 'recordCount', minWidth: 120},
              // {label: '转化率', prop: 'recordCount1', minWidth: 120},
              // {label: '更新率', prop: 'updateRate', minWidth: 120}
            ]
          },
          {
            label: '城市占比',
            rows: [
              {label: '网销城市占比', prop: 'netCityProp', minWidth: 200},
              {label: '电销无网销城市占比', prop: 'callCityProp', minWidth: 120},
              {label: '其他城市占比', prop: 'otherCityProp', minWidth: 120}
            ]
          },
          {
            label: '金额维度',
            rows: [
              {label: '（0,1', prop: 'amtCount1', minWidth: 120},
              {label: '（1,3）', prop: 'amtCount2', minWidth: 120},
              {label: '[3-5)', prop: 'amtCount3', minWidth: 120},
              {label: '[5-10)', prop: 'amtCount4', minWidth: 120},
              {label: '[10,)', prop: 'amtCount5', minWidth: 120}
            ]
          },
          {
            label: '资质维度【房、车、保、代发工资（公积金/社保）】',
            rows: [
              {label: '无资质', prop: 'noAssetCount', minWidth: 120},
              {label: '满足1个', prop: 'assetCount1', minWidth: 120},
              {label: '满足2个', prop: 'assetCount2', minWidth: 120},
              {label: '满足3个', prop: 'assetCount3', minWidth: 120},
              {label: '全部满足', prop: 'assetCount4', minWidth: 120}
            ]
          }
        ]
      },
      routeParams: '',
      exportPath: this.$baseURL + 'account/data/export/checkChannel',
      signId: '',
      titileBar: '每月统计',
      activeClass: 'active',
      errorClass: 'span',
      searchForm: {
        channelName: '',
        channelCode: '',
        startRecordDate: dateNow,
        endRecordDate: dateNow2,
        teamNo: ''
      },
      exportSearchParams: {},
      exportForm: {
        dateType: 'day',
        exportType: 'channelBase',
        sumType: 'channelModifySum',
        exportParams: '',
        url: this.$baseURL + 'account/data/export/checkChannel'
      },
      dateType: '',
      url: '',
      sumType: '',
      exportType: '',
      exportParams: '',
      startRecordMonth: startMonth,
      startRecordMonth1: startMonth,
      endRecordMonth: endMonth,
      endRecordMonth1: endMonth,
      monthList: [],
      todayList: [],
      tableData: [],
      teams: [],
      endTimeOptions: {
        disabledDate (time) {
          return time.getTime() < new Date(dateNow).getTime() - 8.64e7 || time.getTime() > new Date(dateNow).getTime() + 3600 * 1000 * 24 * 31 * 6
        }
      },
      startRecordDate: dateNow,
      endRecordDate: new Date(dateNow2),
      formTotalRecords: 0,
      formCurrentPage: 1,
      formTotalRecords3: 0,
      formCurrentPage3: 1,
      formTotalRecords4: 0,
      formCurrentPage4: 1,
      searchLoading: false
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
      // this.searchDay()
    } else if (routeParams === '2') {
      this.routeParams = 2
      this.titileBar = '每月统计'
      // this.searchMonth(1)
    } else if (routeParams === '3') {
      this.routeParams = 3
      this.titileBar = '月度统计'
      // this.searchAllMonth(1)
    }
    this.$ajax({
      url: '/store/user/team/queryTeamAll',
      data: {},
      success: data => {
        this.teams = data.rows
      }
    })
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
        this.exportSearchParams = {startRecordMonth: this.startRecordMonth, channelName: this.searchForm.channelName, endRecordMonth: this.endRecordMonth, channelCode: this.searchForm.channelCode, type: this.searchForm.type, dateType: 'month', teamNo: this.searchForm.teamNo}
        if (!this.startRecordMonth || !this.endRecordMonth) {
          this.$msg('请选择日期')
          return
        }
      } else if (this.routeParams === 4) {
        if (!this.searchForm.endRecordDate || !this.searchForm.startRecordDate) {
          this.$msg('请选择日期')
          return
        }
        let obj = Object.assign({}, this.searchForm)
        obj.dateType = 'range'
        this.exportSearchParams = obj
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
          url: '/store/account/dataset/channelBase/query',
          data: obj,
          success: data => {
            this.searchLoading = false
            this.tableData = data.rows
            this.formTotalRecords = data.page.totalRecords
          }
        })
      }
    },
    searchDay () {
      this.searchLoading = true
      if (this.searchLoading) {
        this.$ajax({
          url: '/account/data/channelToday',
          data: {channelCode: this.searchForm.channelCode, channelName: this.searchForm.channelName},
          success: data => {
            this.searchLoading = false
            this.todayList = data.rows
            this.formTotalRecords = data.page.totalRecords
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
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/dataset/channelBase/query',
          data: {startRecordMonth: this.startRecordMonth, endRecordMonth: this.endRecordMonth, currentPage: page, channelCode: this.searchForm.channelCode, channelName: this.searchForm.channelName, type: this.searchForm.type, dateType: 'month', teamNo: this.searchForm.teamNo},
          success: data => {
            this.searchLoading = false
            this.monthList = data.rows
            this.formTotalRecords = data.page.totalRecords
            this.formTotalRecords3 = data.page.totalRecords
          }
        })
      }
    },
    searchRange (page) {
      this.searchLoading = true
      if (!this.searchForm.endRecordDate || !this.searchForm.startRecordDate) {
        this.$msg('请选择日期')
        return
      }
      this.formCurrentPage4 = page
      this.tableData = []
      this.searchLoading = true
      let obj = Object.assign({}, this.searchForm)
      obj.currentPage = page
      obj.dateType = 'range'
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/dataset/channelBase/query',
          data: obj,
          success: data => {
            this.searchLoading = false
            this.tableData = data.rows
            this.formTotalRecords4 = data.page.totalRecords
          }
        })
      }
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
    },
    changeRoute1 () {
      this.$router.push('countcanal1')
      this.routeParams = 1
      this.titileBar = '每日统计'
      this.searchDay()
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
      // this.searchRange(1)
    }
  }
}
</script>

<style>
  .kf-box .el-table--border th {
    border: 1px solid #000 !important;;
  }
</style>
