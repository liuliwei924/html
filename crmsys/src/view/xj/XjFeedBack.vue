<template>
  <div class="content-box">
    <div class="header__title">用户反馈列表</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="创建日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="显示名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.nickNameAndTel"
            placeholder="显示名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="反馈状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择反馈状态">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否发送短信:">
          <el-select
            v-model="searchForm.isSend"
            clearable
            placeholder="请选择是否发送短信">
            <el-option
              v-for="val,key,index in isSend"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <!-- <el-button @click="addHandle">添加</el-button> -->
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="feedbackId"
        label="反馈序号"
        min-width="80">
      </el-table-column>
      <!-- <el-table-column
        prop="customerId"
        label="客户编号"
        min-width="100">
      </el-table-column> -->
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="显示名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="content"
        label="反馈内容"
        min-width="200">
      </el-table-column>
      <el-table-column
        label="反馈状态"
        min-width="100">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <!-- <el-table-column
        prop="feebackImg"
        label="图片"
        min-width="100">
      </el-table-column> -->
      <el-table-column
        label="是否发送"
        min-width="100">
        <template slot-scope="scope">{{isSend[scope.row.isSend]}}</template>
      </el-table-column>
      <el-table-column
        prop="auditDesc"
        label="处理描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="160">
      </el-table-column>
      <!-- <el-table-column
        prop="updateBy"
        label="修改人"
        min-width="150">
      </el-table-column> -->
      <el-table-column
        prop="updateTime"
        label="修改时间"
        min-width="160">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">处理</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.feedbackId)">删除</el-button>
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
    <xjFeedBack-Handel v-model="editShow" :custData="custData" @change="editChange" :status="status" :isSend="isSend"/>
  </div>
</template>

<script>
import XjFeedBackHandel from '@/components/xj/XjFeedBackHandel'
export default {
  name: 'xjFeed-back',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjFeedBack')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      searchForm: {
        startDate: '' || today,
        endDate: '',
        nickNameAndTel: store['nickNameAndTel'] || '',
        status: store['status'] || '',
        isSend: store['isSend'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 反馈状态
      status: {
        0: '待反馈',
        1: '已联系',
        2: '已解决',
        3: '无法解决'
      },
      isSend: {
        0: '否',
        1: '是'
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
    deleteHandle (feedbackId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/xjFeedBack/deleteFeedBack',
              data: {
                feedbackId
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
      this.$setStore('xjFeedBack', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjFeedBack/queryFeedBackList',
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
    XjFeedBackHandel
  }
}
</script>