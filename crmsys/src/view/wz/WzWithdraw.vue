<template>
  <div class="content-box">
    <div class="header__title">提现记录</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="发放时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发放时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户姓名或手机号:">
          <el-input
            v-model="searchForm.searchKey"
            placeholder="请输入用户姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="审核人姓名:">
          <el-input
            v-model="searchForm.auditBy"
            placeholder="请输入审核人姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="提现状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button icon="plus" @click="auditHandle()">提现审核</el-button>
        <el-button icon="plus" @click="sendHandle()">发放审核</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border @selection-change="selectChange">
      <el-table-column
        type="selection"
        fixed="left"
        width="55">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="用户姓名"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="用户手机号码"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="提现金额"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="status"
        label="提现状态"
        align="center"
        min-width="120">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="auditBy"
        label="审核人"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="auditTime"
        label="审核时间"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="auditDesc"
        label="审核描述"
        align="center"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="sendTime"
        label="发放时间"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        min-width="120">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <wzWithdraw-audit v-model="auditShow" :commIds="commIds" @change="auditChange" />
    <wzSend-audit v-model="sendShow" :commIds="commIds" @change="sendChange" />
  </div>
  </div>
</template>

<script>
import WzWithdrawAudit from '@/components/wz/WzWithdrawAudit'
import WzSendAudit from '@/components/wz/WzSendAudit'
export default {
  name: 'wzWithdraw',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let showStartDate = lastWeekDay || ''
    // 缓存查询条件
    let withdraw = this.$getStore('withdraw')
    return {
      tableData: [],
      totalRecord: 0,
      commIds: [],
      addShow: false,
      editShow: false,
      loading: false,
      searchForm: {
        searchKey: withdraw['searchKey'] || '',
        status: withdraw['status'] || '',
        recCustName: withdraw['recCustName'] || '',
        startDate: withdraw['startDate'] || showStartDate,
        endDate: withdraw['endDate'] || '',
        currentPage: 1
      },
      auditShow: false,
      sendShow: false,
      // 提现状态
      status: {
        0: '待审核',
        4: '提现成功',
        5: '发放失败'
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
    // table表格选择
    selectChange (arr) {
      this.commIds = []
      arr.forEach(item => {
        this.commIds.push({
          withdrawId: item['withdrawId'],
          customerId: item['customerId']
        })
      })
    },
    // 提现审核
    auditHandle (row) {
      if (this.commIds.length === 0) {
        this.$msg('请先选择要操作的记录！')
        return
      }
      this.auditShow = true
    },
    // 提现审核弹窗监听
    auditChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.auditShow = false
      } else {
        this.auditShow = val
      }
    },
    // 发放审核
    sendHandle (row) {
      if (this.commIds.length === 0) {
        this.$msg('请先选择要操作的记录！')
        return
      }
      this.sendShow = true
    },
    // 发放审核弹窗监听
    sendChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.sendShow = false
      } else {
        this.sendShow = val
      }
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('withdraw', this.searchForm)
      this.$ajax({
        url: '/store/account/wz/wzWithdraw/queryWithdraw',
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
    WzWithdrawAudit,
    WzSendAudit
  }
}
</script>
