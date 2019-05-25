<template>
  <div class="notice-wrap">
<!--     最新提醒： -->
    <div class="show-notice" ref="noticeBox" :style="{width: wrapWith + 'px'}">
      <div class="notice-list" ref="noticeList" :style="{minWidth: wrapWith + 'px'}">
        <span v-for="notice in notices">{{notice}}</span>
      </div>
      <div class="notice-list" :style="{minWidth: wrapWith + 'px'}">
        <span v-for="notice in notices">{{notice}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RollNotice',
  props: {
    notices: {
      type: Array,
      required: true,
      coerce (data) {
        data.push(data[0])
        return data
      }
    }
  },
  data () {
    return {
      wrapWith: 500
    }
  },
  mounted () {
    let that = this
    let box = this.$refs.noticeBox
    this.wrapWith = document.body.clientWidth - 650
    let timer = window.setInterval(this.marqueeLeft, 50)
    box.onmouseover = function () {
      window.clearInterval(timer)
    }
    box.onmouseout = function () {
      timer = window.setInterval(that.marqueeLeft, 50)
    }
  },
  methods: {
    marqueeLeft () {
      let box = this.$refs.noticeBox
      let list = this.$refs.noticeList
      if (box && list) {
        if (box.scrollLeft === list.offsetWidth) {
          box.scrollLeft = 0
        }
        box.scrollLeft++
      }
    }
  }
}
</script>
<style lang="less">
  .notice-wrap {
    float: left;
    margin-left: 10px;
    margin-top: 16px;
    color: #f2f2f2;
  }
  .show-notice{
    height: 30px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    width: 500px;
    white-space:nowrap;
    .notice-list {
      color: #f2f2f2;
      display: inline-block;
      vertical-align: middle;
      span {
        height: 30px;
        line-height: 30px;
        color: #f2f2f2;
        margin-right: 10px;
        font-weight: bold;
      }
    }
  }
</style>
