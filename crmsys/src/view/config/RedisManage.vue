<template>
  <div class="content-box">
    <div class="header__title">redis列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="缓存Key:">
          <el-input
            v-model="searchForm.redisKeylike"
            placeholder="请输入redisKey">
          </el-input>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border>
      <el-table-column 
        prop="redisKey" 
        label="缓存Key">
      </el-table-column>
      <el-table-column 
        prop="timeout" 
        label="超时时长">
       <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.timeout === -1">永不过期</el-tag>
          <el-tag type="success" v-if="scope.row.timeout !== -1">{{scope.row.timeout}}</el-tag>
       </template>
      </el-table-column>
      <el-table-column 
        prop="objectSize" 
        label="缓存大小">
      </el-table-column>
      <el-table-column 
        prop="updateTime" 
        label="修改时间">
      </el-table-column>
    </el-table>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
	</div>
</template>

<script>
export default {
  name: 'redisManager',
  data () {
    return {
      searchForm: {
        redisKeylike: '',
        currentPage: 1
      },
      loading: false,
      tableData: [],
      totalRecord: 1
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.$ajax({
        url: '/store/account/config/redis/queryRedisList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>
