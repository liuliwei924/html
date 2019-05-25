<template>
  <el-dialog class="edit-dialog double-dialog" title="添加海报信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px" class="clearfix">
      <el-form-item label="海报类型:" prop="tgId">
        <el-select
          v-model="form.tgId"
          filterable
          clearable
          placeholder="请选择">
          <el-option
            v-for="item, index in postTgData"
            :label="item.tgId + '-' +item.typeName"
            :value="item.tgId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二维码类型:" prop="qrcodeType" >
        <el-select
          v-model="form.qrcodeType"
          clearable
          placeholder="请选择">
          <el-option
            v-for="val,key,index in qrcodeType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="prodId" v-if="form.qrcodeType === 2">
        <el-select 
          v-model="form.prodId" 
          clearable 
          placeholder="请选择产品名称">
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
      <el-form-item label="工号左边距" prop="workNoMarginLeft">
        <el-input v-model.number="form.workNoMarginLeft" placeholder="请输入工号左边距"></el-input>
      </el-form-item>
      <el-form-item label="工号上边距" prop="nameMarginTop">
        <el-input v-model.number="form.workNoMarginTop" placeholder="请输入工号上边距"></el-input>
      </el-form-item>
      <el-form-item label="工号大小" prop="workNoSize">
        <el-input v-model.number="form.workNoSize" placeholder="请输入工号大小"></el-input>
      </el-form-item>
      <el-form-item label="工号颜色" prop="workNoColor">
        <el-input v-model="form.workNoColor" placeholder="请输入工号颜色"></el-input>
      </el-form-item>
        <el-form-item label="等级左边距" prop="gradeNameMarginLeft">
        <el-input v-model.number="form.gradeNameMarginLeft" placeholder="请输入等级左边距"></el-input>
      </el-form-item>
      <el-form-item label="等级上边距" prop="gradeNameMarginTop">
        <el-input v-model.number="form.gradeNameMarginTop" placeholder="请输入等级上边距"></el-input>
      </el-form-item>
      <el-form-item label="等级大小" prop="gradeNameSize">
        <el-input v-model.number="form.gradeNameSize" placeholder="请输入等级大小"></el-input>
      </el-form-item>
      <el-form-item label="等级颜色" prop="gradeNameColor">
        <el-input v-model="form.gradeNameColor" placeholder="请输入等级颜色"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="indexNum">
        <el-input v-model.number="form.indexNum" placeholder="请输入排序号"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" class="gradeImg-uploader" required>
        <el-form-item class="el-col" prop="enable">
          <el-radio-group v-model="form.enable">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
      <el-form-item label="效果图" class="gradeImg-uploader">
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="effectImgHandle"
          :auto-upload="false">
          <img v-if="form.effectImg" :src="form.effectImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'fx-pyq-poster-add',
  props: {
    value: Boolean,
    prodList: Array,
    postTgData: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        tgId: '',
        qrcodeType: '',
        posterBgImg: '',
        effectImg: '',
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
        nameColor: '',
        gradeNameColor: '',
        gradeNameSize: 0,
        gradeNameMarginTop: 0,
        gradeNameMarginLeft: 0,
        workNoColor: '',
        workNoSize: 0,
        workNoMarginTop: 0,
        workNoMarginLeft: 0,
        indexNum: 1,
        enable: 0
      },
      // 二维码类型
      qrcodeType: {
        0: '无',
        1: '到落地页二维码',
        2: '到某产品二维码',
        3: '到所有产品二维码'
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    // 海报图标处理
    posterBgImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.posterBgImg = data.fileId
          this.$message('上传成功')
        }
      })
    },
    // 效果图图标处理
    effectImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.effectImg = data.fileId
          this.$message('上传成功')
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      if (this.form.qrcodeType === 0 || this.form.qrcodeType === 1 || this.form.qrcodeType === 3) {
        this.form.prodId = 0
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxPyqPoster/addPostCfgInfo',
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
