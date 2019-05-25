<template>
  <el-dialog class="edit-dialog" title="添加课程类型" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item 
        label="课程名称" 
        prop="typeName" 
        :rules="{required: true, message: '课程名称不能为空', trigger: 'blur'}">
        <el-input 
          v-model="form.typeName" 
          placeholder="请输入课程名称">
        </el-input>
      </el-form-item>
      <el-form-item label="课程描述" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入课程描述"></el-input>
      </el-form-item>
      <el-form-item label="课程排序" prop="indexNum"> 
        <el-input v-model.number="form.indexNum" placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="图片" class="gradeImg-uploader">
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="courseBgImgHandle"
          :auto-upload="false">
          <img v-if="form.bjImg" :src="form.bjImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否启用">
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
  name: 'fxCourseType-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        typeName: '',
        remark: '',
        indexNum: '',
        bjImg: '',
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
    // 关闭
    close () {
      this.visible = false
    },
    courseBgImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.bjImg = data.fileId
        }
      })
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxCourseConf/addCourseTypeInfo',
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
