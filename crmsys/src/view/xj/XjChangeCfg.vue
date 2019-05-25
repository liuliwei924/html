<template>
  <div class="content-box">
    <div class="header__title">兑换项目配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="项目名:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.name"
            placeholder="项目名">
          </el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位:">
          <el-select
            v-model="searchForm.changeUnit"
            clearable
            placeholder="请选择单位">
            <el-option
              v-for="val,key,index in changeUnit"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select
            v-model="searchForm.typeId"
            clearable
            placeholder="请选择类型">
            <el-option
              v-for="val,key,index in typeNameList"
              :label="val.typeName"
              :value="Number(val.typeId)"
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
        prop="changeId"
        label="项目编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="项目名"
        min-width="80">
      </el-table-column>
      <el-table-column prop="imgUrl" label="项目图标" align="center" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" class="gradeImg" v-if="scope.row.imgUrl" @click="alertBigImg(scope.row.imgUrl)">
        </template>
      </el-table-column>
      <el-table-column prop="detailImgUrl" label="详情图标" align="center" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.detailImgUrl" class="gradeImg" v-if="scope.row.detailImgUrl" @click="alertBigImg(scope.row.detailImgUrl)">
        </template>
      </el-table-column>
      <el-table-column
        prop="changePrice"
        label="单价"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="单位"
        min-width="100">
        <template slot-scope="scope">{{changeUnit[scope.row.changeUnit]}}</template>
      </el-table-column>
      <el-table-column
        prop="changeValue"
        label="交换实物值"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="changeDesc"
        label="简要描述"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="priceDesc"
        label="当前价描述"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="orderIndex"
        label="排序值"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="类型名称"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="80">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="countValue"
        label="参与人数"
        min-width="80">
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
    <xjChange-add v-model="addShow" @change="addChange" :status="status" :changeUnit="changeUnit" :typeNameList="typeNameList"/>
    <xjChange-edit v-model="editShow" :custData="custData" @change="editChange" :status="status" :changeUnit="changeUnit" :typeNameList="typeNameList"/>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </div>
</template>

<script>
import XjChangeAdd from '@/components/xj/XjChangeAdd'
import XjChangeEdit from '@/components/xj/XjChangeEdit'
export default {
  name: 'xj-change',
  data () {
    // 缓存查询条件
    let store = this.$getStore('xjChangeCfg')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      addShow: false,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        name: store['name'] || '',
        status: store['status'] || '',
        changeUnit: store['changeUnit'] || '',
        currentPage: store['currentPage'] || 1
      },
      typeNameList: [],
      // 状态
      status: {
        0: '禁用',
        1: '正常'
      },
      // 单位
      changeUnit: {
        1: 'TGB',
        2: '幸运币'
      }
    }
  },
  created () {
    this.searchHandle()
    this.getTypeName()
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
    getTypeName () {
      this.$ajax({
        url: '/store/account/xj/xjReceive/queryTypeName',
        success: data => {
          this.typeNameList = data.attr['typeNameList']
        }
      })
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('xjChangeCfg', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjChangeCfg/queryChangeList',
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
    XjChangeAdd,
    XjChangeEdit
  }
}
</script>

<style lang="less">
.gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0 0 20px;
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