  <template>
    <div class="content-box">
      <div class="header__title">门店信息</div>
       <!-- 查询条件 -->
      <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="门店名称" prop="cmpName">
          <el-input v-model.trim="searchForm.cmpName" placeholder="请输入门店名称"></el-input>
        </el-form-item>
         <el-form-item label="城市" prop="cityName">
          <el-input v-model.trim="searchForm.cityName" placeholder="请输入城市"></el-input>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button :loading="loading" @click="batchBindCustId">绑定用户</el-button>
        <el-button :loading="loading" @click="batchMaintenanceReferer">员工上下级关系维护</el-button>
      </el-form>
     </div>
      <!-- 业务操作区域 -->
      <div class="header__check">
        <el-radio-group v-model="status">
          <el-radio :label="1">员工信息</el-radio>
          <el-radio :label="2">门店信息</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table" 
        :data="tableData" 
        border @selection-change="selectChange">
        <el-table-column
          type="selection"
          fixed="left"
          width="55">
        </el-table-column>
        <el-table-column
          prop="cityName"
          label="城市" align="center">
        </el-table-column>
        <el-table-column
          prop="cmpName"
          label="门店名称" align="center">
        </el-table-column>
       <!--  <el-table-column
         fixed="right"
         label="操作"
         width="160"
         align="center">
         <template slot-scope="scope">
           <el-button type="text" size="small" @click="employeeManager(scope.row)">关系维护</el-button>
         </template>
       </el-table-column> -->
      </el-table>
      <el-pagination
        class="content__page fr"
        @current-change="pageHandle"
        :current-page="currentPage"
        layout="total, prev, pager, next"
        :total="totalRecord">
      </el-pagination>
    </div>
  </template>

<script>
export default {
  name: 'fx-org-list',
  data () {
    return {
      tableData: [],
      prodList: [],
      orgNames: [],
      currentPage: 1,
      totalRecord: 1,
      status: 2,
      searchForm: {
        cmpName: '',
        currentPage: 1
      }
    }
  },
  created () {
    this.searchHandle()
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    // table表格选择
    selectChange (arr) {
      let orgNames = []
      for (let i = 0; i < arr.length; i++) {
        orgNames.push(arr[i]['cmpName'])
      }
      this.orgNames = orgNames
    },
    // 绑定用户批量操作
    batchBindCustId () {
      if (this.orgNames.length === 0) {
        this.$msg('请至少选择一个门店!')
        return
      }
      let orgNames = ''
      for (let i = 0; i < this.orgNames.length; i++) {
        orgNames += this.orgNames[i] + ','
      }
      this.$ajax({
        url: '/store/account/fx/fxOrgManager/batchBindCustId',
        data: {orgNames},
        loading: true,
        success: data => {
          this.searchHandle()
          this.$message({
            message: '绑定完成！',
            type: 'success'
          })
        }
      })
    },
    // 批量操作
    batchMaintenanceReferer () {
      if (this.orgNames.length === 0) {
        this.$msg('请至少选择一个门店!')
        return
      }
      let orgNames = ''
      for (let i = 0; i < this.orgNames.length; i++) {
        orgNames += this.orgNames[i] + ','
      }
      this.$ajax({
        url: '/store/account/fx/fxOrgManager/batchMaintenanceReferer',
        data: {orgNames},
        loading: true,
        success: data => {
          this.searchHandle()
          this.$message({
            message: '维护完成！',
            type: 'success'
          })
        }
      })
    },
    // 员工管理
    employeeManager (obj) {
      this.$ajax({
        url: '/store/account/fx/fxOrgManager/employeeManager',
        data: obj.cmpName,
        loading: true,
        success: data => {
          this.searchHandle()
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxOrgManager/queryOrgManagerList',
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
  }
}
</script>