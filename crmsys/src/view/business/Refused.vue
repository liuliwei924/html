<template>
  <div class="content-box">
    <div class="header__title">已拒单</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="申请开始时间:">
          <el-date-picker
            v-model="startTime"
            type="date"
            :picker-options="startPickerOptions"
            @change="startPickerChange"
            editable
            placeholder="开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请结束时间:">
          <el-date-picker
            v-model="endTime"
            type="date"
            :picker-options="endPickerOptions"
            @change="endPickerChange"
            editable
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="身份证:">
          <el-input v-model="searchForm.cardNo" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model="searchForm.telephone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="searchForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-button native-type="submit" @click.prevent="searchHandle('store')">查询</el-button>
      </el-form>
    </div>
    <el-table
      class="content__table table__gap"
      :data="tableData"
      border
      v-loading="loading"
      element-loading-text="拼命加载中">
      <el-table-column
        prop="custId"
        label="用户ID"
        width="100">
      </el-table-column>
      <el-table-column
        prop="applyId"
        label="申请ID"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="prodName"
        label="产品名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="applyAmount"
        label="申请金额(万)"
        width="120">
      </el-table-column>
      <el-table-column
        label="贷款期限"
        width="120">
        <template slot-scope="scope">{{deadline[scope.row.deadline]}}</template>
      </el-table-column>
      <el-table-column
        prop="loanUse"
        label="贷款用途"
        width="120">
      </el-table-column>
      <el-table-column
        label="业务类型"
        width="120">
        <template slot-scope="scope">{{busiType[scope.row.busiType]}}</template>
      </el-table-column>
      <el-table-column
        label="学历"
        width="120">
        <template slot-scope="scope">{{education[scope.row.education]}}</template>
      </el-table-column>
      <el-table-column
        label="婚姻状态"
        width="120">
        <template slot-scope="scope">{{marry[scope.row.marry]}}</template>
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="cardNo"
        label="身份证"
        width="180">
      </el-table-column>
      <el-table-column
        prop="applyCity"
        label="申请城市"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bankIncome"
        label="工资打卡收入"
        width="120">
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewHandle(scope.row.applyId, 'doc')">查看</el-button>
          <!-- <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" class="table__danger" size="small">删除</el-button> -->
        </template>
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
  name: 'refused',
  data () {
    let store = this.$getStore('refused')
    return {
      searchForm: {
        startApplyTime: store['startApplyTime'] || '',
        endApplyTime: store['endApplyTime'] || '',
        cardNo: store['cardNo'] || '',
        telephone: store['telephone'] || '',
        name: store['name'] || '',
        currentPage: 1
      },
      startTime: store['startApplyTime'] || '',
      endTime: store['endApplyTime'] || '',
      startPickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      endPickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      deadline: {
        1: '12个月',
        2: '24个月',
        3: '36个月'
      },
      busiType: {
        1: '新增贷款',
        2: '借新还旧'
      },
      education: {
        1: '博士及以上',
        2: '硕士',
        3: '本科',
        4: '大专',
        5: '高中专',
        6: '初中及以下'
      },
      marry: {
        1: '未婚',
        2: '已婚',
        3: '离婚',
        4: '分居',
        5: '丧偶',
        6: '再婚'
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
    searchHandle (params) {
      if (params === 'store') this.$setStore('refused', this.searchForm)
      this.$ajax({
        url: '/crmsys/account/busi/refuseCust/queryList',
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
    },
    // 开始时间改变
    startPickerChange (val) {
      this.searchForm.startApplyTime = val
      this.endTime = ''
      this.searchForm.endApplyTime = ''
      this.endPickerOptions.disabledDate = (time) => {
        return time.getTime() < this.startTime.getTime() || time.getTime() > Date.now()
      }
    },
    // 结束时间改变
    endPickerChange (val) {
      this.searchForm.endApplyTime = val
    },
    // 查看或编辑
    viewHandle (applyId, type) {
      this.$router.push({path: 'busiDetail', query: {applyId, type}})
    }
  }
}
</script>