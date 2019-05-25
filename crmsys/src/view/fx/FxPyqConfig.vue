  <template>
    <div class="content-box">
      <div class="header__title">海报详情配置</div>
       <!-- 查询条件 -->
      <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="海报类型:">
          <el-select
            v-model="searchForm.tgId"
            filterable
            clearable
            placeholder="请选择">
            <el-option
              v-for="item, index in postTgData"
              :label="item.tgId + '-' +item.typeName"
              :value="item.tgId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="海报配置类型" prop="postType">
          <el-select v-model="searchForm.postType" clearable placeholder="海报配置类型">
            <el-option label="朋友圈海报" value="1"></el-option>
            <el-option label="早晚安海报" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二维码类型:">
          <el-select
            v-model="searchForm.qrcodeType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in qrcodeType"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-select v-model="searchForm.enable" clearable placeholder="是否启用">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button icon="plus" @click="addHandle">添加</el-button>
      </el-form>
     </div>
      <!-- 业务操作区域 -->
      <div class="header__check">
        <el-radio-group v-model="status">
          <el-radio :label="1">海报大类配置</el-radio>
          <el-radio :label="2">海报详情配置</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column
          prop="typeName"
          label="海报类型" align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="海报文案" align="center">
        </el-table-column>
        <el-table-column
          prop="qrcodeType"
          label="二维码类型" align="center">
          <template slot-scope="scope">{{qrcodeType[scope.row.qrcodeType]}}</template>
        </el-table-column>
         <el-table-column
          prop="prodName"
          label="产品名称" align="center">
        </el-table-column>
        <el-table-column prop="posterBgImg" label="效果图" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.effectImg" class="gradeImg" v-if="scope.row.effectImg" @click="alertBigImg(scope.row.effectImg)">
          </template>
        </el-table-column>
        <el-table-column prop="posterBgImg" label="海报背景图" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.posterBgImg" class="gradeImg" v-if="scope.row.posterBgImg" @click="alertBigImg(scope.row.posterBgImg)">
          </template>
        </el-table-column>
        <el-table-column prop="indexNum" label="排序号" align="center">
        </el-table-column>
        <el-table-column prop="enable" label="是否启用" align="center" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enable===0" type="danger">禁用</el-tag>
            <el-tag v-if="scope.row.enable===1" type="success">启用</el-tag>
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
      <fx-pyq-poster-add v-model="addShow" @change="addChange" :prodList="prodList" :postTgData="postTgData"/>
      <fx-pyq-poster-edit v-model="editShow" :fxPosterData="fxPosterData" @change="editChange" :prodList="prodList" :postTgData="postTgData"/>
      <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
    </div>
  </template>

<script>
import FxPyqPosterAdd from '@/components/fx/FxPyqPosterAdd'
import FxPyqPosterEdit from '@/components/fx/FxPyqPosterEdit'
export default {
  name: 'fx-poster-cfg',
  data () {
    return {
      tableData: [],
      prodList: [],
      postTgData: [],
      currentPage: 1,
      totalRecord: 1,
      fxPosterData: {},
      addShow: false,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      status: 2,
      searchForm: {
        tgId: '',
        qrcodeType: '',
        postType: '',
        enable: '',
        currentPage: 1
      },
      // 二维码类型
      qrcodeType: {
        0: '无',
        1: '到落地页二维码',
        2: '到某产品二维码',
        3: '到所有产品二维码'
      }
    }
  },
  created () {
    this.searchHandle()
    this.queryProdList()
    this.queryPostTgList()
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
      this.fxPosterData = row
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
        url: '/store/account/fx/fxPyqPoster/queryProdList',
        data: {},
        success: data => {
          this.prodList = data.attr.prodList
        }
      })
    },
    queryPostTgList () {
      this.$ajax({
        url: '/store/account/fx/fxPyqPoster/queryTgPosterList',
        data: {},
        success: data => {
          this.postTgData = data.rows || []
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxPyqPoster/queryPostCfgList',
        data: this.searchForm,
        loading: true,
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
    FxPyqPosterAdd,
    FxPyqPosterEdit
  }
}
</script>

<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 48px;
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