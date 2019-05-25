  <template>
    <div class="content-box">
      <div class="header__title">链接配置</div>
       <!-- 查询条件 -->
      <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="链接类型:">
          <el-select
            v-model="searchForm.linkType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in linkType"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称:">
          <el-select
            v-model="searchForm.prodId"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item, index in prodList"
              :label="item.prodName"
              :value="item.prodId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有短链接:">
          <el-select
            v-model="searchForm.shortLinkFlag"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in shortLinkFlag"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
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
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button icon="plus" @click="addHandle">添加</el-button>
        <el-button :loading="loading" @click="linkHandle">链接详情</el-button>
      </el-form>
     </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column
        prop="linkType"
        label="链接类型"
         align="center">
         <template slot-scope="scope">{{linkType[scope.row.linkType]}}</template>
        </el-table-column>
        <el-table-column
          prop="prodName"
          label="产品名称" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="label"
          label="标签" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="shareNum"
          label="分享次数" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="shortLinkFlag"
          label="是否有短链接" 
          align="center">
          <template slot-scope="scope">{{shortLinkFlag[scope.row.shortLinkFlag]}}</template>
        </el-table-column>
        <el-table-column
          prop="enable"
          label="是否启用" 
          align="center">
          <template slot-scope="scope">
              <el-tag v-if ="scope.row.enable===0" type="danger">禁用</el-tag>
              <el-tag v-if ="scope.row.enable===1" type="success">开启</el-tag>
        </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="80">
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
      <fx-linkConf-add v-model="addShow" @change="addChange" :prodList="prodList" :shortLink="shortLink"/>
      <fx-link-info v-model="queryShow" @change="queryChange" :linkPreData="linkPreData"/>
      <fx-linkConf-edit v-model="editShow" :fxLinkData="fxLinkData" @change="editChange" :prodList="prodList" :shortLink="shortLink"/>
    </div>
    </div>
  </template>

<script>
import FxLinkConfAdd from '@/components/fx/FxLinkConfAdd'
import FxLinkConfEdit from '@/components/fx/FxLinkConfEdit'
import FxLinkInfo from '@/components/fx/FxLinkInfo'
export default {
  name: 'fxLink-conf',
  data () {
    return {
      tableData: [],
      prodList: [],
      currentPage: 1,
      totalRecord: 1,
      fxLinkData: {},
      addShow: false,
      queryShow: false,
      editShow: false,
      shortLink: '',
      linkPreData: {},
      status: 1,
      searchForm: {
        linkType: '',
        prodId: '',
        shortLinkFlag: '',
        enable: '',
        currentPage: 1
      },
      // 链接类型
      linkType: {
        1: '招募代理',
        2: '各大银行',
        3: '客服精选'
      },
      // 是否有短链接
      shortLinkFlag: {
        0: '否',
        1: '是'
      },
      // 是否启用
      enable: {
        0: '禁用',
        1: '开启'
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
      this.fxLinkData = row
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
     // 链接内容
    linkHandle () {
      this.queryShow = true
    },
    // 添加弹窗监听
    queryChange (val) {
      if (val === 'search') {
        this.queryShow = false
      } else {
        this.queryShow = val
      }
    },
    queryProdList () {
      this.$ajax({
        url: '/store/account/fx/fxLinkConf/queryProdList',
        data: {},
        success: data => {
          this.prodList = data.attr.prodList
          this.shortLink = data.attr.shortLink
          this.linkPreData = data.attr.linkPreData
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxLinkConf/queryLinkList',
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
    FxLinkConfAdd,
    FxLinkConfEdit,
    FxLinkInfo
  }
}
</script>
