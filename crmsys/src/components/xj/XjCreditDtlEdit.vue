<template>
  <el-dialog class="edit-dialog" title="编辑产品信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
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
      <el-form-item label="图片" class="gradeImg-uploader">
        <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="imgUrlHandle" :auto-upload="false">
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="产品排序"
        prop="indexNum"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.indexNum"></el-input>
      </el-form-item>
      <el-form-item
        label="是否启用"
        prop="enable"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.enable"  placeholder="请选择状态">
          <el-option
            v-for="val,key,index in enable"
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
  name: 'xjCreditProd-edit',
  props: {
    value: Boolean,
    custData: Object,
    enable: Object,
    prodList: Array
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        imgId: '',
        prodId: '',
        indexNum: '',
        enable: '',
        imageUrl: ''
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
        imgId: obj['imgId'] || '',
        prodId: obj['prodId'] || '',
        imageUrl: obj['imageUrl'] || '',
        indexNum: obj['indexNum'] || 0,
        enable: obj['enable'] || 0
      }
    }
  },
  methods: {
    // 项目图标处理
    imgUrlHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'xjCreditDtlImg',
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
            url: '/store/account/xj/xjCreditDtl/editCreditDtl',
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
