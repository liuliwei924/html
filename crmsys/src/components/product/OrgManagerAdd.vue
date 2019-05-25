<template>
  <el-dialog class="edit-dialog" title="添加机构" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="机构名称" prop="orgName" :rules="{required: true, message: '机构名称不能为空', trigger: 'blur'}">
        <el-input v-model="form.orgName" placeholder="请输入机构名称"></el-input>
      </el-form-item>
      <el-form-item label="小图标" class="gradeImg-uploader" required>
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="changeHandle1"
          :auto-upload="false">
          <img v-if="form.orgIcon" :src="form.orgIcon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="大图标" class="gradeImg-uploader" required>
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="changeHandle2"
          :auto-upload="false">
          <img v-if="form.orgBigIcon" :src="form.orgBigIcon" class="avatar">
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
  name: 'Org-manager-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      form: {
        orgName: '',
        orgIcon: '',
        orgBigIcon: ''
      }
    }
  },
  computed: {
    visible: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },
  methods: {
    // 上传小图
    changeHandle1 (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'orgIcon',
          file: file.raw
        },
        success: data => {
          this.form.orgIcon = data.fileId
        }
      })
    },
    // 上传大图
    changeHandle2 (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'orgIcon',
          file: file.raw
        },
        success: data => {
          this.form.orgBigIcon = data.fileId
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
            url: '/open/account/org/orgInfo/add',
            data: this.form,
            success: data => {
              this.visible = false
            }
          })
        }
      })
    }
  }
}
</script>
