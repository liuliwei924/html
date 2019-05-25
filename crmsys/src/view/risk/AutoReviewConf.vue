<template>
  <div class="content-box">
    <div class="header__title">自动复核模板</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="checkDesc"
        label="自动复核描述"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="maxLoanAmount"
        label="最大贷款金额"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="highRiskCount"
        label="高风险规则命中数"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="middleRiskCount"
        label="中风险规则命中数"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="lowRiskCount"
        label="低风险规则命中数"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="个人评分范围"
        min-width="120">
        <template slot-scope="scope">
          <span v-if="!scope.row.scoreEnable">禁用</span>
          <span v-else>{{`${scope.row.startScore}-${scope.row.endScore}`}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <auto-review-add v-model="addShow" @change="addChange" />
    <auto-review-edit v-model="editShow" :riskData="riskData" @change="editChange" />
  </div>
</template>

<script>
import AutoReviewAdd from '@/components/risk/AutoReviewAdd'
import AutoReviewEdit from '@/components/risk/AutoReviewEdit'
export default {
  name: 'auto-review-conf',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      status: {
        0: '禁用',
        1: '启用'
      },
      riskData: {},
      addShow: false,
      editShow: false
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
      this.riskData = row
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
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/crmsys/account/config/authCheck/queryList',
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    }
  },
  components: {
    AutoReviewAdd,
    AutoReviewEdit
  }
}
</script>
