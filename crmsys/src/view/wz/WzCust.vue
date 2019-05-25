<template>
  <div class="content-box">
    <div class="header__title">用户管理</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="注册时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="充值时间-起:">
          <el-date-picker
            v-model="searchForm.recStartDate"
            type="date"
            editable
            :picker-options="recStartDateOptions"
            @change="recStartDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="充值时间-止:">
          <el-date-picker
            v-model="searchForm.recEndDate"
            type="date"
            editable
            :picker-options="recEndDateOptions"
            @change="recEndDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户姓名或手机号:">
          <el-input
            v-model="searchForm.searchKey"
            placeholder="请输入用户姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="推荐用户姓名:">
          <el-input
            v-model="searchForm.refCustName"
            placeholder="请输入推荐用户姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="公众号:">
          <el-select
            v-model="searchForm.gzhId"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in gzhId"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型:">
          <el-select
            v-model="searchForm.custType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in custType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态:">
          <el-select
            v-model="searchForm.userStatus"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in userStatus"
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
        <el-form-item label="最后登录时间:">
          <el-date-picker
            v-model="searchForm.lastLoginTime"
            type="date"
            editable
            placeholder="最后登录日期">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="realName"
        label="用户姓名"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="gzhId"
        label="公众号"
        align="center"
        min-width="100">
        <template slot-scope="scope">{{gzhId[scope.row.gzhId]}}</template>
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="用户手机号码"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司名称"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="position"
        label="职位"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="custType"
        label="用户类型"
        align="center"
        min-width="120">
        <template slot-scope="scope">{{custType[scope.row.custType]}}</template>
      </el-table-column>
      <el-table-column
        prop="userStatus"
        label="用户状态"
        align="center"
        min-width="120">
        <template slot-scope="scope">{{userStatus[scope.row.userStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="refCustName"
        label="推荐人"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="vipEndDate"
        label="vip到期时间"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="rechargeTime"
        label="充值时间"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="最后登录时间"
        align="center"
        min-width="120">
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
  </div>
</template>

<script>
export default {
  name: 'wzCust',
  data () {
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let {lastWeekDay} = this.$searchDate()
    let showStartDate = lastWeekDay || ''
    // 缓存查询条件
    let wzCust = this.$getStore('wzCust')
    return {
      tableData: [],
      totalRecord: 0,
      addShow: false,
      editShow: false,
      loading: false,
      searchForm: {
        searchKey: wzCust['searchKey'] || '',
        custType: wzCust['custType'] || '',
        gzhId: wzCust['gzhId'],
        userStatus: wzCust['userStatus'] || '',
        refCustName: wzCust['refCustName'] || '',
        startDate: wzCust['startDate'] || showStartDate,
        endDate: wzCust['endDate'] || '',
        recStartDate: wzCust['recStartDate'] || '',
        recEndDate: wzCust['recEndDate'] || '',
        lastLoginTime: wzCust['lastLoginTime'] || '',
        currentPage: 1
      },
      cityList,
      auditShow: false,
      // 用户类型
      custType: {
        1: '普通用户',
        2: 'vip用户',
        3: '企业用户'
      },
      // 用户状态
      userStatus: {
        0: '未编辑名片',
        1: '已编辑名片'
      },
      // 公众号
      gzhId: {
        6: '小小攒钱',
        10: '保保助手',
        9: '房地产经济之家',
        11: '小小金融',
        20: '小小展业'
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
      recStartDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      recEndDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
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
    recStartDateChange (date) {
      this.searchForm.recStartDate = date || ''
      this.searchForm.recEndDate = ''
      this.recEndDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    recEndDateChange (date) {
      this.searchForm.recEndDate = date || ''
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('wzCust', this.searchForm)
      this.$ajax({
        url: '/store/account/wz/wzCust/queryCustList',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>
