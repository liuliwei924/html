<template>
  <div class="file-upload__info clearfix">
    <div class="file-upload__img fl" v-for="item,index in files" :key="index">
      <img :src="`${imgUrl}${item.path}${item.fileName}`">
      <div class="file-img__mark"><i class="el-icon-delete2" @click="deleteHandle(item['fileId'], index)"></i></div>
    </div>
    <el-upload
      class="file-upload__btn"
      action="action"
      :show-file-list="false"
      :on-change="uploadHandle"
      :auto-upload="false">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'file-upload',
  props: {
    applyId: [String, Number],
    files: Array,
    imgUrl: String,
    materialType: Number
  },
  data () {
    return {
      reader: new FileReader()
    }
  },
  methods: {
    // 上传处理
    uploadHandle (file, fileList) {
      let _this = this
      this.reader.readAsDataURL(file.raw)
      this.reader.onload = function (e) {
        _this.$ajax({
          url: '/store/account/work/waitDeal/uploadImage',
          data: {
            applyId: _this.applyId,
            materialType: _this.materialType,
            imgFile: this.result
          },
          success: data => {
            let attr = data.attr || {}
            _this.files.push({
              fileId: attr['fileId'],
              path: attr['path'],
              fileName: attr['fileName']
            })
            _this.$emit('fileChange', 'add')
          }
        })
      }
    },
    deleteHandle (fileId, index) {
      this.$ajax({
        url: '/store/account/work/waitDeal/deleteImage',
        data: {
          fileId
        },
        success: data => {
          this.files.splice(index, 1)
          this.$emit('fileChange', 'del')
        }
      })
    }
  }
}
</script>
