<template>
  <div class="content-box">
    <div class="header__title">任务状态记录</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="创建日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="显示名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.nickNameAndTel"
            placeholder="显示名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="公众号:">
          <el-select
            v-model="searchForm.fllowWxStatus"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="val,key,index in fllowWxStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信群:">
          <el-select
            v-model="searchForm.wxJoinStatus"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="val,key,index in wxJoinStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="QQ群:">
          <el-select
            v-model="searchForm.qqJoinStatus"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="val,key,index in qqJoinStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Biyong群:">
          <el-select
            v-model="searchForm.byJoinStatus"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="val,key,index in byJoinStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="customerId"
        label="客户编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="显示名称"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="微信公众号"
        min-width="100">
        <template slot-scope="scope">{{fllowWxStatus[scope.row.fllowWxStatus]}}</template>
      </el-table-column>
      <el-table-column
        label="微信群"
        min-width="80">
        <template slot-scope="scope">{{wxJoinStatus[scope.row.wxJoinStatus]}}</template>
      </el-table-column>
      <el-table-column
        label="QQ群"
        min-width="80">
        <template slot-scope="scope">{{qqJoinStatus[scope.row.qqJoinStatus]}}</template>
      </el-table-column>
      <el-table-column
        label="币用群"
        min-width="80">
        <template slot-scope="scope">{{byJoinStatus[scope.row.byJoinStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
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
</template>

<script>
export default {
  name: 'xj-taskStatus',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjTaskStatus')
    return {
      tableData: [],
      totalRecord: 1,
      searchForm: {
        startDate: '' || today,
        endDate: '',
        nickNameAndTel: store['nickNameAndTel'] || '',
        fllowWxStatus: store['fllowWxStatus'] || '',
        wxJoinStatus: store['wxJoinStatus'] || '',
        qqJoinStatus: store['qqJoinStatus'] || '',
        byJoinStatus: store['byJoinStatus'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 状态
      fllowWxStatus: {
        0: '未关注',
        1: '已关注'
      },
      // 状态
      wxJoinStatus: {
        0: '未加入',
        1: '已加入'
      },
      // 状态
      qqJoinStatus: {
        0: '未加入',
        1: '已加入'
      },
      // 状态
      byJoinStatus: {
        0: '未加入',
        1: '已加入'
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
      this.$setStore('xjTaskStatus', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjTaskStatus/queryXjTaskStatus',
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