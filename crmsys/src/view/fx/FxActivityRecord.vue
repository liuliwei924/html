  <template>
    <div class="content-box">
      <div class="header__title">升级活动记录</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm" ref="searchForm">
          <!-- 查询条件 -->
          <el-form-item label="工号" prop="workNo">
            <el-input v-model="searchForm.workNo" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="姓名/手机" prop="realName">
            <el-input v-model="searchForm.realName" placeholder="姓名/手机号"></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="recordDesc">
          <el-select v-model="searchForm.recordDesc" clearable placeholder="等级">
            <el-option label="专员" value="升级专员奖金"></el-option>
            <el-option label="经理" value="升级经理奖金"></el-option>
            <el-option label="行长" value="升级行长奖金"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="奖励开始日期:" prop="startTime">
            <el-date-picker
              v-model="searchForm.startTime"
              type="date"
              editable
              :picker-options="startDateOptions"
              @change="startDateChange"
              placeholder="奖励开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="奖励结束日期:" prop="endTime">
            <el-date-picker
              v-model="searchForm.endTime"
              type="date"
              editable
              :picker-options="endDateOptions"
              @change="endDateChange"
              placeholder="奖励结束日期">
            </el-date-picker>
          </el-form-item>
          <el-button :loading="loading" @click="searchHandle">查询</el-button>
          <el-button @click="resetForm('searchForm')">重置</el-button>
        </el-form>
      </div>
      <div >
        <b class="strong">活动期间统计:</b>
        累计发放金额：<span class="sumRed">{{summary.totalAmt}}</span>；
        当天发放金额：<span class="sumRed">{{summary.todayAmt}}</span>；
        总升级专员数：<span class="sumRed">{{summary.grade2}}</span>；
        总升级经理数：<span class="sumRed">{{summary.grade3}}</span>；
        总升级行长数：<span class="sumRed">{{summary.grade4}}</span>；
      </div>
       <!-- 业务操作区域 -->
      <div class="header__check">
        <el-radio-group v-model="status">
          <el-radio :label="1">升级活动记录</el-radio>
          <el-radio :label="2">红包领取记录</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column prop="workNo" label="工号" align="center" width="90">
        </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="telephone" label="手机号" align="center" min-width="50">
        </el-table-column>
        <el-table-column prop="gradeName" label="等级" align="center" min-width="50">
        </el-table-column>
        <el-table-column prop="amount" label="奖励金额" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="recordDesc" label="奖励描述" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="createTime" label="奖励时间" align="center" min-width="40">
        </el-table-column>
      </el-table>
      <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
      </el-pagination>
    </div>
  </template>


<script>
export default {
  name: 'fx-activity-record',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      custIdentifyData: {},
      status: 1,
      summary: {},
      searchForm: {
        workNo: '',
        realName: '',
        recordDesc: '',
        startTime: '2018-10-10' || '',
        endTime: '',
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
      this.searchForm.startTime = date || ''
      this.searchForm.endTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.endTime = date || ''
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/activityReward/queryRewardRecord',
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
        url: '/store/account/fx/activityReward/queryUpgradeActivitySum',
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
