<template>
  <el-dialog class="edit-dialog" title="编辑用户地址" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="显示名" prop="nickName" :rules="{required: false, message: '显示名不能为空'}">
        <el-input v-model="form.nickName" disabled placeholder="请输入显示名称"></el-input>
      </el-form-item>
      <el-form-item label="收件人姓名" prop="realname" :rules="{required: false, message: '收件人不能为空'}">
        <el-input v-model="form.realname" disabled placeholder="请输入收件人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="telphone" :rules="{required: true, message: '联系电话不能为空'}">
        <el-input v-model="form.telphone" placeholder="请输入收件人"></el-input>
      </el-form-item>
      <!-- <el-form-item
        label="配置群"
        prop="configId"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.configId"  placeholder="请选择类型">
          <el-option
            v-for="val,key,index in allAreaInfo"
            :label="val.qunName"
            :value="Number(val.configId)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否默认地址:">
          <el-select
            v-model="form.isDefaultAddress"
            clearable
            disabled
            placeholder="请选择类型">
            <el-option
              v-for="val,key,index in isDefaultAddress"
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
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'xjJoinGroup-audit',
  props: {
    value: Boolean,
    custData: Object,
    isDefaultAddress: Object,
    allAreaInfo: Array
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        addressId: '',
        customerId: '',
        isDefaultAddress: '',
        telphone: ''
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
        joinId: obj['addressId'] || '',
        customerId: obj['customerId'] || '',
        nickName: obj['nickName'] || '',
        realname: obj['realname'] || '',
        telphone: obj['telphone1'] || '',
        isDefaultAddress: obj['isDefaultAddress'] || 0
      }
    },
    allAreaInfo (arr) {
      this.first = true
      this.allAreaInfo = arr
    }
  },
  methods: {
    // 海报图放大处理
    alertBigImg (url) {
      this.bigImgUrl = url
      this.isBigImg = true
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
            url: '/store/account/xj/xjJoinGroup/auditJoinGroupInfo',
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
