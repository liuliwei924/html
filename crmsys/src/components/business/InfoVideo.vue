<template>
  <div class="info-video">
    <div class="info-video-ctrl">
      <el-upload
        class="file-upload__btn"
        action="action"
        :show-file-list="false"
        :on-change="uploadHandle"
        :auto-upload="false"
        v-if="type === 'edit'">
        <el-button>上传</el-button>
      </el-upload>
      <el-button @click="downHandle">下载</el-button>
      <el-button class="delete__btn" @click="deleteHandle" v-if="type === 'edit'">删除</el-button>
    </div>
    <!-- <embed type="application/x-mplayer2" src="http://192.168.10.80/crmpage/20170612.avi" name="MediaPlayer" autostart="1" showstatusbar="1" showdisplay="1" showcontrols="1" loop="0" videoborder3d="0" pluginspage="http://www.microsoft.com/Windows/MediaPlayer/" width="500" height="400"></embed> -->
    <template v-if="videoPath">
      <video :src="videoPath"  width="500" height="400" controls="controls">
        Your browser does not support the video tag.
      </video>
    </template>
  </div>
</template>

<script>
import {expireStore} from '@/utils/utils'
export default {
  name: 'info-video',
  props: {
    applyId: [Number, String]
  },
  data () {
    let type = this.$route.query.type
    return {
      type,
      videoId: '',
      reader: new FileReader(),
      videoPath: ''
    }
  },
  created () {
    this.queryVideo()
  },
  methods: {
    // 查询视频
    queryVideo () {
      this.$ajax({
        url: '/crmsys/account/user/custInfo/queryVideo',
        data: {
          applyId: this.applyId
        },
        success: data => {
          let attr = data.attr || {}
          this.videoId = attr.videoId
          this.videoPath = `${attr.resourcesUrl || ''}${attr.path || ''}${attr.videoName || ''}`
        }
      })
    },
    // 上传处理
    uploadHandle (file, fileList) {
      let _this = this
      this.reader.readAsDataURL(file.raw)
      this.reader.onload = function (e) {
        _this.$ajax({
          url: '/crmsys/account/busi/enterInfo/uploadVideo',
          data: {
            applyId: _this.applyId,
            videoFile: this.result
          },
          success: data => {
            let attr = data.attr || {}
            _this.videoId = attr.videoId
            _this.videoPath = `${attr.resourcesUrl || ''}${attr.path || ''}${attr.videoName || ''}`
          }
        })
      }
    },
    // 打包下载
    downHandle () {
      // window.location.href = `${this.$baseURL}device/excel?${this.$serialize({applyId: this.applyId})}`
      let signId = expireStore('signId')
      window.location.href = `${this.$baseURL}crmsys/account/user/custInfo/downloadVideo?${this.$serialize({videoId: this.videoId, signId})}`
    },
    // 删除处理
    deleteHandle () {
      this.$alert('您确定删除该条视频吗?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/crmsys/account/busi/enterInfo/deleteVideo',
              data: {
                videoId: this.videoId
              },
              success: () => {
                this.queryVideo()
              }
            })
          }
        }
      })
    }
  }
}
</script>
