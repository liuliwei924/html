<template>
  <el-dialog class="edit-dialog" title="编辑库存信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="物品名称"
        prop="auctionName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.auctionName"></el-input>
      </el-form-item>
      <el-form-item
        label="剩余库存"
        prop="inventory">
        <el-input v-model="form.inventory"></el-input>
      </el-form-item>
      <el-form-item
        label="采购数量"
        prop="number">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item
        label="采购价格"
        prop="price">
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
  name: 'xjChange-edit',
  props: {
    value: Boolean,
    custData: Object,
    status: Object,
    auctionUnit: Object,
    auctionStatus: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        inventoryId: '',
        auctionName: '',
        inventory: '',
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
    },
    // 编辑数据变化
    custData (obj) {
      this.first = true
      this.form = {
        inventoryId: obj['inventoryId'] || '',
        inventory: obj['inventory'] || '',
        auctionName: obj['auctionName'] || '',
        number: obj['number'] || '',
        price: obj['price'] || '',
        purchaseTime: obj['purchaseTime'] || '',
        deliveryTime: obj['deliveryTime'] || '',
        remark: obj['remark'] || ''
      }
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
            url: '/store/account/xj/xjAuctionInventory/editInventoryInfo',
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
