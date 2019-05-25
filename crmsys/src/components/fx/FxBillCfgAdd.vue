<template>
  <el-dialog class="edit-dialog" title="添加账单信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="类型名称" prop="typeName">
        <el-select v-model="form.typeId" clearable placeholder="请选择类型名称" >
          <el-option
            v-for="item, index in typeList"
            :label="item.typeName"
            :value="item.typeId"
            :key="index"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账单名称" prop="iconName">
        <el-input v-model="form.iconName" placeholder="请输入账单名称"></el-input>
      </el-form-item>
      <el-form-item label="账单备注" prop="remark" v-if="form.typeId === 1">
        <el-input v-model="form.remark" placeholder="请输入账单备注"></el-input>
      </el-form-item>
      <el-form-item label="账单图标" class="gradeImg-uploader">
        <el-upload
          class="avatar-uploader"
          action="action"
          :show-file-list="false"
          :on-change="iconImgHandle"
          :auto-upload="false">
          <img v-if="form.iconImg" :src="form.iconImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="排序" prop="indexNum">
        <el-input v-model.number="form.indexNum" placeholder="请输入排序号"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" class="gradeImg-uploader" required>
           <el-form-item class="el-col" prop="enable">
            <el-radio-group v-model="form.enable">
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
  name: 'fx-billcfg-add',
  props: {
    value: Boolean,
    typeList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        typeId: '',
        indexNum: 1,
        iconImg: '',
        iconName: '',
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
    // 小图处理
    iconImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.iconImg = data.fileId
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      if (this.form.typeId === '') {
        this.$msg('请选择类型名称！')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxReferer/addFxBillInfo',
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
