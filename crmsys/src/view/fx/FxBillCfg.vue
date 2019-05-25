  <template>
    <div class="content-box">
      <div class="header__title">账单配置</div>
       <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="类型名称" prop="typeName">
          <el-select v-model="searchForm.typeId" clearable placeholder="请选择类型名称" >
            <el-option
              v-for="item, index in typeList"
              :label="item.typeName"
              :value="item.typeId"
              :key="index"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单名称" prop="iconName">
          <el-input v-model.trim="searchForm.iconName" placeholder="请输入账单名称"></el-input>
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
       <!-- 业务操作区域 -->
      <div class="header__check">
        <el-radio-group v-model="showStatus">
          <el-radio :label="1">卡种配置</el-radio>
          <el-radio :label="2">推荐配置</el-radio>
          <el-radio :label="3">佣金配置</el-radio>
          <el-radio :label="4">账单配置</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column
          prop="typeName"
          label="类型名称" align="center" min-width="45">
        </el-table-column>
        <el-table-column
          prop="iconName"
          label="账单名称" align="center">
        </el-table-column>
        <el-table-column prop="iconImg" label="账单图标" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.iconImg" class="gradeImgDtl" v-if="scope.row.iconImg" @click="alertBigImg(scope.row.iconImg)">
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="账单备注" align="center" min-width="45">
        </el-table-column>
        <el-table-column
          prop="indexNum"
          label="排序" align="center" min-width="40">
        </el-table-column>
        <el-table-column
         prop="enable"
          label="是否显示" align="center" min-width="45">
             <template slot-scope="scope">
            <el-tag v-if ="scope.row.enable===0" type="danger">不显示</el-tag>
            <el-tag v-if ="scope.row.enable===1" type="success">显示</el-tag>
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
      <fx-billcfg-add v-model="addShow" @change="addChange" :typeList="typeList"/>
      <fx-billcfg-edit v-model="editShow" :fxBillcfgData="fxBillcfgData" @change="editChange" :typeList="typeList"/>
      <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
        <div class="content">
          <img :src="bigImgUrl" alt="" class="big-img">
        </div>
      </div>
    </div>
  </template>

<script>
import FxBillcfgAdd from '@/components/fx/FxBillCfgAdd'
import FxBillcfgEdit from '@/components/fx/FxBillCfgEdit'
export default {
  name: 'fx-bill-cfg',
  data () {
    return {
      tableData: [],
      typeList: [],
      currentPage: 1,
      totalRecord: 1,
      showStatus: 4,
      fxBillcfgData: {},
      addShow: false,
      editShow: false,
      loading: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        typeId: '',
        iconName: '',
        enable: ''
      }
    }
  },
  created () {
    this.searchHandle()
    this.queryBillTypeList()
  },
  watch: {
    // 处理状态改变监听
    showStatus (val) {
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
      this.fxBillcfgData = row
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
    // 查询账单配置类型
    queryBillTypeList () {
      this.$ajax({
        url: '/store/account/fx/fxReferer/queryBillTypeList',
        data: {},
        success: data => {
          this.typeList = data.attr.typeList
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxReferer/queryFxBillList',
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
    FxBillcfgAdd,
    FxBillcfgEdit
  }
}
</script>

<style>
  .gradeImgDtl {
    width: 64px;
    height: 64px;
    padding: 10px 130px;
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