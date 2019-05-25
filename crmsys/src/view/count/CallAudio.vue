<template>
  <div class="content-box">
    <div class="header__title">录音文件列表</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始通话时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            :editable="false"
            placeholder="开始通话时间"
            @change="startTimeHandle($event)">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始通话时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            :editable="false"
            placeholder="开始通话时间"
            @change="endTimeHandle($event)"
            :picker-options="endTimeOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
            clearable
            @change="changeOrgHandle"
            placeholder="请选择门店">
            <el-option
              v-for="item,index in netOrgList"
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
            placeholder="请选择组名">
            <el-option
              v-for="item,index in groupNameList"
              :label="item.groupName"
              :value="item.groupName"
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
        <el-form-item label="业务处理人:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.realName"
            placeholder="业务处理人">
          </el-input>
        </el-form-item>
        <el-form-item label="处理状态:">
          <el-select
            v-model="searchForm.orderStatus"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item,key,index in orderStatusArr"
              :label="item.name"
              :value="item.val"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通话时长-起:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.startDuration"
            placeholder="通话时长(秒)">
          </el-input>
        </el-form-item>
        <el-form-item label="通话时长-止:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.endDuration"
            placeholder="通话时长(秒)">
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
        <el-button @click="searchHandle" :loading="searchLoading">查询</el-button>
      </el-form>
    </div>
    <el-table
      class="content__table table__gap"
      :data="tableData"
      border
      v-loading="loading">
      <!-- <el-table-column
        min-width="100"
        prop="recordDate"
        label="记录日期">
      </el-table-column> -->
      <el-table-column
        min-width="180"
        prop="startCallTime"
        label="开始通话时间">
      </el-table-column>
      <el-table-column
        label="通话时长"
        min-width="100">
        <template slot-scope="scope">
          <span>{{secondToDate(scope.row.duration)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="realName"
        label="业务处理人">
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="orgName"
        label="门店名称">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="groupName"
        label="所属组名">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="applyName"
        label="客户名称">
      </el-table-column>
      <el-table-column
        min-width="130"
        prop="borrowTel"
        label="客户手机号">
      </el-table-column>
      <el-table-column
        prop="custLabel"
        label="客户星级"
        min-width="150">
        <template slot-scope="scope">{{custLabel[scope.row.custLabel]}}</template>
      </el-table-column>
      <el-table-column
        min-width="90"
        prop="orderStatusText"
        label="处理状态">
      </el-table-column>
      <el-table-column
        min-width="90"
        prop="applyId"
        label="申请编号">
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="uploadTime"
        label="上传时间">
      </el-table-column>
      <el-table-column
        label="播放录音"
        min-width="200">
        <template slot-scope="scope">
          <div class="audio-area">
            <div class="bg" @click="audioHandle(scope.row)"></div>
            <audio controls :ref="'audio' + scope.row.audioId" :id="'audio' + scope.row.audioId">
              <source :src="scope.row.audionUrl" type='audio/mp3'>
              </source>
            您的浏览器不支持 audio 标签。
            </audio>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadAudio(scope.row)">下载</el-button>
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
        </template>
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
</template>

<script>
export default {
  name: 'call-audio',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('callAudio')
    return {
      oldAudioId: '',
      flag: true,
      searchForm: {
        orgId: store['orgId'] || '',
        storeRealName: store['storeRealName'] || '',
        realName: store['realName'] || '',
        startDate: lastWeekDay || '',
        endDate: '',
        startDuration: store['startDuration'] || '',
        endDuration: store['endDuration'] || '',
        currentPage: store['currentPage'] || 1,
        orderStatus: store['orderStatus'] || '',
        custLabel: store['custLabel'] || '',
        groupName: ''
      },
      groupNameList: [], // 门店组名列表
      userOrgs, // 门店数据
      totalRecord: 1,
      searchLoading: false,
      startPickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      endTimeOptions: {},
      loading: false,
      tableData: [],
      netOrgList: [], // 网销门店
      // 处理状态
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
      // 客户星级
      custLabel: {
        0: '0星，系统默认的未了解过信息的客户',
        1: '1星：无可贷点的客户',
        2: '2星：有可贷点但暂时进不了件的客户',
        3: '2星+：可邀约上门的客户',
        4: '3星：可做主流小贷的客户',
        5: '4星：可做银行的客户'
      }
    }
  },
  created () {
    this.searchHandle()
    if (this.searchForm.orgId) {
      this.getGroupList()
    }
    this.getNetOrgList()
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
    audioHandle (row) {
      if (this.oldAudioId === row.audioId) {
        let currDom = document.getElementById('audio' + row.audioId)
        if (this.flag) {
          currDom.play()
          this.flag = false
        } else {
          currDom.pause()
          this.flag = true
        }
      } else {
        if (this.oldAudioId) {
          let oldId = 'audio' + this.oldAudioId
          let oldDom = document.getElementById(oldId)
          if (oldDom) {
            oldDom.pause()
            oldDom.currentTime = 0
          }
        }
        let curId = 'audio' + row.audioId
        let curDom = document.getElementById(curId)
        curDom.play()
        this.flag = false
        this.oldAudioId = row.audioId
      }
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      var startDate = this.searchForm['startDate']
      if (startDate === undefined || startDate === '' || startDate === null) {
        this.$message('请选择开始通话时间')
        return false
      }
      // 缓存查询条件
      this.$setStore('callAudio', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/dataset/callAudio/queryCallAudio',
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
    // 下载录音文件
    downloadAudio (obj) {
      // 判断浏览器是否支持下载
      const a = document.createElement('a')
      a.setAttribute('href', obj.audionUrl)
      a.setAttribute('download', 'audionFile')
      a.click()
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    },
    // 开始时间改变
    startTimeHandle (val) {
      this.searchForm.startDate = val || ''
      this.endTimeOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(val).getTime() - 8.64e7
        }
      }
    },
    // 结束时间改变
    endTimeHandle (val) {
      this.searchForm.endDate = val || ''
    },
    secondToDate (val) {
      let result = ''
      let minute = Math.floor(val / 60)
      let second = val % 60
      if (minute > 0 && second === 0) {
        result = minute + '分钟'
      } else if (minute > 0 && second > 0) {
        result = minute + '分钟' + second + '秒'
      } else if (minute === 0 && second > 0) {
        result = second + '秒'
      } else {
        result = '0秒'
      }
      return result
    }
  }
}
</script>
<style lang="less">
  .audio-area {
    position: relative;
    .bg {
      position: absolute;
      width: 30%;
      height: 100%;
      z-index: 66;
    }
  }
</style>