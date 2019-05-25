<template>
  <el-dialog class="edit-dialog" title="添加库存信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="物品名称"
        prop="auctionName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.auctionName"></el-input>
      </el-form-item>
      <el-form-item
        label="采购数量"
        prop="number"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item
        label="采购价格"
        prop="price"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item
        label="采购时间"
        prop="purchaseTime">
        <el-date-picker
          v-model="form.purchaseTime"
          type="datetime"
          editable
          @change="thawChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="收货时间"
        prop="deliveryTime">
        <el-date-picker
          v-model="form.deliveryTime"
          type="datetime"
          editable
          @change="thawChange2"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark">
        <el-input v-model="form.remark"></el-input>
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
  name: 'xjAuction-add',
  props: {
    value: Boolean,
    status: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        auctionName: '',
        purchaseTime: '',
        deliveryTime: ''
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
    // 项目图标处理
    imgUrlHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'xjAuctionImg',
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
          fileType: 'xjAuctionImg',
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
    // 时间改变赋值
    thawChange (date) {
      this.form.purchaseTime = date
    },
    thawChange2 (date) {
      this.form.deliveryTime = date
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/xj/xjAuctionInventory/addInventoryInfo',
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