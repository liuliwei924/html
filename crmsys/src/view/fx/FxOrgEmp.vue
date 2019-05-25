<template>
  <div class="content-box">
    <div class="header__title">捷越统计</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="姓名/手机号码" prop="realName">
            <el-input v-model="searchForm.realName" placeholder="姓名/手机号码"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="状态">
            <el-option label="待处理" value="0"></el-option>
            <el-option label="未注册" value="2"></el-option>
            <el-option label="已注册" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称" prop="status">
          <el-select v-model="searchForm.orgName" clearable placeholder="公司名称">
            <el-option label="请选择公司名称" value=""></el-option>
            <el-option label="捷越" value="jy"></el-option>
            <el-option label="小小金融" value="xxjr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期-起:" prop="startDate">
          <el-date-picker v-model="searchForm.startDate" type="date" editable @change="startDateChange" :picker-options="startDateOptions" placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期-止:" prop="endDate">
          <el-date-picker v-model="searchForm.endDate" type="date" editable @change="endDateChange" :picker-options="endDateOptions" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button :loading="loading" @click="orgEmpHandle">数据维护</el-button>
        <el-button @click="excelExportHandle('anJie')">按揭部数据导出</el-button>
        <el-button @click="excelExportHandle('jieYue')">捷越数据导出</el-button>
        <el-form-item label="处理页数:" prop="limitNum" class="child-input100">
            <el-input v-model="limitNum" placeholder="处理页数"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table class="content__table"
      :data="tableData"
      @sort-change="sortEvent"
      border>
      <el-table-column
        prop="custId"
        label="用户ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hideTel"
        label="手机号"
        align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="50">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===0">待处理</el-tag>
          <el-tag v-if="scope.row.status===1" type="success">已注册</el-tag>
          <el-tag v-if="scope.row.status===2" type="primary">未注册</el-tag>
        </template>
      </el-table-column>
       <el-table-column
        prop="createTime"
        label="时间"
        align="center">
      </el-table-column>
      <el-table-column prop="orgName" label="所在公司" align="center" min-width="40">
          <template slot-scope="scope">
            <span v-if ="scope.row.orgName==='jy'">捷越</span>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="totalRecord">
    </el-pagination>
    <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="exportType" v-model="exportType">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="fxCustCount">
    </form>
  </div>
</template>

<script>
export default {
  name: 'fxCustCount',
  data () {
    let {today} = this.$searchDate()
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      exportParams: '',
      limitNum: 1,
      exportTitles: '',
      loading: false,
      exportType: '',
      signId: '',
      searchForm: {
        orgName: '',
        realName: '',
        status: '',
        startDate: '',
        endDate: today || '',
        orderBy: '',
        orderValue: '',
        currentPage: 1
      },
      excelExportPath: this.$baseURL + 'store/account/fx/fxDataCount/jieyueExport',
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
     // 申请时间
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
    sortEvent (column) {
      if (column.prop === null) {
        if (this.searchForm.hasOwnProperty('orderBy')) { delete this.searchForm['orderBy'] }
        if (this.searchForm.hasOwnProperty('orderValue')) { delete this.searchForm['orderValue'] }
      } else {
        this.searchForm.orderBy = column.prop
        this.searchForm.orderValue = column.order === 'ascending' ? 'asc' : 'desc'
      }
      this.searchHandle()
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('fxCustCount', this.searchForm)
      this.$ajax({
        url: '/store/account/fx/fxOrgEmp/queryFxOrgEmpList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 手动升级专员处理
    orgEmpHandle () {
      this.$alert('您是否确定处理?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxOrgEmp/orgEmpHandle',
              loading: true,
              data: {limitNum: this.limitNum},
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // Excel导出弹框
    excelExportHandle (exportType) {
      this.exportType = exportType
      this.$alert('您是否确定导出数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            if (this.limitNum > 1000) {
              this.$msg('一次最多导出1000条数据，请重新输入导出条数!')
              return
            }
            let params = {limitNum: this.limitNum}
            let roleType = this.$localStorage('userRole')
            Object.assign(params, this.searchForm, {
              roleType
            })
            this.exportParams = JSON.stringify(params)
            let signId = JSON.parse(this.$localStorage('signId')).v
            this.signId = signId
            let title = [
              {'name': 'userName', 'title': '姓名'},
              {'name': 'telephone', 'title': '手机号码'},
              {'name': 'fansNum', 'title': '粉丝数'},
              {'name': 'applyNum', 'title': '申请数量'},
              {'name': 'succNum', 'title': '批卡数量'}
            ]
            if (this.exportType === 'jieYue') {
              title = [
                {'name': 'userName', 'title': '姓名'},
                {'name': 'orgName', 'title': '公司名称'},
                {'name': 'telephone', 'title': '手机号码'},
                {'name': 'fansNum', 'title': '粉丝数'},
                {'name': 'applyNum', 'title': '申请数量'},
                {'name': 'succNum', 'title': '批卡数量'},
                {'name': 'totalAmt', 'title': '总收益'}
              ]
            }
            this.exportTitles = JSON.stringify(title)
            let formDom = document.getElementById('JS-form-export')
            window.setTimeout(function () {
              formDom.submit()
            }, 100)
          }
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
  }
}
</script>
<style>
.content-box .header__search .child-input100 .el-input__inner{
  width:100px;
}
</style>
