<template>
  <div class="content-box">
    <div class="header__title">知识库类型</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="类型名称:">
          <el-input
            v-model="searchForm.typeName"
            placeholder="请输入类型名称">
          </el-input>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button @click="addHandle">添加类型</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="typeId"
        label="类型编号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="类型名称"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="parentTypeName"
        label="父目录名称"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="level"
        label="级别"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.typeId)">删除</el-button>
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
    <knowType-add v-model="addShow" @change="addChange" />
    <knowType-edit v-model="editShow" :knowTypeData="knowTypeData" @change="editChange" />
  </div>
</template>

<script>
import KnowTypeAdd from '@/components/know/knowTypeAdd'
import KnowTypeEdit from '@/components/know/knowTypeEdit'
export default {
  name: 'know-type',
  data () {
    return {
      tableData: [],
      totalRecord: 1,
      knowTypeData: {},
      addShow: false,
      editShow: false,
      loading: false,
      searchForm: {
        typeName: '',
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
      this.knowTypeData = row
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
    deleteHandle (typeId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/know/knowTypeList/delProType',
              data: {
                typeId
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
        url: '/store/account/know/knowTypeList/queryProTypeList',
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
    KnowTypeAdd,
    KnowTypeEdit
  }
}
</script>

