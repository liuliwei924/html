<template>
  <el-dialog class="edit-dialog" title="修改知识库" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px" v-loading="loading">
      <el-form-item
        label="产品名称"
        prop="productName"
        :rules="{required: true, message: '产品名称不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.productName"
          placeholder="请输入产品名称">
        </el-input>
      </el-form-item>
      <el-form-item
        label="所属目录"
        prop="productType">
        <el-tree :data="productMenuData"
          show-checkbox
          highlight-current
          check-strictly
          :default-checked-keys="[this.objSelectId]"
          :default-expanded-keys="[this.objSelectId]"
          node-key="typeId"
          ref="tree"
          :props="defaultProps">
        </el-tree>
      </el-form-item>
      <el-form-item label="上传文件" class="gradeImg-uploader" v-if="showUpload"
      prop="fileUrl"
      :rules="{required: true, message: '文件不能为空',trigger: 'blur'}">
        <el-upload
          class="avatar-uploader"
          action="action"
          list-type="text"
          :on-change="fileChangeHandle"
          :auto-upload="false">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">只能上传单个pdf,xlxs,xls文件，且不超过5MB</div>
        </el-upload>
        <el-input type="hidden" v-model="form.fileUrl"></el-input>
      </el-form-item>
      <div v-else class="fileUrl-wrap">已上传文件<a :href="form.fileUrl">{{form.productName}}</a> <span @click="showUpload = true">重新上传</span></div>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'knowBase-edit',
  props: {
    value: Boolean,
    productData: Object
  },
  data () {
    return {
      showUpload: false,
      loading: false,
      visible: this.value,
      productMenuData: [],
      objSelectId: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        productId: '',
        productName: '',
        productType: '',
        fileUrl: ''
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.showUpload = false
      this.$emit('change', val)
    },
    objSelectId (val) {
      this.objSelectId = val
      this.queryProductMenu()
    },
    // 编辑数据变化
    productData (obj) {
      this.form = {
        productId: obj['productId'] || '',
        productName: obj['productName'] || '',
        productType: obj['productType'] || '',
        fileUrl: obj['fileUrl'] || ''
      }
      this.objSelectId = obj['productType'] || ''
    }
  },
  created () {
    this.queryProductMenu()
  },
  methods: {
    // 附件上传
    fileChangeHandle (file, fileList) {
      let fileSize = file.size / 1024 / 1024 < 5
      if (!fileSize) {
        this.$message('文件大小不能超过5MB！')
        return
      }
      let fileLength = fileList.length
      if (fileLength > 1) {
        this.$message('只能上传单个文件！')
        return
      }
      this.loading = true
      this.$custupload({
        url: '/store/account/know/knowManager/uploadKonwFile',
        data: {
          fileType: 'knowBase',
          file: file.raw
        },
        success: data => {
          this.$message('上传成功')
          this.form.fileUrl = data.attr.fileUrl
          this.loading = false
        },
        fail: err => {
          this.$msg(err.message)
          this.loading = false
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 查询目录树
    queryProductMenu () {
      this.productMenuData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/user/comm/queryProductMenu',
        success: data => {
          this.productMenuData = data.attr.proTypeData || []
        }
      })
    },
    // 确定
    confirm () {
      // 获取选择的目录
      let checkLength = this.$refs.tree.getCheckedNodes().length
      if (checkLength !== 1) {
        this.$msg('请选择一个所属目录(仅一个)!')
        return
      } else {
        let parentInfo = this.$refs.tree.getCheckedNodes()[checkLength - 1]
        this.form.productType = parentInfo.typeId
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/know/knowManager/updateProductInfo',
            data: this.form,
            success: data => {
              this.$message('保存成功')
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
<style>
  .fileUrl-wrap{
    padding-left: 80px;
  }
  .fileUrl-wrap a{
    text-decoration: underline;
    margin: 0 20px;
  }
  .fileUrl-wrap span{
    color: red;
    cursor: pointer;
  }
</style>
