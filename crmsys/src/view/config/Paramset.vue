<template>
  <div class="content-box">
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item
          label="系统Key:">
          <el-input placeholder="系统Key" v-model="searchForm.paramCode" style="width: 200px;"/>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchTable(1)">查询
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="add">新增系统参数</el-button>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="paramCode" label="系统Key" width="220"/>
      <el-table-column prop="paramValue" label="系统值" width="220"/>
      <el-table-column prop="paramName" label="描述" width="220"/>
      <el-table-column prop="createTime" label="创建时间" width="200"/>
      <el-table-column prop="updateTime" label="修改时间" width="200"/>
      <el-table-column prop="updateBy" label="最后修改人" width="150"/>
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteParams(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="searchTable"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="everyPage"
      layout="total, sizes, prev, pager, next"
      :total="totalRecords">
    </el-pagination>
    <edit-sys-params :isShow="showDialog" @close="closeDialog" :sysParamsInfo="sysParamsInfo" :isEdit="isEdit"/>
</div>

</template>

<script>
import EditSysParams from '@/components/config/EditSysParams'
export default {
  data () {
    return {
      isEdit: false,
      showDialog: false,
      sysParamsInfo: {},
      searchForm: {
        paramCode: ''
      },
      tableData: [],
      currentPage: 1,
      everyPage: 10,
      totalRecords: 0
    }
  },
  created () {
    this.searchTable(this.currentPage)
  },
  methods: {
    // 查询列表
    searchTable (currentPage) {
      console.log('searchTable')
      this.currentPage = currentPage
      this.$ajax({
        url: '/store/account/config/paramset/queryList',
        data: {
          currentPage,
          everyPage: this.everyPage,
          ...this.searchForm
        },
        success: data => {
          this.tableData = data.rows
          this.totalRecords = data.page.totalRecords
        }
      })
    },
    // 每页几条
    handleSizeChange (val) {
      this.everyPage = val
      this.searchTable(1)
    },
    add () {
      this.isEdit = false
      this.showDialog = true
      this.sysParamsInfo = {}
    },
    // 编辑
    edit (row) {
      this.isEdit = true
      this.showDialog = true
      this.sysParamsInfo = row
    },
    // 删除
    deleteParams (obj) {
      this.$alert('是否确定删除该系统参数?', '提示', {
        showCancelButton: true,
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.$ajax({
            url: '/store/account/config/paramset/delete',
            data: {
              paramCode: obj.paramCode
            },
            success: data => {
              this.$message({message: '删除成功', type: 'success'})
              this.searchTable(this.currentPage)
            }
          })
        }
      })
    },
    // 关 闭弹窗
    closeDialog (val) {
      this.showDialog = false
      if (val === 'refresh') this.searchTable(this.currentPage)
    }
  },
  components: { EditSysParams }
}
</script>
