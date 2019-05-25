<template>
  <div class="content-box">
    <div class="header__title">白名单记录</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="name"
        label="姓名"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="cardNo"
        label="身份证"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="source"
        label="来源"
        min-width="120">
        <template slot-scope="scope">{{source[scope.row.source]}}</template>
      </el-table-column>
      <el-table-column
        prop="reason"
        label="原因"
        min-width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" :class="scope.row.status ? 'table__open' : 'table__close'" @click="statusHandle(scope.row)">{{scope.row.status ? '启用' : '禁用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <white-list-add v-model="addShow" :source="source" @change="addChange" />
    <white-list-edit v-model="editShow" :source="source" :whiteData="whiteData" @change="editChange" />
  </div>
</template>

<script>
import WhiteListAdd from '@/components/risk/WhiteListAdd'
import WhiteListEdit from '@/components/risk/WhiteListEdit'
export default {
  name: 'white-list',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      source: {
        1: '系统添加',
        2: '其他'
      },
      whiteData: {},
      addShow: false,
      editShow: false
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
      this.whiteData = row
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
    // 状态处理
    statusHandle (obj) {
      this.$alert(`您是否确定${obj.status ? '禁用' : '启用'}该产品?`, '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/crmsys/account/prod/prodInfo/block',
              data: {
                prodId: obj.prodId,
                status: obj.status ? 0 : 1
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
      this.$ajax({
        url: '/crmsys/account/config/nameList/queryWhiteList',
        data: {
          currentPage: this.currentPage
        },
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    WhiteListAdd,
    WhiteListEdit
  }
}
</script>
