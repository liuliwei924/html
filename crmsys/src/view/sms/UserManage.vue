<template>
  <div class="content-box">
    <div class="header__title">用户管理</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <!-- 手机归属地 -->
        <el-form-item label="手机归属地" prop="telcity">
          <el-input v-model="searchForm.telcity" placeholder="请输入手机归属地"></el-input>
        </el-form-item>
        <!-- 运营商 -->
        <el-form-item label="运营商" prop="yys">
          <el-select v-model="searchForm.yys" clearable placeholder="请选择运营商">
            <el-option label="移动" value="移动"></el-option>
            <el-option label="联通" value="联通"></el-option>
            <el-option label="电信" value="电信"></el-option>
          </el-select>
        </el-form-item>
        <!-- 是否注册 -->
        <el-form-item label="是否注册" prop="isr">
          <el-select v-model="searchForm.isr" clearable placeholder="请选择是否注册">
            <el-option label="已注册" value="1"></el-option>
            <el-option label="未注册" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- 最后发送状态 -->
        <el-form-item label="最后发送状态" prop="lss">
          <el-select v-model="searchForm.lss" clearable placeholder="请选择最后发送状态">
            <el-option label="未发送过" value="0"></el-option>
            <el-option label="初始化" value="1"></el-option>
            <el-option label="成功" value="2"></el-option>
            <el-option label="失败" value="3"></el-option>
            <el-option label="手动发送" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最后发送模板" prop="lstid">
          <el-select v-model="searchForm.lstid" filterable clearable placeholder="请选择最后发送模板">
            <el-option v-for="val,key,index in smsTempData" :label="val.tempName" :value="val.tempId" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- 上次发送时间 -->
        <el-form-item label="最后发送开始时间:" prop="startLstime">
          <el-date-picker v-model="searchForm.startLstime" type="date" editable @change="startLstimeChange" :picker-options="startDateOptions" placeholder="最后发送开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最后发送结束时间:" prop="endLstime">
          <el-date-picker v-model="searchForm.endLstime" type="date" editable @change="endLstimeChange" :picker-options="endDateOptions" placeholder="最后发送结束时间">
          </el-date-picker>
        </el-form-item>
        <!-- 创建时间 
        <el-form-item label="创建开始时间:" prop="startCtime">
          <el-date-picker v-model="searchForm.startCtime" type="date" editable @change="startCtimeChange" :picker-options="startDateOptions" placeholder="创建开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建结束时间:" prop="endCtime">
          <el-date-picker v-model="searchForm.endCtime" type="date" editable @change="endCtimeChange" :picker-options="endDateOptions" placeholder="创建结束时间">
          </el-date-picker>
        </el-form-item> -->
        <!-- 按钮 -->
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <!-- <el-button @click="smsSendHandle">发送短信</el-button> -->
        <el-button @click="excelExportHandle">导出</el-button>
        <el-upload class="upload-demo" :action="excelImportPath" accept="xls" :data="excelForm" :show-file-list="false" :before-upload="beforeUp" :on-success="upSuccess">
          <el-button size="small" icon="upload" type="primary" class="excelBtn" :loading="loading" @click.stop="uploadBtn" :disabled="loading">导入</el-button>
        </el-upload>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column prop="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="tel" label="手机号">
      </el-table-column>
      <el-table-column prop="yys" label="运营商">
      </el-table-column>
      <el-table-column prop="telcity" label="手机归属地">
      </el-table-column>
      <el-table-column prop="ctime" label="创建时间">
      </el-table-column>
      <el-table-column prop="lstime" label="最后发送时间">
      </el-table-column>
      <el-table-column prop="lstid" label="最后发送模板id">
      </el-table-column>
      <el-table-column prop="lss" label="最后发送状态">
        <template slot-scope="scope">
          <span v-if="scope.row.lss==='1'">初始化</span>
          <span v-if="scope.row.lss==='2'">成功</span>
          <span v-if="scope.row.lss==='3'">失败</span>
          <span v-if="scope.row.lss==='4'">手动发送</span>
        </template>
      </el-table-column>
      <el-table-column prop="st" label="发送次数">
      </el-table-column>
      <el-table-column prop="isr" label="是否已注册">
        <template slot-scope="scope">
          <span v-if="scope.row.isr==='1'">已注册</span>
          <span v-if="scope.row.isr==='0'">未注册</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
    </el-pagination>
    <!-- 导出 -->
    <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
      <input type="text" name="exportParams" v-model="exportParams">
      <input type="text" name="exportTitles" v-model="exportTitles">
      <input type="text" name="signId" v-model="signId">
      <input type="text" name="exportType" value="storeDayExp">
    </form>
    <sms-send v-model="smsSendShow" @change="smsSendChange" />
    <sms-excel-export v-model="smsExcelExportShow" @change="smsExcelExportChange" />
  </div>
</template>


<script>
import SmsSend from '@/components/sms/SmsSend'
import SmsExcelExport from '@/components/sms/SmsExcelExport'
export default {
  name: 'use-manager',
  data () {
    let signId = JSON.parse(this.$localStorage('signId')).v
    return {
      smsTempData: [],
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      exportParams: '',
      exportTitles: '',
      signId: '',
      searchForm: {
        yys: '',
        telcity: '',
        isr: '',
        lss: '',
        lstid: '',
        startLstime: '',
        endLstime: '',
        startCtime: '',
        endCtime: '',
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
      excelImportPath: this.$baseURL + 'store/account/sms/data/batchImport',
      excelExportPath: this.$baseURL + 'store/account/sms/data/exportExcel',
      excelForm: {
        signId: signId
      },
      smsSendShow: false,
      smsExcelExportShow: false,
      loading: false
    }
  },
  created () {
    this.searchHandle()
    this.getSmsTemplate()
  },
  methods: {
    // 上次发送时间
    startLstimeChange (date) {
      this.searchForm.startLstime = date || ''
      this.searchForm.endLstime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endLstimeChange (date) {
      this.searchForm.endLstime = date || ''
    },
    // 创建时间
    startCtimeChange (date) {
      this.searchForm.startCtime = date || ''
      this.searchForm.endCtime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endCtimeChange (date) {
      this.searchForm.endCtime = date || ''
    },
    // 发送短信弹框
    smsSendHandle () {
      this.smsSendShow = true
    },
    // 添加弹窗监听
    smsSendChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.smsSendShow = false
      } else {
        this.smsSendShow = val
      }
    },
    // Excel导出弹框
    excelExportHandle () {
      this.smsExcelExportShow = true
    },
    // 添加弹窗监听
    smsExcelExportChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.smsExcelExportShow = false
      } else {
        this.smsExcelExportShow = val
      }
    },
    // 文件上传之前处理
    beforeUp () {
      this.loading = true
    },
    // 文件上传成功处理
    upSuccess (res) {
      this.loading = false
      if (res.success) {
        if (res.message) {
          this.$msg(res.message)
        } else {
          this.$msg('导入成功！', 'success')
        }
        this.searchHandle()
      } else {
        this.$msg(res.message, 'error')
      }
    },
     // 文件上传处理
    uploadBtn () {
      let fileBtn = document.getElementsByClassName('el-upload__input')
      fileBtn[0].click()
    },
    // Excel导出
    exportData () {
      let signId = JSON.parse(this.$localStorage('signId')).v
      this.signId = signId
      let title = [
        {'name': 'tel', 'title': '手机号码'}
      ]
      this.exportTitles = JSON.stringify(title)
      let formDom = document.getElementById('JS-form-export')
      window.setTimeout(function () {
        formDom.submit()
      }, 100)
    },
    // 获取短信模板
    getSmsTemplate () {
      this.$ajax({
        url: '/store/account/sms/smsTemp/querySmsTempInfo',
        success: data => {
          this.smsTempData = data.rows || []
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/sms/data/queryTelephone',
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
    SmsSend,
    SmsExcelExport
  }
}
</script>
