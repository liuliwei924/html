<template>
  <el-dialog class="edit-dialog" title="审核中奖信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="领取状态"
        prop="receiveStatus"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.receiveStatus"  placeholder="请选择状态">
          <el-option
            v-for="val,key,index in receiveStatus"
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
  </el-dialog>
</template>

<script>
export default {
  name: 'winPrize-edit',
  props: {
    value: Boolean,
    custData: Object,
    receiveStatus: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        id: '',
        receiveStatus: ''
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
        receiveStatus: obj['receiveStatus'] || 0
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
            url: '/store/account/work/winPrize/checkWinPrize',
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
