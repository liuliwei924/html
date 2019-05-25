<template>
  <el-dialog class="edit-dialog" title="添加兑换项目" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="项目名"
        prop="name"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="图片路径" class="gradeImg-uploader">
        <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="imgUrlHandle" :auto-upload="false">
          <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="详情图片路径" class="gradeImg-uploader">
        <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="detailImgUrlHandle" :auto-upload="false">
          <img v-if="form.detailImgUrl" :src="form.detailImgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="单价"
        prop="changePrice"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.changePrice"></el-input>
      </el-form-item>
      <el-form-item
        label="单位"
        prop="changeUnit"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.changeUnit"  placeholder="请选择单位">
          <el-option
            v-for="val,key,index in changeUnit"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="交换实物值"
        prop="changeValue"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.changeValue"></el-input>
      </el-form-item>
      <el-form-item label="简要描述" prop="changeDesc" :rules="{required: false, message: '简要描述不能为空'}">
        <el-input v-model="form.changeDesc" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="当前价描述" prop="priceDesc" :rules="{required: false, message: '当前价描述不能为空'}">
        <el-input v-model="form.priceDesc" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item
        label="排序值"
        prop="orderIndex"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.orderIndex"></el-input>
      </el-form-item>
      <el-form-item
        label="类型"
        prop="typeId"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.typeId"  placeholder="请选择类型">
          <el-option
            v-for="val,key,index in typeNameList"
            :label="val.typeName"
            :value="Number(val.typeId)"
            :key="index">
          </el-option>
        </el-select>
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
      <el-form-item
        label="参与人数"
        prop="countValue"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.countValue"></el-input>
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
  name: 'xjChange-add',
  props: {
    value: Boolean,
    status: Object,
    changeUnit: Object,
    typeNameList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        name: '',
        imgUrl: '',
        detailImgUrl: '',
        changePrice: '',
        changeUnit: '',
        changeValue: '',
        changeDesc: '',
        priceDesc: '',
        orderIndex: '',
        typeId: '',
        status: '',
        countValue: ''
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
    typeNameList (arr) {
      this.first = true
      this.typeNameList = arr
    }
  },
  methods: {
    // 项目图标处理
    imgUrlHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'xjImgUrl',
          file: file.raw
        },
        success: data => {
          this.form.imgUrl = data.fileId
        }
      })
    },
    // 项目图标处理
    detailImgUrlHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'xjImgUrl',
          file: file.raw
        },
        success: data => {
          this.form.detailImgUrl = data.fileId
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
            url: '/store/account/xj/xjChangeCfg/addChangePro',
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