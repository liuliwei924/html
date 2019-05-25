<template>
  <div class="content-box">
    <div class="header__title">任务奖励配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="任务名称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.taskName"
            placeholder="任务名称">
          </el-input>
        </el-form-item>
        <el-form-item label="任务类型:">
          <el-select
            v-model="searchForm.taskType"
            clearable
            placeholder="请选择奖励类型">
            <el-option
              v-for="val,key,index in taskType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖励类型:">
          <el-select
            v-model="searchForm.rewardType"
            clearable
            placeholder="请选择奖励类型">
            <el-option
              v-for="val,key,index in rewardType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-select
            v-model="searchForm.enable"
            clearable
            placeholder="请选择是否启用">
            <el-option
              v-for="val,key,index in enable"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="addHandle">添加</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="taskId"
        label="任务编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="taskName"
        label="任务名称"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="rewardValue"
        label="奖励值"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="rewardTerm"
        label="奖励期限(天)"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="奖励类型"
        min-width="100">
        <template slot-scope="scope">{{rewardType[scope.row.rewardType]}}</template>
      </el-table-column>
      <el-table-column
        label="展示类型"
        min-width="100">
        <template slot-scope="scope">{{showType[scope.row.showType]}}</template>
      </el-table-column>
      <el-table-column
        label="任务类型"
        min-width="100">
        <template slot-scope="scope">{{taskType[scope.row.taskType]}}</template>
      </el-table-column>
      <el-table-column
        prop="taskIndex"
        label="序号"
        min-width="50">
      </el-table-column>
      <el-table-column
        label="是否启用"
        min-width="100">
        <template slot-scope="scope">{{enable[scope.row.enable]}}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.taskId)">删除</el-button>
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
    <xjTaskCfg-add v-model="addShow" @change="addChange" :enable="enable" :rewardType="rewardType" :showType="showType" :taskType="taskType"/>
    <xjTaskCfg-edit v-model="editShow" :taskData="taskData" @change="editChange" :enable="enable" :rewardType="rewardType" :showType="showType" :taskType="taskType"/>
  </div>
</template>

<script>
import XjTaskCfgEdit from '@/components/xj/XjTaskCfgEdit'
import XjTaskCfgAdd from '@/components/xj/XjTaskCfgAdd'
export default {
  name: 'xj-cust',
  data () {
    // 缓存查询条件
    let store = this.$getStore('xjTaskCfg')
    return {
      tableData: [],
      totalRecord: 1,
      taskData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        taskName: store['taskName'] || '',
        rewardType: store['rewardType'] || '',
        enable: store['enable'] || '',
        taskType: store['taskType'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 奖励类型
      rewardType: {
        1: '长期狗粮',
        2: '魔法狗粮'
      },
      // 状态
      enable: {
        0: '禁用',
        1: '启用'
      },
      showType: {
        0: '不展示',
        1: 'App展示'
      },
      taskType: {
        1: '基础任务',
        2: '交友任务',
        3: '保险',
        4: '办卡',
        5: '信贷',
        6: '今日任务'
      },
       // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endDate = date || ''
    },
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
      this.taskData = row
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
    deleteHandle (taskId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/xjTaskCfg/deleteTaskType',
              data: {
                taskId
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
      this.$setStore('xjTaskCfg', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjTaskCfg/queryTaskTypeList',
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
    XjTaskCfgAdd,
    XjTaskCfgEdit
  }
}
</script>

