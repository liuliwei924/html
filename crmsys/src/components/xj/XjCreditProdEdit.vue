<template>
  <el-dialog class="edit-dialog" title="编辑产品信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="产品名称"
        prop="prodName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.prodName"></el-input>
      </el-form-item>
      <el-form-item label="产品图片" class="gradeImg-uploader">
        <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="imgUrlHandle" :auto-upload="false">
          <img v-if="form.prodImg" :src="form.prodImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="产品小图标" class="gradeImg-uploader">
        <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="detailImgUrlHandle" :auto-upload="false">
          <img v-if="form.minProdImg" :src="form.minProdImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="申请人数">
        <el-input v-model="form.applyNum"></el-input>
      </el-form-item>
      <el-form-item
        label="信用卡特性"
        prop="specialty"
        :rules="{required: false, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.specialty"></el-input>
      </el-form-item>
      <el-form-item label="产品描述" prop="prodDesc" :rules="{required: false, message: '产品描述不能为空'}">
        <el-input v-model="form.prodDesc" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="产品标签" prop="prodLabel" :rules="{required: false, message: '产品标签不能为空'}">
        <el-input v-model="form.prodLabel" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="银行跳转链接" prop="url" :rules="{required: true, message: '银行跳转链接不能为空'}">
        <el-input v-model="form.url" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="查询进度跳转链接" prop="progressUrl" :rules="{required: true, message: '查询进度跳转链接不能为空'}">
        <el-input v-model="form.progressUrl" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
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
    enable: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        prodId: '',
        prodName: '',
        prodImg: '',
        minProdImg: '',
        applyNum: '',
        specialty: '',
        prodDesc: '',
        prodLabel: '',
        url: '',
        progressUrl: '',
        indexNum: '',
        enable: ''
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
        prodId: obj['prodId'] || '',
        prodName: obj['prodName'] || '',
        prodImg: obj['prodImg'] || '',
        minProdImg: obj['minProdImg'] || '',
        applyNum: obj['applyNum'] || 0,
        specialty: obj['specialty'] || '',
        prodDesc: obj['prodDesc'] || '',
        prodLabel: obj['prodLabel'] || '',
        url: obj['url'] || '',
        progressUrl: obj['progressUrl'] || '',
        indexNum: obj['indexNum'] + '' || '',
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
          fileType: 'xjCreditImg',
          file: file.raw
        },
        success: data => {
          this.form.prodImg = data.fileId
        }
      })
    },
    // 项目图标处理
    detailImgUrlHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'xjCreditImg',
          file: file.raw
        },
        success: data => {
          this.form.minProdImg = data.fileId
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
            url: '/store/account/xj/xjCreditProd/editCreditProd',
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
