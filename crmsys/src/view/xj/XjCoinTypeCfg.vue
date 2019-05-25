<template>
  <div class="content-box">
    <div class="header__title">活动类型配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="类型名称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.typeName"
            placeholder="类型名称">
          </el-input>
        </el-form-item>
        <el-form-item label="发放类型:">
          <el-select
            v-model="searchForm.typeKinds"
            clearable
            placeholder="请选择发放类型">
            <el-option
              v-for="val,key,index in typeKinds"
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
        prop="typeId"
        label="类型编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="类型名称"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="发放类型"
        min-width="100">
        <template slot-scope="scope">{{typeKinds[scope.row.typeKinds]}}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
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
    <xjCoinType-add v-model="addShow" @change="addChange" :typeKinds="typeKinds"/>
    <xjCoinType-edit v-model="editShow" :custData="custData" @change="editChange" :typeKinds="typeKinds"/>
  </div>
</template>

<script>
import XjCoinTypeAdd from '@/components/xj/XjCoinTypeAdd'
import XjCoinTypeEdit from '@/components/xj/XjCoinTypeEdit'
export default {
  name: 'xj-cust',
  data () {
    let store = this.$getStore('xjCoinTypeCfg')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        typeName: store['typeName'] || '',
        typeKinds: store['typeKinds'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 发放类型
      typeKinds: {
        1: '狗粮',
        2: '天狗币'
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
    deleteHandle (typeId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/xjCoinTypeCfg/deleteCoinType',
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
      this.$setStore('xjCoinTypeCfg', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjCoinTypeCfg/queryCoinTypeList',
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
    XjCoinTypeAdd,
    XjCoinTypeEdit
  }
}
</script>