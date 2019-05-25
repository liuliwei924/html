<template>
  <el-dialog class="edit-dialog" title="提现审核" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="提现状态"
        prop="status"
        :rules="{type: 'number', required: true, message: '佣金状态不能为空', trigger: 'change'}">
        <el-select
          v-model.number="form.status"
          placeholder="请选择">
          <el-option
            v-for="val,key,index in status"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="审核描述"
        prop="auditDesc"
        :rules="{required: true, message: '审核描述不能为空'}">
        <el-input
          type="textarea"
          :maxlength="100"
          v-model.trim="form.auditDesc">
        </el-input>
      </el-form-item>
      <p style="float: right;padding-right: 100px;">剩余字数：{{100 - form.auditDesc.length}}</p>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'wzWithdraw-audit',
  props: {
    value: Boolean,
    commIds: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        status: 4,
        auditDesc: '',
        commIds: ''
      },
      // 提现状态
      status: {
        4: '提现成功',
        5: '发放失败'
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
            url: '/store/account/wz/wzWithdraw/checkWithdraw',
            data: {
              str: JSON.stringify({commIds: this.commIds}),
              status: this.form.status,
              auditDesc: this.form.auditDesc
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
