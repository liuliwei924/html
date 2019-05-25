  <template>
    <div class="content-box">
      <div class="header__title">资金池记录</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm" ref="searchForm">
          <!-- 查询条件 -->
          <el-form-item label="工号" prop="workNo">
            <el-input v-model.trim="searchForm.workNo" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="姓名/手机" prop="realName">
            <el-input v-model.trim="searchForm.realName" placeholder="姓名/手机号"></el-input>
          </el-form-item>
          <el-form-item label="反馈ID" prop="succId">
            <el-input v-model.trim="searchForm.succId" placeholder="反馈ID"></el-input>
          </el-form-item>
          <el-form-item label="申请ID" prop="applyId">
            <el-input v-model.trim="searchForm.applyId" placeholder="申请ID"></el-input>
          </el-form-item>
          <el-form-item label="申请产品" prop="prodName">
            <el-input v-model.trim="searchForm.prodName" placeholder="申请产品"></el-input>
          </el-form-item>
          <el-form-item label="佣金类别" prop="rewardType">
            <el-select v-model="searchForm.rewardType" clearable placeholder="佣金类别">
              <el-option label="一级奖金" value="1"></el-option>
              <el-option label="二级奖金" value="2"></el-option>
              <el-option label="三级奖金" value="3"></el-option>
              <el-option label="四级奖金" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资金状态" prop="fundStatus">
            <el-select v-model="searchForm.fundStatus" clearable placeholder="资金状态">
              <el-option label="待处理" value="0"></el-option>
              <el-option label="待检测" value="4"></el-option>
              <el-option label="数据异常" value="1"></el-option>
              <el-option label="数据正常" value="2"></el-option>
              <el-option label="已结算" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额是否有变动" prop="notSame">
            <el-select v-model="searchForm.notSame" clearable placeholder="结算金额是否一致">
              <el-option label="金额有变动" value="1"></el-option>
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
            <el-button :loading="loading" @click="preSettleHandle">资金预结算</el-button>
            <el-button :loading="loading" @click="poolDataCheck">资金检测</el-button>
            <el-button :loading="loading" @click="poolDataSettle">资金结算</el-button>
          
        </el-form>
      </div>
      <el-table class="content__table" :data="tableData" border @selection-change="selectChange">
        <el-table-column prop="workNo" label="工号" align="center" width="90">
        </el-table-column>
        <el-table-column prop="realName" label="姓名" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="telephone" label="手机号" align="center" min-width="50">
        </el-table-column>
        <el-table-column prop="rewardType" label="佣金类别" align="center" min-width="40">
            <template slot-scope="scope">
            <span v-if="scope.row.rewardType===1">一级奖金</span>
            <span v-if="scope.row.rewardType===2">二级奖金</span>
            <span v-if="scope.row.rewardType===3">三级奖金</span>
            <span v-if="scope.row.rewardType===4">四级奖金</span>
          </template>
        </el-table-column>
         <el-table-column prop="fundStatus" label="资金状态" align="center" min-width="40">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.fundStatus===0">未结算</el-tag>
            <el-tag v-if="scope.row.fundStatus===4" type="primary">待检测</el-tag>
            <el-tag v-if="scope.row.fundStatus===1" type="danger">数据异常</el-tag>
            <el-tag v-if="scope.row.fundStatus===2" type="primary">数据正常</el-tag>
            <el-tag v-if="scope.row.fundStatus===3" type="success">已结算</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="预结算金额" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="realAmount" label="应发金额" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="prodName" label="申请产品" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="succId" label="反馈ID" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="applyId" label="申请ID" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="createTime" label="时间" align="center">
        </el-table-column>
        <el-table-column prop="remark" label="描述" align="center" min-width="40">
        </el-table-column>
      </el-table>
      <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
      </el-pagination>
    </div>
  </template>


<script>
export default {
  name: 'reward-data',
  data () {
    let {halfMonthDay} = this.$searchDate()
    let store = this.$getStore('rechargeData')
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      custIdentifyData: {},
      searchForm: {
        workNo: '',
        realName: '',
        succId: '',
        applyId: '',
        prodName: '',
        createStartTime: store['startDate'] || halfMonthDay,
        createEndTime: '',
        rewardType: '',
        notSame: '',
        fundStatus: '',
        currentPage: 1
      },
      loading: false,
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
        url: '/store/account/fx/fxFundPool/queryFundPoolList',
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
     // 资金预结算
    preSettleHandle () {
      this.$ajax({
        url: '/store/account/fx/fxFundPool/preSettleHandle',
        loading: true,
        success: data => {
          this.searchHandle()
        }
      })
    },
    // 资金检测
    poolDataCheck () {
      this.$ajax({
        url: '/store/account/fx/fxFundPool/poolDataCheck',
        loading: true,
        success: data => {
          this.searchHandle()
        }
      })
    },
    // 资金结算
    poolDataSettle () {
      this.$ajax({
        url: '/store/account/fx/fxFundPool/poolDataSettle',
        loading: true,
        success: data => {
          this.searchHandle()
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
