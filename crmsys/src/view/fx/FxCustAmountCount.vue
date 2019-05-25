<template>
  <div class="content-box">
    <div class="header__title">用户佣金排行</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="用户姓名或手机号:">
          <el-input
            v-model="searchForm.searchKey"
            placeholder="请输入用户姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="实名状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item,key,index in identifyStatus"
              :label="item.name"
              :value="item.val"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户等级:">
          <el-select
            v-model="searchForm.grade"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in grade"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
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
        prop="realName"
        label="用户姓名"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="用户手机号码"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="rewardAmount"
        sortable
        label="佣金金额(元)"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="gradeName"
        label="用户等级"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="identifyStatusText"
        label="实名状态"
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
  name: 'fxCust-Amount',
  data () {
    // 缓存查询条件
    let fxCustAmount = this.$getStore('fxCustAmount')
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    return {
      tableData: [],
      totalRecord: 0,
      addShow: false,
      editShow: false,
      loading: false,
      searchForm: {
        searchKey: fxCustAmount['searchKey'] || '',
        status: fxCustAmount['status'] || '',
        orgNo: fxCustAmount['orgNo'] || '',
        grade: fxCustAmount['grade'] || '',
        orgFlag: 1,
        orderBy: '',
        orderValue: '',
        currentPage: fxCustAmount['currentPage'] || 1,
        everyPage: 10
      },
      userOrgs, // 门店数据
      // 实名状态
      identifyStatus: [
        {val: -1, name: '未实名'},
        {val: 0, name: '待审核'},
        {val: 1, name: '审核通过'},
        {val: 2, name: '审核失败'}
      ],
      // 用户等级
      grade: {
        1: '实习专员',
        2: '专员',
        3: '经理',
        4: '行长'
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
    // 查询
    searchHandle () {
      if (this.searchForm.orgNo) {
        this.searchForm.orgFlag = 1
        this.checked = true
      }
      this.tableData = []
      // 缓存查询条件
      this.$setStore('fxCustAmount', this.searchForm)
      this.$ajax({
        url: '/store/account/fx/fxCustAmountCount/queryCustAmountList',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
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
