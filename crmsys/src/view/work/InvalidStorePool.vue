<template>
  <div class="content-box">
    <div class="header__title">无效池列表</div>
    <!-- 条件搜索栏 --> 
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="最近处理时间-起:">
          <el-date-picker
            v-model="searchForm.startHandleDate"
            type="date"
            editable
            :picker-options="startHandleOptions"
            @change="startHandleChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最近处理时间-止:">
          <el-date-picker
            v-model="searchForm.endHandleDate"
            type="date"
            editable
            :picker-options="endHandleOptions"
            @change="endHandleChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
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
        <el-form-item label="客户姓名或者手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.searchKey"
            placeholder="客户姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="处理业务员姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeSearchKey"
            placeholder="处理业务员姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="客户等级:">
          <el-select
            v-model="searchForm.custLabel"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in custLabel"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
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
        <el-form-item label="无效单描述:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.invalidDesc"
            placeholder="请输入无效单描述">
          </el-input>
        </el-form-item>
        <el-form-item label="分配类型:">
          <el-select
            v-model="searchForm.orderType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in orderType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道类型">
           <el-select v-model="searchForm.channelType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in channelType"
              :label="val"
              :value="key"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button icon="setting" @click="manualAllot" v-if="showCheck">手工分单</el-button>
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
        prop="applyName"
        label="客户姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="custLabel"
        label="客户等级(标星)"
        min-width="200">
        <template slot-scope="scope">{{custLabel[scope.row.custLabel]}}</template>
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="客户手机"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        label="申请额度(万)"
        min-width="120">
      </el-table-column>
       <el-table-column
        prop="orderStatusText"
        label="处理状态"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="applyCount"
        label="申请次数"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="followCount"
        label="跟进次数"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="invalidDesc"
        label="无效单描述"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="最近处理时间"
        sortable
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        sortable
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="assetInfo"
        label="资产描述"
        min-width="200">
      </el-table-column> 
      <el-table-column
        prop="currentDeal"
        label="处理业务员"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="处理门店"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="分配类型"
        min-width="100">
        <template slot-scope="scope">{{orderType[scope.row.orderType]}}</template>
      </el-table-column>
      <el-table-column
         prop="channelTypeText"
        label="渠道类型"
        min-width="120">
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
    <manual-allot
      v-model="otherShow"
      :userOrgs="userOrgs"
      :orders="ids"
      :invalidFlag="invalidFlag"
      @change="otherChange" />
  </div>
</template>

<script>
import ManualAllot from '@/components/work/ManualAllot'
// 手工分单页面
export default {
  name: 'again-invalidStore',
  data () {
    let signId = JSON.parse(this.$localStorage('signId')).v
    let {lastWeekDay} = this.$searchDate()
    let authRole = this.$localStorage('userRole')
    let adminRole = authRole === '1' && this.$localStorage('allOrgs') === 'all'
    let isAuth = authRole === '1' || authRole === '6' || authRole === '7' || authRole === '8'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let showStartDate = isAuth ? lastWeekDay : ''
    // 缓存查询条件
    let store = this.$getStore('invalidOrder')
    return {
      showCheck: 0,
      searchForm: {
        orderStatus: store['orderStatus'] || '',
        startDate: store['startDate'] || '',
        endDate: store['endDate'] || '',
        startHandleDate: store['startHandleDate'] || showStartDate,
        endHandleDate: '',
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        invalidDesc: store['invalidDesc'] || '',
        custLabel: store['custLabel'],
        currentPage: store['currentPage'] || 1,
        orderType: store['orderType'] || '',
        orgId: store['orgId'] || '',
        status: store['status'] || '',
        cityName: store['cityName'] || '',
        storeRealName: store['storeRealName'] || '',
        realName: store['realName'] || '',
        channelDetail: store['channelDetail'] || ''
      },
      loading: false,
      otherShow: false,
      tableData: [],
      totalRecord: 1,
      adminRole, // 管理员权限
      cityList, // 城市数据
      userOrgs, // 门店数据
      ids: [], // table选中
      invalidFlag: '1',
      excelForm: {
        signId: signId
      },
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
            // 处理开始时间禁用
      startHandleOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 处理结束时间禁用
      endHandleOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 单子类型
      orderType: {
        1: '新申请',
        2: '再分配'
      },
      // 客户等级
      custLabel: {
        0: '0星：默认未了解的客户',
        1: '1星：无条件无可贷点',
        2: '2星：有条件暂时不能进件的',
        3: '2星+：有需求邀约上门客户',
        4: '3星：可做小贷的客户',
        5: '4星：可做银行的客户'
      },
      // 渠道类型
      channelType: {
        1: '自有平台',
        2: '推广渠道',
        3: 'API接口',
        4: '历史数据',
        6: '测试数据'
      }
    }
  },
  created () {
    this.searchHandle()
    this.getMenuRole()
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
        // 开始时间改变处理
    startHandleChange (date) {
      this.searchForm.startHandleDate = date || ''
      this.searchForm.endHandleDate = ''
      this.endHandleOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
        // 结束时间改变处理
    endHandleChange (date) {
      this.searchForm.endHandleDate = date || ''
    },
    // table表格选择
    selectChange (arr) {
      this.ids = []
      arr.forEach(item => {
        this.ids.push({
          applyId: item['applyId'],
          orderType: item['orderType']
        })
      })
    },
    // 查看详情
    detailHandle (obj) {
      let queryObj = {
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          searchDetailFlag: '1'
        }
      }
      let desc = obj.applyName
      if (!obj.applyName) {
        desc = obj.applyId
      }
      this.$emit('addTab', desc + '', queryObj)
      this.$router.push(queryObj)
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
    // 手工分单
    manualAllot () {
      if (this.ids.length === 0) {
        this.$msg('请至少选择一个订单!')
      } else {
        this.otherShow = true
      }
    },
    // 转信贷经理组件监听
    otherChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.otherShow = false
      } else {
        this.otherShow = val
      }
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      let searchFlag = !this.searchForm.startDate && !this.searchForm.endDate && !this.searchForm.startHandleDate && !this.searchForm.endHandleDate && !this.searchForm.searchKey && !this.searchForm.storeSearchKey && !this.searchForm.handleDesc && !this.searchForm.custLabel
      if (searchFlag) {
        this.$msg('请至少选择一个条件查询')
        return
      }
      // 缓存查询条件
      this.$setStore('invalidOrder', this.searchForm)
      this.$ajax({
        url: '/store/account/work/invalidStorePool/queryInvalidPoolList',
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
    // 获取菜单权限
    getMenuRole () {
      let menuCode = this.$localStorage('subPath')
      let checkUrl = this.$localStorage('checkMenus')
      if (checkUrl.indexOf(menuCode) >= 0) {
        this.showCheck = 1
      } else {
        this.showCheck = 0
      }
    }
  },
  components: {
    ManualAllot
  }
}
</script>
