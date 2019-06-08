<template>
  <div class="content-box">
    <div class="header__title">金额资质详细</div>
      <div class="header__search clearfix">
      <!-- <div v-bind:class="[routeParams === 1 ? activeClass : '', errorClass]" @click="changeRoute1()">今天</div> -->
        <el-form :model="searchForm" >
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
                v-for="item in teams"
                :label="item.teamName"
                :value="item.teamNo" :key="item.teamNo">
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
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
      <input type="text" name="exportParams" v-model="exportParams">
      <!-- <input type="text" name="exportTitles" v-model="exportTitles"> -->
      <input type="text" name="signId" v-model="signId">
      <input type="text" name="exportType" value="channelDtl">
      <input type="text" name="dateType" value="day" v-if="routeParams === 2">
      <input type="text" name="dateType" value="month" v-if="routeParams === 3">
    </form>
    <sum-export ref="sumExport"/>
  </div>
</template>

<script>
import SumExport from '../../components/export/SumExport.vue'
export default {
  name: 'count-base',
  data () {
    let {curMonth, lastMonth} = this.$monthDate()
    let {firstDay, yesterday} = this.$searchDate()
    let startMonth = lastMonth
    let endMonth = curMonth
    let dateNow = firstDay
    let dateNow2 = yesterday
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
              {label: '优质单数', prop: 'seniorCount', minWidth: 120},
              {label: 'UV', prop: 'recordCount', minWidth: 120},
              {label: '转化率', prop: 'recordCount1', minWidth: 120}
            ]
          },
          {
            label: '（0,1]',
            rows: [
              {label: '无资质', prop: 'assetCount1num0', minWidth: 200},
              {label: '满足1个', prop: 'assetCount1num1', minWidth: 120},
              {label: '满足2个', prop: 'assetCount1num2', minWidth: 120},
              {label: '满足3个', prop: 'assetCount1num3', minWidth: 120},
              {label: '全部满足', prop: 'assetCount1num4', minWidth: 120}
            ]
          },
          {
            label: '（1,3）',
            rows: [
              {label: '无资质', prop: 'assetCount2num0', minWidth: 200},
              {label: '满足1个', prop: 'assetCount2num1', minWidth: 120},
              {label: '满足2个', prop: 'assetCount2num2', minWidth: 120},
              {label: '满足3个', prop: 'assetCount2num3', minWidth: 120},
              {label: '全部满足', prop: 'assetCount2num4', minWidth: 120}
            ]
          },
          {
            label: '[3-5)',
            rows: [
              {label: '无资质', prop: 'assetCount3num0', minWidth: 200},
              {label: '满足1个', prop: 'assetCount3num1', minWidth: 120},
              {label: '满足2个', prop: 'assetCount3num2', minWidth: 120},
              {label: '满足3个', prop: 'assetCount3num3', minWidth: 120},
              {label: '全部满足', prop: 'assetCount3num4', minWidth: 120}
            ]
          },
          {
            label: '[5-10)',
            rows: [
              {label: '无资质', prop: 'assetCount4num0', minWidth: 200},
              {label: '满足1个', prop: 'assetCount4num1', minWidth: 120},
              {label: '满足2个', prop: 'assetCount4num2', minWidth: 120},
              {label: '满足3个', prop: 'assetCount4num3', minWidth: 120},
              {label: '全部满足', prop: 'assetCount4num4', minWidth: 120}
            ]
          },
          {
            label: '[10,)',
            rows: [
              {label: '无资质', prop: 'assetCount5num0', minWidth: 200},
              {label: '满足1个', prop: 'assetCount5num1', minWidth: 120},
              {label: '满足2个', prop: 'assetCount5num2', minWidth: 120},
              {label: '满足3个', prop: 'assetCount5num3', minWidth: 120},
              {label: '全部满足', prop: 'assetCount5num4', minWidth: 120}
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
        exportType: 'channelDtl',
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
      endRecordDate: new Date(),
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
          url: '/store/account/dataset/channelDtl/query',
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
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/dataset/channelDtl/query',
          data: {startRecordMonth: this.startRecordMonth, channelName: this.searchForm.channelName, endRecordMonth: this.endRecordMonth, currentPage: page, channelCode: this.searchForm.channelCode, type: this.searchForm.type, dateType: 'month', teamNo: this.searchForm.teamNo},
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
          url: '/store/account/dataset/channelDtl/query',
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
