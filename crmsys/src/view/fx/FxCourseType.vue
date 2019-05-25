  <template>
    <div class="content-box">
      <div class="header__title">课程类型</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm" ref="searchForm">
         <el-form-item label="课程名称" prop="typeName">
          <el-input 
            v-model.trim="searchForm.typeName" 
            placeholder="请输入课程名称">
          </el-input>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-select
            v-model="searchForm.enable"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in enable"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        </el-form>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button icon="plus" @click="addHandle">添加</el-button>
      </div>
      <!-- 业务操作区域 -->
      <div class="header__check">
        <el-radio-group v-model="status">
          <el-radio :label="1">课程类型</el-radio>
          <el-radio :label="2">课程配置</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column
          prop="typeId"
          label="类型Id"
          width="80" align="center">
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="类型名称" align="center">
        </el-table-column>
        <el-table-column prop="bjImg" label="背景图" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.bjImg" class="gradeImgDtl" v-if="scope.row.bjImg" @click="alertBigImg(scope.row.bjImg)">
          </template>
        </el-table-column> 
        <el-table-column
          prop="remark"
          label="描述" align="center">
        </el-table-column>
         <el-table-column
          prop="indexNum"
          label="排序" align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间" align="center">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间" align="center">
        </el-table-column>
        <el-table-column
         prop="enable"
          label="是否开启" align="center">
          <template slot-scope="scope">
            <el-tag v-if ="scope.row.enable===0" type="danger">禁用</el-tag>
            <el-tag v-if ="scope.row.enable===1" type="success">开启</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100" align="center">
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
      <fxCourseType-add v-model="addShow" @change="addChange" />
      <fxCourseType-edit v-model="editShow" :fxCourseTypeData="fxCourseTypeData" @change="editChange" />
      <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
        <div class="content">
          <img :src="bigImgUrl" alt="" class="big-img">
        </div>
      </div>
    </div>
  </template>

<script>
import FxCourseTypeAdd from '@/components/fx/FxCourseTypeAdd'
import FxCourseTypeEdit from '@/components/fx/FxCourseTypeEdit'
export default {
  name: 'fxCourser-type',
  data () {
    return {
      tableData: [],
      searchForm: {
        typeName: '',
        enable: '',
        currentPage: 1
      },
      currentPage: 1,
      totalRecord: 1,
      loading: false,
      fxCourseTypeData: {},
      addShow: false,
      status: 1,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      // 是否启用
      enable: {
        0: '禁用',
        1: '开启'
      }
    }
  },
  created () {
    this.searchHandle()
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
      this.fxCourseTypeData = row
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
      this.$ajax({
        url: '/store/account/fx/fxCourseConf/queryCourseTypeList',
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
      this.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    FxCourseTypeAdd,
    FxCourseTypeEdit
  }
}
</script>

<style>
  .gradeImgDtl {
    width: 64px;
    height: 64px;
    padding: 10px 60px;
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