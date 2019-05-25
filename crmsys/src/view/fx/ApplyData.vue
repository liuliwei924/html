<template>
  <div class="content-box">
    <div class="header__title">申请数据</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="工号" prop="workNo">
          <el-input v-model.trim="searchForm.workNo" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="申请姓名/手机号" prop="applyName">
          <el-input v-model.trim="searchForm.applyName" placeholder="请输入姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="申请身份证号" prop="cardNo">
          <el-input v-model.trim="searchForm.cardNo" placeholder="请输入申请身份证号"></el-input>
        </el-form-item>
        <el-form-item label="申请ID" prop="applyId">
          <el-input v-model.trim="searchForm.applyId" placeholder="请输入申请ID"></el-input>
        </el-form-item>
        <el-form-item label="申请产品" prop="prodName">
          <el-input v-model.trim="searchForm.prodName" placeholder="请输入申请产品"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="prodType">
          <el-select v-model="searchForm.prodType" clearable placeholder="请选择产品类型">
            <el-option label="信用卡" value="1"></el-option>
            <el-option label="保险" value="2"></el-option>
            <el-option label="贷款" value="3"></el-option>
          </el-select>
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
        <el-form-item label="自动发放状态" prop="autoReward">
          <el-select v-model="searchForm.autoReward" clearable placeholder="自动发放状态">
            <el-option label="未自动发" value="0"></el-option>
            <el-option label="已自动发" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否异常数据" prop="exceptional">
          <el-select v-model="searchForm.exceptional" clearable placeholder="是否异常数据">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button @click="excelExportHandle">导出</el-button>
        <el-button :loading="loading" @click="updateApplyStatus">修改状态</el-button>
        <el-button :loading="loading" @click="excDataHandle">高风险数据处理</el-button>
      </el-form>
    </div>
    <el-table class="content__table" 
        :data="tableData"  
        border 
        style="width: 100%"
        highlight-current-row 
        @current-change="handleCurrentChange">
      <el-table-column prop="workNo" label="工号" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="applyName" label="申请人姓名" align="center" min-width="45">
      </el-table-column>
      <el-table-column prop="telephone" label="申请人手机号" align="center" min-width="55">
      </el-table-column>
      <el-table-column prop="cardNo" label="申请人身份证" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="refererAmt1" label="一级奖金" align="center" min-width="30">
      </el-table-column>
        <el-table-column prop="refererAmt2" label="二级奖金" align="center" min-width="30">
      </el-table-column>
        <el-table-column prop="refererAmt3" label="三级奖金" align="center" min-width="30">
      </el-table-column>
        <el-table-column prop="refererAmt4" label="四级奖金" align="center" min-width="30">
      </el-table-column>
       <el-table-column prop="referer" label="推荐ID" align="center" min-width="40">
      </el-table-column>
      <el-table-column prop="prodName" label="申请产品" align="center" min-width="45">
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" min-width="75">
      </el-table-column>
       <el-table-column prop="settleDate" label="结算日期" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="40">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1">待确认</el-tag>
          <el-tag v-if="scope.row.status===2" type="primary">未通过</el-tag>
          <el-tag v-if="scope.row.status===3" type="success">已结算</el-tag>
          <el-tag v-if="scope.row.status===4" type="danger">已过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="autoReward" label="自动发放状态" align="center" min-width="45">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.autoReward===0" type="primary">未自动发</el-tag>
          <el-tag v-if="scope.row.autoReward===1" type="success">已自动发</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="exceptional" label="是否异常数据" align="center" min-width="40">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.exceptional===0" type="success">否</el-tag>
          <el-tag v-if="scope.row.exceptional===1" type="danger">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="queryDtlHandle(scope.row)">详情</el-button>
          <span v-if ="scope.row.status===1 || scope.row.status===2">
            <el-button type="text" size="small" @click="modifyApply(scope.row)">修改信息</el-button>
            <span v-if ="scope.row.progressFlag == 1 || scope.row.progressFlag == 2">
              <el-button type="text" size="small" @click="processQuery(scope.row)">查询信用卡状态</el-button>
            </span>
            <span v-if ="scope.row.prodType === 2">
              <el-button type="text" size="small" @click="addInsNoHandle(scope.row)">录入保单号</el-button>
            </span> 
          </span>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination class="content__page fr" 
      @size-change="handleSizeChange"
      @current-change="pageHandle" 
      :current-page="currentPage"
      :page-size="everyPage"
      layout="total, prev, pager, next" 
      :total="totalRecord">
    </el-pagination>
     <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="fxApply">
    </form>
    <fx-apply-dtl v-model="custApplyShow" :fxApplyDtlData="fxApplyDtlData" @change="queryDtlChange" />
    <fx-apply-modify v-model="modifyApplyShow" :modifyApplyData="modifyApplyData" @change="modifyApplyChange" />
    <process-query v-model="processQueryShow" :processQueryData="processQueryData" @change="processQueryChange" />
    <fx-apply-add-insno v-model="addInsNoShow" :addInsNoData="addInsNoData" @change="addInsnoShowChange" />
  </div>
</template>


<script>
import FxApplyDtl from '@/components/fx/FxApplyDtl'
import FxApplyModify from '@/components/fx/FxApplyModify'
import ProcessQuery from '@/components/fx/ProcessQuery'
import FxApplyAddInsno from '@/components/fx/FxApplyAddInsNo'
export default {
  name: 'apply-data',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let store = this.$getStore('rechargeData')
    let signId = JSON.parse(this.$localStorage('signId')).v
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      everyPage: 10,
      modifyApplyData: {},
      fxApplyDtlData: {},
      processQueryData: {},
      addInsNoData: {},
      searchForm: {
        workNo: '',
        applyStartTime: store['startDate'] || lastWeekDay,
        applyEndTime: '',
        applyName: '',
        cardNo: '',
        applyId: '',
        prodName: '',
        prodType: '',
        status: '',
        autoReward: '',
        exceptional: '',
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
      excelExportPath: this.$baseURL + 'store/account/fx/fxDataCount/fxDataExport',
      excelForm: {
        signId: signId
      },
      loading: false,
      addShow: false,
      editShow: false,
      custApplyShow: false,
      modifyApplyShow: false,
      processQueryShow: false,
      addInsNoShow: false
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
    // 选择某一条记录
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // 每页几条
    handleSizeChange (val) {
      this.everyPage = val
      this.searchTable(1)
    },
    // 查询申请详情
    queryDtlHandle (row) {
      this.$ajax({
        url: '/store/account/fx/applyData/queryApplyDtl',
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
    // 修改申请信息方法
    modifyApply (row) {
      this.modifyApplyData = row
      this.modifyApplyShow = true
    },
     // 修改申请信息弹窗监听
    modifyApplyChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.modifyApplyShow = false
      } else {
        this.modifyApplyShow = val
      }
    },
    // 信用卡查询
    processQuery (row) {
      this.processQueryData = row
      this.processQueryShow = true
    },
    // 修改申请信息弹窗监听
    processQueryChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.processQueryShow = false
      } else {
        this.processQueryShow = val
      }
    },
    // 保单号录入查询
    addInsNoHandle (row) {
      this.addInsNoData = row
      this.addInsNoShow = true
    },
    // 修改申请信息弹窗监听
    addInsnoShowChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.addInsNoShow = false
      } else {
        this.addInsNoShow = val
      }
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/applyData/queryApplyList',
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
    // 手动申请状态处理
    updateApplyStatus () {
      if (!this.currentRow) {
        this.$message({message: '请先选中一条数据', type: 'warning'})
        return
      }
      if (this.currentRow.status !== 2) {
        this.$message({message: '请选择未通过状态数据！', type: 'warning'})
        return
      }
      this.$alert('您是否确定修改状态?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/applyData/updateApplyStatus',
              data: {applyId: this.currentRow.applyId},
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({message: '修改成功', type: 'success'})
              }
            })
          }
        }
      })
    },
    // 高风险数据处理
    excDataHandle () {
      this.$alert('您是否确定处理数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/applyData/excTmpHandle',
              loading: true,
              success: data => {
                this.searchHandle()
                this.$message({
                  message: '处理完成！',
                  type: 'success'
                })
              }
            })
          }
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
              {'name': 'workNo', 'title': '工号'},
              {'name': 'applyName', 'title': '申请人姓名'},
              {'name': 'telephone', 'title': '申请人手机号'},
              {'name': 'cardNo', 'title': '申请人身份证'},
              {'name': 'sex', 'title': '申请人性别'},
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
    FxApplyDtl,
    FxApplyModify,
    ProcessQuery,
    FxApplyAddInsno
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
