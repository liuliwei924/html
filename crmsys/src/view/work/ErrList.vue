<template>
  <div class="content-box">
    <div class="header__title">转移失败列表</div>
    <div class="kf-box">
      <el-form :inline="true" :model="searchForm" class="header__search clearfix">
        <div @keyup.enter="searchHandle()">
          <el-form-item>
            <el-date-picker
              v-model="startApplyTime"
              type="datetime"
              :editable="true"
              placeholder="开始日期"
              @change="startTimeHandle($event)"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="endApplyTime"
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
            <el-input v-model="searchForm.channelDetail" placeholder="输入详细渠道" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchHandle(1)" :loading="searchLoading">查询</el-button>
            <el-button size="small" type="primary" class="export-btn" :loading="loading" @click="batchTransfer" v-if="isEdit" :disabled="loading" style="height:36px;font-size:14px;">批量转移</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table class="content__table"
        :data="tableData"
        @selection-change="handleSelectionChange">
        <template>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
        </template>
        <el-table-column
          min-width="120"
          prop="applyId"
          label="序号">
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
          prop="pageReferer"
          label="来源页面">
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
          prop="errMsg"
          label="失败原因">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="transfer(scope.row.applyId)" type="text" size="small" v-if="isEdit">重新转移</el-button>
          </template>
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
  </div>
</template>

<script>
let d = new Date()
let msec = ((d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds()) * 1000
let date = new Date(Date.now() - 7 * 8.64e7 - msec)
export default {
  name: 'all',
  data () {
    let startApplyTime = this.$time(date)
    let endApplyTime = this.$time(d)
    return {
      isEdit: false,
      signId: '',
      applyIds: '',
      exportParams: '',
      exportTitles: '',
      multipleSelection: [],
      loading: false,
      searchForm: {
        startApplyTime,
        endApplyTime,
        applyName: '',
        cityName: '',
        channelDetail: '',
        channelCode: ''
      },
      startApplyTime: date,
      endApplyTime: d,
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
        '4': '商住两用房'
      },
      cars: {
        2: '无车',
        3: '贷款车',
        4: '全款车'
      },
      workTypes: {
        1: '自由职业',
        2: '企业主',
        3: '个体户',
        4: '上班族'
      }
    }
  },
  created () {
    this.citys = this.$localStorage('city').split(',')
    this.searchChannels()
    // 获取权限
    let menuCode = this.$route.path.split('/')[2]
    let checkUrl = this.$localStorage('kfCheckMenus')
    if (checkUrl.indexOf(menuCode) >= 0) {
      this.isEdit = true
    }
  },
  methods: {
    handleSelectionChange (rows) {
      let ids = ''
      for (let i = 0; i < rows.length; i++) {
        ids += ',' + rows[i]['applyId']
      }
      this.applyIds = ids.substr(1)
    },
    batchTransfer () {
      if (!this.applyIds) {
        this.$msg('请至少选择一个!')
        return false
      }
      this.$ajax({
        url: '/store/account/work/errAll/transferApplyData',
        data: {'applyIds': this.applyIds},
        success: data => {
          this.$msg(data.message)
          this.searchHandle(1)
        }
      })
    },
    transfer (applyId) {
      this.$ajax({
        url: '/store/account/work/errAll/transferApplyData',
        data: {'applyIds': applyId},
        success: data => {
          this.$msg(data.message)
          this.searchHandle(1)
        }
      })
    },
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
      this.searchForm.startApplyTime = start || ''
      this.endTimeOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(start).getTime() - 8.64e7
        }
      }
    },
    endTimeHandle (end) {
      // 结束时间处理
      this.searchForm.endApplyTime = end || ''
    },
    searchHandle (page) {
      this.searchLoading = true
      if (this.searchLoading) {
        this.currentPage = page
        this.searchForm.currentPage = this.currentPage
        this.$ajax({
          url: '/store/account/work/errAll/queryErrList',
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
