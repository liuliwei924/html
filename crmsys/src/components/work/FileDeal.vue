<template>
  <div>
    <el-dialog
      class="edit-dialog"
      title="附件上传"
      size="tiny"
      v-model="visible">
      <el-form label-width="100px">
        <div class="down-pdf-w"><a class="down-url" :href="url.url" v-for="url,index in houseArr" target="_blank">房产附件({{index + 1}})</a></div>
        <el-form-item label="房产证" class="gradeImg-uploader">
          <el-upload
            class="avatar-uploader"
            action="action"
            list-type="picture-card"
            :file-list="houseList"
            :on-change="houseChangeHandle"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :auto-upload="false">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">最多只能上传4张图片，如需上传更多可直接上传PDF文件或ZIP文件</div>
          </el-upload>
        </el-form-item>
        <div class="down-pdf-w"><a class="down-url" :href="url.url" v-for="url,index in creditArr" target="_blank">征信附件({{index + 1}})</a></div>
        <el-form-item label="征信报告" class="gradeImg-uploader">
          <el-upload
            class="avatar-uploader"
            action="action"
            list-type="picture-card"
            :file-list="creditList"
            :on-change="creditChangeHandle"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :auto-upload="false">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">最多只能上传4张图片，如需上传更多可直接上传PDF文件或ZIP文件</div>
          </el-upload>
        </el-form-item>
        <div class="down-pdf-w"><a class="down-url" :href="url.url" v-for="url,index in contractArr" target="_blank">合同附件({{index + 1}})</a></div>
        <el-form-item label="抵押按揭合同" class="gradeImg-uploader">
          <el-upload
            class="avatar-uploader"
            action="action"
            list-type="picture-card"
            :file-list="contractList"
            :on-change="contractChangeHandle"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :auto-upload="false">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">最多只能上传4张图片，如需上传更多可直接上传PDF文件或ZIP文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 操作员编辑组件
export default {
  name: 'file-deal',
  // 父组件传递参数
  props: {
    value: Boolean,
    applyId: [Number, String],
    upLoadData: Object
  },
  data () {
    return {
      houseArr: [],
      creditArr: [],
      contractArr: [],
      currUpLoadData: this.upLoadData,
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      contractList: [],
      creditList: [],
      houseList: []
    }
  },
  watch: {
    // 监听父组件传递的参数变化
    value (val) {
      this.visible = val
    },
    // 弹窗显示改变传递给父组件
    visible (val) {
      this.$emit('change', val)
    },
    upLoadData (data) {
      if (typeof data === 'object') {
        this.currUpLoadData = data
      }
    },
    currUpLoadData (data) {
      if (typeof data === 'object') {
        this.creditList = data.creditList || []
        this.houseList = data.houseList || []
        this.contractList = data.contractList || []
        this.houseArr = this.houseList
        this.creditArr = this.creditList
        this.contractArr = this.contractList
      }
    }
  },
  methods: {
    queryMaterial () {
      this.$ajax({
        url: '/store/account/work/applyInfo/queryCustMaterial',
        data: {
          applyId: this.applyId
        },
        success: data => {
          this.currUpLoadData = data.attr || {}
        }
      })
    },
    handleRemove (file, fileList) {
      this.$ajax({
        url: '/store/account/work/waitDeal/deleteFile',
        data: {
          fileId: file.fileId
        },
        success: data => {
          this.queryMaterial()
          this.$message('操作成功')
        }
      })
    },
    handlePictureCardPreview (file) {
      this.$emit('showBigImg', file.url)
    },
    // 房产证上传
    houseChangeHandle (file, fileList) {
      let fileSize = file.size / 1024 / 1024 < 5
      if (!fileSize) {
        this.$message('文件大小不能超过5MB')
        return
      }
      if (fileList.length > 4) {
        this.$message('最多只能上传四张图片')
      } else {
        this.$custupload({
          url: '/store/account/work/waitDeal/saveCustmaterial',
          data: {
            fileType: 'custmaterial',
            materialType: 'house',
            applyId: this.applyId,
            file: file.raw
          },
          success: data => {
            this.$message('上传成功')
            this.houseList.push(data.attr)
          }
        })
      }
    },
    // 征信报告上传
    creditChangeHandle (file, fileList) {
      let fileSize = file.size / 1024 / 1024 < 5
      if (!fileSize) {
        this.$message('文件大小不能超过5MB')
        return
      }
      if (fileList.length > 4) {
        this.$message('最多只能上传四张图片')
      } else {
        this.$custupload({
          url: '/store/account/work/waitDeal/saveCustmaterial',
          data: {
            fileType: 'custmaterial',
            materialType: 'credit',
            applyId: this.applyId,
            file: file.raw
          },
          success: data => {
            this.$message('上传成功')
            this.creditList.push(data.attr)
          }
        })
      }
    },
    // 抵押按揭合同上传
    contractChangeHandle (file, fileList) {
      let fileSize = file.size / 1024 / 1024 < 5
      if (!fileSize) {
        this.$message('文件大小不能超过5MB')
        return
      }
      if (fileList.length > 4) {
        this.$message('最多只能上传四张图片')
      } else {
        this.$custupload({
          url: '/store/account/work/waitDeal/saveCustmaterial',
          data: {
            fileType: 'custmaterial',
            materialType: 'contract',
            applyId: this.applyId,
            file: file.raw
          },
          success: data => {
            this.$message('上传成功')
            this.contractList.push(data.attr)
          }
        })
      }
    },
    // 弹窗关闭
    close () {
      this.visible = false
    }
  }
}
</script>
<style>
  .edit-dialog .el-form-item__content {
    width: auto;
  }
  .down-pdf-w{
    padding-left: 100px;
  }
  .down-url{
    display: inline-block;
    width: 86px;
  }
</style>
