  <template>
    <div class="content-box">
      <div class="header__title">推荐配置</div>
      <div class="header__control">
        <el-button icon="plus" @click="addHandle">添加</el-button>
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
          prop="index"
          label="序号"
          width="80" align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="推荐标题" align="center">
        </el-table-column>
        <el-table-column
          prop="titleDesc"
          label="推荐内容" align="center">
        </el-table-column>
        <el-table-column
          prop="prodName"
          label="产品名称" align="center">
        </el-table-column>
        <el-table-column
         prop="enable"
          label="是否显示" align="center">
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

      <fx-referer-add v-model="addShow" @change="addChange" :prodList="prodList"/>
      <fx-referer-edit v-model="editShow" :fxRefererData="fxRefererData" @change="editChange" :prodList="prodList"/>
    </div>
  </template>

<script>
import FxRefererAdd from '@/components/fx/FxRefererAdd'
import FxRefererEdit from '@/components/fx/FxRefererEdit'
export default {
  name: 'fx-referer-cfg',
  data () {
    return {
      tableData: [],
      prodList: [],
      currentPage: 1,
      totalRecord: 1,
      showStatus: 2,
      fxRefererData: {},
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
      this.fxRefererData = row
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
        url: '/store/account/fx/fxReferer/queryRefererList',
        data: {
          currentPage: this.currentPage
        },
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
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
    FxRefererAdd,
    FxRefererEdit
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
