<template>
  <div class="file-content" v-if="!isShow">
    <div class="clearfix">
      <div class="file-item" :class="getCls(key, item['count'])" @click="showDetail(item['groupCode'], item['groupName'])" v-for="item,key,index in fileInfo" :key="index">{{item['groupName']}}</div>
    </div>
    <el-button class="ctrl-btn" @click="downloadHandle">打包下载</el-button>
    <!-- <div class="file-item file-credit fl" :class="{active: fileInfo['credit']['count']}" @click="showDetail(fileInfo['credit']['groupCode'], '征信资料')">征信资料</div>
    <div class="file-item file-cardNo fl" :class="{active: fileInfo['cardNo']['count']}" @click="showDetail(fileInfo['cardNo']['groupCode'], '身份证')">身份证</div>
    <div class="file-item file-income fl" :class="{active: fileInfo['income']['count']}" @click="showDetail(fileInfo['income']['groupCode'], '收入证明')">收入证明</div>
    <div class="file-item file-work fl" :class="{active: fileInfo['work']['count']}" @click="showDetail(fileInfo['work']['groupCode'], '工作证明')">工作证明</div>
    <div class="file-item file-apply fr" :class="{active: fileInfo['apply']['count']}" @click="showDetail(fileInfo['apply']['groupCode'], '申请表')">申请表</div>
    <div class="file-item file-live fl" :class="{active: fileInfo['live']['count']}" @click="showDetail(fileInfo['live']['groupCode'], '居住证明')">居住证明</div>
    <div class="file-item file-house fl" :class="{active: fileInfo['house']['count']}" @click="showDetail(fileInfo['house']['groupCode'], '房产资料')">房产资料</div>
    <div class="file-item file-policy fl" :class="{active: fileInfo['policy']['count']}" @click="showDetail(fileInfo['policy']['groupCode'], '保单资料')">保单资料</div>
    <div class="file-item file-company fl" :class="{active: fileInfo['compony']['count']}" @click="showDetail(fileInfo['compony']['groupCode'], '公司资料')">公司资料</div>
    <div class="file-item file-social fl" :class="{active: fileInfo['social']['count']}" @click="showDetail(fileInfo['social']['groupCode'], '社保公积金资料')">社保公积金资料</div>
    <div class="file-item file-car fl" :class="{active: fileInfo['car']['count']}" @click="showDetail(fileInfo['car']['groupCode'], '车辆资料')">车辆资料</div>
    <div class="file-item file-other fl" :class="{active: fileInfo['other']['count']}" @click="showDetail(fileInfo['other']['groupCode'], '其他资料')">其他资料</div>
    <div class="file-item file-supplement fl" :class="{active: fileInfo['supplement']['count']}" @click="showDetail(fileInfo['supplement']['groupCode'], '补充资料')">补充资料</div> -->
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
import {expireStore} from '@/utils/utils'
import FileUpload from '@/components/business/FileUpload'
export default {
  name: 'file-material',
  props: {
    applyId: [Number, String],
    type: String
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
        url: '/crmsys/account/user/custInfo/queryMaterialGroup',
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
        url: '/crmsys/account/user/custInfo/queryMaterial',
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
      let signId = expireStore('signId')
      // window.location.href = `${this.$baseURL}device/excel?${this.$serialize({applyId: this.applyId})}`
      window.location.href = `${this.$baseURL}crmsys/account/user/custInfo/fileZipDownload?${this.$serialize({applyId: this.applyId, signId})}`
    }
  },
  components: {
    FileUpload
  }
}
</script>
