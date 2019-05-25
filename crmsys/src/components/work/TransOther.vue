<template>
  <el-dialog
    class="edit-dialog"
    title="转信贷经理"
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
          @change="orgChange"
          placeholder="请选择门店">
          <el-option
            v-for="item,index in userOrgs"
            :label="item.orgNo + '-' + item.orgName"
            :value="item.orgId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="门店人员:"
        :rules="{required: true, message: '门店人员不能为空'}">
        <el-select
          v-model="form.customerId"
          filterable
          placeholder="请选择门店人员">
          <el-option
            v-for="item,index in custInfo"
            :label="item.userName"
            :value="item.customerId"
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
  name: 'trans-other',
  props: {
    value: Boolean,
    userOrgs: Array,
    orders: Array,
    invalidListFlag: String,
    excOrderFlag: String
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        orgId: '',
        customerId: '',
        orders: ''
      },
      custInfo: []
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
    // 门店变化监听
    orgChange (val) {
      this.form.customerId = ''
      this.$ajax({
        url: '/store/account/user/comm/getOrgCustList',
        data: {
          orgId: val
        },
        success: data => {
          this.custInfo = data.rows
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        var url = '/store/account/work/allOrder/checkTransOtherXDJL'
        if (this.invalidListFlag) {
          url = '/store/account/work/invalidCustomer/checkTransOtherXDJL'
        }
        if (valid) {
          this.$ajax({
            url: url,
            data: {
              str: JSON.stringify({orders: this.orders}),
              orgId: this.form.orgId,
              customerId: this.form.customerId,
              excOrderFlag: this.excOrderFlag
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
