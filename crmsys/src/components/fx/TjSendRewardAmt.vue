<template>
  <el-dialog class="edit-dialog" title="佣金发放" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="交易状态" class="gradeImg-uploader" required>
        <el-form-item class="el-col" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button :label="1">确认发放</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
  name: 'tj-send-reward-amt',
  props: {
    value: Boolean,
    withdrawIds: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        status: 1
      },
      withdrawIdArr: []
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    withdrawIds (data) {
      this.withdrawIds = data
    }
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      let params = this.form
      let withdrawIds = ''
      for (let i = 0; i < this.withdrawIds.length; i++) {
        withdrawIds += this.withdrawIds[i] + ','
      }
      params.withdrawIds = withdrawIds
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/tjWithdrawtList/tjSendReward',
            data: params,
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
