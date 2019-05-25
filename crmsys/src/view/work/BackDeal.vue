<template>
  <div class="content-box">
    <div class="header__title">回款列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="回款时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回款时间-止:">
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
            placeholder="业务处理员姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="核算状态:">
          <el-select
            v-model="searchForm.reStatus"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in reStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
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
        <el-form-item label="申请时间-起:">
          <el-date-picker
            v-model="searchForm.startApplyDate"
            type="date"
            editable
            :picker-options="startApplyDateOptions"
            @change="startApplyDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请时间-止:">
          <el-date-picker
            v-model="searchForm.endApplyDate"
            type="date"
            editable
            :picker-options="endApplyDateOptions"
            @change="endApplyDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button @click="exportData()" class="export-btn" v-if="isExport">导出</el-button>
        <template v-if="isExport">
          <el-form-item label="门店:">
            <el-select
              v-model="searchForm.orgIds"
              filterable
              clearable
              multiple
              @change="multChangeOrgHandle"
              placeholder="请选择门店">
              <el-option
                v-for="item,index in netOrgList"
                :label="item.orgNo + '-' + item.orgName"
                :value="item.orgId"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
         </template>
         <template v-if="!isExport">
          <el-form-item label="门店:">
            <el-select
              v-model="searchForm.orgId"
              filterable
              clearable
              @change="changeOrgHandle"
              placeholder="请选择门店">
              <el-option
                v-for="item,index in userOrgs"
                :label="item.orgNo + '-' + item.orgName"
                :value="item.orgId"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="所属组名:">
          <el-select
            v-model="searchForm.groupName"
            clearable
            @change="changeGroupHandle"
            placeholder="请选择组名">
            <el-option
              v-for="item,index in groupNameList"
              :label="item.groupName"
              :value="item.groupName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属队名:">
          <el-select
            v-model="searchForm.teamName"
            clearable
            placeholder="请选择队名">
            <el-option
              v-for="item,index in teamNameList"
              :label="item.teamName"
              :value="item.teamName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回款方式:">
          <el-select
            v-model="searchForm.backType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in backType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回款类型:">
          <el-select
            v-model="searchForm.recType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in recType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回款业务员姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.reLoanSearchKey"
            placeholder="回款业务员姓名或手机号">
          </el-input>
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
        <el-form-item v-if="isExport" label="渠道名称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.channelName"
            placeholder="渠道名称">
          </el-input>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button icon="setting" @click="orderSet">设置专属单</el-button>
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
        <template slot-scope="scope">
          {{custLabel[scope.row.custLabel]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="客户手机"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="backTypeText"
        label="回款方式"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="feeAmount"
        label="回款金额(元)"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="lendAmount"
        label="放款金额(元)"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="amountRate"
        label="佣金比率(%)"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="loanOrg"
        label="贷款机构"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="核算状态"
        min-width="100">
        <template slot-scope="scope">
          <span :style="`color: ${statusColor[scope.row.reStatus]}`">
            {{reStatus[scope.row.reStatus]}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="recTypeText"
        label="回款类型"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="feeAmountDate"
        label="回款时间"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        sortable
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="reLoanName"
        label="回款业务员"
        min-width="150">
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
        prop="groupName"
        label="所属组名"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="teamName"
        label="所属队名"
        min-width="150">
      </el-table-column>
      <el-table-column
        v-if="isExport"
        prop="channelText"
        label="渠道来源"
        min-width="180">
      </el-table-column>
      <el-table-column
        v-if="isExport"
        prop="channelTeamName"
        label="渠道名称"
        min-width="130">
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
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <sum-export :defileName="defileName" ref="sumExport"/>
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
import SumExport from '@/components/export/SumExport.vue'
// 回款处理页面
export default {
  name: 'back-deal',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('backDeal')
    return {
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeBackAmount',
        exportParams: ''
      },
      defileName: 'backDeal',
      searchForm: {
        orgId: store['orgId'] || '',
        cityName: store['cityName'] || '',
        custLabel: store['custLabel'],
        reStatus: store['reStatus'] || '',
        // 管理员角色(userRole=1)加上默认的搜索时间
        startDate: isAuth ? lastWeekDay : store['startDate'] || '',
        endDate: store['endDate'] || '',
        startApplyDate: store['startApplyDate'] || '',
        endApplyDate: store['endApplyDate'] || '',
        searchKey: store['searchKey'] || '',
        backType: store['backType'] || '',
        recType: store['recType'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        reLoanSearchKey: store['reLoanSearchKey'] || '',
        channelName: store['channelName'] || '',
        currentPage: 1,
        orgIds: '',
        orgIdIn: '',
        groupName: '',
        teamName: ''
      },
      groupNameList: [], // 门店组名列表
      teamNameList: [], // 门店队名列表
      netOrgList: [], // 网销门店数据
      isExport, // 是否可以导出
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
       // 申请开始时间禁用
      startApplyDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 申请结束时间禁用
      endApplyDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 回款状态
      reStatus: {
        1: '未核算',
        2: '已核算',
        3: '审核失败'
      },
      // 回款方式
      backType: {
        1: '手动添加',
        2: '查CFS回款'
      },
      // 放款类型
      loanType: {
        1: '信用贷',
        2: '抵押贷'
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
      // 回款类型
      recType: {
        3: '订金收入',
        4: '客户回款',
        5: '客户尾款',
        6: '客户返点',
        7: '客户退款',
        8: '转总部入账',
        10: '退订金',
        16: '定金转回款',
        17: '提前回款退款',
        18: '投诉退款'
      },
      statusColor: {
        1: '#62a2d5',
        2: '#42a874',
        3: '#f66830'
      }
    }
  },
  created () {
    this.searchHandle()
    if (this.isExport) {
      this.getNetOrgList()
    }
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
  },
  methods: {
    // 获取网销门店
    getNetOrgList () {
      this.$ajax({
        url: '/store/account/user/comm/queryNetOrg',
        success: data => {
          this.netOrgList = data.attr['netOrgList']
        }
      })
    },
    exportData () {
      this.$refs.sumExport.show = true
      this.signId = expireStore('signId')
    },
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
    // 申请开始时间改变处理
    startApplyDateChange (date) {
      this.searchForm.startApplyDate = date || ''
      this.searchForm.endApplyDate = ''
      this.endApplyDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 申请结束时间改变处理
    endApplyDateChange (date) {
      this.searchForm.endApplyDate = date || ''
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
    // 查看详情
    detailHandle (obj) {
      let queryObj = {
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          storeSearchKey: this.searchForm.storeSearchKey,
          type: 'backDeal'
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
      this.tableData = []
      if (this.searchForm.orgIds) {
        this.searchForm.orgIdIn = this.searchForm.orgIds.toString()
      }
      this.exportSearchParams = this.searchForm
      // 缓存查询条件
      this.$setStore('backDeal', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/work/backDeal/queryBackDealList',
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
   // 改变门店的状态
    changeOrgHandle () {
      let orgId = this.searchForm.orgId
      if (orgId) {
        this.getGroupList(orgId)
      } else {
        this.searchForm.groupName = ''
        this.groupNameList = []
      }
    },
    multChangeOrgHandle () {
      let orgId = this.searchForm.orgIds[0]
      if (orgId) {
        this.getGroupList(orgId)
      } else {
        this.searchForm.groupName = ''
        this.groupNameList = []
      }
    },
    // 改变组名的状态
    changeGroupHandle () {
      if (this.searchForm.groupName) {
        let orgId = this.searchForm.orgId
        if (!orgId) {
          orgId = this.searchForm.orgIds[0]
        }
        this.getTeamList(orgId)
      } else {
        this.searchForm.teamName = ''
        this.teamNameList = []
      }
    },
    // 获取组列表
    getGroupList (orgId) {
      this.$ajax({
        url: '/store/account/user/comm/queryOrgGroupList',
        data: {
          orgId: orgId,
          fullLoading: true
        },
        success: data => {
          this.groupNameList = data.rows || []
          this.searchForm.groupName = ''
        }
      })
    },
    // 获取队列表
    getTeamList (orgId) {
      if (!this.searchForm.groupName) {
        return
      }
      this.$ajax({
        url: '/store/account/user/comm/queryOrgTeamList',
        data: {
          orgId: orgId,
          groupName: this.searchForm.groupName,
          fullLoading: true
        },
        success: data => {
          this.teamNameList = data.rows || []
          this.searchForm.teamName = ''
        }
      })
    }
  },
  components: {
    SumExport
  }
}
</script>
