<template>
  <div class="content-box">
    <div class="header__title">产品列表</div>
      <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="产品名称" prop="prodName">
          <el-input v-model.trim="searchForm.prodName" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="prodType">
          <el-select v-model="searchForm.prodType" clearable placeholder="请选择产品类型">
            <el-option label="信用卡" value="1"></el-option>
            <el-option label="保险" value="2"></el-option>
            <el-option label="贷款" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品编号" prop="prodNo">
          <el-input v-model.trim="searchForm.prodNo" placeholder="请输入产品编号"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-select v-model="searchForm.enable" clearable placeholder="是否启用">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button icon="plus" @click="addHandle">添加</el-button>
      </el-form>
    </div>

    <el-table class="content__table" :data="tableData" border>
      <el-table-column prop="prodName" label="产品名称" align="center" min-width="90">
      </el-table-column>
      <el-table-column prop="prodId" label="产品ID" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="prodType" label="产品类型" align="center" min-width="65">
        <template slot-scope="scope">
          <span v-if="scope.row.prodType===1">信用卡</span>
          <span v-if="scope.row.prodType===2">保险</span>
          <span v-if="scope.row.prodType===3">贷款</span>
        </template>
      </el-table-column>
      <el-table-column prop="prodNo" label="产品编号" align="center" min-width="70">
      </el-table-column>
      <el-table-column prop="insType" label="保险类型" align="center" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.insType===1">健康险</span>
          <span v-if="scope.row.insType===2">意外险</span>
          <span v-if="scope.row.insType===3">寿险</span>
          <span v-if="scope.row.insType===4">团险</span>
          <span v-if="scope.row.insType===5">车险</span>
          <span v-if="scope.row.insType===6">财产险</span>
        </template>
      </el-table-column>
       <el-table-column prop="specialty" label="信用卡特性" align="center" min-width="80">
      </el-table-column>
      <el-table-column prop="creditAmount" label="贷款额度" align="center" min-width="70">
      </el-table-column>
      <el-table-column prop="rateOffRate" label="月利率" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="passRate" label="通过率" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="rewardAmount" label="产品总佣金" align="center" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.amtType===1">{{scope.row.rewardAmount}}元</span>
          <span v-if="scope.row.amtType===2">{{scope.row.rewardAmount}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="申请人数" align="center" min-width="60">
      </el-table-column>
      <el-table-column prop="indexNum" label="产品排序" align="center" min-width="60">
      </el-table-column>
      <el-table-column prop="wxFlag" label="微信是否显示" align="center" min-width="75">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.wxFlag===0" type="danger">不显示</el-tag>
          <el-tag v-if="scope.row.wxFlag===1" type="success">显示</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="是否启用" align="center" min-width="60">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable===0" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.enable===1" type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="110">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row.prodId)">编辑</el-button>
          <!-- <el-button type="text" size="small" @click="delHandle(scope.row.prodId)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
    </el-pagination>
  </div>
</template>


<script>
export default {
  name: 'fx-prod-info',
  data () {
    let currentPage = Number(this.$sessionStorage('fxProdPage') || 1)
    return {
      tableData: [],
      currentPage,
      totalRecord: 1,
      searchForm: {
        prodName: '',
        prodType: '',
        prodNo: '',
        enable: '',
        currentPage
      },
      loading: false,
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
      this.$router.push({path: 'FxProdAdd'})
    },
    // 编辑
    editHandle (prodId) {
      this.$router.push({path: 'FxProdEdit', query: {prodId: prodId}})
    },
    // 删除
    delHandle (prodId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/fx/fxProd/delProdInfo',
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
        url: '/store/account/fx/fxProd/queryProdList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 分页
    pageHandle (page) {
      this.$sessionStorage('fxProdPage', page)
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>
