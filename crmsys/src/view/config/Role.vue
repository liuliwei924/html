<template>
  <div class="content-box">
    <div class="header__title">角色列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="角色名称:">
          <el-input
            v-model="searchForm.roleName"
            placeholder="请输入角色名称">
          </el-input>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button @click="addHandle">添加角色</el-button>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border>
      <el-table-column
        label="是否默认角色"
        min-width="110">
        <template slot-scope="scope">{{isDefault[scope.row.isDefault]}}</template>
      </el-table-column>
      <el-table-column
        label="角色类型"
        min-width="110">
        <template slot-scope="scope">{{roleType[scope.row.roleType]}}</template>
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        min-width="110">
      </el-table-column>
      <el-table-column
	      fixed="right"
	      label="操作"
	      width="170">
	      <template slot-scope="scope">
	        <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
	        <el-button type="text" size="small" @click="setRight(scope.row.roleId)">设置权限</el-button>
	        <el-button class="table__danger" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
	      </template>
	    </el-table-column>
    </el-table>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <!-- 模块组件 -->
	  <role-add
      v-model="addShow"
      :isDefault="isDefault"
      :roleType="roleType"
      @change="addChange" />
    <role-edit
      v-model="editShow"
      :roleData="roleData"
      :isDefault="isDefault"
      :roleType="roleType"
      @change="editChange" />
	</div>
</template>

<script>
import RoleAdd from '@/components/config/RoleAdd'
import RoleEdit from '@/components/config/RoleEdit'
// 角色列表页面
export default {
  name: 'role',
  data () {
    return {
      searchForm: {
        roleName: '',
        currentPage: 1
      },
      loading: false,
      tableData: [],
      totalRecord: 1,
      addShow: false,
      editShow: false,
      roleData: {},
      // 是否默认角色
      isDefault: {
        0: '否',
        1: '是'
      },
      // 角色类型
      roleType: {
        1: '管理员',
        2: '用户'
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
      this.roleData = row
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
    // 设置权限
    setRight (roleId) {
      this.$router.push({
        path: 'configRight',
        query: {roleId}
      })
    },
    // 删除
    deleteHandle (roleId) {
      this.$alert('您是否确定删除当前角色?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/config/role/delRole',
              data: {
                roleId
              },
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.$ajax({
        url: '/store/account/config/role/queryRoleList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    RoleEdit,
    RoleAdd
  }
}
</script>
