<template>
  <div class="content-box">
    <div class="header__title">门店分队统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="开始日期:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :clearable="false"
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :clearable="false"
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
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
            @change="changeTeamHandle"
            placeholder="请选择队名">
            <el-option
              v-for="item,index in teamNameList"
              :label="item.teamName"
              :value="item.teamName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="比较参数:">
          <el-select
            v-model="searchForm.comparam"
            filterable
            placeholder="请选择"
            @change="searchHandle">
            <el-option
              v-for="item,index in comparam"
              :label="item.name"
              :value="item.no"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <div ref="echarts" class="echarts-box"></div>
  </div>
</template>

<script>
let echarts = null
// 四手数据页面
export default {
  name: 'team-count',
  data () {
    let {firstDay, today} = this.$searchDate()
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let comparam = [
        {no: 1, name: '待处理数'},
        {no: 2, name: '接单数'},
        {no: 3, name: '反馈次数'},
        {no: 4, name: '上门数'},
        {no: 5, name: '总签单数'},
        {no: 6, name: '总签单金额'},
        {no: 7, name: '在账签单数'},
        {no: 8, name: '在账签单金额'},
        {no: 9, name: '成功签单数'},
        {no: 10, name: '成功签单金额'},
        {no: 11, name: '黄单数量'},
        {no: 12, name: '黄单金额(万)'},
        {no: 13, name: '成功回款数'},
        {no: 14, name: '成功回款金额'},
        {no: 15, name: '未审核回款数'},
        {no: 16, name: '未审核回款金额'}
    ]
    return {
      // status: 1,
      searchForm: {
        startDate: firstDay,
        endDate: today,
        orgId: userOrgs[0].orgId || '',
        groupName: '',
        teamName: '',
        comparam: comparam[0].no
      },
      loading: false,
      userOrgs,
      comparam: comparam,
      groupNameList: [], // 门店组名列表
      teamNameList: [], // 门店队名列表
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
  mounted () {
    echarts = this.$echarts.init(this.$refs['echarts'])
  },
  created () {
    this.getGroupList()
  },
  methods: {
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      const minTime = new Date(date).getTime() - 8.64e7 // 1天
      const maxTime = new Date(date).getTime() + 2.6784e9 // 31天
      const nowTime = Date.now()
      const maxDate = maxTime < nowTime ? maxTime : nowTime
      this.endDateOptions.disabledDate = time => {
        time = time.getTime()
        return time < minTime || time >= maxDate
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endDate = date || ''
    },
    searchHandle () {
      for (let key in this.searchForm) {
        if (!this.searchForm[key]) {
          if (key !== 'teamName') {
            this.$msg('查询条件不能为空')
            return
          }
        }
      }
      this.initChart()
    },
    // 获取组列表
    getGroupList () {
      this.$ajax({
        url: '/store/account/user/comm/queryOrgGroupList',
        data: {
          orgId: this.searchForm.orgId
        },
        loading: true,
        success: data => {
          this.groupNameList = data.rows || []
          if (data.rows[0]) {
            this.searchForm.groupName = data.rows[0].groupName
          } else {
            this.searchForm.groupName = ''
          }
        }
      })
    },
    // 改变门店的状态
    changeOrgHandle () {
      this.getGroupList()
      this.initChart()
    },
    // 改变组名的状态
    changeGroupHandle () {
      this.getTeamList()
      this.initChart()
    },
    // 改变队名的状态
    changeTeamHandle () {
      this.initChart()
    },
    // 获取队列表
    getTeamList () {
      this.$ajax({
        url: '/store/account/user/comm/queryOrgTeamList',
        data: {
          orgId: this.searchForm.orgId,
          groupName: this.searchForm.groupName
        },
        loading: true,
        success: data => {
          this.teamNameList = data.rows || []
          this.searchForm.teamName = ''
        }
      })
    },
    initChart () {
      echarts.showLoading()
      this.$ajax({
        url: '/store/account/dataset/teamCount/queryTeamCount',
        data: this.searchForm,
        loading: true,
        success: data => {
          let rows = data['rows'] || []
          echarts.hideLoading()
          let teamName = []
          let count = []
          let axisValue = this.comparam[this.searchForm['comparam'] - 1]['name']
          rows.forEach(item => {
            teamName.push(item['teamName'])
            count.push(item['count'])
          })
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                label: {
                  show: true
                }
              }
            },
            toolbox: {
              show: true,
              showTitle: false,
              feature: {
                mark: {show: true},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true, name: axisValue}
              }
            },
            calculable: true,
            legend: {
              data: [axisValue],
              itemGap: 5
            },
            grid: {
              top: '12%',
              left: '5%',
              right: '10%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: teamName
              }
            ],
            yAxis: [
              {
                type: 'value',
                axisLabel: {
                  formatter: (a) => {
                    a = +a
                    return isFinite(a)
                      ? this.$echarts.format.addCommas(+a) : ''
                  }
                }
              }
            ],
            // dataZoom: [
            //   {
            //     show: true,
            //     start: 0,
            //     end: 90,
            //     height: 20
            //   },
            //   {
            //     type: 'inside',
            //     start: 94,
            //     end: 100
            //   },
            //   {
            //     show: true,
            //     yAxisIndex: 0,
            //     filterMode: 'empty',
            //     width: 20,
            //     height: '80%',
            //     showDataShadow: false,
            //     left: '93%'
            //   }
            // ],
            series: [
              {
                name: axisValue,
                type: 'bar',
                barMaxWidth: 60,
                label: {
                  normal: {
                    show: true,
                    position: 'top'
                  }
                },
                data: count
              }
            ]
          }
          echarts.setOption(option)
        }
      })
    }
  }
}
</script>
