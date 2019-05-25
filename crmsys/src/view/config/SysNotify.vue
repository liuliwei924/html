<template>
  <div class="content-box">
    <div class="header__title">系统通知配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="通知日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="通知日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="通知状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否滚动:">
          <el-select
            v-model="searchForm.isScroll"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in isScroll"
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
        prop="statusText"
        label="通知状态"
        min-width="60">
      </el-table-column>
      <el-table-column
        prop="isScrollText"
        label="是否滚动"
        min-width="60">
      </el-table-column>
      <el-table-column
        prop="notifyDate"
        label="通知日期"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="被通知人"
        min-width="60">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="通知门店"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="notifyText"
        label="通知内容"
        min-width="350">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
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
    <notify-add v-model="addShow" @change="addChange" :userOrgs="userOrgs"/>
    <notify-edit v-model="editShow" :sysNotifyData="sysNotifyData" :status="status" :isScroll="isScroll" @change="editChange" :userOrgs="userOrgs"/>
  </div>
</template>

<script>
import NotifyAdd from '@/components/config/SysNotifyAdd'
import NotifyEdit from '@/components/config/SysNotifyEdit'
export default {
  name: 'sys-notify',
  data () {
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('sysNotify')
    return {
      tableData: [],
      totalRecord: 1,
      sysNotifyData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        status: store['status'] || '',
        isScroll: store['isScroll'] || '',
        startDate: store['startDate'] || '',
        endDate: store['endDate'] || '',
        currentPage: 1
      },
      // 通知状态
      status: {
        1: '有效',
        2: '无效'
      },
      // 是否滚动
      isScroll: {
        1: '是',
        2: '否'
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
      },
      userOrgs// 门店数据
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
      this.sysNotifyData = row
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
              url: '/store/account/config/sysNotify/delete',
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
      this.$setStore('sysNotify', this.searchForm)
      this.$ajax({
        url: '/store/account/config/sysNotify/querySysNotify',
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
    NotifyAdd,
    NotifyEdit
  }
}
</script>

