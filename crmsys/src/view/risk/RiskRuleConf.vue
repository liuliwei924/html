<template>
  <div class="content-box">
    <div class="header__title">风险规则模板</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="typeDesc"
        label="规则类型描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewHandle(scope.row.typeId, scope.row.typeDesc)">查看</el-button>
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <risk-rule-add v-model="addShow" @change="addChange" />
    <risk-rule-edit v-model="editShow" :riskData="riskData" @change="editChange" />
  </div>
</template>

<script>
import RiskRuleAdd from '@/components/risk/RiskRuleAdd'
import RiskRuleEdit from '@/components/risk/RiskRuleEdit'
export default {
  name: 'risk-rule-conf',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
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
    // 查看
    viewHandle (typeId, typeDesc) {
      this.$router.push({path: 'riskRuleView', query: {typeId, typeDesc}})
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/crmsys/account/config/riskRule/queryRiskType',
        data: {
          currentPage: this.currentPage
        },
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    RiskRuleAdd,
    RiskRuleEdit
  }
}
</script>
