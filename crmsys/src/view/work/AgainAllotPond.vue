<template>
  <div class="content-box">
    <div class="header__title">网销分配池</div>
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
        <el-form-item label="入池时间-起:">
          <el-date-picker
            v-model="searchForm.startRecordDate"
            type="date"
            editable
            :picker-options="startRecordDateOptions"
            @change="startRecordDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入池时间-止:">
          <el-date-picker
            v-model="searchForm.endRecordDate"
            type="date"
            editable
            :picker-options="endRecordDateOptions"
            @change="endRecordDateChange"
            placeholder="结束日期">
          </el-date-picker>
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
        <el-form-item label="客户姓名或者手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeRealName"
            placeholder="客户姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="上次业务处理人:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.realName"
            placeholder="上次业务处理人">
          </el-input>
        </el-form-item>
        <el-form-item label="渠道来源:" v-if="adminRole">
          <el-input
            class="kf-search-input"
            v-model="searchForm.channelDetail"
            placeholder="渠道来源">
          </el-input>
        </el-form-item>
        <el-form-item label="渠道类型:">
          <el-select
            v-model="searchForm.channelType"
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
        <el-form-item label="单子类型:">
          <el-select
            v-model="searchForm.isCost"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in isCost"
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
      <!-- <el-button icon="setting" @click="batchOrder">批量分单</el-button> -->
      <el-button icon="setting" @click="manualAllot" v-if="showCheck">手工分单</el-button>
      <el-upload 
         class="upload-demo"
              :action="excelPath"
               accept="xls"
              :data="excelForm"
              :show-file-list="false"
              :before-upload="beforeUp"
              :on-success="upSuccess">
              <el-button  size="small" icon="upload" type="primary" class="excelBtn"  @click.stop="uploadBtn" :disabled="loading">导入</el-button>
      </el-upload>
      <el-button icon="setting" @click="transferOrg" v-if="adminRole">转门店</el-button>
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
        label="申请金额(万)"
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
        prop="realName"
        label="上次处理人"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="分配类型"
        min-width="100">
        <template slot-scope="scope">{{orderType[scope.row.orderType]}}</template>
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="nextRecordDate"
        label="再分配时间"
        min-width="180">
      </el-table-column>
       <el-table-column
        prop="recordDate"
        label="入池时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="handleDesc"
        label="入池原因"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="assetInfo"
        label="资产描述"
        min-width="200">
      </el-table-column> 
      <el-table-column
        label="渠道来源"
        min-width="200"
        v-if="adminRole">
        <template slot-scope="scope">
          {{scope.row.channelCode}}-{{scope.row.channelName}}
        </template>
      </el-table-column>
      <el-table-column
         prop="channelTypeText"
        label="渠道类型"
        min-width="120">
      </el-table-column>
      <el-table-column
         prop="isCostText"
        label="单子类型"
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
      @size-change="handleSizeChange"
      :page-sizes="[10, 30, 50]"
      :page-size="searchForm.everyPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRecord">
    </el-pagination>
    <manual-allot
      v-model="otherShow"
      :userOrgs="userOrgs"
      :orders="ids"
      @change="otherChange" />
    <transfer-org
      v-model="transOrgShow"
      :userOrgs="userOrgs"
      :orders="ids"
      @change="transOrgChange" />
  </div>
</template>

<script>
import ManualAllot from '@/components/work/ManualAllot'
import TransferOrg from '@/components/work/TransferOrg'
// 手工分单页面
export default {
  name: 'again-allotPond',
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
    let store = this.$getStore('allotOrder')
    return {
      showCheck: 0,
      searchForm: {
        // 管理员角色(isAuth=1、6、7)加上默认的搜索时间
        startDate: store['startDate'] || showStartDate,
        endDate: '',
        startRecordDate: store['startRecordDate'] || '',
        endRecordDate: store['endRecordDate'] || '',
        status: store['status'] || '',
        orderType: store['orderType'] || '',
        cityName: store['cityName'] || '',
        orgId: store['orgId'] || '',
        storeRealName: store['storeRealName'] || '',
        realName: store['realName'] || '',
        channelDetail: store['channelDetail'] || '',
        channelType: store['channelType'] || '',
        isCost: store['isCost'] || '',
        currentPage: store['currentPage'] || 1,
        everyPage: 10
      },
      loading: false,
      otherShow: false,
      transOrgShow: false,
      currentPage3: 1,
      tableData: [],
      totalRecord: 1,
      adminRole, // 管理员权限
      cityList, // 城市数据
      userOrgs, // 门店数据
      ids: [], // table选中
      excelPath: this.$baseURL + 'store/account/work/againAllotPond/importInfo',
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
      // 开始时间禁用
      startRecordDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endRecordDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 单子类型
      orderType: {
        1: '新申请',
        2: '再分配'
      },
      // 渠道类型
      channelType: {
        1: '自有平台',
        2: '推广渠道',
        3: 'API接口',
        4: '历史数据',
        6: '测试数据'
      },
      // 单子类型
      isCost: {
        1: '成本单',
        2: '测试单'
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
    startRecordDateChange (date) {
      this.searchForm.startRecordDate = date || ''
      this.searchForm.endRecordDate = ''
      this.endRecordDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endRecordDateChange (date) {
      this.searchForm.endRecordDate = date || ''
    },
    // table表格选择
    selectChange (arr) {
      this.ids = []
      arr.forEach(item => {
        this.ids.push({
          applyId: item['applyId']
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
    // 转门店
    transferOrg () {
      if (this.ids.length === 0) {
        this.$msg('请至少选择一个订单!')
      } else {
        this.transOrgShow = true
      }
    },
    // 转门店组件监听
    transOrgChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.transOrgShow = false
      } else {
        this.transOrgShow = val
      }
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('allotOrder', this.searchForm)
      this.$ajax({
        url: '/store/account/work/againAllotPond/queryAllotPond',
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
    // 文件上传之前处理
    beforeUp () {
      this.loading = true
    },
    // 文件上传成功处理
    upSuccess (res) {
      this.loading = false
      if (res.success) {
        if (res.message) {
          this.$msg(res.message)
        } else {
          this.$msg('导入成功！', 'success')
        }
        this.searchHandle()
      } else {
        this.$msg(res.message, 'error')
      }
    },
     // 文件上传处理
    uploadBtn () {
      let fileBtn = document.getElementsByClassName('el-upload__input')
      fileBtn[0].click()
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
    ManualAllot,
    TransferOrg
  }
}
</script>
