<template>
  <div class="content-box">
    <div class="header__title">签单列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="签约时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
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
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传状态:">
          <el-select
            v-model="searchForm.upStatus"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in upStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="更新时间-起:">
          <el-date-picker
            v-model="searchForm.startFinishDate"
            type="date"
            editable
            :picker-options="startFinishOptions"
            @change="startFinishChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间-止:">
          <el-date-picker
            v-model="searchForm.endFinishDate"
            type="date"
            editable
            :picker-options="endFinishOptions"
            @change="endFinishChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请时间-起:">
          <el-date-picker
            v-model="searchForm.startApplayDate"
            type="date"
            editable
            :picker-options="startApplayOptions"
            @change="startApplayChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请时间-止:">
          <el-date-picker
            v-model="searchForm.endApplayDate"
            type="date"
            editable
            :picker-options="endApplayOptions"
            @change="endApplayChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理描述:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.handleDesc"
            placeholder="请输入处理描述">
          </el-input>
        </el-form-item>
        <el-form-item label="渠道来源:" v-if="isExport">
          <el-input
            class="kf-search-input"
            v-model="searchForm.channelDetail"
            placeholder="渠道来源">
          </el-input>
        </el-form-item>
        <el-form-item label="签约状态:">
          <el-select
            v-model="searchForm.signStatus"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in signStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约业务员姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.signSearchKey"
            placeholder="签约业务员姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="签单金额:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.signAmount"
            placeholder="签单金额">
          </el-input>
        </el-form-item>
        <el-form-item label="签约失败原因:">
          <el-select
            v-model="searchForm.failureCause"
            clearable
            filterable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in failureCause"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="签单类型:">
          <el-select
            v-model="searchForm.signType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in signType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="exportData()" class="export-btn" v-if="isExport">导出</el-button>
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
        <template slot-scope="scope">{{custLabel[scope.row.custLabel]}}</template>
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="客户手机"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="signAmount"
        label="签单金额(万)"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="treatyWill"
        label="预计创收(元)"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="签约状态"
        min-width="180">
        <template slot-scope="scope">
          {{signStatus[scope.row.signStatus]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="signTypeText"
        label="签单类型"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="failureCause"
        label="签约失败原因"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="handleDesc"
        label="处理描述"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="signTime"
        label="签约时间"
        min-width="180">
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
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="signOrderName"
        label="签约业务员"
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
        label="分配类型"
        min-width="100">
        <template slot-scope="scope">
          {{orderType[scope.row.orderType]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="anjiePerson"
        label="按揭人员"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="channelText"
        label="渠道来源"
        min-width="180" v-if="isExport">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        :width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
          <template v-if="scope.row.orgCFSFlag">
            <el-button type="text" size="small" v-if="scope.row.upStatus === 1" @click="uploadCFS(scope.row)">上传CFS</el-button>
            <el-button type="text" size="small" v-else-if="scope.row.upStatus === 2" style="color: #999;" @click="return false">已上传CFS</el-button>
            <el-button type="text" size="small" v-else-if="scope.row.upStatus === 3" @click="uploadCFS(scope.row)">重新上传CFS</el-button>
          </template>
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
// 签单中页面
export default {
  name: 'signing',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('signing')
    return {
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeSignOrder',
        exportParams: ''
      },
      defileName: 'signOrder',
      searchForm: {
        orgId: store['orgId'] || '',
        cityName: store['cityName'] || '',
        // 管理员角色(userRole=1)加上默认的搜索时间
        startDate: isAuth ? lastWeekDay : '',
        endDate: '',
        startHandleDate: store['startHandleDate'] || '',
        endHandleDate: store['endHandleDate'] || '',
        startFinishDate: store['startFinishDate'] || '',
        endFinishDate: store['endFinishDate'] || '',
        startApplayDate: store['startApplayDate'] || '',
        endApplayDate: store['endApplayDate'] || '',
        custLabel: store['custLabel'],
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        signSearchKey: store['signSearchKey'] || '',
        channelDetail: store['channelDetail'] || '',
        signAmount: store['signAmount'] || '',
        signType: store['signType'] || '',
        signStatus: store['signStatus'] || '',
        upStatus: store['upStatus'] || '',
        currentPage: store['currentPage'] || 1,
        groupName: '',
        teamName: ''
      },
      groupNameList: [], // 门店组名列表
      teamNameList: [], // 门店队名列表
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
      // 更新开始时间禁用
      startFinishOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 更新结束时间禁用
      endFinishOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 申请开始时间禁用
      startApplayOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 申请结束时间禁用
      endApplayOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 签约状态
      signStatus: {
        1: '提交按揭中',
        2: '结案',
        5: '贷款未提交'
      },
      // 签约类型
      signType: {
        1: '银行',
        2: '小额'
      },
      // 经手类型
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
      // 上传状态
      upStatus: {
        1: '未上传',
        2: '已上传',
        3: '上传失败'
      },
      // 退单失败原因
      failureCause: {
        '大数据检测未通过': '大数据检测未通过',
        '征信体现不了/查询次数多': '征信体现不了/查询次数多',
        '历史或当前逾期': '历史或当前逾期',
        '负债过高': '负债过高',
        '网贷太多/小额笔数多': '网贷太多/小额笔数多',
        '系统综合评级不足': '系统综合评级不足',
        '门拒/电核不通过': '门拒/电核不通过',
        '利息高不接受/额度低不接受/客户自行取消': '利息高不接受/额度低不接受/客户自行取消',
        '禁入行业/同行已操作': '禁入行业/同行已操作'
      }
    }
  },
  created () {
    this.searchHandle()
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
  },
  methods: {
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
    // 处理开始时间改变处理
    startHandleChange (date) {
      this.searchForm.startHandleDate = date || ''
      this.searchForm.endHandleDate = ''
      this.endHandleOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 处理结束时间改变处理
    endHandleChange (date) {
      this.searchForm.endHandleDate = date || ''
    },
    // 更新开始时间改变处理
    startFinishChange (date) {
      this.searchForm.startFinishDate = date || ''
      this.searchForm.endFinishDate = ''
      this.endFinishOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 更新结束时间改变处理
    endFinishChange (date) {
      this.searchForm.endFinishDate = date || ''
    },
    // 申请开始时间改变处理
    startApplayChange (date) {
      this.searchForm.startApplayDate = date || ''
      this.searchForm.endApplayDate = ''
      this.endFinishOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 申请结束时间改变处理
    endApplayChange (date) {
      this.searchForm.endApplayDate = date || ''
    },
    // table表格选择
    selectChange (arr) {
      this.orders = []
      arr.forEach(item => {
        this.orders.push({
          applyId: item['applyId'],
          orderType: item['orderType'],
          treatyNo: item['treatyNo']
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
          type: 'signing'
        }
      }
      let desc = obj.applyName
      if (!obj.applyName) {
        desc = obj.applyId
      }
      this.$emit('addTab', desc + '', queryObj)
      this.$router.push(queryObj)
    },
    // 上传CFS
    uploadCFS (obj) {
      this.$alert('此操作将进行上传CFS', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/work/waitDeal/uploadCFS',
              data: {
                applyId: obj.applyId,
                treatyNo: obj.treatyNo
              },
              success: () => {
                this.searchHandle()
                this.$message({
                  type: 'success',
                  message: '上传CFS成功!'
                })
              },
              fail: (error) => {
                this.$msg(error.message)
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.exportSearchParams = this.searchForm
      // 缓存查询条件
      this.$setStore('signing', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/work/signing/querySigningList',
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
      if (this.searchForm.orgId) {
        this.getGroupList()
      } else {
        this.searchForm.groupName = ''
        this.searchForm.teamName = ''
        this.groupNameList = []
      }
    },
    // 改变组名的状态
    changeGroupHandle () {
      if (this.searchForm.groupName) {
        this.getTeamList()
      } else {
        this.searchForm.teamName = ''
        this.teamNameList = []
      }
    },
    // 获取组列表
    getGroupList () {
      this.$ajax({
        url: '/store/account/user/comm/queryOrgGroupList',
        data: {
          orgId: this.searchForm.orgId,
          fullLoading: true
        },
        success: data => {
          this.groupNameList = data.rows || []
          this.searchForm.groupName = ''
        }
      })
    },
    // 获取队列表
    getTeamList () {
      if (!this.searchForm.groupName) {
        return
      }
      this.$ajax({
        url: '/store/account/user/comm/queryOrgTeamList',
        data: {
          orgId: this.searchForm.orgId,
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
