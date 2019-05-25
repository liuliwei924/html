<template>
  <div class="content-box">
    <div class="header__title">授权项管理</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="index"
        label="序号"
        width="80">
      </el-table-column>

      <el-table-column
        prop="authName"
        label="授权名称">
      </el-table-column>

     <el-table-column
        prop="authType"
        label="授权类型">
      </el-table-column>
  
      <el-table-column
       prop="status"
        label="是否启用">
        <template slot-scope="scope">
          <span v-if ="scope.row.status===1">启用</span>
          <span v-if ="scope.row.status===0">不启用</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="icon"
        label="授权图标">
        <template slot-scope="scope">
          <img :src="scope.row.icon" class="gradeImg" v-if="scope.row.icon">
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="delectHandle(scope.row.authId)">删除</el-button>
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
    <authConfigInfo-add v-model="addShow" @change="addChange" />
    <authConfigInfo-edit v-model="editShow" :authConfigData="authConfigData" @change="editChange" />
  </div>
</template>

<script>
import AuthConfigInfoAdd from '@/components/product/AuthConfigInfoAdd'
import AuthConfigInfoEdit from '@/components/product/AuthConfigInfoEdit'
export default {
  name: 'authConfigInfo',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      authConfigData: {},
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
      this.authConfigData = row
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
    delectHandle (authId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/open/account/config/authConfig/deleteAuthConfig',
              data: {
                authId
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
        url: '/open/account/config/authConfig/queryAuthConfigList',
        data: {
          currentPage: this.currentPage
        },
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
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
    AuthConfigInfoAdd,
    AuthConfigInfoEdit
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
