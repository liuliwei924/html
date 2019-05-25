<template>
  <div class="content-box">
    <div class="header__title">风险规则设置</div>
    <div class="header__control">
      <el-button icon="caret-left" class="control__back" @click="backHandle">返回</el-button>
      <el-button icon="plus" @click="editHandle">编辑</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="ruleDesc"
        label="规则描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <span class="table-rule__label">风险定级方式:</span><el-button class="table-rule__btn" :class="{1: 'table-rule__high', 2: 'table-rule__middle', 3: 'table-rule__low'}[scope.row.ruleGrade]" size="small">{{{1: '高', 2: '中', 3: '低'}[scope.row.ruleGrade]}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'risk-rule-view',
  data () {
    let typeId = this.$route.query.typeId || ''
    let typeDesc = this.$route.query.typeDesc || ''
    return {
      typeId,
      typeDesc,
      tableData: []
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 返回
    backHandle () {
      this.$router.back()
    },
    // 编辑
    editHandle () {
      this.$router.push({path: 'riskRuleEdit', query: {typeId: this.typeId, typeDesc: this.typeDesc}})
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/crmsys/account/config/riskRule/queryRuleList',
        data: {
          typeId: this.typeId
        },
        success: data => {
          this.tableData = data.rows || []
        }
      })
    }
  }
}
</script>
