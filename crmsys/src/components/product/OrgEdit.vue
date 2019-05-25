<template>
  <el-dialog class="edit-dialog" title="添加机构" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="机构id">
        <span>{{form.orgId}}</span>
      </el-form-item>
      <el-form-item label="机构代号" prop="code" :rules="{required: true, message: '机构代号不能为空', trigger: 'blur'}">
        <el-input v-model="form.code" placeholder="请输入机构代号"></el-input>
      </el-form-item>
      <el-form-item label="机构名称" prop="name" :rules="{required: true, message: '机构名称不能为空', trigger: 'blur'}">
        <el-input v-model="form.name" placeholder="请输入机构名称"></el-input>
      </el-form-item>
      <el-form-item label="机构类型" prop="type" :rules="{required: true, message: '机构类型不能为空', trigger: 'blur'}">
        <el-select v-model="form.type" placeholder="请选择机构类型">
          <el-option v-for="item,key,index in type" :label="item" :value="Number(key)" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="logo地址" class="gradeImg-uploader" required>
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="changeHandle"
          :auto-upload="false">
          <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
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
  name: 'org-edit',
  props: {
    value: Boolean,
    type: Object,
    orgData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        orgId: '',
        code: '',
        name: '',
        type: '',
        logoUrl: ''
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
    orgData (data) {
      this.form = data
    }
  },
  methods: {
    // 上传成功
    changeHandle (file, fileList) {
      this.$upload({
        url: '/crmapp/uploadAction/uploadFile',
        data: {
          fileType: 'xxkdOrg',
          file: file.raw
        },
        success: data => {
          this.form.logoUrl = data.fileId
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
            url: '/crmsys/account/prod/org/update',
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
