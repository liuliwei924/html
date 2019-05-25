<template>
  <el-dialog class="edit-dialog" title="物流管理" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="收货人"
        prop="realname"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.realname"></el-input>
      </el-form-item>
      <el-form-item
        label="联系电话"
        prop="telphone"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.telphone"></el-input>
      </el-form-item>
      <el-form-item
        label="物流状态"
        prop="logisticsStatus"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.logisticsStatus"  placeholder="请选择状态">
          <el-option
            v-for="val,key,index in logisticsStatus"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="收货地址"
        prop="custAddress">
        <el-input v-model="form.custAddress"></el-input>
      </el-form-item>
      <el-form-item
        label="快递单号"
        prop="expressNo">
        <el-input v-model="form.expressNo"></el-input>
      </el-form-item>
      <el-form-item
        label="物流公司"
        prop="logisticsName">
        <el-input v-model="form.logisticsName"></el-input>
      </el-form-item>
      <el-form-item label="物流费" prop="logisticsFee">
        <el-input v-model="form.logisticsFee"></el-input>
      </el-form-item>
      <el-form-item
        label="审核描述"
        prop="checkDesc">
        <el-input v-model="form.checkDesc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark">
        <el-input v-model="form.remark" type="textarea"></el-input>
      </el-form-item>
      <el-form-item
        label="审核人"
        prop="checkBy">
        <el-input v-model="form.checkBy" disabled></el-input>
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
  name: 'xjAuction-Edit',
  props: {
    value: Boolean,
    logisticsStatus: Object,
    custData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        orderId: '',
        customerId: '',
        realname: '',
        telphone: '',
        custAddress: '',
        logisticsStatus: '',
        expressNo: '',
        logisticsName: '',
        logisticsFee: '',
        checkDesc: '',
        remark: '',
        auctionName: '',
        auctionId: '',
        ownId: '',
        inventoryId: ''
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
        orderId: obj['orderId'] || '',
        inventoryId: obj['inventoryId'] || '',
        realname: obj['realname'] || '',
        telphone: obj['telphone'] || '',
        custAddress: obj['custAddress'] || '',
        logisticsStatus: obj['logisticsStatus'] || '',
        expressNo: obj['expressNo'] || '',
        logisticsName: obj['logisticsName'] || '',
        logisticsFee: obj['logisticsFee'] || '',
        checkDesc: obj['checkDesc'] || '',
        remark: obj['remark'] || '',
        checkBy: obj['checkBy'] || '',
        customerId: obj['customerId'] || '',
        auctionName: obj['auctionName'] || '',
        auctionId: obj['auctionId'] || '',
        ownId: obj['ownId'] || ''
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
      this.form.startTime = date
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/xj/xjAuction/updateAuctionOrder',
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