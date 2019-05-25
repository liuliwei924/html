<template>
  <div class="content-box">
    <div class="header__title">门店佣金排行</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgNo"
            filterable
            clearable
            placeholder="请选择门店">
            <el-option
              v-for="item,index in userOrgs"
              :label="item.orgNo + '-' + item.orgName"
              :value="item.orgNo"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
     <div class="header__check">
      <el-checkbox v-model="checked">包含总部</el-checkbox>
    </div>
    <el-table class="content__table" 
      :data="tableData" 
      @sort-change="sortEvent"
      border>
      <el-table-column
        type="index"
        width="80"
        label="排名">
      </el-table-column>
      <el-table-column
        prop="totalRewardAmount"
        label="佣金金额(元)"
        sortable
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="门店名称"
        align="center"
        min-width="120">
      </el-table-column>
    </el-table>
     <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      @size-change="handleSizeChange"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="searchForm.everyPage"
      layout="total, sizes, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
  </div>
</template>

<script>
export default {
  name: 'fxOrg-Amount',
  data () {
    // 缓存查询条件
    let fxOrgAmount = this.$getStore('fxOrgAmount')
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    return {
      tableData: [],
      totalRecord: 0,
      addShow: false,
      editShow: false,
      loading: false,
      userOrgs, // 门店数据
      searchForm: {
        orgNo: fxOrgAmount['orgNo'] || '',
        orderBy: '',
        orderValue: '',
        orgFlag: 1,
        currentPage: fxOrgAmount['currentPage'] || 1,
        everyPage: 10
      },
      checked: true
    }
  },
  created () {
    this.searchHandle()
  },
  watch: {
    checked (val) {
      if (val) {
        this.searchForm.orgFlag = 1
      } else {
        this.searchForm.orgFlag = ''
      }
      this.searchHandle()
    }
  },
  methods: {
    sortEvent (column) {
      if (column.prop === null) {
        if (this.searchForm.hasOwnProperty('orderBy')) { delete this.searchForm['orderBy'] }
        if (this.searchForm.hasOwnProperty('orderValue')) { delete this.searchForm['orderValue'] }
      } else {
        this.searchForm.orderBy = column.prop
        this.searchForm.orderValue = column.order === 'ascending' ? 'asc' : 'desc'
      }
      this.searchHandle()
    },
    // 查询
    searchHandle () {
      if (this.searchForm.orgNo) {
        this.searchForm.orgFlag = 1
        this.checked = true
      }
      this.tableData = []
      // 缓存查询条件
      this.$setStore('fxOrgAmount', this.searchForm)
      this.$ajax({
        url: '/store/account/fx/fxOrgAmountCount/queryOrgAmountList',
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
    },
    handleSizeChange (val) {
      this.searchForm['everyPage'] = val
      this.searchForm.currentPage = 1
      this.searchHandle()
    }
  }
}
</script>
