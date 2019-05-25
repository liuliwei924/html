<template>
  <div class="content-box">
    <div class="header__title">门店回款分析统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
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
         <el-form-item label="月份:">
            <el-date-picker
              v-model="searchForm.curentMonth"
              type="month"
              editable
              @change="startDateChange"
              placeholder="月份">
            </el-date-picker>
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
export default {
  name: 'orgRepayAnalyCount',
  data () {
    // 缓存查询条件
    let store = this.$getStore('orgRepayAnalyCount')
    let userOrgId = this.$localStorage('userOrgId')
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    let userRole = this.$localStorage('userRole') === '1'
    let showOrgId = !userRole ? Number(userOrgId) : ''
    let {curMonth} = this.$monthDate()
    return {
      searchForm: {
        orgId: store['orgId'] || showOrgId,
        curentMonth: curMonth
      },
      loading: false,
      tableData: [],
      userOrgs, // 门店数据
      totalRecord: 1
    }
  },
  mounted () {
    echarts = this.$echarts.init(this.$refs['echarts'])
    this.initChart()
  },
  methods: {
    startDateChange (date) {
      this.searchForm.curentMonth = date || ''
    },
    searchHandle () {
      if (!this.searchForm.curentMonth) {
        this.$msg('月份不能为空')
        return
      }
      this.initChart()
    },
    initChart () {
      echarts.showLoading()
      this.$setStore('orgRepayAnalyCount', this.searchForm)
      this.$ajax({
        url: '/store/account/dataset/orgRepayAnalyCount/queryOrgRepaymentByDate',
        data: this.searchForm,
        loading: true,
        success: data => {
          let rows = data['rows'] || []
          echarts.hideLoading()
          let axisValue = ['本月回款', '上月回款', '两月前回款', '小贷回款', '信用贷回款', '抵押贷回款']
          let orgName = []
          let count = []
          let curSucRetAmout = []
          let lastSucRetAmout = []
          let twoMonthSucRetAmout = []
          let smallSucRetAmout = []
          let creditSucRetAmout = []
          let morSucRetAmout = []
          let totalArray = []
          rows.forEach(item => {
            orgName.push(item['orgName'])
            curSucRetAmout.push(item['curSucRetAmout'])
            lastSucRetAmout.push(item['lastSucRetAmout'])
            twoMonthSucRetAmout.push(item['twoMonthSucRetAmout'])
            smallSucRetAmout.push(item['smallSucRetAmout'])
            creditSucRetAmout.push(item['creditSucRetAmout'])
            morSucRetAmout.push(item['morSucRetAmout'])
          })
          totalArray.push(curSucRetAmout)
          totalArray.push(lastSucRetAmout)
          totalArray.push(twoMonthSucRetAmout)
          totalArray.push(smallSucRetAmout)
          totalArray.push(creditSucRetAmout)
          totalArray.push(morSucRetAmout)
          for (var i = 0; i < axisValue.length; i++) {
            count.push({ name: axisValue[i], type: 'bar', label: { normal: {show: true, position: 'top'} }, data: totalArray[i] })
          }
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line'
              }
            },
            toolbox: {
              show: true,
              showTitle: false,
              feature: {
                mark: {show: true},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true, name: '门店回款分析统计'}
              }
            },
            calculable: true,
            legend: {
              data: axisValue
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: '5%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: orgName,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  interval: 0,
                  rotate: -30
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            dataZoom: [
              {
                show: true,
                start: 0,
                end: 100
              },
              {
                type: 'inside',
                start: 94,
                end: 100
              },
              {
                show: false,
                yAxisIndex: 0,
                filterMode: 'empty',
                width: 30,
                height: '80%',
                showDataShadow: false,
                left: '93%'
              }
            ],
            series: count
          }
          echarts.setOption(option)
        }
      })
    }
  }
}
</script>