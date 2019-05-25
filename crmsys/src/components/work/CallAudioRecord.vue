<template>
  <div class="trace-record">
    <div class="record-title" v-if="this.callAudioRecord.length">通话录音记录</div>
    <div class="audio-record-title" v-if="!this.callAudioRecord.length">暂无通话录音记录</div>
    <div class="record-item-audio" v-for="item in callAudioRecord">
      <div class="record-info">
        <span class="record-name">{{item.realName}}</span>于<span class="record-time">{{item.startCallTime}}</span>
        <span class="record-status">通话录音</span>
      </div>
      <div class="audio-area">
        <div class="bg" @click="audioHandle(item)"></div>
        <!-- <div class="bg2"></div> -->
        <audio controls :ref="'audio' + item.audioId" :id="'audio' + item.audioId">
          <source :src="item.audionUrl" type='audio/mp3'>
          </source>
        您的浏览器不支持 audio 标签。
        </audio>
      </div>
    </div>
  </div>
</template>

<script>
// 跟踪记录子组件
export default {
  name: 'callAudio-record',
  props: {
    callAudioRecord: Array
  },
  data () {
    return {
      oldAudioId: '',
      flag: true
    }
  },
  methods: {
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
          oldDom.pause()
          oldDom.currentTime = 0
        }
        let curId = 'audio' + row.audioId
        document.getElementById(curId).play()
        this.flag = false
        this.oldAudioId = row.audioId
      }
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
    .bg2 {
      position: absolute;
      width: 126px;
      height: 32px;
      background: #fafafa;
      top: 0;
      right: 0;
      z-index: 2;
    }
  }
</style>
