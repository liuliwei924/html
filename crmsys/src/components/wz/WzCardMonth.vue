<template>
  <div class="content-box">
    <div class="header__title">微名片统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始月份:">
          <el-date-picker
            v-model="searchForm.startRecordMonth"
            type="month"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束月份:">
          <el-date-picker
            v-model="searchForm.endRecordMonth"
            type="month"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束月份">
          </el-date-picker>
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
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
         <el-button @click="exportData()" v-if="isExport" class="export-btn">导出</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="3">今日</el-radio>
        <el-radio :label="1">本月</el-radio>
        <el-radio :label="2">月度</el-radio>
      </el-radio-group>
    </div>
       <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border
      :summary-method="getSummaries"
      show-summary>
        <el-table-column
          width="120"
          prop="recordDate"
          align="center"
          label="记录日期">
        </el-table-column>
      <el-table-column
        prop="gzhId"
        label="公众号"
        align="center"
        min-width="100">
        <template slot-scope="scope">{{gzhId[scope.row.gzhId]}}</template>
      </el-table-column>
        <el-table-column
          width="120"
          prop="allUserCount"
          align="center"
          label="总用户数量">
        </el-table-column>
        <el-table-column
          width="120"
          prop="oneVipCount"
          align="center"
          label="一年会员数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="twoVipCount"
          align="center"
          label="两年会员数">
        </el-table-column>
        <el-table-column
          width="120"
          prop="comUserCount"
          align="center"
          label="企业用户数">
        </el-table-column>
        <el-table-column
          prop="comJoinCount"
          min-width="120"
          align="center"
          label="企业加盟数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="perJoinCount"
          align="center"
          label="个人加盟数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="inviteCount"
          align="center"
          label="邀请人数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="signCount"
          align="center"
          label="签到人数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="conSignCount"
          align="center"
          label="连续签到数">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="conSign30Count"
          align="center"
          label="连续签到30天数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="colTempCount"
          align="center"
          label="收藏模板数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="colArtCount"
          align="center"
          label="收藏文章数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="noEditCardCount"
          align="center"
          label="未编辑名片数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="excCardCount"
          align="center"
          label="交换名片数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="shareArtCount"
          align="center"
          label="分享文章数">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="shareCardCount"
          align="center"
          label="分享名片数">
        </el-table-column>
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
    <!-- 导出 -->
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
          <input type="text" name="exportParams" v-model="exportParams">
          <input type="text" name="exportTitles" v-model="exportTitles">
          <input type="text" name="signId" v-model="signId">
          <input type="text" name="exportType" value="wzCardMonth">
    </form>
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
// 总的统计月度
export default {
  name: 'all-month',
  data () {
    let {curMonth, lastMonth} = this.$monthDate()
    let userRole = this.$localStorage('userRole') === '1'
    let isExport = userRole && this.$localStorage('allOrgs') === 'all'
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('wzCardMonth')
    return {
      status: 2,
      exportPath: this.$baseURL + 'store/account/user/exportext/exportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      activeClass: 'active',
      errorClass: 'span',
      titileBar: '微名片月度统计列表',
      searchForm: {
        startRecordMonth: lastMonth,
        endRecordMonth: curMonth,
        gzhId: '',
        currentPage: store['currentPage'] || 1
      },
      isExport, // 是否可以导出
      loading: false,
      tableData: [],
      sumTotalData: {},
      groupNameList: [], // 门店组名列表
      userOrgs, // 门店数据
      totalRecord: 1,
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
      }
    }
  },
  created () {
    this.searchHandle()
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    getSummaries (param) {
      let nines = ['allUserCountSum', 'oneVipCountSum', 'twoVipCountSum', 'comUserCountSum', 'comJoinCountSum', 'perJoinCountSum', 'inviteCountSum', 'signCountSum', 'conSignCountSum', 'conSign30CountSum', 'colTempCountSum', 'colArtCountSum', 'noEditCardCountSum', 'excCardCountSum', 'shareArtCountSum', 'shareCardCountSum']
      let sums = ['总计', '']
      let arr = []
      for (let i = 0; i < nines.length; i++) {
        arr[i] = this.sumTotalData[nines[i]]
      }
      return sums.concat(arr)
    },
    // 查询总计求和
    queryWzCardMonthSum () {
      this.sumTotalData = []
      // 缓存查询条件
      this.$ajax({
        url: '/store/account/wz/wzCardCount/queryWzCardMonthSum',
        data: this.searchForm,
        success: data => {
          this.sumTotalData = data.rows[0] || {}
        }
      })
    },
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startRecordMonth = date || ''
      this.searchForm.endRecordMonth = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
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
        {'name': 'recordDate', 'title': '记录日期'},
        {'name': 'gzhIdText', 'title': '公众号'},
        {'name': 'allUserCount', 'title': '总用户数量'},
        {'name': 'oneVipCount', 'title': '一年会员数'},
        {'name': 'twoVipCount', 'title': '两年会员数'},
        {'name': 'comUserCount', 'title': '企业用户数'},
        {'name': 'comJoinCount', 'title': '企业加盟数'},
        {'name': 'perJoinCount', 'title': '个人加盟数'},
        {'name': 'conSignCount', 'title': '连续签到数'},
        {'name': 'signCount', 'title': '签到人数'},
        {'name': 'conSign30Count', 'title': '连续签到30天数'},
        {'name': 'colTempCount', 'title': '收藏模板数'},
        {'name': 'colArtCount', 'title': '收藏文章数'},
        {'name': 'excCardCount', 'title': '交换名片数'},
        {'name': 'noEditCardCount', 'title': '未编辑名片数'},
        {'name': 'inviteCount', 'title': '邀请人数'},
        {'name': 'shareArtCount', 'title': '分享文章数'},
        {'name': 'shareCardCount', 'title': '分享名片数'}
      ]
      this.exportTitles = JSON.stringify(title)
      let formDom = document.getElementById('JS-form-export')
      window.setTimeout(function () {
        formDom.submit()
      }, 100)
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endRecordMonth = date || ''
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
       // 缓存查询条件
      this.$setStore('wzCardMonth', this.searchForm, ['startRecordMonth', 'endRecordMonth'])
      this.$ajax({
        url: '/store/account/wz/wzCardCount/queryWzCardMonth',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
      this.queryWzCardMonthSum()
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>