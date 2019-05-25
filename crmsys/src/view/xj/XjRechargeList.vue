<template>
  <div class="content-box">
    <div class="header__title">充值记录</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="持卡人姓名" prop="holderName">
          <el-input v-model="searchForm.holderName" placeholder="请输入持卡人姓名"></el-input>
        </el-form-item>
          <!-- 交易时间 -->
        <el-form-item label="交易开始日期:" prop="tranDateStart">
          <el-date-picker v-model="searchForm.tranDateStart" type="date" editable @change="tranStartChange" :picker-options="startDateOptions" placeholder="交易开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易结束日期:" prop="tranDateEnd">
          <el-date-picker v-model="searchForm.tranDateEnd" type="date" editable @change="tranEndChange" :picker-options="endDateOptions" placeholder="交易结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button icon="plus" @click="addHandle">添加</el-button>
      </el-form>
    </div>

    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="holderName"
        label="持卡人姓名" align="center">
      </el-table-column>
      <el-table-column
        prop="tranAmt"
        label="充值金额" align="center">
      </el-table-column>
      <el-table-column prop="rechargeType" label="充值类型" align="center">
        <template slot-scope="scope">
          <span v-if ="scope.row.rechargeType==='credit'">信用卡</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fee"
        label="充值手续费" align="center">
      </el-table-column>
      <el-table-column
        prop="tranDate"
        label="交易日期" align="center">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注" align="center">
      </el-table-column>
 <!--   <el-table-column
    fixed="right"
    label="操作"
    width="160" align="center">
    <template slot-scope="scope">
      <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
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

    <recharge-add v-model="addShow" @change="addChange" />
    <recharge-edit v-model="editShow" :rechargeData="rechargeData" @change="editChange" />
  </div>
</template>

<script>
import RechargeAdd from '@/components/xj/XjCreditRechargeAdd'
// import RechargeEdit from '@/components/fx/RechargeEdit'
export default {
  name: 'rechargeData',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      rechargeData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        holderName: '',
        rechargeType: '',
        tranDateStart: '',
        tranDateEnd: '',
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
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 添加
    addHandle () {
      this.addShow = true
    },
    // 添加弹窗监听
    addChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.addShow = false
      } else {
        this.addShow = val
      }
    },
    // 编辑
    editHandle (row) {
      this.rechargeData = row
      this.editShow = true
    },
    // 编辑弹窗监听
    editChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.editShow = false
      } else {
        this.editShow = val
      }
    },
     // 导入时间
    tranStartChange (date) {
      this.searchForm.tranDateStart = date || ''
      this.searchForm.tranDateEnd = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    tranEndChange (date) {
      this.searchForm.tranDateEnd = date || ''
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/xj/rechargeData/queryRechargeList',
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
    RechargeAdd// ,
    // RechargeEdit
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
