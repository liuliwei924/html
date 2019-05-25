<template>
  <div class="content-box">
    <div class="header__title">竞拍库存配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="物品名称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.auctionName"
            placeholder="物品名称">
          </el-input>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="addHandle">添加</el-button>
        <el-button @click="exportData()"  class="export-btn">导出</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="inventoryId"
        label="库存编号"
        min-width="50">
      </el-table-column>
      <el-table-column
        prop="auctionName"
        label="物品名称"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="inventory"
        label="剩余库存"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="number"
        label="采购数量"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="price"
        label="采购价格"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="grossPrice"
        label="总价格"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="purchaseTime"
        label="采购时间"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="deliveryTime"
        label="收货时间"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
           <!-- <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.auctionId)">删除</el-button> -->
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
    <xjAuction-add v-model="addShow" @change="addChange"/>
    <xjAuction-edit v-model="editShow" :custData="custData" @change="editChange"/>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
    <!-- 导出 -->
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
          <input type="text" name="exportParams" v-model="exportParams">
          <input type="text" name="exportTitles" v-model="exportTitles">
          <input type="text" name="signId" v-model="signId">
          <input type="text" name="exportType" value="xjAuctionInventory">
    </form>
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
import XjAuctionAdd from '@/components/xj/XjAuctionInventoryAdd'
import XjAuctionEdit from '@/components/xj/XjAuctionInventoryEdit'
export default {
  name: 'xj-auctionCfg',
  data () {
    // 缓存查询条件
    let store = this.$getStore('xjAuctionInventory')
    return {
      exportPath: this.$baseURL + 'store/account/user/xj/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      tableData: [],
      totalRecord: 1,
      custData: {},
      addShow: false,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        auctionName: store['auctionName'] || '',
        currentPage: store['currentPage'] || 1
      },
       // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
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
    // 海报图放大处理
    alertBigImg (url) {
      this.bigImgUrl = url
      this.isBigImg = true
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
    deleteHandle (auctionId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/xjAuctionInventory/deleteInventoryInfo',
              data: {
                auctionId
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
      this.$setStore('xjAuctionCfg', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjAuctionInventory/queryInventoryList',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    exportData () {
      let params = {}
      let roleType = this.$localStorage('userRole')
      Object.assign(params, this.searchForm, {
        roleType
      })
      this.exportParams = JSON.stringify(params)

      this.signId = expireStore('signId')
      let title = [
        {'name': 'inventoryId', 'title': '库存编号'},
        {'name': 'auctionName', 'title': '物品名称'},
        {'name': 'inventory', 'title': '剩余库存'},
        {'name': 'number', 'title': '采购数量'},
        {'name': 'price', 'title': '采购价格'},
        {'name': 'grossPrice', 'title': '总价格'},
        {'name': 'purchaseTime', 'title': '采购时间'},
        {'name': 'deliveryTime', 'title': '收货时间'},
        {'name': 'remark', 'title': '备注'},
        {'name': 'createTime', 'title': '创建时间'}
      ]
      this.exportTitles = JSON.stringify(title)
      let formDom = document.getElementById('JS-form-export')
      window.setTimeout(function () {
        formDom.submit()
      }, 100)
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    XjAuctionAdd,
    XjAuctionEdit
  }
}
</script>

<style lang="less">
.gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0 0 0px;
    display: block;
}
.alertImg-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,0.8);
  z-index: 2000;
  .content{
    width: 1000px;
    height: 600px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .big-img{
      height: 100%;
    }
  }
}
.input-wrapp{
  padding-left: 20px;
  margin-bottom: 10px;
  input{
    height: 30px;
    width: 200px;
  }
}
.exam-wrap{
  // overflow: hidden;
}
.exam-w{
  float: left;
  width:350px;
  border: 1px solid #dcdcdc;
  margin: 20px;
  position: relative;
  .no-info{
    position: absolute;
    width: 120px;
    top: 120px;
    right: 40px;
  }
  .tit{
    padding-left: 20px;
    color: white;
    line-height: 40px;
  }
  .color1{
    background: #5FBAD1;
  }
  .color2{
    background: #E6986E;
  }
  .color3{
    background: #CBBB92;
  }
  .info{
    overflow: hidden;
  }
  .img-w{
    padding: 10px;
    width: 130px;
    height: 130px;
    float: left;
    overflow: hidden;
    img{
      width: 100%
    }
  }
  .status{
    text-align: center;
    font-size: 20px;
    width: 200px;
    float: right;
    padding-top: 50px;
  }
  .statu0{
    color: #539cd2;
  }
  .statu1{
    color: green;
  }
  .statu2{
    color: #F53C44;
  }
  .p{
    padding-left: 20px;
    margin:10px 0;
  }
  .btn-w{
    margin: 10px 0;
    padding-left: 85px;
    button{
      border:none;
      border-radius: 0;
      color: white;
    }
  }
  .btn-l{
    background: #53BF8A;
  }
  .btn-r{
    background: #F53C44;
  }
}
.three-pic{
  overflow: hidden;
  .pic-w{
    width: 100px;
    float: left;
    margin-left: 10px;
    h3{
      text-align: center;
    }
    img{
      width: 100%;
    }
  }
}
</style>