<template>
  <el-dialog class="edit-dialog" title="添加能力等级" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="能力等级ID" prop="gradeCode" :rules="{required: true, message: '能力等级ID不能为空', trigger: 'blur'}">
        <el-input v-model="form.gradeCode" placeholder="请输入能力等级ID"></el-input>
      </el-form-item>
      <el-form-item label="能力等级名称" prop="gradeName" :rules="{required: true, message: '能力等级名称不能为空', trigger: 'blur'}">
        <el-input v-model="form.gradeName" placeholder="请输入能力等级名称"></el-input>
      </el-form-item>
      <el-form-item label="能力等级小图片" class="gradeImg-uploader" required>
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="changeHandle1"
          :auto-upload="false">
          <img v-if="form.gradeImg" :src="form.gradeImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="能力等级大图片" class="gradeImg-uploader" required>
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="changeHandle2"
          :auto-upload="false">
          <img v-if="form.gradeImg2" :src="form.gradeImg2" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="能力等级描述" prop="gradeDesc" :rules="{required: true, message: '能力等级描述不能为空', trigger: 'blur'}">
        <el-input v-model="form.gradeDesc" placeholder="请输入能力等级名称"></el-input>
      </el-form-item>
      <el-form-item label="最低能力值" prop="minScore" 
        :rules="[
          {required: true, message: '最低能力值不能为空'},
          {type: 'number', message: '最低能力值必须为数字值'}
        ]">
        <el-input v-model.number="form.minScore" placeholder="请输入最低能力值"></el-input>
      </el-form-item>
      <el-form-item label="最高能力值" prop="maxScore" 
        :rules="[
          {required: true, message: '最高能力值不能为空'},
          {type: 'number', message: '最高能力值必须为数字值'}
        ]">
        <el-input v-model.number="form.maxScore" placeholder="请输入最高能力值"></el-input>
      </el-form-item>
      <el-form-item label="回款成功笔数" prop="successCount" 
        :rules="[
          {required: true, message: '回款成功笔数不能为空'},
          {type: 'number', message: '回款成功笔数必须为数字值'}
        ]">
        <el-input v-model.number="form.successCount" placeholder="请输入回款成功笔数"></el-input>
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
  name: 'abillty-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      reader: new FileReader(),
      form: {
        gradeCode: '',
        gradeName: '',
        gradeDesc: '',
        gradeImg: '',
        gradeImg2: '',
        minScore: '',
        maxScore: '',
        successCount: ''
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
    // 小图上传
    changeHandle1 (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'abilityGrade',
          file: file.raw
        },
        success: data => {
          this.form.gradeImg = data.fileId
        }
      })
    },
    // 大图上传
    changeHandle2 (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'abilityGrade',
          file: file.raw
        },
        success: data => {
          this.form.gradeImg2 = data.fileId
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
            url: '/store/account/config/abilityGrade/save',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
            }
          })
          this.close()
        }
      })
    }
  }
}
</script>
