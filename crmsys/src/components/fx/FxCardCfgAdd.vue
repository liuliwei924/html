<template>
  <el-dialog class="edit-dialog" title="添加卡种信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="卡种标题" prop="title" :rules="{required: true, message: '卡种标题不能为空', trigger: 'blur'}">
        <el-input v-model="form.title" placeholder="请输入卡种标题"></el-input>
      </el-form-item>
      <el-form-item label="卡种类型" prop="type" :rules="{type: 'number', required: true, message: '卡种类型不能为空', trigger: 'blur'}">
        <el-select v-model="form.type" clearable placeholder="卡种类型">
          <el-option label="新手办卡" :value="1">新手办卡</el-option>
          <el-option label="易下卡" :value="2">易下卡</el-option>
          <el-option label="大额度" :value="3">大额度</el-option>
          <el-option label="下卡快" :value="4">下卡快</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="prodName">
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
      <el-form-item label="卡种标签" prop="cardLabel">
        <el-input :rows="6" :cols="6" type="textarea" v-model="form.cardLabel" placeholder="请输入卡种标签"></el-input>
      </el-form-item>
      <el-form-item label="卡种排序" prop="indexNum">
        <el-input v-model.number="form.indexNum" placeholder="请输入卡种排序号"></el-input>
      </el-form-item>
      <el-form-item label="卡种分享标题" prop="shareTitle">
        <el-input v-model="form.shareTitle" placeholder="请输入分享标题"></el-input>
      </el-form-item>
      <el-form-item label="卡种分享描述" prop="shareDesc">
         <el-input :rows="3" :cols="3" type="textarea" v-model="form.shareDesc" placeholder="请输入分享描述"></el-input>
      </el-form-item>
      <el-form-item label="卡种小图" class="gradeImg-uploader">
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="cardImgHandle"
          :auto-upload="false">
          <img v-if="form.cardImg" :src="form.cardImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="卡种热门图" class="gradeImg-uploader">
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="cardBigImgHandle"
          :auto-upload="false">
          <img v-if="form.cardBigImg" :src="form.cardBigImg" class="avatar">
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
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'fx-cardcfg-add',
  props: {
    value: Boolean,
    prodList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        title: '',
        type: '',
        cardLabel: '',
        indexNum: 1,
        cardImg: '',
        cardBigImg: '',
        shareTitle: '',
        shareDesc: '',
        prodId: '',
        enable: 0
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
    // 卡种小图处理
    cardImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.cardImg = data.fileId
        }
      })
    },
     // 卡种大图处理
    cardBigImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.cardBigImg = data.fileId
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      if (this.form.prodId === '') {
        this.$msg('请选择产品名称！')
        return
      }
      if (this.form.cardBigImg !== '' && this.form.cardBigImg !== null) {
        if (this.form.shareTitle === '' || this.form.shareDesc === '') {
          this.$msg('请输入卡种分享标题和描述！')
          return
        }
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxReferer/addFxCardInfo',
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
