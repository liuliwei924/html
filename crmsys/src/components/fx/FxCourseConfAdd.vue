<template>
  <el-dialog class="edit-dialog" title="添加课堂配置" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="课堂类型" prop="courseType">
        <el-select
          v-model="form.courseType"
          clearable
          placeholder="请选择">
          <el-option
            v-for="item, index in courseTypeList"
            :label="item.typeName"
            :value="item.typeId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title" :rules="{required: true, message: '标题不能为空', trigger: 'blur'}">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="subTitle">
        <el-input v-model.number="form.subTitle" placeholder="请输入副标题"></el-input>
      </el-form-item>
      <el-form-item label="按钮名称" prop="btnName">
        <el-input v-model.number="form.btnName" placeholder="请输入按钮名称"></el-input>
      </el-form-item>
      <el-form-item label="链接地址" prop="linkUrl">
        <el-input v-model.number="form.linkUrl" placeholder="请输入链接地址"></el-input>
      </el-form-item>
      <el-form-item label="图片" class="gradeImg-uploader">
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="courseBgImgHandle"
          :auto-upload="false">
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否启用" class="gradeImg-uploader" required>
        <el-form-item class="el-col" prop="enable">
          <el-radio-group v-model="form.enable">
            <el-radio-button label="1">开启</el-radio-button>
            <el-radio-button label="0">禁用</el-radio-button>
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
  name: 'fx-courseConf-add',
  props: {
    value: Boolean,
    courseTypeList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        courseType: '',
        title: '',
        subTitle: '',
        btnName: '',
        linkUrl: '',
        imageUrl: '',
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
    courseBgImgHandle (file, fileList) {
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
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxCourseConf/addCourseConfInfo',
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
