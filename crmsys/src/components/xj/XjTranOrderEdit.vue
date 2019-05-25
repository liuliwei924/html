<template>
  <el-dialog class="edit-dialog" title="编辑订单信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="订单状态"
        prop="tranStatus"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.tranStatus"  placeholder="请选择订单状态">
          <el-option
            v-for="val,key,index in tranStatus"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark" :rules="{required: false, message: '备注不能为空'}">
        <el-input v-model="form.remark" type="textarea" :rows="10" placeholder="请输入备注"></el-input>
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
  name: 'xjTranOrder-edit',
  props: {
    value: Boolean,
    custData: Object,
    tranStatus: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        orderId: '',
        remark: '',
        tranStatus: ''
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
        tranStatus: obj['tranStatus'] || 0
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
            url: '/store/account/xj/xjTranOrder/updateOrder',
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
