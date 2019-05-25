<template>
  <div class="content-box">
    <div class="header__title">待分配处理订单</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="申请时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.searchKey"
            placeholder="客户姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="订单类型:">
          <el-select
            v-model="searchForm.orderFlag"
            placeholder="请选择">
            <el-option
              v-for="val,key,index in orderFlag"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市:">
          <el-select
            v-model="searchForm.cityName"
            filterable
            clearable
            placeholder="请选择">
            <el-option-group
              v-for="group,gIndex in cityList"
              :label="group.provinceName"
              :key="gIndex">
              <el-option
                v-for="item,index in group.citys"
                :label="item.cityName"
                :value="item.cityName"
                :key="index">
              </el-option>
            </el-option-group>
          </el-select>
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
        prop="applyId"
        label="申请ID"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="applyName"
        label="客户姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="客户手机"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        label="贷款额度(万)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="havePinan"
        label="微粒贷额度(元)"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="loanDeadline"
        label="贷款期限(月)"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="applyType"
        label="单子类型"
        min-width="100">
        <template slot-scope="scope">{{applyType[scope.row.applyType]}}</template>
      </el-table-column>
      <el-table-column
        prop="custLabel"
        label="客户类型"
        min-width="100">
        <template slot-scope="scope">{{custLabel[scope.row.custLabel]}}</template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        min-width="130">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="storeStatus"
        label="门店状态"
        min-width="130">
        <template slot-scope="scope">{{storeStatus[scope.row.storeStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="assetInfo"
        label="资产描述"
        min-width="200">
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
// 待分配处理订单页面
export default {
  name: 'wait-assign',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1' || authRole === '6' || authRole === '7' || authRole === '8'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('waitAssign')
    return {
      searchForm: {
        cityName: store['cityName'] || '',
        // 管理员角色(authRole=1、6、7)加上默认的搜索时间
        startDate: isAuth ? lastWeekDay : '',
        endDate: '',
        searchKey: store['searchKey'] || '',
        orderFlag: store['orderFlag'] || 1,
        currentPage: store['currentPage'] || 1
      },
      loading: false,
      tableData: [],
      totalRecord: 1,
      userOrgs, // 门店数据
      cityList, // 城市数据
      // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 订单类型
      orderFlag: {
        1: '优质单',
        0: '未填写单'
      },
      // 单子类型
      applyType: {
        1: '优质单',
        2: '普通单',
        3: '垃圾单',
        4: '不押车贷',
        5: '微店单',
        6: '准优质单'
      },
      // 客户类型
      custLabel: {
        1: '优质客户',
        2: '次级客户',
        3: '劣质客户'
      },
      // 门店跟进状态
      storeStatus: {
        0: '未跟进',
        1: '继续跟进',
        2: '成功预约',
        3: '签单',
        4: '回款',
        5: '不能做',
        6: '签单办理完成',
        7: '不需要'
      },
      // 状态
      status: {
        0: '待处理',
        1: '客服锁定中',
        2: '门店锁定中',
        3: '可转信贷经理',
        4: '转信贷经理中',
        5: '转信贷经理成功',
        6: '转信贷经理失败',
        7: '门店退回',
        8: '过期失效'
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endDate = date || ''
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('waitAssign', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/work/waitAssign/queryAssignList',
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