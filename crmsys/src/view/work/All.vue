<template>
  <div class="content-box">
    <div class="header__title">所有的</div>
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
          <el-select
            v-model="searchForm.cityName"
            filterable
            clearable
            placeholder="请选择城市">
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
        <el-form-item>
          <el-select v-model="searchForm.channelCode" filterable clearable placeholder="请选择渠道代号">
            <el-option
              v-for="(item,index) in channels"
              :label="item.channelCode"
              :value="item.channelCode" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.applyType" clearable placeholder="请选择单子类型">
              <el-option label="优质单" value="1"></el-option>
              <el-option label="普通单" value="2"></el-option>
              <el-option label="垃圾单" value="3"></el-option>
              <el-option label="小贷客户" value="4"></el-option>
              <el-option label="微店单" value="5"></el-option>
              <el-option label="准优质单" value="6"></el-option>
              <el-option label="优质客户" value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.allotFlag" clearable placeholder="请选择分配标志">
              <el-option
                v-for="(item, index) in allotFlags"
                :label="item"
                :value="index"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.grade" clearable placeholder="请选择等级">
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
              <el-option label="D" value="D"></el-option>
              <el-option label="E" value="E"></el-option>
              <el-option label="F" value="F"></el-option>
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
            <el-select v-model="searchForm.kfStatus" clearable placeholder="请选择客服状态">
              <el-option label="未跟进" value="0"></el-option>
              <el-option label="跟进中" value="1"></el-option>
              <el-option label="转门店" value="2"></el-option>
              <el-option label="转普通单" value="3"></el-option>
              <el-option label="转黑名单" value="4"></el-option>
              <el-option label="跟进受阻" value="5"></el-option>
              <el-option label="转信贷经理" value="6"></el-option>
              <el-option label="转其他小贷" value="7"></el-option>
              <el-option label="转优质客户" value="8"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.storeStatus" clearable placeholder="请选择门店状态">
              <el-option label="未跟进" value="0"></el-option>
              <el-option label="继续跟进" value="1"></el-option>
              <el-option label="成功预约" value="2"></el-option>
              <el-option label="签单" value="3"></el-option>
              <el-option label="回款" value="4"></el-option>
              <el-option label="不能做" value="5"></el-option>
              <el-option label="签单完成" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.custLabel" clearable placeholder="请选择星级">
              <el-option
                v-for="(item,index) in custLabels"
                :label="item"
                :value="index" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.kfName" placeholder="输入客服" class="kf-search-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.recorderName" placeholder="输入录入人" class="kf-search-input"></el-input>
          </el-form-item>
          <el-button @click="searchHandle()" :loading="searchLoading">查询</el-button>
          <el-button @click="exportData()" class="export-btn">导出</el-button>
        </div>
      </el-form>
      <div>
        <el-radio-group v-model="curOrderStatus">
          <el-radio :disabled="loading" :label="1">我处理的(<span class="header-mark__text">{{summary['recorder']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="2">所有(<span class="header-mark__text">{{summary['all']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="4">A等级(<span class="header-mark__text">{{summary['A']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="5">B等级(<span class="header-mark__text">{{summary['B']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="6">C等级(<span class="header-mark__text">{{summary['C']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="7">D等级(<span class="header-mark__text">{{summary['D']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="8">E等级(<span class="header-mark__text">{{summary['E']}}</span>)</el-radio>
          <el-radio :disabled="loading" :label="9">F等级(<span class="header-mark__text">{{summary['F']}}</span>)</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table"
        @selection-change="handleSelectionChange"
        :data="tableData">
        <el-table-column
          fixed="left"
          type="selection"
          width="55">
        </el-table-column>
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
          prop="channelCode"
          label="渠道">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="cityName"
          label="城市">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="applyCount"
          label="申请次数">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="applyTypeText"
          label="类型">
        </el-table-column>
        <el-table-column
          min-width="140"
          prop="haveWeiLi"
          label="微粒贷额度(元)">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="zimaScore"
          label="芝麻信用分">
        </el-table-column><!--
        <el-table-column
          min-width="100"
          prop="stageStatus"
          label="库存展示">
          <template slot-scope="scope">
            <span v-if="scope.row.stageStatus === 1">展示</span>
            <span v-if="scope.row.stageStatus === 2">展示待审</span>
            <span v-if="scope.row.stageStatus === 3">展示拒绝</span>
          </template>
        </el-table-column> -->
        <el-table-column
          min-width="120"
          prop="status"
          label="状态">
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
          label="分配标志">
          <template slot-scope="scope">
            {{allotFlags[scope.row.allotFlag]}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="grade"
          label="客户等级">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="custLabelStr"
          label="星级">
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
          prop="handleDesc"
          label="门店处理描述">
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
    <form :action="exportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
      <input type="text" name="exportParams" v-model="exportParams">
      <input type="text" name="exportTitles" v-model="exportTitles">
      <input type="text" name="signId" v-model="signId">
      <input type="text" name="exportType" value="allList">
      <input type="text" name="data_dictionary" value="{'kfStatus':{'0':'未跟进','1':'跟进中','2':'转门店','3':'转普通单','4':'转黑名单','5':'跟进受阻','6':'挂卖处理'},'applyType':{'1':'优质单','2':'普通单','3':'垃圾单','4':'小贷客户','5':'微店单'},'status':{'0':'待处理','1':'客服锁定中','2':'门店锁定中','3':'可转化','4':'转化中','5':'转化成功','6':'转化失败','7':'门店退回'}}">
    </form>
    <sum-export ref="sumExport"/>
  </div>
</template>

<script>
import SumExport from '../../components/export/SumExport.vue'
let deskOpt = ['我处理的', '所有的', 'A', 'B', 'C', 'D', 'E', 'F']
let deskArr = [{name: '我处理的', val: 1}, {name: '所有的', val: 2}, {name: 'A', val: 3}, {name: 'B', val: 4}, {name: 'C', val: 5}, {name: 'D', val: 6}, {name: 'E', val: 7}, {name: 'F', val: 8}]
let d = new Date()
let msec = ((d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds()) * 1000
let date = new Date(Date.now() - msec)
export default {
  name: 'all',
  data () {
    let initForm = this.initSearchForm(this.$route.query)
    let endDateTime = this.$time(d)
    return {
      zcChecked1: false,
      zcChecked2: false,
      zcChecked3: false,
      exportPath: this.$baseURL + '/account/data/export/checkNewExportExcel',
      signId: '',
      exportParams: '',
      exportTitles: '',
      multipleSelection: [],
      searchForm: {
        startTime: initForm['startTime'],
        endTime: initForm['endTime'] || endDateTime,
        applyName: initForm['applyName'],
        cityName: initForm['cityName'],
        channelCode: initForm['channelCode'],
        applyType: initForm['applyType'] || '',
        status: initForm['status'],
        kfName: initForm['kfName'],
        recorderName: initForm['recorderName'],
        searchType: initForm['searchType'],
        kfStatus: initForm['kfStatus'] || '',
        storeStatus: initForm['storeStatus'] || '',
        stageStatus: '',
        allotFlag: '',
        grade: '',
        custLabel: ''
      },
      // 统计数字
      summary: {
        A: '',
        B: '',
        C: '',
        D: '',
        E: '',
        F: '',
        all: '',
        noDetail: '',
        recorder: ''
      },
      curOrderStatus: 2,
      startTime: initForm['sTime'],
      endTime: initForm['eTime'] || d,
      endTimeOptions: {},
      cityList: [],
      channels: [],
      checkDesk: initForm['checkDesk'],
      deskOpts: deskOpt,
      tableData: [],
      applyTypes: ['', '优质单', '普通单', '垃圾单', '小贷客户', '微店单', '准优质单', '优质客户单'],
      status: ['待处理', '客服锁定中', '门店锁定中', '可转化', '转化中', '转化成功', '转化失败', '门店退回', '过期失效'],
      kfStatus: ['未跟进', '跟进中', '转门店', '转普通单', '转黑名单', '跟进受阻', '转信贷经理'],
      storeStatus: ['未跟进', '继续跟进', '成功预约', '签单', '放款', '失败', '回款'],
      allotFlags: ['未分配', '网销门店', '贷超', '电销', '客服', '小贷', '保险', '小贷/保险', '特殊小贷'],
      custLabels: ['0星', '1星', '2星', '2星+', '3星', '4星'],
      totalRecord: 0,
      currentPage: initForm['currentPage'],
      searchLoading: false,
      loading: false,
      // 导出
      exportSearchParams: {},
      exportForm: {
        exportType: 'allList',
        sumType: 'allList',
        exportParams: '',
        url: this.$baseURL + '/account/data/export/checkNewExportExcel'
      },
      isEdit: true // 权限
    }
  },
  components: {
    SumExport
  },
  created () {
    // !Object.keys(this.$route.query).length ? this.searchHandle(1) : this.searchHandle(2)
    this.cityList = JSON.parse(this.$localStorage('cityList')) || []
    // 获取权限
    let menuCode = this.$route.path.split('/')[2]
    let checkUrl = this.$localStorage('kfCheckMenus')
    if (checkUrl.indexOf(menuCode) >= 0) {
      this.isEdit = true
    }
    this.searchChannels()
  },
  watch: {
    '$route' (to, from) {
      if (!Object.keys(to.query).length) {
        this.searchHandle(3)
      }
    },
    zcChecked1 (val) {
      if (val) {
        if (this.multipleSelection < 1) {
          this.$msg('请选择数据')
          this.zcChecked1 = false
          return
        }
        this.stage(1)
      }
    },
    zcChecked2 (val) {
      if (val) {
        if (this.multipleSelection < 1) {
          this.$msg('请选择数据')
          this.zcChecked2 = false
          return
        }
        this.stage(2)
      }
    },
    zcChecked3 (val) {
      if (val) {
        if (this.multipleSelection < 1) {
          this.$msg('请选择数据')
          this.zcChecked3 = false
          return
        }
        this.stage(3)
      }
    },
    // 订单状态改变监听
    curOrderStatus (val) {
      this.searchForm.searchType = val
      this.searchHandle(5)
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    searchChannels () {
      this.$ajax({
        url: '/store/user/code/queryAll',
        success: data => {
          this.channels = data.rows
        }
      })
    },
    // stage (status) {
    //   let ids = []
    //   for (var i = 0; i < this.multipleSelection.length; i++) {
    //     ids.push(this.multipleSelection[i].applyId)
    //   }
    //   if (status === 3) {
    //     this.$prompt('本次将对' + ids.length + '笔数据进行库存展示操作, 是否继续?', '提示', {
    //       inputPlaceholder: '处理描述',
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消'
    //     }).then(({ value }) => {
    //       this.$ajax({
    //         url: '/store/account/bench/list/updateStageStatus',
    //         data: {'ids': ids, 'stageStatus': status, auditDesc: value},
    //         success: data => {
    //           this.multipleSelection = ''
    //           this.zcChecked3 = false
    //           this.searchHandle()
    //         }
    //       })
    //     }).catch(() => {
    //       this.zcChecked3 = false
    //     })
    //   } else {
    //     let color = 'warning'
    //     if (status === 1) {
    //       color = 'success'
    //     }
    //     this.$confirm('本次将对' + ids.length + '笔数据进行库存展示操作, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: color
    //     }).then(() => {
    //       this.$ajax({
    //         url: '/store/account/bench/list/updateStageStatus',
    //         data: {'ids': ids, 'stageStatus': status},
    //         success: data => {
    //           this.multipleSelection = ''
    //           this.zcChecked1 = false
    //           this.zcChecked2 = false
    //           this.searchHandle()
    //         }
    //       })
    //     }).catch(() => {
    //       this.zcChecked1 = false
    //       this.zcChecked2 = false
    //     })
    //   }
    // },
    exportData () {
      this.$refs.sumExport.show = true
    },
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
        for (let i = 0; i < deskArr.length; i++) {
          if (deskArr[i]['name'] === value[0]) {
            this.searchForm.searchType = deskArr[i]['val']
          }
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
      if (!this.searchForm.startTime || !this.searchForm.endTime) {
        this.$msg('请选择日期范围')
        return
      }
      if (arg === 1) {
        params = this.searchForm
        delete params.signId
      } else if (arg === 2) {
        params = this.$extend(params, {currentPage: this.currentPage})
        delete params.signId
        this.$router.push({path: 'all', query: params})
      } else if (arg === 3) {
        let initForm = this.initSearchForm({})
        this.searchForm = {
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
          this.$router.push({path: 'all', query: params})
        }
      } else if (arg === 5) {
        delete params.signId
        this.$router.push({path: 'all', query: params})
      } else {
        delete params.signId
        this.$router.push({path: 'all', query: params})
      }
      this.searchLoading = true
      this.exportSearchParams = params
      // this.$ajax({
    //         url: '/store/account/bench/list/updateStageStatus',
    //         data: {'ids': ids, 'stageStatus': status},
    //         success: data => {
    //           this.multipleSelection = ''
    //           this.zcChecked1 = false
    //           this.zcChecked2 = false
    //           this.searchHandle()
    //         }
    //       })
      if (this.searchLoading) {
        this.$ajax({
          url: '/store/account/work/all/queryAllList',
          data: params,
          success: data => {
            this.searchLoading = false
            this.totalRecord = data.page.totalRecords
            this.tableData = data.rows
          }
        })
        this.$ajax({
          url: '/store/account/work/all/queryAllListCount',
          data: params,
          success: data => {
            this.summary = data.rows[0]
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
<style media="screen">
  .check-float-l{
    width: 200px;
    display: inline-block;
  }
  .high-query{
    position: relative;
    padding-left: 108px;
    min-height: 58px;
  }
  .high-query .btn{
    border: 1px solid #dcdcdc;
    text-align: center;
    position: absolute;
    width: 90px;
    line-height: 36px;
    top: 0;
    left: 0;
  }
  .header-mark__text{
    color: red;
  }
</style>
