<template>
  <el-dialog class="edit-dialog" title="添加产品详情" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
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
      <el-form-item label="产品详情图标" class="gradeImg-uploader">
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="posterBgImgHandle"
          :auto-upload="false">
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="排序号" prop="indexNum" :rules="{type: 'number', required: true, message: '排序号为空', trigger: 'blur'}">
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
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'fx-prodDtl-add',
  props: {
    value: Boolean,
    prodList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        imageUrl: '',
        prodId: '',
        indexNum: '',
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
    // 产品详情图标处理
    posterBgImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.imageUrl = data.fileId
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
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxPoster/addProdDtlCfg',
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
