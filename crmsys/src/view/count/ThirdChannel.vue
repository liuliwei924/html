<template>
  <div class="content-box">
    <div class="header__title">渠道统计(第三方)</div>
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
        <el-form-item label="申请城市">
          <el-select
            v-model="searchForm.cityName"
            filterable
            clearable
            placeholder="请选择申请城市">
            <el-option-group
              v-for="(group,gIndex) in citys"
              :label="group.provinceName"
              :key="gIndex">
              <el-option
                v-for="(item,index) in group.citys"
                :label="item.cityName"
                :value="item.cityName"
                :key="index">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchMonth(1)" v-if="routeParams === 2" :loading="searchLoading">查询</el-button>
          <el-button @click="searchAllMonth(1)" v-if="routeParams === 3" :loading="searchLoading">查询</el-button>
          <el-button @click="searchRange(1)" v-if="routeParams === 4" :loading="searchLoading">查询</el-button>
          <el-button @click="sumExport()" class="export-btn" >导出</el-button>
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
      <table-list :data="rangeData" :columns="listConfig" @currentChange="searchRange" :currentPage="formCurrentPage4" :totalRecords="formTotalRecords4" v-if="routeParams === 4"/>
    <sum-export ref="sumExport"/>
  </div>
</template>

<script>
import SumExport from '../../components//export/SumExport.vue'
export default {
  name: 'count-base',
  data () {
    let {curMonth, lastMonth} = this.$monthDate()
    let {firstDay, today} = this.$searchDate()
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
              {label: '渠道代号', prop: 'channelCode', minWidth: 120},
              {label: '小渠道代号', prop: 'channelDetail', minWidth: 120},
              {label: '总申请数', prop: 'applyCount', minWidth: 120}
            ]
          },
          {
            label: '交网销门店',
            rows: [
              {label: '交网销门店数量', prop: 'netStoreCount', minWidth: 200},
              {label: '已跟进数量', prop: 'dealStoreCount', minWidth: 120},
              {label: '空号/错号数量', prop: 'invalidCount', minWidth: 120},
              {label: '3天内接通数量', prop: '3dayCallCount', minWidth: 120}
            ]
          },
          {
            label: '客户级别',
            rows: [
              {label: '可做单', prop: 'useCount', minWidth: 200},
              {label: '可做率', prop: 'useUv', minWidth: 120},
              {label: '0星', prop: 'labelCount0', minWidth: 120},
              {label: '1星', prop: 'labelCount1', minWidth: 120},
              {label: '2星', prop: 'labelCount2', minWidth: 120},
              {label: '2星+', prop: 'labelCount3', minWidth: 120},
              {label: '2星+占比', prop: 'labelRate3', minWidth: 120},
              {label: '3星', prop: 'labelCount4', minWidth: 120},
              {label: '3星占比', prop: 'labelRate4', minWidth: 120},
              {label: '4星', prop: 'labelCount5', minWidth: 120},
              {label: '4星占比', prop: 'labelRate5', minWidth: 120}
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
      citys: JSON.parse(this.$localStorage('cityList')) || [],
      searchForm: {
        cityName: '',
        channelCode: '',
        startRecordDate: dateNow,
        endRecordDate: dateNow2
      },
      exportForm: {
        dateType: 'day',
        exportType: 'thirdChannel',
        sumType: 'thirdChannel',
        exportParams: '',
        url: this.$baseURL + 'account/data/export/checkChannel'
      },
      exportSearchParams: {},
      dateType: '',
      url: '',
      isEdit: false,
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
      rangeData: [],
      endTimeOptions: {
        disabledDate (time) {
          return time.getTime() < new Date(dateNow).getTime() - 8.64e7 || time.getTime() > new Date(dateNow).getTime() + 3600 * 1000 * 24 * 31
        }
      },
      startRecordDate: new Date(dateNow),
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
    } else if (routeParams === '4') {
      this.routeParams = 4
      this.titileBar = '区间统计'
      // this.searchAllMonth(1)
    } else {
      this.routeParams = 2
      this.titileBar = '每月统计'
    }
    // let menuCode = this.$route.path.split('/')[2]
    // let checkUrl = this.$localStorage('kfCheckMenus')
    // if (checkUrl.indexOf(menuCode) >= 0) {
    //   this.isEdit = true
    // }
  },
  methods: {
    searchMonth (page) {
      if (!this.searchForm.endRecordDate || !this.searchForm.startRecordDate) {
        this.$msg('请选择日期')
        return
      }
      let obj = Object.assign({}, this.searchForm)
      obj.currentPage = page
      obj.dateType = 'day'
      this.formCurrentPage = page
      this.tableData = []
      this.searchLoading = true
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/dataset/thirdChannel/query',
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
          url: '/store/account/dataset/thirdChannel/query',
          data: obj,
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
      this.rangeData = []
      this.searchLoading = true
      let obj = Object.assign({}, this.searchForm)
      obj.currentPage = page
      obj.dateType = 'range'
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/dataset/thirdChannel/query',
          data: obj,
          success: data => {
            this.searchLoading = false
            this.rangeData = data.rows
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
          return time.getTime() < new Date(start).getTime() - 8.64e7 || time.getTime() > new Date(start).getTime() + 3600 * 1000 * 24 * 31
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
    },
    changeRoute3 () {
      this.dateType = 'month'
      this.exportForm['dateType'] = 'month'
      this.titileBar = '月度统计'
    },
    changeRoute4 () {
      this.dateType = 'range'
      this.exportForm['dateType'] = 'range'
      this.titileBar = '区间统计'
    },
    sumExport () {
      if (this.routeParams === 2) {
        let obj = Object.assign({}, this.searchForm)
        obj.dateType = 'day'
        this.exportSearchParams = obj
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
        if (!this.searchForm.endRecordDate || !this.searchForm.startRecordDate) {
          this.$msg('请选择日期')
          return
        }
        let obj = Object.assign({}, this.searchForm)
        obj.dateType = 'range'
        this.exportSearchParams = obj
      }
      this.$refs.sumExport.show = true
    }
  }
}
</script>

<style>
  .kf-box .el-table--border th {
    border: 1px solid #000 !important;;
  }
</style>
