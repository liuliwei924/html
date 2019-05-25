<template>
  <div class="content-box">
    <div class="header__title">所有申请列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始日期:">
          <el-date-picker
            v-model="searchForm.startTime"
            type="date"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:">
          <el-date-picker
            v-model="searchForm.endTime"
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
            v-model="searchForm.applyName"
            placeholder="输入贷款人姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="城市:">
          <el-select
            v-model="searchForm.cityName"
            filterable
            clearable
            placeholder="请选择申请城市">
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
        <el-form-item label="客户等级:">
          <el-select
            v-model="searchForm.custLabel"
            clearable
            placeholder="请选择客户等级">
            <el-option
              v-for="val,key,index in custLabel"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店状态:">
          <el-select
            v-model="searchForm.orderStatus"
            clearable
            placeholder="请选择门店状态">
            <el-option
              v-for="item,key,index in orderStatusArr"
              :label="item.name"
              :value="item.val"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房产类型:">
          <el-select
            v-model="searchForm.houseType"
            clearable
            placeholder="请选择房产类型">
            <el-option
              v-for="val,key,index in houseType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有车:">
          <el-select
            v-model="searchForm.carType"
            clearable
            placeholder="请选择是否有车">
            <el-option
              v-for="val,key,index in carType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否投保:">
          <el-select
            v-model="searchForm.insure"
            clearable
            placeholder="请选择保单">
            <el-option
              v-for="val,key,index in insure"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请金额(万元):">
          <el-select
            v-model="searchForm.loanAmount"
            clearable
            placeholder="请选择申请金额">
            <el-option
              v-for="val,key,index in loanAmount"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微粒贷额度(元):">
          <el-select
            v-model="searchForm.havePinan"
            clearable
            placeholder="请选择微粒贷">
            <el-option
              v-for="val,key,index in havePinan"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有公积金:">
          <el-select
            v-model="searchForm.fundType"
            clearable
            placeholder="请选择是否有公积金">
            <el-option
              v-for="val,key,index in fundType"
              :label="val"
              :value="Number(key)"
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
              v-for="val,key,index in socialType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工资发放形式:">
          <el-select
            v-model="searchForm.wagesType"
            clearable
            placeholder="请选择工资发放形式">
            <el-option
              v-for="val,key,index in wagesType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月收入:">
          <el-select
            v-model="searchForm.income"
            clearable
            placeholder="请选择月收入">
            <el-option
              v-for="val,key,index in incomeData"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="芝麻信用分:">
          <el-select
            v-model="searchForm.zimaScore"
            clearable
            placeholder="请选择芝麻信用分">
            <el-option
              v-for="val,key,index in zimaScore"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.age"
            placeholder="年龄">
          </el-input>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button icon="setting" @click="joinForeign">加入第三方</el-button>
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
        label="姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号"
        min-width="120">
      </el-table-column>
      <el-table-column
        min-width="140"
        prop="loanAmount"
        label="申请金额(万元)">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="applyCount"
        label="申请次数">
      </el-table-column>
      <el-table-column
        min-width="200"
        prop="applyTime"
        label="申请时间">
      </el-table-column>
      <el-table-column
        min-width="140"
        prop="haveWeiLi"
        label="微粒贷额度(元)">
      </el-table-column>
      <el-table-column
        min-width="140"
        prop="zimaScore"
        label="芝麻信用分">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="age"
        label="年龄">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="channelDetail"
        label="来源">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="cityName"
        label="城市">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="isAllot"
        label="是否分配"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="门店状态"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="custLabel"
        label="客户等级(标星)"
        min-width="200">
        <template slot-scope="scope">{{custLabel[scope.row.custLabel]}}</template>
      </el-table-column>
      <el-table-column
        prop="houseType"
        label="房产类型"
        min-width="120">
        <template slot-scope="scope">{{houseType[scope.row.houseType]}}</template>
      </el-table-column>
      <el-table-column
        prop="carType"
        label="是否有车"
        min-width="120">
        <template slot-scope="scope">{{carType[scope.row.carType]}}</template>
      </el-table-column>
      <el-table-column
        prop="insure"
        label="是否投保"
        min-width="120">
        <template slot-scope="scope">{{insure[scope.row.insure]}}</template>
      </el-table-column>
      <el-table-column
        prop="fundType"
        label="是否有公积金"
        min-width="120">
        <template slot-scope="scope">{{fundType[scope.row.fundType]}}</template>
      </el-table-column>
      <el-table-column
        prop="socialType"
        label="是否有社保"
        min-width="120">
        <template slot-scope="scope">{{socialType[scope.row.socialType]}}</template>
      </el-table-column>
      <el-table-column
        prop="income"
        label="月收入"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="wagesType"
        label="工资发放形式"
        min-width="120">
        <template slot-scope="scope">{{wagesType[scope.row.wagesType]}}</template>
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="assetInfo"
        label="资产描述"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="130">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 导出-->
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
          <input type="text" name="exportParams" v-model="exportParams">
          <input type="text" name="exportTitles" v-model="exportTitles">
          <input type="text" name="signId" v-model="signId">
          <input type="text" name="exportType" value="reserving">
    </form>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      @size-change="handleSizeChange"
      :page-sizes="[10, 30, 50]"
      :page-size="searchForm.everyPage"
      layout="total, sizes, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <!-- 模块组件 -->
    <join-foreign
      v-model="otherShow"
      :userOrgs="userOrgs"
      :externalUser="externalUser"
      :orders="orders"
      :joinRows="joinRows"
      @change="otherChange" />
  </div>
</template>

<script>
import JoinForeign from '@/components/count/JoinForeign'
import {expireStore} from '@/utils/utils'
// 预约中页面
export default {
  name: 'reserving',
  data () {
    let {today} = this.$searchDate()
    let userRole = this.$localStorage('userRole') === '1'
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    // 缓存查询条件
    let store = this.$getStore('allApplyCount')
    return {
      exportPath: this.$baseURL + 'store/account/user/export/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      activeClass: 'active',
      errorClass: 'span',
      titileBar: '所有申请列表',
      joinArr: [],
      joinRows: [],
      searchForm: {
        orgId: store['orgId'] || '',
        cityName: store['cityName'] || '',
        status: store['status'] || '',
        orderStatus: store['orderStatus'] || '',
        custLabel: store['custLabel'],
        // 管理员角色(userRole=1)加上默认的搜索时间
        startTime: today,
        endTime: '',
        applyName: store['applyName'] || '',
        channelDetail: store['channelDetail'] || '',
        currentPage: store['currentPage'] || 1,
        houseType: store['houseType'] || '',
        carType: store['carType'] || '',
        insure: store['insure'] || '',
        loanAmount: store['loanAmount'] || '',
        havePinan: store['havePinan'] || '',
        fundType: store['fundType'] || '',
        socialType: store['socialType'] || '',
        wagesType: store['wagesType'] || '',
        income: store['income'] || '',
        zimaScore: store['zimaScore'] || '',
        age: store['age'] || '',
        everyPage: 10
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      totalRecord: 1,
      applyId: '', // 申请ID
      otherShow: false, // 弹窗是否显示
      userOrgs, // 门店数据
      externalUser: [], // 外部人员渠道信息
      cityList, // 城市数据
      orders: [], // table选中
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
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
      // 门店跟进状态
      orderStatusArr: [
        {val: -1, name: '-1：待跟进:尚未跟进客户'},
        {val: 0, name: '0：跟进过:未了解客户'},
        {val: 1, name: '1：未上门待签约'},
        {val: 2, name: '2：已上门待签约'},
        {val: 3, name: '3：已上门签约'},
        {val: 4, name: '4：进件审核中'},
        {val: 5, name: '5：银行已放款'},
        {val: 6, name: '6：银行已拒绝'},
        {val: 7, name: '7：无可贷点，同行，捣乱无效客户'},
        {val: 8, name: '8：空号/错号'}
      ],
      // 状态
      status: {
        0: '待处理',
        1: '客服锁定中',
        2: '门店锁定中',
        3: '可转化',
        4: '转化中',
        5: '转化成功',
        6: '转化失败',
        7: '门店退回',
        8: '过期失效'
      },
      // 房产类型
      houseType: {
        1: '其他房产',
        2: '无房产',
        3: '商品房(按揭)',
        4: '商品房(全款)',
        5: '军产房',
        6: '办公楼',
        7: '厂房',
        8: '商铺',
        9: '自建房/小产权房',
        10: '经适/限价房',
        11: '房改/危改房',
        12: '福利房'
      },
      // 是否有车
      carType: {
        1: '其他车',
        2: '无车',
        3: '贷款车',
        4: '全款车',
        5: '无车、准备购买'
      },
      // 保单
      insure: {
        0: '无',
        1: '有'
      },
      // 公积金
      fundType: {
        1: '有本地公积金',
        2: '无'
      },
      // 社保
      socialType: {
        1: '有本地社保',
        2: '无'
      },
      // 工资发放形式
      wagesType: {
        0: '未知',
        1: '打卡',
        2: '现金'
      },
      // 申请金额
      loanAmount: {
        1: '1万以下',
        2: '1-3万',
        3: '3-5万',
        4: '5万以上'
      },
      // 微粒贷
      havePinan: {
        1: '1万以下',
        2: '1-3万',
        3: '3-5万',
        4: '5万以上'
      },
      // 月收入
      incomeData: {
        1: '3千以下',
        2: '3-5千',
        3: '5-8千',
        4: '8千以上'
      },
      // 芝麻信用
      zimaScore: {
        399: '400分以内',
        499: '400-500分',
        599: '500-600分',
        699: '600-700分',
        799: '700分以上'
      }
    }
  },
  created () {
    this.searchHandle()
    this.getExternalUser()
  },
  methods: {
    handleSizeChange (val) {
      this.searchForm['everyPage'] = val
      this.searchForm.currentPage = 1
      this.searchHandle()
    },
    exportData () {
      let params = {}
      let roleType = this.$localStorage('userRole')
      Object.assign(params, this.searchForm, {
        roleType
      })
      this.exportParams = JSON.stringify(params)
      this.signId = expireStore('signId')
      let title = [
        {'name': 'applyName', 'title': '客户姓名'},
        {'name': 'custLabelText', 'title': '客户等级(标星)'},
        {'name': 'telephone', 'title': '客户手机'},
        {'name': 'bookTime', 'title': '预约时间'},
        {'name': 'handleTime', 'title': '处理时间'},
        {'name': 'handleDesc', 'title': '处理描述'},
        {'name': 'currentDeal', 'title': '处理业务员'},
        {'name': 'groupName', 'title': '所属组名'},
        {'name': 'teamName', 'title': '所属队名'},
        {'name': 'orderTypeText', 'title': '经手类型'},
        {'name': 'orgName', 'title': '处理门店'}
      ]
      this.exportTitles = JSON.stringify(title)
      let formDom = document.getElementById('JS-form-export')
      window.setTimeout(function () {
        formDom.submit()
      }, 100)
    },
    // 开始时间改变
    startDateChange (date) {
      this.searchForm.startTime = date || ''
      this.searchForm.endTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变
    endDateChange (date) {
      this.searchForm.endTime = date || ''
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
    // table表格选择
    selectChange (arr) {
      this.joinArr = arr
      this.orders = []
      arr.forEach(item => {
        this.orders.push({
          applyId: item['applyId'],
          orderType: item['orderType']
        })
      })
    },
    // 加入第三方
    joinForeign () {
      if (this.orders.length === 0) {
        this.$msg('请至少选择一个订单!')
      } else {
        let arr = this.joinArr.concat([])
        for (let i = 0; i < arr.length; i++) {
          for (let key in arr[i]) {
            if (typeof arr[i][key] === 'number') {
              if (key === 'houseType') { arr[i][key] = this.houseType[arr[i][key]] }
              if (key === 'carType') { arr[i][key] = this.carType[arr[i][key]] }
              if (key === 'insure') { arr[i][key] = this.insure[arr[i][key]] }
              if (key === 'fundType') { arr[i][key] = this.fundType[arr[i][key]] }
              if (key === 'socialType') { arr[i][key] = this.socialType[arr[i][key]] }
              if (key === 'wagesType') { arr[i][key] = this.wagesType[arr[i][key]] }
            }
          }
        }
        this.joinRows = arr
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
      if (!this.searchForm['startTime']) {
        this.$msg('开始日期不能为空')
        return
      }
      this.tableData = []
      // 缓存查询条件
      this.$setStore('allApplyCount', Object.assign({}, this.searchForm), ['startTime', 'endTime'])
      this.$ajax({
        url: '/store/account/dataset/allApplyCount/queryAllApplayList',
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
    // 获取外部渠道人员信息
    getExternalUser () {
      this.$ajax({
        url: '/store/account/user/comm/queryExternalUser',
        success: data => {
          this.externalUser = data.rows || []
        }
      })
    }
  },
  components: {
    JoinForeign
  }
}
</script>
