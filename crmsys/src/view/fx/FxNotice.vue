  <template>
    <div class="content-box">
      <div class="header__title">公告配置</div>
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
          label="公告标题" align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="公告内容" align="center">
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

      <fx-notice-add v-model="addShow" @change="addChange" />
      <fx-notice-edit v-model="editShow" :fxNoticeData="fxNoticeData" @change="editChange" />
    </div>
  </template>

<script>
import FxNoticeAdd from '@/components/fx/FxNoticeAdd'
import FxNoticeEdit from '@/components/fx/FxNoticeEdit'
export default {
  name: 'fxNotice',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      fxNoticeData: {},
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
      this.fxNoticeData = row
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
        url: '/store/account/fx/fxNotice/queryNoticeList',
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
    FxNoticeAdd,
    FxNoticeEdit
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
