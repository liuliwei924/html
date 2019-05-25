<template>
  <div class="content-box">
    <div class="header__title">用户兑换记录</div>
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
        <el-form-item label="状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.checkBy"
            placeholder="审核人">
          </el-input>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <!-- <el-table-column
        prop="recordId"
        label="记录编号"
        min-width="80">
      </el-table-column> -->
      <el-table-column
        prop="nickName"
        label="显示名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="totalCost"
        label="总花费"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="兑换单位"
        min-width="100">
        <template slot-scope="scope">{{changeUnit[scope.row.changeUnit]}}</template>
      </el-table-column>
      <el-table-column
        prop="changeNum"
        label="兑换数量"
        min-width="80">
      </el-table-column>
       <el-table-column
        prop="name"
        label="兑换项目"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="100">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
       <el-table-column
        prop="checkBy"
        label="审核人"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="checkDesc"
        label="审核描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        label="审核时间"
        min-width="160">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="160">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="text" size="small" @click="editHandle(scope.row)">审核</el-button>
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
    <xjCustChange-audit v-model="editShow" :custData="custData" @change="editChange" :status="status"/>
  </div>
</template>

<script>
import XjCustChangeAudit from '@/components/xj/XjCustChangeAudit'
export default {
  name: 'xjCust-change',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjCustChange')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      searchForm: {
        startDate: '' || today,
        endDate: '',
        nickNameAndTel: store['nickNameAndTel'] || '',
        status: store['status'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 反馈状态
      status: {
        1: '待处理',
        2: '兑换成功',
        3: '兑换失败'
      },
      // 单位
      changeUnit: {
        1: 'TGB',
        2: '幸运币'
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
      this.$setStore('xjCustChange', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjCustChange/queryCustChangeList',
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
    XjCustChangeAudit
  }
}
</script>