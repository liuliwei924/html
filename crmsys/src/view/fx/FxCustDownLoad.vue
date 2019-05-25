<template>
  <div class="content-box">
    <div class="header__title">用户下载</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
      <!-- 查询条件 -->
        <el-form-item label="等级" prop="grade">
          <el-select v-model="searchForm.grade" clearable placeholder="等级">
            <el-option label="实习专员" value="1"></el-option>
            <el-option label="专员 " value="2"></el-option>
            <el-option label="经理" value="3"></el-option>
            <el-option label="行长" value="4"></el-option>
          </el-select>
        </el-form-item>
        <!-- 注册时间 -->
        <el-form-item label="注册开始时间:" prop="regStartTime">
          <el-date-picker v-model="searchForm.regStartTime" type="date" editable @change="regStartChange" :picker-options="startDateOptions" placeholder="注册开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册结束时间:" prop="regEndTime">
          <el-date-picker v-model="searchForm.regEndTime" type="date" editable @change="regEndChange" :picker-options="endDateOptions" placeholder="注册结束时间">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
       </el-form>
    </div>
    <el-table class="content__table" 
      :data="tableData" 
      border>
      <el-table-column 
        prop="fileName" 
        label="文件名" 
        align="center" 
        min-width="55">
      </el-table-column>
      <el-table-column 
        prop="currentDownPage" 
        label="当前下载页" 
        align="center" 
        min-width="60">
      </el-table-column>
      <el-table-column 
        fixed="right" 
        label="操作" 
        width="160" 
        align="center">
        <template slot-scope="scope">
            <el-button type="text" size="small" @click="excelExportHandle(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="fxCustDownLoad">
    </form>
  </div>
</template>


<script>
export default {
  name: 'fx-cust-down-load',
  data () {
    return {
      tableData: [],
      exportParams: '',
      exportTitles: '',
      signId: '',
      searchForm: {
        grade: '',
        regStartTime: '',
        regEndTime: ''
      },
      excelExportPath: this.$baseURL + 'store/account/fx/fxCustDownLoad/fxCustInfoDownLoad',
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
  methods: {
     // 注册时间
    regStartChange (date) {
      this.searchForm.regStartTime = date || ''
      this.searchForm.regEndTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    regEndChange (date) {
      this.searchForm.regEndTime = date || ''
    },
    // Excel导出弹框
    excelExportHandle (obj) {
      this.$alert('您是否确定下载数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            let params = {}
            let fileName = obj.fileName
            let currentDownPage = obj.currentDownPage
            Object.assign(params, this.searchForm, {
              fileName,
              currentDownPage
            })
            this.exportParams = JSON.stringify(params)
            let signId = JSON.parse(this.$localStorage('signId')).v
            this.signId = signId
            let title = [
              {'name': 'userName', 'title': '用户名'},
              {'name': 'telephone', 'title': '手机号码'}
            ]
            this.exportTitles = JSON.stringify(title)
            let formDom = document.getElementById('JS-form-export')
            window.setTimeout(function () {
              formDom.submit()
            }, 1000)
          }
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxCustDownLoad/queryCustList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    }
  }
}
</script>