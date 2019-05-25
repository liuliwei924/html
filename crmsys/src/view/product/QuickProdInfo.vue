<template>
  <div class="content-box">
    <div class="header__title">链接产品配置</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
      <!--  <el-button @click="switchType(1)" :class="{control__back : type===2}">api类型</el-button>
     <el-button @click="switchType(2)" :class="{control__back : type===1}">链接类型</el-button> -->
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column prop="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="prodName" label="产品名称" min-width="120">
      </el-table-column>
      <el-table-column prop="prodDesc" label="产品标语" min-width="120">
      </el-table-column>
      <el-table-column label="贷款金额" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.minAmount">{{scope.row.minAmount}}-{{scope.row.maxAmount}}元</span>
        </template>
      </el-table-column>
      <el-table-column label="贷款期限" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.minDeadline">{{scope.row.minDeadline}}-{{scope.row.maxDeadline}}{{deadlineUnit[scope.row.deadlineUnit]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="minLoanTime" label="最快放贷时间" min-width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row.prodId)">编辑</el-button>
          <el-button type="text" size="small" @click="delectHandle(scope.row.prodId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
    </el-pagination>
  </div>
</template>


<script>
export default {
  name: 'quick-prod-info',
  data () {
    let prodType = this.$route.query.prodType || 1
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      deadlineUnit: {
        1: '天',
        2: '月'
      },
      type: prodType,
      orgData: {},
      addShow: false,
      editShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 切换产品类型
    switchType (num) {
      this.type = num
      this.searchHandle()
    },
    // 添加
    addHandle () {
      // if (this.type === 1) {
      //   this.$router.push({path: 'LoanProdApiAdd', query: {prodType: this.type}})
      // }
      // if (this.type === 2) {
      //   this.$router.push({path: 'LoanProdLinkAdd', query: {prodType: this.type}})
      // }
      this.$router.push({path: 'LoanProdLinkAdd', query: {prodType: 2}})
    },
    // 编辑
    editHandle (Id) {
      // if (this.type === 1) {
      //   this.$router.push({path: 'LoanProdApiEdit', query: {prodId: Id, prodType: this.type}})
      // }
      // if (this.type === 2) {
      //   this.$router.push({path: 'LoanProdLinkEdit', query: {prodId: Id, prodType: this.type}})
      // }
      this.$router.push({path: 'LoanProdLinkEdit', query: {prodId: Id, prodType: 2}})
    },
    // 删除
    delectHandle (prodId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: 'open/account/prod/prodInfo/deleteProdInfo',
              data: {
                prodId
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
        url: '/open/account/prod/prodInfo/queryProdInfoList',
        data: {
          currentPage: this.currentPage,
          type: 2
        },
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.currentPage = page
      this.searchHandle()
    }
  }
}
</script>
