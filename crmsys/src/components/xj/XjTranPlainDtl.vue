<template>
  <el-dialog class="edit-dialog pd" title="投诉详情" v-model="visible">
    <div class="plain-dtl">
      <div class="pd-box">
        <div class="pd-item">
          <div class="pd-group clearfix">
            <div class="pd-label">当前状态:</div>
            <div class="pd-right">{{plainDtl.complainStatus}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">投诉理由:</div>
            <div class="pd-right">{{plainDtl.complainContent}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">图片附件</div>
            <div class="pd-right">
              <img v-if="plainDtl.complainImg1" @click="alertBigImg(plainDtl.complainImg1)" :src="plainDtl.complainImg1" alt="img" class="pd-img">
              <img v-if="plainDtl.complainImg2" @click="alertBigImg(plainDtl.complainImg2)" :src="plainDtl.complainImg2" alt="img" class="pd-img">
              <img v-if="plainDtl.complainImg3" @click="alertBigImg(plainDtl.complainImg3)" :src="plainDtl.complainImg3" alt="img" class="pd-img">
            </div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">申诉人:</div>
            <div class="pd-right">{{plainDtl.comNickName}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">申诉人手机:</div>
            <div class="pd-right">{{plainDtl.comTelephone}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">提交时间:</div>
            <div class="pd-right">{{plainDtl.createTime}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">应诉人:</div>
            <div class="pd-right">{{plainDtl.resNickNam}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">应诉人手机:</div>
            <div class="pd-right">{{plainDtl.resTelephone}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">投诉订单号:</div>
            <div class="pd-right">{{plainDtl.orderNo}}</div>
          </div>
        </div>
      </div>
      <div class="pd-box">
        <div class="pd-item" v-for="item, index in plainRespond" :key="index">
          <div class="pd-group clearfix">
            <div class="pd-label">回诉理由:</div>
            <div class="pd-right">{{item.context}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">图片附件</div>
            <div class="pd-right">
              <img v-if="item.complainImg1" @click="alertBigImg(plainDtl.complainImg1)" :src="item.complainImg1" alt="img" class="pd-img">
              <img v-if="item.complainImg2" @click="alertBigImg(plainDtl.complainImg2)" :src="item.complainImg2" alt="img" class="pd-img">
              <img v-if="item.complainImg3" @click="alertBigImg(plainDtl.complainImg3)" :src="item.complainImg3" alt="img" class="pd-img">
            </div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">回诉人:</div>
            <div class="pd-right">{{item.resNickNam}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">回诉人手机:</div>
            <div class="pd-right">{{item.resTelephone}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">提交时间:</div>
            <div class="pd-right">{{item.createTime}}</div>
          </div>
        </div>
      </div>
      <div class="pd-box">
        <div class="pd-item" v-for="item1, index in plainKfHandel" :key="index">
          <div class="pd-group clearfix">
            <div class="pd-label">处理状态:</div>
            <div class="pd-right">{{item1.complainStatus}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">回复内容:</div>
            <div class="pd-right">{{item1.context}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">提交人:</div>
            <div class="pd-right">{{item1.kefu}}</div>
          </div>
          <div class="pd-group clearfix">
            <div class="pd-label">提交时间:</div>
            <div class="pd-right">{{item1.createTime}}</div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
    </div>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'xjTranPlain-dtl',
  props: {
    value: Boolean,
    complainId: String
  },
  data () {
    return {
      visible: this.value,
      bigImgUrl: '',
      isBigImg: false,
      plainDtl: {},
      plainKfHandel: [],
      plainRespond: []
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    complainId (val) {
      if (val) {
        this.$ajax({
          url: '/store/account/xj/xjTranPlaint/queryPlainsDtl',
          data: {complainId: this.complainId},
          success: data => {
            let attr = data.attr
            this.plainDtl = attr.plainDtl || {}
            this.plainKfHandel = attr.plainKfHandel || []
            this.plainRespond = attr.plainRespond || []
          }
        })
      }
    }
  },
  created () {},
  methods: {
    // 海报图放大处理
    alertBigImg (url) {
      this.bigImgUrl = url
      this.isBigImg = true
    },
    // 关闭
    close () {
      this.$emit('change')
    }
  }
}
</script>
<style lang="less">
  .alertImg-wrap{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.8);
    z-index: 90000;
    .content{
      width: 1000px;
      height: 600px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .big-img{
        height: 100%;
      }
    }
  }
  .plain-dtl {
    .pd-box {
      border-bottom: 2px solid #666;
    }
    .pd-item {
      padding-bottom: 10px;
      border-bottom: 1px solid #dcdcdc;
      &:last-child {
        border-bottom: 0;
      }
    }
    .pd-label {
      float: left;
      width: 140px;
      box-sizing: border-box;
      padding: 10px;
    }
    .pd-right {
      margin-left: 140px;
      padding-top: 10px;
    }
    .pd-img {
      width: 60px;
      height:100px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
    }
  }
</style>
