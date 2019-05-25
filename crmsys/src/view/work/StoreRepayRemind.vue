<template>
  <div class="content-box">
    <div class="header__title">还款提醒列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="客户姓名或者手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.searchKey"
            placeholder="客户姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="处理业务员姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeSearchKey"
            placeholder="处理业务员姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
            clearable
            @change="changeOrgHandle"
            placeholder="请选择门店">
            <el-option
              v-for="item,index in userOrgs"
              :label="item.orgNo + '-' + item.orgName"
              :value="item.orgId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组名:">
          <el-select
            v-model="searchForm.groupName"
            clearable
            placeholder="请选择组名">
            <el-option
              v-for="item,index in groupNameList"
              :label="item.groupName"
              :value="item.groupName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border
      @selection-change="selectChange">
      <el-table-column
        prop="applyName"
        label="客户姓名"
        min-width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="客户手机"
        min-width="130"
        align="center">
      </el-table-column>
      <el-table-column
        prop="loadInfo"
        label="贷款信息"
        min-width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="lendAmount"
        label="放款金额(元)"
        min-width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="monthPay"
        label="月供金额(元)"
        min-width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="monthPayDay"
        label="还款日期"
        min-width="200"
        align="center">
        <template slot-scope="scope">
           <el-tag type="danger">{{scope.row.monthPayDay}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="payDeadline"
        label="还款截止日期"
        min-width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="处理门店"
        min-width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="处理业务员"
        min-width="150"
        align="center">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="所属组名"
        min-width="150"
        align="center">
      </el-table-column>
      <el-table-column
        prop="teamName"
        label="所属队名"
        min-width="150"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
</template>

<script>
// 进件项目页面
export default {
  name: 'storeRepay-remind',
  data () {
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('storeRepayRemind')
    return {
      searchForm: {
        orgId: store['orgId'] || '',
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        groupName: '',
        currentPage: 1
      },
      groupNameList: [],
      loading: false,
      tableData: [],
      totalRecord: 1,
      applyId: '', // 申请ID
      isShow: false, // 弹窗是否显示
      userOrgs, // 门店数据
      orders: [] // table选中
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // table表格选择
    selectChange (arr) {
      this.orders = []
      arr.forEach(item => {
        this.orders.push({
          applyId: item['applyId']
        })
      })
    },
     // 查看详情
    detailHandle (obj) {
      let queryObj = {
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          storeSearchKey: this.searchForm.storeSearchKey,
          type: 'storeRepayRemind'
        }
      }
      let desc = obj.applyName
      if (!obj.applyName) {
        desc = obj.applyId
      }
      this.$emit('addTab', desc + '', queryObj)
      this.$router.push(queryObj)
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('storeRepayRemind', this.searchForm)
      this.$ajax({
        url: '/store/account/work/storeRepayRemind/queryRepayRemindList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 改变门店的状态
    changeOrgHandle () {
      if (this.searchForm.orgId) {
        this.getGroupList()
      } else {
        this.searchForm.groupName = ''
        this.groupNameList = []
      }
    },
    // 获取组列表
    getGroupList () {
      this.$ajax({
        url: '/store/account/user/comm/queryOrgGroupList',
        data: {
          orgId: this.searchForm.orgId,
          fullLoading: true
        },
        success: data => {
          this.groupNameList = data.rows || []
          this.searchForm.groupName = ''
        }
      })
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>