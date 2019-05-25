<template>
  <el-dialog class="edit-dialog" title="编辑推荐信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="推荐标题" prop="title" :rules="{required: true, message: '推荐标题不能为空', trigger: 'blur'}">
        <el-input v-model="form.title" placeholder="请输入推荐标题"></el-input>
      </el-form-item>
      <el-form-item label="推荐内容" prop="titleDesc" :rules="{required: true, message: '推荐内容不能为空', trigger: 'blur'}">
        <el-input type="textarea" v-model="form.titleDesc" placeholder="请输入推荐内容"></el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="prodName">
        <el-select v-model="form.prodId" clearable placeholder="请选择产品名称" >
        <el-option
          v-for="item, index in prodList"
          :label="item.prodName"
          :value="item.prodId"
          :key="index"
          >
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐排序" prop="indexNum">
        <el-input v-model.number="form.indexNum" placeholder="请输入推荐排序号"></el-input>
      </el-form-item>
      <el-form-item label="推荐图标" class="gradeImg-uploader">
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
      <el-form-item label="推荐海报" class="gradeImg-uploader">
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="posterImgHandle"
          :auto-upload="false">
          <img v-if="form.posterImg" :src="form.posterImg" class="avatar">
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
  name: 'fx-referer-edit',
  props: {
    value: Boolean,
    fxRefererData: Object,
    prodList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        title: '',
        titleDesc: '',
        indexNum: '',
        cardImg: '',
        posterImg: '',
        prodId: '',
        enable: 1
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
    fxRefererData (data) {
      this.form = data
    }
  },
  methods: {
     // 推荐图标处理
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
     // 推荐海报图处理
    posterImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.posterImg = data.fileId
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
          let titleDescStr = this.form.titleDesc
          titleDescStr = titleDescStr.replace(/\n/g, '<br>')
          this.form.titleDesc = titleDescStr
          this.$ajax({
            url: '/store/account/fx/fxReferer/updateRefererInfo',
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
