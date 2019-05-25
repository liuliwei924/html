  <template>
    <div class="content-box">
      <div class="header__title">锁粉记录</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm" ref="searchForm">
          <!-- 查询条件 -->
          <el-form-item label="工号" prop="workNo">
            <el-input v-model="searchForm.workNo" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="姓名/手机" prop="realName">
            <el-input v-model="searchForm.realName" placeholder="姓名/手机号"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="searchForm.status" clearable placeholder="状态">
              <el-option label="已锁粉" value="1"></el-option>
              <el-option label="锁粉成功" value="2"></el-option>
              <el-option label="锁粉失败" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="锁粉类型" prop="lockType">
            <el-select v-model="searchForm.lockType" clearable placeholder="锁粉类型">
              <el-option label="非文章锁粉" value="1"></el-option>
              <el-option label="文章锁粉" value="2"></el-option>
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
      <el-table class="content__table" :data="tableData" border @selection-change="selectChange">
        <el-table-column prop="workNo" label="工号" align="center" width="90">
        </el-table-column>
        <el-table-column prop="realName" label="姓名" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="telephone" label="手机号" align="center" min-width="50">
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="50">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===1" type="primary">已锁粉</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">锁粉成功</el-tag>
            <el-tag v-if="scope.row.status===3" type="danger">锁粉失败</el-tag>
          </template>
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
  name: 'fans-record',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let store = this.$getStore('rechargeData')
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      custIdentifyData: {},
      searchForm: {
        workNo: '',
        realName: '',
        createStartTime: store['startDate'] || lastWeekDay,
        createEndTime: '',
        status: '',
        lockType: '',
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
    // table表格选择
    selectChange (arr) {
      console.log(arr)
    },
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
        url: '/store/account/fx/fansRecord/queryFansList',
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
