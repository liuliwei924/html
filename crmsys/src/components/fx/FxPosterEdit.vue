<template>
  <div class="fx-poster-mask" v-show="visible">
    <div class="poster-form edit-dialog double-dialog">
      <div class="el-dialog__header"><span class="el-dialog__title">编辑海报信息</span><button type="button" aria-label="Close" class="el-dialog__headerbtn"><i  @click="close" class="el-dialog__close el-icon el-icon-close"></i></button></div>
      <el-form :model="form" ref="form" label-width="150px">
        <el-form-item label="海报类型" prop="type" :rules="{type: 'number', required: true, message: '海报类型不能为空', trigger: 'blur'}">
          <el-select v-model="form.type" clearable placeholder="海报类型">
            <el-option label="信用卡海报" :value="1">信用卡海报</el-option>
            <el-option label="推广海报" :value="2">推广海报</el-option>
            <el-option label="专属海报" :value="3">专属海报</el-option>
            <el-option label="邀请办卡" :value="4">邀请办卡</el-option>
            <el-option label="贷款海报" :value="6">贷款海报</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="prodName" v-if="form.type === 1 || form.type === 6">
          <el-select v-model="form.prodId" clearable filterable placeholder="请选择产品名称" >
          <el-option
            v-for="item, index in prodList"
            :label="item.prodName"
            :value="item.prodId"
            :key="index"
            >
          </el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="二维码左边距" prop="qrcodeMarginLeft">
          <el-input v-model.number="form.qrcodeMarginLeft" placeholder="请输入二维码左边距"></el-input>
        </el-form-item>
        <el-form-item label="二维码上边距" prop="qrcodeMarginTop">
          <el-input v-model.number="form.qrcodeMarginTop" placeholder="请输入二维码上边距"></el-input>
        </el-form-item>
        <el-form-item label="二维码大小" prop="qrcodeSize">
          <el-input v-model.number="form.qrcodeSize" placeholder="请输入二维码大小"></el-input>
        </el-form-item>
           <el-form-item label="头像左边距" prop="headImgMarginLeft">
          <el-input v-model.number="form.headImgMarginLeft" placeholder="请输入头像左边距"></el-input>
        </el-form-item>
        <el-form-item label="头像上边距" prop="headImgMarginTop">
          <el-input v-model.number="form.headImgMarginTop" placeholder="请输入头像上边距"></el-input>
        </el-form-item>
        <el-form-item label="头像大小" prop="headImgSize">
          <el-input v-model.number="form.headImgSize" placeholder="请输入头像大小"></el-input>
        </el-form-item>
        <el-form-item label="姓名左边距" prop="nameMarginLeft">
          <el-input v-model.number="form.nameMarginLeft" placeholder="请输入姓名左边距"></el-input>
        </el-form-item>
        <el-form-item label="姓名上边距" prop="nameMarginTop">
          <el-input v-model.number="form.nameMarginTop" placeholder="请输入姓名上边距"></el-input>
        </el-form-item>
        <el-form-item label="姓名大小" prop="nameSize">
          <el-input v-model.number="form.nameSize" placeholder="请输入姓名大小"></el-input>
        </el-form-item>
        <el-form-item label="姓名颜色" prop="nameColor">
          <el-input v-model="form.nameColor" placeholder="请输入姓名颜色"></el-input>
        </el-form-item>
        <el-form-item label="产品详情展示海报" prop="isDtlImage">
         <el-input v-model.number="form.isDtlImage" placeholder="请输入展示海报"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="indexNum">
          <el-input v-model.number="form.indexNum" placeholder="请输入排序号"></el-input>
        </el-form-item>
        <el-form-item label="海报图标" class="gradeImg-uploader">
          <el-upload
            class="avatar-uploader"
            action="action"
            :show-file-list="false"
            :on-change="posterBgImgHandle"
            :auto-upload="false">
            <img v-if="form.posterBgImg" :src="form.posterBgImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否启用" class="gradeImg-uploader" required>
          <el-form-item class="el-col" prop="enable">
            <el-radio-group v-model="form.enable">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div class="el-dialog__footer">
        <div>
          <button type="button" class="el-button el-button--default" @click="close"><!----><!----><span>取消</span></button>
           <button type="button" class="el-button el-button--default" @click="confirm"><!----><!----><span>确定</span></button>
           <button type="button" class="el-button el-button--default" @click="preview"><!----><!----><span>预览</span></button>
         </div>
       </div>
    </div>
    <div class="preview-poster">
      <img :src="previewImg" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'fx-poster-edit',
  props: {
    value: Boolean,
    fxPosterData: Object,
    prodList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        type: 1,
        posterBgImg: '',
        prodId: '',
        qrcodeMarginLeft: 0,
        qrcodeMarginTop: 0,
        qrcodeSize: 0,
        headImgMarginLeft: 0,
        headImgMarginTop: 0,
        headImgSize: 0,
        nameMarginLeft: 0,
        nameMarginTop: 0,
        nameSize: 0,
        isDtlImage: 0,
        nameColor: '',
        indexNum: 1,
        enable: 1
      },
      previewImg: ''
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    fxPosterData (data) {
      this.form = data
    }
  },
  methods: {
    // 海报图标处理
    posterBgImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxPoster',
          file: file.raw
        },
        success: data => {
          this.form.posterBgImg = data.fileId
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 预览
    preview () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxProd/previewPoster',
            data: this.form,
            success: data => {
              this.previewImg = data.attr.imgUrl
            }
          })
        }
      })
    },
    // 确定
    confirm () {
      if (this.form.type === 2 || this.form.type === 3 || this.form.type === 4) {
        this.form.prodId = '0'
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxPoster/updatePosterInfo',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
  .fx-poster-mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.5);
    display: flex;
    justify-content:center;
    align-items: center;
    z-index: 100;
    .poster-form{
      width:900px;
      overflow: hidden;
      background: #fff;
      margin-right:50px;
    }
    .el-form{
      overflow: hidden;
      margin: 20px 0;
    }
    .preview-poster{
      width: 290px;
      height: 520px;
      img{
        width:100%;
      }
    }
  }
</style>
