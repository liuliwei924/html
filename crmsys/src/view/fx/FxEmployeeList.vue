  <template>
    <div class="content-box">
      <div class="header__title">员工信息</div>
       <!-- 查询条件 -->
      <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="用户ID/用户名/手机号" prop="userName">
          <el-input v-model.trim="searchForm.userName" placeholder="用户ID/用户名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="门店名称" prop="cmpName">
          <el-input v-model.trim="searchForm.cmpName" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="cityName">
          <el-input v-model.trim="searchForm.cityName" placeholder="请输入城市"></el-input>
        </el-form-item>
        <el-form-item label="置空状态" prop="emptyFlag">
          <el-select v-model="searchForm.emptyFlag" clearable placeholder="置空状态">
            <el-option label="未置空" value="0"></el-option>
            <el-option label="已置空" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form>
     </div>
      <!-- 业务操作区域 -->
      <div class="header__check">
        <el-radio-group v-model="status">
          <el-radio :label="1">员工信息</el-radio>
          <el-radio :label="2">门店信息</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column
          prop="empNo"
          label="员工编号" align="center" min-width="40">
        </el-table-column>
        <el-table-column
          prop="custId"
          label="用户ID" align="center" min-width="40">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="用户名" align="center" min-width="50">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="手机号码" align="center">
        </el-table-column>
        <el-table-column
          prop="identifyNo"
          label="身份证" align="center">
        </el-table-column>
        <el-table-column
          prop="cityName"
          label="城市" align="center" min-width="50">
        </el-table-column>
        <el-table-column
          prop="cmpName"
          label="门店名称" align="center" min-width="70">
        </el-table-column>
        <el-table-column
          prop="newReferer"
          label="新上级ID" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="emptyFlag" label="上级置空标识" align="center" min-width="50">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.emptyFlag===0" type="primary">未置空</el-tag>
          <el-tag v-if="scope.row.emptyFlag===1" type="success">已置空</el-tag>
        </template>
      </el-table-column>
        <el-table-column
          prop="remark"
          label="备注" align="center" min-width="70">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间" align="center">
        </el-table-column>
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
  name: 'fx-employee-list',
  data () {
    return {
      tableData: [],
      prodList: [],
      currentPage: 1,
      totalRecord: 1,
      status: 1,
      searchForm: {
        userName: '',
        cmpName: '',
        cityName: '',
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
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxOrgManager/queryEmployeeList',
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