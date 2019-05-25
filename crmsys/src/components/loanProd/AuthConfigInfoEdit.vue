<template>
  <el-dialog class="edit-dialog" title="编辑授权项" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="授权名称" prop="authName" :rules="{required: true, message: '授权名称不能为空', trigger: 'blur'}">
        <el-input v-model="form.authName" placeholder="请输入授权名称"></el-input>
      </el-form-item>

      <el-form-item label="授权类型" prop="authType" :rules="{required: true, message: '授权类型不能为空', trigger: 'blur'}">
        <el-input v-model="form.authType" placeholder="请输入授权类型"></el-input>
      </el-form-item>

      <el-form-item label="授权图标" class="gradeImg-uploader" required>
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="changeHandle"
          :auto-upload="false">
          <img v-if="form.icon" :src="form.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="是否启用" class="gradeImg-uploader" required>
           <el-form-item class="el-col" prop="status">
            <el-radio-group v-model="form.status">
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
  name: 'authConfigInfo-edit',
  props: {
    value: Boolean,
    authConfigData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        authName: '',
        authType: '',
        icon: '',
        status: 1
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
    authConfigData (data) {
      this.form = data
    }
  },
  methods: {
    // 上传授权图标
    changeHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'orgIcon',
          file: file.raw
        },
        success: data => {
          this.form.icon = data.fileId
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
            url: '/open/account/config/authConfig/modifyAuthConfigInfo',
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
