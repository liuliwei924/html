<template>
  <div class="content-box">
    <div class="header__title">催收级别模板</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="levelDesc"
        label="配置描述"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="正常(逾期天数)"
        min-width="120">
        <template slot-scope="scope">{{`${scope.row.min1Day}-${scope.row.max1Day} 天`}}</template>
      </el-table-column>
      <el-table-column
        label="关注(逾期天数)"
        min-width="120">
        <template slot-scope="scope">{{`${scope.row.max1Day}-${scope.row.max2Day} 天`}}</template>
      </el-table-column>
      <el-table-column
        label="次级(逾期天数)"
        min-width="120">
        <template slot-scope="scope">{{`${scope.row.max2Day}-${scope.row.max3Day} 天`}}</template>
      </el-table-column>
      <el-table-column
        label="可疑(逾期天数)"
        min-width="120">
        <template slot-scope="scope">{{`${scope.row.max3Day}-${scope.row.max4Day} 天`}}</template>
      </el-table-column>
      <el-table-column
        label="损失"
        min-width="120">
        <template slot-scope="scope">{{`${scope.row.max4Day}天以上`}}</template>
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
    <coll-level-add v-model="addShow" @change="addChange" />
    <coll-level-edit v-model="editShow" :riskData="riskData" @change="editChange" />
  </div>
</template>

<script>
import CollLevelAdd from '@/components/risk/CollLevelAdd'
import CollLevelEdit from '@/components/risk/CollLevelEdit'
export default {
  name: 'coll-level-conf',
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
    // 状态处理
    statusHandle (obj) {
      this.$alert(`您是否确定${obj.status ? '禁用' : '启用'}该规则?`, '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/crmsys/account/config/collLevel/update',
              data: {
                levelId: obj.levelId,
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
        url: '/crmsys/account/config/collLevel/queryList',
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    }
  },
  components: {
    CollLevelAdd,
    CollLevelEdit
  }
}
</script>
