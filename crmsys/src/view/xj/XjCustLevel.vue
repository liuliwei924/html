<template>
  <div class="content-box">
    <div class="header__title">用户等级列表</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="显示名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.nickNameAndTel"
            placeholder="显示名或手机号">
          </el-input>
        </el-form-item>
       <!--  <el-form-item label="用户等级:">
          <el-select
            v-model="searchForm.grade"
            clearable
            placeholder="请选择用户等级">
            <el-option
              v-for="val,key,index in grade"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="排序选项:">
          <el-select
            v-model="searchForm.ordeByName"
            clearable
            placeholder="请选择排序选项">
            <el-option
              v-for="val,key,index in ordeByName"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="customerId"
        label="客户编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="显示名称"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="xjCoinCount"
        label="天狗币总数"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="abilityValue"
        label="狗粮总数"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="luckCoinCount"
        label="幸运币"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="rewardCoin"
        label="奖励天狗币"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="frozenCoin"
        label="冻结天狗币"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="用户等级"
        min-width="100">
        <template slot-scope="scope">{{grade[scope.row.grade]}}</template>
      </el-table-column>
      <el-table-column
        prop="getLastTime"
        label="最近获币时间"
        min-width="150">
      </el-table-column>
    </el-table>
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
  name: 'xj-custLevel',
  data () {
    let store = this.$getStore('xjCustLevel')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      searchForm: {
        nickNameAndTel: store['nickNameAndTel'] || '',
        grade: store['grade'] || '',
        ordeByName: store['ordeByName'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 用户等级
      grade: {
        0: '普通',
        1: '稀有',
        2: '罕见',
        3: '史诗',
        4: '传说'
      },
      // 排序
      ordeByName: {
        0: '天狗币-降序',
        1: '天狗币-升序',
        2: '狗粮-降序',
        3: '狗粮-升序',
        4: '幸运币-降序',
        5: '幸运币-升序'
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 编辑
    editHandle (row) {
      this.custData = row
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
      this.tableData = []
       // 缓存查询条件
      this.$setStore('xjCustLevel', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjCustLevel/queryCustLevel',
        data: this.searchForm,
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
  }
}
</script>

