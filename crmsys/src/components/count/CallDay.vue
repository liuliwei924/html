<template>
  <div class="content-box">
    <div class="header__title">门店人员通话统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="所属门店:">
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
            @change="changeGroupHandle"
            clearable
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
        <el-form-item label="门店人员姓名或手机号:">
          <el-input
            v-model="searchForm.realName"
            placeholder="请输入人员姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select
            v-model="searchForm.roleType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in roleType"
              :label="val"
              :value="key"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
          <el-button @click="exportData()" v-if="isExport" class="export-btn">导出</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="1">今日</el-radio>
        <el-radio :label="2">本月</el-radio>
        <el-radio :label="3">月度</el-radio>
      </el-radio-group>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      @sort-change="sortEvent"
      :data="tableData"
      border>
       <el-table-column
          width="150"
          prop="recordDate"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="realName"
          width="100"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="orgName"
          width="120"
          label="门店名称">
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
          prop="cityName"
          width="100"
          label="城市">
        </el-table-column>
        <el-table-column
          prop="totalCount"
          width="150"
          sortable
          label="系统通话单数">
        </el-table-column>
        <el-table-column
          prop="callOutCount"
          width="120"
          sortable
          label="呼出单数">
        </el-table-column>
        <el-table-column
          prop="sucTotalCount"
          width="150"
          sortable
          label="成功通话单数">
        </el-table-column>
        <el-table-column
          width="150"
          sortable
          prop="sucCallOutCount"
          label="成功呼出单数">
        </el-table-column>
        <el-table-column
          width="180"
          sortable
          prop="callCount60"
          label="1分钟以上通话单数">
        </el-table-column>
        <el-table-column
          prop="callCount180"
          sortable
          width="180"
          label="3分钟以上通话单数">
        </el-table-column>
        <el-table-column
          prop="sucBookCount"
          width="100"
          sortable
          label="上门量">
        </el-table-column>
        <el-table-column
          prop="totalDuration"
          width="150"
          sortable
          label="总通话时长/分">
        </el-table-column> 
        <el-table-column
          prop="exterCallCount"
          width="180"
          sortable
          label="非系统客户通话单数">
        </el-table-column>
        <el-table-column
          prop="exterDuration"
          width="200"
          sortable
          label="非系统客户通话时长/分">
        </el-table-column>
        <el-table-column
          prop="exterCallCount60"
          width="210"
          sortable
          label="非系统1分钟以上通话单数">
        </el-table-column>
        <el-table-column
          prop="exterCallCount180"
          width="210"
          sortable
          label="非系统3分钟以上通话单数">
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
// 门店人员通话统计
export default {
  name: 'call-day',
  data () {
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userRole = this.$localStorage('userRole') === '1' || this.$localStorage('userRole') === '7' // 管理员或门店经理
    let isExport = userRole
    // 缓存查询条件
    let store = this.$getStore('callDay')
    return {
      status: 1,
      signId: '',
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'storeCallDay',
        exportParams: ''
      },
      defileName: 'callDay',
      searchForm: {
        orgId: store['orgId'] || '',
        groupName: store['groupName'] || '',
        teamName: store['teamName'] || '',
        cityName: store['cityName'] || '',
        realName: store['realName'] || '',
        roleType: store['roleType'] || '',
        currentPage: store['currentPage'] || 1
      },
      cityList,
      userOrgs,
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      groupNameList: [],
      teamNameList: [],
      totalRecord: 1,
      // 角色
      roleType: {
        3: '业务员',
        6: '门店负责人',
        7: '门店经理',
        8: '门店主管',
        9: '门店队长'
      }
    }
  },
  created () {
    this.searchHandle()
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    exportData () {
      this.$refs.sumExport.show = true
      this.signId = expireStore('signId')
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      this.exportSearchParams = this.searchForm
      // 缓存查询条件
      this.$setStore('callDay', this.searchForm)
      this.$ajax({
        url: '/store/account/dataset/queryRealDay',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 改变门店的状态
    changeOrgHandle () {
      if (this.searchForm.orgId) {
        this.getGroupList()
      } else {
        this.searchForm.groupName = ''
        this.groupNameList = []
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
    // 改变组名的状态
    changeGroupHandle () {
      if (this.searchForm.groupName) {
        this.getTeamList()
      } else {
        this.searchForm.teamName = ''
        this.teamNameList = []
      }
    },
    // 获取队列表
    getTeamList () {
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
    },
    sortEvent (column) {
      if (column.prop === null) {
        if (this.searchForm.hasOwnProperty('orderBy')) { delete this.searchForm['orderBy'] }
        if (this.searchForm.hasOwnProperty('orderValue')) { delete this.searchForm['orderValue'] }
      } else {
        this.searchForm.orderBy = column.prop
        this.searchForm.orderValue = column.order === 'ascending' ? 'asc' : 'desc'
      }
      this.searchHandle()
    },
    renderHeader (h, options, text) {
      let label = options.column.label
      return h('el-tooltip', {props: {content: text, placement: 'top'}}, [h('span', label)])
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    SumExport
  }
}
</script>