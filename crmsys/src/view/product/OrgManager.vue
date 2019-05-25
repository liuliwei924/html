<template>
  <div class="content-box">
    <div class="header__title">机构管理</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="机构名称">
      </el-table-column>
      <el-table-column
        prop="orgIcon"
        label="小图标">
        <template slot-scope="scope">
          <img :src="scope.row.orgIcon" class="gradeImg" v-if="scope.row.orgIcon">
        </template>
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row.prodId)">编辑</el-button>
          <el-button type="text" size="small" @click="delectHandle(scope.row.prodId)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <org-manager-add v-model="addShow" @change="addChange"></org-manager-add>
  </div>
</template>

<script>
import OrgManagerAdd from '@/components/product/OrgManagerAdd'
export default {
  name: 'org',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      orgData: {},
      addShow: false,
      editShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    addChange (val) {
      this.addShow = val
    },
    // 添加
    addHandle () {
      this.addShow = true
    },
    // 编辑
    editHandle (prodId) {
      this.$router.push({path: 'prodEdit', query: {prodId}})
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/open/account/org/orgInfo/queryOrgInfoList',
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
    OrgManagerAdd
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
