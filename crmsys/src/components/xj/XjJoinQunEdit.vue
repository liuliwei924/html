<template>
  <el-dialog class="edit-dialog" title="编辑加群配置" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="群名称"
        prop="qunName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.qunName"></el-input>
      </el-form-item>
      <el-form-item
        label="群类型"
        prop="qunType"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.qunType"  placeholder="请选择类型">
          <el-option
            v-for="val,key,index in qunType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="群路径"
        prop="qunUrl"
        :rules="{required: false, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.qunUrl"></el-input>
      </el-form-item>
      <el-form-item label="群二维码" class="gradeImg-uploader">
        <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="imgUrlHandle" :auto-upload="false">
          <img v-if="form.qunQrCodeUrl" :src="form.qunQrCodeUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="激活码"
        prop="activeCode"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.activeCode"></el-input>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.status"  placeholder="请选择状态">
          <el-option
            v-for="val,key,index in status"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
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
  name: 'xjJoinQun-edit',
  props: {
    value: Boolean,
    custData: Object,
    status: Object,
    qunType: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        configId: '',
        qunName: '',
        qunType: '',
        qunUrl: '',
        qunQrCodeUrl: '',
        activeCode: '',
        status: ''
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
    // 编辑数据变化
    custData (obj) {
      this.first = true
      this.form = {
        configId: obj['configId'] || '',
        qunName: obj['qunName'] || '',
        qunType: obj['qunType'] || 0,
        qunUrl: obj['qunUrl'] || '',
        qunQrCodeUrl: obj['qunQrCodeUrl'] || '',
        activeCode: obj['activeCode'] || '',
        status: obj['status'] || 0
      }
    }
  },
  methods: {
    // 项目图标处理
    imgUrlHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'xjJoinQunImg',
          file: file.raw
        },
        success: data => {
          this.form.qunQrCodeUrl = data.fileId
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
            url: '/store/account/xj/xjJoinQunCfg/editJoinQunInfo',
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
