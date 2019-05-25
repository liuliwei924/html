<template>
  <el-dialog class="edit-dialog" title="编辑币价信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="价格"
        prop="coinPrice"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.coinPrice"></el-input>
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
  name: 'xjTranCoin-edit',
  props: {
    value: Boolean,
    custData: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        id: '',
        coinPrice: ''
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
        id: obj['id'] || '',
        coinPrice: obj['coinPrice'] || 0
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
            url: '/store/account/xj/xjTranCoin/updateCoinPrice',
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
