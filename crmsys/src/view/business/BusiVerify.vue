<template>
  <div class="content-box bgf2">
    <div class="header__title">审核处理</div>
    <div class="record-content input-content verify-content">
      <!-- 表单 -->
      <el-form :model="checkForm"label-width="30%">
        <div class="clearfix">
          <el-form-item label="贷款金额" prop="applyAmount" :rules="{type: 'number', required: true, message: '贷款金额不能为空且为数字', trigger: 'blur'}">
            <el-input v-model.number="checkForm.applyAmount" placeholder="请输入贷款金额" @blur="rateHandle">
              <template slot="append">万元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="贷款利率" prop="loanRate">
              <span>{{checkForm.loanRate}}%</span>
          </el-form-item>
          <el-form-item label="贷款期限" prop="deadline" :rules="{required: true, message: '贷款金额不能为空且为数字'}">
            <el-select v-model.munber="checkForm.deadline" placeholder="请选择贷款期限" @change="rateHandle">
              <el-option
                v-for="item,key,index in deadlineList"
                :label="item"
                :value="Number(key)"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="贷款利率" prop="loanRate" :rules="{required: true, message: '贷款利率不能为空且为数字', trigger: 'blur'}">
            <el-input v-model="checkForm.loanRate" placeholder="请输入贷款利率" @blur="rateHandle">
              <template slot="append">%</template>
            </el-input>
          </el-form-item> -->
        </div>
        <div class="pay-type clearfix">
          <el-form-item label="还款方式" prop="repayType">
            <el-radio-group v-model.munber="checkForm.repayType" @change="rateHandle">
              <el-radio
                v-for="item,key,index in repayTypes" v-model.number="checkForm.repayType"
                :label="Number(key)"
                :key="index">
                {{item}}
              </el-radio>
            </el-radio-group>
            <span class="desc-extra-text" v-if="checkForm.repayType === 1">（每月还款金额{{checkForm.monRepAmo}}元）</span>
            <span class="desc-extra-text" v-else-if="checkForm.repayType === 2">
              （第一个月还款金额{{checkForm.firMonRepAmo}}元,每月递减金额{{checkForm.monCutAmo}}元）
            </span>
          </el-form-item>
        </div>
        <div class="textarea-type clearfix">
          <el-form-item label="复核描述">
            <el-input
              type="textarea"
              :rows="3"
              resize="none"
              placeholder="请输入复核描述"
              v-model="checkForm.reviewDes">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="record-content-ctrl">
        <el-button class="confirm__btn" @click="chekcReview(1)">通过</el-button>
        <el-button class="confirm__btn" @click="chekcReview(2)">不通过</el-button>
        <el-button class="confirm__btn" @click="chekcReview(3)">退回</el-button>
      </div>
    </div>
    <el-table
      class="content__table table__gap"
      :data="tableData"
      border
      v-loading="loading"
      element-loading-text="拼命加载中">
      <el-table-column
        prop="reviewType"
        label="复核类型"
        width="100">
        <template slot-scope="scope">{{reviewType[scope.row.reviewType]}}</template>
      </el-table-column>
      <el-table-column
        prop="reviewDate"
        label="复核时间"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="reviewStatus"
        label="复核状态"
        min-width="100">
        <template slot-scope="scope">{{reviewStatus[scope.row.reviewStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        label="申请金额(万元)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="loanDeadline"
        label="贷款期限(月)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="repayType"
        label="还款方式"
        min-width="120">
        <template slot-scope="scope">{{repayTypes[scope.row.repayType]}}</template>
      </el-table-column>
      <el-table-column
        prop="monRepAmo"
        label="每月还款金额(元)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="firMonRepAmo"
        label="第一个月还款金额(元)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="monCutAmo"
        label="每月递减金额(元)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="reviewDes"
        label="复核描述"
        min-width="150">
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
// 审核处理
export default {
  name: 'busi-verify',
  data () {
    return {
      loading: false,
      reviewType: {
        0: '系统',
        1: '人工'
      },
      reviewStatus: {
        0: '通过',
        1: '不通过',
        2: '退回'
      },
      checkForm: {
        repayType: 1,
        checkStatus: '',
        applyId: this.$route.query.applyId || '',
        applyAmount: '',
        reviewDes: '',
        deadline: '',
        monRepAmo: '',
        firMonRepAmo: '',
        loanRate: ''
      },
      deadlineList: {
        12: '12个月',
        24: '24个月',
        36: '36个月'
      },
      tableData: [],
      totalRecord: 1,
      currentPage: 1,
      flag: true,
      type: this.$route.query.type || '',
      repayTypes: {
        1: '等额本息',
        2: '等额本金'
      },
      prodId: ''
    }
  },
  created () {
    if (!this.flag) return
    this.flag = false
    this.searchApplyInfo()// 要在第一位,要拿一些申请信息
    this.searchHandle()
  },
  methods: {
    // 查询审核记录
    searchHandle () {
      this.$ajax({
        url: '/crmsys/account/user/custInfo/queryRecord',
        data: {applyId: this.checkForm.applyId},
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 通过处理
    chekcReview (status) {
      this.checkForm.checkStatus = status
      // this.checkForm['status'] = status
      this.checkForm['prodId'] = this.prodId
      this.$ajax({
        url: '/crmsys/account/busi/' + this.type + '/checkReview',
        data: this.checkForm,
        success: data => {
          history.back()
        }
      })
    },
    // 获取贷款利率处理
    rateHandle () {
      this.$ajax({
        url: '/crmsys/account/busi/' + this.type + '/queryLoanRate',
        data: {
          prodId: this.prodId, deadline: this.checkForm['deadline']
        },
        success: data => {
          this.checkForm['loanRate'] = data.attr['rate']
          this.searchInterestInfo()
        }
      })
    },
    searchInterestInfo () {
      this.$ajax({
        url: '/crmsys/account/busi/' + this.type + '/queryInterestInfo',
        data: {
          repayType: this.checkForm['repayType'],
          loanDeadline: this.checkForm['deadline'],
          loanAmount: this.checkForm['applyAmount'],
          prodId: this.prodId,
          loanRate: this.checkForm['loanRate']
        },
        success: data => {
          if (this.checkForm['repayType'] === 1) {
            this.checkForm['monRepAmo'] = data.attr.loanDetail['monRepAmo'] || ''
          } else {
            this.checkForm['monCutAmo'] = data.attr.loanDetail['monCutAmo'] || ''
            this.checkForm['firMonRepAmo'] = data.attr.loanDetail['firMonRepAmo'] || ''
          }
        }
      })
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    },
    searchApplyInfo () {
      this.$ajax({
        url: '/crmsys/account/user/custInfo/queryApplyInfo',
        data: {applyId: this.checkForm.applyId},
        success: data => {
          let applyInfo = data.rows[0]
          this.checkForm['applyAmount'] = applyInfo['applyAmount']
          this.checkForm['deadline'] = applyInfo['deadline']
          this.checkForm['repayType'] = applyInfo['repayType']
          this.prodId = applyInfo['prodId']
          /* this.rateHandle() */
        }
      })
    }
  }
}
</script>
