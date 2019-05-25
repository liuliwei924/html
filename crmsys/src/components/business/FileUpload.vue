<template>
  <div class="file-upload__info clearfix">
    <div class="file-upload__img fl" v-for="item,index in files" :key="index">
      <img :src="`${imgUrl}${item.path}${item.fileName}`">
      <div v-if="type === 'edit'" class="file-img__mark"><i class="el-icon-delete2" @click="deleteHandle(item['fileId'], index)"></i></div>
    </div>
    <div v-if="files.length === 0 && type === 'doc'" class="file-img__null">暂无数据</div>
    <el-upload
      class="file-upload__btn"
      action="action"
      :show-file-list="false"
      :on-change="uploadHandle"
      :auto-upload="false"
      v-if="type === 'edit'">
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
    let type = this.$route.query.type
    return {
      type,
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
          url: '/crmsys/account/busi/enterInfo/uploadImage',
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
        url: '/crmsys/account/busi/enterInfo/deleteImage',
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
