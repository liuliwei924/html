<template>
  <div class="content-box">
    <div class="header__title">菜单列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="菜单级别">
          <el-select
            v-model="searchForm.level"
            filterable
            clearable
            placeholder="请选择菜单级别">
            <el-option
              v-for="val,key,index in level"
              :label="val"
              :value="key"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input
            v-model="searchForm.menuName"
            placeholder="请输入菜单名称">
          </el-input>
        </el-form-item>
        <el-form-item label="父级菜单名称">
          <el-input
            v-model="searchForm.parentMenuName"
            placeholder="请输入父级菜单名称">
          </el-input>
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
        prop="menuId"
        label="序号"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="menuCode"
        label="菜单代号"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="menuName"
        label="菜单名称"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="menuUrl"
        label="菜单URL"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="level"
        label="菜单级别"
        min-width="110">
        <template slot-scope="scope">{{level[scope.row.level]}}</template>
      </el-table-column>
      <el-table-column
        prop="parentMenuName"
        label="父级菜单名称"
        min-width="110">
      </el-table-column>
      <el-table-column
	      fixed="right"
	      label="操作"
	      width="100">
	      <template slot-scope="scope">
	        <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
	        <el-button class="table__danger" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
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
	  <menu-edit
      v-model="isShow"
      :menuData="menuData"
      :level="level"
      @change="editChange" />
	</div>
</template>

<script>
import MenuEdit from '@/components/config/MenuEdit'
// 菜单列表页面
export default {
  name: 'menu',
  data () {
    return {
      searchForm: {
        level: '',
        menuName: '',
        parentMenuName: ''
      },
      loading: false,
      tableData: [],
      totalRecord: 1,
      isShow: false,
      menuData: {},
      // 菜单级别
      level: {
        1: '主菜单',
        2: '一级子菜单',
        3: '二级子菜单'
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 编辑
    editHandle (row) {
      this.menuData = row
      this.isShow = true
    },
    // 编辑弹窗监听
    editChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.isShow = false
      } else {
        this.isShow = val
      }
    },
    // 删除
    deleteHandle (menuId) {
      this.$alert('您是否确定删除当前菜单?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/config/menu/delete',
              data: {
                menuId
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
        url: '/store/account/config/menu/queryMenuList',
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
    MenuEdit
  }
}
</script>
