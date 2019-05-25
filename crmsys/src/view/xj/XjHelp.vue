  <template>
    <div class="content-box">
      <div class="header__title">帮助配置</div>
      <div class="header__control">
        <el-button icon="plus" @click="addHandle">添加</el-button>
      </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column
          prop="index"
          label="序号"
          width="80" align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="帮助标题" align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="帮助内容" align="center">
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
          width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
           <!--  <el-button type="text" size="small" @click="delectHandle(scope.row.tempId)">删除</el-button> -->
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
      <xj-help-add v-model="addShow" @change="addChange" />
      <xj-help-edit v-model="editShow" :xjHelpData="xjHelpData" @change="editChange" />
    </div>
  </template>

<script>
import XjHelpAdd from '@/components/xj/XjHelpAdd'
import XjHelpEdit from '@/components/xj/XjHelpEdit'
export default {
  name: 'xjHelp',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      xjHelpData: {},
      addShow: false,
      editShow: false
    }
  },
  created () {
    this.searchHandle()
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
      this.xjHelpData = row
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
        url: '/store/account/xj/xjHelp/queryHelpList',
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
    XjHelpAdd,
    XjHelpEdit
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
