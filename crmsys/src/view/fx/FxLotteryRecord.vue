  <template>
    <div class="content-box">
      <div class="header__title">红包领取记录</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm" ref="searchForm">
          <!-- 查询条件 -->
          <el-form-item label="工号" prop="workNo">
            <el-input v-model="searchForm.workNo" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="姓名/手机" prop="realName">
            <el-input v-model="searchForm.realName" placeholder="姓名/手机号"></el-input>
          </el-form-item>
          <el-form-item label="红包领取开始日期:" prop="createStartTime">
            <el-date-picker
              v-model="searchForm.createStartTime"
              type="date"
              editable
              :picker-options="startDateOptions"
              @change="startDateChange"
              placeholder="红包领取开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="红包领取结束日期:" prop="createEndTime">
            <el-date-picker
              v-model="searchForm.createEndTime"
              type="date"
              editable
              :picker-options="endDateOptions"
              @change="endDateChange"
              placeholder="红包领取结束日期">
            </el-date-picker>
          </el-form-item>
          <el-button :loading="loading" @click="searchHandle">查询</el-button>
          <el-button @click="resetForm('searchForm')">重置</el-button>
        </el-form>
      </div>
      <div >
        <b class="strong">活动期间统计:</b>
        红包领取总数：<span class="sumRed">{{summary.totalLottNums}}</span>；
        红包领取人数：<span class="sumRed">{{summary.joinNums}}</span>；
        红包领取总额：<span class="sumRed">{{summary.totalAmt}}</span>；
        总批卡数：<span class="sumRed">{{summary.succNums}}</span>；
        总批卡人数：<span class="sumRed">{{summary.succCustNums}}</span>；
      </div>

       <!-- 业务操作区域 -->
      <div class="header__check">
        <el-radio-group v-model="status">
          <el-radio :label="1">活动领取记录</el-radio>
          <el-radio :label="2">红包领取记录</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column prop="workNo" label="工号" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="realName" label="姓名" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="telephone" label="手机号" align="center" min-width="50">
        </el-table-column>
        <el-table-column prop="amount" label="红包金额" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="createTime" label="红包领取时间" align="center" min-width="40">
        </el-table-column>
      </el-table>
      <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
      </el-pagination>
    </div>
  </template>


<script>
export default {
  name: 'fx-lottery-record',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      custIdentifyData: {},
      status: 2,
      summary: {},
      searchForm: {
        workNo: '',
        realName: '',
        createStartTime: '',
        createEndTime: '',
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
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
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
        url: '/store/account/fx/activityReward/queryLotteryRecord',
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
        url: '/store/account/fx/activityReward/queryFxLotterySum',
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
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
  .sumRed {
    color: red;
  }
</style>
