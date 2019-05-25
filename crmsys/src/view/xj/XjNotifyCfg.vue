<template>
  <div class="content-box">
    <div class="header__title">狗窝公告配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="公告标题:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.nottifyTitle"
            placeholder="公告标题">
          </el-input>
        </el-form-item>
        <el-form-item label="公告状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择公告状态">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告类型:">
          <el-select
            v-model="searchForm.notifyType"
            clearable
            placeholder="请选择公告类型">
            <el-option
              v-for="val,key,index in notifyType"
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
        prop="notifyId"
        label="公告编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="nottifyTitle"
        label="公告标题"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="notifyText"
        label="公告内容"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="公告类型"
        min-width="100">
        <template slot-scope="scope">{{notifyType[scope.row.notifyType]}}</template>
      </el-table-column>
      <el-table-column
        label="公告状态"
        min-width="100">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始日期"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束日期"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="创建人"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.notifyId)">删除</el-button>
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
    <xjNotify-add v-model="addShow" @change="addChange" :status="status" :notifyType="notifyType"/>
    <xjNotify-edit v-model="editShow" :custData="custData" @change="editChange" :status="status" :notifyType="notifyType"/>
  </div>
</template>

<script>
import XjNotifyAdd from '@/components/xj/XjNotifyAdd'
import XjNotifyEdit from '@/components/xj/XjNotifyEdit'
export default {
  name: 'xj-notify',
  data () {
    let store = this.$getStore('xjNotifyCfg')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        typeName: store['typeName'] || '',
        status: store['status'] || '',
        notifyType: store['notifyType'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 公告状态
      status: {
        1: '有效',
        2: '失效'
      },
      // 公告类型
      notifyType: {
        1: 'APP公告',
        2: '信用卡公告'
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
    deleteHandle (notifyId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/xjNotifyCfg/deleteNotifyInfo',
              data: {
                notifyId
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
      this.$setStore('xjNotifyCfg', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjNotifyCfg/queryNotifyList',
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
    XjNotifyAdd,
    XjNotifyEdit
  }
}
</script>