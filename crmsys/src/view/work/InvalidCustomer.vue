<template>
  <div class="content-box">
    <div class="header__title">无效客户列表</div>
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
            v-model="searchForm.handleDesc"
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
        <el-form-item label="是否专属单:">
          <el-select
            v-model="searchForm.isExOrderFlag"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in isExOrderFlag"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button icon="setting" @click="autoInvalidOrder" v-if="isExport">同步到无效池</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button icon="setting" @click="transOther" v-if="showCheck">转信贷经理</el-button>
      <el-button icon="setting" @click="addInvalidOrderPool" v-if="showCheck">加入无效池</el-button>
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
        prop="handleDesc"
        label="无效单描述"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="handleTime"
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
        prop="desc"
        label="客户描述"
        min-width="200">
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
        prop="isExOrderFlag"
        label="是否专属单"
        min-width="150">
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
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      @size-change="handleSizeChange"
      :page-sizes="[10, 30, 50]"
      :page-size="searchForm.everyPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRecord">
    </el-pagination>
    <trans-other
      v-model="otherShow"
      :userOrgs="userOrgs"
      :orders="orders"
      :invalidListFlag="invalidListFlag"
      @change="otherChange"/>
  </div>
</template>

<script>
import TransOther from '@/components/work/TransOther'
export default {
  name: 'invalidCustomer',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('invalidCustomer')
    return {
      showCheck: 0,
      searchForm: {
        orderStatus: store['orderStatus'] || '',
        startDate: store['startDate'] || '',
        endDate: store['endDate'] || '',
        startHandleDate: isAuth ? lastWeekDay : '',
        endHandleDate: '',
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        handleDesc: store['handleDesc'] || '',
        custLabel: store['custLabel'],
        currentPage: store['currentPage'] || 1,
        orderType: store['orderType'] || '',
        channelType: store['channelType'] || '',
        orgId: store['orgId'] || '',
        isExOrderFlag: store['isExOrderFlag'] || '',
        everyPage: 10
      },
      isExport, // 是否可以导出
      loading: false,
      otherShow: false,
      tableData: [],
      totalRecord: 0,
      applyId: '', // 申请ID
      isShow: false, // 弹窗是否显示
      invalidListFlag: '1', // 无效客户列表标识
      userOrgs, // 门店数据
      cityList, // 城市数据
      orders: [], // table选中
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
      },
      // 专属单标识
      isExOrderFlag: {
        1: '是',
        2: '否'
      }
    }
  },
  created () {
    this.getMenuRole()
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
      this.orders = []
      arr.forEach(item => {
        this.orders.push({
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
          applyId: obj.applyId
        }
      }
      let desc = obj.applyName
      if (!obj.applyName) {
        desc = obj.applyId
      }
      this.$emit('addTab', desc + '', queryObj)
      this.$router.push(queryObj)
    },
    // 查询处理
    searchHandle () {
      let userRole = this.$localStorage('userRole') === '1'
      let searchFlag = !this.searchForm.startDate && !this.searchForm.endDate && !this.searchForm.startHandleDate && !this.searchForm.endHandleDate && !this.searchForm.searchKey && !this.searchForm.storeSearchKey && !this.searchForm.handleDesc && !this.searchForm.custLabel && !this.searchForm.orderType && !this.searchForm.orgId && !this.searchForm.isExOrderFlag
      if (searchFlag && userRole) {
        if (this.searchForm.custLabel !== 0) {
          this.$msg('请至少选择一个条件查询')
          return
        }
      }
      this.tableData = []
      // 缓存查询条件
      this.$setStore('invalidCustomer', this.searchForm, ['startHandleDate', 'endHandleDate'])
      this.$ajax({
        url: '/store/account/work/invalidCustomer/queryInvalidCustList',
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
    handleSizeChange (val) {
      this.searchForm['everyPage'] = val
      this.searchForm.currentPage = 1
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
    },
    // 转信贷经理
    transOther () {
      if (this.orders.length === 0) {
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
    // 加入无效订单池
    autoInvalidOrder () {
      this.$alert('是否把无效订单加入无效订单池?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            let loadInst = this.$loading({ fullscreen: true, text: '拼命加载中' })
            this.$ajax({
              url: '/store/account/work/invalidCustomer/autoInsertInvalidPool',
              success: data => {
                if (data.message) {
                  this.$msg(data.message)
                } else {
                  this.$message('操作成功')
                }
                this.searchHandle()
                loadInst.close()
              },
              fail: (error) => {
                this.$msg(error.message)
                loadInst.close()
              }
            })
          }
        }
      })
    },
    // 批量加入无效订单池
    addInvalidOrderPool () {
      if (this.orders.length === 0) this.$msg('请至少选择一个订单!')
      else {
        this.$alert('加入无效订单池后会删除订单,是否加入?', '提示', {
          type: 'warning',
          customClass: 'msg-delete__dialog',
          showCancelButton: true,
          callback: action => {
            if (action === 'confirm') {
              this.$ajax({
                url: '/store/account/work/invalidCustomer/addInvalidOrderPool',
                data: {
                  str: JSON.stringify({orders: this.orders})
                },
                success: data => {
                  this.$msg(data.message)
                  this.searchHandle()
                },
                fail: (error) => {
                  this.$msg(error.message)
                }
              })
            }
          }
        })
      }
    }
  },
  components: {
    TransOther
  }
}
</script>
