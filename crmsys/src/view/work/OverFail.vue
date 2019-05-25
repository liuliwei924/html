<template>
  <div class="content-box">
    <div class="header__title">过期失效</div>
    <div class="kf-box">
      <el-form :inline="true" :model="searchForm" class="header__search clearfix">
        <div @keyup.enter="searchHandle()">
          <el-form-item>
            <el-date-picker
              v-model="startTime"
              type="datetime"
              :editable="true"
              placeholder="开始日期"
              @change="startTimeHandle($event)"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="endTime"
              type="datetime"
              :editable="true"
              placeholder="结束日期"
              @change="endTimeHandle($event)"
              :picker-options="endTimeOptions"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.applyName" placeholder="输入贷款人姓名或手机号" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.cityName" filterable clearable placeholder="请选择申请城市">
              <el-option v-for="(city,index) in citys" :label="city" :value="city" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.channelDetail" placeholder="输入渠道来源" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.applyType" clearable placeholder="请选择单子类型">
              <el-option label="优质单" value="1"></el-option>
              <el-option label="普通单" value="2"></el-option>
              <el-option label="垃圾单" value="3"></el-option>
              <el-option label="小贷客户" value="4"></el-option>
              <el-option label="微店单" value="5"></el-option>
              <el-option label="准优质单" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.status" clearable placeholder="请选择状态">
              <el-option label="待处理" value="0"></el-option>
              <el-option label="客服锁定中" value="1"></el-option>
              <el-option label="门店锁定中" value="2"></el-option>
              <el-option label="可转化" value="3"></el-option>
              <el-option label="转化中" value="4"></el-option>
              <el-option label="转化成功" value="5"></el-option>
              <el-option label="转化失败" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.kfName" placeholder="输入客服" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.recorderName" placeholder="输入录入人" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchHandle()" class="kf-btn" :loading="searchLoading">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="kf-desk-check">
        <el-checkbox-group v-model="checkDesk" @change="checkHandle">
          <el-checkbox v-for="(desk,index) in deskOpts" :label="desk" :key="index"></el-checkbox>
        </el-checkbox-group>
      </div>
      <el-table class="content__table"
        :data="tableData">
        <el-table-column
          min-width="80"
          prop="applyId"
          label="申请ID">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="applyName"
          label="姓名">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="telephone"
          label="手机号">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="loanAmount"
          label="申请金额(万元)">
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="applyTime"
          label="申请时间">
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
          min-width="100"
          prop="applyTypeText"
          label="类型">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="applyCount"
          label="申请次数">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="客服状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.kfStatus === '未跟进' ? 'primary' : 'gray'">{{scope.row.kfStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="kfRealName"
          label="客服处理人">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="lastKfDesc"
          label="客服处理描述"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="lastKfTime"
          label="客服最近处理时间">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="recorderName"
          label="录入人">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="门店状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.storeStatus === '未跟进' ? 'primary' : 'gray'">{{scope.row.storeStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="storeRealName"
          label="门店处理人">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="orgName"
          label="所属门店">
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
          width="100">
          <template slot-scope="scope">
            <el-button @click="editHandle(scope.row)" type="text" size="small" v-if="isEdit">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="xxjr-fr">
        <el-pagination
          @current-change="pageHandle"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
let deskOpt = ['我处理的', '所有处理的']
let d = new Date()
let msec = ((d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds()) * 1000
let date = new Date(Date.now() - 7 * 8.64e7 - msec)
export default {
  name: 'over-fail',
  data () {
    let initForm = this.initSearchForm(this.$route.query)
    return {
      isEdit: false,
      signId: '',
      searchForm: {
        overFail: initForm['overFail'],
        startTime: initForm['startTime'],
        endTime: initForm['endTime'],
        applyName: initForm['applyName'],
        cityName: initForm['cityName'],
        channelDetail: initForm['channelDetail'],
        applyType: initForm['applyType'],
        status: initForm['status'],
        kfName: initForm['kfName'],
        recorderName: initForm['recorderName'],
        searchType: initForm['searchType']
      },
      startTime: initForm['sTime'],
      endTime: initForm['eTime'],
      endTimeOptions: {},
      citys: [],
      checkDesk: initForm['checkDesk'],
      deskOpts: deskOpt,
      tableData: [],
      applyTypes: ['', '优质单', '普通单', '垃圾单', '小贷客户', '微店单', '准优质单'],
      status: ['待处理', '客服锁定中', '门店锁定中', '可转化', '转化中', '转化成功', '转化失败', '门店退回', '过期失效'],
      kfStatus: ['未跟进', '跟进中', '转门店', '转普通单', '转黑名单', '跟进受阻', '挂卖处理'],
      storeStatus: ['未跟进', '继续跟进', '成功预约', '签单', '放款', '失败', '回款'],
      totalRecord: 0,
      currentPage: initForm['currentPage'],
      searchLoading: false
    }
  },
  created () {
    !Object.keys(this.$route.query).length ? this.searchHandle(1) : this.searchHandle(2)
    this.citys = this.$localStorage('city').split(',')
    // 获取权限
    let menuCode = this.$route.path.split('/')[2]
    let checkUrl = this.$localStorage('kfCheckMenus')
    if (checkUrl.indexOf(menuCode) >= 0) {
      this.isEdit = true
    }
  },
  watch: {
    '$route' (to, from) {
      if (!Object.keys(to.query).length) {
        this.searchHandle(3)
      }
    }
  },
  methods: {
    initSearchForm (query) {
      let check = [deskOpt[1]]
      let type = 2
      if (Number(query['searchType']) === 0) {
        check = []
        type = ''
      } else if (Number(query['searchType']) === 1) {
        check = [deskOpt[0]]
        type = 1
      }
      let startTime = query['startTime']
      let sTime = new Date(query['startTime'])
      if (query.hasOwnProperty('startTime')) {
        if (!startTime) {
          startTime = ''
          sTime = ''
        }
      } else {
        startTime = this.$time(date)
        sTime = date
      }
      return {
        overFail: 1,
        startTime: startTime,
        endTime: query['endTime'] || '',
        applyName: query['applyName'] || '',
        cityName: query['cityName'] || '',
        channelDetail: query['channelDetail'] || '',
        applyType: query['applyType'] || '',
        status: query['status'] || '',
        kfName: query['kfName'] || '',
        recorderName: query['recorderName'] || '',
        searchType: type,
        sTime: sTime,
        eTime: query['endTime'] ? new Date(query['endTime']) : '',
        checkDesk: check,
        currentPage: Number(query['currentPage']) || 1
      }
    },
    startTimeHandle (start) {
      // 开始时间选择
      this.searchForm.startTime = start || ''
      this.endTimeOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(start).getTime() - 8.64e7
        }
      }
    },
    endTimeHandle (end) {
      // 结束时间处理
      this.searchForm.endTime = end || ''
    },
    checkHandle (value) {
      // 选择搜索
      value.length > 1 && value.shift()
      if (value.length > 0) {
        if (value[0] === this.deskOpts[0]) {
          this.searchForm.searchType = 1
        } else {
          this.searchForm.searchType = 2
        }
      } else {
        this.searchForm.searchType = ''
      }
      this.searchHandle(5)
    },
    searchHandle (arg) {
      // 搜索处理
      let query = this.$route.query
      let params = this.$extend(query, this.searchForm)
      if (arg === 1) {
        params = this.searchForm
        delete params.signId
      } else if (arg === 2) {
        params = this.$extend(params, {currentPage: this.currentPage})
        delete params.signId
        this.$router.push({path: 'overFail', query: params})
      } else if (arg === 3) {
        let initForm = this.initSearchForm({})
        this.searchForm = {
          overFail: initForm['overFail'],
          startTime: initForm['startTime'],
          endTime: initForm['endTime'],
          applyName: initForm['applyName'],
          cityName: initForm['cityName'],
          channelDetail: initForm['channelDetail'],
          applyType: initForm['applyType'],
          status: initForm['status'],
          kfName: initForm['kfName'],
          recorderName: initForm['recorderName'],
          searchType: initForm['searchType']
        }
        this.startTime = initForm['sTime']
        this.endTime = initForm['eTime']
        this.checkDesk = initForm['checkDesk']
        this.currentPage = initForm['currentPage']
        params = this.searchForm
        delete params.signId
      } else if (arg === 4) {
        params = this.$extend(params, {currentPage: this.currentPage})
        delete params.signId
        if (!Object.keys(query).length && this.currentPage === 1) {
          return
        } else {
          this.$router.push({path: 'overFail', query: params})
        }
      } else if (arg === 5) {
        delete params.signId
        this.$router.push({path: 'overFail', query: params})
      } else {
        delete params.signId
        this.$router.push({path: 'overFail', query: params})
      }
      this.searchLoading = true
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/work/overFail/queryOverFail',
          data: params,
          success: data => {
            this.searchLoading = false
            this.totalRecord = data.page.totalRecords
            this.tableData = data.rows
          }
        })
      }
    },
    pageHandle (val) {
      // 分页处理
      this.currentPage = val
      this.searchHandle(4)
    },
    editHandle (obj) {
      // 编辑处理
      let queryObj = {
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          storeSearchKey: this.searchForm.storeSearchKey
        }
      }
      let desc = obj.applyName
      if (!obj.applyName) {
        desc = obj.applyId
      }
      this.$parent.$emit('addTab', desc + '', queryObj)
      this.$router.push(queryObj)
    }
  }
}
</script>
