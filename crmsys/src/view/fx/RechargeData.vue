<template>
  <div class="content-box">
    <div class="header__title">账户信息</div>
    <div class="header__control">
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="fxTotalAmt"
        label="分销总充值金额" align="center">
      </el-table-column>
          <el-table-column
        prop="fxAmt"
        label="分销余额" align="center">
      </el-table-column>
      <el-table-column
        prop="tjTotalAmt"
        label="推荐总充值金额" align="center">
      </el-table-column>
          <el-table-column
        prop="tjAmt"
        label="推荐余额" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'rechargeData',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/rechargeData/getRechargeAmt',
        data: {},
        success: data => {
          let arrData = []
          arrData.push(data.attr.rechargeInfo)
          this.tableData = arrData
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
  }
}
</script>

<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
</style>
