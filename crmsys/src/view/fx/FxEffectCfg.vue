<template>
    <div class="content-box">
      <div class="header__title">我要推广配置</div>
      <!-- 查询条件 -->
      <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="推广标题" prop="title">
          <el-input v-model="searchForm.title" placeholder="请输入推广标题"></el-input>
        </el-form-item>
        <el-form-item label="海报类型" prop="type">
          <el-select v-model="searchForm.type" clearable placeholder="请选择海报类型">
            <el-option label="关联产品" value="1"></el-option>
            <el-option label="招募海报" value="2"></el-option>
            <el-option label="专属海报" value="3"></el-option>
            <el-option label="邀请办卡" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button icon="plus" @click="addHandle">添加</el-button>
      </el-form>
     </div>
      <!-- 业务操作区域 -->
      <div class="header__check">
        <el-radio-group v-model="status">
          <el-radio :label="1">海报配置</el-radio>
          <el-radio :label="2">产品详情配置</el-radio>
          <el-radio :label="3">我要推广配置</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column prop="title" label="推广名称" align="center">
        </el-table-column>
        <el-table-column prop="type" label="推广海报类型" align="center" min-width="40">
          <template slot-scope="scope">
            <span v-if ="scope.row.type===1">关联产品</span>
            <span v-if ="scope.row.type===2">招募海报</span>
            <span v-if ="scope.row.type===3">专属海报</span>
            <span v-if ="scope.row.type===4">邀请办卡</span>
          </template>
        </el-table-column>
        <el-table-column prop="effectImg" label="推广效果图" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.effectImg" class="gradeImgEffect" v-if="scope.row.effectImg" @click="alertBigImg(scope.row.effectImg)">
          </template>
        </el-table-column>
          <el-table-column prop="minImg" label="小图标" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.minImg" class="gradeImgEffect" v-if="scope.row.minImg" @click="alertBigImg(scope.row.minImg)">
          </template>
        </el-table-column>
         <el-table-column prop="indexNum" label="排序号" align="center">
        </el-table-column>
        <el-table-column
         prop="enable"
          label="是否显示" align="center">
          <template slot-scope="scope">
            <el-tag v-if ="scope.row.enable===0" type="danger">禁用</el-tag>
            <el-tag v-if ="scope.row.enable===1" type="success">开启</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
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
      <fx-effect-add v-model="addShow" @change="addChange" :prodList="prodList"/>
      <fx-effect-edit v-model="editShow" :fxProdDtlData="fxProdDtlData" @change="editChange" :prodList="prodList"/>
      <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
    </div>
  </template>
<script>
import FxEffectAdd from '@/components/fx/FxEffectAdd'
import FxEffectEdit from '@/components/fx/FxEffectEdit'
export default {
  name: 'fx-effect-cfg',
  data () {
    return {
      tableData: [],
      prodList: [],
      currentPage: 1,
      totalRecord: 1,
      fxProdDtlData: {},
      addShow: false,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      status: 3,
      searchForm: {
        title: '',
        type: '',
        currentPage: 1
      }
    }
  },
  created () {
    this.searchHandle()
    this.queryProdList()
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
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
      this.fxProdDtlData = row
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
    queryProdList () {
      this.$ajax({
        url: '/store/account/fx/fxReferer/queryProdList',
        data: {},
        success: data => {
          this.prodList = data.attr.prodList
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxPoster/queryEffectCfgList',
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
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    FxEffectAdd,
    FxEffectEdit
  }
}
</script>

<style>
  .gradeImgEffect {
    width: 64px;
    height: 64px;
    padding: 10px 88px;
    display: block;
  }
</style>

<style lang="less">
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