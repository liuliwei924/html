<template>
  <div class="v-calendar__wrapper" v-show="value">
    <div class="v-calendar">
      <el-form>
        <el-form-item label="代号">
          <el-select v-model="channelCode" filterable clearable placeholder="请选择代号">
            <el-option
              v-for="(item, index) in channels"
              :label="item.channelCode"
              :value="item.channelCode"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="v-calendar-header v-cf">
        <div class="header-year v-fl">
          <button class="prev-btn" @click="prevYearHandle">&lt;</button>
          <span class="text">{{yearText}}</span>
          <button class="next-btn" @click="nextYearHandle">&gt;</button>
        </div>
        <div class="header-month v-fl">
          <button class="prev-btn" @click="prevMonthHandle">&lt;</button>
          <span class="text">{{monthText | formatNum}}</span>
          <button class="next-btn" @click="nextMonthHandle">&gt;</button>
        </div>
      </div>
      <div class="v-calendar-list">
        <div class="list-header v-cf">
          <div class="th v-fl">星期日</div>
          <div class="th v-fl">星期一</div>
          <div class="th v-fl">星期二</div>
          <div class="th v-fl">星期三</div>
          <div class="th v-fl">星期四</div>
          <div class="th v-fl">星期五</div>
          <div class="th v-fl">星期六</div>
        </div>
        <div class="list-body v-cf">
          <div class="td v-fl" v-for="(item,index) in costArr" :key="index">
            <template v-if="item">
              <div class="day-text">{{item['day']}}</div>
              <div class="cost-input">
                <label>花费</label>
                <input v-model="item['amount']">
              </div>
              <div class="tap-input">
                <label>点击量</label>
                <input v-model="item['browseCount']">
              </div>
            </template>
            <template v-else>&nbsp;</template>
          </div>
          <div v-if="!costArr.length">
            暂无数据
          </div>
        </div>
      </div>
      <div class="v-ctrl-btn">
        <button class="v-btn" @click="confirmHandle">保存</button>
        <button class="v-btn" @click="close">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
function formatNum (num) {
  return num > 9 ? num : '0' + num
}
export default {
  name: 'v-cost-calendar',
  props: {
    value: Boolean
  },
  data () {
    let date = new Date()
    let yearText = date.getFullYear()
    let monthText = date.getMonth() + 1
    return {
      yearText: yearText,
      monthText: monthText,
      costArr: [],
      channelCode: '',
      channels: []
    }
  },
  watch: {
    channelCode (val) {
      this.initDate()
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    initDate () {
      let numOfMonth = (new Date(this.yearText, this.monthText, 0)).getDate()
      let numOfWeek = (new Date(this.yearText, this.monthText - 1, 1)).getDay()
      this.$ajax({
        url: '/store/account/spread/cost/queryBatch',
        data: {
          channelCode: this.channelCode,
          dateMonth: this.yearText + '-' + formatNum(this.monthText)
        },
        success: data => {
          let resArr = data.rows || []
          let resObj = {}
          for (let k = 0; k < resArr.length; k++) {
            let resItem = resArr[k]
            let day = resItem['recordDate'].substring(8)
            resObj[day] = {
              amount: resItem['amount'],
              browseCount: resItem['browseCount']
            }
          }
          let dateArr = []
          for (let i = 0; i < numOfWeek; i++) {
            dateArr.push('')
          }
          for (let j = 1; j <= numOfMonth; j++) {
            let dateItem = resObj[formatNum(j)] || {}
            let dateAmount = dateItem['amount'] !== undefined ? dateItem['amount'] : ''
            let dateBrowseCount = dateItem['browseCount'] !== undefined ? dateItem['browseCount'] : ''
            dateArr.push({
              day: j,
              amount: dateAmount,
              browseCount: dateBrowseCount
            })
          }
          this.costArr = dateArr
        }
      })
    },
    prevYearHandle () {
      this.yearText--
      this.initDate()
    },
    nextYearHandle () {
      this.yearText++
      this.initDate()
    },
    prevMonthHandle () {
      if (this.monthText > 1) {
        this.monthText--
      } else {
        this.yearText--
        this.monthText = 12
      }
      this.initDate()
    },
    nextMonthHandle () {
      if (this.monthText < 12) {
        this.monthText++
      } else {
        this.yearText++
        this.monthText = 1
      }
      this.initDate()
    },
    confirmHandle () {
      let costArr = this.costArr
      let channelCostList = []
      for (let i = 0; i < costArr.length; i++) {
        let costItem = costArr[i] || {amount: '', browseCount: ''}
        if (costItem['amount'] !== '') {
          let recordDate = this.yearText + '-' + formatNum(this.monthText) + '-' + formatNum(costItem['day'])
          channelCostList.push({
            recordDate: recordDate,
            channelCode: this.channelCode,
            browseCount: costItem['browseCount'],
            amount: costItem['amount']
          })
        }
      }
      this.$ajax({
        url: '/store/account/spread/cost/batchEdit',
        data: {channelCostList: JSON.stringify(channelCostList)},
        success: data => {
          if (data.success) {
            this.$message({message: '保存成功', type: 'success'})
            this.close()
            this.$parent.search(1)
          }
        }
      })
    }
  }
}
</script>

<style>
.v-cf:after,
.v-cf:before {
  content: " ";
  display: table
}
.v-cf:after {
  clear: both
}
.v-fl {
  float: left;
}
.v-calendar__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}
.v-calendar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 740px;
  height: 590px;
  padding: 20px;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
  box-sizing: border-box;
}
.v-calendar-header {
  width: 400px;
  margin: 0 auto;
  height: 32px;
}
.v-calendar-header .header-year,
.v-calendar-header .header-month {
  width: 50%;
  text-align: center;
}
.v-calendar-list .list-header .th,
.v-calendar-list .list-body .td {
  width: 100px;
  text-align: center;
  border-right: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
  box-sizing: border-box;
}
.v-calendar-list .list-header .th {
  border-top: 1px solid #dcdcdc;
}
.v-calendar-list .list-header .th:first-child,
.v-calendar-list .list-body .td:nth-child(7n+1) {
  border-left: 1px solid #dcdcdc;
}
.v-calendar-list .list-body .td:last-child {
  border-right: 1px solid #dcdcdc;
}
.v-calendar-list .list-body .td {
  height: 66px;
}
.v-calendar-list .list-body .td label {
  display: inline-block;
  width: 45px;
}
.v-calendar-list .list-body .td input {
  width: 40px;
}
.v-calendar-list .list-body .td .day-text {
  color: #ec4f4f;
}
.v-calendar .v-ctrl-btn {
  text-align: center;
  margin-top: 10px;
}
.v-calendar button {
  padding: 0 10px;
  border: 0;
  color: #fff;
  background: #ccc;
  cursor: pointer;
}
.v-ctrl-btn button {
  width: 100px;
  height: 36px;
  background: #c2c0c0;
}
.v-ctrl-btn button:first-child {
  background: #3ebd7f;
}
</style>
