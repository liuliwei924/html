<template>
  <div class="content-box">
    <div class="header__title">所有的(原始的)</div>
    <div class="kf-box">
      <el-form :inline="true" :model="searchForm" class="header__search clearfix">
        <div @keyup.enter="searchHandle()">
          <el-form-item>
            <el-date-picker
              v-model="startTime"
              type="datetime"
              :editable="true"
              placeholder="开始日期"
              @change="startTimeHandle($event)"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="endTime"
              type="datetime"
              :editable="true"
              placeholder="结束日期"
              @change="endTimeHandle($event)"
              :picker-options="endTimeOptions"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.applyName" placeholder="输入贷款人姓名或手机号" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.cityName" filterable clearable placeholder="请选择申请城市">
              <el-option v-for="(city,index) in citys" :label="city" :value="city" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
          <el-select v-model="searchForm.channelCode" filterable clearable placeholder="请选择渠道代号">
            <el-option
              v-for="(item,index) in channels"
              :label="item.channelCode"
              :value="item.channelCode" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.isRepeat" filterable clearable placeholder="请选择是否是重复数据">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.channelDetail" placeholder="输入详细渠道" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchHandle(1)" :loading="searchLoading">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table class="content__table"
        :data="tableData">
        <el-table-column
          min-width="120"
          prop="applyId"
          label="序号">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="第三方数据">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isThird === 1 ? 'primary' : 'gray'">{{scope.row.isThird === 1 ? '是' : '否'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          label="重复数据">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isRepeat === 1 ? 'primary' : 'gray'">{{scope.row.isRepeat === 1 ? '是' : '否'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="applyName"
          label="姓名">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="telephone"
          label="手机号">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="cityName"
          label="城市">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="applyAmount"
          label="申请金额(万元)">
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="applyTime"
          label="申请时间">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="channelCode"
          label="渠道">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="channelDetail"
          label="详细渠道">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="workType"
          label="职业类型">
          <template slot-scope="scope">{{workTypes[scope.row.workType]}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="houseType"
          label="房产类型">
          <template slot-scope="scope">{{houseTypes[scope.row.houseType]}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="carType"
          label="车产类型">
          <template slot-scope="scope">{{cars[scope.row.carType]}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="socialType"
          label="是否有社保">
          <template slot-scope="scope">{{scope.row.socialType === 1 ? '有' : '没有'}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          label="是否有公积金">
          <template slot-scope="scope">{{scope.row.fundType === 1 ? '有' : '没有'}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          label="是否有保单">
          <template slot-scope="scope">{{scope.row.insurType === 0 ? '没有' : '有'}}</template>
        </el-table-column>
        <el-table-column
          min-width="140"
          prop="haveWeiLi"
          label="微粒贷额度(元)">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="zimaScore"
          label="芝麻信用分">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="grade"
          label="等级">
        </el-table-column>
      </el-table>
      <div class="xxjr-fr">
        <el-pagination
          @current-change="searchHandle"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
      <input type="text" name="exportParams" v-model="exportParams">
      <input type="text" name="exportTitles" v-model="exportTitles">
      <input type="text" name="signId" v-model="signId">
      <input type="text" name="exportType" value="allList">
    </form>
  </div>
</template>

<script>
let d = new Date()
let msec = ((d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds()) * 1000
let date = new Date(Date.now() - msec)
export default {
  name: 'all',
  data () {
    let startTime = this.$time(date)
    let endTime = this.$time(d)
    return {
      exportPath: this.$baseURL + '/account/bench/export/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      multipleSelection: [],
      searchForm: {
        startTime,
        endTime,
        applyName: '',
        cityName: '',
        channelDetail: '',
        channelCode: '',
        isRepeat: ''
      },
      startTime: date,
      endTime: d,
      channels: [],
      citys: [],
      endTimeOptions: '',
      tableData: [],
      totalRecord: 0,
      currentPage: 1,
      searchLoading: false,
      houseTypes: {
        '1': '有房,但不确认房产类型',
        '2': '无房产',
        '3': '商品住宅',
        '4': '商住两用房',
        '5': '军产房',
        '6': '办公楼',
        '7': '厂房',
        '8': '商铺',
        '9': '自建房/小产权房',
        '10': '经适/限价房',
        '11': '房改/危改房',
        '12': '福利房'
      },
      cars: {
        0: '无车',
        2: '无车',
        1: '其他车',
        3: '贷款车',
        4: '全款车'
      },
      workTypes: {
        1: '无固定职业',
        2: '企业主',
        3: '个体户',
        4: '上班族',
        5: '学生'
      }
    }
  },
  created () {
    // !Object.keys(this.$route.query).length ? this.searchHandle(1) : this.searchHandle(2)
    this.citys = this.$localStorage('city').split(',')
    this.searchChannels()
  },
  methods: {
    searchChannels () {
      this.$ajax({
        url: '/store/user/code/queryAll',
        data: this.searchForm,
        success: data => {
          this.channels = data.rows
        }
      })
    },
    startTimeHandle (start) {
      // 开始时间选择
      this.searchForm.startTime = start || ''
      this.endTimeOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(start).getTime() - 8.64e7
        }
      }
    },
    endTimeHandle (end) {
      // 结束时间处理
      this.searchForm.endTime = end || ''
    },
    searchHandle (page) {
      this.searchLoading = true
      if (this.searchLoading) {
        this.currentPage = page
        this.searchForm.currentPage = this.currentPage
        this.$ajax({
          url: '/store/account/work/origAll/queryOrigList',
          data: Object.assign({}, this.searchForm),
          success: data => {
            this.searchLoading = false
            this.totalRecord = data.page.totalRecords
            this.tableData = data.rows
          }
        })
      }
    }
  }
}
</script>
<style media="screen">
  .check-float-l{
    width: 200px;
    display: inline-block;
  }
</style>
