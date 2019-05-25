<template>
  <div class="content-box">
    <div class="header__title">中奖列表</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="中奖日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="中奖日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.searchKey"
            placeholder="姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="处理人姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.handelSearchKey"
            placeholder="姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="活动类型:">
          <el-select
            v-model="searchForm.activeType"
            clearable
            placeholder="请选择活动类型">
            <el-option
              v-for="val,key,index in activeTypes"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取状态:">
          <el-select
            v-model="searchForm.receiveStatus"
            clearable
            placeholder="请选择领取状态">
            <el-option
              v-for="val,key,index in receiveStatus"
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
        prop="id"
        label="领取编号"
        min-width="80">
      </el-table-column>
       <el-table-column
        prop="applyName"
        label="姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="红包金额"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="活动类型"
        min-width="100">
        <template slot-scope="scope">{{activeTypes[scope.row.activeType]}}</template>
      </el-table-column>
      <el-table-column
        label="领取状态"
        min-width="100">
        <template slot-scope="scope">{{receiveStatus[scope.row.receiveStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="处理人"
        min-width="100">
      </el-table-column>
      <!-- <el-table-column
        prop="updateTel"
        label="处理人手机号"
        min-width="150">
      </el-table-column> -->
      <el-table-column
        prop="updateTime"
        label="更新时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="60">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">审核</el-button>
          <!-- <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <winPrize-edit v-model="editShow" :custData="custData" @change="editChange" :receiveStatus="receiveStatus"/>
  </div>
</template>

<script>
import WinPrizeEdit from '@/components/work/WinPrizeEdit'
export default {
  name: 'xin-prize',
  data () {
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      searchForm: {
        activeType: '',
        startDate: '',
        endDate: '',
        searchKey: '',
        handelSearchKey: '',
        receiveStatus: '',
        currentPage: 1
      },
      // 用户状态
      receiveStatus: {
        0: '未领取',
        1: '已领取',
        2: '领取失败'
      },
      activeTypes: {
        1: '大转盘',
        2: '抢红包'
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
    // 编辑
    editHandle (row) {
      this.custData = row
      this.editShow = true
    },
    // 编辑弹窗监听
    editChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.editShow = false
      } else {
        this.editShow = val
      }
    },
    // 查询
    searchHandle () {
      this.tableData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/work/winPrize/queryWinPrize',
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
  },
  components: {
    WinPrizeEdit
  }
}
</script>