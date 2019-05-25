<template>
  <div class="content-box">
    <div class="header__title">产品列表</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="产品名称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.prodName"
            placeholder="产品名称">
          </el-input>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-select
            v-model="searchForm.enable"
            clearable
            placeholder="请选择是否启用">
            <el-option
              v-for="val,key,index in enable"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="addHandle">添加</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="prodId"
        label="产品ID"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="prodName"
        label="产品名称"
        min-width="80">
      </el-table-column>
      <el-table-column prop="prodImg" label="产品图片" align="center" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.prodImg" class="gradeImg" v-if="scope.row.prodImg" @click="alertBigImg(scope.row.prodImg)">
        </template>
      </el-table-column>
      <el-table-column prop="minProdImg" label="小图片" align="center" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.minProdImg" class="gradeImg" v-if="scope.row.minProdImg" @click="alertBigImg(scope.row.minProdImg)">
        </template>
      </el-table-column>
      <el-table-column
        prop="applyNum"
        label="申请人数"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="specialty"
        label="信用卡特性"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="prodDesc"
        label="产品描述"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="indexNum"
        label="产品排序"
        min-width="100">
      </el-table-column>
      <el-table-column prop="enable" label="是否启用" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable===0" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.enable===1" type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
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
    <xjCreditProd-add v-model="addShow" @change="addChange" :enable="enable"/>
    <xjCreditProd-edit v-model="editShow" :custData="custData" @change="editChange" :enable="enable"/>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </div>
</template>

<script>
import XjCreditProdAdd from '@/components/xj/XjCreditProdAdd'
import XjCreditProdEdit from '@/components/xj/XjCreditProdEdit'
export default {
  name: 'xj-credit-prod',
  data () {
    // 缓存查询条件
    let store = this.$getStore('xjCreditProd')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      addShow: false,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        prodName: store['prodName'] || '',
        enable: store['enable'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 状态
      enable: {
        0: '禁用',
        1: '启用'
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
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
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('xjCreditProd', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjCreditProd/queryProdList',
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
  },
  components: {
    XjCreditProdAdd,
    XjCreditProdEdit
  }
}
</script>

<style lang="less">
.gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0 0 30px;
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