<template>
  <div class="content-box">
    <div class="header__title">城市回款分析统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item
            label="城市:"
            :rules="{required: false, message: '城市不能为空'}">
            <el-select
              v-model="searchForm.cityName"
              clearable
              filterable
              placeholder="请选择城市">
              <el-option
                v-for="item,index in cityNameList"
                :label="item.cityName"
                :value="item.cityName"
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
  name: 'cityRepayAnalyCount',
  data () {
    // 缓存查询条件
    let store = this.$getStore('cityRepayAnalyCount')
    let {curMonth} = this.$monthDate()
    return {
      searchForm: {
        cityName: store['cityName'] || '',
        curentMonth: curMonth
      },
      loading: false,
      tableData: [],
      cityNameList: {},
      totalRecord: 1
    }
  },
  mounted () {
    echarts = this.$echarts.init(this.$refs['echarts'])
    this.getCityName()
    this.initChart()
  },
  methods: {
    startDateChange (date) {
      this.searchForm.curentMonth = date || ''
    },
    getCityName () {
      this.$ajax({
        url: '/store/account/user/comm/getNetCityByOrgId',
        success: data => {
          this.cityNameList = data.attr['cityNameList']
        }
      })
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
      this.$setStore('cityRepayAnalyCount', this.searchForm)
      this.$ajax({
        url: '/store/account/dataset/cityRepayAnalyCount/queryCityRepaymentByDate',
        data: this.searchForm,
        loading: true,
        success: data => {
          let rows = data['rows'] || []
          echarts.hideLoading()
          let axisValue = ['本月回款', '上月回款', '两月前回款', '小贷回款', '信用贷回款', '抵押贷回款']
          let cityName = []
          let count = []
          let curSucRetAmout = []
          let lastSucRetAmout = []
          let twoMonthSucRetAmout = []
          let smallSucRetAmout = []
          let creditSucRetAmout = []
          let morSucRetAmout = []
          let totalArray = []
          rows.forEach(item => {
            cityName.push(item['cityName'])
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
                saveAsImage: {show: true, name: '城市回款分析统计'}
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
                data: cityName,
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
            series: count
          }
          echarts.setOption(option)
        }
      })
    }
  }
}
</script>