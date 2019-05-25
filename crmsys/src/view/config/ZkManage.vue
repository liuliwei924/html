<template>
  <div class="content-box">
    <div class="header__title">zk列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="nodeUrl:">
          <el-input
            v-model="searchForm.likeUrl"
            placeholder="请输入nodeUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态">
            <el-option label="失联" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border>
      <el-table-column
        prop="ip"
        label="ip地址"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="port"
        label="端口号"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="nodeUrl"
        label="nodeUrl"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="nodeType"
        label="结点类型"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="serviceName"
        label="服务名称"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="serviceInterface"
        label="接口"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        min-width="110">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success">失联</el-tag>
          <el-tag v-if="scope.row.status === 1">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="创建时间"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="downTime"
        label="下线时间"
        min-width="110">
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
        likeUrl: '',
        status: '',
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
        url: '/store/account/config/zk/queryList',
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
