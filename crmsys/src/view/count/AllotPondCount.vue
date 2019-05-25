<template>
  <div class="content-box">
    <div class="header__title">分配池情况统计</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item
          label="城市:"
          :rules="{required: false, message: '城市不能为空'}">
          <el-select
            v-model="searchForm.cityName"
            clearable
            filterable
            placeholder="请选择城市">
            <el-option
              v-for="item,index in cityNameList"
              :label="item.cityName"
              :value="item.cityName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单子类型">
          <el-select
            v-model="searchForm.isCost"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in isCost"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle" :loading="searchLoading">查询</el-button>
      </el-form>
    </div>
    <el-table
      class="content__table table__gap"
      :data="tableData"
      border
      show-summary
      v-loading="loading">
      <el-table-column
        min-width="130"
        prop="cityName"
        label="城市">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="totalCount"
        label="总新单数">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="containThree"
        label="3天以内新单数">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="exceedThree"
        label="3天以上新单数">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="againCount"
        label="再分配单数">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      :page-sizes="[20]"
      layout="total, sizes, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'allot-pondCount',
  data () {
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    // 缓存查询条件
    let store = this.$getStore('allotPondCount')
    return {
      searchForm: {
        cityName: store['cityName'] || ''
      },
      totalRecord: 1,
      searchLoading: false,
      loading: false,
      tableData: [],
      cityList,
      cityNameList: {},
      // 单子类型
      isCost: {
        1: '成本单',
        2: '测试单'
      }
    }
  },
  created () {
    this.searchHandle()
    this.getCityName()
  },
  methods: {
    getCityName () {
      this.$ajax({
        url: '/store/account/user/comm/queryNetCity',
        success: data => {
          this.cityNameList = data.attr['cityNameList']
        }
      })
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.$ajax({
        url: '/store/account/dataset/allotPondCount/queryAllotPondStatics',
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