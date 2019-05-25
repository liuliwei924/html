<template>
  <el-dialog class="edit-dialog" title="编辑竞拍物品" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="库存ID"
        prop="inventoryId"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.inventoryId"></el-input>
      </el-form-item>
      <el-form-item
        label="物品名称"
        prop="auctionName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.auctionName"></el-input>
      </el-form-item>
      <el-form-item label="物品图片" class="gradeImg-uploader">
        <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="imgUrlHandle" :auto-upload="false">
          <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="详情图片" class="gradeImg-uploader">
        <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="detailImgUrlHandle" :auto-upload="false">
          <img v-if="form.detailImgUrl" :src="form.detailImgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="竞拍数量"
        prop="auctionNum"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.auctionNum"></el-input>
      </el-form-item>
      <el-form-item
        label="起拍价"
        prop="startPrice"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.startPrice"></el-input>
      </el-form-item>
      <el-form-item
        label="单位"
        prop="auctionUnit"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.auctionUnit"  placeholder="请选择单位">
          <el-option
            v-for="val,key,index in auctionUnit"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="最多加价"
        prop="risesRange"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.risesRange"></el-input>
      </el-form-item>
      <el-form-item
        label="可出价次数"
        prop="maxOfferCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.maxOfferCount"></el-input>
      </el-form-item>
      <el-form-item
        label="预热小时数"
        prop="preheatHour"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.preheatHour"></el-input>
      </el-form-item>
      <el-form-item
        label="竞拍开始时间"
        prop="startTime" :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          editable
          @change="thawChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="竞拍持续小时数"
        prop="continuedHour"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.continuedHour"></el-input>
      </el-form-item>
      <el-form-item
        label="竞拍状态"
        prop="auctionStatus"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.auctionStatus"  placeholder="请选择状态">
          <el-option
            v-for="val,key,index in auctionStatus"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="物品状态"
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
        label="参与次数"
        prop="auctionCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.auctionCount"></el-input>
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
        auctionId: '',
        auctionName: '',
        imgUrl: '',
        detailImgUrl: '',
        auctionNum: '',
        startPrice: '',
        auctionUnit: '',
        risesRange: '',
        maxOfferCount: '',
        preheatHour: '',
        startTime: '',
        continuedHour: '',
        auctionStatus: '',
        status: '',
        auctionCount: '',
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
        auctionId: obj['auctionId'] || '',
        auctionName: obj['auctionName'] || '',
        inventoryId: obj['inventoryId'] || '',
        imgUrl: obj['imgUrl'] || '',
        detailImgUrl: obj['detailImgUrl'] || '',
        auctionNum: obj['auctionNum'] + '' || 0,
        startPrice: obj['startPrice'] + '' || 0,
        auctionUnit: obj['auctionUnit'] || 0,
        risesRange: obj['risesRange'] + '' || 0,
        maxOfferCount: obj['maxOfferCount'] + '' || 0,
        preheatHour: obj['preheatHour'] + '' || 0,
        startTime: obj['startTime'] || '',
        continuedHour: obj['continuedHour'] + '' || 0,
        auctionStatus: obj['auctionStatus'] || 0,
        status: obj['status'] || 0,
        auctionCount: obj['auctionCount'] + '' || 0
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
            url: '/store/account/xj/xjAuctionCfg/editAuctionInfo',
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
