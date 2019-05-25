<template>
  <el-dialog class="edit-dialog" title="添加我要推广" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="推广标题" prop="title" :rules="{required: true, message: '推广标题不能为空', trigger: 'blur'}">
        <el-input v-model="form.title" placeholder="请输入推广标题"></el-input>
      </el-form-item>
      <el-form-item label="海报类型" prop="type" :rules="{type: 'number', required: true, message: '海报类型不能为空', trigger: 'blur'}">
        <el-select v-model="form.type" clearable placeholder="海报类型">
          <el-option label="关联产品" :value="1">关联产品</el-option>
          <el-option label="招募海报" :value="2">招募海报</el-option>
          <el-option label="专属代理" :value="3">专属海报</el-option>
          <el-option label="邀请办卡" :value="4">邀请办卡</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="prodName" v-if="form.type === 1">
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
      <el-form-item label="推广效果图" class="gradeImg-uploader">
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
       <el-form-item label="推广小图标" class="gradeImg-uploader">
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="minImgHandle"
          :auto-upload="false">
          <img v-if="form.minImg" :src="form.minImg" class="avatar">
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
  name: 'fx-effect-add',
  props: {
    value: Boolean,
    prodList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        title: '',
        prodId: '',
        effectImg: '',
        minImg: '',
        indexNum: '',
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
    }
  },
  methods: {
    // 推广效果图标处理
    effectImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.effectImg = data.fileId
        }
      })
    },
    // 推广小图标图标处理
    minImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.minImg = data.fileId
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      if (this.form.type === 2 || this.form.type === 3 || this.form.type === 4) {
        this.form.prodId = '0'
      }
      if (this.form.type === 1) {
        if (this.form.prodId === '') {
          this.$msg('请选择产品名称！')
          return
        }
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxPoster/addEffectCfg',
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
