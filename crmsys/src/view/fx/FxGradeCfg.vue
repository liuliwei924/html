  <template>
    <div class="content-box">
         <div class="header__title">佣金配置</div>
       <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="产品类型" prop="prodType">
          <el-select v-model="searchForm.prodType" clearable placeholder="请选择产品类型">
            <el-option label="信用卡" value="1"></el-option>
            <el-option label="保险" value="2"></el-option>
            <el-option label="贷款" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品编号" prop="prodNo">
          <el-input v-model="searchForm.prodNo" placeholder="请输入产品编号"></el-input>
        </el-form-item>
        <el-form-item label="等级名称" prop="gradeName">
          <el-input v-model="searchForm.gradeName" placeholder="请输入等级名称"></el-input>
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
        <el-table-column prop="grade" label="用户等级" align="center" min-width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.grade===1">实习专员</span>
            <span v-if="scope.row.grade===2">专员</span>
            <span v-if="scope.row.grade===3">经理</span>
            <span v-if="scope.row.grade===4">行长</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gradeName"
          label="等级名称" align="center" min-width="40">
        </el-table-column>
        <el-table-column prop="prodType" label="分佣产品类型" align="center" min-width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.prodType===1">信用卡</span>
            <span v-if="scope.row.prodType===2">保险</span>
            <span v-if="scope.row.prodType===3">贷款</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="prodNo"
          label="产品编号" align="center" min-width="40">
        </el-table-column>
        <el-table-column
          prop="gradeRate1"
          label="一级佣金" align="center" min-width="40">
        </el-table-column>
         <el-table-column
          prop="gradeRate2"
          label="二级佣金" align="center" min-width="40">
        </el-table-column>
         <el-table-column
          prop="gradeRate3"
          label="三级佣金" align="center" min-width="40">
        </el-table-column>
        <el-table-column
          prop="gradeRate4"
          label="四级佣金" align="center" min-width="40">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="分佣备注" align="center" min-width="70">
        </el-table-column>
        <el-table-column
         prop="enable"
          label="是否显示" align="center" min-width="40">
             <template slot-scope="scope">
            <el-tag v-if ="scope.row.enable===0" type="danger">关闭</el-tag>
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

      <fx-gradecfg-add v-model="addShow" @change="addChange" :prodList="prodList"/>
      <fx-gradecfg-edit v-model="editShow" :fxGradecfgData="fxGradecfgData" @change="editChange" :prodList="prodList"/>
    </div>
  </template>

<script>
import FxGradecfgAdd from '@/components/fx/FxGradeCfgAdd'
import FxGradecfgEdit from '@/components/fx/FxGradeCfgEdit'
export default {
  name: 'fx-grade-cfg',
  data () {
    return {
      tableData: [],
      prodList: [],
      currentPage: 1,
      totalRecord: 1,
      showStatus: 3,
      fxGradecfgData: {},
      searchForm: {
        prodName: '',
        prodType: '',
        enable: ''
      },
      addShow: false,
      editShow: false,
      loading: false
    }
  },
  created () {
    this.searchHandle()
    this.queryProdList()
  },
  watch: {
    // 处理状态改变监听
    showStatus (val) {
      this.$emit('change', val)
    }
  },
  methods: {
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
      this.fxGradecfgData = row
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
        url: '/store/account/fx/fxReferer/queryCreditList',
        data: {},
        success: data => {
          this.prodList = data.attr.prodList
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxReferer/queryFxGradeList',
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
    FxGradecfgAdd,
    FxGradecfgEdit
  }
}
</script>

<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
</style>
