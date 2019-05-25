<template>
  <el-dialog class="edit-dialog" title="审核领取信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="领取状态"
        prop="updateStatus"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.updateStatus"  placeholder="请选择状态">
          <el-option
            v-for="val,key,index in status"
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
  name: 'wzRawardRecord-edit',
  props: {
    value: Boolean,
    commIds: Array,
    status: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        commIds: Array,
        updateStatus: ''
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
    commIds (val) {
      this.form.commIds = JSON.stringify(val)
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
            url: '/store/account/wz/wzRewardRecord/checkRewardStatus',
            data: {
              str: JSON.stringify({commIds: this.commIds}),
              updateStatus: this.form.updateStatus
            },
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
