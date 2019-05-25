<template>
  <div class="content-box">
    <div class="header__title">游戏奖励配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="名次:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.ranking"
            placeholder="类型名称">
          </el-input>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="addHandle">添加</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="id"
        label="编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="ranking"
        label="名次"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="reward"
        label="奖励"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="indexOrder"
        label="排序"
        min-width="130">
      </el-table-column>
       <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <xjGameRew-add v-model="addShow" @change="addChange"/>
    <xjGameRew-edit v-model="editShow" :custData="custData" @change="editChange"/>
  </div>
</template>

<script>
import XjGameRewAdd from '@/components/xj/XjGameRewAdd'
import XjGameRewEdit from '@/components/xj/XjGameRewEdit'
export default {
  name: 'xj-game',
  data () {
    let store = this.$getStore('xjGameRewCfg')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        ranking: store['ranking'] || '',
        currentPage: store['currentPage'] || 1
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
      this.custData = row
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
    deleteHandle (id) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/xjGameRewCfg/deleteGameRew',
              data: {
                id
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
      this.$setStore('xjGameRewCfg', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjGameRewCfg/queryGameRewList',
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
    XjGameRewAdd,
    XjGameRewEdit
  }
}
</script>