<template>
  <div class="content-box">
    <div class="header__title">等级配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="等级名称:">
          <el-input
            v-model="searchForm.gradeName"
            placeholder="请输入能力等级名称">
          </el-input>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button @click="addHandle">添加等级</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="gradeCode"
        label="能力等级编号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="gradeName"
        label="能力等级名称"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="baseCount"
        label="基本分单数量"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="maxCount"
        label="最多分单数量/天"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="maxAgainCount"
        label="最多再分配单数量/天"
        min-width="165">
      </el-table-column>
      <el-table-column
        prop="dealCount"
        label="处理中笔数"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="lockCount"
        label="可锁定单量"
        min-width="150">
      </el-table-column>
      </el-table-column>
      <el-table-column
        prop="visitCount"
        label="已上门单数/天"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="sucCount"
        label="成功签单数/天"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="backAmount"
        label="回款金额/天"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="backCount"
        label="回款笔数/天"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="allotNewCount"
        label="分配新单总数"
        min-width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.rankId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <rankConf-add v-model="addShow" @change="addChange" />
    <rankConf-edit v-model="editShow" :rankConfData="rankConfData" @change="editChange" />
  </div>
</template>

<script>
import RankConfAdd from '@/components/config/RankConfAdd'
import RankConfEdit from '@/components/config/RankConfEdit'
export default {
  name: 'rank-conf',
  data () {
    return {
      tableData: [],
      totalRecord: 1,
      rankConfData: {},
      addShow: false,
      editShow: false,
      loading: false,
      searchForm: {
        gradeName: '',
        currentPage: 1
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
      this.rankConfData = row
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
    // 删除
    deleteHandle (rankId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/config/rankConf/delete',
              data: {
                rankId
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
      this.tableData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/config/rankConf/queryRankConf',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    RankConfAdd,
    RankConfEdit
  }
}
</script>

