<template>
  <el-dialog
    class="edit-dialog"
    title="转门店"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="门店:"
        :rules="{required: true, message: '门店不能为空'}">
        <el-select
          v-model="form.orgId"
          filterable
          placeholder="请选择门店">
          <el-option
            v-for="item,index in userOrgs"
            :label="item.orgNo + '-' + item.orgName"
            :value="item.orgId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 转信贷经理子组件
export default {
  name: 'transfer-org',
  props: {
    value: Boolean,
    userOrgs: Array,
    orders: Array
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        orgId: '',
        orders: ''
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
    orders (val) {
      this.form.orders = JSON.stringify(val)
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
            url: '/store/account/work/againAllotPond/checkTransOrg',
            data: {
              str: JSON.stringify({orders: this.orders}),
              orgId: this.form.orgId
            },
            loading: true,
            success: data => {
              this.$message(data.message)
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
