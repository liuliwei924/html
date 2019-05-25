<template>
  <div class="content-box">
    <div class="header__title">加入群聊记录</div>
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
        <el-form-item label="群类型:">
          <el-select
            v-model="searchForm.qunType"
            clearable
            placeholder="请选择类型">
            <el-option
              v-for="val,key,index in qunType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="joinId"
        label="加群编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="customerId"
        label="客户编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="显示名称"
        min-width="80">
      </el-table-column>
       <el-table-column
        prop="inviteCode"
        label="邀请码"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="activeCode"
        label="激活码"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="加群类型"
        min-width="100">
        <template slot-scope="scope">{{qunType[scope.row.qunType]}}</template>
      </el-table-column>
      <el-table-column
        prop="qunName"
        label="加入群名"
        min-width="80">
      </el-table-column>
       <el-table-column
        prop="updateBy"
        label="修改人"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
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
    <xjJoinGroup-audit  v-model="editShow" :custData="custData" :qunTypeList="qunTypeList" @change="editChange" :qunType="qunType"/>
  </div>
</template>

<script>
import XjJoinGroupAudit from '@/components/xj/XjJoinGroupAudit'
export default {
  name: 'xj-joinGroup',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjJoinGroup')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      searchForm: {
        startDate: '' || today,
        endDate: '',
        nickNameAndTel: store['nickNameAndTel'] || '',
        qunType: store['qunType'] || '',
        currentPage: store['currentPage'] || 1
      },
      qunTypeList: [],
      // 类型
      qunType: {
        0: '微信群',
        1: 'QQ群',
        2: '币用群'
      },
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
      this.getJoinQunName(row)
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
    getJoinQunName (row) {
      this.$ajax({
        url: '/store/account/xj/xjJoinQunCfg/queryJoinQunName',
        data: {qunType: row.qunType},
        success: data => {
          this.qunTypeList = data.rows
        }
      })
    },
    // 查询
    searchHandle () {
      this.tableData = []
       // 缓存查询条件
      this.$setStore('xjJoinGroup', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjJoinGroup/queryJoinGroupList',
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
    XjJoinGroupAudit
  }
}
</script>

