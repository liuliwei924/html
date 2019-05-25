<template>
  <div class="content-box">
    <div class="header__title">手工分单</div>
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
        <el-form-item label="状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="value,index in status"
              :label="value"
              :value="index"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店状态:">
          <el-select
            v-model="searchForm.storeStatus"
            clearable
            placeholder="请选择门店状态">
            <el-option
              v-for="value,index in storeStatus"
              :label="value"
              :value="index"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有房:">
          <el-select
            v-model="searchForm.houseType"
            clearable
            placeholder="请选择是否有房">
            <el-option
              v-for="value,index in houseType"
              :label="value"
              :value="index"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有社保:">
          <el-select
            v-model="searchForm.socialType"
            clearable
            placeholder="请选择是否有社保">
            <el-option
              v-for="value,index in socialType"
              :label="value"
              :value="index"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最小贷款金额:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.minLoanAmount"
            placeholder="最小贷款金额">
          </el-input>
        </el-form-item>
        <el-form-item label="当前业务处理人或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeRealName"
            placeholder="当前业务处理人或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
            clearable
            placeholder="请选择门店">
            <el-option
              v-for="item,index in userOrgs"
              :label="item.orgNo + '-' + item.orgName"
              :value="item.orgId"
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
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button icon="setting" @click="batchOrder">批量分单</el-button>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border
      @selection-change="selectChange">
      <el-table-column
        type="selection"
        fixed="left"
        width="55">
      </el-table-column>
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
        min-width="150">
      </el-table-column> 
      <el-table-column
        prop="loanAmount"
        label="金额(万)"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="loanDeadline"
        label="期限"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="门店"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="storeRealName"
        label="当前业务处理人"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="haveWeiLi"
        label="微粒贷"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="haveDetailText"
        label="是否填写"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="applyTypeText"
        label="单子类型"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="storeStatus"
        label="门店状态"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="kfRealName"
        label="客服"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="lastKfTime"
        label="客服处理时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="kfStatus"
        label="客服状态"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="lastKfDesc"
        label="客服处理描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="applyCount"
        label="申请次数"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="assetInfo"
        label="资产描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
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
// 手工分单页面
export default {
  name: 'allot-order',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1' || authRole === '6' || authRole === '7' || authRole === '8'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('allotOrder')
    return {
      searchForm: {
        orgId: store['orgId'] || '',
        cityName: store['cityName'] || '',
        // 管理员角色(isAuth=1、6、7)加上默认的搜索时间
        startDate: isAuth ? lastWeekDay : '',
        endDate: '',
        status: store['status'] || '',
        storeStatus: store['storeStatus'] || '',
        minLoanAmount: store['minLoanAmount'] || '',
        houseType: store['houseType'] || '',
        socialType: store['socialType'] || '',
        storeRealName: store['storeRealName'] || '',
        currentPage: store['currentPage'] || 1
      },
      loading: false,
      tableData: [],
      totalRecord: 1,
      cityList, // 城市数据
      userOrgs, // 门店数据
      ids: [], // table选中
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
      // 是否有房
      houseType: {
        1: '有',
        2: '无'
      },
      // 是否有社保
      socialType: {
        1: '有',
        2: '无'
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
      },
      storeStatus: {
        0: '未跟进',
        1: '继续跟进',
        2: '成功预约',
        3: '签单',
        4: '回款',
        5: '不能做',
        6: '签单完成',
        7: '不需要'
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
    // table表格选择
    selectChange (arr) {
      this.ids = []
      arr.forEach(item => {
        this.ids.push(item['applyId'])
      })
    },
    // 查看详情
    detailHandle (obj) {
      this.$router.push({
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId
        }
      })
    },
    // 批量分单
    batchOrder () {
      if (this.ids.length === 0) this.$msg('请至少选择一个订单!')
      else {
        this.$alert('您是否确定批量分单吗?', '提示', {
          type: 'warning',
          customClass: 'msg-delete__dialog',
          showCancelButton: true,
          callback: action => {
            if (action === 'confirm') {
              this.$ajax({
                url: '/store/account/work/allotOrder/allotOrderByHand',
                data: {
                  applyIds: this.ids.join(',')
                },
                success: () => {
                  this.searchHandle()
                }
              })
            }
          }
        })
      }
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('allotOrder', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/work/allotOrder/queryAllotListByHand',
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
