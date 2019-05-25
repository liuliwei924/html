  <template>
    <div class="content-box">
      <div class="header__title">资金记录</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm" ref="searchForm">
          <!-- 查询条件 -->
          <el-form-item label="客户编号" prop="customerId">
            <el-input v-model="searchForm.customerId" placeholder="请输入客户编号"></el-input>
          </el-form-item>
          <el-form-item label="业务ID" prop="businessId">
            <el-input v-model="searchForm.businessId" placeholder="请输入业务ID"></el-input>
          </el-form-item>
          <el-form-item label="姓名/手机" prop="realName">
            <el-input v-model="searchForm.realName" placeholder="姓名/手机号"></el-input>
          </el-form-item>
          <el-form-item label="资金类型" prop="fundType">
            <el-select v-model="searchForm.fundType" clearable placeholder="资金类型">
              <el-option label="佣金" value="reward"></el-option>
              <el-option label="提现" value="withdraw"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期:" prop="createStartTime">
            <el-date-picker
              v-model="searchForm.createStartTime"
              type="date"
              editable
              :picker-options="startDateOptions"
              @change="startDateChange"
              placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期:" prop="createEndTime">
            <el-date-picker
              v-model="searchForm.createEndTime"
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
      <el-table class="content__table" :data="tableData" border>
        <el-table-column prop="customerId" label="客户编号" align="center" width="90">
        </el-table-column>
        <el-table-column prop="realName" label="姓名" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="telephone" label="手机号" align="center" min-width="50">
        </el-table-column>
       <!-- <el-table-column prop="rewardType" label="佣金类别" align="center" min-width="40">
        </el-table-column> -->
        <el-table-column prop="amount" label="金额" align="center" min-width="40">
        </el-table-column>
         <el-table-column prop="fundType" label="资金类型" align="center" min-width="40">
          <template slot-scope="scope">
            <span v-if ="scope.row.fundType==='reward'">佣金</span>
            <span v-if ="scope.row.fundType==='withdraw'">提现</span>
          </template>
        </el-table-column>
        <el-table-column prop="prodName" label="申请产品" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="businessId" label="业务ID" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="recordDesc" label="描述" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="时间" align="center">
        </el-table-column>
      </el-table>
      <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
      </el-pagination>
    </div>
  </template>


<script>
export default {
  name: 'xj-fund-record',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      custIdentifyData: {},
      searchForm: {
        customerId: '',
        businessId: '',
        realName: '',
        createStartTime: '',
        createEndTime: '',
        fundType: '',
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
      addShow: false,
      editShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 时间条件处理
    startDateChange (date) {
      this.searchForm.createStartTime = date || ''
      this.searchForm.createEndTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.createEndTime = date || ''
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/xj/xjFundRecord/queryFundList',
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

<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
</style>
