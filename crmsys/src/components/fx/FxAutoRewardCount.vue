<template>
 <el-dialog class="edit-dialog double-dialog" title="自动佣金发放统计" v-model="visible">
    <div class="header__search clearfix">
        <el-form :model="searchForm" ref="searchForm">
          <!-- 查询条件 -->
          <el-form-item label="开始日期:" prop="startDate">
           <el-date-picker
             v-model="searchForm.startDate"
             type="date"
             editable
             :picker-options="startDateOptions"
             @change="startDateChange"
             placeholder="开始日期">
           </el-date-picker>
         </el-form-item>
         <el-form-item label="结束日期:" prop="endDate">
           <el-date-picker
             v-model="searchForm.endDate"
             type="date"
             editable
             :picker-options="endDateOptions"
             @change="endDateChange"
             placeholder="结束日期">
           </el-date-picker>
         </el-form-item>
          <el-button :loading="loading" @click="searchHandle">查询</el-button>
          <el-button @click="resetForm('searchForm')">重置</el-button>
        </el-form>
      </div>
      <div >
        <b class="strong">截止{{summary.endDate || '当天'}}总计:</b>
        交通累计发放：<span class="sumRed">{{summary.jtAmt}}</span>；
        浦发累计发放：<span class="sumRed">{{summary.pfAmt}}</span>；
        兴业累计发放：<span class="sumRed">{{summary.xyAmt}}</span>；
        中信累计发放：<span class="sumRed">{{summary.zxAmt}}</span>；
        民生累计发放：<span class="sumRed">{{summary.msAmt}}</span>；
        光大累计发放：<span class="sumRed">{{summary.gdAmt}}</span>；
        招商累计发放：<span class="sumRed">{{summary.zsAmt}}</span>
      </div>
      <el-table class="content__table" :data="tableData" border>
      <el-table-column prop="sendDate" label="发放日期" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="jt" label="交通银行" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="pf" label="浦发银行" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="xy" label="兴业银行" align="center" min-width="40">
      </el-table-column>
       <el-table-column prop="zx" label="中信银行" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="ms" label="民生银行" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="gd" label="光大银行" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="zs" label="招商银行" align="center" min-width="40">
      </el-table-column>
    </el-table>
    <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
    </el-pagination>
    </div>
</el-dialog>
</template>

<script>
export default {
  name: 'fx-auto-reward-count',
  props: {
    value: Boolean
  },
  data () {
    let {halfMonthDay} = this.$searchDate()
    let store = this.$getStore('rechargeData')
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      visible: this.value,
      summary: {},
      form: {
        prodId: '',
        grade: '',
        enable: 1
      },
      searchForm: {
        startDate: store['startDate'] || halfMonthDay,
        endDate: '',
        currentPage: 1
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
      },
      loading: false
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 时间条件处理
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.endDate = date || ''
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/applyData/queryAutoRewardCount',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
          this.totalRecord = data.page.totalRecords
        }
      })
      this.$ajax({
        url: '/store/account/fx/applyData/queryAutoRewardSummary',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.summary = data.attr.summary || {}
          this.summary.regEndDate = this.searchForm.regEndDate
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>

<style>
  .sumRed {
    color: red;
  }
</style>