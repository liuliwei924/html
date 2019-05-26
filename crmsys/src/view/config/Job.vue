<template>
  <div class="content-box">
    <el-form :inline="true" :model="searchForm" class="xx-form">
      <el-form-item>
        <el-input placeholder="请输入任务名" v-model="searchForm.jobName"></el-input>
      </el-form-item>
      <el-form-item>
          <el-select v-model="searchForm.enable" :clearable="true" placeholder="请选择是否启用">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item>
        <el-button class="xx-form-btn" icon="el-icon-search" @click="searchTable(1)">查询</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="add">新增任务</el-button>
        <el-button class="filter-item" type="primary" @click="executeQuick()">立即执行</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
      <el-table-column prop="typeCode" label="任务代码" width="200"/>
      <el-table-column prop="jobName" label="任务名称" width="200"/>
      <el-table-column prop="jobDesc" label="任务描述" width="200"/>
      <el-table-column prop="enable" label="启用状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 0">禁用</el-tag>
          <el-tag type="success" v-if="scope.row.enable === 1">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="executeType" label="执行方式" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.executeType === 0">立即执行</el-tag>
          <el-tag v-if="scope.row.executeType === 1">定期执行</el-tag>
          <el-tag v-if="scope.row.executeType === 2">定期循环执行</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="recurrentValue" label="循环值" width="180"/>
      <el-table-column prop="endType" label="结束方式" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.endType === 0">无限循环</el-tag>
          <el-tag type="success" v-if="scope.row.endType === 1">设置日期</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastExeTime" label="上次执行时间" width="200"/>
      <el-table-column prop="lastExeStatus" label="上次执行状态" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.lastExeStatus === 2">运行成功</el-tag>
          <el-tag v-if="scope.row.lastExeStatus === 3">运行失败</el-tag>
          <el-tag v-if="scope.row.lastExeStatus === 4">被取消</el-tag>
          <el-tag v-if="scope.row.lastExeStatus === 5">已经过期</el-tag>
          <el-tag v-if="scope.row.lastExeStatus === 6">已经完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="jobStatus" label="当前状态" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.jobStatus === 0">等待运行</el-tag>
          <el-tag v-if="scope.row.jobStatus === 1">运行中</el-tag>
          <el-tag v-if="scope.row.jobStatus === 2">运行成功</el-tag>
          <el-tag v-if="scope.row.jobStatus === 3">运行失败</el-tag>
          <el-tag v-if="scope.row.jobStatus === 4">被取消</el-tag>
          <el-tag v-if="scope.row.jobStatus === 5">已经过期</el-tag>
          <el-tag v-if="scope.row.jobStatus === 6">已经完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑/重置</el-button>
          <el-button type="danger" size="mini" @click="executeList(scope.row)">运行记录</el-button>
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
    <edit-job :isShow="showDialog" @close="closeDialog" :jobInfo="jobInfo" :isEdit="isEdit"/>
    <show-list :isShow="showListDialog" @close="closeListDialog" :curJobId="curJobId"/>
</div>

</template>

<script>
import EditJob from '@/components/config/EditJob'
import ShowList from '@/components/config/JobShowList'
export default {
  data () {
    return {
      isEdit: false,
      showDialog: false,
      showListDialog: false,
      jobInfo: {},
      searchForm: {
        jobName: '',
        enable: ''
      },
      tableData: [],
      currentPage: 1,
      everyPage: 10,
      totalRecords: 0,
      curJobId: ''
    }
  },
  created () {
    this.searchTable(this.currentPage)
  },
  methods: {
    // 查询列表
    searchTable (currentPage) {
      this.currentPage = currentPage
      this.$ajax({
        url: '/store/account/config/job/queryList',
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
    handleCurrentChange (val) {
      this.currentRow = val
    },
    add () {
      this.isEdit = false
      this.showDialog = true
      this.jobInfo = {}
    },
    // 编辑
    edit (row) {
      this.isEdit = true
      this.showDialog = true
      this.jobInfo = row
    },
    executeQuick (obj) {
      if (!this.currentRow) {
        this.$message({message: '请先选中一条数据', type: 'warning'})
        return
      }
      if (this.currentRow.enable === 0) {
        this.$message({message: '该任务已禁用，需要执行，请先启用', type: 'warning'})
        return
      }
      this.$alert('是否立即执行[' + this.currentRow.jobName + ']?', '提示', {
        showCancelButton: true,
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.$ajax({
            url: '/store/account/config/job/executeQuick',
            data: {
              jobId: this.currentRow.jobId
            },
            success: data => {
              this.$message({message: '执行成功', type: 'success'})
            }
          })
        }
      })
    },
    // 运行记录
    executeList (row) {
      this.showListDialog = true
      this.curJobId = String(row.jobId)
    },
     // 关闭运行记录
    closeListDialog (val) {
      this.showListDialog = false
    },
    // 关闭弹窗
    closeDialog (val) {
      this.showDialog = false
      if (val === 'refresh') this.searchTable(this.currentPage)
    }
  },
  components: { EditJob, ShowList }
}
</script>
