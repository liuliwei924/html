<template>
  <div class="content-box">
    <div class="header__title">知识库列表</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="产品名称:">
          <el-input
            v-model="searchForm.productName"
            placeholder="请输入产品名称">
          </el-input>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="product-base">
      <div>
        <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        class="product-base-input">
        </el-input>
        <el-tree :data="productMenuData" 
        :props="defaultProps"
        highlight-current
        node-key="typeId"
        :default-expanded-keys="[this.defaultTypeId]"
        ref="tree"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick">
        </el-tree>
      </div>
    </div>
    <div>
      <div class="product-item-title">
        <span class="product-item-titleName">{{productTypeName}}</span>
        <span class="product-item-line"></span>
      </div>
      <div class="product-item" v-for="item in tableData">
        <div class="product-info">
          <span class="product-name" @click="detailHandle(item.productId)">{{item.productName}}</span>
          <span class="product-time">{{item.updateTime}}</span>
          <div class="product-operator" @click="detailHandle(item.productId)">[点击详情]<span class="record-status"></span></div>
        </div>
        <span class="product-line"></span>
      </div>
    </div>
    <div class="content__page_pro">
      <el-pagination
        class="content__page fr"
        @current-change="pageHandle"
        :current-page="searchForm.currentPage"
        layout="total, prev, pager, next"
        :total="totalRecord">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'know-list',
  data () {
    return {
      tableData: [],
      productMenuData: [],
      defaultTypeId: 1,
      totalRecord: 1,
      knowTypeData: {},
      loading: false,
      productTypeName: '',
      filterText: '',
      searchForm: {
        productName: '',
        productType: '',
        currentPage: 1
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    productType (val) {
      this.productType = val
    },
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.queryProductMenu()
    this.queryMaxLevel()
  },
  methods: {
      // 查看详情
    detailHandle (productId) {
      this.$router.push({
        path: 'knowDetail',
        // 路由传递参数
        query: {
          productId: productId
        }
      })
    },
    // 过滤节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 查询最深节点，用于默认展示
    queryMaxLevel () {
      this.productMenuData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/know/knowList/queryTypeMaxLevel',
        data: this.searchForm,
        success: data => {
          this.defaultTypeId = data.attr.typeId || 1
          this.productTypeName = data.attr.typeName || ''
          this.searchForm.productType = this.defaultTypeId
          if (this.searchForm.productType) {
            this.searchHandle()
            this.searchForm.productType = ''
          }
        }
      })
    },
    queryProductMenu () {
      this.productMenuData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/user/comm/queryProductMenu',
        data: this.searchForm,
        success: data => {
          this.productMenuData = data.attr.proTypeData || []
        }
      })
    },
    // 节点点击查询
    handleNodeClick (data) {
      if (data.level === undefined) return
      this.tableData = []
      this.productTypeName = data.typeName
      this.$ajax({
        url: '/store/account/know/knowList/queryKnowList',
        data: {
          productType: data.typeId
        },
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
          // 还原默认展开
          this.defaultTypeId = 1
        }
      })
    },
    // 查询
    searchHandle () {
      this.tableData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/know/knowList/queryKnowList',
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
  }
}
</script>
<style type="text/css">
  .product-base{
    float: left;
    height: 600px;
    width: 20%;
  }
  .el-input__inner {
    height: 40px;
  }
  .product-base-input{
    height: 46px;
    display: inline-block;
  }
  .product-item-title{
    height: 46px;
    width: 100%;
    border-bottom: #eee 3px solid;
  }
  .product-item-titleName{
    margin-left: 30px;
    display:inline-block;
    margin-top:15px;
    border-left: 4px solid #6ba7d2;
    padding-left: 6px;
  }
  .product-item-line{
    height: 1px;
    width: 30%;
    display: block;
  }
  .product-base-title{
    width: 268px;
    height: 43px;
    border: #0345A7 1px solid;
    text-align: center;
    line-height: 43px;
    color: #fff;
    font-size: 14px;
    background: #2767C7;
    margin-top: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  .product-item{
    margin-top:10px;
    width: 70%;
    float: left;
  }
  .product-info{
    clear: both;
    height: 46px;
    width: 100%;
  }
  .product-name{
    clear: both;
    padding-top: 6px;
    margin-left: 50px;
    color: #555;
    text-decoration: none;
    font-family: '微软雅黑';
  }
  .product-time{
    clear: both;
    margin-right: 50px;
    color:#999;
    float: right;
  }
  .product-operator{
    clear: both;
    margin-right: 50px;
    margin-top: 8px;
    float: right;
    color:#ef7a00;
    cursor:pointer;
  }
  .product-line{
    border-bottom: #dfdfdf 1px dashed;
    height: 1px;
    width: 100%;
    display: block;
  }
  .product-name:hover
  { 
    color:#000;
    cursor:pointer;
  }
  .product-time:hover
  { 
    color:#555;
  }
  .content__page_pro{
    clear: both;
    margin-right: 12%;
  }
</style>

