<template>
  <el-dialog class="edit-dialog double-dialog" title="添加海报配置" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px" class="clearfix">
      <el-form-item
        label="海报编号"
        prop="postCode">
        <el-input v-model="form.postCode"></el-input>
      </el-form-item>
      <el-form-item
        label="海报类型"
        prop="type">
        <el-select
          v-model.number="form.type"
          placeholder="请选择">
          <el-option
            v-for="val,key,index in type"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="海报名称"
        prop="posterName">
        <el-input v-model="form.posterName"></el-input>
      </el-form-item>
      <el-form-item
        label="二维码左边距"
        prop="qrcodeMarLeft">
        <el-input v-model="form.qrcodeMarLeft"></el-input>
      </el-form-item>
       <el-form-item
        label="二维码上边距"
        prop="qrcodeMarTop">
        <el-input v-model="form.qrcodeMarTop"></el-input>
      </el-form-item>
      <el-form-item
        label="二维码大小"
        prop="qrcodeSize">
        <el-input v-model="form.qrcodeSize"></el-input>
      </el-form-item>
      <el-form-item
        label="头像左边距"
        prop="headImgMarLeft">
        <el-input v-model="form.headImgMarLeft"></el-input>
      </el-form-item>
      <el-form-item
        label="头像上边距"
        prop="headImgMarTop">
        <el-input v-model="form.headImgMarTop"></el-input>
      </el-form-item>
      <el-form-item
        label="头像大小"
        prop="headImgSize">
        <el-input v-model="form.headImgSize"></el-input>
      </el-form-item>
      <el-form-item
        label="字体颜色"
        prop="nameColor">
        <el-input v-model="form.nameColor"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名大小"
        prop="nameSize">
        <el-input v-model="form.nameSize"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名左边距"
        prop="nameMarLeft">
        <el-input v-model="form.nameMarLeft"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名上边距"
        prop="nameMarTop">
        <el-input v-model="form.nameMarTop"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号码大小"
        prop="phoneSize">
        <el-input v-model="form.phoneSize"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号码左边距"
        prop="phoneMarLeft">
        <el-input v-model="form.phoneMarLeft"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号码上边距"
        prop="phoneMarTop">
        <el-input v-model="form.phoneMarTop"></el-input>
      </el-form-item>
      <el-form-item
        label="职位大小"
        prop="positionSize">
        <el-input v-model="form.positionSize"></el-input>
      </el-form-item>
      <el-form-item
        label="职位左边距"
        prop="positionMarLeft">
        <el-input v-model="form.positionMarLeft"></el-input>
      </el-form-item>
      <el-form-item
        label="职位上边距"
        prop="positionMarTop">
        <el-input v-model="form.positionMarTop"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名标题大小"
        prop="nameTitSize">
        <el-input v-model="form.nameTitSize"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名标题左边距"
        prop="nameTitMarLeft">
        <el-input v-model="form.nameTitMarLeft"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名标题上边距"
        prop="nameTitMarTop">
        <el-input v-model="form.nameTitMarTop"></el-input>
      </el-form-item>
      <el-form-item
        label="宣传标题大小"
        prop="proTitSize">
        <el-input v-model="form.proTitSize"></el-input>
      </el-form-item>
      <el-form-item
        label="宣传标题左边距"
        prop="proTitMarLeft">
        <el-input v-model="form.proTitMarLeft"></el-input>
      </el-form-item>
      <el-form-item
        label="宣传标题上边距"
        prop="proTitMarTop">
        <el-input v-model="form.proTitMarTop"></el-input>
      </el-form-item>
      <el-form-item
        label="是否启用"
        prop="enable">
        <el-select
          v-model.number="form.enable"
          placeholder="请选择">
          <el-option
            v-for="val,key,index in enable"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item 
        label="海报背景图片" 
        class="gradeImg-uploader">
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
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'wzPostConf-del',
  props: {
    value: Boolean,
    wzPostData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        postCode: '',
        type: 1,
        posterName: '',
        posterBgImg: '',
        qrcodeMarLeft: '',
        qrcodeMarTop: '',
        qrcodeSize: '',
        headImgMarLeft: '',
        headImgMarTop: '',
        headImgSize: '',
        defHeadImg: '',
        nameColor: '',
        nameSize: '',
        nameMarLeft: '',
        nameMarTop: '',
        phoneSize: '',
        phoneMarLeft: '',
        phoneMarTop: '',
        positionSize: '',
        positionMarLeft: '',
        positionMarTop: '',
        nameTitSize: '',
        nameTitMarTop: '',
        nameTitMarLeft: '',
        proTitSize: '',
        proTitMarLeft: '',
        proTitMarTop: '',
        enable: 1
      },
      // 海报类型
      type: {
        1: '为自己代言海报'
      },
      // 是否启用
      enable: {
        1: '是',
        2: '否'
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    wzPostData (data) {
      this.form = data
    }
  },
  methods: {
    // 海报图标处理
    posterBgImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'wzCardPostImg',
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
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/wz/wzPostConf/updatePosterConf',
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
