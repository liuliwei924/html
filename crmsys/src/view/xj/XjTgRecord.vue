<template>
  <div class="content-box">
    <div class="header__title">推广申请记录</div>
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
        <el-form-item label="手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.telephone"
            placeholder="手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="详细渠道:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.channelDetail"
            placeholder="详细渠道">
          </el-input>
        </el-form-item>
        <el-form-item label="是否注册过APP:">
          <el-select
            v-model="searchForm.register"
            clearable
            placeholder="请选择注册状态">
            <el-option
              v-for="val,key,index in register"
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
        prop="recordDate"
        label="记录日期"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="是否注册App"
        min-width="100">
        <template slot-scope="scope">{{register[scope.row.register]}}</template>
      </el-table-column>
      <el-table-column
        prop="channelDetail"
        label="详细渠道"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
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
  name: 'xj-tgRecord',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjTgRecord')
    return {
      tableData: [],
      totalRecord: 1,
      searchForm: {
        startDate: '' || today,
        endDate: '',
        telephone: store['telephone'] || '',
        channelDetail: store['channelDetail'] || '',
        register: store['register'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 状态
      register: {
        0: '否',
        1: '是'
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
      this.$setStore('xjTgRecord', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjTgRecord/queryTgUserRecord',
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