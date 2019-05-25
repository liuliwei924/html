<template>
  <div class="content-box">
    <div class="header__title">申请数据</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="申请姓名/手机号" prop="applyName">
          <el-input v-model="searchForm.applyName" placeholder="请输入姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="申请身份证号" prop="cardNo">
          <el-input v-model="searchForm.cardNo" placeholder="请输入申请身份证号"></el-input>
        </el-form-item>
        <el-form-item label="申请产品" prop="prodName">
          <el-input v-model="searchForm.prodName" placeholder="请输入申请产品"></el-input>
        </el-form-item>
        <el-form-item label="申请开始日期:" prop="applyStartTime">
          <el-date-picker
            v-model="searchForm.applyStartTime"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="申请开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请结束日期:"  prop="applyEndTime">
          <el-date-picker
            v-model="searchForm.applyEndTime"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="申请结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="状态">
            <el-option label="待确认" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
            <el-option label="已结算" value="3"></el-option>
            <el-option label="已过期" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button @click="excelExportHandle">导出</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column prop="applyName" label="申请人姓名" align="center" min-width="30">
      </el-table-column>
      <el-table-column prop="applyTel" label="申请人手机号" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="cardNo" label="申请人身份证" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="reward" label="奖励金额" align="center" min-width="30">
      </el-table-column>
        <el-table-column prop="abilityReward" label="奖励狗粮" align="center" min-width="30">
      </el-table-column>
      <el-table-column prop="prodName" label="申请产品" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" min-width="60">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="50">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1">待确认</el-tag>
          <el-tag v-if="scope.row.status===2" type="primary">未通过</el-tag>
          <el-tag v-if="scope.row.status===3" type="success">已结算</el-tag>
          <el-tag v-if="scope.row.status===4" type="danger">已过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160" align="center">
        <template slot-scope="scope">
            <el-button type="text" size="small" @click="queryDtlHandle(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
    </el-pagination>
     <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="creditApply">
    </form>
    <fx-apply-dtl v-model="custApplyShow" :fxApplyDtlData="fxApplyDtlData" @change="queryDtlChange" />
  </div>
</template>


<script>
import FxApplyDtl from '@/components/xj/CreditApplyDtl'
export default {
  name: 'fx-cust',
  data () {
    let signId = JSON.parse(this.$localStorage('signId')).v
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      custIdentifyData: {},
      fxApplyDtlData: {},
      searchForm: {
        applyStartTime: '',
        applyEndTime: '',
        applyName: '',
        cardNo: '',
        prodName: '',
        status: '',
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
      signId: '',
      exportParams: '',
      exportTitles: '',
      excelExportPath: this.$baseURL + 'store/account/user/xj/exportExcel',
      excelForm: {
        signId: signId
      },
      addShow: false,
      editShow: false,
      custApplyShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 时间条件处理
    startDateChange (date) {
      this.searchForm.applyStartTime = date || ''
      this.searchForm.applyEndTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.applyEndTime = date || ''
    },
    // 编辑
    editHandle (row) {
      this.custIdentifyData = row
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
    // 查询申请详情
    queryDtlHandle (row) {
      this.$ajax({
        url: '/store/account/xj/creditApplyData/queryApplyDtl',
        data: {applyId: row.applyId},
        success: data => {
          this.fxApplyDtlData = data.attr.applyInfo
        }
      })
      this.custApplyShow = true
    },
    // 查询详情弹窗监听
    queryDtlChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.custApplyShow = false
      } else {
        this.custApplyShow = val
      }
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/xj/creditApplyData/queryApplyList',
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
    },
     // Excel导出弹框
    excelExportHandle () {
      this.$alert('您是否确定导出数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            let totalRecord = this.totalRecord
            if (totalRecord > 1000) {
              this.$msg('一次最多导出1000条数据，请重新查询或限制条数!')
              return
            }
            let params = {}
            let roleType = this.$localStorage('userRole')
            Object.assign(params, this.searchForm, {
              roleType
            })
            this.exportParams = JSON.stringify(params)
            let signId = JSON.parse(this.$localStorage('signId')).v
            this.signId = signId
            let title = [
              {'name': 'applyName', 'title': '申请人姓名'},
              {'name': 'applyTel', 'title': '申请人手机号'},
              {'name': 'cardNo', 'title': '申请人身份证'},
              {'name': 'prodName', 'title': '申请产品'},
              {'name': 'applyTime', 'title': '申请日期'}
            ]
            this.exportTitles = JSON.stringify(title)
            let formDom = document.getElementById('JS-form-export')
            window.setTimeout(function () {
              formDom.submit()
            }, 100)
          }
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
  },
  components: {
    FxApplyDtl
  }
}
</script>

<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
</style>
