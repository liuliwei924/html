<template>
  <div class="file-content" v-if="!isShow">
    <div class="clearfix">
      <div class="file-item" :class="getCls(key, item['count'])" @click="showDetail(item['groupCode'], item['groupName'])" v-for="item,key,index in fileInfo" :key="index">{{item['groupName']}}</div>
    </div>
    <el-button class="ctrl-btn" @click="downloadHandle">打包下载</el-button>
  </div>
  <div class="file-content" v-else>
    <div class="file-title">{{title}}</div>
    <div class="file-list" v-for="item,index in fileArr" :key="index">
      <div class="file-subtitle">{{item.materialName}}</div>
      <file-upload :applyId="applyId" :files="item['files']" :imgUrl="imgUrl" :materialType="item['materialType']" @fileChange="fileChange" />
    </div>
    <el-button class="ctrl-btn" @click="hideDetail">返回</el-button>
  </div>
</template>

<script>
import FileUpload from '@/components/work/FileUpload'
import {expireStore} from '@/utils/utils'
export default {
  name: 'file-material',
  props: {
    applyId: [Number, String]
  },
  data () {
    return {
      isShow: false,
      title: '',
      imgUrl: '',
      fileInfo: {
        credit: {},
        cardNo: {},
        income: {},
        work: {},
        apply: {},
        live: {},
        house: {},
        policy: {},
        company: {},
        social: {},
        car: {},
        other: {},
        supplement: {}
      },
      fileArr: [],
      getCls (key, count) {
        let cls = key === 'apply' ? 'fr' : 'fl'
        cls += ` file-${key}`
        if (count) cls += ' active'
        return cls
      }
    }
  },
  created () {
    this.queryMaterial()
  },
  methods: {
    // 查询大类资料
    queryMaterial () {
      this.$ajax({
        url: '/store/account/work/applyInfo/queryMaterialGroup',
        data: {
          applyId: this.applyId
        },
        success: data => {
          let group = data.attr.materialGroup || {}
          this.fileInfo = {
            credit: group['credit'] || {},
            cardNo: group['cardNo'] || {},
            income: group['income'] || {},
            work: group['work'] || {},
            apply: group['apply'] || {},
            live: group['live'] || {},
            house: group['house'] || {},
            policy: group['policy'] || {},
            company: group['company'] || {},
            social: group['social'] || {},
            car: group['car'] || {},
            other: group['other'] || {},
            supplement: group['supplement'] || {}
          }
        }
      })
    },
    // 显示小类资料
    showDetail (groupCode, title) {
      this.isShow = true
      this.title = title
      this.$ajax({
        url: '/store/account/work/applyInfo/queryMaterial',
        data: {
          applyId: this.applyId,
          groupCode
        },
        success: data => {
          this.imgUrl = data.attr.resourcesUrl
          this.fileArr = data.rows || []
        }
      })
    },
    // FileUpload组件事件监听(文件添加/删除)
    fileChange () {
      this.queryMaterial()
    },
    // 返回文件列表
    hideDetail () {
      this.isShow = false
    },
    // 打包下载
    downloadHandle () {
      // window.location.href = `${this.$baseURL}device/excel?${this.$serialize({applyId: this.applyId})}`
      let signId = expireStore('signId')
      window.location.href = `http://192.168.10.96/store/account/work/applyInfo/fileZipDownload?${this.$serialize({applyId: this.applyId, signId})}`
    }
  },
  components: {
    FileUpload
  }
}
</script>
