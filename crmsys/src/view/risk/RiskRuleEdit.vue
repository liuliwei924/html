<template>
  <div class="content-box">
    <div class="header__title">风险规则设置</div>
    <div class="header__control">
      <el-button icon="caret-left" class="control__back" @click="backHandle">返回</el-button>
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="typeDesc"
        label="规则类别"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="ruleDesc"
        label="规则描述"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="sourceId"
        label="来源规则id"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="风险定级方式"
        min-width="200">
        <template slot-scope="scope">
          <el-button size="small" class="table-rule__btn" v-for="val,key,index in grade" :class="scope.row.ruleGrade === Number(key) && {1: 'table-rule__high', 2: 'table-rule__middle', 3: 'table-rule__low'}[scope.row.ruleGrade]" @click="gradeHandle(key, scope.row.ruleId)" :key="index">{{val}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" :class="scope.row.status ? 'table__open' : 'table__close'" @click="statusHandle(scope.row)">{{status[scope.row.status]}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <rule-add v-model="addShow" @change="addChange" :typeDesc="typeDesc" :typeId="typeId" />
    <rule-edit v-model="editShow" :ruleData="ruleData" @change="editChange" />
  </div>
</template>

<script>
import RuleAdd from '@/components/risk/RuleAdd'
import RuleEdit from '@/components/risk/RuleEdit'
export default {
  name: 'risk-rule-edit',
  data () {
    let typeId = this.$route.query.typeId || ''
    let typeDesc = this.$route.query.typeDesc || ''
    return {
      typeId,
      typeDesc,
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      grade: {
        1: '高',
        2: '中',
        3: '低'
      },
      status: {
        0: '禁用',
        1: '启用'
      },
      ruleData: {},
      addShow: false,
      editShow: false
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
      this.ruleData = row
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
    // 变更风险等级
    gradeHandle (val, ruleId) {
      this.$alert(`您是否确定设定风险等级为${this.grade[val]}?`, '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/crmsys/account/config/riskRule/updateRule',
              data: {
                ruleId,
                ruleGrade: val
              },
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 状态处理
    statusHandle (obj) {
      this.$alert(`您是否确定${obj.status ? '禁用' : '启用'}该规则?`, '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/crmsys/account/config/riskRule/updateRule',
              data: {
                ruleId: obj.ruleId,
                status: obj.status ? 0 : 1
              },
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
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
          this.totalRecord = data.page.totalRecords
        }
      })
    }
  },
  components: {
    RuleAdd,
    RuleEdit
  }
}
</script>
