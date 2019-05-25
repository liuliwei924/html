<template>
  <div class="content-box">
    <div class="header__title">机构管理</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="orgId"
        label="机构id"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="code"
        label="机构代号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="机构名称"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="机构类型"
        min-width="120">
        <template slot-scope="scope">{{type[scope.row.type]}}</template>
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="logo地址"
        min-width="500">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.orgId)">删除</el-button>
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
    <org-add v-model="addShow" :type="type" @change="addChange" />
    <org-edit v-model="editShow" :type="type" :orgData="orgData" @change="editChange" />
  </div>
</template>

<script>
import OrgAdd from '@/components/product/OrgAdd'
import OrgEdit from '@/components/product/OrgEdit'
export default {
  name: 'org',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      type: {
        1: '银行',
        2: '贷款机构',
        3: '其他贷款'
      },
      orgData: {},
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
      this.orgData = row
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
    deleteHandle (orgId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/crmsys/account/prod/org/delete',
              data: {
                orgId
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
        url: '/crmsys/account/prod/org/queryList',
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
    OrgAdd,
    OrgEdit
  }
}
</script>
