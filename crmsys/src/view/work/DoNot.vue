<template>
  <div class="content-box">
    <div class="header__title">不能做</div>
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
        <el-form-item label="客户姓名或者手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.searchKey"
            placeholder="客户姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="业务处理员姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeSearchKey"
            placeholder="业务处理员姓名或手机号">
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
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单子类型:">
          <el-select
            v-model="searchForm.applyType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in applyType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理描述:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.handleDesc"
            placeholder="请输入处理描述">
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
        <el-form-item label="所属组名:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.groupName"
            placeholder="请输入所属组名全称">
        </el-input>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button icon="setting" @click="orderSet">设置专属单</el-button>
      <el-button icon="setting" @click="orderSale">挂卖处理</el-button>
      <el-button icon="setting" @click="orderSenior">转优质客户</el-button>
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
        prop="handleDesc"
        label="处理描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="handleTime"
        label="最近处理时间"
        sortable
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="currentDeal"
        label="业务处理员"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="所属组名"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="单子类型"
        min-width="100">
        <template slot-scope="scope">{{applyType[scope.row.applyType]}}</template>
      </el-table-column>
      <el-table-column
        label="经手类型"
        min-width="100">
        <template slot-scope="scope">{{orderType[scope.row.orderType]}}</template>
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="处理门店"
        min-width="150">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="130">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="recordHandle(scope.row.applyId)">经手记录</el-button>
        </template>
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
    <!-- 模块组件 -->
    <handle-record
      v-model="isShow"
      :applyId="applyId"
      :orderType="orderType"
      :handleType="handleType"
      @change="recordChange" />
    <!-- 挂卖处理弹框 -->
    <sale-deal v-if="isSale" v-model="isSaleShow" :applyId="applyId"  @change="changeSaleHandle" />
    <!-- 转优质客户弹框 -->
    <senior-deal v-if="isSale" v-model="isSeniorShow" :applyId="applyId"  @change="changeSeniorHandle" />
  </div>
</template>

<script>
import HandleRecord from '@/components/work/HandleRecord'
import SaleDeal from '@/components/work/SaleDeal'
import SeniorDeal from '@/components/work/SeniorDeal'
// 不能做页面
export default {
  name: 'do-not',
  data () {
    let {firstDay, today} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1' || authRole === '6' || authRole === '7' || authRole === '8'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isSale = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('doNot')
    return {
      searchForm: {
        orgId: store['orgId'] || '',
        cityName: store['cityName'] || '',
        applyType: store['applyType'] || '',
        // 管理员角色(userRole=1)加上默认的搜索时间
        startHandleDate: isAuth ? firstDay : '',
        endHandleDate: isAuth ? today : '',
        custLabel: store['custLabel'] || '',
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        currentPage: store['currentPage'] || 1
      },
      isSale,
      isSaleShow: false,
      isSeniorShow: false,
      loading: false,
      tableData: [],
      totalRecord: 1,
      applyId: '', // 申请ID
      isShow: false, // 弹窗是否显示
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
      // 客户等级
      custLabel: {
        0: '0星：系统默认的未了解过信息的客户',
        1: '1星：无可贷点的客户',
        2: '2星：有可贷点但暂时进不了件的客户',
        3: '2星+：可邀约上门的客户',
        4: '3星：可做主流小贷的客户',
        5: '4星：可做银行的客户'
      },
      // 经手类型
      orderType: {
        1: '一手单',
        2: '二手单',
        3: '三手单',
        4: '四手单'
      },
      // 单子类型
      applyType: {
        1: '优质单',
        2: '普通单',
        3: '垃圾单',
        4: '不押车贷',
        5: '微店单',
        6: '准优质单',
        7: '优质客户'
      },
      // 门店跟进状态
      storeStatus: {
        0: '未跟进',
        1: '继续跟进',
        2: '成功预约',
        3: '签单',
        4: '回款',
        5: '不能做',
        6: '签单办理完成'
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
      // 状态
      handleType: {
        0: '未跟进',
        1: '继续跟进',
        2: '成功预约',
        3: '签单',
        4: '回款',
        5: '不能做',
        6: '签单办理完成',
        7: '门店退款成功',
        8: '门店退款失败',
        9: '已上门',
        10: '预约未上门',
        11: '签约失败',
        12: '门店回款成功',
        13: '门店回款失败',
        14: '不需要',
        15: '设置专属单',
        16: '取消专属单'
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
    // 设置专属单
    orderSet () {
      if (this.orders.length === 0) this.$msg('请至少选择一个订单!')
      else {
        this.$alert('设置成专属单后,该单将永久保存在您名下,不再重新分配,是否设置专属单?(每个人的专属单有限，请谨慎设置!)', '提示', {
          type: 'warning',
          customClass: 'msg-delete__dialog',
          showCancelButton: true,
          callback: action => {
            if (action === 'confirm') {
              this.$ajax({
                url: '/store/account/work/waitDeal/orderSet',
                data: {
                  str: JSON.stringify({orders: this.orders})
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
    // 挂卖处理
    orderSale () {
      if (this.orders.length === 0) this.$msg('请至少选择一个订单!')
      else {
        // let order = this.orders.slice(-1)[0] || {}
        // this.applyId = order.applyId || ''
        let ids = []
        this.orders.forEach(item => {
          ids.push(item.applyId)
        })
        this.applyId = ids.join(',')
        this.isSaleShow = true
      }
    },
    // 转优质客户
    orderSenior () {
      if (this.orders.length === 0) this.$msg('请至少选择一个订单!')
      else {
        let order = this.orders.slice(-1)[0] || {}
        this.applyId = order.applyId || ''
        this.isSeniorShow = true
      }
    },
    changeSaleHandle (val) {
      if (!val) {
        this.isSaleShow = false
        this.searchHandle()
      }
    },
    changeSeniorHandle (val) {
      if (!val) {
        this.isSeniorShow = false
        this.searchHandle()
      }
    },
    // 查看详情
    detailHandle (obj) {
      this.$router.push({
        path: 'workDetail',
        // 路由传递参数
        query: {
          path: 'doNot',
          applyId: obj.applyId
          // customerId: obj.lastStore,
          // orderType: obj.orderType,
          // storeStatus: obj.storeStatus,
          // treatyNo: obj.treatyNo,
          // recordId: obj.recordId
        }
      })
    },
    // 经手记录
    recordHandle (applyId) {
      this.applyId = applyId
      this.isShow = true
    },
    // 经手记录组件监听
    recordChange (val) {
      this.isShow = val
    },
    // 查询处理
    searchHandle () {
      // 缓存查询条件
      this.$setStore('doNot', this.searchForm, ['startHandleDate', 'endHandleDate'])
      this.$ajax({
        url: '/store/account/work/doNot/querydoNotList',
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
  },
  components: {
    HandleRecord,
    SaleDeal,
    SeniorDeal
  }
}
</script>
