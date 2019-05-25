// 格式化时间
function date (Vue) {
  // 返回当天和当月的第一天
  Vue.prototype.$searchDate = function () {
    let dateObj = new Date()
    let [year, month, day] = [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()]
    if (month <= 9) month = `0${month}`
    if (day <= 9) day = `0${day}`

    let msec = ((dateObj.getHours() * 3600) + (dateObj.getMinutes() * 60) + dateObj.getSeconds()) * 1000
    // 上个星期
    let lastWeek = new Date(Date.now() - 7 * 8.64e7 - msec)
    let [year1, month1, day1] = [lastWeek.getFullYear(), lastWeek.getMonth() + 1, lastWeek.getDate()]
    // 半个月前
    let halfMonth = new Date(Date.now() - 15 * 8.64e7 - msec)
    let [year2, month2, day2] = [halfMonth.getFullYear(), halfMonth.getMonth() + 1, halfMonth.getDate()]
    let yesterday
    if (month1 <= 9) month1 = `0${month1}`
    if (day1 <= 9) day1 = `0${day1}`
    if (day <= '01') {
      yesterday = `${year}-${month}-${day}`
    } else {
      yesterday = (day - 1 < 10) ? `${year}-${month}-0${day - 1}` : `${year}-${month}-${day - 1}`
    }
    return {
      lastWeekDay: `${year1}-${month1}-${day1}`,
      halfMonthDay: `${year2}-${month2}-${day2}`,
      firstDay: `${year}-${month}-01`,
      today: `${year}-${month}-${day}`,
      yesterday
    }
  }

  // 返回当月和上一个月
  Vue.prototype.$monthDate = function () {
    let dateObj = new Date()
    let [year, month] = [dateObj.getFullYear(), dateObj.getMonth() + 1]
    if (month <= 9) month = `0${month}`
    dateObj.setDate(0)
    let [lastYear, lastMonth] = [dateObj.getFullYear(), dateObj.getMonth() + 1]
    if (lastMonth <= 9) lastMonth = `0${lastMonth}`
    return {
      curMonth: `${year}-${month}`,
      lastMonth: `${lastYear}-${lastMonth}`
    }
  }
  Vue.prototype.$time = (date) => {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month > 9 ? month : '0' + month
    let day = date.getDate()
    day = day > 9 ? day : '0' + day
    let hour = date.getHours()
    hour = hour > 9 ? hour : '0' + hour
    let minute = date.getMinutes()
    minute = minute > 9 ? minute : '0' + minute
    let second = date.getSeconds()
    second = second > 9 ? second : '0' + second
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  }
}

export default date
