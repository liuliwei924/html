<template>
  <div class="content-box">
    <div class="header__title">赠送币冻结配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.searchKey"
            placeholder="客户姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="searchForm.sendStatus"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="val,key,index in sendStatus"
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
        prop="recordId"
        label="记录编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="显示昵称"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="frozenValue"
        label="冻结数量"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="100">
        <template slot-scope="scope">{{sendStatus[scope.row.sendStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="sendTime"
        label="解冻时间"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.recordId)">删除</el-button>
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
    <xjFrozen-add v-model="addShow" @change="addChange" :sendStatus="sendStatus"/>
    <xjFrozen-edit v-model="editShow" :frozenData="frozenData" @change="editChange" :sendStatus="sendStatus"/>
  </div>
</template>

<script>
import XjFrozenAdd from '@/components/xj/XjFrozenAdd'
import XjFrozenEdit from '@/components/xj/XjFrozenEdit'
export default {
  name: 'xj-cust',
  data () {
    // 缓存查询条件
    let store = this.$getStore('xjFrozenRecord')
    return {
      tableData: [],
      totalRecord: 1,
      frozenData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        searchKey: store['searchKey'] || '',
        sendStatus: store['sendStatus'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 状态
      sendStatus: {
        0: '未解冻',
        1: '已解冻'
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
      this.frozenData = row
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
    deleteHandle (recordId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/xjFrozenRecord/deleteFrozenRecord',
              data: {
                recordId
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
      this.$setStore('xjCustChange', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjFrozenRecord/queryFrozenRecord',
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
    XjFrozenAdd,
    XjFrozenEdit
  }
}
</script>