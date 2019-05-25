<template>
  <div class="content-box">
    <div class="header__title">产品信息</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        type="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="prodName"
        label="产品名称"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="term"
        label="借款期限"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="repayDayType"
        label="还款方式"
        min-width="120">
        <template slot-scope="scope">{{repayDayType[scope.row.repayDayType]}}</template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="120">
        <template slot-scope="scope"><span :class="!status ? 'table-col__close' : 'table-col__open'">{{status[scope.row.status]}}</span></template>
      </el-table-column>
      <el-table-column
        prop="updateBy"
        label="操作人"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="操作时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewHandle(scope.row.prodId)">查看</el-button>
          <el-button type="text" size="small" @click="editHandle(scope.row.prodId)">编辑</el-button>
          <el-button type="text" :class="scope.row.status ? 'table__open' : 'table__close'" @click="statusHandle(scope.row)">{{status[scope.row.status]}}</el-button>
          <!-- <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.orgId)">删除</el-button> -->
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
  </div>
</template>

<script>
export default {
  name: 'org',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      type: {
        1: '银行',
        2: '贷款机构',
        3: '其他贷款'
      },
      repayDayType: {
        1: '固定日期',
        2: '按放款日期'
      },
      status: {
        0: '禁用',
        1: '启用'
      },
      orgData: {},
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
      this.$router.push('prodAdd')
    },
    // 查看
    viewHandle (prodId) {
      this.$router.push({path: 'prodView', query: {prodId}})
    },
    // 编辑
    editHandle (prodId) {
      this.$router.push({path: 'prodEdit', query: {prodId}})
    },
    // 状态处理
    statusHandle (obj) {
      let status = obj.status ? 0 : 1
      this.$alert(`您是否确定${this.status[status]}该产品?`, '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/crmsys/account/prod/prodInfo/block',
              data: {
                prodId: obj.prodId,
                status
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
        url: '/crmsys/account/prod/prodInfo/queryList',
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
  }
}
</script>
