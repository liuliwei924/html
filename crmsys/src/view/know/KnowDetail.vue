<template>
  <div class="content-box bgf2">
    <div class="header__title">知识库列表 -->{{productName}}</div>
    <div id="productContent" class="product_content">
      <iframe :src="streamfileUrl" width="100%" height="100%" id="iframe"></iframe>
    </div>
  </div>
</template>
<style lang="less">
  .product_content {
    background-color: #eee;
    width:80%;
    height:90%;
  }
</style>
<script>
export default {
  name: 'know-detail',
  data () {
    let query = this.$route.query
    return {
      tableData: [],
      productId: query['productId'],
      productName: query['productName'] || '',
      fileUrl: '',
      streamfileUrl: query['fileUrl'] || '',
      flag: query['flag'] || ''
    }
  },
  created () {
    if (!this.flag) {
      this.queryInfo()
    }
  },
  methods: {
    queryInfo () {
      this.$ajax({
        url: '/store/account/know/knowList/queryKnowDetail',
        data: {
          productId: this.productId
        },
        success: data => {
          this.tableData = data.rows[0] || []
          this.productName = this.tableData.productName
          this.fileUrl = this.tableData.fileUrl
          if (this.fileUrl.indexOf('.xls') !== -1) {
            this.streamfileUrl = this.fileUrl
          } else {
            this.streamfileUrl = 'https://static.xxjr.com/pdf/web/viewer.html?file=' + this.fileUrl
          }
        }
      })
    }
  }
}
</script>



