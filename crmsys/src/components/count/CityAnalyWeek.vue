<template>
  <div class="content-box">
    <div class="header__title">城市分析统计</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item
          label="城市:">
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
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__check">
      <el-radio-group v-model="status">
        <el-radio :label="3">本周</el-radio>
        <el-radio :label="1">本月</el-radio>
        <el-radio :label="2">月度</el-radio>
      </el-radio-group>
    </div>
    <div ref="echarts" class="echarts-box"></div>
  </div>
</template>

<script>
let echarts = null
export default {
  name: 'cityAnaly-week',
  data () {
    // 缓存查询条件
    let store = this.$getStore('cityAnalyWeek')
    return {
      status: 3,
      searchForm: {
        cityName: store['cityName'] || ''
      },
      loading: false,
      tableData: [],
      cityNameList: [],
      totalRecord: 1
    }
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  mounted () {
    echarts = this.$echarts.init(this.$refs['echarts'])
    this.getCityName()
    this.initChart()
  },
  methods: {
    // 获取网销城市
    getCityName () {
      this.$ajax({
        url: '/store/account/user/comm/queryNetCity',
        success: data => {
          this.cityNameList = data.attr['cityNameList']
        }
      })
    },
    searchHandle () {
      this.initChart()
    },
    initChart () {
      echarts.showLoading()
      this.$setStore('cityAnalyWeek', this.searchForm)
      this.$ajax({
        url: '/store/account/dataset/cityAnalyCount/queryThisWeekByCity',
        data: this.searchForm,
        loading: true,
        success: data => {
          let rows = data['rows'] || []
          echarts.hideLoading()
          let axisValue = ['无效单量', '空号量', '跟进中量', '签单量', '回款量']
          let cityName = []
          let count = []
          let invalidArray = []
          let nullArray = []
          let followArray = []
          let signArray = []
          let sucRetArray = []
          let totalArray = []
          rows.forEach(item => {
            cityName.push(item['cityName'])
            invalidArray.push(item['invalidOrderCount'])
            nullArray.push(item['nullOrderCount'])
            followArray.push(item['followOrderCount'])
            signArray.push(item['signOrderCount'])
            sucRetArray.push(item['sucRetCount'])
          })
          totalArray.push(invalidArray)
          totalArray.push(nullArray)
          totalArray.push(followArray)
          totalArray.push(signArray)
          totalArray.push(sucRetArray)
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
                saveAsImage: {show: true, name: '城市本周分析统计'}
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
                data: cityName
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