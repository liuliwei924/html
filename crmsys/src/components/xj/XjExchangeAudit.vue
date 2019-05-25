<template>
  <el-dialog class="edit-dialog" title="审核换货信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="换货状态"
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
        v-if="form.status === 4 || form.status === 5"
        label="快递单号">
        <el-input v-model="form.expressNo"></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.status === 4 || form.status === 5"
        label="物流公司">
        <el-input v-model="form.logisticsName"></el-input>
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
  name: 'xjExchange-audit',
  props: {
    value: Boolean,
    custData: Object,
    status: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        exchangeId: '',
        orderId: '',
        customerId: '',
        status: ''
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
        exchangeId: obj['exchangeId'] || '',
        orderId: obj['orderId'] || '',
        customerId: obj['customerId'] || '',
        status: obj['status'] || 0
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
      if (this.form.status === 4 || this.form.status === 5) {
        if (!this.form.expressNo) {
          this.$alert('快递单号不能为空')
          return
        }
        if (!this.form.logisticsName) {
          this.$alert('物流公司不能为空')
          return
        }
      }
      this.$ajax({
        url: '/store/account/xj/xjExchange/auditExcGoods',
        data: this.form,
        success: data => {
          this.$emit('change', 'search')
        }
      })
      this.close()
    }
  }
}
</script>
