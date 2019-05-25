<template>
  <el-dialog class="edit-dialog" title="处理投诉" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="处理状态"
        prop="complainStatus"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.complainStatus"  placeholder="请选择状态">
          <el-option
            v-for="val,key,index in complainStatus"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回复内容" prop="context" :rules="{required: true, message: '回复内容不能为空'}">
        <el-input v-model="form.context" type="textarea" :rows="10" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="tranStatus" :rules="{required: false, message: '订单状态不能为空', trigger: 'blur'}">
        <el-select v-model="form.tranStatus" clearable placeholder="订单状态">
          <el-option label="申诉中" value="0"></el-option>
          <el-option label="已付款" value="1"></el-option>
          <el-option label="取消订单" value="4"></el-option>
          <el-option label="完成交易" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处罚类型" prop="punishType" :rules="{required: false, message: '处罚类型不能为空', trigger: 'blur'}">
        <el-select v-model="form.punishType" clearable placeholder="处罚类型">
          <el-option label="无" value="0"></el-option>
          <el-option label="禁止申诉人交易7天" value="1"></el-option>
          <el-option label="禁止应诉人交易7天" value="2"></el-option>
        </el-select>
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
  name: 'xjTranPlain-edit',
  props: {
    value: Boolean,
    custData: Object,
    complainStatus: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        complainId: '',
        orderId: '',
        context: '',
        complainStatus: '',
        tranStatus: '',
        punishType: ''
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
        complainId: obj['complainId'] || '',
        orderId: obj['orderId'] || '',
        complainStatus: obj['complainStatus'] || 0,
        context: obj['context'] || ''
      }
    }
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/xj/xjTranPlaint/handlePlain',
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
